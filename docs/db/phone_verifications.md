# Таблица `phone_verifications`

## 1. Назначение
Таблица хранит одноразовые коды подтверждения телефона (OTP) для регистрации.  
Записи создаются на **этапе 1 регистрации**, до создания пользователя.

Одна запись соответствует одному отправленному коду.

---

## 2. Структура таблицы

TABLE phone_verifications {

  id             uuid                        PK DEFAULT gen_random_uuid();

  phone          text                        NOT NULL;
    -- нормализованный номер (только цифры)

  code_hash      text                        NOT NULL;
    -- хэш одноразового SMS-кода

  status         phone_verification_status   NOT NULL DEFAULT 'pending';
    -- pending / verified / expired / blocked

  attempts_left  integer                     NOT NULL DEFAULT 5 CHECK (attempts_left >= 0);
    -- оставшиеся попытки ввода

  verified_at    timestamptz;
    -- успешная верификация

  used_at        timestamptz;
    -- запись использована для создания пользователя

  user_id        uuid REFERENCES users(id) ON DELETE SET NULL;
    -- пользователь, созданный по этой верификации (если есть)

  created_at     timestamptz                 NOT NULL DEFAULT now();
    -- время создания

  updated_at     timestamptz                 NOT NULL DEFAULT now();
    -- время последнего изменения

  last_sent_at   timestamptz                 NOT NULL DEFAULT now();
    -- время последней отправки кода

  expires_at     timestamptz                 NOT NULL;
    -- срок действия кода
    -- поле устанавливается строго в момент создания записи (now() + TTL)
}

ENUM phone_verification_status {
  pending,
  verified,
  expired,
  blocked
}

INDEX:
  UNIQUE (phone) WHERE status = 'pending';
    -- только одна активная верификация на номер


## 3. ENUM `phone_verification_status`

Значения:

- `pending` — код отправлен, ожидается ввод  
- `verified` — код подтверждён  
- `expired` — срок действия кода истёк  
- `blocked` — попытки исчерпаны  

---

## 4. Ограничения

### Уникальность
- Разрешена только одна активная верификация на номер:  
  **partial unique index**:  
  `(phone) WHERE status = 'pending'`

Это предотвращает множественную отправку кодов параллельно.

### Проверки
- `attempts_left >= 0`  
- Код действует только до `expires_at`.

---

## 5. Логика использования

### 5.1 Создание записи (отправка кода)
При запросе нового кода:

- создаётся запись с `status = 'pending'`
- `attempts_left = 5`
- `expires_at = now() + interval '5 minutes'`
- `last_sent_at = now()`
- предыдущая активная запись переводится в expired (если ещё pending)

### 5.2 Ввод кода
При проверке:

- сверяется `code_hash`
- уменьшается `attempts_left`
- при ошибке → `attempts_left--`, если дошло до нуля → `status = 'blocked'`
- при успехе → `status = 'verified'`, `verified_at = now()`

### 5.3 Использование при регистрации
На этапе 2 регистрации:

- создаётся запись в `users`
- телефон переносится из верификации
- поле `used_at = now()`
- `user_id` = id созданного пользователя

---

## 6. Особенности

- Записи **не удаляются** — служат историей попыток подтверждения телефона.  
- При повторных запросах соблюдается throttling (`last_sent_at + 30s`).  
- Валидация телефона выполняется до записи (нормализация → формат E.164).  
- Код хранится в **хешированном виде**, оригинал никогда не сохраняется.

