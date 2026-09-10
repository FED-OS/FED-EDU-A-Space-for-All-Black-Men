/* ============================================================
   help-desk-bridge.js — FED-EDU Community Boards
   ============================================================
   The bridge between the community boards and the GitHub issue
   tracker that powers the help desk. The 'gist and community
   tabs suck' verdict drove the custom DM system (fed-comm-dm);
   this is the same verdict applied to the help desk.

   WHY A BRIDGE AND NOT A BROWSER
   GitHub's issue UI works, but it's built for maintainers, not
   for a brother on a phone with 2 bars. This bridge:
   - reads issues from the repo (public API, no key for public repos)
   - renders them in the FED-EDU style, phone-first
   - turns 'New Ticket' into a prefilled issue link (no OAuth dance)

   WHAT YOU'LL LEARN BY READING THIS
   - the GitHub REST API basics: issues, labels, comments
     (the same API auto_dap.yml uses with a token server-side)
   - building a 'prefilled form' link: the magic URL pattern
     that opens GitHub's new-issue page with everything typed
   - fetch + rendering a live list with plain-talk error states
   - cache + fallback: if the API is slow, show the cached list
     and a banner saying so (the honest UI pattern)

   HONEST LIMITS (read these)
   - Unauthenticated GitHub API = 60 requests/hour per IP. That's
     fine for a personal page, thin for a whole community hitting
     refresh. The cache exists FOR this limit. Respect it.
   - This bridge READS. Creating tickets goes through the prefilled
     link — no write without the brother's own GitHub login. That's
     correct security design, not a missing feature.
   - If the repo is private, unauthenticated reads fail. The
     community boards are public by design; the private stuff
     lives in fed-comm-dm's encrypted gists.
   ============================================================ */

"use strict";

