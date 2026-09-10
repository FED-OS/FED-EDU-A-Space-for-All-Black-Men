# The PC Side — USB Bridge Installation & Debug
### Lesson 3 & 4 of EasyTether Mastery · The moment the dead PC wakes up

**Time:** 20 minutes for the bridge, 25 for the dev rig · **What you need:** Windows PC (7/10/11), USB cable, phone already in developer mode (android-setup.md), EasyTether app installed on the phone

---

## The handshake, in plain terms

Your phone is ready (android-setup.md is done). Now the PC needs three things: a driver that knows how to talk to EasyTether (software that speaks the phone's dialect), a way to accept the network connection (Windows calls this a network adapter), and trust established between the two machines (the RSA fingerprint toast). The bridge file covers all three, and ends with the five-failure-point checklist so a dead tether never strands you again.

---

## Step 1: Get EasyTether on the PC side

EasyTether has two halves — phone half and PC half. The phone half you already installed. The PC half is a small driver + menu app. Download from the official site (easytether.com — stick to the official site; third-party driver mirrors are where malware hunts). Run the installer. Windows may ask "Do you want to allow this app to make changes to your device?" — that's User Account Control doing its job — click Yes.

If the installer window vanishes mid-install or throws an error code, write the code down. The debug section below covers the common ones.

### The alternative path — Windows built-in USB tethering (no third-party app)
Before you pay for anything, know this: **Windows itself can consume a USB tether without any third-party driver, if your phone's plan allows it.** The phone's "USB tethering" toggle (Tap 7 in android-setup.md) shares the phone's connection as a standard network connection — Windows 10/11 recognizes it natively as "Local Area Connection" or "Remote NDIS based Internet Sharing Device." If your carrier plan permits native tethering, you might not need EasyTether at all: plug the cable, flip the toggle, done. EasyTether exists for the brothers whose plans block native tethering or whose carriers throttle it — it builds its own bridge over the plan's restrictions (that's its whole product). Try the native path first (free, no install), keep EasyTether as the fallback if the plan blocks it. Knowing both paths is mastery.

---

## Step 2: First connection — plug, flip, wait

1. Plug the cable into the PC (USB port on the PC itself, not an unpowered hub — hubs that don't plug into the wall are power thieves).
2. Phone: set the USB notification to **File transfer / MTP** (not "Charging this device" mode) — see android-setup.md.
3. Phone: flip **USB tethering** ON (Settings → Network & internet → Hotspot & tethering).
4. PC: if EasyTether is installed, its tray icon turns green. Windows native: look at the taskbar network icon — within 10–30 seconds it should show a wired connection.
5. Open a browser on the PC. Load a lightweight page — example.com is the classic test (plain HTML, one page, loads in a blink on any connection). **If the page loads, the bridge is up.**

That moment — a webpage loading on a PC that has no internet of its** own** — brothers describe it the same way: like the computer woke up. Some of you will feel it too. It's not just internet. It's the machine becoming useful again.

---

## Step 3: Trust the machine — the RSA handshake

The first time USB debugging connects to this PC, the phone shows the "Allow USB debugging?" dialog with the PC's RSA key fingerprint. Check "Always allow from this computer" and Allow. One time, one trust, done. If you skip this and deny, the bridge goes dark until you re-plug and re-allow. Deny twice and the phone stops asking for the session — re-plug the cable to reset the ask.

---

## Step 4: Prove it — the five-failure-point checklist

A dead tether has five failure points, always in this order. Run this list top to bottom and you'll find the culprit 95% of the time:

| # | Failure point | The check | The fix |
| 1 | **Cable** | Can the PC see the phone's files in File Explorer? | No → charge-only cable. Use the cable that came with the phone or one that reliably copies files. |
| 2 | **Mode** | Phone USB notification says "File transfer / MTP"? | No → tap notification → File transfer. Charging mode = the PC sees a battery, not a device. |
| 3 | **Toggle** | USB tethering toggle flipped ON (after cable plugged in)? | No → flip it. It only lights up when the phone senses a PC on the wire. |
| 4 | **Driver** | Device Manager shows the EasyTether adapter / "Remote NDIS" adapter without a yellow ⚠ warning? | Yellow ⚠ → right-click → Update driver → Browse my computer → Let me pick. Or reinstall EasyTether PC app. |
| 4b | **Driver (native)** | Device Manager → Network adapters → "Remote NDIS based Internet Sharing Device" present, no warning? | Missing → try another USB port; try "Add legacy hardware" only if you know what you're doing. |
| 5 | **Firewall** | Windows Defender Firewall blocking EasyTether? | Check Windows Security → Firewall → Allowed apps → find EasyTether. Public/private both checked. |

Run top to bottom. Top to bottom. The order matters because it's cheapest-first: cable is free to check, mode is one tap, toggle is one flip, driver is a reinstall, firewall is a permission. A brother who memorizes this order debugs any dead tether in under two minutes.

---

## Step 5: The dev rig — turning the connection into a workstation

Internet on the PC is step one. A rig is what you build on top of it:

### 5a. The editor — VS Code on 4GB RAM
Download VS Code (code.visualstudio.com — the "User Installer" x64 build for most PCs). It runs fine on a 4GB refurb (see core-system/fed-os-bridge/hardware_profiler.py for tier detection — 4GB is the "TRUE FED-EDU TIER"). Install the default extensions only — no heavy AI extensions on a refurb, they eat RAM like Sunday dinner.

### 5b. The local server — one double-click
Copy `core-system/fed-os-bridge/local_server_boot.bat` into any project folder and double-click. It finds Python (py → python → python3, in that order) and serves that folder on `localhost:8080`. Now your PC tests sites exactly like GitHub Pages will serve them — same folder structure, same relative paths. What works on localhost:8080 works on Pages. That's the whole point of a local server.

### 5c. The git loop — connect the rig to the block
git init in your project folder, remote add to your GitHub repo (wiki/First-Steps/Push-Your-First-Change.md has the four-word vocabulary: clone, add, commit, push). Now the rig is a loop: edit → localhost test → git push → GitHub Pages live. Edit, test, ship. Edit, test, ship. That loop is the entire job. Everything else is details.

### 5d. The phone check — the final say
Every site you build gets opened on the phone before you call it done. Not on the PC's browser at phone-width — on the actual phone, over the actual tether, on the actual 3G. Because that's how half your users will meet your work. The 3-second rule (ADR-002) isn't a rule for the repo — it's a rule for the real world your work lives in.

---

## The data cost reality

USB tethering uses the phone's data plan. Nothing is free — the pipe is only as generous as your plan. The tether monitor (core-system/fed-os-bridge/tether_monitor.sh) shows you exactly how much the dev loop costs per month so there are no surprise bills. Budget like you budget for gas: know the tank, watch the needle.

---

## Your Move

Bridge up, rig running, phone check done? Screenshot the tether monitor's passing checklist — that's your proof-of-completion and your **10 raffle tickets** (pinned: how-to-earn-raffle-tickets.md). Post it in the discussions with the tag [TETHERED] and a brother who's still phone-only will slide in your replies asking how. Answer him — that's 5 more tickets, and that's how the block grows.

*Bridge won't come up after the five-point check? File an issue with the template (.github/ISSUE_TEMPLATE/02_bug_alert.md) and paste the full output of the failing step. Receipts get answers, vibes get silence.*
