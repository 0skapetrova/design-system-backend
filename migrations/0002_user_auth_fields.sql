ALTER TABLE users
  ADD COLUMN password_hash text NOT NULL,
  ADD COLUMN phone_verified_at timestamptz NOT NULL,
  ADD COLUMN last_login_at timestamptz;