# Таблица `users`

## 1. Назначение
Таблица хранит данные пользователей после успешного прохождения двухэтапной регистрации.  
Запись создаётся **только после подтверждения телефона** и заполнения полей `username` и `password`.

---

## 2. Структура таблицы

TABLE users {

  id                uuid           PK DEFAULT gen_random_uuid();
  
  username          text           NOT NULL UNIQUE;
    -- lower-case, формат: ^[a-z0-9_-]{5,20}$
    -- неизменяемый после создания
  
  phone             text           NOT NULL UNIQUE;
    -- нормализованный номер (только цифры)
  
  display_name      text;
    -- произвольное отображаемое имя
  
  avatar_url        text;
    -- URL аватара или null
  
  is_active         boolean        NOT NULL DEFAULT true;
    -- активный пользователь или нет
  
  password_hash     text           NOT NULL;
    -- bcrypt-хэш пароля
  
  phone_verified_at timestamptz    NOT NULL;
    -- заполняется в момент завершения верификации телефона
  
  last_login_at     timestamptz;
    -- последнее успешное действие login
  
  created_at        timestamptz    NOT NULL DEFAULT now();
    -- создано
  
  updated_at        timestamptz    NOT NULL DEFAULT now();
    -- обновляется автоматически триггером
}

TRIGGER:
  users_set_updated_at
    -- обновляет updated_at при любом UPDATE.


---

## 3. Ограничения (constraints)

### Уникальность
- `username` — уникален, сравнение регистронезависимое (значение приводится к lower-case перед записью).
- `phone` — уникален, сравнение по нормализованному значению (только цифры).

### Not null
- `username`, `phone`, `password_hash`, `is_active`, `created_at`, `updated_at`.

### Логические ограничения
- Пользователь создаётся *только после* verified телефона.
- Значение `phone_verified_at` заполняется в момент создания записи.
- `username` неизменяем после создания.
- `updated_at` обновляется триггером при любом UPDATE.

---

## 4. Триггеры

### updated_at trigger
Автоматически обновляет поле `updated_at` при изменении записи.

Имя триггера: `users_set_updated_at`

---

## 5. Примечания

- В таблицу попадают **только окончательно зарегистрированные пользователи**.
- До завершения регистрации используется таблица `phone_verifications`.

