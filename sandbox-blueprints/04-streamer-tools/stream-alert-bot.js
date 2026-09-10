#!/usr/bin/env node
/* ============================================================
   stream-alert-bot.js — FED-EDU Sandbox Blueprint 04, Rung 2
   ============================================================
   Made by FED-EDU for brothers who stream.

   WHAT THIS IS
     The real engine behind the alert wall you tested in
     index.html. That page fired TEST events with buttons.
     This file listens to LIVE events from your channel and
     feeds them to the same queue + dwell + chat-safe styling.

   TWO WAYS TO WIRE IT (pick ONE)
     1. Streamlabs Socket  — easiest. One token, five minutes.
        - Streamlabs Dashboard -> Settings -> API Settings
        -> "API Tokens" tab -> copy the SOCKET API TOKEN.
        - That token goes in config.json (see below). NEVER in
          a screenshot, NEVER in a PR, NEVER in chat. Token =
          keys to your wall. Treat it like your house key.

     2. Twitch EventSub (websocket) — the native road.
        - You need an app registered at dev.twitch.tv and an
          OAuth token with the right scopes. More setup, more
          control. Start with Streamlabs; graduate to this when
          you know why you want it.

   HOW TO RUN IT (PC rung)
     1. npm init -y               (once, in this folder)
     2. node stream-alert-bot.js  (plain Node, no packages
        needed for the Streamlabs road — the WebSocket client
        comes built into Node 21+. On older Node: npm i ws)

   WHAT IT DOES
     - Connects to your event source
     - Normalizes every event to {type, who, amount}
     - Queues them, plays them one at a time
     - Prints the alert text to the console AND writes the
       latest alert to alert-feed.json so ANY overlay can read it
       (OBS browser source -> a small page that fetches this file)

   HONEST LIMITS (read these)
     - This is a starting engine, not a finished product. Stream
       platforms change their APIs. If the connection drops, the
       bot retries with backoff — but you still need to keep an
       eye on it during a stream. Brothers watch their own wall.
     - No audio. Adding sound is your Rung 3 extension, and the
       pattern is in the urban-dictionary search engine (Web Audio,
       short synth beep, no file downloads).
     - Rates: this tool is for YOUR hustle. Selling alert overlays
       you build off this pattern: $150 floor for one overlay page
       (see PRICING.md). You built the skill — charge for the ship.

   TICKETS
     PR with a screenshot of your bot running against your real
     channel (redact the token!) = 15 raffle tickets, Rung 2.
   ============================================================ */

"use strict";

// ---------- config ----------
// CONFIG lives in config.json NEXT TO THIS FILE so the token never
// rides inside code you paste into Discord or a PR. .gitignore it.
//
// config.json shape:
// {
//   "source": "streamlabs",
//   "streamlabs_token": "YOUR_SOCKET_TOKEN",
//   "twitch_channel": "your_login_lowercase",
//   "dwell_ms": 4000,
//   "name_cap": 24,
//   "msg_cap": 120
// }

const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "config.json");

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const cfg = JSON.parse(raw);
    return cfg;
  } catch (err) {
    console.error("[bot] no config.json next to me — see the header comment for the shape.");
    console.error("[bot] copy config.example.json to config.json and fill it in.");
    process.exit(1);
  }
}

const config = loadConfig();

const DWELL = config.dwell_ms || 4000;     // one alert at a time
const NAME_CAP = config.name_cap || 24;    // chat-safe rule 3
const MSG_CAP = config.msg_cap || 120;
const FEED_PATH = path.join(__dirname, "alert-feed.json");

// ---------- the same queue engine as index.html ----------
// You already met this pattern on the test bench: alerts stack,
// one plays at a time, dwell drives the pace. Same shape here in
// Node — one pattern, two runtimes. That's the transfer lesson.

const queue = [];
let playing = false;

function capText(s, n) {
  s = String(s).trim();
  if (s.length > n) return s.slice(0, n - 1) + "…";
  return s;
}

