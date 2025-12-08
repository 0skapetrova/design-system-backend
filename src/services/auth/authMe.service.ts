import { makeHttpError } from "../../utils/errors/errorCatalog";
import { DEV_USER_ID } from "../../constants/devUser";
import { usersRepository } from "../../repositories/users/users.repository";
import { mapUserToPublic } from "../../mappers/userPublic.mapper";
import { TUserPublic } from "../../types/user";

export async function authMeService():Promise<TUserPublic> {
    
    const userId = DEV_USER_ID
    const user = await usersRepository.findById(userId)
    if (user === null || user === undefined) {
        throw makeHttpError("USER_NOT_FOUND")
    }
    const userPublic = mapUserToPublic(user);
    return userPublic;
};
