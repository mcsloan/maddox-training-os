# Session Handoff

## Current Handoff State

This is the handoff after KPI cloud-sync core staging validation, local main fast-forward merge, and production Supabase grant hardening.

Current constraints:

- Local branch is `main`.
- Local `main` includes `bec6008` (`Add KPI cloud sync with immutable delete`) after fast-forward merge.
- Local `main` is ahead of `origin/main` and has not been pushed.
- Do not commit unless explicitly asked.
- Do not push unless explicitly asked.
- Do not apply any additional stash or patch.
- Do not add `.wip/` to git.
- Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.

## Recent Production Checkpoint

- `a94ad9f` Simplify sport-load day plan
- `550f8af` Capture full sport-load day support work
- `a0bc4e4` Redirect Today to canonical day page

## Confirmed Production State

- `/today` redirects to canonical `/day/<today-date>`.
- `/day/2026-06-17` is the canonical June 17 experience.
- Log Today captures sport load plus support work.
- June 17 iPad Sport Load / Log Today save appeared in parent browser.
- Calendar June 15 Sport Load bug was fixed and production verified.
- KPI iPad local data was recovered via debug/local-data.

## Current WIP

- KPI cloud sync implementation is committed locally in `bec6008` on `main`.
- Stash name: `WIP KPI cloud sync before master reconciliation`
- Patch file: `.wip/2026-06-17-kpi-cloud-sync-wip.patch`
- Local commit exists; not pushed to `origin/main`.
- Core staging save/read/delete path has passed manual testing.

## Vercel Deployment State

- `staging/kpi-cloud-sync-test` produced a Vercel Preview deployment at `bec6008`.
- `origin/main` currently maps to Vercel Production at `9b44228`.
- Pushing local `main` will likely trigger Vercel Production from `bec6008` or later.
- Production app has not yet been deployed or tested with `bec6008`.

## Supabase Staging Baseline

- Non-prod Supabase staging project created.
- Project name: `maddox-training-os-staging`
- Project ref: `npuankmkxbjtlokbpczz`
- Region: West US (Oregon) `us-west-2`
- Compute: `t4g.nano`
- Local production env backup exists at `.env.local.production-backup`.
- Backup contains secrets; do not display or commit its contents.
- Local `.env.local` now points to staging Supabase.
- `supabase/schema.sql` applied manually in Supabase staging SQL Editor.
- Staging SQL result: "Success. No rows returned."
- Confirmed staging tables: `athletes`, `session_logs`, `session_progress`.
- Existing code paths upsert Maddox athlete automatically in `externalLoadRepository`, `cloudSessionProgressRepository`, and `completedSessionRepository`.

Production Supabase remains untouched. Vercel production remains untouched.

## Production Supabase Safety Checks

Passed after `bec6008`:

- RLS enabled on `athletes`, `session_logs`, and `session_progress`.
- Policies scoped to Maddox athlete ID.
- No DELETE policies on `athletes`, `session_logs`, or `session_progress`.
- `session_logs` has SELECT and INSERT policies only.
- `session_progress` has SELECT, INSERT, and UPDATE policies.
- Production anon grants aligned:
  - `athletes`: SELECT, INSERT, UPDATE
  - `session_logs`: SELECT, INSERT
  - `session_progress`: SELECT, INSERT, UPDATE
- Production anon has no DELETE, TRUNCATE, REFERENCES, or TRIGGER grants.
- Production anon has no UPDATE grant on `session_logs`.

## KPI Cloud Sync Staging Results

Passed:

- `/kpis` loaded against staging with no visible entries initially.
- Pre-grant save failed cloud write with `permission denied for table session_logs (42501)` but preserved local backup.
- Non-destructive anon grants were applied manually in staging.
- 10-yard sprint staging test KPI saved with `bestResult = 8.88`.
- Staging readback confirmed `source = kpi_page`, `kind = standalone_kpi_result`, `kpiId = kpi-10-yard`, and `bestResult = 8.88`.
- Incognito confirmed `8.88` was visible from cloud and `9.99` local-only browser backup was not visible.
- Immutable tombstone delete fix was implemented after physical delete failed as expected under immutable `session_logs`.
- Browser retest removed `8.88` from UI.
- Staging readback confirmed original result remains and a `standalone_kpi_result_deleted` tombstone exists with `deletedResultId = kpi-10-yard-1781758488979` and `reason = user_deleted`.
- Incognito confirmed `8.88` and the tombstone are not visible and no error appears.

Remaining:

- Validate remaining KPI scenarios if required: Puck-Control Weave deferred state, Plank Quality time plus form score, broader duplicate/update behavior, offline/local fallback, and more cross-device checks.
- Do not mark production app testing passed yet.
- Do not backfill June 16 real KPI values yet.
- Do not remove the local-only `9.99` staging browser backup entry.

## Recommended Next Session

Start by reading:

1. `AGENTS.md`
2. `docs/CURRENT_PROJECT_STATE.md`
3. `docs/NEXT_BUILD_PRIORITIES.md`
4. The specific doc for the task area, such as `docs/DATA_SYNC_STRATEGY.md` for sync work.

If resuming KPI cloud sync:

1. Confirm whether the next action is docs commit/check, push `main`, or more staging validation.
2. Do not apply additional stash/patch.
3. If pushing `main`, treat it as likely triggering Production.
4. After Production deploy, run production smoke tests without fake/test records.
5. Update defect log and testing status if scope/status changes.
6. Do not backfill June 16 production KPI values until explicitly planned.
