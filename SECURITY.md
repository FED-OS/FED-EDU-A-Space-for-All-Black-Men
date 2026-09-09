# 🔒 FED-EDU SECURITY — Protecting The Block

## Reporting A Vulnerability

**Found a security hole in FED-EDU code? Don't post it publicly.**

Open a **private security advisory** (GitHub → Security tab → Report a vulnerability), or if that's not available in this org yet, email the security contact below with the subject `FED-EDU SECURITY`. Include what the issue is, how you found it, and steps to reproduce if you can. If you can't use either channel, open a bug_report issue that says only "security matter — contact needed" with no details in the post itself, and a maintainer will reach out through DMs.

**Contact:** `security@fedpromptly.com` *(replace with the org's real security contact before launch)*

**Response targets:** acknowledgment within 48 hours, assessment within 7 days, fix or mitigation plan communicated within 30 days. Brothers who report real vulnerabilities in good faith get public dap in the CHANGELOG (with permission) — white hat energy is exactly what this community wants to grow.

## What We Protect

**The younger brothers.** This space has minors in it. Report anything that endangers them — grooming, explicit content directed at minors, any attempt to private-message a young brother toward unsafe situations — immediately and directly to maintainers. These reports bypass every queue. If required by law, we report to authorities. This is Rule 6 of the Code of Conduct: no appeal, no exceptions.

**Member identities.** Brothers here include people who can't risk exposure — undocumented brothers, trans brothers not out everywhere, returning citizens, brothers in countries where being themselves is dangerous. Doxxing any member — posting real names, addresses, workplaces, or photos without consent — is an instant removal offense and may be reported where appropriate.

**Member credentials.** The DM system and hustle-index never ask for your password. If anything in this ecosystem asks for your GitHub password, it's a phishing attempt — report it. GitHub tokens stay in `.env` files, which are gitignored. Never paste tokens into issues, discussions, or DMs. If you leak one, revoke it immediately at github.com/settings/tokens — takes 30 seconds.

**Community funds.** The Ko-fi ledger is public. Funds move only through the approval process in GOVERNANCE.md. Anything that looks like fund manipulation gets frozen and investigated.

## Security Practices We Build By

1. **Client-side encryption for closed circuits.** The fed-comm-dm system encrypts message content in the browser before anything touches storage. Private means private.
2. **Least-privilege tokens.** Tools ask for the narrowest GitHub permission that works, never blanket admin scopes.
3. **No secrets in the repo.** `.gitignore` blocks `.env`, keys, and credential files. CI workflows use repository secrets, not pasted values.
4. **HTTPS everywhere.** GitHub Pages serves over TLS by default; every link in the ecosystem stays on it.
5. **Minimal data collection.** We collect what the community needs to function (usernames, flags, hustle listings) and nothing more. No tracking, no analytics firehose, no selling data — ever. We're the platform that doesn't hustle its own people.
6. **Dependency hygiene.** Blueprints stay lean, use few dependencies, and get updated when advisories drop.
7. **Backups through git.** Everything is version-controlled. Nothing lives in only one place or only one head.

## Scope & Disclosure Policy

This policy covers the FED-EDU org, its repos, the dashboard at its Pages URL, and the fed-comm-dm system. Safe harbor: we will not pursue action against good-faith researchers who respect privacy, avoid data destruction, and give us reasonable time to fix before public disclosure. Coordinated disclosure — we fix, credit, then talk about it.

## The Bottom Line

The mainstream internet treats our data like a product to mine. This block treats it like something to guard. Security here isn't a feature — it's self-defense for the community.
