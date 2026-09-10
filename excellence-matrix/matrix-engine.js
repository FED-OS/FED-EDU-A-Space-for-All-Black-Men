/* ============================================================
   matrix-engine.js — FED-EDU Excellence Matrix
   ============================================================
   The engine behind index.html. Loads the 7 database files,
   renders the matrix browser, runs search, keeps an offline
   cache so the second visit is instant on metered data.

   WHAT YOU'LL LEARN BY READING THIS (the whole point)
   - fetch() + JSON files as a database (ADR-005)
   - localStorage as an offline cache (the 3-second rule, ADR-002)
   - state machine with only two screens: list -> detail
   - escapeHTML armor: the database is text, NEVER markup
   - one render() function that always redraws from state
     (no incremental DOM patching — simpler, and the data is small)

   THE PATTERN MAP (for the learning card)
   MATRICES registry ......... data file names in one object
   state = {matrix, entry} ... which screen are we on
   render() .................. one function draws everything
   escapeHTML() .............. armor before any innerHTML
   cacheMatrix() ............. localStorage write
   loadMatrix() .............. cache-first, network-second

   THE RULES THIS FILE OBEYS
   - vanilla only, no framework (ADR-001)
   - everything runs from a file:// or GitHub Pages URL
   - no build step, no bundler, no dependencies
   ============================================================ */

"use strict";

