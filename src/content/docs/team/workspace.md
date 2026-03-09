---
title: Workspace & Members
description: Managing your team in envsh.
---

## Workspace

A workspace is your team's account. It's created automatically when you first log in.

```bash
envsh workspace
# {
#   "id": "...",
#   "name": "alice@example.com",
#   "slug": "alice",
#   "members": [...],
#   "subscription": { "plan": "free", "seat_count": 3 }
# }
```

## Invite a member

Admin only.

```bash
envsh invite bob@example.com
# ok: Invited bob@example.com as member

# Invite as admin
envsh invite carol@example.com --role admin
# ok: Invited carol@example.com as admin
```

After being invited, Bob can `envsh login` with his email. No separate acceptance step — the invite creates his user record immediately.

:::note
The next time anyone pushes secrets, Bob's SSH key will be included as a recipient. Until then, he can't decrypt existing versions.
:::

## List members

```bash
envsh members
# EMAIL                  ROLE    ID
# alice@example.com      admin   abc123-...
# bob@example.com        member  def456-...
```

## Remove a member

Admin only. You cannot remove yourself.

```bash
envsh remove bob@example.com
# ok: Removed bob@example.com from workspace
```

Removing a member does not affect existing secret versions — the ciphertext is immutable. Bob can still decrypt old versions he had access to, but new pushes won't include his key.

## Roles

| Role | Capabilities |
|------|-------------|
| **admin** | Invite/remove members, create/delete projects, create/revoke machines, manage SSH keys, push, pull |
| **member** | Push, pull, manage their own SSH keys |

Two roles. No granular per-environment permissions. If you're on the team, you're trusted.

## Plan limits

| Plan | Members | Price |
|------|---------|-------|
| **Free** | Up to 3 (admin included) | Free |
| **Team** | Unlimited | $1.99/seat/month |
