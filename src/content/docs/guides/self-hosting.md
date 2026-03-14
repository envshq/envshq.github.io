---
title: Self-Hosting
description: Run the envsh server on your own infrastructure.
---

The envsh server is open source (AGPL-3.0). You can run it on your own infrastructure for full control.

## Requirements

- PostgreSQL 16+
- Redis 7+
- A server to run the binary (any Linux/macOS machine)

## Quick start (from source)

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

## Quick start (Docker image)

Pre-built multi-arch images (amd64 + arm64) are available on GitHub Container Registry:

```bash
docker pull ghcr.io/envshq/envsh-server:latest
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
| `FREE_TIER_SEAT_MAX` | No | `0` | Max members per workspace (0 = unlimited) |

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
  migrate:
    image: ghcr.io/envshq/envsh-server:latest
    command: ["/envsh-server", "-migrate"]
    environment:
      DATABASE_URL: postgres://envsh:secret@postgres:5432/envsh?sslmode=disable
    depends_on:
      postgres:
        condition: service_healthy

  server:
    image: ghcr.io/envshq/envsh-server:latest
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      DATABASE_URL: postgres://envsh:secret@postgres:5432/envsh?sslmode=disable
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-here
      EMAIL_PROVIDER: resend
      RESEND_API_KEY: re_xxx
    depends_on:
      migrate:
        condition: service_completed_successfully
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U envsh"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

:::tip
The `migrate` service runs database migrations on startup and exits. The `server` service waits for it to complete before starting.
:::

## Reverse proxy

Run behind nginx or Caddy with TLS. Example nginx config:

```nginx
server {
    listen 443 ssl http2;
    server_name envsh.yourcompany.com;

    ssl_certificate     /etc/letsencrypt/live/envsh.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/envsh.yourcompany.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Health checks

The server exposes health endpoints (no auth required):

```bash
# Basic health check
curl https://envsh.yourcompany.com/health
# {"ok":true,"version":"v1","build":"v0.4.0"}

# Readiness check (verifies Postgres + Redis connectivity)
curl https://envsh.yourcompany.com/health/ready
# {"ok":true}
```

Use `/health/ready` for container orchestrator probes.

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

## Upgrading

Pull the latest image and restart:

```bash
docker compose pull
docker compose up -d
```

The `migrate` service automatically applies any new database migrations on startup.
