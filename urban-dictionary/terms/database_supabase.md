# Database (Supabase)

**Category:** data · **Added by:** fedpromptly · **Level:** beginner

## 🗣️ Plain Talk Translation

A **database** is a filing cabinet that lives on the internet — but smarter. You don't open drawers and dig; you ASK it questions and it hands you the answer in a blink.

"Give me every brother who earned more than 50 tickets" — the database answers in a fraction of a second, no matter if that's 10 records or 10 million. Try that with a paper filing cabinet.

**Supabase** is a brand of internet filing cabinet with a generous free tier — and it's the ONLY outside service the block uses for real data (ADR-006). Everything else on FED-EDU runs on plain JSON files in the repo (ADR-005). The StatTracker — live stats that update without pushing code — is the one thing that needed a real database, so it lives on Supabase's free tier.

## 🏪 Life Example

The barbershop notebook. Old-school shops keep a book: client name, cut preference, phone number, last visit. That's a database — paper edition. When the barber asks "what number guard did you want again?", he's querying the book.

Supabase is that notebook, but: it never fills up, it's readable from any phone on earth, two barbers can write in it at once without smudging each other's pages, and it answers questions instantly — "show me every client who hasn't been back in 6 weeks" takes one query instead of an hour of flipping.

## 💻 What It Looks Like

Databases speak **SQL** — short commands that read almost like plain English:

```sql
SELECT name, tickets FROM brothers WHERE tickets > 50;
```

Read that out loud: "select name and tickets from brothers where tickets is more than 50." That's it. That's SQL. The scary database language is a sentence.

## ⚖️ JSON Files vs. Supabase — When the Block Uses Which

| Situation | What we use | Why |
|---|---|---|
| Data that changes with commits (listings, wiki terms, raffle rates) | **JSON files in the repo** (ADR-005) | Version-controlled, free forever, reviewable by PR — GitHub IS the database |
| Data that must change WITHOUT a code push (live stats, live counters) | **Supabase free tier** (ADR-006) | A JSON file can't update itself from a stranger's visit; a database can |

The block's rule: **boring and free beats fancy and paid.** We only escalate to a real database when reality forces it (the StatTracker did).

## 💰 Where It Pays

Every business with customers, inventory, or bookings needs data stored and queried. "I can build you a system that remembers your clients and reminds you when they're due back" is a $300+ automation pitch (see PRICING.md) — and it's a database + a script. Barbers, trainers, detailers, cleaners: the whole local economy runs on remembering things.

## 🔗 Related Terms

- [JSON](json_explained.md) — the block's main format (the repo-as-database play)
- [API Endpoint](api_endpoint.md) — the door you knock on to reach a database

## 🏁 Your Move

Skim `excellence-matrix/matrix-engine.js` in this repo — the matrix page reads its database as plain JSON files with zero server. Then look at ADR-006 (in `ADR.md`) for the one place we DIDN'T do that and why. You'll understand the block's whole data philosophy in ten minutes — and that philosophy is a hireable opinion in interviews.
