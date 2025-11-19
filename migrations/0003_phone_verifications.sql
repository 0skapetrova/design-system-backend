CREATE TYPE phone_verification_status AS ENUM ('pending', 'verified', 'expired', 'blocked');

CREATE TABLE phone_verifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    phone text NOT NULL,
    code_hash text NOT NULL,
    STATUS phone_verification_status NOT NULL DEFAULT 'pending',
    attempts_left integer NOT NULL DEFAULT 5 CHECK (attempts_left >= 0),
    verified_at timestamptz,
    used_at timestamptz,
    user_id uuid,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    last_sent_at timestamptz NOT NULL DEFAULT NOW(),
    expires_at timestamptz NOT NULL
);

CREATE UNIQUE INDEX phone_verifications_unique_pending_phone ON phone_verifications(phone)
WHERE
    STATUS = 'pending';