(function () {

  // ---------- config ----------
  // THE_REPO: where the tickets live. Set to the FED-EDU org repo.
  // Override locally by setting window.FED_REPO before this script
  // loads (used by forks for their own help desk).
  var THE_REPO = (window.FED_REPO || "fedpromptly/FED-EDU");

  var LABELS = {
    help: "help-wanted",
    bug: "bug",
    feature: "enhancement"
  };

  // the labels the help desk shows (order matters — it's the UI)
  var FILTERS = [
    { key: "all", label: "ALL", gh: null },
    { key: "open", label: "OPEN", gh: "open" },
    { key: "help", label: "HELP WANTED", gh: "help-wanted" },
    { key: "bug", label: "BUGS", gh: "bug" },
    { key: "feature", label: "IDEAS", gh: "enhancement" }
  ];

  var CACHE_KEY = "fedhelpdesk-cache";
  var CACHE_TTL = 1000 * 60 * 10; // 10 minutes — the 60/hr limit respects this

  // ---------- state ----------
  var state = {
    tickets: [],
    filter: "all",
    loadedFrom: null,   // "network" | "cache" — for the honest banner
    loading: true,
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

  // ---------- the prefilled ticket link (the magic URL) ----------
  // The whole trick: GitHub's new-issue page reads query params
  // and prefills the form. The brother taps ONE button, GitHub
  // opens with title+body typed, he hits Submit. No API key, no
  // OAuth, no write permissions for this page. Beautiful.
  function newTicketLink(kind, seed) {
    var titles = {
      help: "Help: <one line, what you're stuck on>",
      bug: "Bug: <what did what, where>",
      feature: "Idea: <what would make this better>"
    };
    var bodies = {
      help: "WHAT I WAS DOING:\n<the lesson or blueprint + step>\n\nWHAT HAPPENED:\n<plain words>\n\nWHAT I TRIED:\n<the receipts — paste error text or describe the screen>\n\nMY RIG:\n<phone / tether-pc / tower / library-terminal>",
      bug: "WHERE: <page or file>\nWHAT I DID: <steps, numbered>\nWHAT BROKE: <plain words>\nERROR TEXT: <paste it exactly>\nRIG: <phone / tether-pc / tower / library-terminal>\n\nScreenshots beat paragraphs when you can.",
      feature: "THE PROBLEM IT SOLVES:\n<plain words>\n\nWHY IT MATTERS FOR THE BLOCK:\n<plain words>\n\nDRAFT (if you have one):\n<repo link or sketch>"
    };
    var params = new URLSearchParams({
      title: titles[kind] || titles.help,
      body: (bodies[kind] || bodies.help) + (seed ? "\n\n" + seed : "")
    });
    return "https://github.com/" + THE_REPO + "/issues/new?" + params.toString();
  }

  // ---------- reading issues ----------
  function loadTickets() {
    state.loading = true;
    state.error = null;
    render();

    // cache first — instant paint, then refresh if stale
    var cached = readCache();
    if (cached) {
      state.tickets = cached.tickets;
      state.loadedFrom = "cache";
      state.loading = false;
      render();
    }

    // then the network (if cache is fresh, skip — the 60/hr budget)
    if (cached && (Date.now() - cached.at) < CACHE_TTL) {
      state.loadedFrom = "cache-fresh";
      return;
    }

    var url = "https://api.github.com/repos/" + THE_REPO + "/issues?state=all&per_page=30";
    fetch(url, { headers: { "Accept": "application/vnd.github+json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (list) {
        // GitHub returns PRs mixed into issues — filter them out
        var tickets = (list || []).filter(function (i) { return !i.pull_request; }).map(function (i) {
          return {
            number: i.number,
            title: i.title,
            state: i.state,
            labels: (i.labels || []).map(function (l) { return l.name; }),
            author: i.user ? i.user.login : "unknown",
            comments: i.comments,
            updated: i.updated_at,
            url: i.html_url
          };
        });
        state.tickets = tickets;
        state.loadedFrom = "network";
        state.loading = false;
        writeCache(tickets);
        render();
      })
      .catch(function () {
        state.loading = false;
        if (cached) {
          state.loadedFrom = "cache-stale";
        } else {
          state.error = "Couldn't reach the GitHub API. You might be offline, or the hour limit hit (60/hr on the free road). The tickets live at github.com/" + THE_REPO + "/issues — that page always works.";
        }
        render();
      });
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.tickets)) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function writeCache(tickets) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), tickets: tickets }));
    } catch (e) { /* private mode: cache is a bonus, not a wall */ }
  }

  // ---------- render ----------
  var app;

  function render() {
    if (!app) return;

    var html = "";

    // new-ticket buttons (the magic links)
    html += '<div class="ticket-actions">';
    ["help", "bug", "feature"].forEach(function (k) {
      html += '<a class="action-btn" target="_blank" rel="noopener" href="' +
        newTicketLink(k) + '">' + ({ help: "ASK FOR HELP", bug: "REPORT A BUG", feature: "PITCH AN IDEA" })[k] + "</a>";
    });
    html += "</div>";

    // filter chips
    html += '<div class="filter-row">';
    FILTERS.forEach(function (f) {
      var active = state.filter === f.key ? " active" : "";
      html += '<button type="button" class="fchip' + active + '" data-filter="' + f.key + '">' + f.label + "</button>";
    });
    html += "</div>";

    // the honest source banner
    if (state.loadedFrom === "cache-stale") {
      html += '<div class="stale-banner">Showing the last cached list — the API was unreachable this round. Data may be old; github.com/' + escapeHTML(THE_REPO) + "/issues is always current.</div>";
    } else if (state.loadedFrom === "cache-fresh") {
      html += '<div class="fresh-note">cached list · fresh within 10 min · refresh skips to save the API budget</div>';
    }

    // error state
    if (state.error) {
      html += '<div class="card err"><p>' + escapeHTML(state.error) + "</p></div>";
    } else if (state.loading && !state.tickets.length) {
      html += '<div class="card"><p class="brief">loading the desk…</p></div>';
    } else {
      // filter + list
      var list = state.tickets;
      if (state.filter === "open") list = list.filter(function (t) { return t.state === "open"; });
      else if (state.filter === "help") list = list.filter(function (t) { return t.labels.indexOf(LABELS.help) !== -1; });
      else if (state.filter === "bug") list = list.filter(function (t) { return t.labels.indexOf(LABELS.bug) !== -1; });
      else if (state.filter === "feature") list = list.filter(function (t) { return t.labels.indexOf(LABELS.feature) !== -1; });

      if (!list.length) {
        html += '<div class="card"><p class="brief">No tickets in that lane right now. Quiet desk is a good desk — or be the first: the buttons up top open GitHub with everything prefilled.</p></div>';
      } else {
        html += list.map(function (t) {
          var closed = t.state === "closed" ? " closed" : "";
          var labelChips = t.labels.slice(0, 3).map(function (l) {
            return '<span class="tlab">' + escapeHTML(l) + "</span>";
          }).join("");
          return '<a class="ticket' + closed + '" target="_blank" rel="noopener" href="' + escapeHTML(t.url) + '">' +
            '<span class="tnum">#' + t.number + "</span>" +
            '<span class="ttitle">' + escapeHTML(t.title) + labelChips + "</span>" +
            '<span class="tmeta">' + escapeHTML(t.state) + " · " + escapeHTML(String(t.comments)) + " replies · @" + escapeHTML(t.author) + "</span>" +
            "</a>";
        }).join("");
      }
    }

    app.innerHTML = html;

    // wiring (filter chips)
    app.querySelectorAll("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.filter = b.getAttribute("data-filter");
        render();
      });
    });
  }

  // ---------- boot ----------
  function boot() {
    app = document.getElementById("helpdesk-app");
    if (!app) return;
    render();
    loadTickets();

    // console learners:
    // FEDHelpDesk.state · FEDHelpDesk.reload() · FEDHelpDesk.newTicket("bug")
    window.FEDHelpDesk = {
      state: state,
      reload: loadTickets,
      repo: function () { return THE_REPO; },
      newTicket: function (kind, seed) { return newTicketLink(kind, seed); }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
