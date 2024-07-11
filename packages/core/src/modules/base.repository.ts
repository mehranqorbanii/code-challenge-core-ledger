import { AwsDataApiPgDatabase } from "drizzle-orm/aws-data-api/pg";
import { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { InferSelectModel, eq } from "drizzle-orm";
import { ulid } from "ulid";

export function BaseRepository<T extends PgTable & { id: PgColumn }>(
    db: AwsDataApiPgDatabase,
    model: T
) {
  const wrapper = () => db.select().from(model);
  type fromType = ReturnType<typeof wrapper>;
  type insertType = typeof model.$inferInsert;
  type selectType = typeof model.$inferSelect;

  return class BaseRepository {
    db = db;
    model = model;

    async get(id: string): Promise<selectType | undefined> {
      const result = await doTransaction(
          this.db,
          async (connection) =>
              (
                  await connection
                      .select()
                      .from(model)
                      .where(eq(model.id, id))
                      .execute()
              )[0]
      );
      return result as selectType;
    }

    async exists(id: string): Promise<boolean> {
      const item = await this.get(id);
      return !!item;
    }

    async list(params?: (query: fromType) => fromType): Promise<selectType[]> {
      const result = await doTransaction(this.db, async (connection) =>
          (params || ((q) => q))(connection.select().from(model)).execute()
      );
      return result as selectType[];
    }

    async create(data: insertType): Promise<selectType> {
      const result = await doTransaction(this.db, async (connection) =>
          connection
              .insert(model)
              .values(
                  mapToDates({
                    id: ulid(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    ...data,
                  })
              )
              .returning()
              .then((d) => d[0])
      );
      return result as selectType;
    }

    async createList(data: insertType[]): Promise<selectType[]> {
      const itemsWithMetadata = data.map(item => ({
        id: ulid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...item,
      }));

      const result = await doTransaction(this.db, async (connection) =>
          connection
              .insert(model)
              .values(mapToDates(itemsWithMetadata))
              .returning()
      );

      return result as selectType[];
    }

    async update(id: string, data: insertType): Promise<selectType> {
      const result = await doTransaction(this.db, async (connection) =>
          connection
              .update(model)
              .set({ ...mapToDates(data), updatedAt: new Date() })
              .where(eq(model.id, id))
              .returning()
              .then((d) => d[0])
      );
      return result as selectType;
    }

    async delete(id: string): Promise<void> {
      await doTransaction(this.db, async (connection) =>
          connection.delete(model).where(eq(model.id, id)).execute()
      );
    }

    async upsert(data: insertType): Promise<selectType> {
      const result = await doTransaction(this.db, async (connection) => {
        const existingItem = await connection
            .select()
            .from(model)
            .where(eq(model.id, (data as any).id))
            .execute();

        if (existingItem.length > 0) {
          return connection
              .update(model)
              .set({ ...mapToDates(data), updatedAt: new Date() })
              .where(eq(model.id, (data as any).id))
              .returning()
              .then((d) => d[0]);
        } else {
          return connection
              .insert(model)
              .values(mapToDates({
                id: ulid(),
                createdAt: new Date(),
                updatedAt: new Date(),
                ...data
              }))
              .returning()
              .then((d) => d[0]);
        }
      });
      return result as selectType;
    }
  };
}

export const doTransactionWithIsolationLevel = (
    db: AwsDataApiPgDatabase,
    callback: (tx: AwsDataApiPgDatabase) => any
) => {
  return db.transaction(callback, { isolationLevel: "serializable" });
};

export const doTransaction = (
    db: AwsDataApiPgDatabase,
    callback: (tx: AwsDataApiPgDatabase) => any
) => {
  return db.transaction(callback);
};

export const mapToDates = (obj: any) => {
  for (const key of Object.keys(obj)) {
    if (key.endsWith("At")) {
      obj[key] = obj[key] ? new Date(obj[key]) : obj[key];
    }
  }
  return obj;
};

