import { Module } from "@nestjs/common";
import { TransactionController } from "./controllers/transaction.controller";
import { MakeTransactionUseCase } from "src/domain/transaction/application/use-cases/make-transaction-use-case";
import { DatabaseModule } from "../database/database.module";
import { ServicesModule } from "../services/services.module";

@Module({
    imports: [
        DatabaseModule, ServicesModule
    ],
    controllers: [
        TransactionController
    ],
    providers: [
        MakeTransactionUseCase
    ]
})
export class HttpModule{}