# The Block — GitHub Pages Repo

An eye-catching landing page, 14 uniquely named pages with tab navigation, and a
tabs view — ready to push to GitHub and serve via GitHub Pages.

## Repo contents

```
index.html              ← landing page (hero, stats, marquee, 14 cards, tabs promo)
styles.css              ← landing page styles (shared, edit here to restyle)
app.html                ← tabs view: flip between all pages in one window
hustle-index.html       physical-raffles.html    prompts.html
sandbox-blueprints.html support-the-block.html  urban-dictionary.html
wiki.html               community-boards.html    core-system.html
courses-and-guides.html discussion.html         excellence-matrix.html
fed-comm-dm.html        fedpromptly-coach.html   ← all with a shared tab bar
.nojekyll               ← tells GitHub Pages to serve files as-is
README.md               ← this file
```

## Navigation built in

- Every page has a sticky tab bar at the top linking to all other pages; the
  current page's tab is highlighted.
- The landing page (index.html) shows all 14 pages as cards.
- app.html is a single-page tabs view: click tabs to swap pages inside one
  window; each tab gets its own URL hash (app.html#wiki) so it can be
  bookmarked/shared.

## Step 1 — Replace the placeholder content

Every page except the homepage contains a marked section:

```html
<!-- ============================================= -->
<!-- REPLACE EVERYTHING BETWEEN THESE MARKERS      -->
<!-- WITH YOUR REAL HTML CONTENT FOR THIS PAGE     -->
<!-- ============================================= -->
<p>Paste your [Page] content here.</p>
<!-- ============ END CONTENT MARKER ============== -->
```

Open each file, delete the placeholder paragraph between the markers, and paste your
real HTML for that page. Keep the `<head>` block so styling stays consistent (or replace
it entirely — it's your code). The "Back to home" link at the bottom is optional; keep
or remove as you like.

Mapping (upload slot → file):

| Upload name | File |
|---|---|
| hustle-index | hustle-index.html |
| physical-raffles | physical-raffles.html |
| prompts | prompts.html |
| sandbox-blueprints | sandbox-blueprints.html |
| support-the-block | support-the-block.html |
| urban-dictionary | urban-dictionary.html |
| wiki | wiki.html |
| community-boards | community-boards.html |
| core-system | core-system.html |
| courses-and-guides | courses-and-guides.html |
| discussion | discussion.html |
| excellence-matrix | excellence-matrix.html |
| fed-comm-dm | fed-comm-dm.html |
| fedpromptly-coach | fedpromptly-coach.html |

## Step 2 — Push to GitHub

Run these commands from inside this folder:

```bash
git init
git add .
git commit -m "14 pages, uniquely named"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/the-block.git
git push -u origin main
```

(Replace YOUR-USERNAME and the repo name with your own. Create the empty repo first
at github.com/new — do NOT add a README or .gitignore from the web UI, since this
folder already has them.)

## Step 3 — Enable GitHub Pages

1. Open your repo on GitHub → **Settings** → **Pages** (left sidebar)
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**
3. Branch: **main**, folder: **/(root)** → **Save**
4. Wait 1–2 minutes for the build to finish

Your site goes live at:

```
https://YOUR-USERNAME.github.io/the-block/
```

Every page is then reachable directly:

```
https://YOUR-USERNAME.github.io/the-block/hustle-index.html
https://YOUR-USERNAME.github.io/the-block/wiki.html
... (same pattern for all 14)
```

## Why every file has a unique name

GitHub Pages (like any static host) serves files by path. Two files named
`index.html` in the same folder would overwrite each other — only one can exist
per folder. Unique names mean:

- One repo, one deployment, 14 working pages
- The homepage (`index.html`) is the site root; everything else is a sub-path
- If you later want clean URLs like `/wiki` (no `.html`), move each page into its
  own folder as that folder's `index.html` — e.g. `wiki/index.html` serves at
  `/wiki/`. Optional; the flat version works fine as-is.

## Updating pages later

Edit any file → commit → push. GitHub Pages redeploys automatically:

```bash
git add .
git commit -m "update wiki page"
git push
```

## Notes

- `.nojekyll` is required: it stops GitHub Pages from running Jekyll processing,
  which can skip files starting with underscores or that look like Jekyll assets.
- All internal links in the homepage are relative (`wiki.html`, not `/wiki.html`),
  so the site works both at a subpath (`username.github.io/the-block/`) and at a
  custom domain root.
- If you attach a custom domain later (Settings → Pages → Custom domain), the same
  relative links keep working with zero changes.
  
Forked by Daigon876 on a mission.
