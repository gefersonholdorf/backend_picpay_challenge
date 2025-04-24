import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { User, type UserProps } from "src/domain/transaction/enterprise/entities/user";

export function makeUser(
    props: Partial<UserProps>,
    id?: number
) {
    return User.create({
        name: props.name ?? 'Junior Almeida',
        cpf: props.cpf ?? '23452387934',
        email: props.email ?? 'junior@gmail.com',
        password: props.password ?? 'senha123',
        role: props.role ?? 'COMUM',
        balance: props.balance ?? 500.00
    }, new UniqueEntityId(id) ?? new UniqueEntityId())
}