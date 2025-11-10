-- 0001_baseline.sql
-- Создаёт базовые расширения, enum’ы, таблицы users & projects, RLS для projects.

BEGIN;

-- 1) Расширения
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Типы (enums)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM ('draft','active','on_hold','done','archived');
  END IF;
END $$;

-- 3) Таблица users (минимум для старта)
CREATE TABLE IF NOT EXISTS public.users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username        text NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9_-]{5,20}$'),
  phone           text NOT NULL UNIQUE,
  display_name    text,
  avatar_url      text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- триггер обновления updated_at (минимальный)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'users_set_updated_at'
  ) THEN
    CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 4) Таблица projects
CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        text NOT NULL CHECK (char_length(name) <= 100),
  address     text,
  status      project_status NOT NULL DEFAULT 'draft',
  note        text,
  deleted_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'projects_set_updated_at'
  ) THEN
    CREATE TRIGGER projects_set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5) Индексы (FK и поиск)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- 6) Включаем RLS и добавляем политики на SELECT/INSERT
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;

-- Правило: можно читать только свои проекты
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'projects_select_owner'
      AND schemaname = 'public'
      AND tablename  = 'projects'
  ) THEN
    CREATE POLICY projects_select_owner
    ON public.projects
    FOR SELECT
    USING (user_id = current_setting('app.user_id', true)::uuid);
  END IF;
END $$;

-- Правило: можно вставлять проекты только со своим user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'projects_insert_owner'
      AND schemaname = 'public'
      AND tablename  = 'projects'
  ) THEN
    CREATE POLICY projects_insert_owner
    ON public.projects
    FOR INSERT
    WITH CHECK (user_id = current_setting('app.user_id', true)::uuid);
  END IF;
END $$;

COMMIT;
