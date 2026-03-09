---
title: Security & Crypto
description: The cryptographic design behind envsh.
---

## Zero-knowledge guarantee

The server is a **dumb blob store**. It stores ciphertext, wrapped keys, and metadata. It never receives:

- Plaintext secrets
- AES keys
- Private keys
- Unwrapped key material

A compromised server leaks nothing usable. An attacker would need both the ciphertext (from the server) and a victim's SSH private key (from their machine) to decrypt anything.

## Algorithms

| Purpose | Algorithm |
|---------|-----------|
| Bulk encryption | AES-256-GCM |
| Key wrapping | ECDH (X25519) + HKDF + AES-256-GCM |
| Key exchange | Ed25519 → X25519 conversion |
| Key derivation | HKDF-SHA256 |
| Nonces | 12 bytes, cryptographically random |
| Checksums | SHA-256 |
| Auth tokens | HMAC-SHA256 (JWT) |
| Machine auth | Ed25519 signatures |

## HKDF parameters

Hardcoded, never configurable:

- **Salt:** `envsh-v1`
- **Info:** `aes-key-wrap`

## Design principles

### Fresh key per push

Every push generates a new random AES-256 key. Keys are never reused across pushes.

### Random nonces only

GCM nonces are always 12 bytes from `crypto/rand`. Never counter-based.

### Memory zeroing

AES keys are zeroed from memory immediately after use (encrypt or decrypt).

### Append-only audit log

The `audit_log` table does not allow `UPDATE` or `DELETE`. All actions are recorded permanently.

### Conflict detection

Every push includes `base_version`. The server uses `SELECT ... FOR UPDATE` to prevent concurrent overwrites.

## Machine key format

```
envsh-machine-v1:base64(Ed25519_private_key)
```

The prefix `envsh-machine-v1:` identifies the key format. The base64 payload is the raw Ed25519 private key (64 bytes).

## Authentication

### Human auth

1. User submits email → server sends 6-digit code (5-minute TTL)
2. User submits code → server issues JWT (24h) + refresh token (30d, single-use)
3. Code is stored as SHA-256 hash in Redis
4. 3 attempts per code, 10 failures per hour triggers 1-hour lockout

### Machine auth

1. CLI sends machine ID → server returns 32-byte nonce (30-second TTL)
2. CLI signs nonce with Ed25519 private key
3. Server verifies signature against stored public key
4. Server issues JWT (15 minutes, non-refreshable)

## Threat model

| Threat | Mitigated? | How |
|--------|-----------|-----|
| Server compromise | Yes | Server only has ciphertext |
| Database dump | Yes | All secrets encrypted, keys wrapped |
| Man-in-the-middle | Yes | TLS + GCM authentication |
| Stolen SSH key | Partial | Attacker needs ciphertext too (from server) |
| Brute-force login | Yes | Rate limits + lockout |
| Replay attacks | Yes | Single-use nonces, JWT expiry |
| Version overwrites | Yes | Conflict detection with `FOR UPDATE` |

## Open source

The cryptographic library (`pkg/crypto/`) is MIT-licensed and open for audit. The server is AGPL-3.0.

- CLI + crypto: [github.com/envshq/envsh](https://github.com/envshq/envsh)
- Server: [github.com/envshq/envsh-server](https://github.com/envshq/envsh-server)
