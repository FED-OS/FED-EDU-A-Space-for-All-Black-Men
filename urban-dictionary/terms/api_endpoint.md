# API Endpoint

**Category:** web · **Added by:** fedpromptly · **Level:** beginner

## 🗣️ Plain Talk Translation

An **API** is a waiter: you order, the waiter carries your request to the kitchen (the server), and brings back your food (the data).

An **endpoint** is a specific door at the restaurant — the exact spot where you place a specific kind of order. One restaurant might have a door for pizza orders, a door for salad orders, and a door for reservations. Same building, different doors, different outcomes.

So: **an endpoint is a URL where a specific kind of request gets a specific kind of answer.**

## 🏪 Life Example

The corner store. One building, several windows:

- The front register → you ask for the total, you pay — that's `GET /price`
- The deli counter → you order the sandwich EXACTLY how you want it — that's `POST /order`
- The ATM outside → different window entirely, different machine, but same block — that's a different service with its own endpoints

You already use endpoints daily. Every time your weather app refreshes, it's knocking on `api.weather.com/today` and saying "give me today." Every time you refresh Instagram, you knock on Instagram's feed endpoint. You just never saw the door.

## 💻 What It Looks Like (Code You Can Read)

```
https://api.example.com/weather?city=atlanta
```

Read it left to right: "the example API … the weather door … for Atlanta." That whole line IS the endpoint. The `?city=atlanta` part is you telling the waiter your table number.

## 💰 Where It Pays

Brothers on the block charge $250+ to build things that "talk to APIs" — a sneaker price tracker (knocks on a store's endpoint every hour), a weather widget for a client site, a bot that posts to social automatically. Every "automation" hustle is endpoint work at heart. See `sandbox-blueprints/04-streamer-tools/trend-scraper.py` — it's literally a brother knocking on endpoints and getting paid for the answers.

## 🔗 Related Terms

- [JSON](json_explained.md) — the language endpoints usually answer in
- [Database](database_supabase.md) — the kitchen the waiter pulls your food from

## 🏁 Your Move

Open a new browser tab and paste this real public endpoint: `https://api.github.com/users/torvalds` — you just knocked on GitHub's door and got a JSON answer back (what Linus's GitHub looks like to machines). That's an API response, live, free, from your phone. You've been a door-knocker your whole life; now you know the name.
