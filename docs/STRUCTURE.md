# STRUCTURE — THE FULL MAP OF THE BLOCK

Every file in the FED-EDU repo, one tree, no mystery. 157 files across 44
directories. Nothing hidden, nothing unexplained — the block builds in the open.

If you're new: start at `README.md`, walk into `wiki/First-Steps/`, and use this
page whenever you need to find a room. Every folder below says what it's for in
one line of plain talk.

## THE TREE

```
.
|-- .github
|   |-- ISSUE_TEMPLATE
|   |   |-- 01_hustle_spawn.md
|   |   |-- 02_bug_alert.md
|   |   |-- 03_project_ship.md
|   |   |-- bug_report.md
|   |   |-- custom.md
|   |   `-- feature_request.md
|   |-- workflows
|   |   |-- auto_dap.yml
|   |   |-- build.yml
|   |   `-- leaderboard_sync.yml
|   |-- CODE_OF_CONDUCT.md
|   |-- DISCUSSION_WELCOME_README.md
|   |-- PULL_REQUEST_TEMPLATE.md
|   |-- README.md
|   `-- social-image.png
|-- community-boards
|   |-- showcase-vault
|   |   `-- shared_links.json
|   |-- diaspora-data.json
|   |-- diaspora-map.js
|   |-- help-desk-bridge.js
|   |-- index.html
|   `-- leaderboard.json
|-- core-system
|   |-- fed-os-bridge
|   |   |-- hardware_profiler.py
|   |   |-- local_server_boot.bat
|   |   `-- tether_monitor.sh
|   |-- app.js
|   |-- index.html
|   |-- manifest.json
|   |-- service-worker.js
|   `-- styles.css
|-- courses-and-guides
|   |-- 01-easytether-mastery
|   |   |-- README.md
|   |   |-- android-setup.md
|   |   `-- pc-usb-bridge.md
|   |-- 02-real-life-minecraft
|   |   |-- README.md
|   |   |-- brick-one-html.md
|   |   `-- index.html
|   `-- 03-the-corporate-ship
|       |-- README.md
|       |-- interview-cheat-sheet.md
|       `-- markdown-resume-builder.md
|-- discussion
|   |-- pinned
|   |   |-- how-to-earn-raffle-tickets.md
|   |   |-- introduce-yourself.md
|   |   `-- welcome-to-the-block.md
|   |-- templates
|   |   |-- new_member_intro.md
|   |   `-- project_help_request.md
|   `-- categories.json
|-- excellence-matrix
|   |-- database
|   |   |-- Hollywood_directors.json
|   |   |-- business_moguls.json
|   |   |-- executive_power.json
|   |   |-- golden_cleats.json
|   |   |-- hiphop_engineers.json
|   |   |-- historical_leaders.json
|   |   `-- streaming_giants.json
|   |-- index.html
|   `-- matrix-engine.js
|-- fed-comm-dm
|   |-- templates
|   |   |-- active-brother-row.html
|   |   `-- chat-bubble.html
|   |-- README.md
|   |-- chat-engine.js
|   |-- encryption-layer.js
|   |-- index.html
|   `-- manifest.json
|-- fedpromptly-coach
|   |-- prompts
|   |   |-- debug_helper.txt
|   |   |-- project_generator.txt
|   |   `-- resume_optimizer.txt
|   |-- context-payload.json
|   `-- engine-connector.js
|-- hustle-index
|   |-- commissions
|   |   |-- HUSTLE-20260315-01.json
|   |   `-- roster.json
|   |-- members
|   |   |-- roster.json
|   |   `-- sample_brother_hustle.json
|   |-- commissions_schema.json
|   |-- index.html
|   `-- market-engine.js
|-- physical-raffles
|   |-- assets
|   |   `-- safe-shipping-checklist.md
|   |-- earn-tickets.json
|   `-- raffle-logic.js
|-- prompts
|   |-- coding-coach
|   |   |-- explain_like_im_five.txt
|   |   `-- fix_my_code_step_by_step.txt
|   |-- project-generator
|   |   `-- match_my_hobby_to_project.txt
|   |-- resume-hustle
|   |   `-- street_to_executive.txt
|   |-- street-translator
|   |   `-- translate_tech_docs.txt
|   `-- README.md
|-- sandbox-blueprints
|   |-- 01-rap-lab
|   |   |-- audio-core.js
|   |   |-- index.html
|   |   `-- project-manifest.json
|   |-- 02-football-stats
|   |   |-- db-bridge.js
|   |   |-- index.html
|   |   `-- schema.sql
|   |-- 03-media-fx-clipper
|   |   |-- bg-remover.py
|   |   `-- index.html
|   |-- 04-streamer-tools
|   |   |-- config.example.json
|   |   |-- index.html
|   |   |-- stream-alert-bot.js
|   |   `-- trend-scraper.py
|   `-- README.md
|-- support-the-block
|   |-- archive-and-stash
|   |   `-- .gitkeep
|   |-- README.md
|   `-- kofi-button.html
|-- urban-dictionary
|   |-- terms
|   |   |-- api_endpoint.md
|   |   |-- database_supabase.md
|   |   |-- github_fork.md
|   |   |-- json_explained.md
|   |   |-- prompt_engineering.md
|   |   `-- saas_model.md
|   |-- index.html
|   |-- index.json
|   `-- search-engine.js
|-- wiki
|   |-- Building
|   |   |-- Publish-on-GitHub-Pages.md
|   |   |-- Turn-Website-Into-App.md
|   |   `-- Your-First-Website.md
|   |-- First-Steps
|   |   |-- Fork-Your-First-Repo.md
|   |   |-- Make-a-GitHub-Account.md
|   |   `-- Push-Your-First-Change.md
|   |-- Getting-Online
|   |   |-- EasyTether-Basics.md
|   |   `-- Free-WiFi-Spots-and-Libraries.md
|   |-- Hustling
|   |   |-- List-on-Hustle-Index.md
|   |   |-- Price-Your-Work.md
|   |   `-- Set-Up-Ko-fi.md
|   `-- Home.md
|-- .gitignore
|-- ADR.md
|-- AGENTS.md
|-- AUTHORS.md
|-- BUILD.md
|-- CHANGELOG.md
|-- CITATIONS.md
|-- CLAUDE.md
|-- CODE_OF_CONDUCT.md
|-- CONTRIBUTING.md
|-- COPYING.md
|-- DEPLOYMENT.md
|-- FAQ.md
|-- GOVERNANCE.md
|-- INSTALL.md
|-- LICENSE
|-- MAINTAINERS.md
|-- NOTICE.md
|-- PRICING.md
|-- PULL_REQUEST_TEMPLATE.md
|-- README.md
|-- ROADMAP.md
|-- SECURITY.md
|-- SUMMARY.md
|-- SUPPORT.md
|-- STRUCTURE.md
|-- app.js
|-- bug_report.md
|-- feature_request.md
|-- favicon.ico
|-- icon-192.png
|-- icon-512-maskable.png
|-- icon-512.png
|-- index.html
|-- manifest.json
|-- pops.js
|-- service-worker.js
|-- styles.css
|-- todo.md
`-- usage.md
```

## THE ROOMS, IN PLAIN TALK

**`.github/` (14 files)** — the org's front office. Issue templates so every
ticket lands pre-shaped (hustle spawns, bug alerts, project ships), the three
workflows that run the block's checks (`build.yml` ships the guardrails,
`auto_dap.yml` keeps the DAP honest, `leaderboard_sync.yml` counts the receipts),
the org profile, and `social-image.png` — the banner the world sees when somebody
links the block.

**`core-system/` (8 files)** — the front door and the engine room. `index.html`
is the dashboard every brother lands on; the manifest and service worker make it
installable as an app on any phone (PWA, works offline); `fed-os-bridge/` holds
the rig tools — hardware profiler, tether monitor, PC boot script.

**`courses-and-guides/` (9 files)** — the three ships: EasyTether Mastery (get
online on a tethered phone), Real-Life Minecraft (first HTML, with the offline
playground), The Corporate Ship (resume + interview, turn skills into income).

**`urban-dictionary/` (9 files)** — the decoder ring. The live search page, six seed terms translated
street-to-tech (`api_endpoint`, `database_supabase`, `github_fork`, `json`,
`prompt_engineering`, `saas_model`), the search engine, and the index that says
what's in the book.

**`prompts/` (6 files)** — the coach's prompts: coding coach, project matcher,
resume hustle, and the street-translator that converts any tech doc into plain
talk. Paste into any AI and get a teacher that speaks your language.

**`wiki/` (12 files)** — the manual for the whole journey: account → first
change → first website → publish → app; getting online on tether and free Wi-Fi;
and the hustle pages — list yourself, price your work, set up Ko-fi.

**`discussion/` (6 files)** — the pinned welcome posts and the templates for
intros and project help. The categories file defines the rooms.

**`fed-comm-dm/` (7 files)** — the custom DM system, built because the gist and
community tabs suck. Chat engine, encryption layer, templates, and the only
channel an address ever moves through (the shipping law).

**`fedpromptly-coach/` (5 files)** — the connector between the block and the
fedpromptly engine: context payload, engine connector, and the three heavy
prompts (debug helper, project generator, resume optimizer).

**`sandbox-blueprints/` (13 files)** — the four ready-to-fork projects: Rap Lab
(music brothers), StatTracker (ball brothers), Media FX Clipper (eye brothers),
Streamer Tools (going-live brothers). Plus the README with the starter loadout
that goes on every raffle machine.

**`excellence-matrix/` (9 files)** — the receipts that we built this before:
seven databases of leaders, executives, moguls, engineers, cleats, directors,
and streamers — every entry with a claim, receipts, and the transfer. The engine
renders them; the index is the door.

**`hustle-index/` (7 files)** — the commission board: the schema, the rate-floor
law, sample member profile, first commission, and the rosters that list who's
selling and what's open. 100% to the shipping brother.

**`community-boards/` (6 files)** — where the block meets: the diaspora map
(emoji grid, tap a region, see the hubs and brother counts), the help desk
bridge (GitHub issues, no waiting room), the showcase vault (shipped work with
vouches), and the leaderboard (same economics as the raffle tickets).

**`physical-raffles/` (3 files)** — the hardware hope pipeline: provably fair
draw math (any brother can re-run the seed and verify the winner), the ticket
economy (how tickets are earned), and the safe-shipping checklist — the law
that keeps addresses out of git history forever.

**`support-the-block/` (3 files)** — the funding room: the Ko-fi drop-in button
(`YOUR_USERNAME` placeholder, swap-or-fail rule enforced by `build.yml`), the
money README, and the archive-and-stash where closed cycles get filed.

**The root (40 files)** — `index.html` is the front door (every room one tap away), and the PWA spine that makes the whole block installable: `manifest.json` (root scope, every room), `service-worker.js` (offline shell for all rooms), `app.js` (registers the worker), `pops.js` (the daily practice engine — the work, read, or pray pops that fire on every page, five to twenty minutes a day), and the real icons (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `favicon.ico` — the `>_` glyph in forest on warm cream). Plus the paper trail of a real organization: README
(manifesto + front door), LICENSE/COPYING/NOTICE (the legal spine),
CONTRIBUTING/CODE_OF_CONDUCT/GOVERNANCE (how the block runs itself),
SECURITY/PRIVACY posture, PRICING (the rate floors), ROADMAP, ADR (the
architecture decisions — no frameworks, 3-second rule), INSTALL/BUILD/DEPLOYMENT
(runbooks), FAQ/SUPPORT, styles.css (the shared Warm Study theme), todo.md
(the public task board), and this file.

## THE COUNTS

| Folder | Files |
|---|---|
| `.github/` | 14 |
| `core-system/` | 8 |
| `courses-and-guides/` | 9 |
| `discussion/` | 6 |
| `excellence-matrix/` | 9 |
| `hustle-index/` | 7 |
| `community-boards/` | 6 |
| `physical-raffles/` | 3 |
| `prompts/` | 6 |
| `sandbox-blueprints/` | 13 |
| `support-the-block/` | 3 |
| `urban-dictionary/` | 9 |
| `wiki/` | 12 |
| `fed-comm-dm/` | 7 |
| `fedpromptly-coach/` | 5 |
| root files | 40 |
| **TOTAL** | **157** |

One repo. Every file has a job. Every job serves one mission: every Black man
who wants to build, can build — on whatever device he's got, from wherever he
is, starting tonight.
