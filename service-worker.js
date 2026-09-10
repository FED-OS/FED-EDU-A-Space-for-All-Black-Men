/* FED-EDU Block Service Worker — the whole block's offline memory.
 * Plain terms: this runs at the ROOT, so every room in the block — the dictionary,
 * the matrix, the hustle board, the map, the blueprints, the playground — remembers
 * itself on your phone once you've been there. The block loads even with no signal.
 *
 * ADR-001 (vanilla, no libraries) · ADR-002 (the 3-second rule) · ADR-007 (PWA).
 *
 * THE ONE HABIT (read this twice):
 * When you change ANY page in the block, bump CACHE_VERSION below (v1 -> v2).
 * The version bump tells brothers' phones "there's a new block, drop the old."
 * Skipping the bump = brothers see yesterday's site and think you didn't ship.
 */

var CACHE_VERSION = "fed-edu-block-v5";

// The shell: front door + the pages a first-time brother hits most.
// Not every room — the fetch handler caches the rest as you walk through.
var APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./icon-192.png",
  "./favicon.ico",
  "./urban-dictionary/index.html",
  "./urban-dictionary/terms/index.html",
  "./urban-dictionary/search-engine.js",
  "./urban-dictionary/index.json",
  "./excellence-matrix/index.html",
  "./excellence-matrix/matrix-engine.js",
  "./hustle-index/index.html",
  "./hustle-index/market-engine.js",
  "./community-boards/index.html",
  "./community-boards/diaspora-map.js",
  "./community-boards/help-desk-bridge.js",
  "./courses-and-guides/02-real-life-minecraft/index.html",
  "./sandbox-blueprints/01-rap-lab/index.html",
  "./sandbox-blueprints/02-football-stats/index.html",
  "./sandbox-blueprints/03-media-fx-clipper/index.html",
  "./sandbox-blueprints/04-streamer-tools/index.html",
  "./fed-comm-dm/index.html",
  "./wiki/index.html",
  "./courses-and-guides/index.html",
  "./sandbox-blueprints/index.html",
  "./prompts/index.html",
  "./discussion/index.html",
  "./fedpromptly-coach/index.html",
  "./physical-raffles/index.html",
  "./support-the-block/index.html",
  "./docs/index.html",
  "./README.md.html"
];

// Install: pre-load the shell so first load offline still shows something real.
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (store) {
      // individual puts keep one bad file from killing the whole install.
      return Promise.all(
        APP_SHELL.map(function (url) {
          return store.add(url).catch(function () {
            // one miss shouldn't sink the ship — log it, keep sailing
            console.warn("[FED-EDU SW] shell miss (cached later on visit):", url);
          });
        })
      );
    }).then(function () {
      self.skipWaiting();
    })
  );
});

// Activate: clear old versions — this is where "drop the old block" happens.
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names
          .filter(function (n) { return n !== CACHE_VERSION; })
          .map(function (n) { return caches.delete(n); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Fetch: the traffic cop.
//   Pages + shell -> cache first (fast, offline-friendly — the 3-second rule)
//   .json data    -> network first with cache fallback (fresh numbers when online,
//                    last-known numbers when the tether drops mid-session)
//   GitHub API    -> never touched (cross-origin, out of our lane)
self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.origin !== location.origin) return;

  var isData = url.pathname.indexOf(".json") !== -1;

  if (isData) {
    // Network-first for data (fresh when possible, cached when stranded)
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (store) { store.put(event.request, copy); });
          return res;
        })
        .catch(function () {
          return caches.match(event.request).then(function (hit) {
            return hit || new Response(
              JSON.stringify({ error: "offline", note: "No connection and no cached copy yet — refresh when you're back on." }),
              { headers: { "Content-Type": "application/json" } }
            );
          });
        })
    );
  } else {
    // Cache-first for pages and the shell
    event.respondWith(
      caches.match(event.request).then(function (hit) {
        return hit || fetch(event.request).then(function (res) {
          if (res.ok) {
            var copy = res.clone();
            caches.open(CACHE_VERSION).then(function (store) { store.put(event.request, copy); });
          }
          return res;
        });
      })
    );
  }
});

/* FED-EDU block service worker — MIT licensed, community-built.
 * Bump CACHE_VERSION on every content change. That's the whole maintenance ritual. */
