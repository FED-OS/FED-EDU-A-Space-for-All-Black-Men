/* ============================================================
   raffle-logic.js — FED-EDU Physical Raffles
   ============================================================
   The engine that turns raffle tickets into refurb PCs for
   brothers who need them. Transparent odds, honest math,
   everything auditable from the data files.

   THE MISSION PIECE THIS RUNS
   The refurb PC raffle: brothers earn tickets (PRs, guides,
   blueprints, commissions), tickets go in the hat, a winner
   takes a refurbished PC shipped safe (checklist covered).

   WHY THIS CODE MATTERS
   Raffles die from one thing: brothers not trusting the draw.
   This engine makes the draw REPRODUCIBLE — the winner is a
   function of (public ticket list + public draw seed). Any
   brother can re-run the math and get the same winner. That's
   not just fair, it's PROVABLE fair. The auditable raffle is
   the raffle that lasts.

   WHAT YOU'LL LEARN BY READING THIS
   - deterministic draws: same inputs, same winner, every time
   - a seeded PRNG (mulberry32) — why Math.random() alone
     can't give you a reproducible draw
   - weighting entries: one brother, many tickets, fair odds
   - verification as a first-class feature, not an afterthought

   THE RULES THIS FILE OBEYS
   - vanilla only (ADR-001), zero dependencies
   - the draw is public math on public data
   - phone-only brothers can verify the result by hand
   ============================================================ */

"use strict";

(function () {

  // ---------- the seeded PRNG: mulberry32 ----------
  // Why not Math.random()? Because Math.random() can't be re-run.
  // A provable draw needs: publish the seed, publish the entries,
  // every brother re-runs the same function, gets the same winner.
  // mulberry32 is 6 lines, well-known, and good enough for a
  // community raffle (it's not cryptography — it's reproducibility).
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- string seed -> number seed ----------
  // Draw seeds are published as strings (raffle id + date).
  // This hash turns any string into a 32-bit seed. Simple FNV-1a.
  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // ---------- the ticket pool ----------
  // One row per ticket (not per brother). A brother with 5 tickets
  // occupies 5 rows. The draw picks a row; the row's owner wins.
  // This is the hat model: you can literally count the rows by hand
  // and verify the odds. Simple beats clever when trust is the product.
  function buildPool(entries) {
    // entries: [{handle, tickets}]
    var pool = [];
    entries.forEach(function (e) {
      for (var i = 0; i < e.tickets; i++) pool.push(e.handle);
    });
    return pool;
  }

  // ---------- the draw ----------
  // Fisher-Yates shuffle over the pool with the seeded PRNG, then
  // the first row wins. Deterministic: same seed + same pool =
  // same shuffle = same winner, on every machine, forever.
  function draw(entries, seedString) {
    var pool = buildPool(entries);
    if (!pool.length) return { winner: null, poolSize: 0, note: "empty pool — no tickets entered" };

    var rand = mulberry32(hashSeed(seedString));

    // Fisher-Yates (the fair shuffle — every arrangement equally likely)
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }

    return {
      winner: pool[0],
      poolSize: pool.length,
      seed: seedString,
      verify: "Re-run with the same entries and seed '" + seedString +
              "' — the winner is the same. That's the whole proof."
    };
  }

  // ---------- odds per brother (published BEFORE the draw) ----------
  function odds(entries) {
    var total = entries.reduce(function (s, e) { return s + e.tickets; }, 0);
    if (!total) return [];
    return entries.map(function (e) {
      return {
        handle: e.handle,
        tickets: e.tickets,
        odds: (e.tickets / total),
        oddsPct: Math.round(1000 * e.tickets / total) / 10 + "%"
      };
    }).sort(function (a, b) { return b.tickets - a.tickets; });
  }

  // ---------- UI wiring (for physical-raffles/index.html) ----------
  function boot() {
    var poolEl = document.getElementById("raffle-pool");
    var drawBtn = document.getElementById("raffle-draw");
    var resultEl = document.getElementById("raffle-result");
    var seedEl = document.getElementById("raffle-seed");
    if (!poolEl || !drawBtn || !resultEl) return;

    // entries parsed from the textarea (handle: tickets, per line)
    function parseEntries(text) {
      return text.split("\n").map(function (line) {
        var m = line.match(/^\s*([a-zA-Z0-9_-]+)\s*[:\s]\s*(\d+)\s*$/);
        if (!m) return null;
        return { handle: m[1], tickets: parseInt(m[2], 10) };
      }).filter(Boolean);
    }

    function refresh() {
      var entries = parseEntries(poolEl.value);
      var rows = odds(entries);
      resultEl.innerHTML = rows.length
        ? rows.map(function (r) {
            return "<div class='odds-row'><b>" + r.handle + "</b> " +
              r.tickets + " tickets · " + r.oddsPct + "</div>";
          }).join("")
        : "<div class='odds-empty'>enter brothers as handle: tickets, one per line</div>";
    }

    poolEl.addEventListener("input", refresh);

    drawBtn.addEventListener("click", function () {
      var entries = parseEntries(poolEl.value);
      if (!entries.length) {
        resultEl.innerHTML = "<div class='odds-empty'>no entries yet — the hat is empty</div>";
        return;
      }
      var seed = (seedEl && seedEl.value.trim()) || "FED-RAFFLE-DEFAULT";
      var result = draw(entries, seed);
      var banner = document.createElement("div");
      banner.className = "draw-banner";
      banner.innerHTML = "<b>WINNER: " + result.winner + "</b><br>" +
        "pool: " + result.poolSize + " tickets · seed: \"" + result.seed + "\"<br>" +
        "<span class='verify-note'>" + result.verify + "</span>";
      resultEl.innerHTML = "";
      resultEl.appendChild(banner);
    });

    refresh();

    // console learners — the real raffle runs this exact math:
    // FEDRaffle.draw([{handle:"brother-a",tickets:5},{handle:"brother-b",tickets:2}], "SPRING-2026")
    window.FEDRaffle = {
      draw: draw,
      odds: odds,
      buildPool: buildPool,
      mulberry32: mulberry32,
      hashSeed: hashSeed,
      demo: function () {
        return draw([
          { handle: "sample-brother", tickets: 38 },
          { handle: "kingston-tether", tickets: 12 },
          { handle: "library-terminal-brother", tickets: 8 }
        ], "SPRING-2026-REFURB-PC");
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
