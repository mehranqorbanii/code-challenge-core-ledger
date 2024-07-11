import {Transaction} from "../models";
import {TransactionDTO, TransactionType} from "../dto/transaction.dto";

export function toTransactionDTO(transaction: Transaction): TransactionDTO {
    return {
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type == "credit" ? TransactionType.DEPOSIT : TransactionType.WITHDRAW,
        amount: Number(transaction.amount),
        fee: Number(transaction.fee),
        description: transaction.description,
        createdAt: transaction.createdAt.toISOString()
    } as TransactionDTO;
}