#!/usr/bin/env python3
"""
trend-scraper.py — FED-EDU Sandbox Blueprint 04, Rung 3
========================================================
Made by FED-EDU for brothers titling clips with receipts instead
of guesses.

WHAT THIS DOES
  Pulls what's trending RIGHT NOW from public, key-free sources,
  finds the words that repeat across trending titles, and mixes
  those words into title candidates for YOUR clip.

  Then it prints a scorecard. You pick a title with data behind it,
  paste the terminal output in your PR, ship the clip.

TWO SOURCES, ZERO API KEYS
  1. YouTube trending page   — the public HTML page. We parse titles
     out with a regex, no API key, no OAuth, no cost.
  2. Reddit public JSON      — any subreddit's front page serves
     .json with no key at low volume (their rules, not a hack).

  No pip installs. Pure standard library. Runs on a school library
  terminal or a tethered laptop. That's the point.

RUN IT
  python3 trend-scraper.py                          # default: games niche
  python3 trend-scraper.py --niche games
  python3 trend-scraper.py --niche music --sub hiphop
  python3 trend-scraper.py --seed "my 40 kill squad clip"

HOW TO READ THE OUTPUT
  HOT WORDS  = words appearing across multiple trending titles.
  TITLE DRAFTS = your seed (or niche default) mixed with hot words,
  in patterns that actually get clicked: number + benefit + hook.
  VOLUME    = how many titles each word rode in on. 1 title = noise.
  3+ titles = a real wave. Ride waves, not noise.

HONEST LIMITS (read these)
  - Trending pages are moving targets. HTML layout changes. If a
    source comes back empty, the tool says so instead of pretending.
  - Scraping politely matters: one request, a real User-Agent, a
    timeout, and sleep between sources. Don't loop this every 30
    seconds — run it once before you title, not on a cron.
  - This is NOT a view guarantee. It's a receipts machine: it puts
    your title choice on data instead of a vibe. Views still come
    from the clip being good. We don't sell dreams here.

TICKETS
  PR with: your shipped clip + the scraper output pasted in the PR
  body + the title you picked and why = 15 raffle tickets, Rung 3.
"""

import argparse
import json
import re
import sys
import time
import urllib.request
import urllib.error
from html import unescape

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FED-EDU-trend-scraper/1.0 "
    "(educational community tool; single fetch; contact: security@fedpromptly.com)"
)

# words too generic to count as "hot" — structure words, not hooks
STOPWORDS = {
    "the", "a", "an", "of", "to", "and", "in", "on", "for", "with", "at",
    "by", "from", "up", "about", "into", "over", "after", "is", "are",
    "was", "were", "be", "been", "being", "have", "has", "had", "do",
    "does", "did", "will", "would", "could", "should", "may", "might",
    "new", "vs", "official", "video", "full", "part", "ep", "episode",
    "you", "your", "my", "our", "their", "this", "that", "these", "it",
    "its", "i", "he", "she", "they", "we", "me", "him", "her", "them",
    "how", "what", "why", "when", "who", "all", "out", "get", "got",
    "no", "not", "so", "if", "as", "or", "but", "can", "just", "like",
    "one", "two", "best", "top", "ft", "feat", "official", "audio",
}

NICHE_DEFAULTS = {
    "games": {
        "seed": "my best ranked clip",
        "subs": ["gaming", "LivestreamFail"],
        "patterns": [
            "{N} {SEED} — {HOT1} took the whole lobby",
            "{SEED} with {HOT1} (nobody expected this)",
            "{HOT1} {SEED} but every rank up is {HOT2}",
        ],
    },
    "music": {
        "seed": "my new track",
        "subs": ["hiphop", "music"],
        "patterns": [
            "{HOT1} type beat with {SEED}",
            "{SEED} — the {HOT1} wave nobody is on yet",
            "why {HOT1} is eating and {SEED} is next up",
        ],
    },
    "tech": {
        "seed": "this app I built",
        "subs": ["programming", "webdev"],
        "patterns": [
            "built {SEED} in a week ({HOT1} stack)",
            "{SEED} — {HOT1} explained plain, no gatekeeping",
            "{HOT1} is changing and {SEED} proves it",
        ],
    },
}


