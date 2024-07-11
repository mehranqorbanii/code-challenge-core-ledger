import {User} from "../models";
import {UserDTO} from "../dtos/user.dto";

export function toUserDTO(user: User): UserDTO {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    } as UserDTO;
}

export function toUser(userDTO: UserDTO): User {
    return {
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
    } as User;
}