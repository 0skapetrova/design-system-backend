// 1. импортируем db, 

import { db } from "../src/lib/db";
import { TUserDB } from "../src/types/user";
import { DEV_USER_ID } from "../src/constants/devUser"

// 2. описываем dev-пользователя, 
// 2.1. Фиксированные значения dev-юзера
// id
// username
// phone
// display_name
// avatar_url

// 2.2. Служебные значения
// То, что мы генерируем/выбрали заранее:
// password_hash (фиктивный)
// phone_verified_at
// last_login_at
// created_at
// updated_at

// 2.3. Этот пользователь используется как dev-текущий для эндпойнта /me


const DEV_USER: TUserDB = {
    id: DEV_USER_ID,
    username: "sofia_maria",
    phone: "9990001111",
    display_name: "Софья-Мария Суворова",
    avatar_url: "https://i.pinimg.com/736x/60/9b/7c/609b7c7cfa54f7093df34fef02bea8ed.jpg",
    is_active: true,
    password_hash: "$2b$10$Cw9qM2x0fKzJk9FQqfu8JOjXtN9Qd1Yv1dWq9tkW9kQxUul6ZyS4q",
    phone_verified_at: "2025-01-01T12:00:00.000Z",
    last_login_at: "2025-01-10T09:30:00.000Z",
    created_at: "2025-01-01T12:00:00.000Z",
    updated_at: "2025-01-10T09:30:00.000Z",
};

// 3. выполняем INSERT ... ON CONFLICT
// 3.1. Конфликтуем по полю id
// 3.2. При конфликте обновляем все изменяемые поля: username, phone, display_name,
//      avatar_url, is_active, password_hash, phone_verified_at, last_login_at, updated_at
// 3.3. created_at не обновляем

async function main () {

const sql = `
INSERT INTO users (
  id,
  username,
  phone,
  display_name,
  avatar_url,
  is_active,
  password_hash,
  phone_verified_at,
  last_login_at,
  created_at,
  updated_at
) VALUES ($1, $2, $3, $4, $5,
  $6, $7, $8,
  $9, $10, $11
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  phone = EXCLUDED.phone,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  is_active = EXCLUDED.is_active,
  password_hash = EXCLUDED.password_hash,
  phone_verified_at = EXCLUDED.phone_verified_at,
  last_login_at = EXCLUDED.last_login_at,
  updated_at = EXCLUDED.updated_at;
`

const values = [DEV_USER.id, DEV_USER.username, DEV_USER.phone, DEV_USER.display_name, DEV_USER.avatar_url, DEV_USER.is_active, DEV_USER.password_hash, DEV_USER.phone_verified_at, DEV_USER.last_login_at, DEV_USER.created_at, DEV_USER.updated_at]

await db.query(sql, values);
}

main().catch(console.error).finally(() => db.end());