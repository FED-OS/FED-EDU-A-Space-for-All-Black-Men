/* FED-EDU Service Worker — the app's memory.
 * Plain terms: saves pages so the block loads even with no signal or slow tether.
 * ADR-001/ADR-007: cache-first for the shell, network for data, zero libraries.
 *
 * THE ONE HABIT (read this twice):
 * When you change ANY file in this folder, bump CACHE_VERSION below (v1 -> v2).
 * The version bump is what tells brothers' phones "there's a new block, drop the old."
 * Skipping the bump = brothers see yesterday's site and think you didn't ship.
 */

var CACHE_VERSION = "fed-edu-v1";
var APP_SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./manifest.json",
  "../styles.css"
];

// Install: pre-load the shell so first load offline still shows something real.
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (store) {
      // addAll is all-or-nothing; individual puts keep one bad file from killing install.
      return Promise.all(
        APP_SHELL.map(function (url) {
          return store.put(url, new Response("", { status: 200 })).catch(function () {});
        })
      ).then(function () {
        return store.addAll(APP_SHELL).catch(function () {});
      });
    })
  );
  self.skipWaiting();
});

// Activate: clear old versions — this is where the "drop the old block" happens.
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
//   Shell + pages -> cache first (fast, offline-friendly — the 3-second rule)
//   .json data    -> network first with cache fallback (fresh numbers when online,
//                    last-known numbers when the tether drops mid-session)
self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);

  // Never touch non-GET or cross-origin — out of our lane.
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
    // Cache-first for the shell and pages
    event.respondWith(
      caches.match(event.request).then(function (hit) {
        return hit || fetch(event.request).then(function (res) {
          // Only cache same-origin successes — never cache errors or other people's servers.
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

/* FED-EDU service worker — MIT licensed, community-built.
 * Bump CACHE_VERSION on every content change. That's the whole maintenance ritual. */
