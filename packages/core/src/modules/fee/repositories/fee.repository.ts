import {db} from "../../../drizzle";
import {BaseRepository} from "../../base.repository";
import {fees} from "../models";
import {eq} from "drizzle-orm";

export class FeeRepository extends BaseRepository(db, fees) {
    async getByCurrency(currency: string) : Promise<typeof fees.$inferSelect | null> {
        const fee = await this.db
            .select()
            .from(fees)
            .where(eq(fees.currency, currency))
            .limit(1) // Ensure only one result is returned
            .execute();

        return fee.length > 0 ? fee[0] : null;
    }
}

const feeRepo = new FeeRepository();
export default feeRepo;
