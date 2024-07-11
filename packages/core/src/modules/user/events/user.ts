import { z } from "zod";
import { event } from "../../event";

export const UserEvents = {
  Created: event(
    "user.created",
    z.object({
      id: z.string(),
    })
  ),
};
