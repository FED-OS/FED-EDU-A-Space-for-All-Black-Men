# JSON

**Category:** data · **Added by:** fedpromptly · **Level:** beginner

## 🗣️ Plain Talk Translation

**JSON** is a way of storing information in labeled boxes — a format both humans and machines can read. You write it with your hands; computers read it with their eyes. It looks like curly braces `{ }` and quotes everywhere, but underneath it's just **labeled boxes**.

The block runs on it (ADR-005): the Hustle Index listings, the Urban Dictionary index, the raffle rates, the excellence matrix data — all plain JSON files sitting in the repo, updated by pull request. **On this block, GitHub IS the database and JSON is the filing format.**

## 🏪 Life Example

A manila folder in a filing cabinet. On the tab: "LEASE." Inside: labeled lines — Name: Marcus. Unit: 4B. Rent: $1,100. Start: March 1.

That's JSON. The folder `{ }` is the braces. The lines `"rent": 1100` are the labels and what's inside them. Anybody who opens the folder knows exactly where everything is — no phone call to the landlord, no guessing. And a machine can find "rent" across a MILLION folders in a blink.

You've been reading structured files your whole life — restaurant menus, price sheets, clipper guard charts. JSON is just the digital version with strict spelling rules.

## 💻 What It Looks Like

A Hustle Index listing (this is REAL — it's the shape in `hustle-index/members/`):

```json
{
  "github": "marcus-builds",
  "name": "Marcus J.",
  "city": "Atlanta, GA",
  "skills": ["one-page sites", "bug fixes"],
  "rates": {
    "one_page_site": 150,
    "five_page_site": 500
  }
}
```

Read it out loud: github is marcus-builds. Name is Marcus J. Skills is a LIST (square brackets `[ ]` = a row of boxes). Rates is a folder INSIDE the folder. **You just read production code.** That's a real listing format brothers push every week.

## ⚖️ The Four Rules of JSON (The Only Syntax That Matters)

1. **Labels get double quotes**: `"name"` ✅ — not `'name'` ❌ not `name` ❌
2. **Colons separate label from value**: `"city": "Atlanta"` — label, colon, value
3. **Commas between entries — but NO comma after the last one.** The #1 JSON bug on this block, by far. `{"a": 1, "b": 2,}` = broken (trailing comma). This single rule is why `build.yml` validates every JSON file on every push.
4. **Braces match**: every `{` needs its `}` — every `[` needs its `]`. Count your brackets like you count your change.

Break a rule and the whole file refuses to load — but here's the beauty: the build check catches it BEFORE it reaches the block, and the error message names the exact line. The machine polices its own grammar so you learn it fast.

## 💰 Where It Pays

JSON is EVERYWHERE — every app's settings, every API's answers ([API Endpoint](api_endpoint.md) speaks JSON), every config file, every hustle the block runs. A brother who can read and write JSON can: update marketplace listings, build data for client sites, read API responses, and debug configs — that's four income streams from one format. It's the closest thing tech has to a universal dialect, and it takes an afternoon to learn.

## 🔗 Related Terms

- [API Endpoint](api_endpoint.md) — the door; JSON is what comes back through it
- [Database](database_supabase.md) — when JSON files stop being enough

## 🏁 Your Move

Open `urban-dictionary/index.json` in your fork and READ it — just read, no editing. Find the terms list, find one term's entry, and notice the four rules in action. Then click the pencil and add a fake term (any slug, any one-liner) WITHOUT breaking a rule, and check the JSON with [jsonlint.com](https://jsonlint.com) before you commit. Ten minutes and you'll never fear curly braces again — and a build system that catches your mistakes is the best teacher in the world.
