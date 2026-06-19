# Session Handoff

## New-Chat Transition State

This handoff captures the current state for starting a new ChatGPT/Codex session without losing context.

Current constraints:

- Local branch is `fix/day-page-real-simplification`.
- Do not commit unless explicitly asked.
- Do not push unless explicitly asked.
- Do not edit `imports/v8.4/data/*.json` unless explicitly asked.
- Do not mutate Supabase data without explicit target confirmation.
- Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.
- Run `node scripts/preflight.mjs` before production-risk work.
- Run `node scripts/confirm-write-target.mjs` before cloud writes, deploys, or backfills.

## Recent Completed Commits On Main

- `b4891df` Add agentic workflow guardrails
- `a4ef7fa` Document day scenario propagation model
- `7b7d6fe` Recognize day evidence for sport loads and KPIs
- `35cd352` Group history by day evidence
- `376c7ba` Show day evidence status on day pages
- `4bdd674` Clarify day evidence and training work status
- `6a41683` Clean up day page reference details

## Current Corrective Work

- Safe Lane Fix 5 (`6a41683`) technically passed checks but visual QA rejected it as insufficient.
- Problem: duplicate Day page plan sections were hidden in expanders instead of being merged or removed.
- Corrective branch: `fix/day-page-real-simplification`.
- Corrective goal: real simplification, not hidden duplication.
- Current intended Day page structure for `/day/2026-06-16`:
  1. Hero/header
  2. Day Status / Evidence Summary
  3. Planned Execution Sequence as the main plan
  4. Parent cue / plan note if needed
  5. Concise equipment summary if useful
- KPI, block-code, recovery, shooting, and approved-video context should live inside relevant execution cards.
- Separate duplicate boxes for planned training work, KPI checkpoint plan, workout blocks, drill-level instructions, related videos, and recovery rule should not return unless they contain genuinely unique information.

## Current Production State

- KPI production backfill completed earlier.
- Seven June 16 KPI rows are visible in production `/kpis`.
- Calendar recognizes June 15 Sport Load logged.
- Dashboard recognizes `KPI Evidence = 7`.
- History is now `Program > Week > Day > Evidence`.
- June 14 legacy/test/unattached records are separated as `Needs review`.
- Day page shows `Partial` / KPI evidence / Training Work not logged.
- Day page reference cleanup was pushed in commit `6a41683`, but visual QA found it still too duplicative.
- The corrective simplification branch must be reviewed before treating Day page cleanup as accepted.

## Workflow Decisions

- Docs-only changes can go straight to `main`.
- Read-only UI/projection changes can go straight to `main` after:
  - `npm run lint`
  - `npm run build`
  - `node scripts/verify-v8.4-import.mjs`
  - `git diff --check`
- Preview is required for:
  - Supabase writes
  - KPI save/sync changes
  - schema/data model changes
  - logging flow changes
  - auth/env changes
  - large UI rewrites
  - anything that can corrupt or hide production data
- Playwright is paused until after the real Day page visual cleanup is accepted.
- Next major agentic improvement should be Playwright Smoke Harness v1.

## Current Next Recommended Task

1. Review the corrective branch `fix/day-page-real-simplification`.
2. Verify `/day/2026-06-16` visually.
3. Confirm the page no longer feels like a pile of boxes:
   - no duplicate `Perf Testing` chips
   - no separate duplicate `Planned training work` card
   - no duplicate KPI checkpoint expander
   - no duplicate workout-block expander
   - no tiny standalone recovery-rule box
   - planned KPI tests and recovery guidance live inside execution cards
4. If accepted, decide whether to commit/push this branch.
5. After acceptance, either continue Day page cleanup if visual issues remain or build Playwright Smoke Harness v1.

## Recommended Startup Reading

1. `AGENTS.md`
2. `docs/SESSION_HANDOFF.md`
3. `docs/NEXT_AGENT_TASK.md`
4. `docs/ENVIRONMENT_SAFETY.md`
5. Task-specific docs, especially `docs/DAY_SCENARIOS.md`, `docs/DATA_PROPAGATION_MATRIX.md`, and `docs/SCREEN_EXPECTATIONS.md` for day projection work.

## Scope Capture Check

- Defects added/updated: Safe Lane Fix 5 visually rejected as insufficient; corrective real simplification branch captured.
- Epics/features added/updated: Daily Plan / One Day Truth, History Week -> Day -> Evidence, Source Video / Instruction Coverage, QA automation roadmap.
- Product decisions added/updated: Day Status is primary truth; useful detail should be merged into Planned Execution Sequence instead of duplicated in expanders; History is day-first.
- Data/sync/environment decisions added/updated: Production writes require explicit target confirmation; preview required for risky write/sync/schema/logging work.
- Testing requirements added/updated: Standard checks remain required for read-only UI/projection work; visual QA for `/day/2026-06-16` is required before acceptance; Playwright Smoke Harness v1 remains paused.
- Docs updated: `SESSION_HANDOFF.md`, `NEXT_AGENT_TASK.md`, `AGENT_REPORT.md`.
- Items intentionally deferred: commit/push, Playwright Smoke Harness v1 implementation, explicit KPI deferment storage, deeper export integration.
