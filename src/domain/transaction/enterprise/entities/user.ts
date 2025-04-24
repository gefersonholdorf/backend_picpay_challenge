import { EntityBase } from "src/core/entities/entity-base"
import { UniqueEntityId } from "src/core/entities/unique-entity-id"

export type RoleUser = 'COMUM' | 'LOJISTA'

export interface UserProps {
    id?: UniqueEntityId
    name: string
    email: string
    cpf: string
    password: string
    balance: number
    role: RoleUser
}

export class User extends EntityBase<UserProps> {

    get role() {
        return this.props.role
    }

    get name() {
        return this.props.name
    }

    get email() {
        return this.props.email
    }

    get password() {
        return this.props.password
    }

    get cpf() {
        return this.props.cpf
    }


    get balance() {
        return this.props.balance
    }

    sendTransaction(value: number) {
        const isValuePositive = this.checkIfTheValueIsPositive(value)

        if(!isValuePositive) {
            throw new Error('Value must be positive.')
        }

        const hasABalance = this.checkIfHasABalance(value)

        if(!hasABalance) {
            throw new Error('Balance insuficient.')
        }

        const isUserCommon = this.checkIfThePayeIsNotShopkeeper(this.role)

        if(!isUserCommon) {
            throw new Error('Shopkeepers cannot send transactions.')
        }

        this.props.balance -= value 
    }

    receiveTransaction(value: number) {
        const isValuePositive = this.checkIfTheValueIsPositive(value)

        if(!isValuePositive) {
            throw new Error('Value must be positive.')
        }

        this.props.balance += value
    }

    checkIfThePayeIsNotShopkeeper(role: RoleUser): boolean {
        return role === 'COMUM'
    }

    checkIfTheValueIsPositive(value: number): boolean {
        return value > 0
    }

    checkIfHasABalance(value: number): boolean {
        return this.balance > value
    }

    static create(
        props: UserProps,
        id?: UniqueEntityId
    ){
        return new User({
            name: props.name,
            email: props.email,
            cpf: props.cpf,
            password: props.password,
            balance: props.balance,
            role: props.role
        }, id)
    }
}