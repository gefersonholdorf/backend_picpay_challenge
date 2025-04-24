import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { MakeTransactionUseCase } from "./make-transaction-use-case";
import { UserRepository } from "../repositories/user-repository";
import { ExternalAuthorizationService } from "../services/external-authorization-service";
import { User } from "../../enterprise/entities/user";
import { makeUser } from "test/factories/make-user";

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
}) 
    
    