// Plain-text output only. The console and alert-feed.json are DATA,
// not markup — no escapeHTML needed here because we never inject
// viewer names into HTML from this process. The overlay page that
// reads alert-feed.json does the escaping. Armor lives where the
// markup lives. (Same division as the DM engine: crypto in the
// library, armor in the bubble.)

function playNext() {
  if (queue.length === 0) {
    playing = false;
    return;
  }
  playing = true;
  const alert = queue.shift();
  const line = `${alert.head} — ${alert.who}` + (alert.amount ? ` ($${alert.amount})` : "");
  console.log(`[wall] ${line}`);
  writeFeed(alert);
  setTimeout(playNext, DWELL);
}

function pushAlert(alert) {
  alert.who = capText(alert.who || "Anonymous", NAME_CAP);
  if (alert.sub) alert.sub = capText(alert.sub, MSG_CAP);
  queue.push(alert);
  if (!playing) playNext();
}

function writeFeed(alert) {
  // alert-feed.json = the mailbox between this bot and ANY overlay.
  // Your OBS browser source points at a tiny page that fetches this
  // file on a timer (or you swap this for a local websocket later).
  const payload = JSON.stringify({
    head: alert.head,
    who: alert.who,
    amount: alert.amount || null,
    sub: alert.sub || "",
    fired_at: new Date().toISOString()
  }, null, 2);
  fs.writeFile(FEED_PATH, payload, () => {});
}

// ---------- normalizers: every platform, one shape ----------
// Events arrive shaped differently from every platform. We squash
// them into {type, head, who, amount, sub} BEFORE they hit the
// queue. One queue, one format, zero platform if/else downstream.
// This is the "database schema" lesson from football-stats, applied.

function normalizeStreamlabs(ev) {
  const msg = ev.message && ev.message[0] ? ev.message[0] : {};
  switch (ev.type) {
    case "follow":
      return { type: "follow", head: "NEW FOLLOWER", who: msg.name, sub: "welcome to the block" };
    case "subscription":
      return { type: "sub", head: "SUBSCRIBER", who: msg.name, amount: null, sub: "locked in, brother" };
    case "donation":
      return { type: "donate", head: "DONATION", who: msg.name, amount: msg.amount, sub: "appreciate you" };
    case "host":
      return { type: "host", head: "HOSTING", who: msg.name, amount: msg.viewers, sub: "sharing the room" };
    case "raid":
      return { type: "raid", head: "RAID INCOMING", who: msg.name, amount: msg.raiders, sub: "hold the wall" };
    default:
      return null; // merch, superchat variants etc: log and skip, don't crash
  }
}

function normalizeTwitch(ev) {
  // Twitch EventSub websocket notifications have
  // .metadata / .payload .event with per-type fields.
  const e = (ev.payload && ev.payload.event) || {};
  switch (ev.metadata && ev.metadata.subscription_type) {
    case "channel.follow.v2":
      return { type: "follow", head: "NEW FOLLOWER", who: e.user_name, sub: "welcome to the block" };
    case "channel.subscribe":
      return { type: "sub", head: "SUBSCRIBER", who: e.user_name, sub: "locked in, brother" };
    case "channel.cheer":
      return { type: "donate", head: "BITS", who: e.user_name, amount: e.bits, sub: "appreciate you" };
    case "channel.raid":
      return { type: "raid", head: "RAID INCOMING", who: e.from_broadcaster_user_name, amount: e.viewers, sub: "hold the wall" };
    default:
      return null;
  }
}

