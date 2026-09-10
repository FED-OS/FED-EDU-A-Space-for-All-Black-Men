#!/usr/bin/env bash
# FED-EDU ↔ FED-OS Tether Monitor
# Plain terms: watches your EasyTether / USB internet connection. When the tether
# drops (it drops — phones sleep, cables jiggle), this script notices, logs it,
# and tells you plainly instead of letting you lose 20 minutes of work to a
# dead connection you didn't know was dead.
#
# Usage (on a FED-OS machine or any Linux box):
#   chmod +x tether_monitor.sh
#   ./tether_monitor.sh
#
# Stop it: Ctrl+C (it cleans up after itself).
# Zero dependencies: ping + curl + standard shell. That's the FED-EDU way.

CHECK_HOST="github.com"          # what we ping — GitHub is the block's heartbeat
LOG_FILE="$HOME/.fed-edu-tether.log"
CHECK_INTERVAL=30                # seconds between checks — gentle on metered data
QUIET_MODE=0                     # QUIET_MODE=1 prints only state CHANGES

# One ping = ~60 bytes. Checking every 30s = ~170KB/month. Negligible even on 2GB plans.
# (This math is why the block survives on metered connections — we count bytes like money.)

last_state="unknown"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_connection() {
  # ping first (cheap); curl as backup (some networks block ping but pass http)
  if ping -c 1 -W 4 "$CHECK_HOST" > /dev/null 2>&1; then
    return 0
  fi
  if curl -s --max-time 8 -o /dev/null "https://$CHECK_HOST"; then
    return 0
  fi
  return 1
}

trap 'log "monitor stopped by user"; exit 0' INT TERM

log "tether monitor started — watching $CHECK_HOST every ${CHECK_INTERVAL}s"

while true; do
  if check_connection; then
    state="up"
  else
    state="down"
  fi

  if [ "$state" != "$last_state" ]; then
    if [ "$state" = "down" ]; then
      log "⛔ CONNECTION LOST — check the cable, the phone's USB debugging, or your data."
      echo ""
      echo "  ┌─────────────────────────────────────────────┐"
      echo "  │  ⛔ TETHER DOWN                            │"
      echo "  │                                             │"
      echo "  │  Run the checklist before panicking:        │"
      echo "  │  1. Cable still plugged both ends?          │"
      echo "  │  2. Phone USB debugging still on?           │"
      echo "  │  3. Phone itself has signal/data?           │"
      echo "  │  4. EasyTether tray icon → reconnect        │"
      echo "  │                                             │"
      echo "  │  (work saved locally is safe — git          │"
      echo "  │  doesn't need internet to commit)           │"
      echo "  └─────────────────────────────────────────────┘"
      echo ""
    else
      log "✅ CONNECTION RESTORED — the block is back. Unpushed commits? git push when ready."
      echo "✅ TETHER BACK UP — resume the mission."
    fi
    last_state="$state"
  elif [ "$QUIET_MODE" -eq 0 ]; then
    log "connection: $state"
  fi

  sleep "$CHECK_INTERVAL"
done
