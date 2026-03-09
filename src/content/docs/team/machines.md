---
title: Machine Identities
description: Giving CI/CD pipelines access to secrets.
---

Machine identities let CI/CD systems pull secrets without interactive login. Each machine gets a unique Ed25519 keypair and is scoped to exactly **one project + one environment**.

## Why machines?

- **No shared secrets** — each machine has its own key. A leaked key only exposes one environment.
- **Short-lived tokens** — machine JWTs expire in 15 minutes. CI jobs re-authenticate each run.
- **Pull-only** — machines can only pull, never push.
- **Scoped** — a machine for `my-api/production` cannot access `my-api/staging`.

## Create a machine

Admin only.

```bash
envsh machine create deploy-prod \
    --project my-api \
    --env production

# ok: Created machine deploy-prod (ID: abc123-...)
# ok: Private key saved to /Users/alice/.envsh/machines/deploy-prod
#
# To use this machine, set:
#   ENVSH_MACHINE_KEY=envsh-machine-v1:AABBCCDD...
```

:::caution
Copy the `ENVSH_MACHINE_KEY` value now. The private key is **not stored on the server** — only the public key is sent. If you lose it, revoke the machine and create a new one.
:::

## Set up CI/CD

Add the key as a secret environment variable in your CI/CD system:

```
ENVSH_MACHINE_KEY=envsh-machine-v1:AABBCCDD...
```

The CLI auto-detects `ENVSH_MACHINE_KEY` and uses machine authentication instead of the human login flow.

## GitHub Actions example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install envsh
        run: curl -fsSL https://get.envsh.dev | sh

      - name: Deploy with secrets
        env:
          ENVSH_MACHINE_KEY: ${{ secrets.ENVSH_MACHINE_KEY }}
        run: envsh run production --project my-api -- ./deploy.sh
```

## Include machine in pushes

After creating a machine, push secrets again so the machine's key is included as a recipient:

```bash
envsh push .env --project my-api --env production --message "include CI machine key"
```

The CLI automatically includes all registered keys (user + machine) when encrypting.

## List machines

```bash
envsh machine list
# NAME         ENV          STATUS   ID
# deploy-prod  production   active   abc123-...
# deploy-stg   staging      active   def456-...
```

## Revoke a machine

```bash
envsh machine revoke deploy-prod
# ok: Revoked machine deploy-prod
```

After revocation, the machine cannot obtain new tokens. Update the `ENVSH_MACHINE_KEY` secret in your CI/CD system with a new machine's key.
