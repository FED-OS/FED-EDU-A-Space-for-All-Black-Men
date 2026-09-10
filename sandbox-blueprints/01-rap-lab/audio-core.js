/*
  FED-EDU :: sandbox-blueprints/01-rap-lab :: audio-core.js
  What this is: the engine under the Rap Lab UI. Syllable counting, rhyme
  matching, verse analysis. All vanilla JS, zero dependencies (ADR-001).

  READ THIS FILE AFTER YOU USE THE LAB. That's the whole design:
  every feature you feel in the UI is a function you can read here.
  The lab is a bridge — from "I already have this skill" (bars) to
  "I can read the code that does it" (strings, arrays, loops, data).

  CONTENTS:
    1. RHYME_FAMILIES — the data (a word dictionary organized by ending sound)
    2. syllableCount() — string processing + regex
    3. lastWord() — string splitting
    4. findRhymes() — data lookup
    5. analyzeBar() — composing the above into the readout
    6. analyzeVerse() — arrays + loops (a verse IS an array of bars)
    7. UI wiring — the part that touches the page (keep this section LAST)
*/

(function () {
  "use strict";

  /* ============ 1. RHYME_FAMILIES — the data ============ */

  /*
    This is the lab's dictionary — words grouped by ending sound.
    In real-world terms: this is the "data structure" concept.
    A rhyme family is an array (a shelf) of words that share a sound.
    Adding your own words here is your first rung-2 contribution.

    Rule of the data: every word is lowercase, no punctuation.
    The lab strips punctuation before looking anything up.
  */
  var RHYME_FAMILIES = {
    // -ACK family (hard attack sounds)
    "ack": ["back", "black", "crack", "hack", "jack", "pack", "sack", "smack", "track", "whack", "attack", "stack", "quack", "snack", "wrap"],
    // -IGHT family (the night grind)
    "ight": ["night", "light", "right", "sight", "tight", "flight", "might", "fight", "bright", "white", "height", "insight", "spotlight"],
    // -AME family
    "ame": ["game", "name", "fame", "same", "flame", "frame", "aim", "claim", "blame", "shame", "tame", "proclaim"],
    // -INE family
    "ine": ["line", "mine", "nine", "sign", "design", "align", "divine", "shine", "spine", "vine", "climb", "dime", "time", "prime", "grind", "mind", "find", "kind", "blind", "behind"],
    // -EED family
    "eed": ["need", "seed", "greed", "speed", "feed", "bleed", "proceed", "succeed", "indeed", "stampede", "breed", "freed"],
    // -OUL/-OOL family
    "ool": ["cool", "school", "tool", "rule", "fuel", "cruel", "duel", "jewel", "pool", "fool", "stool", "whirlpool"],
    // -OWN family
    "own": ["own", "known", "grown", "shown", "thrown", "crown", "down", "town", "clown", "brown", "downtown", "renown"],
    // -AY family
    "ay": ["day", "way", "say", "play", "stay", "pay", "may", "clay", "delay", "display", "betray", "away", "sway", "obey"],
    // -EE family
    "ee": ["free", "see", "be", "key", "me", "we", "tree", "three", "agree", "decree", "refugee", "employee", "guarantee", "jubilee"],
    // -EATH/-ETH family
    "eath": ["breath", "death", "deaf", "leaf"],
    // -OLD family
    "old": ["gold", "sold", "told", "hold", "bold", "cold", "fold", "controlled", "enrolled", "rolled", "mold", "threshold", "household"],
    // -ART family
    "art": ["heart", "art", "part", "start", "smart", "chart", "apart", "depart", "restart", "blackheart"],
    // -EAT family
    "eat": ["eat", "beat", "heat", "meat", "street", "sweet", "defeat", "compete", "repeat", "treat", "unseat", "discreet", "elite", "complete"],
    // -ICE family
    "ice": ["ice", "nice", "price", "dice", "twice", "sacrifice", "device", "precise", "advice", "suffice", "concise", "paradise"],
    // -ECK/-ACK short family
    "eck": ["check", "neck", "deck", "wreck", "spec", "tech", "flex", "next", "text", "respect", "connect", "collect", "direct", "protect", "detect", "reflect", "project"],
    // -IP family
    "ip": ["chip", "drip", "flip", "grip", "hip", "lip", "rip", "sip", "skip", "tip", "trip", "zip", "clip", "equip", "script", "transcript"],
    // -UN family
    "un": ["run", "sun", "fun", "gun", "one", "won", "done", "none", "someone", "anyone", "begun", "outdone"],
    // -EAM family
    "eam": ["team", "dream", "stream", "cream", "beam", "scheme", "theme", "extreme", "supreme", "self-esteem"],
    // -ESS family
    "ess": ["bless", "press", "stress", "less", "guess", "dress", "success", "progress", "process", "address", "express", "impress"],
    // -UST family
    "ust": ["trust", "must", "just", "dust", "bust", "adjust", "discuss", "disgust"],
    // -UTH family
    "uth": ["truth", "youth", "proof", "roof"],
    // -AZ/-AS family
    "az": ["jazz", "has", "was", "because", "applause", "pause", "cause", "laws", "flaws", "draws", "paws"],
    // -IM family
    "im": ["him", "sim", "gym", "trim", "brim", "slim", "swim", "whim"],
    // -ILL family
    "ill": ["will", "still", "skill", "chill", "fill", "hill", "kill", "mill", "deal", "real", "feel", "steel", "appeal", "reveal", "seal", "ideal"],
    // -AIN family
    "ain": ["rain", "pain", "train", "brain", "chain", "gain", "main", "plain", "plane", "explain", "remain", "sustain", "maintain", "entertain", "ascertain"],
    // -EAK family
    "eak": ["break", "shake", "take", "make", "fake", "cake", "lake", "sake", "wake", "mistake", "awake", "brake", "quake", "ache", "stake", "undertake", "overtake", "forsake", "heartbreak"]
  };

  /* ============ 2. syllableCount() — string processing ============ */

  /*
    Counts syllables in a word using the vowel-group method:
    a syllable = a group of vowels (a,e,i,o,u) spoken as one beat.
    "stacking" → s-t-A-ck-i-ng → 2 vowel groups → 2 syllables. Correct.

    Is it perfect? No. English is lawless ("fire" reads as 1 or 2).
    Is it right ~90% of the time? Yes. Good enough to flag bars that
    run long — which is the actual job. Perfect is the enemy of shipped.
  */
  function syllableCount(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) { return 0; }
    var groups = word.match(/[aeiouy]+/g);
    var count = groups ? groups.length : 0;
    // silent-e correction: "time" → t-i-m-e → vowel groups i,e = 2, but spoken = 1
    if (count > 1 && word.slice(-1) === "e" && !/[aeiouy]/.test(word.slice(-2, -1))) {
      count--;
    }
    // -es / -ed corrections for common endings
    if (/[bcdfgklmnprstvz]ed$/.test(word) || /[scx]es$/.test(word)) { count--; }
    return Math.max(count, 1);
  }

  /* ============ 3. lastWord() — string splitting ============ */

  /*
    Pulls the last word off a bar. A bar is a string; words are the
    pieces between spaces. split(" ") turns the string into an array
    of words. Pop the last one. Strip its punctuation.
    This is the "array" concept in its smallest honest form.
  */
  function lastWord(bar) {
    var words = bar.trim().split(/\s+/);
    if (!words.length) { return ""; }
    return words[words.length - 1].toLowerCase().replace(/[^a-z]/g, "");
  }

  /* ============ 4. findRhymes() — data lookup ============ */

  /*
    Finds the rhyme family a word belongs to by matching its ending.
    Try the last 4 letters, then 3, then 2 — most rhyme sounds live
    in the last 2-4 letters. If a family matches, return the family
    minus the word itself (you don't rhyme a word with itself).
  */
  function findRhymes(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) { return null; }
    var families = [];
    for (var ending in RHYME_FAMILIES) {
      if (!RHYME_FAMILIES.hasOwnProperty(ending)) { continue; }
      var member = RHYME_FAMILIES[ending];
      if (member.indexOf(word) !== -1 || word.slice(-ending.length) === ending) {
        for (var i = 0; i < member.length; i++) {
          if (member[i] !== word) { families.push(member[i]); }
        }
      }
    }
    // de-dupe
    var seen = {}; var out = [];
    for (var j = 0; j < families.length; j++) {
      if (!seen[families[j]]) { seen[families[j]] = 1; out.push(families[j]); }
    }
    return out.length ? out : null;
  }

  /* ============ 5. analyzeBar() — composing the readout ============ */

  function analyzeBar(bar) {
    var words = bar.trim().split(/\s+/).filter(Boolean);
    var syl = 0;
    for (var i = 0; i < words.length; i++) { syl += syllableCount(words[i]); }
    return {
      words: words.length,
      syllables: syl,
      lastWord: lastWord(bar),
      rhymes: findRhymes(lastWord(bar))
    };
  }

  /* ============ 6. analyzeVerse() — arrays + loops ============ */

  /*
    A verse is an array of bars. The report is a loop over that array.
    Every "per-bar" stat you see in the UI comes from this function.
    The "flow flags" (bars over SYLLABLE_CEILING) are the lab's way of
    saying "this bar runs long" — you decide if it's a flaw or a style.
  */
  var SYLLABLE_CEILING = 18;   // most flows sit under this per bar

  function analyzeVerse(text) {
    var bars = text.split("\n").map(function (b) { return b.trim(); }).filter(Boolean);
    if (!bars.length) { return null; }
    var report = { bars: bars.length, totalSyllables: 0, longest: 0, shortest: 999, flagged: [], perBar: [] };
    for (var i = 0; i < bars.length; i++) {
      var a = analyzeBar(bars[i]);
      report.perBar.push(a);
      report.totalSyllables += a.syllables;
      if (a.syllables > report.longest) { report.longest = a.syllables; }
      if (a.syllables < report.shortest) { report.shortest = a.syllables; }
      if (a.syllables > SYLLABLE_CEILING) {
        report.flagged.push({ bar: i + 1, syllables: a.syllables, text: bars[i] });
      }
    }
    report.avgSyllables = Math.round(report.totalSyllables / bars.length);
    return report;
  }

  /* ============ 7. UI wiring — touches the page (keep LAST) ============ */

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* --- Bar readout (live as you type, debounced for 3G) --- */
  var barTimer = null;
  el("bar-input").addEventListener("input", function () {
    clearTimeout(barTimer);
    barTimer = setTimeout(function () {
      var val = el("bar-input").value.trim();
      if (!val) { el("stats").innerHTML = ""; el("rhymes").innerHTML = ""; return; }
      var a = analyzeBar(val);
      el("stats").innerHTML =
        '<div class="stat"><b>' + a.words + '</b>words</div>' +
        '<div class="stat"><b>' + a.syllables + '</b>syllables</div>' +
        '<div class="stat"><b>' + esc(a.lastWord || "—") + '</b>anchor word</div>';
      if (a.rhymes) {
        var html = '<p style="margin:10px 0 4px 0">Rhymes for <b>' + esc(a.lastWord) + '</b> (family: same ending sound):</p><div class="rhyme-list">';
        for (var i = 0; i < a.rhymes.length; i++) {
          html += '<span class="word">' + esc(a.rhymes[i]) + "</span>";
        }
        el("rhymes").innerHTML = html + "</div>";
      } else {
        el("rhymes").innerHTML = '<p style="margin-top:10px">No family match for "' + esc(a.lastWord) + '" — that ending isn\'t in the dictionary yet. <b>Adding it is rung-2 work (see the rungs card below)</b> — you found a real data gap.</p>';
      }
      saveDrafts();
    }, 250);
  });

  /* --- Verse analysis --- */
  el("btn-analyze").addEventListener("click", function () {
    var text = el("verse-input").value.trim();
    if (!text) {
      el("verse-report").innerHTML = "<p>Write or paste a verse first — one bar per line.</p>";
      return;
    }
    var r = analyzeVerse(text);
    var html =
      '<div class="stat-row">' +
      '<div class="stat"><b>' + r.bars + '</b>bars</div>' +
      '<div class="stat"><b>' + r.totalSyllables + '</b>total syllables</div>' +
      '<div class="stat"><b>' + r.avgSyllables + '</b>avg per bar</div>' +
      '<div class="stat"><b>' + r.longest + '</b>longest bar</div>' +
      '</div>';
    if (r.flagged.length) {
      html += '<p style="margin:12px 0 4px 0"><b>Flow flags</b> (over ' + SYLLABLE_CEILING + " syllables — long bars, your call if it's style or sprawl):</p>";
      for (var i = 0; i < r.flagged.length; i++) {
        html += '<p class="muted">Bar ' + r.flagged[i].bar + " (" + r.flagged[i].syllables + "): " + esc(r.flagged[i].text) + "</p>";
      }
    } else {
      html += '<p style="margin-top:10px">No flow flags — every bar under the ceiling. Tight.</p>';
    }
    el("verse-report").innerHTML = html;
    saveDrafts();
  });

  /* --- Clear / data-saver --- */
  el("btn-clear").addEventListener("click", function () {
    if (confirm("Clear both boxes? Saved drafts go too.")) {
      el("verse-input").value = "";
      el("verse-report").innerHTML = "";
      saveDrafts();
    }
  });
  el("btn-saver").addEventListener("click", function () {
    document.documentElement.classList.toggle("data-saver");
  });

  /* --- Draft save (local only — SECURITY.md: nothing leaves the device) --- */
  var BAR_KEY = "raplab-bar", VERSE_KEY = "raplab-verse";
  function saveDrafts() {
    try {
      localStorage.setItem(BAR_KEY, el("bar-input").value);
      localStorage.setItem(VERSE_KEY, el("verse-input").value);
    } catch (e) { /* private mode — drafts live for this session only */ }
  }
  function loadDrafts() {
    try {
      var b = localStorage.getItem(BAR_KEY), v = localStorage.getItem(VERSE_KEY);
      if (b) { el("bar-input").value = b; }
      if (v) { el("verse-input").value = v; }
    } catch (e) {}
  }

  loadDrafts();
})();
