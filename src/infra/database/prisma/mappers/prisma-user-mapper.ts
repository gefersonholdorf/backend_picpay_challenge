import { User as PrismaUser, type Prisma} from "generated/prisma";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { User } from "src/domain/transaction/enterprise/entities/user";

export class PrismaUserMapper{
    static toDomain(prismaUser: PrismaUser): User {
        return User.create({
            name: prismaUser.name,
            email: prismaUser.email,
            cpf: prismaUser.cpf,
            password: prismaUser.password,
            role: prismaUser.role,
            balance: prismaUser.balance.toNumber()
        }, new UniqueEntityId(prismaUser.id))
    }

    static toPrisma(user: User): Prisma.UserCreateManyInput {
        return {
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            password: user.password,
            role: user.role,
            balance: user.balance
        }
    }
}