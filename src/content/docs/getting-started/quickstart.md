---
title: Quick Start
description: Go from install to pushing your first secrets in 2 minutes.
---

## 1. Log in

```bash
envsh login
# Email: alice@example.com
# Code: 483921   ← check your email for the 6-digit code
# ok: Logged in as alice@example.com
# ok: SSH key registered from /Users/alice/.ssh/id_ed25519.pub
```

On first login, envsh automatically creates your workspace and registers your SSH public key.

## 2. Check your setup

```bash
envsh doctor
#   ok  SSH key at ~/.ssh/id_ed25519.pub
#   ok  Credentials file exists
#   ok  Active session token
#   ok  Server reachable at https://api.envsh.dev
#   ok  SSH key registered on server
#
# ok: All checks passed
```

## 3. Create a project

```bash
envsh project create "My API" my-api
# ok: Created project My API (slug: my-api)
```

## 4. Push secrets

```bash
envsh push .env --project my-api --env production
# ok: Pushed v1 → my-api/production
```

Your `.env` file is encrypted locally and uploaded as ciphertext.

## 5. Pull secrets

On another machine (or after cloning a fresh repo):

```bash
envsh pull production --project my-api
# ok: Pulled v1 from my-api/production → .env
```

## 6. Run with secrets

Inject secrets as environment variables without writing them to disk:

```bash
envsh run production --project my-api -- node server.js
```

The process receives your secrets as env vars. When it exits, they're gone.

## What just happened?

When you pushed:
1. envsh generated a random AES-256 key
2. Encrypted your `.env` with AES-256-GCM
3. Wrapped the AES key with your SSH public key (and every team member's key)
4. Sent only the ciphertext to the server

When you pulled:
1. Downloaded the ciphertext bundle
2. Used your SSH private key to unwrap the AES key
3. Decrypted locally
4. Wrote `.env` with `0600` permissions

The server never saw your plaintext. It can't — it doesn't have anyone's private key.

## Invited to a team?

If someone invited you, log in and switch to their workspace:

```bash
envsh login
envsh workspace list
# NAME                   SLUG      ROLE     ID
# you@example.com        you       admin    abc123-...
# Acme Corp              acme      member   def456-...

envsh workspace switch def456-...
# ok: Switched to workspace Acme Corp

envsh pull production --project my-api
```
