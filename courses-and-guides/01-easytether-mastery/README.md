# EasyTether Mastery
### The course that turns your Android phone into your PC's internet pipe

**Level:** Spawn → Builder · **Time:** One afternoon · **Hardware:** Android phone + Windows PC + one USB cable · **Cost:** $0 trial, then the cost of a sandwich a month

---

## Why this course exists

Half the brothers on this block are phone-only. The other half have an old PC sitting somewhere — a hand-me-down, a $50 refurb somebody gave up on — and no internet coming out of the wall for it. The math is brutal: you have the computer, you have the internet (in your pocket), and the two never meet.

That gap is not a small thing. Phone-only means you can READ the block but not BUILD on it. Coding on a 6-inch screen is doing pushups in a phone booth — possible, respected, but cramped. The brother who can tether his PC to his phone has both hands free. He can run a full code editor, open real developer tools, test sites on a real screen, and stop scrolling past things he'd otherwise build.

This course closes that gap with one cable. Not WiFi hotspot mode — that burns battery and data like a furnace. **USB tethering** is the move: the phone charges while it shares, the connection is more stable than WiFi, and it works even when the phone's hotspot plan is blocked. For brothers with the EasyTether app in their pocket, this is the difference between watching the game and playing it.

---

## What you'll be able to do when you finish

By the end of this course you will have done all four of these, with receipts:

1. **Get a Windows PC online through your Android phone over a USB cable** — and understand WHY it works, not just that it works.
2. **Explain to another brother, in plain terms, what tethering actually is** — because teaching it is how you earn your raffle tickets (see the ticket table below).
3. **Debug a dead tether** — the five failure points, in order, so you're never stuck begging for WiFi again.
4. **Set up your dev loop** — editor + local server + phone testing — so the PC-and-phone combo becomes a real development rig, not a YouTube machine.

---

## The lesson plan

### Lesson 1: The Idea — What Tethering Actually Is (wiki version)
Read wiki/Getting-Online/EasyTether-Basics.md first. That's the ground floor: the seven-tap developer-mode ritual, what USB debugging is, and why "USB tethering" is not "hotspot mode." If you've already done that wiki walk, you know the vocabulary. This course takes that vocabulary and makes it muscle memory.

### Lesson 2: The Phone Side — Android Setup (15 min)
File: `android-setup.md` — the seven taps, plus the extra settings most tutorials skip: why "Charging this device via USB" must be set to "File transfer / MTP" mode (or the PC never sees the tether), and what to do when the option refuses to appear.

### Lesson 3: The PC Side — The USB Bridge (20 min)
File: `pc-usb-bridge.md` — the Windows side of the handshake: installing the EasyTether driver, the silent-failure points, and the one Device Manager screen that tells you everything. Ends with the moment you open a browser on the PC and the page loads from your phone's connection.

The first time a webpage loads on a PC that has no internet of its own — that's a feeling brothers describe the same way: like the computer woke up. Some of you will feel it too. It's not just internet. It's the machine becoming useful again.

### Lesson 4: The Rig — Turning It Into a Development Setup (25 min)
Also in `pc-usb-bridge.md` — setting up your dev loop: a folder that syncs with git, a lightweight editor (VS Code runs fine on a 4GB refurb), and the local server boot file (core-system/fed-os-bridge/local_server_boot.bat) that turns any folder into `localhost:8080` with one double-click. This is where the PC stops being a YouTube machine and becomes a rig.

### Lesson 5: The Test — Prove It, Then Get Paid in Tickets (10 min)
Run the tether monitor (core-system/fed-os-bridge/tether_monitor.sh — works in Git Bash on Windows, or on any Linux box) and take a screenshot of the passing checklist. That screenshot is your proof-of-completion, and your **10 raffle tickets** for a completed guide-level piece of work (pinned: how-to-earn-raffle-tickets.md).

---

## The raffle math

This course pays for itself in tickets if you do it right:

| Action | Tickets |
|---|---|
| Finish the course + post your passing tether monitor screenshot | 10 |
| Write up your own city's tether tips (library spots, best cell coverage corners) as a discussion post | 5 |
| Fix another brother's tether from the checklist and comment the fix | 5 |
| Convert the course into your own guide for a different device (Chromebook, Mac) | 10 |

A brother who takes this course, writes his city tips post, and helps one other brother get online is at 20 tickets before he's written a single line of code. The door into the raffle pool is wider than most people think.

---

## The fine print

**Data cost reality:** USB tethering uses your phone's data plan. Nothing is free — the pipe is only as generous as your plan. The tether monitor (Lesson 5) shows you exactly how much the dev loop costs per month so there are no surprise bills. Budget like you budget for gas: know the tank, watch the needle.

**The 3-second rule:** Everything in this course follows ADR-002 — if it doesn't load in ~3 seconds on tethered 3G, it doesn't ship. Your dev sites will be light by default because this is the environment we build in. When your client work needs heavier assets, that's a choice you make with receipts, not a default.

**When it breaks:** The five-failure-point checklist in Lesson 3 covers the dead-tether debugging order. If you hit something not on that list, that's a bug report — .github/ISSUE_TEMPLATE/02_bug_alert.md exists for exactly that moment.

---

## Your Move

Open `android-setup.md` and start the seven taps. The cable you already own is the only hardware this course requires. The PC you thought was dead weight is about to become the best computer you own — because it's the one that's online.

*All wiki paths in this course are real files in the FED-EDU repo. If a path doesn't resolve, that's a bug — file it, and I'll fix it same-day.*
