# The Markdown Resume Builder
### A resume that lives in a repo, prints clean, and updates with every skill you gain

**Who this is for:** Every brother who needs paper proof of what he can do — first job, career switch, or second chance. **Output:** One page, one repo, one URL that updates itself every time you commit a skill.

---

## Why markdown, why a repo

A regular resume is a dead file. You email it, it gets stale, you forget which version you sent. The markdown resume is alive: it lives in a GitHub repo, renders as a styled page on GitHub Pages, and every new skill is a commit. The URL never changes; the content keeps getting truer. That's receipts on receipts — and it's the format this block runs on.

Markdown itself is the easiest marking language you'll ever learn: `#` makes a headline, `**bold**` makes bold, `-` makes a bullet. You already learned HTML blocks in 02-real-life-minecraft; markdown is the blocks with the tags shaved off. Five minutes of syntax and you're writing.

**The two formats, one source:** The same markdown file renders ON GitHub (your profile's receipts page) AND prints to a clean one-page PDF (that's what you hand the recruiter). Build once, use everywhere.

---

## The build, step by step

### Step 1: Make the resume repo

New repository → name it `resume`. Public (it's your receipts — private receipts are a contradiction). Create `resume.md`. This file is the source of truth — every edit for the rest of your career is a commit here.

### Step 2: The skeleton (copy this whole block, then fill it)

```markdown
# YOUR NAME
**What you do:** Front-end developer · HTML/CSS/JS · GitHub Pages deployments
**Live proof:** [yourname.github.io](https://yourname.github.io) · [github.com/yourname](https://github.com/yourname)
**Contact:** [city] · [email]

---

## PROOF OF WORK
### [Project One Name](link-to-repo-or-live-site) — *built [month/year]*
Responsive one-page site, built vanilla (no frameworks), deployed on GitHub Pages.
- Loads under 3 seconds on 3G — tested on a tethered connection, by design
- Accessible: alt text on every image, 88px touch targets on mobile
- [One more receipt: "Cut image weight 60% by compressing before upload" / "Wrote the README so a stranger can run it in 2 steps"]

### [Project Two Name](link) — *built [month/year]*
[One-line what-it-does.]
- [Receipt]
- [Receipt]

---

## SKILLS
**Building:** HTML, CSS, JavaScript (vanilla), responsive design, PWA basics
**Shipping:** Git, GitHub (PRs, code review, Actions), GitHub Pages deployment
**Working:** Documentation as part of the product, plain-talk communication, code review culture

---

## EXPERIENCE — THE REAL VERSION
### [Thing you actually did] — [city] · [dates]
- [Translated into corporate terms — see the translation table in
  fedpromptly-coach/prompts/resume_optimizer.txt: "Ran the league's numbers"
  → "Collected and analyzed weekly performance data; built automated stat tables (JavaScript)"]
- [Receipt, receipt]

### [Earlier thing] — [city] · [dates]
- [Translated line]
- [Translated line]

---

## EDUCATION & TRAINING
**[Program/course]** — [where] · [dates]
- [The real skills: "Built and deployed 3 sites; 11 merged PRs in a peer-review community"]

---

## THE BOTTOM LINE
[One sentence, your own voice: "I build light, fast, documented sites — and I
show the code. Live links above; the receipts are public."]
```

### Step 3: The translation pass — where the block becomes the resume

Fill EXPERIENCE with what you ACTUALLY did, translated. The full table lives in `fedpromptly-coach/prompts/resume_optimizer.txt` — the core moves:

- "Fixed cousins' phones and PCs" → "Provided technical support for 15+ users; diagnosed hardware and software issues"
- "Ran the cookout playlist" → "Managed event media systems for 200+ attendee events"
- "Sold kicks online" → "E-commerce operations: listings, customer communication, order fulfillment"
- "Built a promo page for an artist for free" → "Delivered a responsive landing page for a client — live link above"

Translation, never fabrication. The promo page you built for love IS experience. It never becomes "3 years at an agency" — that's a lie that follows you. See the resume coach's hard rules (fedpromptly-coach/prompts/resume_optimizer.txt) for the line and why we never cross it.

### Step 4: The GitHub-as-receipts pass

Your resume is only as strong as your profile. Before you send the resume anywhere:

1. **The profile README** — the `.github/README.md` pattern (this repo's own org profile is the template): who you are, what you build, live links, pinned repos. Anyone who hits your profile from the resume link should see the same receipts the resume promised.
2. **Pin the proof** — profile → Customize pins → your 2-4 best repos. The resume says "live links above"; the profile DELIVERS them.
3. **README discipline** — every pinned repo's README written for a stranger: what it is, what it does, how to run it in two steps. A repo with a lazy README is a receipt with the price tag torn off.

### Step 5: Print the PDF (the version recruiters get)

GitHub renders your markdown — repo page → `resume.md` renders styled. For the PDF: browser → open the rendered page → Print → "Save as PDF" → margins: default → Background graphics: ON (if you styled it) → Save. One page. If it spills to two, cut lines until it fits — the second page is where resumes go to die. What to cut first, in order: the oldest experience, the education details, any skill you can't demo from a pinned repo. What NEVER gets cut: PROOF OF WORK, the live links, contact.

### Step 6: The loop — the resume that updates itself

New skill learned → new project shipped → commit to `resume.md` → the live version is current before you've even updated your head. The resume stops being a chore (rewrite the whole doc every six months) and becomes a habit (commit the skill the week you gain it). That habit — version-controlled proof of growth — is itself something no other candidate's resume can say. "My resume is a repo with a commit history" is a sentence that wins rooms.

---

## The one-page audit (before you send it anywhere)

Run this checklist top to bottom:

- [ ] **Top third answers three things in 6 seconds:** who, what can you do, where's the proof (the skeleton's header does exactly this — name, stack, live links)
- [ ] **Every project has a working link** — a dead link on a resume is worse than no link (test every one, on your phone, the week you send)
- [ ] **Zero "objective" lines** — "Seeking a challenging position…" is dead; the PROOF OF WORK section is alive
- [ ] **Every jargon term you use, you can also explain out loud** — the interview cheat sheet (interview-cheat-sheet.md) will ask you to
- [ ] **One page** — always, at entry and second-chance level
- [ ] **No typos in the URL** — recruiters paste it; one wrong character is a 404 on your whole pitch
- [ ] **The record is not the headline** — skills lead; anything from the past is handled with the Ban-the-Box playbook (fedpromptly-coach/prompts/resume_optimizer.txt), not the resume
- [ ] **Rate floors respected** — if the resume doubles as a services page, the prices on it start at the floors: $150 one-pager, $500 multi-page, $50/mo retainer (PRICING.md). Underpricing on paper underprices you in the room.

---

## The second-chance addendum

If there's a gap or a record: the resume is a skills document and leads with skills. In Ban-the-Box jurisdictions, applications can't ask about records — so the resume doesn't volunteer what the law keeps off the application. The gap line in EXPERIENCE can be handled honestly in one line — "Focused period: technical training and independent building — see PROOF OF WORK ([dates])" — which is true (your GitHub IS the proof) and doesn't dwell. The full playbook — the background-check moment, the prepared sentence, fair-chance employer targeting — lives in the resume coach's file (fedpromptly-coach/prompts/resume_optimizer.txt). The map exists. Use the map.

---

## Your Move

Tonight, thirty minutes: make the `resume` repo, paste the skeleton, fill PROOF OF WORK with one real project. Even if "one real project" is the house you built in 02-real-life-minecraft this weekend — that's a live link, that's a receipt, that's the top third of the page done. Commit it. The resume is now alive and every skill you gain makes it truer.

*The translation table, the second-chance playbook, and the interview side of this story are all in this repo: fedpromptly-coach/prompts/resume_optimizer.txt and courses-and-guides/03-the-corporate-ship/interview-cheat-sheet.md. Real files, real paths — a broken one is a bug (.github/ISSUE_TEMPLATE/02_bug_alert.md), fixed same-day.*
