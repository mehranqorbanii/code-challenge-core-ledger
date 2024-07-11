import {db} from "../../../drizzle";
import {BaseRepository} from "../../base.repository";
import {Account, accounts} from "../models";
import {and, eq, InferInsertModel} from "drizzle-orm";

export class AccountRepository extends BaseRepository(db, accounts) {
    async updateBalance(accountId: string, newBalance: number): Promise<void> {
        await db
            .update(accounts)
            .set({balance: newBalance.toString(), updatedAt: new Date()})
            .where(eq(accounts.id, accountId))
            .execute();
    }

    async findByUserId(userId: string): Promise<InferInsertModel<typeof accounts>[]> {
        return this.db.select().from(accounts).where(eq(accounts.userId, userId)).execute();
    }

    async findByUserIdAndCurrency(userId: string, currency: string): Promise<InferInsertModel<typeof accounts>[]> {
        return this.db.select().from(accounts).where(and(eq(accounts.userId, userId), eq(accounts.currency, currency))).execute();
    }
}

const accountRepo = new AccountRepository();
export default accountRepo;