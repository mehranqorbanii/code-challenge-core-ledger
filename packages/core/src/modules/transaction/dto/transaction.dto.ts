import { z } from "zod";

export interface TransactionDTO {
    id: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    fee: number;
    description: string;
    createdAt: string;
}

export enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}


export const TransactionDTOSchema = z.object({
    accountId: z.string({ message: "Invalid UUID format for accountId." }),
    type: z.enum(["deposit", "withdraw"], { message: "Type must be either 'deposit' or 'withdraw'." }),
    amount: z.number().positive({ message: "Amount must be a positive number." })
});
