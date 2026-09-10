# 📱 Turn Website Into App — The PWA Move

**Plain terms:** A PWA (Progressive Web App) is a website that your phone treats like a real app: it gets its own icon, opens full-screen without the browser bar, and works offline. You build ONE website and it runs on every device — phone, tablet, PC — from the same files. No app store, no approval, no fees.

## 🧠 Why This Changes the Game

The app store route costs money ($100/year for Apple), requires approvals, and can reject you. The PWA route costs **zero dollars, zero approvals, and nobody can pull it.** For brothers building for their communities, that's the difference between having a voice and asking permission to speak.

This is exactly how the FED-EDU app itself works — it's a PWA (see ADR-007). When you understand this page, you understand how the block ships to every device on earth from one repo.

## 🪜 The Three Parts of a PWA

| Part | File | What it is |
|---|---|---|
| 1. The manifest | `manifest.json` | The app's ID card — name, colors, icon |
| 2. The service worker | `service-worker.js` | The app's memory — saves pages so they load offline |
| 3. The link | one line in your HTML | The line that connects the two |

## 🪜 The Steps — Make Your First Page an App (30 min)

### Step 1 — Add the manifest (5 min)

In your fork (same folder as `my-first-page.html`): **Add file → Create new file** → `manifest.json`:

```json
{
  "name": "Marcus First App",
  "short_name": "MarcusApp",
  "start_url": "./my-first-page.html",
  "display": "standalone",
  "background_color": "#f7f2e9",
  "theme_color": "#256d46",
  "icons": [
    { "src": "icon.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

Change the name/short_name to yours. `display: standalone` is the magic line — it's what makes it open WITHOUT the browser bar, like a real app.

### Step 2 — Connect it in your HTML (2 min)

Open `my-first-page.html` and add this line inside `<head>`, right under the `<title>` line:

```html
<link rel="manifest" href="manifest.json">
```

Commit: `add manifest - my page is becoming an app`

### Step 3 — Add the service worker (15 min)

**Create `service-worker.js`** (same folder):

```javascript
// The app's memory: saves pages so they work offline.
const CACHE = "my-first-app-v1";
const PAGES  = [
  "./my-first-page.html",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((store) => store.addAll(PAGES))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((hit) => {
      return hit || fetch(event.request);
    })
  );
});
```

**Register it** — add this script block at the very bottom of `my-first-page.html`, just before `</body>`:

```html
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
  }
</script>
```

Commit: `service worker added - offline mode unlocked`

### Step 4 — Icon (5 min)

Any square PNG, 192x192 minimum (512x512 for best quality). A phone photo of a drawing, squared and cropped, works. Name it `icon.png`, upload to the same folder (Add file → Upload files). For now, missing icon = a default letter tile; the app still installs fine.

### Step 5 — INSTALL IT (the moment)

Your repo must be live on GitHub Pages first ([Publish on GitHub Pages →](Publish-on-GitHub-Pages.md) — do that rung if you haven't).

Then, on your PHONE, in Chrome:
1. Visit your live site URL
2. Browser menu (⋮ three dots) → **"Add to Home Screen"** (or "Install app")
3. Confirm the name → **Add**

**The icon is now on your home screen between the real apps.** Open it — full-screen, no browser bar, YOUR app. Send the URL to your cousin and tell HIM to add it to HIS home screen. That's your first distribution.

## ⚠️ Real Talk

- **Service workers ONLY work on HTTPS.** GitHub Pages is always HTTPS, so once you're published, you're covered. That's another reason the block runs on GitHub Pages.
- **The cache is sticky.** When you update your site, the old version might linger. Fix: bump the cache name in `service-worker.js` (`v1` → `v2`) with every update. That one habit prevents 90% of "my update isn't showing" confusion.
- **Install works on Android Chrome + iOS Safari** (iOS menu says "Add to Home Screen" too). Desktop Chrome also offers an install icon in the address bar.
- **No app store = no gatekeeper.** Apple/Google can't reject your app because they don't control it. Your URL is your app store.

## 🏁 Your Move

Add the manifest, the link line, the service worker, and the icon to your first page — then install it on your own phone. When the icon hits your home screen, post the link in [Discussions → Show and tell](https://github.com/fedpromptly/FED-EDU/discussions) with what you'd add in v2. You just built and SHIPPED an app — most people never do either.

*Previous rung: [Your First Website](Your-First-Website.md) · Next rung: [Publish on GitHub Pages](Publish-on-GitHub-Pages.md)*
