import { z } from "zod";

//NOTE: Models can be even more separated, e.g. for creation, for details etc. to keep it simple for now go with a single DTO both for creation and fetching
export interface AccountDTO {
    id: string;
    currency: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export const AccountDTOSchema = z.object({
    currency: z.string().min(1, { message: "Currency cannot be empty." }),
});