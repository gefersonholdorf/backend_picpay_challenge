import { Either, left, right } from "src/core/exceptions/either"
import { InvalidTransactionError } from "src/core/exceptions/errors/invalid-transaction-error"
import { ResourceNotFoundError } from "src/core/exceptions/errors/resource-not-found-error"
import { UserRepository } from "../repositories/user-repository"
import { ExternalAuthorizationService } from "../services/external-authorization-service"
import { Transaction } from "../../enterprise/entities/transaction"
import { Injectable } from "@nestjs/common"

export interface MakeTransactionUseCaseRequest {
    payerId: number
    payeeId: number
    value: number
    date?: Date
}

export type MakeTransactionUseCaseResponse = Either<ResourceNotFoundError | InvalidTransactionError, {}>

@Injectable()
export class MakeTransactionUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly externalAuthorizationService: ExternalAuthorizationService
    ) {}

    async execute(data: MakeTransactionUseCaseRequest): Promise<MakeTransactionUseCaseResponse> {

        const {payerId, payeeId, value, date} = data

        const payer = await this.userRepository.findById(payerId)

        if(!payer) {
            return left(new ResourceNotFoundError())
        }

        const payee = await this.userRepository.findById(payeeId)

        if(!payee) {
            return left(new ResourceNotFoundError())
        }

        try {

            payer.sendTransaction(value)
            payee.receiveTransaction(value)

            const transaction = Transaction.create({
                value, payer, payee, date
            })

            const resultAuthorization = await this.externalAuthorizationService.authorizationTransaction(transaction)

            if(!resultAuthorization.authorized) {
                throw new Error('Unauthorized transaction')
            }

            await this.userRepository.transaction(transaction)

        } catch (error) {
            if(error instanceof Error) {
                return left(new InvalidTransactionError(error.message))
            }

            return left(new InvalidTransactionError('Invalid Transactional Error'))
        }

        return right({})
    }
}