# 💬 Fed-Comm DM — The Block's Own DM System

**Plain terms:** This is the founder's fix for a real problem: GitHub's gists and community tabs suck for brother-to-brother messaging. So the block ships its own DM system — built as a PWA, running on GitHub's own infrastructure, with client-side encryption so conversations stay between the brothers having them.

## ⚡ What It Is

A direct-messaging client where every message is stored as **encrypted content in GitHub gists** — the transport nobody's using, repurposed as the block's post office. Messages are encrypted in the browser, before they ever leave the phone. Not even the repo maintainers can read them.

| Part | File | What it does |
|---|---|---|
| The app | [index.html](index.html) | The DM interface — PWA, phone-first |
| The brain | [chat-engine.js](chat-engine.js) | Message flow: compose → encrypt → transport → receive → decrypt → render |
| The lock | [encryption-layer.js](encryption-layer.js) | Client-side encryption — keys never leave the device |
| The ID | [manifest.json](manifest.json) | PWA identity — installs like an app (ADR-007) |
| Bubble UI | [templates/chat-bubble.html](templates/chat-bubble.html) | One message's visual pattern |
| Contact row | [templates/active-brother-row.html](templates/active-brother-row.html) | The conversation list row pattern |

## 🔐 How the Security Model Works (Plain Talk)

1. **Every conversation has a shared passphrase.** You and the brother agree on it out-of-band (in person, by phone call, in a Discussions thread — NOT in the first message).
2. **The passphrase never touches GitHub.** It stays in each brother's browser storage; it's the key material for encryption.
3. **Messages are gibberish at rest.** What lands in the gist transport is encrypted text. A maintainer, a scraper, or GitHub itself sees noise.
4. **Read the honest limits below.** This is strong privacy for brother-to-brother talk, and it is NOT a substitute for professional security when the stakes are life-and-death.

## ⚖️ The Honest Security Limits (Read These Twice)

- **This is defense against snoops, not warrants.** Client-side encryption protects conversations from casual inspection. It does not make you anonymous — GitHub still sees who created which gist, when, from what IP. If your situation requires true anonymity, this is not that tool.
- **Never share sensitive credentials over any DM.** Passwords, keys, social security numbers, client data — DMs are for coordination, not vaults (see [SECURITY.md](../SECURITY.md)).
- **Passphrase = the whole lock.** Choose a strong one. If two brothers are lazy and pick "block123", the encryption is only as strong as "block123". Same rule as your GitHub password (see [wiki: Make a GitHub Account](../wiki/First-Steps/Make-a-GitHub-Account.md) — long beats clever).
- **Younger brothers get extra care.** Any DM situation involving a minor that looks unsafe gets escalated per SECURITY.md's protect-minors rules. Non-negotiable on this block.

## 🏗️ How the Transport Works (Plain Talk)

GitHub gists — "snippets" the platform gives every account for free — become mailboxes:

```
You type → browser encrypts (encryption-layer.js) →
gist gets updated with gibberish (chat-engine.js) →
the brother's app polls the gist → his browser decrypts → he reads
```

No server to run, no bill to pay, version history for free, transport that already works on tethered 3G. Boring infrastructure repurposed into a communication layer for the block — the same philosophy as JSON-as-database (ADR-005): GitHub IS the backend.

## 🚦 Why We Built This Instead of Using the Discussions Tab

The founder's verdict, on record: **"gist and community tabs suck."** Discussions are for the porch (public, slow, threaded); brothers need the kitchen table (private, fast, direct). This wing is the kitchen table.

## 🧪 Status

🟡 **Prototype** — the architecture is sound (see ADR-004 for the full decision record) and the code is real, but it needs battle-testing by brothers on real hardware before it's trusted infrastructure. Read AGENTS.md for what the agent fleet may never do with DM data.

## 🏁 Your Move

Open `index.html` in your fork, read the interface structure, then read `chat-engine.js` top to bottom — every function has a plain-talk comment. If you understand those two files, you understand a real production messaging architecture. That's a résumé line, not a toy.
