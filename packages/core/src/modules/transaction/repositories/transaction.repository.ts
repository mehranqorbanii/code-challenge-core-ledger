import {BaseRepository, mapToDates} from "../../base.repository";
import { transactions } from "../models";
import {AwsDataApiPgDatabase} from "drizzle-orm/aws-data-api/pg";
import {ulid} from "ulid";
import {between, eq, gt, inArray, InferInsertModel, sql} from "drizzle-orm";
import {db} from "../../../drizzle";

//NOTE: removed updatedAt, as the core ledger transactions are immutable. to resolve/reconciliation new documents should be added with corresponding description
export class TransactionRepository extends BaseRepository(db, transactions) {
    async createTransaction(connection: AwsDataApiPgDatabase, transaction: Partial<typeof transactions.$inferInsert>) {
        const newTransaction = {
            id: ulid(),
            createdAt: new Date(),
            ...transaction,
        };

        return connection
            .insert(this.model)
            .values(mapToDates(newTransaction))
            .returning()
            .then((d) => d[0]);
    }

    async calculateExpectedBalances(start: Date, end: Date): Promise<{ accountId: string; expectedBalance: number }[]> {
        const result = await this.db
            .select({
                accountId: this.model.accountId,
                expectedBalance: sql`SUM(
          CASE
            WHEN type = 'credit' THEN amount
            WHEN type = 'debit' THEN -amount
          END
        )`.as("expectedBalance")
            })
            .from(this.model)
            .where(between(this.model.createdAt, start, end))
            .groupBy(this.model.accountId)
            .execute();

        return result.map(row => ({
            accountId: row.accountId,
            expectedBalance: Number(row.expectedBalance)
        }));
    }

    async getTransactionsByAccountIds(accountIds: string[]): Promise<InferInsertModel<typeof transactions>[]> {
        return this.db.select().from(this.model).where(inArray(this.model.accountId, accountIds)).execute();
    }
}

export const transactionRepo = new TransactionRepository();
export default transactionRepo;