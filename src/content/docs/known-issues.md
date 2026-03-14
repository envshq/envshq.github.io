---
title: Known Issues
description: Current limitations and known bugs in envsh.
---

envsh is in **early access**. The core encryption, push/pull, team management, and CI/CD flows all work, but there are rough edges. This page tracks them honestly.

## Active issues

### Re-push required after adding team members

When a new member or machine is added, they can't pull existing secrets until someone pushes again. This is by design — secrets are encrypted per-recipient, so a fresh push is needed to include the new key.

**Workaround:** After inviting someone or creating a machine, re-push the latest secrets:

```bash
envsh pull production --project my-api
envsh push .env --project my-api --env production
```

A future `envsh rewrap` command ([#3](https://github.com/envshq/envsh/issues/3)) will allow granting access to new keys without re-pushing the full secret.

### `envsh run` flag ordering ([#19](https://github.com/envshq/envsh/issues/19))

Flags must come before the environment argument:

```sh
# This works
envsh run --project myapp production -- node server.js

# This doesn't
envsh run production --project myapp -- node server.js
```

**Status:** Open.

### No Windows support

envsh works on macOS and Linux. Windows is only supported through WSL (Windows Subsystem for Linux).

### API may change

The REST API and CLI flags may change between 0.x releases. We'll follow semver — breaking changes bump the minor version until 1.0.

## Resolved issues

### Multi-workspace switching

**Fixed in v0.2.0.** Previously, being invited to another workspace required workarounds. Now use `envsh workspace list` to see all workspaces and `envsh workspace switch WORKSPACE_ID` to switch context.

### Member removal didn't revoke access

**Fixed in v0.2.0.** Removing a member now instantly revokes their API access. The removed member can still run `envsh workspace list` and `envsh workspace switch` to return to their own workspace.

### SSH key registration missing fingerprint

**Fixed in v0.1.1.** The `envsh keys add` command was not sending the key fingerprint to the server, causing key lookups to fail during decryption.

## Limitations (by design, for now)

These are deliberate scope decisions for the initial release — not missing features. That said, we're open to building them if there's demand:

- **No web dashboard** — CLI only for now. A lightweight read-only dashboard is something we'd consider.
- **No dynamic secrets** — static key-value pairs only. Rotation and dynamic generation may come later.
- **No secret rotation** — push a new version manually. Automated rotation is on the radar.
- **No granular permissions** — admin or member, no per-environment ACLs. Fine-grained roles are a possibility for larger teams.
- **No SSO/SAML** — email + code authentication only. SSO is likely the first of these to be built.
- **No integrations** — no native Kubernetes, Terraform, or cloud provider plugins yet.

If any of these matter to you, [let us know](https://github.com/envshq/envsh/issues) — real demand shapes the roadmap.

## Roadmap

We track all planned work as GitHub issues. These are actively being worked on:

- [envsh rewrap](https://github.com/envshq/envsh/issues/3) — grant access to new members without re-pushing
- [Invite email notifications](https://github.com/envshq/envsh/issues/2) — notify members when invited
- [Project config file](https://github.com/envshq/envsh/issues/6) — `.envsh.json` for default project/env
- [envsh diff](https://github.com/envshq/envsh/issues/8) — compare environments
- [envsh log](https://github.com/envshq/envsh/issues/7) — view push history
- [Access audit](https://github.com/envshq/envsh/issues/10) — see who can decrypt what

[See all open issues](https://github.com/envshq/envsh/issues) — contributions are welcome.

## Reporting issues

Found a bug or have a feature request? [Open an issue on GitHub](https://github.com/envshq/envsh/issues).
