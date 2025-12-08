import { TUserDB, TUserPublic } from "../types/user";

export function mapUserToPublic(user: TUserDB): TUserPublic {
    return { 
        id: user.id, 
        username: user.username, 
        phone: user.phone, 
        display_name: user.display_name, 
        avatar_url: user.avatar_url, 
        created_at: user.created_at
    };
}