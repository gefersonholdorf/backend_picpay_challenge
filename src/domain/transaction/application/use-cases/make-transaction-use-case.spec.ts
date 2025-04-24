import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { MakeTransactionUseCase } from "./make-transaction-use-case";
import { UserRepository } from "../repositories/user-repository";
import { ExternalAuthorizationService } from "../services/external-authorization-service";
import { User } from "../../enterprise/entities/user";
import { makeUser } from "test/factories/make-user";
import { InvalidTransactionError } from "src/core/exceptions/errors/invalid-transaction-error";
import { ResourceNotFoundError } from "src/core/exceptions/errors/resource-not-found-error";

describe('Make Transaction [UNIT]', () => {
    let userRepository: Mocked<UserRepository>
    let externalAuthorizationService: Mocked<ExternalAuthorizationService>

    let payer: User
    let payee: User

    let sut: MakeTransactionUseCase

    beforeEach(() => {
        externalAuthorizationService = {
            authorizationTransaction: vi.fn()
        }

        userRepository = {
            create: vi.fn(),
            findById: vi.fn(),
            findByCpf: vi.fn(),
            findByEmail: vi.fn(),
            save: vi.fn(),
            transaction: vi.fn()
        }

        payer = makeUser({}, 1)
        payee = makeUser({
            role: 'LOJISTA'
        }, 1)

        sut = new MakeTransactionUseCase(userRepository, externalAuthorizationService)
    })

    it('should be able to transfer a value from a user to a shopkeeper', async() => {

        userRepository.findById
                            .mockResolvedValueOnce(payer)
                            .mockResolvedValueOnce(payee)
        
        externalAuthorizationService.authorizationTransaction.mockResolvedValue({
            authorized: true,
            message: 'Transaction aproved'
        })
        
        const request = {
            payerId: 1,
            payeeId: 1,
            value: 100.50,
            date: new Date()
        }

        const result = await sut.execute(request)

        expect(result.isRight()).toBe(true)
    })

    it('should not be able to transfer a value from a user to a shopkeeper if the value is negative', async() => {

        userRepository.findById
                            .mockResolvedValueOnce(payer)
                            .mockResolvedValueOnce(payee)
        
        externalAuthorizationService.authorizationTransaction.mockResolvedValue({
            authorized: true,
            message: 'Transaction aproved'
        })
        
        const request = {
            payerId: 1,
            payeeId: 1,
            value: -10.00,
            date: new Date()
        }

        const result = await sut.execute(request)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidTransactionError)
    })

    it('should not be able to transfer an amount if the payer is a shopkeeper', async() => {

        payer = makeUser({
            role:'LOJISTA'
        })

        userRepository.findById
                            .mockResolvedValueOnce(payer)
                            .mockResolvedValueOnce(payee)
        
        externalAuthorizationService.authorizationTransaction.mockResolvedValue({
            authorized: true,
            message: 'Transaction aproved'
        })
        
        const request = {
            payerId: 1,
            payeeId: 1,
            value: 100.00,
            date: new Date()
        }

        const result = await sut.execute(request)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidTransactionError)
    })

    it('should not be able to transfer an amount if the payer has no balance', async() => {

        payer = makeUser({
            role:'COMUM',
            balance: 99.00
        })

        userRepository.findById
                            .mockResolvedValueOnce(payer)
                            .mockResolvedValueOnce(payee)
        
        externalAuthorizationService.authorizationTransaction.mockResolvedValue({
            authorized: true,
            message: 'Transaction aproved'
        })
        
        const request = {
            payerId: 1,
            payeeId: 1,
            value: 100.00,
            date: new Date()
        }

        const result = await sut.execute(request)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidTransactionError)
    })

    it('should not be able to transfer an amount if you do not have external authorization', async() => {

        payer = makeUser({
            role:'COMUM',
            balance: 102.00
        })

        userRepository.findById
                            .mockResolvedValueOnce(payer)
                            .mockResolvedValueOnce(payee)
        
        externalAuthorizationService.authorizationTransaction.mockResolvedValue({
            authorized: false,
            message: 'Not Aproved'
        })
        
        const request = {
            payerId: 1,
            payeeId: 1,
            value: 100.00,
            date: new Date()
        }

        const result = await sut.execute(request)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidTransactionError)
    })

    it('should not be able to transfer an amount if it cannot find a payer or payee', async() => {

        payer = makeUser({
            role:'COMUM',
            balance: 102.00
        })

        userRepository.findById
                            .mockResolvedValueOnce(null)
                            .mockResolvedValueOnce(payee)
        
        externalAuthorizationService.authorizationTransaction.mockResolvedValue({
            authorized: true,
            message: 'Transaction Aproved'
        })
        
        const request = {
            payerId: 1,
            payeeId: 1,
            value: 100.00,
            date: new Date()
        }

        const result = await sut.execute(request)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
}) 
    
    
