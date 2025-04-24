import { EntityBase } from "src/core/entities/entity-base"
import { UniqueEntityId } from "src/core/entities/unique-entity-id"
import { User } from "./user"

export interface TransactionProps {
    id?: UniqueEntityId
    value: number
    payer: User
    payee: User
    date: Date
}

export class Transaction extends EntityBase<TransactionProps>{
    static create(
        props: TransactionProps,
        id?: UniqueEntityId
    ) {
        return new Transaction({
            value: props.value,
            payer: props.payer,
            payee: props.payee,
            date: props.date,
        }, id)
    }
}