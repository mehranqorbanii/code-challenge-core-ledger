import {Fee} from "../models";
import {FeeDTO, FeeType} from "../dto/fee.dto";

export function toFeeDTO(fee: Fee): FeeDTO {
    return {
        id: fee.id,
        currency: fee.currency,
        unit: fee.unit,
        amount: Number(fee.amount),
        type: fee.type == "fixed" ? FeeType.FIXED : FeeType.PERCENTAGE
    } as FeeDTO;
}

export function toFee(feeDTO: FeeDTO): Fee {
    return {
        currency: feeDTO.currency,
        unit: feeDTO.unit,
        amount: feeDTO.amount.toString(),
        type: feeDTO.type.toString()
    } as Fee;
}