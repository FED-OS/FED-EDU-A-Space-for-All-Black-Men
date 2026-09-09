# 🔌 EasyTether Basics — Internet Through Your Phone

**Plain terms:** Your old PC has no WiFi (or broken WiFi). Your phone has internet. EasyTether is the USB cable trick that gives your PC internet THROUGH the phone. One cable, problem solved.

## 🧠 What You Need

| Thing | Details |
|---|---|
| Android phone | With working internet (data plan or WiFi) |
| USB cable | The charger cable — same one. |
| Old PC | Windows 7/8/10/11 or Linux |
| ~$10 | One-time license for EasyTether full version (free trial works too) |

**iPhone brothers:** iPhone USB tethering is built-in (Settings → Personal Hotspot → "Allow Others" + USB cable). This page focuses on Android because that's what most of the block uses, but the concept is identical.

## 🪜 The Steps

### Step 1 — On the PHONE: Turn on USB Debugging

1. Open **Settings → About Phone**
2. Find **Build Number** and tap it **7 times** (I'm serious — seven)
3. You'll see "You are now a developer" 🎉
4. Go back → **Settings → Developer Options** → turn ON **USB Debugging**
5. When it asks to confirm, tap **Allow**

> **Why 7 taps?** Google hides developer mode so regular users don't break things. The 7 taps are you telling the phone "I'm not a regular user no more." First digital chain you break today.

### Step 2 — Install EasyTether

- **On the PHONE:** Install "EasyTether" from the Play Store (the one by **Mobile Stream**).
- **On the PC:** Go to `easytether.com` in any browser, download the desktop app for your Windows version, install it.

### Step 3 — Connect and Prove

1. Connect phone to PC with the USB cable.
2. On the phone, a popup appears: **"Allow USB debugging?"** — check "Always allow from this computer" and tap **Allow**.
3. Right-click the EasyTether icon in the PC system tray (bottom-right corner) → **Connect Android**
4. Wait ~10 seconds. 
5. Open a browser on the PC → try any website. **If it loads, you're online through your phone.** 🔓

## ⚠️ Real Talk (The Honest Section)

- **The full version costs ~$10 one-time.** The free version blocks secure websites (https). Most of the internet is https now, so the $10 is basically mandatory — but it's ONE-TIME, not monthly. Cheapest internet in the game for a PC.
- **Your phone's data plan is the limit.** Tethering eats data like a hungry cousin. If you have 10GB/month, streaming videos through the PC will eat it in days. **Web browsing and coding use almost nothing** — a full day of GitHub work uses maybe 50MB.
- **Text-heavy beats video-heavy.** This is WHY the whole FED-EDU site is text-first (ADR-001, the 3-second rule). We build for brothers on metered connections because that's who we serve.
- **Battery heat is normal.** The phone charges off the PC while tethering — it'll get warm. That's fine. Unplug when you're done.

## 🔧 Troubleshooting (The "It's Not Working" Section)

**"The popup never appeared on the phone"**
→ USB debugging is off, or it's a charge-only cable. Charge-only cables look identical but carry no data. Try the cable that came with the phone, or another known-good one.

**"EasyTether says 'No device'"**
→ Re-plug the USB cable. Then check Developer Options → USB Debugging is still ON (some phone updates turn it back off).

**"Connected but no internet"**
→ Check the phone itself has internet. Open a website ON the phone first. No phone internet = no PC internet.

**"It worked yesterday"**
→ Phone did a system update. Re-allow USB debugging popup (re-plug the cable).

## 🏁 Your Move

Grab your phone and PC, run the 3 steps above, and confirm you can load any website on the PC through the tether. That's your first infrastructure win — you just built your own internet connection out of a cable and stubbornness.

Full course with more detail: [courses-and-guides/01-easytether-mastery](../courses-and-guides/01-easytether-mastery/README.md) — completing it earns **10 raffle tickets**.

*Next rung: [Free WiFi Spots and Libraries →](Free-WiFi-Spots-and-Libraries.md)*
