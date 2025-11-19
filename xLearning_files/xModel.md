# 🧱 Архитектура данных (MVP)

## 3.1 Типы (ENUM)

```sql
CREATE TYPE project_status AS ENUM ('draft','active','on_hold','done','archived');
CREATE TYPE client_role    AS ENUM ('owner','coowner','representative');
CREATE TYPE share_entity   AS ENUM ('project','specification');
```

---

## 3.2 Пользователи — `users`

| Поле | Тип | Описание |
|------|-----|-----------|
| id | `uuid PK DEFAULT gen_random_uuid()` | идентификатор |
| username | `text UNIQUE NOT NULL` | логин (`^[a-z0-9_-]{5,20}$`) |
| display_name | `text` | отображаемое имя |
| phone | `text UNIQUE NOT NULL` | телефон |
| phone_verified_at | `timestamptz` | подтверждение телефона |
| password_hash | `text` | опционально (если будет логин по паролю) |
| avatar_url | `text` | ссылка на аватар |
| is_active | `boolean NOT NULL DEFAULT true` | активен ли пользователь |
| created_at / updated_at | `timestamptz NOT NULL DEFAULT now()` | временные метки |
| last_login_at | `timestamptz` | последняя авторизация |

---

## 3.3 Клиенты (контакты заказчика) — `clients`

| Поле | Тип | Описание |
|------|-----|-----------|
| id | `uuid PK DEFAULT gen_random_uuid()` | идентификатор |
| user_id | `uuid NOT NULL → users(id) ON DELETE CASCADE` | владелец (пользователь) |
| name | `text NOT NULL` | имя клиента |
| phone | `text` | телефон |
| email | `text` | email |
| note | `text` | заметка |
| created_at / updated_at | `timestamptz NOT NULL DEFAULT now()` | метки времени |

**Уникальности в рамках владельца:**
```sql
UNIQUE (user_id, phone)
UNIQUE (user_id, email)
```
*(оба поля nullable → уникальны среди не-NULL)*

---

## 3.4 Проекты — `projects`

| Поле | Тип | Описание |
|------|-----|-----------|
| id | `uuid PK DEFAULT gen_random_uuid()` | идентификатор |
| user_id | `uuid NOT NULL → users(id) ON DELETE CASCADE` | владелец |
| name | `text NOT NULL CHECK (char_length(name) <= 100)` | название |
| address | `text` | адрес |
| status | `project_status NOT NULL DEFAULT 'draft'` | состояние |
| note | `text` | заметка |
| deleted_at | `timestamptz` | мягкое удаление |
| created_at / updated_at | `timestamptz NOT NULL DEFAULT now()` | временные метки |

```sql
UNIQUE (user_id, name)
```

---

## 3.5 Связь проект ↔ клиенты (M:N) — `project_clients`

| Поле | Тип | Описание |
|------|-----|-----------|
| project_id | `uuid NOT NULL → projects(id) ON DELETE CASCADE` | проект |
| client_id | `uuid NOT NULL → clients(id) ON DELETE CASCADE` | клиент |
| role | `client_role NOT NULL DEFAULT 'owner'` | роль клиента |
| is_primary | `boolean NOT NULL DEFAULT false` | основной контакт |
| created_at | `timestamptz NOT NULL DEFAULT now()` | дата добавления |

**Ключи и правила:**
```sql
PRIMARY KEY (project_id, client_id);
UNIQUE (project_id) WHERE is_primary = true;
```
> При удалении primary-клиента назначается следующий по дате добавления.

---

## 3.6 Ведомости — `specifications`

| Поле | Тип | Описание |
|------|-----|-----------|
| id | `uuid PK DEFAULT gen_random_uuid()` | идентификатор |
| project_id | `uuid NOT NULL → projects(id)` | проект |
| user_id | `uuid NOT NULL → users(id)` | автор (денормализация) |
| name | `text NOT NULL` | название |
| note | `text` | заметка |
| is_archived | `boolean NOT NULL DEFAULT false` | архивирована |
| deleted_at | `timestamptz` | мягкое удаление |
| created_at / updated_at | `timestamptz NOT NULL DEFAULT now()` | метки |

```sql
UNIQUE (project_id, name)
```

---

## 3.7 Позиции — `items`

| Поле | Тип | Описание |
|------|-----|-----------|
| id | `uuid PK DEFAULT gen_random_uuid()` | идентификатор |
| spec_id | `uuid NOT NULL → specifications(id)` | ведомость |
| name | `text NOT NULL` | название (допускает дубли) |
| quantity | `numeric CHECK (quantity > 0)` | количество |
| unit | `text` | единица измерения |
| url | `text` | ссылка |
| description | `text` | описание |
| note | `text` | заметка |
| show_note_to_client | `boolean NOT NULL DEFAULT false` | показывать ли клиенту |
| image_url | `text` | изображение |
| position_index | `int` | порядок для drag-n-drop |
| created_at / updated_at | `timestamptz NOT NULL DEFAULT now()` | временные метки |

---

## 3.8 Версии ведомостей — `spec_versions`

| Поле | Тип | Описание |
|------|-----|-----------|
| id | `uuid PK DEFAULT gen_random_uuid()` | идентификатор |
| spec_id | `uuid NOT NULL → specifications(id)` | ведомость |
| version_number | `int NOT NULL` | номер версии |
| comment | `text` | комментарий |
| data_snapshot | `jsonb NOT NULL` | снимок ведомости + позиций |
| published_by | `uuid NOT NULL → users(id)` | кто опубликовал |
| is_active | `boolean NOT NULL DEFAULT false` | активная версия |
| created_at | `timestamptz NOT NULL DEFAULT now()` | создана |

```sql
UNIQUE (spec_id, version_number);
-- одновременно одна активная версия на spec_id
```

---

## 3.9 Публичные токены — `share_tokens`

| Поле | Тип | Описание |
|------|-----|-----------|
| entity_type | `share_entity` | тип сущности (project/specification) |
| entity_id | `uuid` | ссылка на сущность |
| token | `text UNIQUE` | UUID/хэш токен |
| is_enabled | `boolean NOT NULL DEFAULT true` | включён |
| shared_at | `timestamptz NOT NULL DEFAULT now()` | дата выдачи |
| revoked_at | `timestamptz` | отозван |

**Правила:**
- noindex / nofollow.  
- отдельный очищенный эндпоинт данных.  
- отключение публичности проекта закрывает все ведомости.

---

## 3.10 Индексы (минимум)

- FK-индексы:
  - `projects(user_id)`
  - `specifications(project_id)`
  - `items(spec_id)`
  - `project_clients(project_id)`
  - `project_clients(client_id)`
  - `clients(user_id)`
- Порядок позиций: `items(spec_id, position_index)`
- Поиск по названиям: `lower(name)`  
  *(при росте проекта — GIN trigram)*

---
