import { Transaction } from "../../enterprise/entities/transaction";

export interface AuthorizationTransactionResponse {
    authorized: boolean,
    message: string
}

export abstract class ExternalAuthorizationService {
 abstract authorizationTransaction(transaction: Transaction): Promise<AuthorizationTransactionResponse>
}