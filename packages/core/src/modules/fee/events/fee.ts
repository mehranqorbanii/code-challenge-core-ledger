import { z } from "zod";
import { event } from "../../event";
// NOTE: there could be more domain events like fee updated etc.
export const FeeEvents = {
    Created: event(
        "fee.created",
        z.object({
            id: z.string(),
            currency: z.string(),
            amount: z.string(),
            type: z.string()
        })
    ),
};
