# 🧠 FED-EDU ADR — Architecture Decision Records

> Why we build the way we build. Each decision gets a number, a status, and the reasoning — so a brother joining in 2028 can understand why things are the way they are, and propose changing them when times change.

**Format:** ADR-0XX — Title — Status (Accepted / Proposed / Superseded)

---

## ADR-001 — Ultra-Lightweight Vanilla Web Stack — ACCEPTED

**Decision:** The frontend is plain HTML, CSS, and vanilla JavaScript. No React, no Vue, no build-tool dependency chains.

**Why:** The core constraint is hardware reality. A meaningful share of this community runs tethered phones into scrap desktops on metered 3G. A framework's JS bundle alone can outweigh an entire FED-EDU page. Build complexity also gates beginners — "install these 6 tools before Hello World" is a wall we refuse to build. Vanilla is learnable, debuggable from any phone, and fast by default.

**Trade-off accepted:** We hand-roll things frameworks give free (state handling, components). We accept this because our pages stay small enough that hand-rolling is genuinely easy.

---

## ADR-002 — GitHub As The Community Backbone — ACCEPTED

**Decision:** The org, repos, issues, discussions, Pages, and API are the entire infrastructure. No separate forum software, no Discord dependency at the core.

**Why:** Free forever, mobile-capable, and — critically — the same platform teaches the skill. A brother navigating FED-EDU is learning professional-grade git/GitHub workflows by immersion. The community IS the curriculum. Profiles, badges, and contribution graphs become the portfolio organically.

**Trade-off accepted:** GitHub's native discussion tools are limited (the founder's exact complaint that motivated the custom DM system — ADR-004). We build bridges rather than abandoning the platform that doubles as our classroom.

---

## ADR-003 — Street Terms As The Translation Layer — ACCEPTED

**Decision:** All educational content is written in plain street terms first, with technical terms appearing only alongside translations. The urban-dictionary/ module is a first-class component, not a glossary appendix.

**Why:** Language is the gate. "Initialize an asynchronous API endpoint payload request" is a wall for someone who'd instantly understand "hit up your plug for the data without freezing your screen." Same knowledge, different door. Cultural translation — not stereotyping — is the mission: every kind of Black man, met where he stands.

**Trade-off accepted:** Some search engines and outsiders may find the tone unusual. We optimize for the 14-year-old on the block, not the search algorithm.

---

## ADR-004 — Custom DM System Over GitHub Gists — ACCEPTED

**Decision:** Build fed-comm-dm (chat-engine.js + encryption-layer.js) using the GitHub API for transport rather than waiting on GitHub's native messaging.

**Why:** Gists and profile comments are public, clumsy, and unmaintained as messaging channels — the founder's words: "gists and community tabs suck." Direct brother-to-brother connection is the community's connective tissue; it must be private (client-side encryption), mobile-first, and inside the ecosystem so nobody gets pulled into corporate platforms that harvest data.

**Trade-off accepted:** We maintain messaging infrastructure ourselves. Kept deliberately minimal — the GitHub API does the heavy lifting; the client stays under the 3-second rule like everything else.

---

## ADR-005 — JSON Files Over A Database (For Everything Except StatTracker) — ACCEPTED

**Decision:** Member profiles, hustle listings, excellence matrix data, urban dictionary terms, raffle metrics — flat JSON files in the repo, version-controlled, updated by pull request.

**Why:** A database is a second system to run, secure, pay for, and learn. JSON-in-git means: every change has a history receipt, every brother can contribute via PR (which IS the curriculum), no server to fall over, and zero cost. Git is the database until the community genuinely outgrows it.

**Trade-off accepted:** No real-time writes from the frontend — updates flow through PRs. For a community whose whole ethos is "push to earn," that's a feature wearing a disguise.

---

## ADR-006 — Supabase Free Tier For StatTracker Only — ACCEPTED

**Decision:** The football StatTracker blueprint uses free-tier Supabase for live stat entry from the sidelines; everything else stays JSON.

**Why:** A stat tracker needs instant writes from a phone at a game — that's the one place PR-flow is the wrong tool. Supabase's free tier is generous enough for a HS team's season, teaches real backend skills (SQL schema included), and costs nothing.

**Trade-off accepted:** A blueprint that needs an external account. Documented step-by-step in the blueprint; brothers who skip it can still run StatTracker in local JSON mode.

---

## ADR-007 — Progressive Web App Distribution — ACCEPTED

**Decision:** Ship as a PWA (manifest + service worker) — installable on any device via "Add to Home Screen" — with APK wrapping as the v2.0 follow-up.

**Why:** App stores are gatekeepers: review processes, fees, account requirements. The block's app needs to reach a brother's phone through one tap on a link. PWA delivers that, works offline through the service worker, and updates instantly on deploy.

**Trade-off accepted:** Some iOS features lag native apps. Acceptable — reach beats polish for the mission.

---

## ADR-008 — MIT License For Sovereign Ownership — ACCEPTED

**Decision:** MIT License across the project.

**Why:** The mission is brothers OWNING what they build. MIT is maximally permissive: fork a blueprint, build a business on it, charge for your version, keep 100% of your rights. The only requirement — keep the notice — keeps the trail open for the next brother to find his way here.

**Trade-off accepted:** Nothing prevents outside parties from using the work. Deliberate: a door that only opens one way isn't a door, it's a wall. See COPYING.md.

---

## ADR-009 — AI Coach As Bridge, Not Oracle — ACCEPTED

**Decision:** fedpromptly integration + the prompts/ library position AI as an always-available coach with mandatory verification culture — every AI answer gets double-checked before shipping.

**Why:** 3AM, script broken, no humans awake: the coach pulls up, explains in plain terms, hands over code. That saves learners from quitting in the dead hours. But AI makes mistakes — the culture of verify-before-ship is taught from day one (it's in the prompts themselves and the NOTICE).

**Trade-off accepted:** Slower than blind copy-paste. Correct beats fast — a lesson that pays off a thousand times in this craft.

---

## ADR-010 — Flags, Daps, And Databases Of Excellence As Identity Layer — ACCEPTED

**Decision:** Members rep flags (country/culture) on their profiles; the excellence matrix maps cultural icons to technical skills; achievements are called daps and are public.

**Why:** Representation is the retention engine. A Jamaican brother seeing other Jamaican brothers building; a kid seeing Kai Cenat's traffic engineering mapped to a learning path — that's the moment "tech isn't for me" dies. Identity-first features aren't decoration; they're onboarding.

**Trade-off accepted:** Iconic figures get referenced for inspiration — handled respectfully, with a removal-on-request policy in NOTICE.md.

---

*New ADRs get added as the community makes new weighty calls. Format: number, title, status, the decision, the why, the trade-off we consciously accepted. Argue with any of these in the discussions — ADRs are proposals that got accepted, not commandments carved in stone.*
