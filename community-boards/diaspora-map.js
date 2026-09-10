/* ============================================================
   diaspora-map.js — FED-EDU Community Boards
   ============================================================
   The map of where the brothers are. Every continent, every
   situation — Jamaica to Lagos, London to Atlanta, and the
   brothers inside the system whose marker is a time zone.

   WHAT IT RUNS
   - Loads diaspora-data.json (the city/regional markers)
   - Renders an emoji-grid map (no map library, no tiles, no
     API key — ADR-001 vanilla rule and ADR-005 JSON-as-data)
   - Tap a region -> the brothers' hubs list for that region

   WHY A GRID AND NOT A REAL MAP
   Real map tiles = megabytes of images on metered data. This
   whole map is ~3KB of emoji and text. The 3-second rule
   (ADR-002) applies to maps too. A brother on 2 bars in
   Trelawny sees this map instantly. That's the design call.

   WHAT YOU'LL LEARN BY READING THIS
   - rendering a data grid without a framework
   - event delegation: ONE listener for the whole map instead
     of one per cell (this is the pattern that scales)
   - escapeHTML armor on data that came from a JSON file
   ============================================================ */

"use strict";

(function () {

  // ---------- the grid ----------
  // 8 rows x 12 cols. Each cell = a spot on the world map
  // (approximate). Land cells carry data-region, ocean cells
  // are empty. This array is drawn by hand ONCE, then regions
  // come from the JSON. Simple, shippable, readable.
  var MAP_GRID = [
    "............",
    "..ee..tt....",
    ".eeeee.tt...",
    "..ee..ttt...",
    "....cc......",
    "...cccc..aa.",
    "..nnnn..aaa.",
    "...nn...aa.."
  ];

  // which emoji = which region key (matches diaspora-data.json)
  var CELL_REGION = {
    e: "west-africa",
    t: "east-africa",
    c: "caribbean",
    a: "north-america",
    n: "europe"
  };

  var REGION_EMOJI = {
    "west-africa": "🌍",
    "east-africa": "🌍",
    "caribbean": "🏝️",
    "north-america": "🌎",
    "europe": "🌍",
    "global-south": "🌏",
    "incarcerated": "⏳",
    "everywhere": "🌐"
  };

  // ---------- state ----------
  var state = {
    data: null,          // parsed diaspora-data.json
    selected: null,      // region key for the detail panel
    error: null
  };

  // ---------- armor ----------
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---------- load ----------
  function load(cb) {
    fetch("diaspora-data.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (j) { state.data = j; cb(null); })
      .catch(function () {
        state.error = "The map data didn't load. Offline? Open the repo folder directly — the data is local.";
        cb(null);
      });
  }

  // ---------- render ----------
  var app;

  function render() {
    if (!app) return;

    if (state.error) {
      app.innerHTML = '<div class="card err"><p>' + escapeHTML(state.error) + "</p></div>";
      return;
    }

    var html = "";

    // the grid — one button per land cell
    html += '<div class="map-grid" id="map-grid" role="img" aria-label="FED-EDU diaspora map">';
    MAP_GRID.forEach(function (row) {
      html += '<div class="map-row">';
      row.split("").forEach(function (ch) {
        if (ch === ".") {
          html += '<span class="cell ocean"></span>';
        } else {
          var region = CELL_REGION[ch];
          var active = state.selected === region ? " active" : "";
          html += '<button type="button" class="cell land' + active + '" data-region="' +
            escapeHTML(region) + '" aria-label="' + escapeHTML(region) + '">' +
            REGION_EMOJI[region] + "</button>";
        }
      });
      html += "</div>";
    });
    html += "</div>";

    // honest seed banner (never let example numbers pose as a census)
    if (state.data && state.data.is_seed_data) {
      html += '<div class="card seed-note"><b>SEED DATA:</b> ' +
        escapeHTML(state.data.seed_note || "Example data shipped with the repo - not real membership counts.") +
        "</div>";
    }

    // the sit-rows (regions that aren't land on the grid)
    if (state.data && state.data.regions) {
      html += '<div class="sit-rows">';
      state.data.regions.forEach(function (r) {
        if (CELL_REGION && Object.keys(CELL_REGION).indexOf(r.key) !== -1) return; // already on grid
        var active = state.selected === r.key ? " active" : "";
        html += '<button type="button" class="sit-row' + active + '" data-region="' +
          escapeHTML(r.key) + '">' + (REGION_EMOJI[r.key] || "📍") + " " +
          escapeHTML(r.name) + " <span class='count'>" +
          escapeHTML(String(r.hubs ? r.hubs.length : 0)) + " hubs</span></button>";
      });
      html += "</div>";
    }

    // the detail panel
    if (state.selected && state.data) {
      var region = state.data.regions.filter(function (r) { return r.key === state.selected; })[0];
      if (region) {
        var hubs = (region.hubs || []).map(function (h) {
          return '<div class="hub"><b>' + escapeHTML(h.city) + "</b>" +
            '<span class="hub-note">' + escapeHTML(h.note) + "</span>" +
            '<span class="hub-brothers">' + escapeHTML(String(h.brothers || 0)) + " brothers</span></div>";
        }).join("");
        html += '<div class="card region-detail">' +
          "<h2>" + (REGION_EMOJI[region.key] || "📍") + " " + escapeHTML(region.name) + "</h2>" +
          '<p class="tagline">' + escapeHTML(region.tagline || "") + "</p>" +
          (hubs || '<p class="tagline">No hubs logged yet — be the first marker. See diaspora-data.json.</p>') +
          "</div>";
      }
    }

    app.innerHTML = html;

    // EVENT DELEGATION: one listener, every cell. Cells can be
    // added or removed and nothing breaks. This is the pattern.
    var grid = document.getElementById("map-grid");
    if (grid) {
      grid.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-region]");
        if (!btn) return;
        state.selected = state.selected === btn.getAttribute("data-region")
          ? null  // tap again = deselect
          : btn.getAttribute("data-region");
        render();
      });
    }
    var sitRows = app.querySelectorAll(".sit-row");
    // sit-rows are few; delegation also works here via the parent
    // but direct wiring is fine when the count is small. Know both.
    sitRows.forEach(function (b) {
      b.addEventListener("click", function () {
        state.selected = state.selected === b.getAttribute("data-region")
          ? null
          : b.getAttribute("data-region");
        render();
      });
    });
  }

  // ---------- boot ----------
  function boot() {
    app = document.getElementById("diaspora-app");
    if (!app) return;
    render();
    load(function () { render(); });

    // console learners:
    // FEDDiaspora.state · FEDDiaspora.pick("caribbean")
    window.FEDDiaspora = {
      state: state,
      pick: function (key) {
        state.selected = key;
        render();
        return "selected: " + key;
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
