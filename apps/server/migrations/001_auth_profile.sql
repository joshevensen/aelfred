-- Creates Aelf.red-owned authentication and profile tables.
-- @context   Phase 2 needs durable app-owned tables without touching Mastra-managed schema.
-- @gotchas   Idempotency is handled by aelfred_migrations; plain CREATE statements intentionally fail on drift.
-- @dependencies Postgres pgcrypto extension for gen_random_uuid().

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  password_hash text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_username_unique UNIQUE (username),
  CONSTRAINT users_username_not_blank CHECK (length(btrim(username)) > 0),
  CONSTRAINT users_password_hash_not_blank CHECK (length(btrim(password_hash)) > 0),
  CONSTRAINT users_email_not_blank CHECK (length(btrim(email)) > 0)
);

CREATE TABLE profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  timezone text NOT NULL,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  last_checkin_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profile_user_id_unique UNIQUE (user_id),
  CONSTRAINT profile_name_not_blank CHECK (length(btrim(name)) > 0),
  CONSTRAINT profile_timezone_not_blank CHECK (length(btrim(timezone)) > 0)
);

CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT password_reset_tokens_token_hash_unique UNIQUE (token_hash),
  CONSTRAINT password_reset_tokens_token_hash_not_blank CHECK (length(btrim(token_hash)) > 0)
);

CREATE INDEX password_reset_tokens_user_id_idx
  ON password_reset_tokens (user_id);

CREATE INDEX password_reset_tokens_expires_at_idx
  ON password_reset_tokens (expires_at);
