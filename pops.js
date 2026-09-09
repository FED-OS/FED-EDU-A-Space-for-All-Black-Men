/* ═══════════════════════════════════════════════════════════════
   FED-EDU POPS — The Daily Practice Engine
   Random, gentle pops that remind a brother to WORK, READ, or PRAY
   for 5–20 minutes a day. No dependencies. Respects reduced motion.

   How it behaves:
   • First pop arrives 45–120 seconds into a visit (so it feels alive,
     not predatory).
   • Then every 6–15 minutes, another — never while one is open,
     never more than 6 per session.
   • The brother accepts ("I'M ON IT") → a live countdown card runs.
     Finish it (or end early — honest effort counts) → streak +1.
   • "LATER" snoozes 10 minutes. "×" dismisses until the next pop.
   • One completed pop per day counts toward the streak. Miss a day,
     the streak resets to 1. Life happens; the block understands.

   Debug / demo:
   • Add ?pop=now to any URL → instant pop (great for showing it off).
   • window.FEDPops = { fire(type), state(), stop() } in the console.

   Design tokens are scoped + injected — pops looks right on every
   page without touching each page's stylesheet.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var POP_MIN = 5;     // shortest practice
  var POP_MAX = 20;    // longest practice
  var FIRST_MIN_MS = 45 * 1000;   // earliest first pop
  var FIRST_SPAN_MS = 75 * 1000;  // first pop lands 45–120s in
  var NEXT_MIN_MS = 6 * 60 * 1000;   // next pop no sooner than 6 min
  var NEXT_SPAN_MS = 9 * 60 * 1000;  // ...and no later than 15 min
  var SNOOZE_MS = 10 * 60 * 1000;
  var MAX_PER_SESSION = 6;

  var STORE = {
    streak: 'fedpops-streak',
    lastday: 'fedpops-lastday',
    seen: 'fedpops-seen-today',
    session: 'fedpops-session-count'
  };

  var TYPES = {
    work: {
      key: 'work', label: 'TIME TO WORK', emoji: '🔨',
      color: '#256d46', soft: 'rgba(37, 109, 70, 0.10)',
      lines: [
        'Pick the project back up. {m} minutes — open the editor and place one block. That\'s the whole ask.',
        '{m} minutes on the hustle. One ticket, one page, one commit. The bag does not move itself.',
        'Nobody is coming to hand it to you. {m} minutes of real work, starting now. Timer\'s right here.',
        'You said you\'d build. The block is holding you to it — {m} minutes, full focus, go.'
      ],
      doing: 'WORK — stay with it'
    },
    read: {
      key: 'read', label: 'TIME TO READ', emoji: '📖',
      color: '#b07d2f', soft: 'rgba(176, 125, 47, 0.10)',
      lines: [
        '{m} minutes in the Wiki. One page, one new thing you didn\'t know this morning.',
        'Open the Excellence Matrix. {m} minutes with the brothers who built this before you — receipts on every wall.',
        'The decoder ring is right there. {m} minutes, two terms — speak the language the jobs pay for.',
        '{m} minutes of reading. The brothers who read the manual are the ones who quote the price.'
      ],
      doing: 'READ — stay with it'
    },
    pray: {
      key: 'pray', label: 'TIME TO PRAY', emoji: '🙏',
      color: '#6d5a8e', soft: 'rgba(109, 90, 142, 0.10)',
      lines: [
        'Be still for {m} minutes. Talk to God — or just breathe and listen. Both count.',
        '{m} minutes of quiet. Gratitude first, then ask for the strength to keep building.',
        'Bow your head for {m} minutes. The work needs a foundation underneath it.',
        '{m} minutes. The hustle is loud; the answer rarely is. Get quiet and hear it.'
      ],
      doing: 'PRAY — stay with it'
    }
  };

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* old browsers — fine */ }

  /* ── storage helpers (fail-safe: private mode won't break pops) ── */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* noop */ } }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function dayDiff(a, b) { // whole days between two YYYY-MM-DD strings
    var da = new Date(a + 'T00:00:00'), db = new Date(b + 'T00:00:00');
    return Math.round((db - da) / 86400000);
  }

  function streakCount() {
    var n = parseInt(lsGet(STORE.streak) || '0', 10) || 0;
    var last = lsGet(STORE.lastday);
    if (!last) return 0;
    var diff = dayDiff(last, todayStr());
    if (diff >= 2) return 0;   // gap of a day or more — streak is broken
    return n;
  }

  function creditPractice() {
    var today = todayStr();
    if (lsGet(STORE.lastday) === today) return; // already credited today
    var last = lsGet(STORE.lastday);
    var n = streakCount();
    n = (last && dayDiff(last, today) === 1) ? n + 1 : 1; // continue or restart
    lsSet(STORE.streak, String(n));
    lsSet(STORE.lastday, today);
  }

  function sessionCount() { return parseInt(lsGet(STORE.session) || '0', 10) || 0; }
  function bumpSession() { lsSet(STORE.session, String(sessionCount() + 1)); }

  /* ── the pop card ─────────────────────────────────────────────── */
  var host = null, timerId = null, current = null, countdownEnd = 0, tickId = null;

  function injectCSS() {
    if (document.getElementById('fed-pops-style')) return;
    var css = [
      '#fed-pop-host{position:fixed;right:16px;bottom:16px;z-index:2147483000;max-width:360px;width:calc(100vw - 32px);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',sans-serif;color:#2a2520;}',
      '#fed-pop-card{background:#fffdf8;border:1px solid #e5dcc9;border-radius:16px;box-shadow:0 2px 6px rgba(70,60,40,.10),0 18px 50px rgba(70,60,40,.14);overflow:hidden;opacity:0;transform:translateY(14px);transition:opacity .35s ease,transform .35s ease;}',
      '#fed-pop-card.on{opacity:1;transform:translateY(0);}',
      '#fed-pop-bar{height:5px;}',
      '#fed-pop-body{padding:16px 18px 14px;}',
      '#fed-pop-head{display:flex;align-items:center;gap:10px;}',
      '#fed-pop-emoji{font-size:1.5rem;line-height:1;}',
      '#fed-pop-title{font-family:Georgia,\'Times New Roman\',serif;font-weight:700;font-size:1.02rem;letter-spacing:.4px;flex:1;}',
      '#fed-pop-close{border:0;background:none;color:#6f675c;font-size:1.05rem;cursor:pointer;padding:6px;margin:-6px -6px 0 0;border-radius:8px;min-height:34px;min-width:34px;}',
      '#fed-pop-close:hover{background:#f3ecdd;color:#2a2520;}',
      '#fed-pop-text{font-size:.92rem;line-height:1.5;margin:10px 0 4px;color:#4a4238;}',
      '#fed-pop-sub{font-size:.76rem;color:#6f675c;margin-bottom:12px;}',
      '#fed-pop-sub b{color:#2a2520;}',
      '#fed-pop-actions{display:flex;gap:8px;flex-wrap:wrap;}',
      '.fed-pop-btn{border-radius:10px;padding:9px 16px;font-size:.85rem;font-weight:700;cursor:pointer;min-height:44px;border:1.5px solid transparent;transition:transform .15s,box-shadow .15s;}',
      '.fed-pop-btn:active{transform:translateY(1px);}',
      '#fed-pop-go{background:#256d46;color:#fffdf8;font-family:Georgia,serif;letter-spacing:.5px;}',
      '#fed-pop-go:hover{box-shadow:0 6px 18px rgba(37,109,70,.35);}',
      '#fed-pop-later{background:none;color:#6f675c;border-color:#d4c8ae;}',
      '#fed-pop-later:hover{color:#2a2520;border-color:#b07d2f;}',
      '#fed-pop-timer{display:none;text-align:center;padding:20px 18px 18px;}',
      '#fed-pop-clock{font-family:\'Courier New\',monospace;font-size:2.6rem;font-weight:700;letter-spacing:2px;margin:6px 0 2px;}',
      '#fed-pop-doing{font-size:.8rem;letter-spacing:1.5px;text-transform:uppercase;color:#6f675c;}',
      '#fed-pop-progress{height:5px;background:#f3ecdd;border-radius:999px;margin:14px 0 4px;overflow:hidden;}',
      '#fed-pop-fill{height:100%;width:0%;border-radius:999px;transition:width 1s linear;}',
      '#fed-pop-done-row{margin-top:12px;display:flex;gap:8px;justify-content:center;}',
      '#fed-pop-finish{background:none;border:1.5px solid #256d46;color:#256d46;}',
      '#fed-pop-finish:hover{background:rgba(37,109,70,.08);}',
      '#fed-pop-win{display:none;text-align:center;padding:24px 18px 20px;}',
      '#fed-pop-win-emoji{font-size:2.2rem;}',
      '#fed-pop-win-title{font-family:Georgia,serif;font-size:1.3rem;font-weight:700;color:#256d46;margin:8px 0 4px;}',
      '#fed-pop-win-sub{font-size:.85rem;color:#4a4238;line-height:1.5;}',
      '#fed-pop-streak{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#f3ecdd;border:1px solid #e5dcc9;border-radius:999px;padding:5px 14px;font-size:.8rem;font-weight:700;color:#2a2520;}',
      '@media (max-width:520px){#fed-pop-host{right:12px;left:12px;bottom:12px;width:auto;max-width:none;}}',
      '@media (prefers-reduced-motion:reduce){#fed-pop-card{transition:none;transform:none;opacity:1;}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'fed-pops-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pickType() {
    // Rotate fairly: whatever the brother did least recently gets a shot.
    var keys = ['work', 'read', 'pray'];
    return TYPES[pick(keys)];
  }

  function buildCard(type, minutes, line) {
    injectCSS();
    if (host) host.remove();
    host = document.createElement('div');
    host.id = 'fed-pop-host';
    host.innerHTML =
      '<div id="fed-pop-card" role="dialog" aria-live="polite" aria-label="Daily practice reminder">' +
        '<div id="fed-pop-bar" style="background:' + type.color + '"></div>' +
        '<div id="fed-pop-body">' +
          '<div id="fed-pop-head">' +
            '<span id="fed-pop-emoji">' + type.emoji + '</span>' +
            '<span id="fed-pop-title" style="color:' + type.color + '">' + type.label + '</span>' +
            '<button id="fed-pop-close" aria-label="Dismiss reminder">×</button>' +
          '</div>' +
          '<p id="fed-pop-text">' + line + '</p>' +
          '<p id="fed-pop-sub">5 minutes counts. 20 is a bonus. Streak today: <b>' + (streakCount() || 0) + '</b></p>' +
          '<div id="fed-pop-actions">' +
            '<button class="fed-pop-btn" id="fed-pop-go">I\'M ON IT</button>' +
            '<button class="fed-pop-btn" id="fed-pop-later">LATER</button>' +
          '</div>' +
        '</div>' +
        '<div id="fed-pop-timer">' +
          '<div id="fed-pop-doing" style="color:' + type.color + '">' + type.doing + '</div>' +
          '<div id="fed-pop-clock">00:00</div>' +
          '<div id="fed-pop-progress"><div id="fed-pop-fill" style="background:' + type.color + '"></div></div>' +
          '<div id="fed-pop-done-row">' +
            '<button class="fed-pop-btn" id="fed-pop-finish">I\'M DONE EARLY — COUNT IT</button>' +
          '</div>' +
        '</div>' +
        '<div id="fed-pop-win">' +
          '<div id="fed-pop-win-emoji">🔥</div>' +
          '<div id="fed-pop-win-title">That\'s a rep.</div>' +
          '<div id="fed-pop-win-sub">Every brother who stacks these daily becomes the one they ask for.</div>' +
          '<span id="fed-pop-streak">🔥 <span id="fed-pop-streak-n">1</span>-day streak</span>' +
          '<div id="fed-pop-done-row" style="display:flex"><button class="fed-pop-btn" id="fed-pop-ok" style="background:#256d46;color:#fffdf8;font-family:Georgia,serif;">BACK TO IT</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(host);

    var card = host.querySelector('#fed-pop-card');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { card.classList.add('on'); });
    });

    current = { type: type, minutes: minutes };
    countdownEnd = 0;

    host.querySelector('#fed-pop-close').addEventListener('click', dismiss);
    host.querySelector('#fed-pop-later').addEventListener('click', snooze);
    host.querySelector('#fed-pop-go').addEventListener('click', startPractice);
    host.querySelector('#fed-pop-finish').addEventListener('click', completePractice);
    var okBtn = host.querySelector('#fed-pop-ok');
    if (okBtn) okBtn.addEventListener('click', dismiss);
  }

  function fire(typeKey, minutes, line) {
    if (host) return; // one pop at a time
    var type = TYPES[typeKey] || pickType();
    var m = minutes || randInt(POP_MIN, POP_MAX);
    var text = line || pick(type.lines).replace('{m}', String(m));
    buildCard(type, m, text);
    bumpSession();
  }

  function dismiss() {
    if (tickId) { clearInterval(tickId); tickId = null; }
    if (!host) return;
    var card = host.querySelector('#fed-pop-card');
    card.classList.remove('on');
    setTimeout(function () { if (host) { host.remove(); host = null; } }, reduceMotion ? 0 : 320);
    scheduleNext();
  }

  function snooze() {
    if (host) { host.remove(); host = null; }
    timerId = setTimeout(function () { fire(); }, SNOOZE_MS);
  }

  function startPractice() {
    if (!host || !current) return;
    countdownEnd = Date.now() + current.minutes * 60 * 1000;
    host.querySelector('#fed-pop-body').style.display = 'none';
    host.querySelector('#fed-pop-timer').style.display = 'block';
    tick();
    tickId = setInterval(tick, 1000);
  }

  function tick() {
    if (!host || !countdownEnd) return;
    var msLeft = countdownEnd - Date.now();
    var clock = host.querySelector('#fed-pop-clock');
    var fill = host.querySelector('#fed-pop-fill');
    var total = current.minutes * 60 * 1000;
    if (msLeft <= 0) { completePractice(); return; }
    var s = Math.ceil(msLeft / 1000);
    clock.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    fill.style.width = (100 * (1 - msLeft / total)).toFixed(1) + '%';
  }

  function completePractice() {
    if (tickId) { clearInterval(tickId); tickId = null; }
    if (!host) return;
    creditPractice();
    host.querySelector('#fed-pop-body').style.display = 'none';
    host.querySelector('#fed-pop-timer').style.display = 'none';
    host.querySelector('#fed-pop-win').style.display = 'block';
    host.querySelector('#fed-pop-streak-n').textContent = String(streakCount());
    // auto-close the celebration after a few seconds so it never lingers
    setTimeout(function () { if (host) dismiss(); }, 6000);
  }

  function scheduleNext() {
    if (timerId) clearTimeout(timerId);
    if (sessionCount() >= MAX_PER_SESSION) return; // enough love for one visit
    var wait = NEXT_MIN_MS + Math.random() * NEXT_SPAN_MS;
    timerId = setTimeout(function () { fire(); }, wait);
  }

  function boot() {
    // ?pop=now → instant demo pop (test mode)
    var instant = /[?&]pop=now/.test(location.search);
    if (instant) {
      setTimeout(function () { fire(); }, 600);
      return;
    }
    var first = FIRST_MIN_MS + Math.random() * FIRST_SPAN_MS;
    timerId = setTimeout(function () { fire(); }, first);
  }

  // clean up leftover session counter from previous visits
  (function resetSession() {
    var k = STORE.session, v = lsGet(k);
    if (v) {
      // reset when a new day or a fresh page load without the flag
      lsSet(k, '0');
    }
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Esc closes an open pop
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && host) dismiss();
  });

  /* Public debug API */
  window.FEDPops = {
    fire: fire,
    state: function () {
      return {
        streak: streakCount(),
        lastCredited: lsGet(STORE.lastday),
        sessionPops: sessionCount(),
        open: !!host,
        current: current ? current.type.key + ' ' + current.minutes + 'm' : null
      };
    },
    stop: function () {
      if (timerId) clearTimeout(timerId);
      if (tickId) clearInterval(tickId);
      if (host) { host.remove(); host = null; }
    }
  };
})();
