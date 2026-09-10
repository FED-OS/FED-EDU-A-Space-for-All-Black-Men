# 🏗️ Your First Website — HTML & CSS From Zero, In Plain Talk

**Plain terms:** Every website you've ever visited — every single one — is built from the same three things: HTML (the structure), CSS (the style), and JavaScript (the behavior). Today you build a real page with the first two. Real-life Minecraft, block one.

## 🧠 The Three Bricks (60 seconds)

Think of building a house:

- **HTML** = the frame — walls, rooms, doors. It exists without style, but it's ugly and bare.
- **CSS** = the paint, furniture, and interior design. It makes the frame presentable.
- **JavaScript** = the electricity — lights that turn on, doors that lock. Comes later; the house works without it, it's just less alive.

Today: frame + paint. A real page you can show your mother.

## 🪜 The Steps — Build "My First Page" (30-45 min, works on a phone)

We build in your FED-EDU fork so everything saves to your GitHub automatically.

### Step 1 — Create the file

In your fork: **Add file → Create new file** → name it `my-first-page.html` (must end in `.html`).

### Step 2 — Type this exactly (typing > pasting — the muscle memory matters)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My First Page</title>
  <style>
    body {
      background: #f7f2e9;
      color: #2a2520;
      font-family: Georgia, serif;
      text-align: center;
      padding: 40px 20px;
    }
    h1 { font-size: 2rem; }
    p  { color: #6f675c; max-width: 480px; margin: 12px auto; }
  </style>
</head>
<body>
  <h1>Big Marcus Was Here</h1>
  <p>Built by hand. No template. No shortcut. My first page.</p>
  <p id="date"></p>
</body>
</html>
```

### Step 3 — Commit it
Real message: `my first html page - frame and paint`

### Step 4 — See it live
The code in your repo IS the proof you built it — but a page deserves a real URL. The full move is one-time setup: [Publish on GitHub Pages](Publish-on-GitHub-Pages.md) — free hosting, your page on the real internet, ~5 minutes. Do it right after this page.

## 🧱 What Each Brick Did (The Teaching Section)

- `<!DOCTYPE html>` — tells the browser "this is a modern page, not 1998."
- `<head>` — the back office: settings the visitor never sees (title, viewport, styles).
- `<meta name="viewport"...>` — **the phone line.** Without it, phones render your page at desktop width and zoom out. This one line makes the page fit the phone screen. Never skip it.
- `<style>` — CSS lives here. Every rule is "target: { property: value; }" — `body { background: #f7f2e9; }` reads as "body: paint it warm cream."
- `#f7f2e9` / `#256d46` — color codes (hex). The first is the block's warm paper; the second is **forest green** — the official FED-EDU accent. Same colors as the whole site (styles.css).
- `<body>` — the storefront: everything the visitor sees.
- `h1` = the biggest headline (one per page, like a marquee); `p` = paragraph.

## 🎨 Remix Challenges (Pick One, 15 min)

The REAL learning is in changing things and seeing what happens:

1. Change `Big Marcus Was Here` to YOUR words.
2. Change `#256d46` to `#b07d2f` — refresh — note the green flip to bronze. You just redecorated.
3. Add a second `<p>` line under the first.
4. Add `border: 2px solid #256d46; padding: 20px;` inside the `h1 { }` block — box the headline.
5. Change `text-align: center;` to `left` — feel the layout shift.

Every remix = one experiment = one lesson nobody can take from you.

## ⚠️ Real Talk

- **Ugly is a stage, not a verdict.** Your first page SHOULD look humble. Mine did. Everybody's did. The skill stacks from here.
- **The semicolons and brackets matter.** Missing `}` breaks every rule after it. If the page looks unstyled, count your brackets first (this is 80% of beginner bugs).
- **Save early, save often.** Commit after every remix. The commit history becomes your highlight reel.

## 🏁 Your Move

Build the page above in your fork, commit it, then do remix challenge #1 and #2 (name + colors). Then take it live with [Publish on GitHub Pages →](Publish-on-GitHub-Pages.md) — a real URL your family can open on their phones tonight.

Full course with bricks at your pace: [courses-and-guides/02-real-life-minecraft](../courses-and-guides/02-real-life-minecraft/README.md)
