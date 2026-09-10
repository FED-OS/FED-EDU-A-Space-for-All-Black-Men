/* FED-EDU Core App — the block's homepage brain.
 * Plain terms: registers the service worker (offline memory), checks your
 * connection quality, and adapts the page so brothers on 3G aren't punished
 * for their internet. Zero libraries (ADR-001). Everything degrades gracefully.
 */

(function () {
  "use strict";

  /* ---- 1. Service worker: the offline memory -------------------- */
  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then(function () { /* registered — the block remembers its pages now */ })
        .catch(function () { /* registration failed: fine, the site still works online-only */ });
    } else {
      // Old browsers just skip PWA features — the content still loads. Never block the door.
    }
  }

  /* ---- 2. Connection quality: the 3-second rule, live ---------- */
  /* If the connection is slow (the classic Save-Data / 2G-3G situation),
   * we tell the page to go easy: hide the heavy flourishes, keep the content.
   * The content IS the block. The decoration is a luxury.
   */
  function connectionReport() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var box = document.getElementById("connection-note");

    var saveData = conn && conn.saveData;                 // browser says "user pays per byte"
    var slow = conn && conn.effectiveType &&
               (conn.effectiveType.indexOf("2g") !== -1 || conn.effectiveType.indexOf("3g") !== -1);
    var offline = navigator.onLine === false;

    if (offline) {
      document.body.classList.add("data-saver");
      if (box) {
        box.textContent = "📴 Offline — showing saved pages. Everything you read still counts.";
        box.hidden = false;
      }
    } else if (saveData || slow) {
      document.body.classList.add("data-saver");
      if (box) {
        box.textContent = "🐢 Slow connection detected — running light mode. Same block, less weight.";
        box.hidden = false;
      }
    } else {
      document.body.classList.remove("data-saver");
      if (box) box.hidden = true;
    }
  }

  /* ---- 3. Last-visit greeting: the block remembers you --------- */
  /* Small humanity, zero bytes of server: the page says "welcome back"
   * instead of greeting a returning brother like a stranger.
   * localStorage only — nothing leaves the phone (see SECURITY.md: we collect nothing).
   */
  function welcomeBack() {
    var tag = document.querySelector(".tagline");
    if (!tag) return;
    try {
      var last = localStorage.getItem("fed-edu-last-visit");
      var now = Date.now();
      if (last && now - parseInt(last, 10) < 1000 * 60 * 60 * 24) {
        // back within a day — "welcome back" instead of the cold open
        tag.textContent = "Welcome back, brother. The block held it down while you were gone.";
      }
      localStorage.setItem("fed-edu-last-visit", String(now));
    } catch (e) {
      // Private mode or storage blocked — greeting stays default. Never crash over a hello.
    }
  }

  /* ---- 4. Smooth-scroll nav (no libraries, 15 lines) ----------- */
  function smoothNav() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) {
        var target = document.getElementById(this.getAttribute("href").slice(1));
        if (target) {
          e.preventDefault();
          // Honor brothers who set reduced-motion in their OS — respect the user's phone.
          var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        }
      });
    }
  }

  /* ---- Boot ---------------------------------------------------- */
  function init() {
    registerServiceWorker();
    connectionReport();
    welcomeBack();
    smoothNav();

    // Re-check the connection when the phone's signal changes (walk into the library basement, etc.)
    var conn = navigator.connection;
    if (conn && conn.addEventListener) conn.addEventListener("change", connectionReport);
    window.addEventListener("online", connectionReport);
    window.addEventListener("offline", connectionReport);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
