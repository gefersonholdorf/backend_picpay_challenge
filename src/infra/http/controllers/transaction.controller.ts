import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UnprocessableEntityException } from "@nestjs/common";
import { InvalidTransactionError } from "src/core/exceptions/errors/invalid-transaction-error";
import { ResourceNotFoundError } from "src/core/exceptions/errors/resource-not-found-error";
import { MakeTransactionUseCase } from "src/domain/transaction/application/use-cases/make-transaction-use-case";
import { z } from "zod";

const transactionSchema = z.object({
    value: z.coerce.number(),
    payerId: z.coerce.number(),
    payeeId: z.coerce.number() 
})

export type TransactionSchema = z.infer<typeof transactionSchema>

@Controller('/transaction')
export class TransactionController{ 
    constructor(
        private readonly makeTransactionUseCase: MakeTransactionUseCase
    ) {}

    @Post()
    @HttpCode(200)
    async handle(@Body() data: TransactionSchema) {
        const {value, payerId, payeeId} = data

        const result = await this.makeTransactionUseCase.execute({
            value, payerId, payeeId
        })

        if(result.isLeft()) {
            if(result.value instanceof ResourceNotFoundError) {
                throw new NotFoundException()
            }

            if (result.value instanceof InvalidTransactionError) {
                throw new UnprocessableEntityException(result.value.message)
            }

            throw new BadRequestException()
        }
    }
}