import {AccountDTO} from "../dto/account.dto";
import {Account, accounts} from "../models";
import {InferInsertModel} from "drizzle-orm";

export function toAccountDTO(account: InferInsertModel<typeof accounts>): AccountDTO {
    return {
        id: account.id,
        userId: account.userId,
        currency: account.currency,
        balance: Number(account.balance),
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
    } as AccountDTO;
}

export function toAccount(userId: string,accountDTO: AccountDTO): Account {
    return {
        userId: userId,
        currency: accountDTO.currency,
        balance : "0"
    } as Account;
}
