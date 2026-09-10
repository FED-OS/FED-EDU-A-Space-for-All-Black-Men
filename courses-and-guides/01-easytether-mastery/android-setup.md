# Android Setup — The Seven Taps
### Lesson 2 of EasyTether Mastery · Turning your phone into the pipe

**Time:** 15 minutes · **What you need:** Your Android phone, your USB cable, your PC nearby

---

## Before the taps — what you're actually doing

Every Android phone carries a hidden door marked "Developer options." Behind that door are two switches that matter for tethering: one that lets the phone talk to your computer at full speed (USB debugging, which EasyTether uses to build its bridge), and one that shares the phone's internet through the cable (USB tethering). Google ships both switches OFF by default because most people never need them — and because leaving them on is a (small) security hole. You'll turn them on, do the work, and learn when to turn them back off.

The door itself opens by a secret knock: tap "Build number" seven times. Google doesn't publish this on the front page; it's a handshake for people who are serious. After today, you'll have done the knock so many times it's second nature.

---

## The seven taps, in order

**Tap 1 — Settings.** Open the Settings app. (Swipe down from the top of the screen twice and tap the gear icon, or find Settings in your app drawer.)

**Tap 2 — About phone.** Scroll to the bottom of Settings. On most phones it's literally called "About phone" — sometimes "About em," sometimes hidden under "System." Samsung hides it inside "About phone" → "Software information" on some models. If you can't find it, search inside Settings for "build number" — every Android since 2015 has a Settings search bar at the top.

**Tap 3 — Build number, seven times.** Find "Build number" and tap it seven times, steadily. On tap three, a countdown appears: "You are 4 steps away from being a developer." By tap seven, the phone shows a toast: **"You are now a developer!"** — and if you have a PIN or pattern, it asks for it once to confirm you're the owner. That PIN check exists so a stranger can't enable developer mode on a stolen phone. Same reason a house has a lock.

**Tap 4 — Back out to Settings main.** Press back. A new menu item has appeared near the bottom of Settings: **"Developer options."** That's your door, now unlocked.

**Tap 5 — Developer options → scroll to USB debugging.** Inside Developer options, scroll down until you see **"USB debugging"** with a toggle switch. Read the warning that pops up when you flip it — it's real: this setting allows a computer you trust to send commands to your phone. A computer you DON'T trust shouldn't get that power. (The "always allow from this computer" checkbox comes later, on the PC side — that's when you tie the trust to YOUR machine.)

**Tap 6 — Flip USB debugging ON.** Confirm the warning. The toggle goes blue (or green, depending on your phone's theme).

**Tap 7 — Network & internet → Hotspot & tethering → USB tethering.** Back out to Settings main. Find **"Network & internet"** (sometimes "Connections," on Samsung "Connections" → "Mobile Hotspot and Tethering"). Inside, look for **"Hotspot & tethering"** — and the line you want is **"USB tethering."** Flip it ON **after the cable is already plugged in** — this toggle only lights up when the phone senses a PC on the other end of the wire. If it's grayed out, that's not a broken phone: plug the cable into the PC first, then flip it.

That's the phone side. Seven taps, one secret knock, two switches. Your phone is now ready to be the pipe.

---

## The settings most tutorials skip

### "Charging this device via USB" → must be File Transfer (MTP)
When you plug the cable into the PC, Android shows a tiny notification: "Charging this device via USB." That's the default mode, and in charging mode the PC sees the phone as a battery, not a device. For tethering (and for copying files back and forth), you need **File transfer / MTP** mode. Tap the notification → select **"File transfer / Android Auto"** or **"Transferring files."** On some phones this option is buried under "USB Preferences." If the notification doesn't appear, pull down the notification shade — it's there, quiet.

Why this matters for tethering: many PC drivers — including EasyTether's — only negotiate their connection when the phone is in MTP mode. Charging mode is the phone saying "I'm just here for power." MTP is the phone saying "I'm here to talk." Talk mode.

### Developer options keeps resetting to OFF
Some phones (especially Samsung and Xiaomi) re-lock Developer options when they reboot or when storage gets low. Ritual for when it happens: same seven taps on Build number, then back in, flip USB debugging again. It's annoying, not broken — the setting is designed to be forgotten. Five seconds once you know the knock.

### The "USB debugging authorized" toast on the PC side
The first time the PC connects with USB debugging on, the phone pops a dialog: "Allow USB debugging? The computer's RSA key fingerprint is: [a big hex string]." Check **"Always allow from this computer"** and tap Allow. That fingerprint is the PC's ID — you're telling your phone "this exact machine is family, stop asking." Do this once and you never see it again on that PC.

### Battery + data saver will fight you
If your phone runs Battery Saver or Data Saver, they will quietly throttle or pause the tether while you work. Settings → Battery → turn Battery Saver OFF during work sessions, or at minimum "unrestricted" for EasyTether. Same for Data Saver: Settings → Network → Data Saver → OFF while tethered. They'll flip back on automatically when they're supposed to — you're just overriding for work hours. Your phone is now a workstation, work like it.

---

## When the option refuses to appear

**"USB tethering" is grayed out even with the cable in:** The phone doesn't see the PC as a real host. 90% of the time it's the cable: cheap cables are charge-only — no data pins. Use the cable that came with the phone, or any cable that reliably copies files between phone and PC. Test: if the PC can see the phone's files in File Explorer, the cable passes data. If it can't, the cable is furniture.

**"USB debugging" toggle is missing entirely:** You tapped Build number but Developer options didn't appear. On Samsung: Settings → About phone → Software information → Build number (the knock is one level deeper). On Xiaomi: Settings → About phone → MIUI version (tap THAT seven times). Some carriers' skins move the door, but every Android has it — search "build number" in Settings search if the path above doesn't match your phone.

**The toast never appears on tap 7:** Some phones show "You are now a developer" only after the PIN entry. If nothing appears after seven taps, look for the PIN prompt first, then look for Developer options in Settings. The door unlocks even when the toast is quiet.

---

## Your Move

Do the seven taps right now, with the cable in hand. Then take a screenshot of the Developer options screen (power + volume-down on most phones) — that screenshot is the first receipt in your EasyTether Mastery folder. Next file: `pc-usb-bridge.md` — the PC side of the handshake, and the moment your dead PC wakes up.

*Stuck on a step that this guide doesn't cover? That's what the block is for — open a discussion post with your phone model and the step number, and a brother who owns that phone will walk you through it. Nobody built this block so you could be stuck alone.*
