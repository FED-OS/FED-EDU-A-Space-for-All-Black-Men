/*
  FED-EDU :: fedpromptly-coach :: engine-connector.js
  What this is: the bridge between FED-EDU coaches and the fedpromptly.com engine.
  Where it runs: inside sandbox apps (Rap Lab, Football Stats, Media FX) — drop the
  <script src=".../engine-connector.js"></script> tag and the app gains a Coach button.

  HOW IT THINKS (plain terms):
  Imagine the fedpromptly engine is the barber, and this file is the shop door.
  Any sandbox app that includes it can knock on that door with a question
  and get an answer that already knows WHO is asking and WHAT they're building.

  WHY THIS EXISTS (the real reason):
  A bare LLM treats a 16-year-old in Kingston the same as a 45-year-old in Atlanta.
  FED-EDU doesn't. The context-payload.json decides what the engine knows about
  the brother — his level, his hardware, his goal. That payload travels with every
  question. The coach never forgets who's asking.

  NO FRAMEWORKS (ADR-001): plain vanilla JS, one IIFE, zero dependencies.
  If it can't run on a 2015 Android over USB tether, it doesn't ship.

  RULES THIS FILE LIVES BY:
  1. The token never lands in the repo (SECURITY.md). It rides in localStorage.
  2. Every request body is plain JSON over HTTPS — no exotic protocols.
  3. If the engine is down, apps keep working. Coach is a bonus, never a dependency.
  4. Fallback copy is plain talk — never "Error 500" on a brother's screen.
*/