(function () {

  // ---------- the registry: 7 matrices ----------
  // Key = file name in database/. Value = what shows on the tab.
  // Add an 8 matrix here + a JSON file, and the UI grows itself.
  var MATRICES = {
    historical_leaders: "Historical Leaders",
    executive_power: "Executive Power",
    business_moguls: "Business Moguls",
    hiphop_engineers: "Hip-Hop Engineers",
    golden_cleats: "Golden Cleats",
    Hollywood_directors: "Hollywood Directors",
    streaming_giants: "Streaming Giants"
  };

  // ---------- state: the whole app in two variables ----------
  // Screen one: state.matrix set, state.entry null -> show the roster.
  // Screen two: state.entry set -> show one man's card.
  // Back button -> state.entry = null -> render(). That's the whole router.
  var state = {
    matrix: null,   // key into MATRICES (set on first load)
    entry: null,    // index into that matrix's entries
    data: {},       // matrix key -> parsed JSON
    query: ""       // search box text
  };

  var CACHE_PREFIX = "fedmatrix-"; // localStorage keys, namespaced

  // ---------- armor ----------
  // The database is TEXT. It is never markup. Every string from a
  // JSON file passes through here before it touches innerHTML.
  // If a future database entry contained <script>, it would render
  // as visible text, not run. Same armor as fed-comm-dm chat-bubble.
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---------- loading: cache-first, network-second ----------
  // ADR-002: the 3-second rule. First visit on metered data pays
  // the fetch. Every visit after reads localStorage in milliseconds.
  function cacheKey(matrix) { return CACHE_PREFIX + matrix; }

  function cacheMatrix(matrix, json) {
    try {
      localStorage.setItem(cacheKey(matrix), JSON.stringify(json));
    } catch (e) {
      // private mode / storage full: cache is a bonus, never a wall
      // swallow it and keep running — the page still works uncached
    }
  }

  function loadMatrix(matrix, cb) {
    // 1. already in memory this visit?
    if (state.data[matrix]) { cb(null, state.data[matrix]); return; }
    // 2. cached from a past visit?
    try {
      var cached = localStorage.getItem(cacheKey(matrix));
      if (cached) {
        var parsed = JSON.parse(cached);
        state.data[matrix] = parsed;
        cb(null, parsed);
        return;
      }
    } catch (e) { /* corrupt cache: fall through to network */ }
    // 3. network
    fetch("database/" + matrix + ".json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        state.data[matrix] = json;
        cacheMatrix(matrix, json);
        cb(null, json);
      })
      .catch(function (err) {
        // plain-talk error (same voice as fedpromptly-coach):
        cb({
          title: "CAN'T REACH THE DATABASE",
          body: "The " + matrix + " file didn't load. If you're offline, " +
                "open this page from the downloaded repo folder instead of " +
                "the website. The files are all here — this is a loading " +
                "problem, not a missing-content problem."
        });
      });
  }

  // ---------- search across every loaded matrix ----------
  // Case-insensitive substring on name + claim + the_transfer.
  // Deliberately simple: this is a first search engine, not a
  // product. The urban-dictionary search-engine.js is the deeper one.
  function searchAll(query) {
    var q = query.trim().toLowerCase();
    if (!q) return null;
    var hits = [];
    Object.keys(MATRICES).forEach(function (mk) {
      var data = state.data[mk];
      if (!data || !data.entries) return;
      data.entries.forEach(function (e, i) {
        var hay = (e.name + " " + (e.claim || "") + " " + (e.the_transfer || "")).toLowerCase();
        if (hay.indexOf(q) !== -1) {
          hits.push({ matrix: mk, index: i, name: e.name });
        }
      });
    });
    return hits;
  }

  // ---------- rendering ----------
  // ONE function draws everything from state. No DOM patching, no
  // virtual anything. The dataset is 41 entries — a full redraw is
  // faster than the network round trip by orders of magnitude.
  // (At a million rows this design would be wrong. Know the scale.)

  var app; // #matrix-app container

  function render() {
    if (!app) return;

    // ----- error state -----
    if (state.error) {
      app.innerHTML =
        '<div class="card err">' +
        '<h2>' + escapeHTML(state.error.title) + "</h2>" +
        "<p>" + escapeHTML(state.error.body) + "</p>" +
        '<button type="button" id="retry">TRY AGAIN</button>' +
        "</div>";
      document.getElementById("retry").addEventListener("click", function () {
        state.error = null;
        render();
        loadMatrix(state.matrix, onMatrixLoaded);
      });
      return;
    }

    // ----- search results screen -----
    if (state.query) {
      var hits = searchAll(state.query);
      var rows = (hits || []).map(function (h) {
        return '<li><button type="button" class="hit-row" data-matrix="' +
          escapeHTML(h.matrix) + '" data-entry="' + h.index + '">' +
          '<span class="hit-name">' + escapeHTML(h.name) + "</span>" +
          '<span class="hit-matrix">' + escapeHTML(MATRICES[h.matrix]) + "</span>" +
          "</button></li>";
      }).join("");
      app.innerHTML =
        '<div class="card">' +
        '<h2>Search: "' + escapeHTML(state.query) + '"</h2>' +
        (hits && hits.length
          ? '<ul class="hit-list">' + rows + "</ul>"
          : "<p>No brothers matched. Try a shorter word — the search " +
            "checks names, claims, and the transfer lessons.</p>") +
        "</div>";
      app.querySelectorAll(".hit-row").forEach(function (b) {
        b.addEventListener("click", function () {
          state.query = "";
          var searchBox = document.getElementById("matrix-search");
          if (searchBox) searchBox.value = "";
          state.matrix = b.getAttribute("data-matrix");
          state.entry = parseInt(b.getAttribute("data-entry"), 10);
          render();
        });
      });
      return;
    }

    // ----- detail screen: one entry -----
    if (state.entry !== null) {
      var m = state.data[state.matrix];
      if (!m) { renderLoading(); return; }
      var e = m.entries[state.entry];
      if (!e) { state.entry = null; render(); return; }

      // entries carry different optional keys (self_note, honest_note,
      // claim_note, rebuttal_to_gatekeeping). Render whichever exist,
      // in a fixed order, with the right label for each.
      var optional = [
        ["self_note", "ON THE MATRIX"],
        ["honest_note", "HONEST NOTE — READ THIS"],
        ["claim_note", "NOTE"],
        ["rebuttal_to_gatekeeping", "THE GATEKEEPING ANSWER"]
      ];
      var extras = "";
      optional.forEach(function (pair) {
        if (e[pair[0]]) {
          extras += '<div class="note-block"><b>' + escapeHTML(pair[1]) + ":</b> " +
            escapeHTML(e[pair[0]]) + "</div>";
        }
      });

      app.innerHTML =
        '<button type="button" class="back-btn" id="back">&#8592; BACK TO ' +
        escapeHTML(MATRICES[state.matrix]).toUpperCase() + "</button>" +
        '<div class="card detail">' +
        '<div class="detail-head">' +
        '<h2>' + escapeHTML(e.name) + "</h2>" +
        '<div class="meta">' + escapeHTML(e.era) + " &middot; " + escapeHTML(e.from) + "</div>" +
        "</div>" +
        '<div class="field"><b>THE CLAIM:</b> ' + escapeHTML(e.claim) + "</div>" +
        '<div class="field"><b>THE RECEIPTS:</b> ' + escapeHTML(e.receipts) + "</div>" +
        extras +
        '<div class="field transfer"><b>THE TRANSFER (what this means for YOUR code):</b><br>' +
        escapeHTML(e.the_transfer) + "</div>" +
        '<div class="dap-nudge">DAP this card: post the line from THE TRANSFER that ' +
        "hit you hardest in today's accountability thread. 3 tickets.</div>" +
        "</div>";

      document.getElementById("back").addEventListener("click", function () {
        state.entry = null;
        render();
      });
      return;
    }

    // ----- roster screen: the matrix tab's entry list -----
    var data = state.data[state.matrix];
    if (!data) { renderLoading(); return; }

    var list = data.entries.map(function (e, i) {
      return '<li><button type="button" class="entry-row" data-entry="' + i + '">' +
        '<span class="row-name">' + escapeHTML(e.name) + "</span>" +
        '<span class="row-era">' + escapeHTML(e.era) + "</span>" +
        "</button></li>";
    }).join("");

    app.innerHTML =
      '<div class="card matrix-head">' +
      '<h2>' + escapeHTML(data.title) + "</h2>" +
      '<p class="tagline">' + escapeHTML(data.tagline) + "</p>" +
      "</div>" +
      '<ul class="entry-list">' + list + "</ul>";

    app.querySelectorAll(".entry-row").forEach(function (b) {
      b.addEventListener("click", function () {
        state.entry = parseInt(b.getAttribute("data-entry"), 10);
        render();
      });
    });
  }

  function renderLoading() {
    app.innerHTML = '<div class="card"><p class="tagline">loading the matrix…</p></div>';
  }

  function onMatrixLoaded(err, json) {
    if (err) { state.error = err; render(); return; }
    state.error = null;
    render();
  }

  // ---------- tabs ----------
  function renderTabs() {
    var tabs = document.getElementById("matrix-tabs");
    if (!tabs) return;
    tabs.innerHTML = Object.keys(MATRICES).map(function (mk) {
      var active = mk === state.matrix ? " active" : "";
      return '<button type="button" class="tab' + active + '" data-matrix="' +
        escapeHTML(mk) + '">' + escapeHTML(MATRICES[mk]) + "</button>";
    }).join("");

    tabs.querySelectorAll(".tab").forEach(function (b) {
      b.addEventListener("click", function () {
        state.matrix = b.getAttribute("data-matrix");
        state.entry = null;   // switching tabs always lands on the roster
        renderTabs();         // (the active tab highlight moves too)
        render();
        if (!state.data[state.matrix]) {
          loadMatrix(state.matrix, onMatrixLoaded);
        }
      });
    });
  }

  // ---------- search box wiring ----------
  // 250ms debounce — same pattern as rap-lab's live analyzer.
  // The database is local so this could fire every keystroke, but
  // the debounce costs nothing and teaches the right habit for
  // when the data source IS the network.
  function wireSearch() {
    var box = document.getElementById("matrix-search");
    if (!box) return;
    var t = null;
    box.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.query = box.value;
        render();
      }, 250);
    });
  }

  // ---------- boot ----------
  function boot() {
    app = document.getElementById("matrix-app");
    if (!app) return;

    // first matrix: historical_leaders — the anchor, per the README.
    state.matrix = "historical_leaders";

    renderTabs();
    wireSearch();
    renderLoading();
    loadMatrix(state.matrix, onMatrixLoaded);

    // expose for console learners + tests. The pattern: every FED-EDU
    // engine exports a small, documented window object.
    // Try it: FEDMatrix.state ; FEDMatrix.go("golden_cleats", 2)
    window.FEDMatrix = {
      state: state,
      matrices: MATRICES,
      go: function (matrixKey, entryIndex) {
        if (!MATRICES[matrixKey]) return "no such matrix — keys: " + Object.keys(MATRICES).join(", ");
        state.matrix = matrixKey;
        state.query = "";
        var box = document.getElementById("matrix-search");
        if (box) box.value = "";
        renderTabs();
        render();
        var self = this;
        loadMatrix(matrixKey, function () {
          if (typeof entryIndex === "number") {
            state.entry = entryIndex;
            render();
          }
          self;
        });
        return "going to " + matrixKey;
      },
      search: function (q) { return searchAll(q); }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
