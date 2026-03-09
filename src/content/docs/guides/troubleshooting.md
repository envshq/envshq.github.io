---
title: Troubleshooting
description: Common issues and how to fix them.
---

## "not logged in — run: envsh login"

Your credentials are missing or expired. Run:

```bash
envsh login
```

Access tokens expire in 24 hours (auto-refreshed). Refresh tokens expire in 30 days — after that, log in again.

## "decrypting: no recipient entry for this key"

Your SSH key fingerprint is not in the recipients list. This happens when:

- You registered your SSH key **after** the secret was last pushed
- You're using a different SSH key than the one registered

Fix:

```bash
# Check which keys are registered
envsh keys list

# Register your key if it's not there
envsh keys add

# Have someone push again (or do it yourself)
envsh pull production --project my-api --key ~/.ssh/id_ed25519_old
envsh push .env --project my-api --env production
```

## "decrypting: checksum mismatch"

The ciphertext was corrupted. This should not happen under normal operation. If you see this, [file an issue](https://github.com/envshq/envsh/issues).

## "project X not found"

The slug doesn't match any project in your workspace:

```bash
envsh project list
```

## "file too large: max 1MB"

Your `.env` file exceeds 1 MB. envsh is designed for key-value pairs, not large files.

## "CONFLICT: version conflict"

Someone pushed after you last pulled:

```bash
envsh pull production --project my-api    # get latest
# merge your changes into .env
envsh push .env --project my-api --env production
```

## Rate limits (429)

| Endpoint | Limit |
|----------|-------|
| `/auth/email-login` | 5/min per IP |
| `/auth/email-verify` | 10/min per IP |
| All other endpoints | 100/min per IP |

Wait 60 seconds and retry.

## Machine auth fails with 403

```
error: FORBIDDEN: machine is revoked
```

The machine was revoked. Create a new one:

```bash
envsh machine create new-deploy-prod --project my-api --env production
# Update ENVSH_MACHINE_KEY in your CI/CD system
```

## SSH key has a passphrase

envsh will prompt for the passphrase. To avoid repeated prompts, add your key to ssh-agent:

```bash
ssh-add ~/.ssh/id_ed25519
```

## `envsh doctor` checks

Run `envsh doctor` to diagnose issues. It checks:

1. SSH key exists at `~/.ssh/id_ed25519.pub`
2. Credentials file exists
3. Active session token is valid
4. Server is reachable
5. SSH key is registered on the server

Each failing check shows a hint with the fix.
