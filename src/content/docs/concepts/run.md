---
title: Run
description: Inject secrets into a process without writing them to disk.
---

`envsh run` pulls secrets, injects them as environment variables, and runs a command. The secrets are never written to disk.

```bash
envsh run --project my-api production -- node server.js
```

## Examples

```bash
# Run a Node.js app
envsh run --project my-api production -- node server.js

# Run a database migration
envsh run --project my-api production -- npx prisma migrate deploy

# Run a deploy script
envsh run --project my-api staging -- ./deploy.sh
```

## The `--` separator

The `--` is required to separate envsh flags from the command being run.

```bash
# Correct — deploy.sh gets --verbose as its own flag
envsh run --project my-api production -- ./deploy.sh --verbose

# Wrong — envsh tries to parse --verbose
envsh run --project my-api production ./deploy.sh --verbose
```

## Environment variable merging

The subprocess receives your current shell environment **plus** the pulled secrets. Secrets override existing env vars with the same name.

## Exit code propagation

The exit code of the subprocess is propagated. If `node server.js` exits with code 1, `envsh run` also exits with code 1. This makes it safe to use in scripts and CI pipelines.

## Custom SSH key

```bash
envsh run --project my-api --key ~/.ssh/id_ed25519_work production -- node server.js
```
