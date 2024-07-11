import { varchar, timestamp } from "drizzle-orm/pg-core";
import { userSchema } from "./schema";

export const users = userSchema.table("users", {
  id: varchar("id").primaryKey(),
  firstName: varchar("firstName"),
  lastName: varchar("lastName"),
  updatedAt: timestamp("updatedAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type User = typeof users.$inferSelect;
