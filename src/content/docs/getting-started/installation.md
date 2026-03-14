---
title: Installation
description: Install the envsh CLI on macOS or Linux.
---

## Quick install

```sh
curl -fsSL https://envsh.dev/install.sh | sh
```

This detects your OS and architecture, downloads the latest release, and installs to `/usr/local/bin`.

### Specific version

```sh
ENVSH_VERSION=v0.2.0 curl -fsSL https://envsh.dev/install.sh | sh
```

## Build from source

```sh
git clone https://github.com/envshq/envsh
cd envsh
make build
# Binary at ./bin/envsh
sudo mv ./bin/envsh /usr/local/bin/
```

Requires Go 1.22+.

## Verify

```sh
envsh version
# envsh v0.2.0 (or "envsh dev" for source builds)
```

## Supported platforms

| OS | Architecture | Supported |
|----|-------------|-----------|
| macOS | Apple Silicon (arm64) | Yes |
| macOS | Intel (amd64) | Yes |
| Linux | amd64 | Yes |
| Linux | arm64 | Yes |
| Windows | — | Via WSL |

## Prerequisites

You need an **Ed25519 SSH key**. If you don't have one:

```sh
ssh-keygen -t ed25519 -C "your@email.com"
```

This creates `~/.ssh/id_ed25519` (private) and `~/.ssh/id_ed25519.pub` (public). envsh also supports RSA keys as a fallback.
