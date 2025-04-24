import { Module } from "@nestjs/common";
import { ExternalAuthorizationService } from "src/domain/transaction/application/services/external-authorization-service";
import { ExternalAuthorizationPayment } from "./external-authorization.service";

@Module({
    providers: [
        {
            provide: ExternalAuthorizationService,
            useClass: ExternalAuthorizationPayment
        }
    ],
    exports: [
        ExternalAuthorizationService
    ]
})
export class ServicesModule{}