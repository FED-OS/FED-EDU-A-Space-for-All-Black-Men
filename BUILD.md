# 🔨 FED-EDU BUILD — How The Build Engine Works

## What "Build" Means Here

This project is deliberately light: pure HTML/CSS/JS with JSON data files, plus a few Python utility scripts. There is no React, no Webpack, no 400MB node_modules folder — because a heavy build pipeline would break the core promise: **everything must load on a tethered scrap PC through a phone connection.** Lightweight is a design decision, not a limitation. See `ADR-001` in ADR.md.

## The Automated Pipeline (.github/workflows/build.yml)

Every push to `main` triggers the cross-platform engine:

1. **Checkout** — the workflow pulls the repo
2. **Validate** — confirms `core-system/index.html` exists; the build fails fast if the front door is missing
3. **Package** — the `core-system/` directory is bundled as the Pages artifact
4. **Deploy** — shipped live to the GitHub Pages URL, reachable on every device

No build minutes wasted, no dependency installs to time out, no npm audit horror stories. Push → live in about a minute.

## Local Builds (No GitHub Required)

You can run the whole platform on your own hardware, offline:

**On FED-OS / Linux / Mac:**
```bash
cd FED-EDU/core-system
python3 -m http.server 8080
```
Open `localhost:8080` in your browser. Done.

**On Windows:**
Double-click `fed-os-bridge/local_server_boot.bat` — it does the same thing for you.

That's the entire local build. If it feels too easy — that's the point. Real-life Minecraft doesn't need a permit.

## The Other Workflows

- **`auto_dap.yml`** — runs on pushes; assigns achievement badges and records dap events for the leaderboard
- **`leaderboard_sync.yml`** — scheduled; recalculates the syndicate standings from verified contribution data and updates the dashboard's stats

Full specs live in `.github/workflows/` — each file is commented in plain terms.

## Build Rules (Hard Requirements)

1. **The 3-Second Rule:** first meaningful paint under 3 seconds on a throttled 3G connection. If your change makes the dashboard slower, it doesn't merge.
2. **No heavy frameworks.** Vanilla JS, small libraries only, and only when they earn their weight.
3. **Images get compressed** before commit. No 4MB hero photos. (Brothers are paying per megabyte.)
4. **The service worker gets updated** when assets change, so offline caching stays correct.
5. **Python scripts stay stdlib-light.** The blueprints (`bg-remover.py`, `trend-scraper.py`) document their pip installs inside the file, kept minimal.

## Testing (What We Check Before Ship)

- HTML opens and renders on a plain browser with no console errors
- JS runs through the main flows (dashboard loads, search finds terms, DM client connects)
- Mobile layout verified at 360px width (the width of a cheap Android — our reference device)
- The PWA installs on Android via "Add to Home Screen"
- Python scripts run on Python 3.8+ (old machines run old Pythons; we meet them there)

## When The Build Breaks

The workflow fails fast and names the missing piece in plain language. Nine times out of ten it's one of: `core-system/index.html` missing or renamed, Pages not enabled in repo settings, or the artifact path drifted from `./core-system`. Fix, push, done.

Stuck anyway? Help Desk, `bug_report` template. Builds are community-debugged.
