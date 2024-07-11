import {TransactionRepository} from "../repositories/transaction.repository";
import accountRepo from "../../account/repositories/account.repository";
import {AccountManager} from "../../account/managers/account.manager";
import {FeeManager} from "../../fee/managers/fee.manager";
import {transactions} from "../models";
import {doTransactionWithIsolationLevel} from "../../base.repository";
import {AwsDataApiPgDatabase} from "drizzle-orm/aws-data-api/pg";
import {Account} from "../../account/models";
import {InferInsertModel} from "drizzle-orm";
import {TransactionEvents} from "../events";
import {z} from "zod";

const transactionRepo = new TransactionRepository();
const EXTERNAL_ACCOUNT_TEMPLATE = 'external_'

//NOTE: this should be configured for all the supported currencies, but for now to keep it simple let's use a fixed amount;
//(we need a currency manager for supported currencies with corresponding configs (min amount deposit min amount withdraw, etc))
const MINIMUM_DEPOSIT_AMOUNT = 5
const MAXIMUM_WITHDRAW_AMOUNT = 100

class TransactionManagerClass {

    async list(userId: string) {
        const accountIds = (await AccountManager.getByUserId(userId)).map(account => account.id);
        return transactionRepo.getTransactionsByAccountIds(accountIds);
    }

    //Note: here the concurrency issue is handled with SERIALIZABLE db isolation level, we can discuss other approaches as well e.g. using optimistic lock. we can discuss pros/cons
    async makeTransaction(
        accountId: string,
        type: "deposit" | "withdraw",
        amount: number
    ): Promise<typeof transactions.$inferSelect> {
        // @ts-ignore language barrier :)
        return doTransactionWithIsolationLevel(transactionRepo.db, async (connection) => {
            const account = await AccountManager.get(accountId);
            const feeAmount = await FeeManager.getByCurrency(account.currency, amount);
            let result;
            switch (type) {
                case "deposit":
                    result = this.handleDeposit(connection, account, amount, feeAmount)
                    break;
                case "withdraw":
                    result = this.handleWithdraw(connection, account, amount, feeAmount);
                    break;
                default:
                    throw new Error(`Unsupported transaction type: ${type}`);
            }
            return result;
        })
    }

    async handleDeposit(
        connection: AwsDataApiPgDatabase,
        account: Account,
        amount: number,
        feeAmount: number
    ): Promise<typeof transactions.$inferSelect> {
        const totalAmount = amount + feeAmount;
        const balance = Number(account.balance)

        if (amount < MINIMUM_DEPOSIT_AMOUNT) {
            throw new Error("Amount is less than the minimum deposit AMOUNT");
        }

        //NOTE: These can move to a method factory to avoid construction directly here.
        // For transactions  and other db types we can have domain models and handle behaviour there to follow ddd.
        const debit = {
            accountId: EXTERNAL_ACCOUNT_TEMPLATE + account.currency,
            type: "debit",
            amount: totalAmount.toString(),
            fee: feeAmount.toString(),
            description: `deposit of ${amount} with fee ${feeAmount}`,
        };

        const credit = {
            accountId: account.id,
            type: "credit",
            amount: amount.toString(),
            fee: feeAmount.toString(),
            description: `deposit of ${amount}`, // description can also be a use input for the API. like a memo.
        };

        const debitEntry = await transactionRepo.createTransaction(connection, debit);
        const creditEntry = await transactionRepo.createTransaction(connection, credit);

        await accountRepo.updateBalance(account.id, balance + amount);
        await TransactionEvents.Created.publish({
            id: creditEntry.id,
            accountId: creditEntry.accountId,
            type: creditEntry.type,
            amount: creditEntry.amount
        });
        return creditEntry;
    }

    async handleWithdraw(
        connection: AwsDataApiPgDatabase,
        account: Account,
        amount: number,
        feeAmount: number
    ): Promise<typeof transactions.$inferSelect> {
        const totalAmount = amount + feeAmount;
        const balance = Number(account.balance)
        if (balance < totalAmount || balance < feeAmount) { // for the second condition might be better to have a separate error message.
            throw new Error("Insufficient funds");
        }
        if (MAXIMUM_WITHDRAW_AMOUNT < amount) {
            throw new Error("Amount exceeds the maximum withdraw AMOUNT");
        }

        const debit = {
            accountId: account.id,
            type: "debit",
            amount: totalAmount.toString(),
            description: `withdraw of ${amount} with fee ${feeAmount}`,
        };

        const credit = {
            accountId: EXTERNAL_ACCOUNT_TEMPLATE + account.currency,
            type: "credit",
            amount: amount.toString(),
            description: `withdraw of ${amount}`,
        };

        const debitEntry = await transactionRepo.createTransaction(connection, debit);
        const creditEntry = await transactionRepo.createTransaction(connection, credit);

        await accountRepo.updateBalance(account.id, balance - totalAmount);

        // await TransactionEvents.Created.publish({ debit: debitEntry, credit: creditEntry });

        return debitEntry;
    }

    //Note: in case we need to rely on this for checking balance, transaction inconsistencies on a daily basis, it's better to have job instead of an api calling it.
    async generateDailyReport(): Promise<{ discrepancies: any[] }> {
        const accounts = await AccountManager.list();

        const expectedBalances = await transactionRepo.calculateExpectedBalances(this.getStartOfYesterday(), this.getEndOfYesterday());

        const discrepancies = accounts.map(account => {
            const expected = expectedBalances.find(b => b.accountId === account.id);
            const expectedBalance = expected ? expected.expectedBalance : 0;

            if (expectedBalance !== Number(account.balance)) {
                return {
                    accountId: account.id,
                    expectedBalance: expectedBalance,
                    actualBalance: Number(account.balance),
                    discrepancy: expectedBalance - Number(account.balance)
                };
            }

            return null;
        }).filter((discrepancy): discrepancy is {
            accountId: string;
            expectedBalance: number;
            actualBalance: number;
            discrepancy: number
        } => discrepancy !== null);

        return {discrepancies};
    }

    private getStartOfYesterday(): Date {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        now.setHours(0, 0, 0, 0);
        return now;
    }

    private getEndOfYesterday(): Date {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        now.setHours(23, 59, 59, 999);
        return now;
    }
}

export const TransactionManager = new TransactionManagerClass();
