---
title: CLI Commands
description: Complete command reference for the envsh CLI.
---

## Global flags

These work on every command:

| Flag | Default | Description |
|------|---------|-------------|
| `--output table\|json\|plain` | `table` | Output format for list commands |
| `--server URL` | `https://api.envsh.dev` | Override the API server URL |
| `--config PATH` | — | Custom config file path |

---

## `envsh login`

Authenticate with email and a 6-digit code.

```
envsh login [--email EMAIL]
```

| Flag | Description |
|------|-------------|
| `--email` | Email address (prompted if not provided) |

On first login, creates your workspace and registers your SSH key automatically.

---

## `envsh logout`

Revoke your refresh token and clear local credentials.

```
envsh logout
```

---

## `envsh push`

Encrypt a `.env` file and upload it.

```
envsh push FILE --project SLUG --env ENV [--message MSG]
```

| Argument/Flag | Description |
|---------------|-------------|
| `FILE` | Path to the `.env` file |
| `--project` | Project slug (required) |
| `--env` | Environment name (required) |
| `--message` | Describe what changed |

---

## `envsh pull`

Download and decrypt secrets.

```
envsh pull ENV --project SLUG [options]
```

| Argument/Flag | Description |
|---------------|-------------|
| `ENV` | Environment name |
| `--project` | Project slug (required) |
| `--output FILE` | Output file (default: `.env`) |
| `--format` | `env` (default), `export`, `json` |
| `--stdout` | Print to stdout instead of file |
| `--key PATH` | SSH private key (default: `~/.ssh/id_ed25519`) |

---

## `envsh run`

Pull secrets, inject as env vars, run a command.

```
envsh run --project SLUG [--key PATH] ENV -- COMMAND [ARGS...]
```

| Argument/Flag | Description |
|---------------|-------------|
| `ENV` | Environment name |
| `--project` | Project slug (required) |
| `--key PATH` | SSH private key |
| `-- COMMAND` | Command to run (after `--` separator) |

---

## `envsh project`

Manage projects.

```
envsh project list
envsh project create NAME SLUG
envsh project delete PROJECT_ID
```

---

## `envsh keys`

Manage SSH keys.

```
envsh keys list
envsh keys add [--file PATH] [--name LABEL]
envsh keys revoke FINGERPRINT_OR_ID
```

| Flag | Description |
|------|-------------|
| `--file` | Path to SSH public key (default: `~/.ssh/id_ed25519.pub`) |
| `--name` | Display label |

---

## `envsh workspace`

Show current workspace details.

```
envsh workspace
```

### `envsh workspace list`

List all workspaces you belong to.

```
envsh workspace list
```

### `envsh workspace switch`

Switch to a different workspace. All subsequent commands operate in that workspace.

```
envsh workspace switch WORKSPACE_ID
```

---

## `envsh invite`

Invite a member to your workspace (admin only).

```
envsh invite EMAIL [--role admin|member]
```

Default role is `member`.

---

## `envsh members`

List workspace members.

```
envsh members
```

---

## `envsh remove`

Remove a member from the workspace (admin only). Access is revoked instantly — the member is blocked from all workspace operations immediately.

```
envsh remove EMAIL
```

---

## `envsh machine`

Manage machine identities.

```
envsh machine list
envsh machine create NAME --project SLUG --env ENV
envsh machine revoke NAME_OR_ID
```

---

## `envsh audit`

View the audit log (admin only).

```
envsh audit [--limit N]
```

Default limit: 50. Maximum: 200.

---

## `envsh versions`

View secret version history.

```
envsh versions ENV --project SLUG [--limit N]
```

---

## `envsh doctor`

Run diagnostic checks.

```
envsh doctor
```

Checks: SSH key exists, credentials file, session token, server reachable, key registered.

---

## `envsh version`

Print the CLI version.

```
envsh version
```
