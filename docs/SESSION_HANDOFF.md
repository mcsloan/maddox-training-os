# Session Handoff

## Current Verified Checkpoint

- Branch: `main`.
- Latest pushed commit: `402edc8` (`test(qa): add Playwright chrome proof of life`).
- Repo state after push: local `main` == `origin/main`.
- `docs/SCOPE.md` remains the only canonical active scope source.
- v8.4 app import package remains authoritative.
- Playwright is installed as a dev dependency.
- No bundled Playwright browser install was used.
- Installed Google Chrome channel launched successfully on macOS Catalina `10.15.8`.
- Read-only production Playwright proof-of-life passed:
  - `npx playwright test e2e/activity-presentation-proof.spec.ts --project=chrome`
- No accepted app code work is pending from this checkpoint.
- DEF-028 remains open/not fixed because the completed-session/read-only surface was not exercised in the passing proof-of-life run.

## Playwright Proof-Of-Life Result

- `/day/2026-06-19` loaded in production.
- Day title assertion passed: `Acceleration and accurate shooting`.
- Badge assertion passed: `9964e52` or `a3a41f4`.
- `/session/session-2026-06-19` loaded in production.
- Previous Attempt gate was not visible during this run.
- `Reopen / Edit Latest Completed Session` was not visible.
- `View Latest Completed Session` was not visible.
- Therefore the completed-session surface was not exercised and DEF-028 was not reproduced during this run.
- No Supabase/data mutation was performed.
- The test did not click Finish Session, Save, Submit, Start Fresh Attempt, or any logging/submission action.

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

- `/today` routes to the canonical Day flow.
- v8.4 covers all 84 dates from `2026-06-15` through `2026-09-06`.
- Calendar renders from v8.4 date coverage; Week 1 includes June 15 through June 21.
- June 19 Day + active/edit Session presentation parity was implemented and pushed before this checkpoint.
- June 20 direct Day URL works and shows `Game-speed skill and shooting volume.`
- Sport Load logging and Training Work logging remain separate.
- Playwright proof-of-life validates production Day + Session route loading, but did not exercise completed-session/read-only state.
- DEF-028 remains open for completed-session display/projection repair.
- v8.4 source JSON has not been edited for accepted Calendar or Activity Presentation work.

## Documentation Reconciliation State

- `docs/SCOPE.md` is the canonical owner for active scope, priority, sequencing, roadmap, defect summary, KPI roadmap, training/source epics, source-review items, and next-task planning.
- `docs/SESSION_HANDOFF.md` owns current checkpoint/handoff only.
- `docs/DOCUMENTATION_INVENTORY.md` owns documentation inventory only.
- `docs/AGENT_REPORT.md` owns the latest agent report.
- Former scope-like docs are dead-end stubs; do not read them for current scope.

## Current Next Work Sequence

See `docs/SCOPE.md` for the Active Execution Queue and Current Sprint / Next Codex Task.

Recommended next lane:

1. `DEF-028` completed-session display/projection inspect/fix.
2. Display/projection repair only.
3. Do not mutate saved session records.
4. No Supabase writes.
5. No backfill.
6. No delete.
7. No migration.

## Known Caution Areas

- DEF-028 must be fixed through display/projection, not by rewriting saved completed-session records.
- Production Supabase contains real Maddox data; no writes without explicit target confirmation.
- KPI cloud-sync/backfill remains scope-review unless explicitly verified in the current checkpoint.
- OvertimeAthlete and Gemini recommendations are source-review inputs only.
- Unconfirmed schedule/camp claims must be verified before any plan change.
- Playwright is proven locally with installed Chrome channel, but broader Playwright rollout and CI remain future scope.
- Bundled Playwright browser installs remain avoided unless explicitly approved.

## Recommended Startup Reading

1. `AGENTS.md`
2. `docs/SESSION_HANDOFF.md`
3. `docs/SCOPE.md`
4. `docs/DOCUMENTATION_INVENTORY.md`
5. Task-specific docs/files.

## Scope Capture Check

- Defects added/updated: `DEF-028` remains open/not fixed.
- Epics/features added/updated: `QA-AUTOMATION-002` proof-of-life is completed.
- Product decisions added/updated: completed-session stale title must be fixed through display/projection, not saved-data mutation.
- Data/sync/environment decisions added/updated: no Supabase mutation, no backfill, no delete, no migration for DEF-028.
- Testing requirements added/updated: Playwright installed Chrome channel works locally on Catalina; use proof-of-life as a base for targeted browser regression.
- Docs updated: `SESSION_HANDOFF.md`.
- Items intentionally deferred: DEF-028 implementation, product acceptance of completed-session repair, any broad Playwright rollout, CI, Supabase/data changes.
