# Session Handoff

## Current Verified Checkpoint

- Branch: `main`.
- Local HEAD: `3ebc157` (`docs(scope): record environment safety reconciliation`).
- Local `main` is ahead of `origin/main` by 2 commits.
- Local docs commits not pushed yet:
  - `3dadea0` (`build(scope): harden documentation architecture and scope controls`)
  - `3ebc157` (`docs(scope): record environment safety reconciliation`)
- Historical pre-hardening / current production baseline: `7b48a3e` (`Render calendar from v8.4 day coverage`).
- Vercel production is expected to remain on `v0.1.0 · 7b48a3e · production` until the local docs commits are pushed and deployed.
- Local browser/build badge may show stale running-server context and is not the repo source of truth.
- Git state from Terminal 2 is authoritative for this checkpoint.
- Working tree was clean before this checkpoint wording fix.
- Stash exists and must not be applied unless explicitly requested: `stash@{0} WIP KPI cloud sync before master reconciliation`.
- v8.4 app import package remains authoritative.
- Calendar coverage from v8.4 was fixed and accepted.
- No app code work has started after the docs hardening checkpoint.
- Next action: Mike review / push approval for the local docs checkpoint.

## Current Constraints

- Do not commit unless explicitly asked.
- Do not push unless explicitly asked.
- Do not edit `imports/v8.4/data/*.json` unless explicitly asked.
- Do not mutate Supabase data without explicit target confirmation.
- Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.
- Do not apply the KPI cloud-sync stash during unrelated tasks.
- Run `node scripts/preflight.mjs` before production-risk work.
- Run `node scripts/confirm-write-target.mjs` before cloud writes, deploys, or backfills.

## Verified Product State

- `/today` routes to canonical Day flow.
- v8.4 covers all 84 dates from `2026-06-15` through `2026-09-06`.
- Calendar renders from v8.4 date coverage.
- Calendar Week 1 includes June 15 through June 21.
- June 20 direct Day URL works and shows `Game-speed skill and shooting volume.`
- Friday June 19 is usable enough for training.
- Sport Load logging and Training Work logging remain separate.
- v8.4 source JSON has not been edited for accepted Calendar coverage.

## Documentation Reconciliation State

- `docs/SCOPE.md` is now the canonical owner for active scope, priority, sequencing, roadmap, defect summary, KPI roadmap, training/source epics, source-review items, and next-task planning.
- `docs/SCOPE.md` is the only active scope source.
- `docs/SESSION_HANDOFF.md` owns current checkpoint/handoff only.
- `docs/DOCUMENTATION_INVENTORY.md` owns documentation inventory only.
- `docs/AGENT_REPORT.md` owns latest agent report.
- Former scope-like docs are dead-end stubs; do not read them for current scope.

## Current Next Work Sequence

See `docs/SCOPE.md` for the Active Execution Queue and Current Sprint / Next Codex Task.

Current sequence starts with:

1. Mike review / push approval for the local docs checkpoint.
2. Activity Prescription Display Layer.
3. Test fixture discovery / comment audit if Mike chooses to run those before app code.
4. Future-day readiness audit from June 23 onward.

## Known Caution Areas

- KPI cloud-sync/backfill docs contain historical and conflicting claims. Treat cloud sync/backfill as scope-review until explicitly verified in the current checkpoint.
- OvertimeAthlete and Gemini recommendations are scope-review inputs only.
- Unconfirmed schedule/camp claims must be verified before any plan change.
- Playwright, Husky, VS Code agent tools, and package installs are future scope only.

## Recommended Startup Reading

1. `AGENTS.md`
2. `docs/SESSION_HANDOFF.md`
3. `docs/SCOPE.md`
4. `docs/DOCUMENTATION_INVENTORY.md`
5. Task-specific docs/files.

## Scope Capture Check

- Defects added/updated: documentation drift and Calendar date coverage status reconciled.
- Epics/features added/updated: Activity Prescription Display Layer confirmed as next implementation work; source-ingestion and safety review captured as future scope.
- Product decisions added/updated: recovery days are intentional, not blank; v8.4 remains authoritative; Gemini/OTA are source-review inputs only.
- Data/sync/environment decisions added/updated: environment safety reconciliation completed for the inspection pass; KPI cloud-sync stash noted and not applied; production/staging safety remains mandatory.
- Testing requirements added/updated: docs-only changes require status plus docs lint only if configured; app-code changes still require standard checks.
- Docs updated: `SESSION_HANDOFF.md`, `SCOPE.md`, `DOCUMENTATION_INVENTORY.md`, `AGENT_REPORT.md`, `AGENTS.md`, and dead-end stubs.
- Items intentionally deferred: Activity Prescription implementation, KPI cloud-sync stash, OvertimeAthlete source ingestion, agentic workflow tooling, push/deploy until Mike approval.
