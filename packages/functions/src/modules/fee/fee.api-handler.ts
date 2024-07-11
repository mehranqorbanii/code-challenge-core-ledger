import {ApiHandler, usePathParams} from "sst/node/api";
import {FeeManager} from "@coding-challenge-core-ledger/core/modules/fee/managers/fee.manager";
import {FeeDTOSchema} from "@coding-challenge-core-ledger/core/modules/fee/dto/fee.dto";
import {toFee, toFeeDTO} from "@coding-challenge-core-ledger/core/modules/fee/mapper/fee.mapper";
import * as console from "node:console";

export const create = ApiHandler(async (_evt) => {
    if (!_evt.body) return {statusCode: 400, body: "Invalid request"};
    try {
        const body = JSON.parse(_evt.body);
        FeeDTOSchema.parse(body);

        const item = await FeeManager.create(toFee(body));
        return {
            statusCode: 200,
            body: JSON.stringify(toFeeDTO(item)),
        };
    } catch (e) {
        if (e.errors) {
            return {statusCode: 400, body: JSON.stringify(e.errors)};
        }
        return {statusCode: 422, body: e.message || "An error occurred"};
    }
});

export const list = ApiHandler(async (_evt) => {
    const fees = await FeeManager.list();
    return {
        statusCode: 200,
        body: JSON.stringify(fees.map(value => toFeeDTO(value))),
    };
});

export const remove = ApiHandler(async (_evt) => {
    const params = usePathParams();
    if (!params.id) return {statusCode: 400, body: "Fee ID is required"};

    try {
        await FeeManager.delete(params.id);
        return {
            statusCode: 200,
            body: "Fee deleted successfully",
        };
    } catch (e) {
        if (e.errors) {
            return {statusCode: 400, body: JSON.stringify(e.errors)};
        }
        return {statusCode: 422, body: e.message || "An error occurred"};
    }
});
