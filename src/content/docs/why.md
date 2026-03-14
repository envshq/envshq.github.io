---
title: Why I Built This
description: The story behind envsh.
---

I built envsh because I was tired of how we handle secrets.

## The workplace problem

At work, we pass `.env` files around on Slack. Someone updates a database password, posts it in a channel, and everyone copies it into their local setup. The credentials sit in chat history forever. We all know it's bad, but the alternatives feel worse.

## The personal project problem

For my own projects, I looked at what's out there. HashiCorp Vault is powerful but it's a whole infrastructure project just to share a few API keys. Doppler and Infisical are nice, but they're SaaS platforms that can read your secrets. AWS Secrets Manager bills per secret per month. Every option felt like overkill for what I actually needed: share a `.env` file securely with a small team.

## What I wanted

Something that:

- **Does one thing well** — sync secrets across a team, nothing more
- **Uses keys I already have** — every developer has SSH keys
- **Can't read my secrets** — even if the server gets compromised
- **Works like git** — push, pull, done
- **Takes minutes to set up** — not hours or days

None of the existing tools hit all five. So I built envsh.

## The design constraint

The server is a dumb blob store. It receives ciphertext and stores it. It never sees the AES key, the plaintext, or anyone's private key. This isn't a policy decision that could be reversed — it's a mathematical guarantee built into the protocol. A compromised server leaks nothing usable.

This constraint makes envsh simpler, not harder. No key management service, no access policies, no rotation engine. The complexity lives in the client where it belongs.

## Trade-offs I'm OK with

envsh deliberately doesn't do a lot of things:

- No web dashboard — your terminal is the interface
- No dynamic secrets — static key-value pairs only
- No granular permissions — two roles (admin and member), that's it
- No integrations — no Kubernetes, Terraform, or cloud provider plugins
- No SSO — email and a 6-digit code

These aren't missing features. They're scope decisions. envsh does one thing — zero-knowledge secret sync — and I'd rather do that one thing well than do ten things poorly.

## Open source

Everything about envsh is open source. The CLI, the server, the crypto library, the documentation site — all of it. Nothing is hidden. The crypto library is MIT-licensed so anyone can audit it. Fork it, self-host it, do whatever you want with it.

There's a free hosted server at `api.envsh.dev` running on a single VPS, on my tab. This is my contribution to open source. I don't know how long I'll be able to keep it running, but I want to keep it alive for as long as I can. And if you'd rather not depend on that, self-hosting takes minutes.

If envsh solves the same problem for you that it solved for me, give it a try.

```sh
curl -fsSL https://envsh.dev/install.sh | sh
```
