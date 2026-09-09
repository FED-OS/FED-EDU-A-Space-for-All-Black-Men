/* ============================================================
   market-engine.js — FED-EDU Hustle Index
   ============================================================
   The engine behind hustle-index/index.html.

   WHAT IT RUNS
   - The commission board: reads commission threads from
     commissions/ (JSON following commissions_schema.json)
   - The member market: reads members/*.json profiles
   - The rate floor law: PRICING.md floors rendered as a live
     banner so no brother ever quotes below the floor by accident

   WHAT YOU'LL LEARN BY READING THIS (the whole point)
   - fetch() + JSON files as a database (ADR-005)
   - a roster MANIFEST file: fetch one index, know every member
     (the same trick the excellence-matrix registry uses)
   - status filtering: open/claimed/in_progress/delivered/paid
   - escapeHTML armor: client briefs are TEXT, never markup
   - localStorage cache for the 3-second rule (ADR-002)

   THE RULES THIS FILE OBEYS
   - vanilla only (ADR-001), no build step, no dependencies
   - works from file:// and GitHub Pages equally
   - client names NEVER appear in the data files — privacy is law
   ============================================================ */

"use strict";

(function () {

  // ---------- the law: rate floors from PRICING.md ----------
  // Rendered as a banner, checked in renderCommission(). The floors
  // are community law (see commissions_schema.json). This engine
  // VISUALIZES the floor; build.yml ENFORCES it on the data.
  var RATE_FLOORS = {
    "one-pager": { label: "One-Pager", floor: 150, blurb: "single page, deployed, 1 revision round" },
    "multi-page": { label: "Multi-Page", floor: 500, blurb: "3+ pages with nav, deployed, 2 revision rounds" },
    "maintenance-retainer": { label: "Retainer", floor: 50, blurb: "monthly: hosting checks, edits, uptime eyes" },
    "fix-rescue": { label: "Fix Rescue", floor: 75, blurb: "save a broken site: diagnose, fix, document" },
    "custom": { label: "Custom", floor: null, blurb: "negotiate from scope — but never below your hours" }
  };

  var STATUS_ORDER = ["open", "claimed", "in_progress", "delivered", "paid", "cancelled"];

  // ---------- state ----------
  var state = {
    view: "board",            // board | market | law
    filter: "all",            // commission status filter
    commissions: [],          // parsed commission objects
    members: [],              // parsed member profiles
    memberDetail: null,       // index into members for detail view
    dataError: null
  };

  var CACHE_PREFIX = "fedhustle-";

  // ---------- armor ----------
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---------- data loading ----------
  // commissions come from a roster manifest so ONE fetch tells us
  // every commission file. New commission = new JSON + one line in
  // the roster. Same pattern as the matrix registry.
  function loadJSON(path, cb) {
    fetch(path)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status + " on " + path);
        return r.json();
      })
      .then(function (j) { cb(null, j); })
      .catch(function (e) { cb(e, null); });
  }

  function loadAll() {
    // commissions roster first, then each file it lists
    loadJSON("commissions/roster.json", function (err, roster) {
      if (err) {
        state.dataError = {
          title: "BOARD OFFLINE",
          body: "Couldn't load the commission roster. If you're offline, open this folder from the downloaded repo instead — the data is all local."
        };
        render();
        return;
      }
      var files = (roster && roster.files) || [];
      var pending = files.length;
      var done = function () {
        if (--pending === 0) render();
      };
      if (pending === 0) { render(); return; }
      files.forEach(function (f) {
        loadJSON("commissions/" + f, function (e, j) {
          if (!e && j) state.commissions.push(j);
          done();
        });
      });
    });

    // members roster, same move
    loadJSON("members/roster.json", function (err, roster) {
      if (err) {
        // members are a bonus view, not a wall — board still works
        return;
      }
      var files = (roster && roster.files) || [];
      files.forEach(function (f) {
        loadJSON("members/" + f, function (e, j) {
          if (!e && j) state.members.push(j);
        });
      });
    });
  }

  // ---------- rendering: the rate floor banner (always up top) ----------
  function renderFloorBanner() {
    return (
      '<div class="floor-banner">' +
      '<b>THE FLOORS ARE THE LAW:</b> ' +
      Object.keys(RATE_FLOORS).map(function (k) {
        var f = RATE_FLOORS[k];
        var price = f.floor === null ? "negotiate" : "$" + f.floor + (k === "maintenance-retainer" ? "/mo" : "+");
        return f.label + " " + price;
      }).join(" · ") +
      ' <span class="fine">— from PRICING.md. Quoting below the floor benches you from the board.</span>' +
      "</div>"
    );
  }

  // ---------- rendering: commission board ----------
  function statusChip(status) {
    var cls = status === "open" ? "chip open" :
              status === "paid" ? "chip paid" :
              status === "cancelled" ? "chip cancelled" : "chip";
    return '<span class="' + cls + '">' + escapeHTML(status.replace(/_/g, " ")) + "</span>";
  }

  function renderCommission(c) {
    var service = RATE_FLOORS[c.service_type] || { label: c.service_type, floor: null, blurb: "" };
    var underFloor = typeof c.budget_floor === "number" && service.floor !== null && c.budget_floor < service.floor;
    return (
      '<div class="card commission' + (underFloor ? " under-floor" : "") + '">' +
      '<div class="com-head">' +
      '<span class="com-id">' + escapeHTML(c.id || "no-id") + "</span>" +
      statusChip(c.status) +
      "</div>" +
      '<h3>' + escapeHTML(c.title) + "</h3>" +
      '<p class="brief">' + escapeHTML(c.brief) + "</p>" +
      '<div class="com-meta">' +
      '<span>' + escapeHTML(service.label) + "</span>" +
      '<span>' + (c.budget_floor ? "$" + escapeHTML(String(c.budget_floor)) : "negotiate") + (c.timeline_days ? " · " + escapeHTML(String(c.timeline_days)) + " days" : "") + "</span>" +
      (c.skills_needed && c.skills_needed.length
        ? '<span class="skills">' + c.skills_needed.map(escapeHTML).join(" · ") + "</span>"
        : "") +
      "</div>" +
      (underFloor
        ? '<div class="floor-warn">UNDER THE FLOOR — build.yml will reject this commission. Bump the budget or reclassify the service type.</div>'
        : "") +
      (c.claimed_by ? '<div class="claimed">claimed by ' + escapeHTML(c.claimed_by) + "</div>" : "") +
      "</div>"
    );
  }

  function renderBoard() {
    var list = state.commissions;
    if (state.filter !== "all") {
      list = list.filter(function (c) { return c.status === state.filter; });
    }
    var chips = ['<button type="button" class="fchip' + (state.filter === "all" ? " active" : "") + '" data-filter="all">all</button>'];
    STATUS_ORDER.forEach(function (s) {
      chips.push('<button type="button" class="fchip' + (state.filter === s ? " active" : "") + '" data-filter="' + s + '">' + s.replace(/_/g, " ") + "</button>");
    });

    return (
      '<div class="view-title">The Commission Board</div>' +
      '<div class="filter-row">' + chips.join("") + "</div>" +
      (list.length === 0
        ? '<div class="card"><p class="brief">No commissions with that status right now. The board moves — check back, or post one (commissions_schema.json has the shape).</p></div>'
        : list.map(renderCommission).join("")) +
      '<div class="how-to card">' +
      '<b>HOW A TICKET MOVES:</b> posted open &rarr; first brother comments "I\'m on it" (48h hold) &rarr; ships &rarr; client confirms &rarr; paid &rarr; both post one-line receipts. 100% of the money goes to the brother who ships. FED-EDU takes zero.</div>'
    );
  }

  // ---------- rendering: member market ----------
  function renderMemberCard(m, i) {
    var hustle = m.hustle || {};
    var rate = hustle.rate_card || {};
    var raffle = m.raffle || {};
    return (
      '<div class="card member">' +
      '<div class="member-head">' +
      '<span class="member-name">' + escapeHTML((m.identity && m.identity.display_name) || m.member || "brother") + "</span>" +
      '<span class="member-level">' + escapeHTML((m.identity && m.identity.level) || "spawn") + "</span>" +
      "</div>" +
      '<div class="member-meta">' +
      '<span>' + escapeHTML((m.identity && m.identity.location) || "—") + "</span>" +
      (m.identity && m.identity.phone_only ? '<span class="phone-flag">PHONE-ONLY BROTHER</span>' : "") +
      "</div>" +
      '<div class="rate-line">' +
      '<span>one-pager ' + escapeHTML(rate.one_pager || "$150 floor") + "</span>" +
      '<span>multi ' + escapeHTML(rate.multi_page || "$500 floor") + "</span>" +
      '<span>retainer ' + escapeHTML(rate.retainer || "$50/mo floor") + "</span>" +
      "</div>" +
      '<div class="member-stats">' +
      '<span>raffle ' + escapeHTML(String(raffle.tickets || 0)) + " tickets</span>" +
      '<span>' + escapeHTML(String((hustle.commissions && hustle.commissions.length) || 0)) + " commissions</span>" +
      '<span>' + escapeHTML(String(hustle.repeat_clients || 0)) + " repeat clients</span>" +
      "</div>" +
      '<button type="button" class="detail-btn" data-member="' + i + '">SEE THE RECEIPTS</button>' +
      "</div>"
    );
  }

  function renderMemberDetail(m) {
    var hustle = m.hustle || {};
    var comps = hustle.commissions || [];
    return (
      '<button type="button" class="back-btn" id="member-back">&larr; BACK TO THE MARKET</button>' +
      '<div class="card member detail">' +
      '<h2>' + escapeHTML((m.identity && m.identity.display_name) || m.member) + " — the receipts</h2>" +
      '<p class="brief">' + escapeHTML(m.the_story || "No story yet. Ship one.") + "</p>" +
      (comps.length
        ? '<div class="com-list">' + comps.map(function (c) {
            return '<div class="com-line"><b>' + escapeHTML(c.id || "") + "</b> " +
              escapeHTML(c.title || "") + ' <span class="' + (c.status === "paid" ? "chip paid" : "chip") + '">' +
              escapeHTML(c.status || "") + "</span>" +
              (c.receipt ? '<div class="receipt-line">' + escapeHTML(c.receipt) + "</div>" : "") +
              "</div>";
          }).join("") + "</div>"
        : '<div class="com-line">No commissions yet — the sample shape is in members/sample_brother_hustle.json</div>') +
      "</div>"
    );
  }

  function renderMarket() {
    if (state.memberDetail !== null && state.members[state.memberDetail]) {
      return renderMemberDetail(state.members[state.memberDetail]);
    }
    if (state.members.length === 0) {
      return '<div class="view-title">The Member Market</div>' +
        '<div class="card"><p class="brief">No member profiles loaded. The sample shape lives at members/sample_brother_hustle.json — copy it, fill your real receipts, PR it.</p></div>';
    }
    return (
      '<div class="view-title">The Member Market</div>' +
      state.members.map(renderMemberCard).join("") +
      '<div class="how-to card"><b>HOW TO JOIN:</b> copy sample_brother_hustle.json &rarr; rename to your handle &rarr; fill REAL receipts &rarr; add your file to members/roster.json &rarr; PR it. build.yml validates the shape.</div>'
    );
  }

  // ---------- rendering: the law ----------
  function renderLaw() {
    var rows = Object.keys(RATE_FLOORS).map(function (k) {
      var f = RATE_FLOORS[k];
      return (
        '<div class="law-row">' +
        '<span class="law-label">' + escapeHTML(f.label) + "</span>" +
        '<span class="law-price">' + (f.floor === null ? "negotiate from scope" : "$" + f.floor + (k === "maintenance-retainer" ? "/month" : "+ minimum")) + "</span>" +
        '<span class="law-blurb">' + escapeHTML(f.blurb) + "</span>" +
        "</div>"
      );
    });
    return (
      '<div class="view-title">The Rate Floor Law</div>' +
      '<div class="card law-card">' + rows.join("") + "</div>" +
      '<div class="how-to card"><b>WHY THE FLOORS EXIST:</b> when one brother quotes $40, the client learns to offer $40 to ALL of us. The floor protects every brother who comes after you. Undercutting = benched. Full law in PRICING.md.</div>'
    );
  }

  // ---------- master render ----------
  var app;
  function render() {
    if (!app) return;

    if (state.dataError) {
      app.innerHTML =
        '<div class="card err">' +
        '<h2>' + escapeHTML(state.dataError.title) + "</h2>" +
        '<p>' + escapeHTML(state.dataError.body) + "</p>" +
        "</div>";
      return;
    }

    var body;
    if (state.view === "market") body = renderMarket();
    else if (state.view === "law") body = renderLaw();
    else body = renderBoard();

    app.innerHTML = renderFloorBanner() + body;
    wireView(app);
  }

  function wireView(app) {
    app.querySelectorAll("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.filter = b.getAttribute("data-filter");
        state.memberDetail = null;
        render();
      });
    });
    app.querySelectorAll("[data-member]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.memberDetail = parseInt(b.getAttribute("data-member"), 10);
        render();
      });
    });
    var back = document.getElementById("member-back");
    if (back) back.addEventListener("click", function () {
      state.memberDetail = null;
      render();
    });
  }

  // ---------- top nav ----------
  function wireNav() {
    var nav = document.getElementById("hustle-nav");
    if (!nav) return;
    nav.querySelectorAll("[data-view]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.view = b.getAttribute("data-view");
        state.memberDetail = null;
        nav.querySelectorAll("[data-view]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        render();
      });
    });
  }

  // ---------- boot ----------
  function boot() {
    app = document.getElementById("hustle-app");
    if (!app) return;
    wireNav();
    render();
    loadAll();

    // console learners + tests:
    // FEDHustle.state · FEDHustle.floors · FEDHustle.go("market")
    window.FEDHustle = {
      state: state,
      floors: RATE_FLOORS,
      go: function (view) {
        state.view = view;
        state.memberDetail = null;
        render();
        return "view: " + view;
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
