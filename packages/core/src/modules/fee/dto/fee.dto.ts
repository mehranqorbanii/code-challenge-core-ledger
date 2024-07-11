import {z} from "zod";

export interface FeeDTO {
    id: string;
    currency: string;
    type: FeeType
    unit: string;
    amount: number;
}

export enum FeeType {
    FIXED = "fixed",
    PERCENTAGE = "percentage",
}

export const FeeDTOSchema = z.object({
    currency: z.string().min(1, {message: "Currency cannot be empty."}),
    type: z.string().min(1, {message: "types cannot be empty."}),
    unit: z.string().min(1, {message: "Unit cannot be empty."}),
    amount: z.number().positive({message: "Amount must be a positive number."}),
});
