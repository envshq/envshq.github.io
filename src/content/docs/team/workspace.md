---
title: Workspace & Members
description: Managing your team in envsh.
---

## Workspace

A workspace is your team's account. It's created automatically when you first log in. Every user gets their own workspace, and can be invited to others.

```bash
envsh workspace
# ID:      abc123-...
# Name:    alice@example.com
# Slug:    alice
# Role:    admin
```

## Multiple workspaces

You can belong to multiple workspaces — your own, plus any you've been invited to.

### List all workspaces

```bash
envsh workspace list
# NAME                   SLUG      ROLE     ID
# alice@example.com      alice     admin    abc123-...
# Acme Corp              acme      member   def456-...
```

### Switch workspace

```bash
envsh workspace switch def456-...
# ok: Switched to workspace Acme Corp
```

After switching, all commands (push, pull, project list, etc.) operate in the context of the selected workspace.

## Invite a member

Admin only.

```bash
envsh invite bob@example.com
# ok: Invited bob@example.com as member

# Invite as admin
envsh invite carol@example.com --role admin
# ok: Invited carol@example.com as admin
```

After being invited, Bob can `envsh login` with his email. No separate acceptance step — the invite creates his user record immediately. He then runs `envsh workspace list` to see the new workspace and `envsh workspace switch` to enter it.

:::note
The next time anyone pushes secrets, Bob's SSH key will be included as a recipient. Until then, he can't decrypt existing versions. A future `envsh rewrap` command will allow granting access without re-pushing.
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

### What happens on removal

- **Instant access revocation** — Bob is immediately blocked from all workspace API calls (push, pull, list projects, etc.). No need to wait for his JWT to expire.
- **Workspace switching still works** — Bob can run `envsh workspace list` and `envsh workspace switch` to return to his own workspace.
- **Existing ciphertext is immutable** — Old secret versions remain encrypted with Bob's key. If Bob previously pulled and saved plaintext locally, removing him doesn't delete that. Rotate any secrets Bob had access to.
- **Future pushes exclude Bob** — New pushes won't include his key as a recipient.

:::tip
After removing a member, rotate secrets they had access to by pushing new values. This is standard practice — no secrets manager can un-read secrets someone already downloaded.
:::

## Roles

| Role | Capabilities |
|------|-------------|
| **admin** | Invite/remove members, create/delete projects, create/revoke machines, manage SSH keys, push, pull, view audit log |
| **member** | Push, pull, manage their own SSH keys |

Two roles. No granular per-environment permissions. If you're on the team, you're trusted.
