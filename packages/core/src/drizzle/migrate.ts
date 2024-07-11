import { migrate as DrizzleMigrate } from "drizzle-orm/aws-data-api/pg/migrator";
import { db } from "./drizzle-connection";

export const migrate = async () => {
  await DrizzleMigrate(db, { migrationsFolder: "migrations" });
};
