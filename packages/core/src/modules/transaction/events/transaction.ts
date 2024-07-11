import { z } from "zod";
import { event } from "../../event";

export const TransactionEvents = {
    Created: event(
        "transaction.created",
        z.object({
            id: z.string(),
            accountId: z.string(),
            type: z.string(),
            amount: z.string() // TODO: faced an issue with types
        })
    )
};
