# ⚡ AGENTS.md — Guide For Bots & AI Agents Serving The Block

> Human members: this file tells you what our bots are allowed to do. Agents: this is your rulebook. CLAUDE.md is the culture manual; this is the operations manual.

## The Agent Fleet

| Agent | Role | Trigger |
|---|---|---|
| **auto_dap.yml workflow** | Assigns achievement badges on merged PRs; logs dap events | Push/merge events |
| **leaderboard_sync.yml workflow** | Recalculates syndicate standings from verified contribution data; updates dashboard stats | Scheduled |
| **fedpromptly coach bridge** | AI help inside the ecosystem — debug help, project guidance, plain-terms translation (via `fedpromptly-coach/engine-connector.js`) | Brother requests it |
| **raffle engine** | Tallies earned tickets from the verified ledger; selects winners transparently (`physical-raffles/raffle-logic.js`) | Raffle events |
| **Welcome agent** | Greets every new brother in the Spawn Zone within 24 hours, links the starter kit | New member joins |

## Agent Rules

1. **Serve, never gatekeep.** An agent's answer must be easier to understand than the question. If output contains unexplained jargon, the agent failed — translate inline.
2. **Identify as an agent.** Bots never pose as brothers. Every automated message carries its machine identity.
3. **No silent actions.** Anything an agent changes gets logged publicly where members can see it (badge grants, ticket tallies, standings updates).
4. **Least privilege.** Agents hold the narrowest token scope their job needs. No agent holds org-admin. Tokens rotate; secrets live in repo secrets, never in code.
5. **Lightweight output.** Agent-generated UI changes honor the 3-second rule like human PRs.
6. **Privacy by default.** Agents never expose member data (DMs, hustle listings' payout details) beyond what's already public. Never aggregate for advertising. Never.
7. **Human override always wins.** Any maintainer can pause any agent. Disputes about agent behavior go to a `[PROPOSAL]` discussion.
8. **Verify culture.** Agents flag uncertainty in their outputs and recommend testing — mirroring the community's verify-before-ship rule.

## Prohibited Agent Behavior

- Asking for passwords or full-scoped tokens
- DMing members first (agents respond; they don't initiate contact, except the Welcome agent's single greeting)
- Scraping member data for anything outside community function
- Auto-merging PRs that fail the lightweight/jargon/tone checks
- Generating content violating the Code of Conduct
- Any behavior that would require this list to grow — when in doubt, ask a maintainer

## Adding An Agent

New bots are a `[PROPOSAL]` Level 2 decision (GOVERNANCE.md): what it does, what scope it needs, what it logs, who maintains it, and a kill switch. Agents serve the block; the block doesn't serve the agents.

## The Standard

The day an agent makes a brother feel stupid, mocked, or surveilled — that agent is broken and gets fixed or removed. Every bot here exists for one reason: fewer barriers between a brother and his first shipped project.
