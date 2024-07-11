import {ApiHandler, usePathParams} from "sst/node/api";
import {AccountManager} from "@coding-challenge-core-ledger/core/modules/account/managers/account.manager";
import {AccountDTO, AccountDTOSchema} from "@coding-challenge-core-ledger/core/modules/account/dto/account.dto";
import {toAccount, toAccountDTO} from "@coding-challenge-core-ledger/core/modules/account/mapper/account.mapper";

// NOTE: it's much better to introduce DTO for the API and have a mapping layer.
// this way the db models are decoupled from the request/response and not exposed to outside world.
// also we can have domain models, to decouple repo,from application,layer, but for the sake of simplicity avoided.
export const create = ApiHandler(async (_evt) => {
    const params = usePathParams();
    if (!params.id) {
        return {statusCode: 400, body: "Missing userId in request body"};
    }
    if (!_evt.body) return {statusCode: 400, body: "Invalid request"};
    try {
        const body = JSON.parse(_evt.body) as AccountDTO;
        AccountDTOSchema.parse(body);
        const item = await AccountManager.create(toAccount(params.id, body));
        return {
            statusCode: 200,
            body: JSON.stringify(toAccountDTO(item)),
        };
    } catch (e: any) {
        if (e.errors) {
            return {statusCode: 400, body: JSON.stringify(e.errors)};
        }
        return {statusCode: 422, body: e.message || "An error occurred"};
    }
});

export const list = ApiHandler(async (_evt) => {
    const params = usePathParams();
    if (!params.id) return {statusCode: 400, body: "User ID is required"};
    // NOTE: lists can have pagination, to keep it simple not implemented.
    const userId = params.id;
    const accounts = await AccountManager.getByUserId(userId);
    return {
        statusCode: 200,
        body: JSON.stringify(accounts.map(value => toAccountDTO(value))),
    };
});

