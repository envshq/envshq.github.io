---
title: CI/CD Setup
description: Pulling secrets in CI/CD pipelines.
---

## Overview

CI/CD pipelines use **machine identities** to pull secrets. Each machine is scoped to one project + one environment. Machines are pull-only — they authenticate with a challenge-response flow and get a short-lived JWT (15 minutes, non-refreshable).

## Setup (3 steps)

### Step 1: Create a machine identity

On your local machine (admin only):

```bash
envsh machine create github-prod \
    --project my-api \
    --env production
# ok: Created machine github-prod
# ok: Private key saved to ~/.envsh/machines/github-prod
#
# To use this machine, set:
#   ENVSH_MACHINE_KEY=envsh-machine-v1:AABBCCDD...
```

Copy the `ENVSH_MACHINE_KEY` value. The private key is shown once and never stored on the server.

### Step 2: Re-push secrets

After creating a machine, push secrets again so the machine's key is included as a recipient:

```bash
envsh push .env --project my-api --env production --message "include CI machine key"
```

The CLI automatically includes all registered keys (user SSH keys + active machine keys) when encrypting.

### Step 3: Add the key to your CI system

Add `ENVSH_MACHINE_KEY` as a secret environment variable in your CI/CD platform.

## GitHub Actions

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
        run: curl -fsSL https://envsh.dev/install.sh | sh

      - name: Deploy with secrets
        env:
          ENVSH_MACHINE_KEY: ${{ secrets.ENVSH_MACHINE_KEY }}
        run: envsh run production --project my-api -- ./deploy.sh
```

Add `ENVSH_MACHINE_KEY` in GitHub → Settings → Secrets and variables → Actions → New repository secret.

## GitLab CI

```yaml
deploy:
  stage: deploy
  script:
    - curl -fsSL https://envsh.dev/install.sh | sh
    - envsh run production --project my-api -- ./deploy.sh
  variables:
    ENVSH_MACHINE_KEY: $ENVSH_MACHINE_KEY
```

Add `ENVSH_MACHINE_KEY` in GitLab → Settings → CI/CD → Variables (masked + protected).

## Bitbucket Pipelines

```yaml
pipelines:
  branches:
    main:
      - step:
          name: Deploy
          script:
            - curl -fsSL https://envsh.dev/install.sh | sh
            - envsh run production --project my-api -- ./deploy.sh
```

Add `ENVSH_MACHINE_KEY` in Bitbucket → Repository settings → Pipelines → Repository variables (secured).

## CircleCI

```yaml
jobs:
  deploy:
    docker:
      - image: cimg/base:current
    steps:
      - checkout
      - run:
          name: Install envsh
          command: curl -fsSL https://envsh.dev/install.sh | sh
      - run:
          name: Deploy
          command: envsh run production --project my-api -- ./deploy.sh
```

Add `ENVSH_MACHINE_KEY` in CircleCI → Project Settings → Environment Variables.

## Docker containers

Don't bake secrets into images. Pull at runtime:

```dockerfile
# Option 1: use envsh run (secrets never touch disk)
CMD ["envsh", "run", "production", "--project", "my-api", "--", "node", "server.js"]
```

```bash
# Option 2: entrypoint script (writes .env, then starts app)
#!/bin/sh
envsh pull production --project my-api --output .env
exec "$@"
```

```bash
# Option 3: pull to stdout and source
eval $(envsh pull production --project my-api --stdout --format export)
exec node server.js
```

## How machine auth works

```
CLI                               Server
 │                                  │
 ├─ POST /auth/machine-challenge ──→│ Returns 32-byte nonce (30s TTL)
 │                                  │
 ├─ Sign nonce with Ed25519 key     │
 │                                  │
 ├─ POST /auth/machine-verify ────→│ Verify signature → JWT (15min)
 │                                  │
 ├─ GET /secrets/pull ────────────→│ Return encrypted bundle
 │                                  │
 └─ Decrypt locally                 │
```

Each CI job re-authenticates. No long-lived tokens. No refresh tokens. If the 15-minute JWT expires, the CLI re-authenticates automatically.

## Multiple environments

Create one machine per environment:

```bash
envsh machine create ci-staging  --project my-api --env staging
envsh machine create ci-prod     --project my-api --env production
```

Each gets its own key. A staging machine cannot access production secrets. Store each key as a separate CI/CD secret.

## Revoking a machine

```bash
envsh machine revoke github-prod
```

After revocation, the machine cannot obtain new tokens. Remove the old `ENVSH_MACHINE_KEY` from your CI/CD system and create a new machine if needed.
