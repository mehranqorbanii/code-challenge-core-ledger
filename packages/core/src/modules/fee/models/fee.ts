import {varchar, numeric, index} from "drizzle-orm/pg-core";
import {feeSchema} from "./schema";
import {unique} from "drizzle-orm/pg-core";

export const fees = feeSchema.table("fees", {
    id: varchar("id").primaryKey(),
    currency: varchar("currency").notNull(),
    unit: varchar("unit").notNull(),
    amount: numeric("amount").notNull(),
    type: varchar("type").notNull(),
}, (table) => ({
    uniqueUserCurrency: unique().on(table.currency),
    currencyIndex: index("currency_idx").on(table.currency)
}));

export type Fee = typeof fees.$inferSelect;
