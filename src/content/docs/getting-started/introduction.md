---
title: Introduction
description: What envsh is and why it exists.
---

envsh is a zero-knowledge secret synchronization tool for small teams. Your secrets are encrypted on your machine with your SSH key before they leave it. The server stores only ciphertext — it mathematically cannot read your secrets.

## The problem

Every team needs to share `.env` files. The common approaches are all bad:

- **Slack/email** — plaintext secrets in a chat log forever
- **Shared password managers** — one more SaaS that can read your secrets
- **Git (encrypted or not)** — merge conflicts, key rotation nightmares
- **Vault/AWS Secrets Manager** — the server can read everything

## How envsh is different

The server is a **dumb blob store**. When you push secrets:

1. A fresh AES-256 key is generated on your machine
2. Your `.env` file is encrypted with AES-256-GCM
3. The AES key is wrapped once per team member using their SSH public key
4. Only the ciphertext and wrapped keys are sent to the server

The server never sees the AES key. It never sees your plaintext. A compromised server leaks nothing.

## Who it's for

Small teams (2-15 people) who:

- Want to stop sharing `.env` files over Slack
- Care about security but don't want to run HashiCorp Vault
- Already have SSH keys (most developers do)
- Need CI/CD to pull secrets without shared credentials

## Architecture

```
Developer Machine                    CI/CD Machine
┌─────────────────┐                 ┌─────────────────┐
│ SSH Keys        │                 │ Machine Key     │
│ envsh CLI       │                 │ envsh CLI       │
│ (encrypt/decrypt)│                │ (decrypt only)  │
└────────┬────────┘                 └────────┬────────┘
         │ HTTPS (ciphertext only)           │
         └──────────────┬────────────────────┘
                        ▼
              ┌─────────────────┐
              │  envsh Server   │
              │  (blob store)   │
              │  PostgreSQL     │
              │  Redis          │
              └─────────────────┘
```

## Hierarchy

```
Workspace (your account)
  └── Project (a service, app, or repo)
        └── Environment (dev, staging, production)
              └── Secrets (encrypted, versioned)
```

## Two roles, that's it

| Role | Can do |
|------|--------|
| **Admin** | Invite/remove members, create/delete projects, create/revoke machines, manage SSH keys, push, pull |
| **Member** | Push and pull secrets. Manage their own SSH keys. |

No granular per-environment permissions. If you're on the team, you're trusted.
