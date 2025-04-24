import { Transaction as PrismaTransaction, type Prisma} from "generated/prisma";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Transaction } from "src/domain/transaction/enterprise/entities/transaction";
import { User } from "src/domain/transaction/enterprise/entities/user";

export class PrismaTransactionMapper{
    // static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    //     return Transaction.create({
    //         value: prismaTransaction.value.toNumber(),
    //         payerId: prismaTransaction.payeeId
    //         payeeId: prismaTransaction.payee.id.value
    //     }, new UniqueEntityId(prismaTransaction.id))
    // }

    static toPrisma(transaction: Transaction): Prisma.TransactionCreateManyInput {
        return {
            value: transaction.value,
            payerId: transaction.payer.id.value,
            payeeId: transaction.payee.id.value
        }
    }
}