def fetch(url, timeout=10):
    """One polite request. Real UA, hard timeout, honest errors."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        print(f"  [source] HTTP {e.code} from {url[:60]}...")
        return None
    except (urllib.error.URLError, TimeoutError) as e:
        print(f"  [source] couldn't reach {url[:60]}... ({e})")
        return None


def scrape_youtube_trending():
    """YouTube trending page -> list of video titles.

    The page embeds titles as the accessible alt/aria text of
    thumbnails AND inside ytInitialData JSON. We grab the JSON block
    (more stable than the DOM) and walk it for 'title' objects. If
    the layout changed, we fall back to the <title> meta regex, and
    if BOTH fail we return empty and say so. No pretending.
    """
    html = fetch("https://www.youtube.com/feed/trending")
    if not html:
        return []
    m = re.search(r"var ytInitialData\s*=\s*(\{.*?\});", html, re.S)
    titles = []
    if m:
        try:
            data = json.loads(m.group(1))
            text = json.dumps(data)  # flatten and regex the JSON itself
            for t in re.findall(r'"title"\s*:\s*\{"runs"\s*:\s*\[\{"text"\s*:\s*"([^"]{4,120})"', text):
                titles.append(unescape(t))
        except json.JSONDecodeError:
            pass
    if not titles:
        # fallback: aria-label thumbnails ("Title by Channel 4:22")
        for t in re.findall(r'aria-label="([^"]{4,120}) by [^"]+ \d+:\d+', html):
            titles.append(unescape(t))
    # de-dupe, keep order
    seen = set()
    out = []
    for t in titles:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return out[:40]


def scrape_subreddit(sub):
    """Subreddit front page -> post titles. Public JSON, no key.

    Reddit's rules let low-volume unauthenticated JSON reads happen.
    One fetch, once per run. This is reading the front page of a
    website, the same as opening it in a browser — politely.
    """
    url = f"https://www.reddit.com/r/{sub}/hot.json?limit=40"
    raw = fetch(url)
    if not raw:
        return []
    try:
        data = json.loads(raw)
        posts = data.get("data", {}).get("children", [])
        return [unescape(p["data"].get("title", "")) for p in posts if p["data"].get("title")]
    except (json.JSONDecodeError, KeyError, TypeError):
        print(f"  [source] reddit JSON came back strange for r/{sub} — skipping.")
        return []


def hot_words(titles, min_volume=3):
    """Words appearing across MULTIPLE titles = a wave, not noise.

    min_volume=3 means a word counts only if 3+ separate trending
    titles carry it. One title is a coin flip; three is a pattern.
    """
    counts = {}
    for title in titles:
        # lowercase, strip punctuation, split
        words = re.findall(r"[a-z0-9']+", title.lower())
        for w in set(words):  # set: count each word once PER title
            if len(w) > 2 and w not in STOPWORDS:
                counts[w] = counts.get(w, 0) + 1
    waves = [(w, c) for w, c in counts.items() if c >= min_volume]
    waves.sort(key=lambda x: (-x[1], x[0]))
    return waves


def build_drafts(seed, waves, patterns):
    """Mix seed + hot words into title patterns that get clicked.

    Pattern rules from the receipts (every major 'title study' lands
    on the same three): a number, a benefit, a hook word. We inject
    hot words where the hook would go. The rest is your seed.
    """
    hots = [w for w, _ in waves]
    drafts = []
    for pattern in patterns:
        d = pattern
        d = d.replace("{SEED}", seed)
        d = d.replace("{HOT1}", hots[0] if hots else "the wave")
        d = d.replace("{HOT2}", hots[1] if len(hots) > 1 else "everything")
        d = d.replace("{N}", str(2 + len(hots) * 3))  # seeded number, swap for yours
        drafts.append(d)
    return drafts


def main():
    ap = argparse.ArgumentParser(
        description="FED-EDU trend-scraper: title your clips with receipts, not guesses. "
                    "Public sources only, no API keys, no pip installs.")
    ap.add_argument("--niche", default="games", choices=list(NICHE_DEFAULTS.keys()),
                    help="games | music | tech (default games)")
    ap.add_argument("--sub", default=None,
                    help="extra subreddit to pull (e.g. hiphop) beyond the niche defaults")
    ap.add_argument("--seed", default=None,
                    help="what YOUR clip is about, a few words (default: niche seed)")
    ap.add_argument("--min-volume", type=int, default=3,
                    help="how many titles a word must ride to count as hot (default 3)")
    args = ap.parse_args()

    niche = NICHE_DEFAULTS[args.niche]
    seed = (args.seed or niche["seed"]).strip().lower()
    subs = list(niche["subs"])
    if args.sub:
        subs.append(args.sub)

    print("=" * 58)
    print(" FED-EDU TREND SCRAPER — blueprint 04, rung 3")
    print("=" * 58)
    print(f" niche: {args.niche} · seed: \"{seed}\"")
    print()

    all_titles = []

    print("[1/2] youtube trending...")
    yt = scrape_youtube_trending()
    print(f"  pulled {len(yt)} titles" + ("" if yt else " — source came back empty, being honest about it"))
    all_titles.extend(yt)

    print("[2/2] reddit front pages...")
    for sub in subs:
        titles = scrape_subreddit(sub)
        print(f"  r/{sub}: {len(titles)} titles")
        all_titles.extend(titles)
        time.sleep(2)  # polite gap between sources — not a hammer

    print()
    if len(all_titles) < 10:
        print(" NOT ENOUGH DATA. Both sources thin or blocked right now.")
        print(" Honest call: don't title on this run. Try again later, or")
        print(" use your niche pattern with your own words. Receipts beat")
        print(" vibes — and 'no data' is also a receipt. Screenshot it.")
        sys.exit(0)

    waves = hot_words(all_titles, args.min_volume)
    if not waves:
        print(f" No word hit {args.min_volume}+ titles. Trending is scattered right now.")
        print(" Lower the bar: --min-volume 2")
        print(f" Still wrote drafts off the niche pattern for you below.")
    else:
        print(f" HOT WORDS (rode in on {args.min_volume}+ titles each):")
        for w, c in waves[:12]:
            bar = "#" * min(c, 20)
            print(f"   {w:<14} {c:>2} {bar}")

    print()
    drafts = build_drafts(seed, waves, niche["patterns"])
    print(" TITLE DRAFTS (pick one, swap the number for your real one):")
    for i, d in enumerate(drafts, 1):
        print(f"   {i}. {d}")

    print()
    print(" RECEIPTS CHECK — before you PR:")
    print("   [ ] pasted this output in the PR body")
    print("   [ ] named the title you picked and WHY (which hot word, which volume)")
    print("   [ ] clip is uploaded and the title is live")
    print(" That's 15 raffle tickets, rung 3. Title with data. Ship the clip.")


if __name__ == "__main__":
    main()
