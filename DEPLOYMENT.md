# 🚢 FED-EDU DEPLOYMENT — Shipping To The World

## Where FED-EDU Deploys

**GitHub Pages** is the home port: free, HTTPS by default, reachable on every device on Earth with a browser. The `build.yml` workflow deploys automatically on every push to `main` — no manual steps, no server bills, no DevOps degree required.

## Turning It On (One-Time Org Setup)

1. Org → repo (`fed-edu` main repo) → **Settings → Pages**
2. Source: **GitHub Actions** (not "Deploy from branch" — the workflow handles it)
3. Save. Push to `main` once. Live in ~60 seconds at `https://<org>.github.io/fed-edu/`
4. PWA is automatic: any phone can "Add to Home Screen" the dashboard as a real app icon

## The Deployment Surface

| Surface | What Ships There | How |
|---|---|---|
| Main dashboard | `core-system/` | build.yml → Pages |
| Rap Lab, StatTracker, Media FX, Streamer Tools | `sandbox-blueprints/*/index.html` | Each blueprint is forkable; brothers deploy their own copies to their own Pages |
| DM client | `fed-comm-dm/` | Deployed under the org or run locally; uses GitHub API for transport |
| Excellence matrix gallery | `excellence-matrix/` | Pages, same pipeline |
| Hustle index | `hustle-index/` | Pages, same pipeline |

**Brothers shipping their own:** fork → edit → your-username.github.io/your-project. Your deploy, your URL, your ownership. The org never owns what you build from the blueprints — that's the MIT license doing its job.

## Custom Domain (v1.0 Roadmap Item)

When the block gets its own address:
1. Buy the domain (community funds, Level 3 vote per GOVERNANCE.md)
2. Repo Settings → Pages → Custom domain → enter it
3. Commit a `CNAME` file to `core-system/` with the domain in it
4. DNS at the registrar: A records to GitHub's Pages IPs (185.199.108–111.153) + CNAME for the subdomain. GitHub's docs walk each registrar through it.

HTTPS: enable "Enforce HTTPS" once the certificate issues. Until then, the default `github.io` URL stays HTTPS, so nothing ships insecure in the meantime.

## Android APK Wrapping (The "Real App" Play)

A web app that installs from a link is great; an APK a brother can sideload on a phone with no app store account is better. The pipeline for wrapping the PWA (Capacitor or PWABuilder) is a v2.0 roadmap item; the DEPLOYMENT steps will live here when it ships:

1. PWA manifest + service worker already in place (they're in `core-system/`)
2. Wrap with Capacitor → generates an Android project → build APK
3. Distribute the APK from the org's releases page — sideload-friendly, no store gatekeeper

## Rollback

Pages deploys are atomic: if a push breaks the live site, revert the commit (`git revert`) and push — the workflow redeploys the last good state in about a minute. No 2AM panic, no war rooms. Git history is the safety net.

## Deployment Rules

1. **Main stays deployable.** Broken builds on main get reverted fast, not "fixed eventually."
2. **Every deploy must pass the 3-second rule** (see BUILD.md) — throttle it in your head before you push.
3. **No secrets in deployed output.** Tokens live in repo secrets for workflows; `.env` files never get committed (see SECURITY.md).
4. **Announce ships** in the Ship Yard so brothers know what's new — every deploy is somebody's first impression of the block.

## When Deployment Acts Up

Common fixes in order: check the Actions tab (the failed run names its problem) → confirm Pages source is "GitHub Actions" → confirm artifact path is `./core-system` → clear and redeploy. Still stuck? `bug_report` issue with the failed run link; the community debugs deploys together.
