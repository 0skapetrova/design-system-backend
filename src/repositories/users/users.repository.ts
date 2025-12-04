import { db } from "../../lib/db";
import { TUserDB } from "../../types/user";

export const usersRepository = {
    async findById(id: string): Promise<TUserDB | null> {
        const result = await db.query<TUserDB>(
            "SELECT * FROM users WHERE id = $1 LIMIT 1",
            [id]
        );
        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0];
    }
}