(function () {
  "use strict";

  /* ============ Config ============ */

  var ENGINE_URL   = "https://fedpromptly.com/api/v1/coach";   // the barber's chair
  var ENDPOINTS    = {
    debug:    ENGINE_URL + "/debug",      // "why is my code broken"
    project:  ENGINE_URL + "/project",    // "what should I build next"
    resume:   ENGINE_URL + "/resume"      // "turn this into money"
  };

  var STATE = {
    token: null,            // fedpromptly API key — localStorage only (SECURITY.md)
    payload: null,          // context-payload.json loaded once at boot
    ready: false,
    failures: 0             // if 3 in a row fail, coach goes quiet instead of spamming
  };

  var STORE_PREFIX = "fedcoach-";

  /* ============ Storage (browser only — token NEVER in the repo) ============ */

  function loadToken() {
    try { STATE.token = localStorage.getItem(STORE_PREFIX + "token") || null; }
    catch (e) { STATE.token = null; }
  }

  function saveToken(key) {
    STATE.token = key;
    try { localStorage.setItem(STORE_PREFIX + "token", key); }
    catch (e) { /* private mode — token lives for this session only */ }
  }

  function clearToken() {
    STATE.token = null;
    try { localStorage.removeItem(STORE_PREFIX + "token"); } catch (e) {}
  }

  /* ============ Context payload — the "who is asking" card ============ */

  function loadContext() {
    /*
      context-payload.json is the brother's ID card for the engine.
      It ships with the app. It is NOT a secret — it's a résumé for the coach.
      It says: level (spawn/builder/og), hardware (phone/tether/tower),
      goal (job / hustle / project), and the city context if he shares it.
    */
    fetch("context-payload.json")
      .then(function (r) { if (!r.ok) { throw new Error("no payload"); } return r.json(); })
      .then(function (payload) {
        STATE.payload = payload;
        STATE.ready = true;
        wireCoachButton();
      })
      .catch(function () {
        // No payload = standalone mode. Coach button hides itself, app still runs.
        console.log("[fedcoach] standalone mode — no context payload found");
      });
  }

  /* ============ The Coach button — drop-in UI for any sandbox app ============ */

  function wireCoachButton() {
    var btn = document.querySelector("[data-fedcoach]");
    if (!btn) { return; }

    btn.hidden = false;
    btn.addEventListener("click", function () {
      if (!STATE.token) {
        askForToken();
        return;
      }
      coachPanel(btn);
    });
  }

  function askForToken() {
    var key = prompt(
      "fedpromptly coach setup — 1 move:\n\n" +
      "Your fedpromptly.com API key.\n" +
      "It stays in THIS browser only. Never in the repo. Never in a DM.\n" +
      "fedpromptly.com → Settings → API key"
    );
    if (!key) { return; }
    saveToken(key);
    alert("Key saved. Coach is armed.\nNow every question carries your card: level, hardware, goal.\nNext tap opens the coach panel.");
  }

  /* ============ Coach panel — minimal, 360px-first ============ */

  function coachPanel(anchor) {
    var panel = document.getElementById("fedcoach-panel");
    if (panel) { panel.remove(); return; }   // toggle behavior — second tap closes

    panel = document.createElement("div");
    panel.id = "fedcoach-panel";
    panel.className = "fedcoach-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "fedpromptly coach");

    panel.innerHTML =
      '<form id="fedcoach-form" class="fedcoach-form">' +
      '  <label for="fedcoach-q" class="fedcoach-label">Ask the coach</label>' +
      '  <textarea id="fedcoach-q" rows="3" placeholder="Why does my HTML page show a blank screen?"></textarea>' +
      '  <button type="submit" class="btn">Send</button>' +
      '  <button type="button" class="btn btn-outline" data-fedcoach-mode="debug">🐛 Debug</button>' +
      '  <button type="button" class="btn btn-outline" data-fedcoach-mode="project">🔧 Project</button>' +
      '  <button type="button" class="btn btn-outline" data-fedcoach-mode="resume">💼 Resume</button>' +
      '  <button type="button" class="btn btn-outline" data-fedcoach-close>Close</button>' +
      '</form>' +
      '<div id="fedcoach-out" class="fedcoach-out" aria-live="polite"></div>';

    document.body.appendChild(panel);
    positionPanel(panel, anchor);

    var form = panel.querySelector("#fedcoach-form");
    var out  = panel.querySelector("#fedcoach-out");
    var q    = panel.querySelector("#fedcoach-q");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      ask("debug", q.value, out);   // default mode = debug (most common ask)
    });

    var modeBtns = panel.querySelectorAll("[data-fedcoach-mode]");
    for (var i = 0; i < modeBtns.length; i++) {
      modeBtns[i].addEventListener("click", function () {
        ask(this.getAttribute("data-fedcoach-mode"), q.value, out);
      });
    }

    var closeBtn = panel.querySelector("[data-fedcoach-close]");
    closeBtn.addEventListener("click", function () { panel.remove(); });

    q.focus();
  }

  function positionPanel(panel, anchor) {
    var r = anchor.getBoundingClientRect();
    panel.style.position = "fixed";
    panel.style.maxWidth = "min(420px, calc(100vw - 24px))";
    panel.style.maxHeight = "60vh";
    panel.style.left = Math.max(12, Math.min(r.left, window.innerWidth - 432)) + "px";
    panel.style.top  = (r.bottom + 8 > window.innerHeight * 0.4) ? "12px" : (r.bottom + 8) + "px";
    panel.style.overflowY = "auto";
    panel.style.zIndex = "9999";
  }

  /* ============ ask() — the single door to the engine ============ */

  function ask(mode, question, out) {
    if (!question || !question.trim()) {
      out.innerHTML = "<p>Ask something first — the coach can't read minds (yet).</p>";
      return;
    }
    if (!STATE.token) { askForToken(); return; }

    out.innerHTML = "<p>📡 Knocking on the shop door…</p>";

    var body = {
      mode: mode,                    // debug | project | resume
      question: question,
      context: STATE.payload,        // the brother's card — always attached
      source: "FED-EDU " + (STATE.payload && STATE.payload.app ? STATE.payload.app : "sandbox"),
      cacheBust: Date.now()
    };

    fetch(ENDPOINTS[mode] || ENDPOINTS.debug, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + STATE.token
      },
      body: JSON.stringify(body)
    })
    .then(function (r) {
      if (r.status === 401) { throw new Error("BADKEY"); }
      if (r.status === 429) { throw new Error("SLOWDOWN"); }
      if (!r.ok) { throw new Error("ENGINE"); }
      return r.json();
    })
    .then(function (data) {
      STATE.failures = 0;
      renderAnswer(out, data);
    })
    .catch(function (err) {
      STATE.failures++;
      renderError(out, err.message);
    });
  }

  function renderAnswer(out, data) {
    var answer = (data && data.answer) || "The engine answered but the wrapper is empty — file this as a bug on the block.";
    var follow  = (data && data.followUp) ? '<p class="fedcoach-follow"><strong>Next move:</strong> ' + escapeHTML(data.followUp) + "</p>" : "";

    out.innerHTML =
      '<h4 class="fedcoach-title">Coach says</h4>' +
      "<p>" + escapeHTML(answer) + "</p>" + follow;
  }

  function renderError(out, why) {
    var plain = {
      "BADKEY":  "Key rejected. Your fedpromptly key may have expired — grab a fresh one at fedpromptly.com → Settings → API key.",
      "SLOWDOWN":"Easy — you're asking too fast. Wait 60 seconds and try again. The coach gets tired too.",
      "ENGINE":  "The engine's down or busy. Your app still works fine without the coach — try again later.",
      "default": "Can't reach the coach right now. Check the tether (wiki/Getting-Online/EasyTether-Basics.md), then try again."
    }[why] || "default";

    if (STATE.failures >= 3) {
      plain += "\n\nThe coach has gone quiet after " + STATE.failures + " straight misses. Your app runs fine without it — that's by design (ADR-002: no single point of failure).";
    }
    out.innerHTML = "<p>⚠️ " + escapeHTML(plain) + "</p>";
  }

  /* ============ Utilities ============ */

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ============ Boot ============ */

  loadToken();
  loadContext();

  // Export a tiny surface for sandbox apps that want manual control
  window.FedCoach = {
    ask: ask,
    saveToken: saveToken,
    clearToken: clearToken,
    hasToken: function () { return !!STATE.token; }
  };

})();
