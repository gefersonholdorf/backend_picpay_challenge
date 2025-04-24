export class InvalidTransactionError extends Error {
    constructor(message: string) {
        super(message)
    }
}