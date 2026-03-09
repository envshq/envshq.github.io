---
title: SSH Keys
description: Managing SSH keys for secret encryption.
---

Your SSH public key is how envsh encrypts secrets for you. Without a registered key, nobody can push secrets that you can decrypt.

## How it works

When someone pushes secrets, the AES key is wrapped once per registered SSH key. Each key holder gets their own copy of the wrapped key — so any registered key can decrypt.

Only the **public key** is sent to the server. Your private key never leaves your machine.

## List keys

```bash
envsh keys list
# LABEL                         TYPE      FINGERPRINT                                   ID
# /Users/alice/.ssh/id_ed25519  ed25519   sha256:AbCdEf...                              abc123-...
```

## Register a key

On first login, envsh auto-detects and registers your SSH key. To register additional keys:

```bash
# Auto-detect default key
envsh keys add

# Specific key with a label
envsh keys add --file ~/.ssh/id_ed25519_work --name "work laptop"
# ok: Registered ed25519 key work laptop
```

## Multiple devices

Register a key for each device you work on:

```bash
# On your work laptop
envsh keys add --name "work laptop"

# On your home machine
envsh keys add --name "home desktop"
```

Each registered key gets its own wrapped copy of the AES key in every push.

## Revoke a key

When you rotate SSH keys or lose a device:

```bash
# By fingerprint
envsh keys revoke sha256:AbCdEf...

# By ID
envsh keys revoke abc123-...
```

After revoking, new pushes won't include that key as a recipient. Old versions remain decryptable — ciphertext is immutable.

## Supported key types

| Type | Supported | Notes |
|------|-----------|-------|
| **Ed25519** | Yes (recommended) | Converted to X25519 for key wrapping |
| **RSA-4096** | Yes (fallback) | Larger keys, slower operations |
