/*
  FED-EDU :: sandbox-blueprints/02-football-stats :: db-bridge.js
  What this is: the engine under the Football Stats UI — the player table,
  the sort logic, the export. All vanilla JS, zero dependencies (ADR-001).

  READ THIS FILE AFTER YOU USE THE LAB. The design is the same as the Rap Lab:
  every feature you feel in the UI is a function you can read here.
  You already do this math at halftime. Now you can read the code doing it.

  CONTENTS:
    1. STORAGE — where the league lives (localStorage + the JSON export path)
    2. makePlayer() — an object: keys and values bundled as one thing
    3. render() — turning the array of objects into a table
    4. sortLeague() — custom sort logic (the leaderboard pattern)
    5. exportJSON() — live data → the file format the whole block runs on
    6. UI wiring — the part that touches the page (keep this section LAST)

  THE BRIDGE TO REAL DATABASES:
    localStorage is the starter home. schema.sql (this folder) is the same
    table in SQL — the language real databases speak. The rung-2 move is
    pointing this file's save/load functions at Supabase instead of the
    browser: same functions, new address. The UI never knows the difference.
    That's the db-bridge pattern: the bridge lets you swap the ground
    under the house without rebuilding the house.
*/

(function () {
  "use strict";

  /* ============ 1. STORAGE — where the league lives ============ */

  var STORE_KEY = "footstat-league";

  function loadLeague() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveLeague(league) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(league)); }
    catch (e) { /* private mode — league lives for this session only */ }
  }

  /* ============ 2. makePlayer() — an object, in its smallest honest form ============ */

  /*
    An object is a bundle: named slots (keys) holding values.
    { name: "Mahomes", team: "KC", pass: 4500, rush: 300, td: 38 }
    That's the same data shape every fantasy app on earth uses for a
    player row. You build one every time you add a player here.
  */
  function makePlayer(name, team, pass, rush, td) {
    return {
      name: name,
      team: team,
      pass: Number(pass) || 0,
      rush: Number(rush) || 0,
      td:   Number(td) || 0,
      // computed at creation: total yards (the all-in-one number)
      total: (Number(pass) || 0) + (Number(rush) || 0)
    };
  }

  /* ============ 3. render() — array of objects → table ============ */

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function render(league) {
    var wrap = document.getElementById("table-wrap");
    if (!league.length) {
      wrap.innerHTML = '<p class="muted">No players yet — add one above. Your data saves on THIS device only (SECURITY.md rules — nothing leaves your phone).</p>';
      return;
    }

    var html = '<table aria-label="League stats table">' +
      "<thead><tr>" +
      "<th>#</th><th>Player</th><th>Team</th>" +
      '<th class="num">Pass</th><th class="num">Rush</th><th class="num">TDs</th><th class="num">Total</th>' +
      "</tr></thead><tbody>";

    for (var i = 0; i < league.length; i++) {
      var p = league[i];
      var leaderRow = i === 0 ? ' class="leader"' : "";
      html += "<tr" + leaderRow + ">" +
        "<td>" + (i + 1) + "</td>" +
        "<td>" + esc(p.name) + "</td>" +
        "<td>" + esc(p.team) + "</td>" +
        '<td class="num">' + p.pass + "</td>" +
        '<td class="num">' + p.rush + "</td>" +
        '<td class="num">' + p.td + "</td>" +
        '<td class="num"><b>' + p.total + "</b></td>" +
        "</tr>";
    }
    html += "</tbody></table>";
    wrap.innerHTML = html;
  }

  /* ============ 4. sortLeague() — custom sort logic ============ */

  /*
    The leaderboard pattern, in its clearest form:
    sort() takes a comparison function. Return negative when A should
    rank above B. Total yards first; TDs break the tie; name breaks the
    double-tie (alphabetical, so ties are stable and fair).
    The same pattern runs the block's leaderboard (leaderboard_sync.yml)
    and the Hustle Index rankings (market-engine.js). One pattern,
    everywhere on the block.
  */
  function sortLeague(league) {
    return league.slice().sort(function (a, b) {
      if (b.total !== a.total) { return b.total - a.total; }
      if (b.td !== a.td) { return b.td - a.td; }
      return a.name.localeCompare(b.name);
    });
  }

  /* ============ 5. exportJSON() — live data → the block's file format ============ */

  /*
    The export is the receipt: your league, as a file, in the format
    the whole block runs on. The file can be committed to a repo, shared
    in a DM, loaded back next season. urban-dictionary/json_explained.md
    is the primer on why JSON is the block's filing cabinet.
  */
  function exportJSON(league) {
    var payload = {
      exported: new Date().toISOString(),
      blueprint: "02-football-stats",
      count: league.length,
      league: league
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "my-league.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ============ 6. UI wiring — touches the page (keep LAST) ============ */

  function el(id) { return document.getElementById(id); }

  var league = loadLeague();
  render(league);

  /* --- Add player --- */
  el("btn-add").addEventListener("click", function () {
    var name = el("p-name").value.trim();
    var team = el("p-team").value.trim();
    if (!name) {
      alert("Player needs a name. The stat table can't rank a ghost.");
      el("p-name").focus();
      return;
    }
    league.push(makePlayer(
      name,
      team || "—",
      el("p-pass").value,
      el("p-rush").value,
      el("p-td").value
    ));
    league = sortLeague(league);
    saveLeague(league);
    render(league);

    el("p-name").value = ""; el("p-team").value = "";
    el("p-pass").value = ""; el("p-rush").value = ""; el("p-td").value = "";
    el("p-name").focus();
  });

  /* --- Sort --- */
  el("btn-sort").addEventListener("click", function () {
    league = sortLeague(league);
    saveLeague(league);
    render(league);
  });

  /* --- Export --- */
  el("btn-export").addEventListener("click", function () {
    if (!league.length) {
      alert("Nothing to export yet — add a player first.");
      return;
    }
    exportJSON(league);
  });

  /* --- Data-saver --- */
  el("btn-saver").addEventListener("click", function () {
    document.documentElement.classList.toggle("data-saver");
  });

})();
