import {varchar, timestamp, unique, numeric, index} from "drizzle-orm/pg-core";
import { accountSchema } from "./schema";

export const accounts = accountSchema.table("accounts", {
    id: varchar("id").primaryKey(),
    userId: varchar("userId").notNull(), // TODO: we can discuss why not FK
    currency: varchar("currency").notNull(),
    balance: numeric("balance").notNull().default("0"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
}, (table) => ({
    uniqueUserCurrency: unique().on(table.userId, table.currency),
    userIdIndex: index("userId_idx").on(table.userId),
    currencyIndex: index("currency_idx").on(table.currency)
}));

export type Account = typeof accounts.$inferSelect;
