---
title: Known Issues
description: Current limitations and known bugs in envsh.
---

envsh is in **early access** (v0.1.x). The core encryption and push/pull flow works, but there are rough edges. This page tracks them honestly.

## Active issues

### Multi-workspace switching

When you're invited to someone else's workspace, you can't easily switch to it yet. Your JWT is scoped to your own auto-created workspace, so `envsh project list` shows your projects, not the ones you were invited to.

**Workaround:** The workspace owner should re-invite you. We're working on `envsh workspace list` and `envsh workspace switch` commands to fix this properly.

**Status:** In progress.

### Re-push required after adding team members

When a new member is added to the workspace, they can't pull existing secrets until someone pushes again. This is by design — secrets are encrypted per-recipient, so a fresh push is needed to include the new member's public key.

**Workaround:** After inviting someone, re-push the latest secrets:

```bash
envsh pull production --project my-api
envsh push .env --project my-api --env production
```

### No Windows support

envsh works on macOS and Linux. Windows is only supported through WSL (Windows Subsystem for Linux).

### API may change

The REST API and CLI flags may change between 0.x releases. We'll follow semver — breaking changes bump the minor version until 1.0.

## Resolved issues

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

## Reporting issues

Found a bug? [Open an issue on GitHub](https://github.com/envshq/envsh/issues).