// ---------- Streamlabs socket road ----------
function connectStreamlabs(token) {
  if (typeof WebSocket === "undefined") {
    console.error("[bot] this Node build has no WebSocket client.");
    console.error("[bot] fix: npm install ws   (one package, no framework — ADR-001)");
    process.exit(1);
  }
  const ws = new WebSocket(`wss://sockets.streamlabs.com:443/socket?token=${token}`);

  ws.addEventListener("open", () => {
    console.log("[bot] wall connected to Streamlabs socket.");
    console.log("[bot] fire a test from your Streamlabs dashboard to see it land.");
  });

  ws.addEventListener("message", (raw) => {
    let data;
    try { data = JSON.parse(raw.data); } catch { return; }
    // Streamlabs sends: system pings, an auth ok, and event batches.
    if (data.type === "event") {
      const alert = normalizeStreamlabs(data);
      if (alert) pushAlert(alert);
      else console.log(`[bot] saw ${data.type} — no alert shape, skipped.`);
    }
  });

  // reconnect with backoff — drops WILL happen on long streams.
  let tries = 0;
  ws.addEventListener("close", () => {
    tries += 1;
    const wait = Math.min(30000, 2000 * tries); // 2s, 4s, 8s ... cap 30s
    console.error(`[bot] connection dropped. retry #${tries} in ${wait / 1000}s.`);
    setTimeout(() => connectStreamlabs(token), wait);
  });
  ws.addEventListener("open", () => { tries = 0; });
  return ws;
}

// ---------- Twitch EventSub road ----------
function connectTwitch(channel) {
  if (typeof WebSocket === "undefined") {
    console.error("[bot] this Node build has no WebSocket client.");
    console.error("[bot] fix: npm install ws");
    process.exit(1);
  }
  const ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

  ws.addEventListener("open", () => console.log("[bot] EventSub websocket open — waiting for welcome."));

  ws.addEventListener("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.data); } catch { return; }
    const t = msg.metadata && msg.metadata.message_type;

    if (t === "session_welcome") {
      // The welcome carries YOUR session id — this is what you
      // register subscriptions against in the Twitch API. The
      // registration call needs your app token and an HTTP POST;
      // that part lives in YOUR bridge (tiny Express script or
      // curl). Print it here so you can grab it:
      console.log("[bot] session id (register your subscriptions against this):");
      console.log("       " + (msg.payload && msg.payload.session && msg.payload.session.id));
      console.log("[bot] honest limit: full EventSub wiring needs a registered app.");
      console.log("[bot] brothers on Streamlabs road already have alerts flowing.");
      return;
    }
    if (t === "notification") {
      const alert = normalizeTwitch(msg);
      if (alert) pushAlert(alert);
      return;
    }
    if (t === "session_keepalive") return; // heartbeat, ignore
  });

  let tries = 0;
  ws.addEventListener("close", () => {
    tries += 1;
    const wait = Math.min(30000, 2000 * tries);
    console.error(`[bot] EventSub dropped. retry #${tries} in ${wait / 1000}s.`);
    setTimeout(() => connectTwitch(channel), wait);
  });
  ws.addEventListener("open", () => { tries = 0; });
  return ws;
}

// ---------- boot ----------
console.log("=".repeat(56));
console.log(" FED-EDU STREAM ALERT BOT — blueprint 04, rung 2");
console.log("=".repeat(56));

const source = (config.source || "streamlabs").toLowerCase();

if (source === "streamlabs") {
  if (!config.streamlabs_token || config.streamlabs_token === "YOUR_SOCKET_TOKEN") {
    console.error("[bot] config.json still has the placeholder token.");
    console.error("[bot] go to Streamlabs -> Settings -> API Settings ->");
    console.error("[bot] API Tokens -> copy the SOCKET token in. Not the access token — the SOCKET one.");
    process.exit(1);
  }
  console.log(`[bot] source: Streamlabs socket · dwell ${DWELL}ms · caps ${NAME_CAP}/${MSG_CAP}`);
  console.log("[bot] feed file: " + FEED_PATH);
  connectStreamlabs(config.streamlabs_token);
} else if (source === "twitch") {
  console.log(`[bot] source: Twitch EventSub · channel ${config.twitch_channel}`);
  connectTwitch(config.twitch_channel);
} else {
  console.error(`[bot] unknown source "${source}" — use "streamlabs" or "twitch" in config.json.`);
  process.exit(1);
}

console.log("[bot] queue live. alerts play one at a time. Ctrl+C to stand down.");
