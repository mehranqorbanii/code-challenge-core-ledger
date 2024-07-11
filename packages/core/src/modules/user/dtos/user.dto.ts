import { z } from "zod";

export interface UserDTO {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

export const UserDTOSchema = z.object({
    firstName: z.string().min(3, { message: "First name cannot be empty." }),
    lastName: z.string().min(3, { message: "Last name cannot be empty." }),
});