import {varchar, timestamp, numeric, index} from "drizzle-orm/pg-core";
import { transactionSchema } from "./schema";

export const transactions = transactionSchema.table("transactions", {
    id: varchar("id").primaryKey(),
    accountId: varchar("accountId").notNull(),
    type: varchar("type").notNull(), // 'debit' or 'credit' TODO: could be enum
    amount: numeric("amount").notNull(),
    fee: numeric("fee"),
    description: varchar("description"),
    createdAt: timestamp("createdAt").notNull()
}, (table) => ({
    accountIdIndex: index("accountId_idx").on(table.accountId),
    createdAtIndex: index("createdAt_idx").on(table.createdAt)
}));

export type Transaction = typeof transactions.$inferSelect;
