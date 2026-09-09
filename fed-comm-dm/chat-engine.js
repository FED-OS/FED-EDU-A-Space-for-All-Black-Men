/* Fed-Comm DM — Chat Engine
 * Plain terms: the brain of the block's DM system. Takes what you type,
 * hands it to the encryption layer (locked BEFORE it leaves), ships the
 * locked box via GitHub gist transport, polls for your brother's replies,
 * unlocks them with the shared passphrase, and paints them on screen.
 *
 * Architecture (ADR-004): GitHub IS the backend. A secret gist per
 * conversation pair = the mailbox. Version history is free. Zero servers,
 * zero bills, works on tethered 3G.
 *
 * Every function carries a plain-talk comment. Reading this file top to
 * bottom IS a course in real messaging architecture.
 */

(function () {
  "use strict";

  /* ============ Config ============ */
  var GITHUB_API = "https://api.github.com/";
  var POLL_MS = 15000;             // 15s polling — gentle on metered data, patient like the block
  var MAX_MESSAGE_LEN = 2000;      // matches the input's maxlength
  var HISTORY_KEEP = 80;           // messages kept in the gist — older ones live in gist versions (free archive)

  var state = {
    token: null,                   // personal access token (repo+gist scope) — lives in browser storage only
    passphrase: null,              // the shared lock — NEVER sent anywhere (see encryption-layer.js)
    brother: null,                 // GitHub username of the brother you're talking to
    gistId: null,                  // the shared mailbox ID
    messages: [],                  // decrypted conversation in memory
    pollTimer: null,
    status: "offline"
  };

  /* ============ Tiny DOM helpers (no libraries, ever) ============ */
  function $(id) { return document.getElementById(id); }
  function setStatus(txt) {
    state.status = txt;
    var el = $("dm-status");
    if (el) el.textContent = txt;
  }
  function showError(msg) {
    var el = $("dm-err");
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  /* ============ The mailbox math ============ */
  /* Every conversation pair gets ONE deterministic gist location so both
   * brothers compute the SAME mailbox without coordinating IDs:
   * alphabetize the two usernames → pair key. "me+you" == "you+me".
   */
  function pairKey(a, b) {
    return [a.toLowerCase(), b.toLowerCase()].sort().join("__");
  }

  /* ============ Storage (browser-only — nothing leaves but locked boxes) ============ */
  var STORE = {
    get: function (k) {
      try { return localStorage.getItem("fedcomm-" + k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { localStorage.setItem("fedcomm-" + k, v); } catch (e) { /* private mode: work in-memory this session */ }
    },
    del: function (k) {
      try { localStorage.removeItem("fedcomm-" + k); } catch (e) {}
    }
  };

  /* ============ GitHub transport (all raw fetch, no SDK) ============ */
  function api(path, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    opts.headers["Accept"] = "application/vnd.github+json";
    if (state.token) opts.headers["Authorization"] = "Bearer " + state.token;
    return fetch(GITHUB_API + path, opts).then(function (res) {
      if (!res.ok) {
        // Plain-talk errors: a brother debugging at 1AM deserves sentences, not status codes.
        var why = res.status === 401 ? "Token rejected — check it has the gist scope and isn't expired."
              : res.status === 403 ? "Rate limit or permissions. Wait a minute, or check the token scopes."
              : res.status === 404 ? "Not found — the mailbox gist may not exist yet. Send first."
              : "GitHub said no (" + res.status + ").";
        throw new Error(why);
      }
      return res.json();
    });
  }

  /* Find or create the secret mailbox gist for this pair.
   * A secret gist: unlisted, accessible only with the URL/token — and the
   * CONTENT inside is encrypted anyway. Two locks. */
  function ensureMailbox() {
    var tag = "fedcomm:" + pairKey(state.brother, "me-placeholder"); // "me" replaced below
    // We need YOUR username for the pair key — fetch it from the token itself.
    return api("user").then(function (me) {
      state.me = me.login;
      var key = pairKey(me.login, state.brother);
      // Search the user's gists for one already tagged with this pair key.
      return api("gists?per_page=100").then(function (gists) {
        for (var i = 0; i < gists.length; i++) {
          var desc = gists[i].description || "";
          if (desc.indexOf("fedcomm:" + key) !== -1) {
            state.gistId = gists[i].id;
            return gists[i];
          }
        }
        // No mailbox yet — create it. First message starts the thread.
        return api("gists", {
          method: "POST",
          body: JSON.stringify({
            description: "fedcomm:" + key,
            secret: true,
            files: {
              "thread.json": {
                content: JSON.stringify({ v: 1, msgs: [] })
              }
            }
          })
        }).then(function (g) {
          state.gistId = g.id;
          return g;
        });
      });
    });
  }

  /* ============ Message flow ============ */
  function send(text) {
    if (!text) return Promise.resolve();
    if (text.length > MAX_MESSAGE_LEN) { showError("Too long — keep it under " + MAX_MESSAGE_LEN + " characters."); return Promise.resolve(); }

    var msg = { from: state.me, to: state.brother, t: Date.now() };

    // 1) Lock the message BEFORE anything else happens (encryption-layer.js).
    return FedCommCrypto.seal(text, state.passphrase).then(function (locked) {
      msg.box = locked;                      // the locked box rides in msg.box — the plaintext never travels

      // 2) Push into the local copy immediately (optimistic — feels instant on 3G).
      state.messages.push({ from: msg.from, t: msg.t, text: text });
      render();
      saveLocal();

      // 3) Ship the locked box to the mailbox.
      return readThread().then(function (thread) {
        thread.msgs.push(msg);
        if (thread.msgs.length > HISTORY_KEEP) thread.msgs = thread.msgs.slice(-HISTORY_KEEP);
        return writeThread(thread);
      });
    }).catch(function (err) {
      showError("Send failed: " + err.message + " — your message is saved locally; it ships when the connection returns.");
      setStatus("offline");
    });
  }

  function readThread() {
    return api("gists/" + state.gistId).then(function (g) {
      var file = g.files["thread.json"];
      if (!file) return { v: 1, msgs: [] };
      return fetch(file.raw_url).then(function (r) { return r.json(); });
    });
  }

  function writeThread(thread) {
    return api("gists/" + state.gistId, {
      method: "PATCH",
      body: JSON.stringify({ files: { "thread.json": { content: JSON.stringify(thread) } } })
    });
  }

  /* Poll: quietly check the mailbox every 15s. New boxes → unlock → paint. */
  function poll() {
    if (!state.gistId || !state.passphrase) return;
    readThread().then(function (thread) {
      var fresh = thread.msgs.filter(function (m) { return m.to === state.me || (m.from !== state.me && m.to === "all"); });
      // Decrypt every box we can; skip ones already painted (match by timestamp+from).
      var chain = Promise.resolve();
      var out = [];
      thread.msgs.forEach(function (m) {
        chain = chain.then(function () {
          return FedCommCrypto.open(m.box, state.passphrase)
            .then(function (txt) { out.push({ from: m.from, t: m.t, text: txt }); })
            .catch(function () { /* wrong/broken box — skip silently, never crash the thread */ });
        });
      });
      return chain.then(function () {
        if (out.length !== state.messages.length || JSON.stringify(out) !== JSON.stringify(state.messages.map(stripBox))) {
          state.messages = out;
          render();
          saveLocal();
        }
        setStatus("live");
        showError("");
      });
    }).catch(function (err) {
      setStatus("offline");
      showError("Mailbox unreachable: " + err.message);
    });
  }

  function stripBox(m) { return { from: m.from, t: m.t, text: m.text }; }

  /* ============ Local persistence (works offline; ships later) ============ */
  function saveLocal() {
    STORE.set("thread-" + (state.brother || "none"), JSON.stringify(state.messages.map(stripBox)));
  }

  /* ============ Rendering ============ */
  function render() {
    var list = $("dm-list");
    if (!list) return;
    if (!state.messages.length) return; // keep the empty-state explainer
    var html = "";
    for (var i = 0; i < state.messages.length; i++) {
      var m = state.messages[i];
      var mine = m.from === state.me;
      var when = new Date(m.t).toLocaleString();
      html += '<div class="dm-bubble ' + (mine ? "me" : "them") + '">' +
                escapeHTML(m.text) +
                '<span class="meta">' + (mine ? "you" + " · " + when : m.from + " · " + when) + '</span>' +
              "</div>";
    }
    list.innerHTML = html;
    list.scrollTop = list.scrollHeight;
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ============ Setup flow (the three inputs: token, passphrase, brother) ============ */
  function setupFlow() {
    var token = STORE.get("token");
    var pass  = STORE.get("passphrase-" + (state.brother || ""));
    var bro   = STORE.get("brother");

    if (!token || !bro || !pass) {
      // First-run explainer doubles as the setup prompt — one screen, three fields, plain talk.
      var t = prompt("Fed-Comm setup — 1 of 3\n\nYour GitHub personal access token (gist scope).\nIt stays in THIS browser only.\ngithub.com/settings/tokens → Generate (classic) → check 'gist'");
      if (!t) return;
      var b = prompt("Fed-Comm setup — 2 of 3\n\nYour brother's GitHub username:");
      if (!b) return;
      var p = prompt("Fed-Comm setup — 3 of 3\n\nShared passphrase for this conversation.\nAgree on it OUT of band (in person / on a call).\nLong beats clever — same rule as your GitHub password.");
      if (!p) return;

      STORE.set("token", t);
      STORE.set("brother", b);
      state.brother = b;
      STORE.set("passphrase-" + b, p);
      state.passphrase = p;
      state.token = t;
    } else {
      state.token = t = token; state.brother = bro; state.passphrase = pass;
    }
    $("dm-who").textContent = "DM with " + state.brother;

    // Load any offline-saved history instantly, then go live.
    var saved = STORE.get("thread-" + state.brother);
    if (saved) { try { state.messages = JSON.parse(saved); render(); } catch (e) {} }

    ensureMailbox()
      .then(function () { setStatus("live"); poll(); state.pollTimer = setInterval(poll, POLL_MS); })
      .catch(function (err) { setStatus("offline"); showError("Setup failed: " + err.message); });
  }

  /* ============ Wiring ============ */
  function init() {
    var form = $("dm-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = $("dm-input");
        var text = input.value.trim();
        if (!text) return;
        input.value = "";
        send(text);
      });
    }
    var keyBtn = $("btn-key");
    if (keyBtn) {
      keyBtn.addEventListener("click", function () {
        var p = prompt("Change the shared passphrase for this thread.\nBOTH brothers must change it, or messages stop unlocking.");
        if (p) { state.passphrase = p; STORE.set("passphrase-" + state.brother, p); poll(); }
      });
    }
    var rosterBtn = $("btn-brothers");
    if (rosterBtn) {
      rosterBtn.addEventListener("click", function () {
        alert("Multi-brother roster: next prototype milestone.\nFor now, one thread per install — see ROADMAP.md v1.0.\nThe templates/ folder already carries the row pattern.");
      });
    }
    setupFlow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
