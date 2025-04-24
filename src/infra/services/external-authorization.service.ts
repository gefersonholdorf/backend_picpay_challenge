import { Injectable } from "@nestjs/common";
import { AuthorizationTransactionResponse, ExternalAuthorizationService } from "src/domain/transaction/application/services/external-authorization-service";
import { Transaction } from "src/domain/transaction/enterprise/entities/transaction";

@Injectable()
export class ExternalAuthorizationPayment implements ExternalAuthorizationService {

    async authorizationTransaction(transaction: Transaction): Promise<AuthorizationTransactionResponse> {
        return {
            authorized: true,
            message: 'OK'
        }
    }

}