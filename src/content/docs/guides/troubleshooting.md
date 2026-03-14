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

## "UNAUTHORIZED: access revoked"

You were removed from this workspace. Your JWT is still valid but access has been revoked.

```bash
# See which workspaces you belong to
envsh workspace list

# Switch to your own workspace (or another one you're a member of)
envsh workspace switch WORKSPACE_ID
```

## "decrypting: no recipient entry for this key"

Your key fingerprint is not in the recipients list. This happens when:

- You or your machine were added **after** the secret was last pushed
- You're using a different SSH key than the one registered
- (CI/CD) The machine was created but nobody re-pushed to include the machine's key

Fix:

```bash
# Check which keys are registered
envsh keys list

# Register your key if it's not there
envsh keys add

# Have someone push again to include your key as a recipient
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
# Then re-push to include the new machine as a recipient
envsh push .env --project my-api --env production
```

## Machine "no recipient entry" in CI/CD

The machine was created but nobody re-pushed secrets to include it as a recipient. On your local machine:

```bash
envsh pull production --project my-api
envsh push .env --project my-api --env production --message "include machine key"
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
