import { z } from "zod";
import { event } from "../../event";

export const AccountEvents = {
    Created: event(
        "account.created",
        z.object({
            id: z.string(),
            userId: z.string(),
            currency: z.string(),
        })
    ),
};
