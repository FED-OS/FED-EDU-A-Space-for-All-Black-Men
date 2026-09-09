-- ============================================================
-- FED-EDU :: sandbox-blueprints/02-football-stats :: schema.sql
-- What this is: the same league table as the UI, in SQL — the
-- language real databases speak. The rung-2 move: run this in
-- Supabase (the block's stat-tracker backend — ADR-006) and the
-- league goes from "saves on my phone" to "live for the whole crew."
--
-- HOW TO USE THIS FILE (the full walkthrough: urban-dictionary/
-- terms/database_supabase.md — the barbershop notebook analogy):
--   1. supabase.com → New project (free tier is enough for a league)
--   2. SQL Editor → paste this whole file → Run
--   3. Tables appear. Your league now has a real home.
--   4. Point db-bridge.js's load/save at the Supabase URL — same
--      functions, new address. The UI never knows the difference.
--
-- READ THE SQL LIKE SENTENCES. Every statement is a sentence:
--   CREATE TABLE players (...)  =  "Build a table called players
--   with these columns."
--   SELECT * FROM players       =  "Show me everything from players."
--   You already think in these queries at halftime. SQL writes it down.
-- ============================================================

-- ------------------------------------------------------------
-- 1. THE PLAYERS TABLE — the same row shape as makePlayer() in
--    db-bridge.js. Same keys, new home. JavaScript keys are camelCase
--    by habit; SQL columns are snake_case by convention. Both are
--    just naming styles — the data is identical.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS players (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,              -- "Mahomes" — every row needs a name
  team        TEXT,                       -- "KC" — optional, the UI shows "—" when empty
  pass_yards  INTEGER DEFAULT 0,          -- whole numbers only; yards aren't fractions
  rush_yards  INTEGER DEFAULT 0,
  touchdowns  INTEGER DEFAULT 0,
  total_yards INTEGER GENERATED ALWAYS AS (pass_yards + rush_yards) STORED,
  -- ^ a computed column: the database does the math for you, every
  --   time, forever. The same "total" the UI computes in makePlayer().
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. THE SEASON TABLE — because a league has years, and last
--    season's numbers shouldn't mix with this season's race.
--    This is the "version" concept: same table, scoped by season.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seasons (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label     TEXT NOT NULL,                -- "2026 season", "Fall league"
  is_active BOOLEAN DEFAULT FALSE,        -- one season active at a time
  UNIQUE(label)                           -- no duplicate season names
);

-- ------------------------------------------------------------
-- 3. THE LINK — which player rows belong to which season.
--    This is a "foreign key" — a column that points at another
--    table's row. It's how databases say "these two things belong
--    together." The receipt that ties a stat line to a season.
-- ------------------------------------------------------------
ALTER TABLE players
  ADD COLUMN IF NOT EXISTS season_id BIGINT REFERENCES seasons(id) ON DELETE SET NULL;
-- ^ ON DELETE SET NULL: if a season gets deleted, its players stay —
--   they just lose the season tag. History survives cleanup. That's
--   the block's receipts instinct, in database form.

-- ------------------------------------------------------------
-- 4. THE QUERIES YOU'LL ACTUALLY RUN — the halftime arguments,
--    written down. Each one is a sentence. Say it out loud.
-- ------------------------------------------------------------

-- "Show me the whole league, best first" (the leaderboard view):
--   SELECT * FROM players ORDER BY total_yards DESC, touchdowns DESC;

-- "Top 5 by total yards" (the leaderboard's front page):
--   SELECT name, team, total_yards, touchdowns
--   FROM players ORDER BY total_yards DESC LIMIT 5;

-- "This season only" (scope the race to the active season):
--   SELECT p.* FROM players p
--   JOIN seasons s ON p.season_id = s.id
--   WHERE s.is_active = TRUE
--   ORDER BY p.total_yards DESC;

-- "The leaderboard job, in SQL" (what leaderboard_sync.yml does
--  nightly from the GitHub API — same pattern, different data source):
--   SELECT name, COUNT(*) as pr_count FROM contributions
--   GROUP BY name ORDER BY pr_count DESC;

-- ------------------------------------------------------------
-- 5. SECURITY NOTES — the row-level rules (SECURITY.md, database edition)
--
--    Supabase default: new tables are locked to the project owner.
--    The rung-2 league wants read-for-all, write-for-members:
--
--    ALTER TABLE players ENABLE ROW LEVEL SECURITY;
--
--    CREATE POLICY "league read" ON players
--      FOR SELECT USING (true);                -- anyone can see the stats
--
--    CREATE POLICY "league write" ON players
--      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
--      -- ^ only signed-in brothers add players. Public stats,
--      --   member-write. Same spirit as the block's Six Rules:
--      --   the porch is public, the tools are earned.
--
--    NEVER store tokens, DMs, or personal data in this table.
--    Stats are stats. The block's privacy rules travel with the data.
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- 6. THE TEACHING RECEIPT — what this file proves:
--    The fantasy league you've run in your head (or in a group chat
--    spreadsheet) is a database application. You've been doing data
--    engineering since your first sideline argument. The schema is
--    just the receipt, written down.
--
--    Your Move: run this schema on the free tier, load three players
--    through the UI's export → import path, and screenshot the table.
--    That's guide-level work — 10 raffle tickets
--    (pinned: how-to-earn-raffle-tickets.md).
-- ------------------------------------------------------------
