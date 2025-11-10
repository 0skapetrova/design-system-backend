#!/usr/bin/env bash
set -euo pipefail

# Загружаем .env, если есть
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

PSQL="psql -v ON_ERROR_STOP=1"

# 1) создаём таблицу трекинга версий (если нет)
$PSQL <<'SQL'
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

# 2) проходим по *.sql по возрастанию имён
for file in $(ls -1 migrations/*.sql | sort); do
  version=$(basename "$file")
  # пропускаем, если уже применяли
  count=$($PSQL -At -c "SELECT COUNT(*) FROM public.schema_migrations WHERE version = '$version';")
  if [ "$count" != "0" ]; then
    echo "↩︎  already applied: $version"
    continue
  fi

  echo "→ applying: $version"
  $PSQL -f "$file"
  $PSQL -c "INSERT INTO public.schema_migrations(version) VALUES ('$version');"
  echo "✓ done: $version"
done

echo "✅ all migrations applied"
