# Brick One: HTML From Zero
### The full walkthrough of Lessons 1–4 · From empty lot to a house with an address

**Time:** One weekend, honestly · **Hardware:** Any device with a browser · **Assumes:** You can read. That's it.

---

## Lesson 1: The House — What HTML Actually Is

HTML is not a programming language. It's a marking language — you mark up text to tell the browser "this part is a headline, this part is a paragraph, this is a picture, this is a door." The browser reads your marks and builds the page. You are not programming a machine; you are labeling blocks so the builder (the browser) knows what goes where.

Every block has the same three-part shape:

```
<p>            ← opening tag: the block starts here
  words        ← the content: what's inside the block
</p>           ← closing tag: the block ends here (note the slash)
```

That slash matters more than anything else you'll learn today. `<p>` opens, `</p>` closes. Miss the slash and the browser thinks your sign runs on forever — half of all beginner bugs are missing slashes or misspelled closing tags.

### The blocks that are 90% of the web

**`<div>` — the room.** A plain container. Invisible by itself, but everything inside it stays together. A page is rooms inside rooms: a big room (the page), a header room, a content room, a footer room. When you look at any website and squint, you're seeing divs.

**`<p>` — the sign.** A paragraph. Words on the wall. `<p>You already know how to write one of these.</p>`

**`<a>` — the door.** A link. The `href` is the address the door leads to: `<a href="https://example.com">Tap here to leave my house</a>`. Without `href`, the door is a wall that looks like a door.

**`<img>` — the picture.** The only block that doesn't need a closing tag, because it's not a container — it IS the thing. `<img src="picture-address" alt="what the picture shows">`. The `alt` text is for blind visitors (screen readers read it aloud) and for the moment the picture fails to load. Always write the alt. A picture with no alt is a door with no knob.

**`<h1>` through `<h6>` — the name plates.** Headlines, biggest to smallest. One `<h1>` per house — it's the house's name. Everything else stacks under it: `<h2>` for sections, `<h3>` for sub-sections.

**`<ul>` + `<li>` — the shelf and its items.** `<ul>` is the shelf (unordered list), each `<li>` is a thing on it. Bullet lists everywhere on the web are this pair.

That's the vocabulary. Six block types. Everything else you'll ever meet is a variation: `<header>` is a div that means "top of the house," `<footer>` is a div that means "bottom," `<nav>` is a div that means "the doors hallway." Fancy names, same blocks.

### Your first file — the moment a block exists

1. Open any text editor. Notion won't work — you need plain text. Phone: the free "Acode" editor or even a notes app that exports .txt. PC: Notepad works; VS Code is better (see 01-easytether-mastery/pc-usb-bridge.md for the rig setup).
2. Type this — type it, don't paste it. Fingers learn what eyes skip:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Block</title>
</head>
<body>
  <h1>My Block</h1>
  <p>I'm building something.</p>
