import {UserManager} from "@coding-challenge-core-ledger/core/modules/user";
import {ApiHandler, usePathParams} from "sst/node/api";
import {UserDTOSchema} from "@coding-challenge-core-ledger/core/modules/user/dtos/user.dto";
import {toUser, toUserDTO} from "@coding-challenge-core-ledger/core/modules/user/mapper/user.mapper";

export const get = ApiHandler(async (_evt) => {
    const params = usePathParams();
    if (!params.id) return {statusCode: 400};
    try {
        const user = await UserManager.get(params.id);
        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
    } catch (error) {
        return {
            statusCode: 422,
            body: JSON.stringify(error.message),
        };
    }
});

export const create = ApiHandler(async (_evt) => {
    if (!_evt.body) return {statusCode: 400, body: "Invalid request"};
    try {
        const body = JSON.parse(_evt.body);
        UserDTOSchema.parse(body);

        const item = await UserManager.create(toUser(body));
        return {
            statusCode: 200,
            body: JSON.stringify(toUserDTO(item)),
        };
    } catch (e) {
        if (e.errors) {
            return {statusCode: 400, body: JSON.stringify(e.errors)};
        }
        return {statusCode: 422, body: e.message || "An error occurred"};
    }
});
