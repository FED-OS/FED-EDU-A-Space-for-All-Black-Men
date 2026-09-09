#!/usr/bin/env python3
"""
bg-remover.py — Media FX Clipper, PC Rung 2
============================================
Made by FED-EDU for brothers shipping hustle graphics from a
refurb tower or tethered PC.

WHAT THIS DOES
  Takes a photo shot on a plain background (wall, paper, poster board),
  wipes that background to transparent, saves a PNG you can drop on
  any thumbnail, logo, or product flyer.

  This is NOT magic AI background removal. It's a corner-sample flood
  wipe. It works great when your background is plain-ish. It fails on
  busy backgrounds. That's the honest truth — use a plain sheet.

INSTALL ONCE (your PC rung)
  python3 -m pip install pillow

  If that errors on Windows, try:
    py -m pip install pillow

RUN IT
  python3 bg-remover.py input.jpg output.png
  python3 bg-remover.py product.png clean.png --tolerance 40

TOLERANCE (the one dial that matters)
  Lower (10-20)  = strict. Keeps more edge detail, may leave background chunks.
  Higher (40-80) = aggressive. Wipes more background, may eat soft edges.
  Default 30 works for most phone shots against a wall.

STILL WORKING FOR YOUR TICKETS
  This counts as Rung 2 work on the Media FX Clipper blueprint.
  PR the before/after pair to the blueprint repo: 15 raffle tickets.
  Screenshot the run in your terminal for your receipts folder.
"""

import sys
import argparse
from collections import deque

try:
    from PIL import Image
except ImportError:
    print("Pillow is not installed yet. Run this ONCE:")
    print("  python3 -m pip install pillow")
    print("Then run me again. That install is a 30-second one-time thing.")
    sys.exit(1)


def rgb_distance(c1, c2):
    """Plain-talk: how far apart are two colors, 0 to 443ish.
    Same number math as the JS version in index.html — one pattern,
    two languages. Learn it once, use it everywhere."""
    return ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2) ** 0.5


def sample_background(img, points):
    """Grab the average color from the image edges.
    We take several samples so one shadow doesn't poison the batch."""
    samples = []
    w, h = img.size
    px = img.load()
    for x, y in points:
        x = max(0, min(w-1, x))
        y = max(0, min(h-1, y))
        samples.append(px[x, y][:3])
    r = sum(s[0] for s in samples) // len(samples)
    g = sum(s[1] for s in samples) // len(samples)
    b = sum(s[2] for s in samples) // len(samples)
    return (r, g, b)


def wipe_background(img, tolerance=30):
    """Flood wipe from the four edges inward.

    Why flood and not 'wipe everything close to the average'?
    Because your subject might WEAR the background color. Flood only
    spreads through CONNECTED pixels, so it stops at your subject's
    outline even if the color matches. That's the whole trick.

    Why BFS with a deque and not recursion?
    Python recursion blows up on big images (stack limit). BFS with a
    queue handles a 4000px photo without breaking a sweat.
    """
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    # Sample points: spread across all four edges, not just corners,
    # because lighting gradients mean the top-left and bottom-right
    # of the same wall can be different colors. Averaging smooths that.
    edge_points = []
    step_x = max(1, w // 10)
    step_y = max(1, h // 10)
    for x in range(0, w, step_x):
        edge_points.append((x, 0))
        edge_points.append((x, h-1))
    for y in range(0, h, step_y):
        edge_points.append((0, y))
        edge_points.append((w-1, y))

    bg = sample_background(img, edge_points)
    tol = tolerance * 3  # scale so the slider numbers feel like the web version

    visited = bytearray(w * h)  # 1 byte per pixel, way lighter than a set
    q = deque()

    # Seed the queue with every edge pixel
    for x in range(w):
        for y in (0, h-1):
            q.append((x, y))
    for y in range(h):
        for x in (0, w-1):
            q.append((x, y))

    wiped = 0
    while q:
        x, y = q.popleft()
        i = y * w + x
        if visited[i]:
            continue
        visited[i] = 1
        c = px[x, y]
        if c[3] == 0:
            # already transparent (PNG with existing alpha) — walk through it
            wiped += 1
            px[x, y] = (c[0], c[1], c[2], 0)
        elif rgb_distance(c[:3], bg) <= tol:
            px[x, y] = (c[0], c[1], c[2], 0)
            wiped += 1
            # spread to neighbors — this is the flood part
            if x > 0:     q.append((x-1, y))
            if x < w-1:   q.append((x+1, y))
            if y > 0:     q.append((x, y-1))
            if y < h-1:   q.append((x, y+1))

    return img, wiped, bg


def soften_edges(img, passes=1):
    """One softening pass: any transparent pixel bordering a solid pixel
    gets its solid neighbor's color at partial alpha. Cheap feathering —
    kills the jagged 'sticker cut' look without a blur library."""
    for _ in range(passes):
        w, h = img.size
        px = img.load()
        changes = []
        for y in range(h):
            for x in range(w):
                if px[x, y][3] != 0:
                    continue
                # look at neighbors for a solid color to borrow
                for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        n = px[nx, ny]
                        if n[3] > 200:
                            changes.append((x, y, (n[0], n[1], n[2], 110)))
                            break
        for x, y, c in changes:
            px[x, y] = c
        if not changes:
            break
    return img


def main():
    ap = argparse.ArgumentParser(
        description="FED-EDU bg-remover: wipe plain backgrounds to transparent. Plain-talk tool, honest limits.")
    ap.add_argument("input", help="input image (jpg/png/webp)")
    ap.add_argument("output", help="output PNG (alpha needs PNG — jpg can't hold it)")
    ap.add_argument("--tolerance", type=int, default=30,
                    help="color distance allowed before a pixel counts as background (default 30, try 40 for dirty walls)")
    ap.add_argument("--no-soften", action="store_true",
                    help="skip edge softening if you want hard pixel edges")
    args = ap.parse_args()

    try:
        img = Image.open(args.input)
    except FileNotFoundError:
        print(f"Can't find {args.input}. Check the spelling, brother.")
        print("Tip: drag the file into the terminal and the path types itself.")
        sys.exit(1)
    except Exception as e:
        print(f"Couldn't open that file: {e}")
        sys.exit(1)

    w, h = img.size
    print(f"Loaded {args.input} ({w}x{h})")

    img, wiped, bg = wipe_background(img, args.tolerance)
    total = w * h
    pct = round(100 * wiped / total, 1)
    print(f"Background sampled as RGB{bg}")
    print(f"Wiped {wiped:,} of {total:,} pixels ({pct}%) at tolerance {args.tolerance}")

    if wiped == 0:
        print("WARNING: nothing got wiped. Your background probably isn't plain,")
        print("or the tolerance is too low. Bump it: --tolerance 60")
        print("If the subject and the background are the same color, reshoot on a")
        print("different sheet. The tool isn't broken — the shot is fighting it.")

    if not args.no_soften:
        img = soften_edges(img, passes=1)
        print("Edges softened one pass.")

    if not args.output.lower().endswith(".png"):
        args.output += ".png"
        print(f"Renamed output to {args.output} — JPG can't hold transparency.")

    img.save(args.output)
    print(f"Saved {args.output}")
    print("RECEIPTS: screenshot this terminal run + drop the before/after in your PR.")
    print("That's 15 raffle tickets on the Media FX Clipper blueprint rung 2.")


if __name__ == "__main__":
    main()
