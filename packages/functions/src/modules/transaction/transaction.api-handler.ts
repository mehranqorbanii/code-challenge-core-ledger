import {ApiHandler, usePathParams, useJsonBody} from "sst/node/api";
import {TransactionManager} from "@coding-challenge-core-ledger/core/modules/transaction/managers/transaction.manager";
import {
    TransactionDTO,
    TransactionDTOSchema
} from "@coding-challenge-core-ledger/core/modules/transaction/dto/transaction.dto";
import {toTransactionDTO} from "@coding-challenge-core-ledger/core/modules/transaction/mapper/transaction.mapper";
import * as console from "node:console";

export const get = ApiHandler(async (_evt) => {
    const params = usePathParams();
    if (!params.id) return {statusCode: 400, body: "User ID is required"};

    const transactions = await TransactionManager.list(params.id);
    return {
        statusCode: 200,
        body: JSON.stringify(transactions),
    };
});

export const create = ApiHandler(async (_evt) => {
    if (!_evt.body) return {statusCode: 400, body: "Invalid request"};
    try {
        const body = JSON.parse(_evt.body) as TransactionDTO;
        TransactionDTOSchema.parse(body);
        const item = await TransactionManager.makeTransaction(body.accountId, body.type, body.amount);
        return {
            statusCode: 200,
            body: JSON.stringify(toTransactionDTO(item)),
        };
    } catch (e) {
        console.log("here is the error" + e.message)
        if (e.errors) {
            return {statusCode: 400, body: JSON.stringify(e.errors)};
        }
        return {statusCode: 422, body: e.message || "An error occurred"};
    }
});

export const report = ApiHandler(async (_evt) => {
    const report = await TransactionManager.generateDailyReport();
    return {
        statusCode: 200,
        body: JSON.stringify(report),
    };
});
