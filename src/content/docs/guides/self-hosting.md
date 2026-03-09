---
title: Self-Hosting
description: Run the envsh server on your own infrastructure.
---

The envsh server is open source (AGPL-3.0). You can run it on your own infrastructure for full control.

## Requirements

- PostgreSQL 16+
- Redis 7+
- A server to run the binary (any Linux/macOS machine)

## Quick start

```bash
git clone https://github.com/envshq/envsh-server
cd envsh-server

# Start Postgres + Redis
make docker-up

# Configure
cp .env.example .env
# Edit .env — set JWT_SECRET (any random string, keep it secret)

# Apply database schema
make migrate-up

# Build and run
make run
# Server listening on :8080
```

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `REDIS_URL` | Yes | — | Redis connection string |
| `JWT_SECRET` | Yes | — | HMAC key for JWT signing |
| `SERVER_ADDR` | No | `:8080` | Listen address |
| `LOG_LEVEL` | No | `info` | debug, info, warn, error |
| `EMAIL_PROVIDER` | No | `console` | `console` or `resend` |
| `EMAIL_FROM` | No | `noreply@envsh.dev` | Sender address |
| `RESEND_API_KEY` | Cond. | — | Required if `EMAIL_PROVIDER=resend` |

## Point the CLI at your server

```bash
# One-time: set server URL
envsh login --server https://envsh.yourcompany.com

# Or edit the config file directly
# ~/.envsh/config.json → "server_url": "https://envsh.yourcompany.com"
```

## Production checklist

- [ ] Run behind a reverse proxy (nginx/Caddy) with TLS
- [ ] Set a strong random `JWT_SECRET` (at least 32 characters)
- [ ] Use `resend` email provider (or another SMTP relay) instead of `console`
- [ ] Set up PostgreSQL backups
- [ ] Restrict Redis to localhost or private network
- [ ] Set `LOG_LEVEL=warn` for production

## Docker Compose (production)

```yaml
services:
  server:
    build: .
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      DATABASE_URL: postgres://envsh:secret@postgres:5432/envsh?sslmode=disable
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-here
      EMAIL_PROVIDER: resend
      RESEND_API_KEY: re_xxx
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: envsh
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: envsh
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Migrations

```bash
# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Verify round-trip
make migrate-up && make migrate-down && make migrate-up
```

Always write both up and down migrations. Test the round-trip before deploying.
