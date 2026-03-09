---
title: Configuration
description: Config files, credentials, and environment variables.
---

## Config file

`~/.envsh/config.json` — created automatically on first login.

```json
{
  "server_url": "https://api.envsh.dev",
  "active_workspace": "workspace-uuid",
  "output_format": "table"
}
```

To point at a self-hosted server, edit `server_url`.

## Credentials file

`~/.envsh/credentials` — stores auth tokens. Permissions: `0600`.

```json
{
  "tokens": {
    "workspace-uuid": {
      "access_token": "eyJ...",
      "refresh_token": "abc...",
      "email": "alice@example.com",
      "workspace_id": "workspace-uuid"
    }
  }
}
```

| Token | Lifetime | Notes |
|-------|----------|-------|
| Access token | 24 hours | Auto-refreshed by CLI |
| Refresh token | 30 days | Single-use (rotated on each refresh) |

## Machine keys

`~/.envsh/machines/{name}` — one file per machine created locally. Permissions: `0600`.

```
envsh-machine-v1:AABBCCDD...
```

## Environment variables

The CLI checks these environment variables:

| Variable | Description |
|----------|-------------|
| `ENVSH_MACHINE_KEY` | Machine private key for CI/CD auth |
| `ENVSH_SERVER` | Override server URL |

When `ENVSH_MACHINE_KEY` is set, the CLI uses machine authentication automatically.

## File locations

| Path | Purpose |
|------|---------|
| `~/.envsh/config.json` | CLI configuration |
| `~/.envsh/credentials` | Auth tokens |
| `~/.envsh/machines/` | Machine private keys |
| `~/.ssh/id_ed25519` | Default SSH private key |
| `~/.ssh/id_ed25519.pub` | Default SSH public key |