</body>
</html>
```

3. Save it as `index.html`. Not `myhouse.txt`, not `page.html.txt` — `index.html`. The name matters: every web server on earth looks for a file named `index.html` first. It's the front door by convention.
4. Open it. Phone: Acode has a preview button. PC: double-click the file — your browser opens it. **You should see "My Block" big at the top and your sentence under it.**

That moment — the file you typed rendering as a real page — is Brick One placed. Every developer you've ever heard of had that moment. You just had it too.

**What each part did:** `<!DOCTYPE html>` tells the browser "modern HTML, not 1998." `<html>` is the outermost room. `<head>` is the room the visitor doesn't see — house paperwork: the title (what shows on the browser tab). `<body>` is the room the visitor walks into. `lang="en"` tells screen readers how to pronounce your words. `charset="UTF-8"` makes accents and emoji survive the trip. Two lines of paperwork, and they matter.

---

## Lesson 2: The Paint — CSS Without Fear

HTML is the house; CSS is the paint, the trim, the furniture. CSS works by selection: you SELECT a block (by its tag, or by a name you gave it) and declare what it looks like.

```html
<style>
  body { background: #f7f3ec; color: #222222; font-family: Georgia, serif; }
  h1   { color: #1a5c2f; border-bottom: 3px solid #1a5c2f; }
</style>
```

Inside `<style>` lives CSS. Each rule is: **what you're selecting { what you're changing }**. The `body` rule painted every wall cream and made all text dark. The `h1` rule painted the big headline green and gave it a green underline. That's the whole grammar: selector { property: value; }.

### The Cyber-Hustle starter paint job

This repo ships a complete theme — `styles.css` at the root. Copy these three lines into your `<style>` block and your house wears the block's colors:

```css
body { background: #0a0a0a; color: #e8f5e9; font-family: "Courier New", Courier, monospace; }
h1   { color: #00ff66; }
a    { color: #00ff66; }
```

Dark ground, mint walls readable at night, Hustle Green doors and name plates. That green — `#00ff66` — is the block's signature. A brother who knows the block recognizes it on sight.

Then make it yours: change `#00ff66` to your color. Any hex code works — search "color picker" and grab any green, gold, blue, red you want. The house you build should be the house you'd live in.

### When it breaks (Lesson 2 edition)

**Nothing changed when I added the style:** You probably put the `<style>` block after `</body>`. It must live inside `<head>`, before `</head>`. Paperwork room, remember — style is paperwork.

**Everything turned black and I can't read it:** You set a dark background and left the text dark too. `color:` and `background:` are a pair. Change one, check the other.

---

## Lesson 3: The Address — Publishing on GitHub Pages

A file on your device is a diary. A file on the internet is a statement. GitHub Pages turns your repo into a live website — free, no card, no trial timer. The path:

1. **Make the repo.** github.com → your avatar → "+" → New repository. Name it anything (many brothers use `yourname.github.io` — that naming gets you the cleanest URL). Public. Add a README if it asks. Create.
2. **Get `index.html` into the repo.** Web upload is fine for Brick One: repo page → "Add file" → "Create new file" → name it `index.html` → paste your house → Commit changes. (The git CLI path — clone, add, commit, push — is Lesson 4 of wiki/First-Steps/Push-Your-First-Change.md. Web upload today, CLI when you're ready. Both count.)
3. **Turn on Pages.** Repo → Settings → Pages → under "Build and deployment," Source: **Deploy from a branch** → Branch: **main** (or master — whichever your repo shows), folder: **/(root)** → Save.
4. **Wait two minutes.** The first build takes a moment. Refresh the Pages settings screen — a green box appears with your URL: `https://yourname.github.io/reponame/` or `https://yourname.github.io/`.
5. **Open the URL on your phone.** That's your family's view. Send it to your mother.

### The three classic failure points

**The URL 404s:** (a) The branch was wrong — Pages was pointed at a branch with no `index.html`. Recheck Settings → Pages → Branch. (b) The file is named wrong — `index.html.txt` or `home.html`. It must be exactly `index.html` at the repo root (not inside a folder, for the root deploy). (c) You didn't wait — first deploys take up to a few minutes. Patience, then refresh.
**The page loads but looks unstyled:** Your `<style>` block got clipped in the copy-paste. Open the repo's `index.html`, compare with your local file, re-paste the whole `<head>`.
**The image doesn't load:** You linked an image from your device (`src="C:\..."` or `src="file:///..."`) — the internet can't see your device's hard drive. Either upload the image into the repo next to `index.html` and use `src="picture.jpg"`, or use a real hosted image URL (wikimedia commons images work — see the playground's examples).

---

## Lesson 4: The First Remodel — Your Next Blocks

The house is up. The address works. Here's the next-block menu, in the order that pays:

**A second page.** Copy `index.html` → rename `about.html` → change its content → add a door between them: `<a href="about.html">About me</a>` on the front page and a door back. Two pages and you've built a site, not a page. (Multi-page work is where the $500 floor in PRICING.md starts — see wiki/Hustling/Price-Your-Work.md.)

**The manifest + service worker — turning the site into an app.** Add `core-system/manifest.json` (adapted: your name, your colors) and a 30-line service worker (core-system/service-worker.js is the pattern) and your site becomes installable: visitors tap "Add to Home Screen" and your page lives on their home screen like an app, loading offline. The full walkthrough: wiki/Building/Turn-Website-Into-App.md.

**The Hustle Index listing.** When the site is about your services — even one service — list it: wiki/Hustling/List-on-Hustle-Index.md. The block's marketplace JSON is a copy-paste edit.

**The next course.** 03-the-corporate-ship turns this house into income: the interview cheat sheet and the markdown resume builder. The house you just built is the portfolio piece that makes the resume true.

---

## The receipts, one more time

| Milestone | Proof | Tickets |
|---|---|---|
| First file rendering locally | Screenshot of your browser showing your page | 5 |
| Live on GitHub Pages | The URL, posted in discussions | 10 |
| Helped a brother get his live | Your commented walkthrough | 5 |
| Showed the block your house | [SHIP] post | 5 |

Ten tickets for one weekend of placing blocks. The refurb tower raffle (pinned: how-to-earn-raffle-tickets.md) has had brothers win at fewer tickets than that.

---

## Your Move

You now know what 90% of the web is made of. Not metaphorically — six block types carry most of the pages you've ever visited. The playground in this folder (`index.html`) is open 24/7, works offline, keeps your drafts on your device, and never judges a broken block. Place one tonight.

*Every path in this walkthrough is a real file in the FED-EDU repo. If one doesn't resolve, that's a bug — .github/ISSUE_TEMPLATE/02_bug_alert.md — and it gets fixed same-day.*
