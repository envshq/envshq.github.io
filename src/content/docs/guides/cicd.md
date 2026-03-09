---
title: CI/CD Setup
description: Pulling secrets in CI/CD pipelines.
---

## Overview

CI/CD pipelines use **machine identities** to pull secrets. Each machine is scoped to one project + one environment and authenticates with a challenge-response flow using Ed25519 keys.

## Step 1: Create a machine identity

On your local machine (admin only):

```bash
envsh machine create github-prod \
    --project my-api \
    --env production
```

Save the `ENVSH_MACHINE_KEY=envsh-machine-v1:...` value.

## Step 2: Push secrets with the machine as a recipient

```bash
envsh push .env --project my-api --env production --message "include CI machine key"
```

## Step 3: Add the key to your CI system

Add `ENVSH_MACHINE_KEY` as a secret environment variable.

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
        run: curl -fsSL https://get.envsh.dev | sh

      - name: Deploy
        env:
          ENVSH_MACHINE_KEY: ${{ secrets.ENVSH_MACHINE_KEY }}
        run: envsh run production --project my-api -- ./deploy.sh
```

## GitLab CI

```yaml
deploy:
  stage: deploy
  script:
    - curl -fsSL https://get.envsh.dev | sh
    - envsh run production --project my-api -- ./deploy.sh
  variables:
    ENVSH_MACHINE_KEY: $ENVSH_MACHINE_KEY
```

Add `ENVSH_MACHINE_KEY` in GitLab → Settings → CI/CD → Variables (masked).

## Docker build

```dockerfile
# Don't bake secrets into images. Use envsh at runtime:
CMD ["envsh", "run", "production", "--project", "my-api", "--"]
```

Or pull to a file at container startup:

```bash
#!/bin/sh
envsh pull production --project my-api --output .env
exec "$@"
```

## How machine auth works

1. CLI sends `POST /auth/machine-challenge` with the machine ID
2. Server returns a 32-byte random nonce (30-second TTL)
3. CLI signs the nonce with the Ed25519 private key
4. CLI sends `POST /auth/machine-verify` with the signature
5. Server verifies against the stored public key
6. Server issues a JWT valid for **15 minutes** (non-refreshable)

Each CI job re-authenticates. No long-lived tokens.

## Multiple environments

Create one machine per environment:

```bash
envsh machine create ci-staging  --project my-api --env staging
envsh machine create ci-prod     --project my-api --env production
```

Each gets its own key. A staging machine cannot access production secrets.
