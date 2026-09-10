# 🔧 FED-EDU INSTALL — Getting Set Up On Whatever You Have

> There is no "required setup" here — there are setups, plural, matched to the hardware reality of whoever's reading this. Find your situation, follow that path. Everything costs $0.

## Setup Path A — Phone Only (The Valid Starting Point)

You don't need a computer. A huge percentage of this community starts here.

1. **Get the GitHub mobile app** (Android/iOS, free) — or just use github.com in your phone's browser.
2. **Create your account** — guide: `wiki/First-Steps/Make-a-GitHub-Account.md`. Your username is your name on the block; choose like it matters.
3. **Join the FED-EDU org** — request access through the org page (or get invited by any brother).
4. **Install the dashboard as an app** — open the FED-EDU Pages URL in your browser, then "Add to Home Screen." The PWA manifest (`core-system/manifest.json`) makes it a real icon that opens full-screen.
5. **Edit files right from the phone** — GitHub's app and website let you edit any file in your forks. No terminal needed for the beginner path.

**Data tip:** everything in this ecosystem is built light specifically so it loads on metered connections. Turn on the service worker caching (automatic) and the dashboard keeps working even when your signal drops.

## Setup Path B — Scrap Desktop + Tethered Phone (The Classic)

You've got (or won) an old desktop and a phone with a data plan.

1. **Take the EasyTether Mastery course** — `courses-and-guides/01-easytether-mastery/`. It walks you through connecting the desktop to the internet through your phone via USB: the app on the phone, the drivers on the desktop, and the settings that keep the connection stable.
2. **Install a browser** if the machine has a fossilized one — Firefox or Chromium, whatever runs lightest on the hardware.
3. **Follow Path A steps 2–5** from the desktop once you're online.
4. **Optional but powerful — install Python** (python.org, free) to run the Python blueprints (`bg-remover.py`, `trend-scraper.py`) and write automation scripts. The `hardware_profiler.py` in the FED-OS bridge can help you tune the machine.

**Old Windows machine note:** the `local_server_boot.bat` in `core-system/fed-os-bridge/` launches a local copy of the dashboard so you can keep building even when the tether drops.

## Setup Path C — FED-OS Machine (The Home Field)

If you're running FED-OS, the ecosystem is native territory.

1. FED-OS ships light and fast on low-spec hardware by design — the FED-EDU dashboard and all blueprints run on it without any special setup.
2. The `fed-os-bridge/` scripts integrate: `tether_monitor.sh` watches your USB connection and logs drops; `hardware_profiler.py` optimizes memory allocation so heavy browser tabs don't choke the machine.
3. Everything else is Path A/B steps — account, org, build.

## Setup Path D — Library / Public Computer (The Underrated Play)

Free hardware, free internet, zero strings.

1. Bring headphones and a phone (or memorize/write your credentials — don't save passwords on public machines).
2. Do your account setup and learning sessions there — see `wiki/Getting-Online/Free-WiFi-Spots-and-Libraries.md` for the directory and etiquette guide.
3. Use GitHub in the browser; your work lives in the cloud, so it follows you to whatever machine you sit at next.
4. **Security note:** always log fully out of public machines. Never leave sessions open, never save tokens to public hardware.

## Setup Path E — You Already Have A Real Machine

Welcome, and check your privilege at the door like everybody else. Standard flow:

1. `git` installed (git-scm.com) if you want the full local workflow — or just use the browser/GitHub Desktop like everyone else; both are equally respected here.
2. Optional: Node 20+ and Python 3.11+ if you're going to run the workflows and Python blueprints locally.
3. Clone the repo, fork it, and build. BUILD.md covers local builds; DEPLOYMENT.md covers shipping.

## Everyone, All Paths — Do These Three Things

1. **Read `CODE_OF_CONDUCT.md`** — the ground rules are short and they're the price of entry.
2. **Drop your intro in the Spawn Zone** — flag, city, lane.
3. **Push one change** to earn your first badge — even a typo fix counts. First push is the hardest step of the whole tunnel.

## Troubleshooting Setup

**Tether keeps dropping?** → `courses-and-guides/01-easytether-mastery/README.md` troubleshooting section + the tether_monitor script.
**Page won't load on your connection?** → that's a bug for us, not you — file a `bug_report` issue with your device and connection type. Lightweight-or-it-doesn't-ship is a hard rule here.
**Can't afford data this month?** → say so in the Spawn Zone. The community fund exists partly for exactly this, and there's no shame in it — that's why we fund it.
**Stuck on literally anything else?** → Help Desk, `[NEED-PLUG]` tag. Someone's been where you are.
