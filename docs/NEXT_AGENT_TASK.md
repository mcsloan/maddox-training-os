# Next Agent Task

## Purpose

Use this file as the handoff brief for the next Codex/agent session. Keep it short, explicit, and updated before switching contexts.

## Current Recommended Task

Start a new chat.

Then:

1. Continue from branch `fix/day-page-real-simplification`.
2. Verify `/day/2026-06-16` visually after the corrective simplification.
3. Confirm the page still shows:
   - `Partial`
   - KPI evidence recorded: 7 of 8 planned KPI results
   - Training Work evidence: not logged
4. Confirm Safe Lane Fix 5's failed pattern is gone:
   - no duplicate `Perf Testing` chips
   - no separate duplicate `Planned training work` card
   - no duplicate KPI checkpoint expander
   - no duplicate workout-block expander
   - no tiny standalone recovery-rule box
   - KPI, block, recovery, shooting, equipment, and approved-video context is merged into the main Day page flow
5. If accepted, decide whether to commit/push this corrective branch.
6. Then choose one path:
   - Continue Day page cleanup if visual issues remain.
   - Build Playwright Smoke Harness v1 to reduce manual smoke testing.

## Current State Summary

- KPI production backfill is complete.
- Seven June 16 standalone KPI rows are visible in production `/kpis`.
- Calendar recognizes June 15 Sport Load logged.
- Dashboard recognizes `KPI Evidence = 7`.
- History is now `Program > Week > Day > Evidence`.
- June 14 legacy/test/unattached records are separated as `Needs review`.
- Day page shows `Partial` / KPI evidence / Training Work not logged.
- Day page reference cleanup was pushed in commit `6a41683`, but visual QA rejected it as insufficient because duplicate sections were hidden in expanders instead of merged or removed.
- Current corrective branch is `fix/day-page-real-simplification`.
- Corrective requirement: real simplification, not hidden duplication.

## Workflow Decisions

- Docs-only changes can go straight to `main`.
- Read-only UI/projection changes can go straight to `main` after lint/build/v8.4 import verification/diff-check.
- Preview is required for Supabase writes, KPI save/sync changes, schema/data model changes, logging flow changes, auth/env changes, large UI rewrites, or anything that can corrupt/hide production data.
- Playwright is paused until after the Day page real simplification is accepted.
- Next major agentic improvement should be Playwright Smoke Harness v1.

## Guardrails

- Do not edit `imports/v8.4/data/*.json` unless explicitly requested.
- Do not mutate Supabase without confirming target and action.
- Do not rely on `.env.local` without printing the target via `env-whoami`.
- Do not commit or push unless explicitly asked.
- Do not expose secrets.

## Preflight

Before production-risk work:

```bash
node scripts/preflight.mjs
```

Before any cloud write, deploy, or backfill:

```bash
node scripts/confirm-write-target.mjs --target <staging|production> --action "<plain English action>"
```
