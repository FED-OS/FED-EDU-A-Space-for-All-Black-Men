/* FED-EDU Urban Dictionary Search Engine
 * Plain terms: this is the search box for the dictionary. Type a word, get the term.
 * Rules it obeys (ADR-001): vanilla JS only, no libraries, works offline-ish on 3G,
 * works on a cracked phone screen. It reads index.json and every terms/ file at load,
 * builds a tiny in-memory search index, and filters as you type.
 */

(function () {
  "use strict";

  // ---- Config -----------------------------------------------------------
  var INDEX_PATH = "index.json";
  var TERMS_DIR = "terms/";

  // ---- State ------------------------------------------------------------
  var entries = [];        // {slug, title, oneLiner, body, haystack}
  var loaded = false;

  // ---- Helpers ----------------------------------------------------------
  function el(id) { return document.getElementById(id); }

  // The "normalize" move: lowercase, strip punctuation — so "SaaS" finds "saas",
  // and "API-endpoint" finds "api endpoint". Tolerance is respect.
  function normalize(text) {
    return (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  // Escape HTML so nobody's term file can inject junk into the page.
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Score a term against the query: title match beats one-liner beats body.
  // Simple scoring, deliberately — it runs on every keystroke on a slow phone.
  function score(entry, query) {
    if (!query) return 0;
    var q = normalize(query);
    if (!q) return 0;
    var t = normalize(entry.title);
    var o = normalize(entry.oneLiner);
    var b = entry.haystack;
    var s = 0;
    if (t === q) s += 100;                       // exact title
    else if (t.indexOf(q) === 0) s += 80;        // title starts with it
    else if (t.indexOf(q) !== -1) s += 60;       // title contains it
    if (o.indexOf(q) !== -1) s += 30;            // one-liner contains it
    if (b.indexOf(q) !== -1) s += 10;            // somewhere in the body
    return s;
  }

  // ---- Render -----------------------------------------------------------
  function card(entry, query) {
    var link = '<a class="ud-card" href="' + TERMS_DIR + esc(entry.slug) + '.md">';
    link += '<span class="ud-title">' + esc(entry.title) + "</span>";
    link += '<span class="ud-line">' + esc(entry.oneLiner) + "</span>";
    link += '<span class="ud-cat">[' + esc(entry.category || "basics") + "]</span>";
    link += "</a>";
    return link;
  }

  function render(results, query) {
    var box = el("ud-results");
    if (!box) return;

    if (!loaded) {
      box.innerHTML = '<p class="ud-note">Loading the dictionary… if this hangs, check your connection and refresh.</p>';
      return;
    }
    if (!query || !normalize(query)) {
      box.innerHTML = '<p class="ud-note">Type a word above — jargon or street, either side works. Or just browse: ' + entries.length + " terms loaded.</p>";
      return;
    }
    if (!results.length) {
      box.innerHTML =
        '<p class="ud-note">Nothing for “' + esc(query) + '” yet.</p>' +
        '<p class="ud-note">That missing term is a <strong>contribution waiting to happen</strong>: ' +
        'check <a href="index.json">index.json</a> → add <code>terms/' + esc(normalize(query).replace(/ /g, "_")) +
        '.md</code> → PR it. That’s 2 raffle tickets and every brother after you thanks you.</p>';
      return;
    }
    box.innerHTML = results.map(function (e) { return card(e, query); }).join("");
  }

  // ---- Search -----------------------------------------------------------
  function search(query) {
    var results = entries
      .map(function (e) { return { e: e, s: score(e, query) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (r) { return r.e; });
    render(results, query);
  }

  // ---- Loading (index first, then term bodies in one pass) --------------
  function load() {
    fetch(INDEX_PATH)
      .then(function (r) { return r.json(); })
      .then(function (index) {
        var pending = (index.terms || []).map(function (t) {
          var entry = {
            slug: t.slug,
            title: t.title,
            category: t.category,
            oneLiner: t.one_liner,
            haystack: normalize(t.title + " " + t.one_liner + " " + (t.first_fifty || ""))
          };
          // Pull the body text if we can; search still works without it
          return fetch(TERMS_DIR + t.slug + ".md")
            .then(function (r) { return r.ok ? r.text() : ""; })
            .then(function (body) {
              if (body) entry.haystack += " " + normalize(body.replace(/[#>*`_\-\[\]()]/g, " "));
              return entry;
            })
            .catch(function () { return entry; });
        });
        return Promise.all(pending);
      })
      .then(function (all) {
        entries = all;
        loaded = true;
        render([], el("ud-input") ? el("ud-input").value : "");
      })
      .catch(function () {
        var box = el("ud-results");
        if (box) box.innerHTML =
          '<p class="ud-note">Couldn’t load the dictionary — check your connection and refresh. ' +
          'If it keeps failing on your device, that’s a bug worth reporting: .github/ISSUE_TEMPLATE/bug_report.md</p>';
      });
  }

  // ---- Wire up ----------------------------------------------------------
  // Debounce: on a slow phone, searching on EVERY keystroke stutters. 200ms feels instant to humans.
  var timer = null;
  function onType(e) {
    var q = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(function () { search(q); }, 200);
  }

  function init() {
    var input = el("ud-input");
    if (input) {
      input.addEventListener("input", onType);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { clearTimeout(timer); search(input.value); }
      });
    }
    load();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
