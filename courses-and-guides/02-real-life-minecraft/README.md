# Real-Life Minecraft: Brick One
### The course that teaches HTML by making you build a house you actually live in

**Level:** Absolute Spawn (zero assumed) · **Time:** One weekend · **Output:** A one-page site live on GitHub Pages with your name on the URL

---

## Why "Minecraft" is the honest teacher

Most people who love building in Minecraft have never written a line of code, and most people who quit coding never got past week two of a tutorial. The pattern's the same in both directions: Minecraft works because every block is simple, you can see it the moment you place it, and you can stand inside what you built. Coding tutorials die because the first example is someone else's todo-list app, invisible until it's "done," and "done" never comes.

This course uses the block metaphor with zero shame, because it's the best teaching tool that's ever existed for HTML. An HTML tag IS a block: you place it, it exists, you can stand inside it. `<div>` is a room. `<p>` is a sign you hang on the wall. `<a>` is a door that leads somewhere. `<img>` is a picture on the wall. That's HTML. All of it. A house built from blocks you can see and touch — and once you see that, the mystery is gone and you're just placing blocks.

The second reason the metaphor works: in Minecraft, nobody reads a book about blocks before placing one. You place a bad block, look at it, adjust. That's how this course teaches. Every lesson ends with something you can SEE in a browser, within minutes. The 3-second rule of this repo (ADR-002) applies to teaching too: if a brother can't see his progress in about three seconds of opening the file, we've lost him.

---

## What you'll be able to do when you finish

1. **Read HTML like a map** — open any webpage, right-click → Inspect, and understand what you're seeing: which part is the room, which is the sign, which is the door.
2. **Build a complete one-page site from scratch** — not a copy-tutorial: your own page, about anything you care about, with a real title, real sections, a working link, a real image, and styling that makes it yours.
3. **Publish it live on GitHub Pages** — a real URL, free hosting, live to the world. Your family can open it on their phones. That URL is a receipt.
4. **Explain what you built to anyone, in plain terms** — because every lesson comes with the street-translation of every term you meet (the jargon table habit lives here too).

---

## The lesson plan

### Lesson 1: The House — What HTML Is (brick-one-html.md)
The full walkthrough of Brick One: the house metaphor worked through every tag, the three tags that are 90% of the web (`<div>`, `<p>`, `<a>`), the family of heading blocks, and the image block. Ends with your first file saved and opened in a browser — the moment you place your first block and see it exist.

### Lesson 2: The Paint — CSS Without Fear (brick-one-html.md, second half)
Same file, second half: styling your house. The Cyber-Hustle theme of this repo (styles.css at the root) is a complete ready-to-wear paint job — you'll copy three lines of CSS from it into your own file and watch your page transform. Then you'll change the colors to yours. Painting is where the house stops being a skeleton and starts being yours.

### Lesson 3: The Address — Publishing on GitHub Pages (brick-one-html.md, final part)
The complete publish path: repo → settings → Pages → live URL. Including the three most common failure points (branch selection, file naming — it must be `index.html`, not `home.html` — and the two-minute patience window while the site goes live).

### Lesson 4: The First Remodel — Your Next Block
Not a lesson, a launching pad. The last section of brick-one-html.md points you at the next blocks: a second page, a contact form, the PWA conversion (core-system/manifest.json + service-worker.js patterns) that turns any site into an app. It also points you at the next course: 03-the-corporate-ship, where the house you built becomes a résumé argument.

### The Interactive Playground (index.html)
This course ships with a runnable playground: `index.html` in this folder. Open it in any browser — no internet needed after first load (it's a PWA — core-system/manifest.json pattern) — and you can:
- Tap any block-type button to see live what `<div>`, `<p>`, `<a>`, `<img> and heading tags DO on a page.
- Type into the live editor and see your HTML render as you type (the render loop is 30 lines of vanilla JS — read it, it's readable).
- Save your work locally (localStorage — your draft stays in THIS browser even if you close it, and travels with no account needed).
- Share nothing you don't want shared — the playground is offline-capable, private, and keeps drafts on-device. SECURITY.md rules: nothing leaves your phone without your say-so.

The playground is the Minecraft server for HTML: a world where placing blocks is safe, instant, and fun. Break blocks. Place blocks. Stand in the house you built.

---

## The raffle math

| Action | Tickets |
|---|---|
| First HTML file saved and opened in a browser (screenshot posted) | 5 |
| One-page site published live on GitHub Pages (link posted in discussions) | 10 |
| Help another brother publish his first site (commented walkthrough) | 5 |
| Submit the playground or your site as a Show and Tell ([SHIP] tag) | 5 |

A brother who finishes this course and helps one other brother gets to 15 tickets before he knows what a `<div>` does. That's the point. The door opens before you're "ready." That's how doors work.

---

## The fine print

**Zero assumed knowledge.** This course assumes you can read, own any device with a browser, and nothing else. Phone-only brothers can do the whole course on a phone — the playground is 360px-first, and GitHub's web editor works on mobile. If you're PC + tether, even better: open the playground on the PC and test on the phone. Both paths are first-class here.

**The house is yours, not the course's.** The example project is "My Block" — a page about your own world: your city, your people, your hobbies, your music. The course never assigns you a topic. It hands you blocks and says build the house you want. A course that assigns you somebody else's dream is a course about somebody else.

**When it breaks:** Every lesson has a "when it breaks" section. And when you hit something outside those sections, that's a bug report (.github/ISSUE_TEMPLATE/02_bug_alert.md exists for exactly that moment), and a maintainer fixes it same-day. The block doesn't leave you stuck alone.

---

## Your Move

Open brick-one-html.md and place your first block. The playground is right here in this folder for when you want to try a block before reading about it. The URL that's live at the end of this course — that's a receipt that no one can take from you. Build the house. Stand in it.

*All paths in this course point to real files in the FED-EDU repo. Broken link? That's a bug — file it (.github/ISSUE_TEMPLATE/02_bug_alert.md), and it gets fixed same-day.*
