import {PgColumn, PgTable} from "drizzle-orm/pg-core";
import {BaseRepository} from "./base.repository";
import {InferInsertModel} from "drizzle-orm";

export const baseManager = <
    TModel extends PgTable & { id: PgColumn },
    TRepo extends InstanceType<ReturnType<typeof BaseRepository<TModel>>>
>(
    repo: TRepo,
    events: any
) => {
    return new (class {
        async get(id: string): Promise<TModel["$inferSelect"] | undefined> {
            const item = await repo.get(id);
            if (!item) {
                throw new Error(`Item with id ${id} not found`);
            }
            return item;
        }

        async create(item: InferInsertModel<TModel>): Promise<TModel["$inferSelect"]> {
            const newItem = await repo.create(item);
            await events.Created.publish(newItem);
            return newItem;
        }

        async createList(items: InferInsertModel<TModel>[]): Promise<TModel["$inferSelect"][]> {
            const newItems = await repo.createList(items);
            await Promise.all(newItems.map(item => events.Created.publish(item)));
            return newItems;
        }

        async update(id: string, item: InferInsertModel<TModel>): Promise<TModel["$inferSelect"]> {
            // Broadcast to events.Updated if required
            return repo.update(id, item);
        }

        async list(): Promise<TModel["$inferSelect"][]> {
            return repo.list();
        }

        async upsert(data: InferInsertModel<TModel>): Promise<TModel["$inferSelect"]> {
            return repo.upsert(data);
        }

        async delete(id: string): Promise<void> {
            return repo.delete(id);
        }
    })();
};
