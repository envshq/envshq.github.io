---
title: Push & Pull
description: Encrypting and decrypting secrets with envsh.
---

## Push

Push encrypts a `.env` file and uploads the ciphertext.

```bash
envsh push .env --project my-api --env production
# ok: Pushed v1 → my-api/production
```

### With a message

```bash
envsh push .env --project my-api --env production --message "rotate DB password"
# ok: Pushed v2 → my-api/production
```

### What `--env` means

Environment names are arbitrary strings. Use whatever your team uses:

```bash
envsh push .env --project my-api --env dev
envsh push .env --project my-api --env staging
envsh push .env --project my-api --env production
envsh push .env --project my-api --env preview-pr-42
```

Environments are created implicitly on first push. No setup needed.

### File size limit

`.env` files must be under 1 MB. envsh is designed for key-value pairs, not large binary files.

### Conflict detection

If two team members push at the same time:

```bash
envsh push .env --project my-api --env production
# error: CONFLICT: version conflict: base_version mismatch
# hint: pull the latest version first, merge your changes, then push again
```

Pull the latest, merge your changes, push again.

---

## Pull

Pull downloads and decrypts the latest secrets for an environment.

```bash
envsh pull production --project my-api
# ok: Pulled v2 from my-api/production → .env
```

The output file is created with `0600` permissions (owner-read only).

### To a specific file

```bash
envsh pull production --project my-api --output .env.production
```

### To stdout

```bash
envsh pull production --project my-api --stdout
# DATABASE_URL=postgres://...
# SECRET_KEY=abc123
```

### Export format

```bash
envsh pull production --project my-api --stdout --format export
# export DATABASE_URL=postgres://...
# export SECRET_KEY=abc123

# Source directly:
source <(envsh pull production --project my-api --stdout --format export)
```

### JSON format

```bash
envsh pull production --project my-api --stdout --format json
# {"DATABASE_URL": "postgres://...", "SECRET_KEY": "abc123"}
```

### With a different SSH key

```bash
envsh pull production --project my-api --key ~/.ssh/id_ed25519_work
```
