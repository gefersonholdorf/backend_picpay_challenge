import { UserRepository } from "src/domain/transaction/application/repositories/user-repository";
import { Transaction } from "src/domain/transaction/enterprise/entities/transaction";
import { User } from "src/domain/transaction/enterprise/entities/user";
import { PrismaService } from "../prisma.service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaTransactionMapper } from "../mappers/prisma-transaction-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository implements UserRepository{
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async create(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!user) {
            return null
        }

        return PrismaUserMapper.toDomain(user)
    }

    async findByCpf(cpf: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                cpf
            }
        })

        if(!user) {
            return null
        }

        return PrismaUserMapper.toDomain(user)
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            return null
        }

        return PrismaUserMapper.toDomain(user)
    }

    async save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async transaction(transaction: Transaction): Promise<void> {
        const payerId = transaction.payer.id!.value
        const payeeId = transaction.payee.id!.value

        const payer = PrismaUserMapper.toPrisma(transaction.payer)
        const payee = PrismaUserMapper.toPrisma(transaction.payee)

        await this.prisma.$transaction(async(tx) => {
            await tx.user.update({
                data: payer,
                where: {
                    id: payerId
                }
            })

            await tx.user.update({
                data: payee,
                where: {
                    id: payeeId
                }
            })

            const dataTransaction = PrismaTransactionMapper.toPrisma(transaction)

            await tx.transaction.create({
                data: dataTransaction
            })
        })
    }
}