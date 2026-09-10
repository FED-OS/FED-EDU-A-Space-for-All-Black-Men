# 💼 List on Hustle Index — Put Your Services in Front of the Block

**Plain terms:** The Hustle Index is the block's marketplace. You built a skill — now list it. Brothers (and local businesses) come here looking for builders: websites, bots, fix-ups, tutoring. Listing is free, takes one PR, and your card stays up as long as you keep building.

## 🧠 How It Works

The marketplace runs as plain JSON files — our database (ADR-005). Your listing is one small file in `hustle-index/members/`:

- **Customers browse** the live site (`fedpromptly.github.io/FED-EDU/hustle-index/index.html`)
- **They click through** to YOUR GitHub, Ko-fi, or contact link
- **You handle the deal** — the Index is the storefront, not the middleman. We take zero cut. (Founding rule: the block never taxes a brother's hustle.)
- **Rate floors protect everybody** (see [Price Your Work](Price-Your-Work.md) and [PRICING.md](../../PRICING.md)): nobody lists a full website for $75, because one undercutter starves the whole block.

## 🪜 The Steps — Your Listing (20 minutes)

### Step 1 — Copy the pattern

Look at the sample listing: `hustle-index/members/sample_brother_hustle.json` in the repo. It's small — name, skills, rates, links. That file IS the whole listing.

### Step 2 — Make yours

In your fork, create `hustle-index/members/your-username.json` following the sample's exact shape:

```json
{
  "github": "your-username",
  "name": "Marcus J.",
  "city": "Atlanta, GA",
  "level": "Builder",
  "skills": ["one-page websites", "small business sites", "bug fixes"],
  "rates": {
    "one_page_site": 150,
    "five_page_site": 500
  },
  "work_links": [
    "https://your-username.github.io/your-site/",
    "https://github.com/your-username/another-project"
  ],
  "contact": "Ko-fi or GitHub — whatever you check daily",
  "since": "2026"
}
```

(Keep it honest — the sample is the pattern, not a template to inflate.)

### Step 3 — Check the rate floors and the schema

Before you PR, check your numbers against the floors in [PRICING.md](../../PRICING.md): one-page $150+, multi-page $500+, retainers $50/mo+. If your numbers are below floor, a maintainer will ask you to raise them — not to gatekeep, but because $75 websites hurt every brother listing after you. The exact field format your listing must follow lives in `hustle-index/members/commissions_schema.json`.

### Step 4 — Open the PR

Title: `Hustle Index listing: your-username`. Body: quick description + which rate floor category you're in. Use the `#communitybuild` tag. A maintainer reviews (fast merge — see CONTRIBUTING.md) and your card goes live on the Index.

### Step 5 — Keep it fresh

Your listing is living data. Shipped a new project? Add it to `work_links`. Level up from Builder to Certified Builder (5 merged PRs)? Update it. A stale listing with dead links gets retired after 90 days of inactivity — the Index feeds families, so it stays current.

## 🎯 What Sells on the Block (Real Demand)

| Service | Demand | Why |
|---|---|---|
| One-page sites for barbers, trainers, DJs, detailers | 🔥🔥🔥 | Every local hustle needs a link-in-bio that looks pro |
| Link-in-bio pages (K-link style) | 🔥🔥🔥 | $150-300, one day of work once you have the pattern |
| Fix-ups / bug hunts on existing sites | 🔥🔥 | Brothers (and their clients) break things — you fix |
| Simple automation (forms → sheet → text) | 🔥🔥 | Small businesses drown in manual work |
| Tutoring / "build your first site in a weekend" | 🔥🔥 | The block grows — new brothers always need onboarding |

## ⚠️ Real Talk

- **Your GitHub IS your résumé.** Customers will click your GitHub before they DM you. Clean it up: pin your best repos, real READMEs, professional username (see [Make a GitHub Account](../First-Steps/Make-a-GitHub-Account.md)).
- **Take deposits.** 50% up front for new clients, non-negotiable handshake rule. Established clients can pay on delivery. The deposit is how you find out who's serious before you build.
- **The block doesn't tax the hustle.** Listing is free forever. The raffles and support runs on Ko-fi donations and the founder's pockets — not a percentage of your work. That's a founding rule (GOVERNANCE.md).
- **Vouching counts.** Once you complete work for another brother, ask for one line of vouch in the PR comments or Discussions. Reputation compounds faster than skills.

## 🏁 Your Move

Draft your `your-username.json` listing right now (even if you're not ready to PR it — draft it). Then complete one project worth linking (remix a blueprint from sandbox-blueprints/ if you need a first ship), and PR the listing. First listing merged earns tickets + your card on the live Index.

*Next rung: [Set Up Ko-fi →](Set-Up-Ko-fi.md)*
