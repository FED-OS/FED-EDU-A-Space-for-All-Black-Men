#!/usr/bin/env python3
"""
FED-EDU ↔ FED-OS Hardware Profiler
Plain terms: reads your machine and tells you — in plain talk — what this
computer can actually do for your tech journey. No guesses, no jargon dump.
A brother with a 2012 laptop deserves to know EXACTLY what that machine can
build (spoiler: everything on this block), not some YouTube verdict about
"obsolete hardware."

Part of the fed-os-bridge: the files that connect FED-EDU (the knowledge)
to FED-OS (the founder's operating system, pre-installed on raffle machines).

Usage:
    python3 hardware_profiler.py            # full report
    python3 hardware_profiler.py --short    # one-line verdict

Zero external dependencies — standard library only (ADR-001 applies to
system scripts too: if it can't run on the scrap metal, it doesn't ship).
"""

import json
import os
import platform
import shutil
import sys

# ---- The block's plain-talk capability table --------------------------------
# Verdicts are floors, not ceilings: every tier below "FULL BUILD" still runs
# the ENTIRE FED-EDU curriculum. The difference is comfort, not capability.

RAM_TIERS = [
    (16, "FULL BUILD RIG — run everything: editors, local servers, multiple projects. Charge full rates with this machine."),
    (8,  "CERTIFIED BUILDER — comfortable on everything the block teaches. 8GB handles real client work."),
    (4,  "TRUE FED-EDU TIER — the sweet spot. Every course, every blueprint, every guide runs here. You are NOT under-equipped."),
    (2,  "LIGHT THE TORCH TIER — text-first work, one tab at a time, browser-based editing (GitHub's web editor). Enough to reach your first paid site."),
    (0,  "PHONE-FIRST TIER — this machine is a terminal for library sessions. The phone carries the journey; this box is backup."),
]

STORAGE_TIERS = [
    (100, "Room for everything — projects, media, archives."),
    (50, "Plenty for years of code. Media needs occasional cleaning."),
    (20, "Workable — keep projects lean (which the block demands anyway)."),
    (0, "Tight — one project at a time, clean up after each ship."),
]


def get_ram_gb():
    """Read total RAM without external libraries. Linux first (FED-OS), then cross-platform fallbacks."""
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemTotal:"):
                    kb = int(line.split()[1])
                    return round(kb / 1024 / 1024, 1)
    except (OSError, ValueError):
        pass
    try:
        # macOS / some BSDs
        out = os.popen("sysctl -n hw.memsize").read().strip()
        if out.isdigit():
            return round(int(out) / 1024 / 1024 / 1024, 1)
    except Exception:
        pass
    try:
        # Windows (rare on the block, but brothers come from everywhere)
        import ctypes
        class MEMORYSTATUSEX(ctypes.Structure):
            _fields_ = [("dwLength", ctypes.c_ulong), ("dwMemoryLoad", ctypes.c_ulong),
                        ("ullTotalPhys", ctypes.c_ulonglong), ("ullAvailPhys", ctypes.c_ulonglong),
                        ("ullTotalPageFile", ctypes.c_ulonglong), ("ullAvailPageFile", ctypes.c_ulonglong),
                        ("ullTotalVirtual", ctypes.c_ulonglong), ("ullAvailVirtual", ctypes.c_ulonglong),
                        ("ullAvailExtendedVirtual", ctypes.c_ulonglong)]
        stat = MEMORYSTATUSEX()
        stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
        ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
        return round(stat.ullTotalPhys / 1024 / 1024 / 1024, 1)
    except Exception:
        return None


def get_disk_free_gb():
    """Free disk space on the current drive."""
    try:
        usage = shutil.disk_usage(os.getcwd())
        return round(usage.free / 1024 / 1024 / 1024, 1)
    except OSError:
        return None


def tiered(table, value):
    """Walk a tier table top-down; return the first tier the value clears."""
    for threshold, verdict in table:
        if value is not None and value >= threshold:
            return verdict
    return table[-1][1]


def profile():
    ram = get_ram_gb()
    disk = get_disk_free_gb()
    return {
        "system": platform.system() or "unknown",
        "machine": platform.machine() or "unknown",
        "python": platform.python_version() or "unknown",
        "ram_gb": ram,
        "disk_free_gb": disk,
        "online_tools_available": {
            # The tools the block's workflow assumes; presence, not versions —
            # a missing tool is a fixable fact, not a verdict on the machine.
            "git": shutil.which("git") is not None,
            "python3": shutil.which("python3") is not None,
            "node": shutil.which("node") is not None,
        },
    }


def report(short=False):
    p = profile()
    ram_verdict = tiered(RAM_TIERS, p["ram_gb"])
    disk_verdict = tiered(STORAGE_TIERS, p["disk_free_gb"])

    if short:
        ram = p["ram_gb"] if p["ram_gb"] is not None else "?"
        print(f"FED-EDU VERDICT: {ram}GB RAM — {ram_verdict.split(' — ')[0].split(' — ')[0]}")
        return

    lines = [
        "=" * 58,
        "  FED-EDU HARDWARE PROFILE — THE PLAIN-TALK VERDICT",
        "=" * 58,
        "",
        f"  System:      {p['system']} ({p['machine']})",
        f"  RAM:         {str(p['ram_gb']) + ' GB' if p['ram_gb'] else 'unreadable'}",
        f"  Free disk:   {str(p['disk_free_gb']) + ' GB' if p['disk_free_gb'] else 'unreadable'}",
        "",
        "  TOOLS ON THIS MACHINE:",
        f"    git      {'✅ present' if p['online_tools_available']['git'] else '⚠️  missing — install git (see INSTALL.md)'}",
        f"    python3  {'✅ present' if p['online_tools_available']['python3'] else '⚠️  missing — but browser-based work covers everything'}",
        f"    node     {'✅ present' if p['online_tools_available']['node'] else '— optional on this block; vanilla JS runs in the browser, not on your machine'}",
        "",
        "=" * 58,
        f"  RAM VERDICT: {ram_verdict}",
        f"  STORAGE:     {disk_verdict}",
        "=" * 58,
        "",
        "  THE TRUTH THIS REPORT TELLS:",
        "  Every tier above can complete every course on this block.",
        "  The scrap-PC brother with EasyTether is not under-equipped —",
        "  he's the exact brother this whole operation was built around.",
        "",
        "  Missing tools are an afternoon of fixing, not a wall.",
        "  INSTALL.md → Path B. The block has your back. 🏁",
        "=" * 58,
    ]
    print("\n".join(lines))


if __name__ == "__main__":
    report(short="--short" in sys.argv)
