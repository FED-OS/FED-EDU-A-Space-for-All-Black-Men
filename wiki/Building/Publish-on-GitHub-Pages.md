# 🌍 Publish on GitHub Pages — Your Site on the Real Internet, Free

**Plain terms:** GitHub Pages is FREE hosting for your site. Flip two settings, push your files, and your page gets a real URL (`yourname.github.io/repo`) that opens on any phone or computer on earth. No monthly bill, no credit card, no landlord. This is how the whole FED-EDU block ships.

## 🧠 What's Happening (30 seconds)

A website needs a computer that's always on, holding your files, serving them to visitors. That's "hosting" — and it usually costs money. GitHub Pages gives every repo free hosting because open-source builders earned it. Your repo becomes your landlord-free property on the internet.

## 🪜 The Steps (10 minutes, ONE TIME)

### Step 1 — Make sure the site files exist

Your repo needs the pages you want live: `index.html` (the homepage — required, exact name) plus anything it links to. No `index.html` = GitHub Pages has no front door to serve. If you built `my-first-page.html`, create an `index.html` that links to it (a simple page with your name and a link works — it's your repo's front door).

### Step 2 — Open the Pages settings

In YOUR repo (not the main FED-EDU repo): **Settings → Pages** (left sidebar).

### Step 3 — Choose the source

This repo has a deployment workflow (`.github/workflows/build.yml`) that handles publishing automatically. Under **Build and deployment → Source**, select **GitHub Actions**.

> If you're publishing a personal repo WITHOUT our workflow, choose **Deploy from a branch** instead → Branch: `main` → folder: `/ (root)` → Save. Both routes are free; the workflow route just adds the block's checks first.

### Step 4 — Wait ~2-5 minutes, then load your URL

Your URL appears at the top of the Pages settings page:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

Open it on your phone. **That's your site, live, worldwide, permanently free.**

### Step 5 — Verify, then celebrate properly

Check on two devices if you can (your phone + a brother's). If the page loads raw code as text, your file probably isn't named `index.html` — that's the classic first-publish bug. Rename and refresh after a minute.

## 🔗 After Your First Publish — Every Update After This

The beauty part: **you never touch the settings again.** Every commit to main automatically re-publishes in 1-3 minutes. Edit → commit → refresh the live URL. That loop is the whole game — and it's why keeping the site lightweight matters (see [BUILD.md](../../BUILD.md), the 3-second rule: pages must load fast on tethered 3G, because that's who we serve).

## 🏠 The Custom Domain Move (Later, When You're Hustling)

`yourname.github.io` is free forever. But when you start charging businesses for sites (see [PRICING.md](../../PRICING.md)), a custom domain (`marcusbuilds.com`) is the professional move:

- Buy a domain (~$10-15/year at Namecheap/Porkbun — the only real cost in this whole operation)
- Repo → Settings → Pages → Custom domain → enter it → Save
- Add the DNS records the settings page tells you to (two lines at your domain provider)
- GitHub serves free HTTPS certificates for custom domains automatically

A $12 domain on free hosting = a client-ready professional site. That's the whole stack, under the rate floor of $150 (one-page site), all margin.

## ⚠️ Real Talk

- **HTTPS is automatic and required.** Every `*.github.io` site is HTTPS (the padlock). This is also what makes service workers work (see [Turn Website Into App](Turn-Website-Into-App.md)) — PWA and Pages are a package deal.
- **The URL structure:** `username.github.io/repo-name/`. Links between YOUR pages must be relative (`href="my-first-page.html"` not `https://...`) or they break on the live site. The block's build check (build.yml) flags stranded pages without home links.
- **Public repos = public code.** Anything in the repo is visible to the world. Never put passwords, keys, client info, or private ledgers in a public repo (see SECURITY.md — this rule has no exceptions).
- **Never pay for hosting again — until you outgrow free.** Pages handles small-to-medium traffic fine. When a client site outgrows it, you charge enough to cover real hosting (Cloudflare Pages / Netlify free tiers are the next step up, still $0).

## 🏁 Your Move

Publish your repo right now (10 minutes, one time). Then send the live link to two people — one who'll be proud of you and one who doubts you. Both need to see it. Then post it in [Show and tell](https://github.com/fedpromptly/FED-EDU/discussions) — first live site posted earns dap + tickets from the welcome agent.

*Previous rung: [Turn Website Into App](Turn-Website-Into-App.md) · Next level: [List on Hustle Index →](../Hustling/List-on-Hustle-Index.md)*
