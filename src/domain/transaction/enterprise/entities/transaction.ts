import { EntityBase } from "src/core/entities/entity-base"
import { UniqueEntityId } from "src/core/entities/unique-entity-id"

export interface TransactionProps {
    id?: UniqueEntityId
    value: number
    payerId: UniqueEntityId
    payeeId: UniqueEntityId
    date: Date
}

export class Transaction extends EntityBase<TransactionProps>{
    static create(
        props: TransactionProps,
        id?: UniqueEntityId
    ) {
        return new Transaction({
            value: props.value,
            payerId: props.payerId,
            payeeId: props.payeeId,
            date: props.date,
        }, id)
    }
}