# Session Handoff

## Current Verified Checkpoint

- Branch: `main`.
- Current commit: `7b48a3e` (`Render calendar from v8.4 day coverage`).
- `origin/main` matched local `main` before docs reconciliation.
- Working tree was clean before docs reconciliation.
- Stash exists and must not be applied unless explicitly requested: `stash@{0} WIP KPI cloud sync before master reconciliation`.
- v8.4 app import package remains authoritative.
- Calendar coverage from v8.4 was fixed and accepted.
- Current active product issue after docs reconciliation: Activity Prescription Display Layer.

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

1. Scope system consolidation.
2. Environment/data safety reconciliation.
3. Activity Prescription Display Layer.
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
- Data/sync/environment decisions added/updated: KPI cloud-sync stash noted and not applied; production/staging safety remains mandatory.
- Testing requirements added/updated: docs-only changes require status plus docs lint only if configured; app-code changes still require standard checks.
- Docs updated: `SESSION_HANDOFF.md`, `SCOPE.md`, `DOCUMENTATION_INVENTORY.md`, `AGENT_REPORT.md`, `AGENTS.md`, and dead-end stubs.
- Items intentionally deferred: Activity Prescription implementation, environment safety implementation, KPI cloud-sync stash, OvertimeAthlete source ingestion, agentic workflow tooling.
