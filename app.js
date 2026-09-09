/* FED-EDU Block App — the front door's brain.
 * Plain terms: registers the block-wide service worker (the offline memory for
 * EVERY room — dictionary, matrix, hustle board, map, blueprints, playground),
 * and nothing else. Every page still works without it; this just makes the
 * whole block remember itself on your phone. Zero libraries (ADR-001).
 */

(function () {
  "use strict";

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then(function () { /* the block remembers its pages now */ })
        .catch(function () { /* registration failed: fine, the site still works online-only */ });
    } else {
      // Old browsers just skip PWA features — the content still loads. Never block the door.
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerServiceWorker);
  } else {
    registerServiceWorker();
  }
})();
