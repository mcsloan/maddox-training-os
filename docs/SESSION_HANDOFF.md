# Session Handoff

## Current Handoff State

This is the handoff after the Supabase staging milestone documentation update.

Current constraints:

- Documentation-only checkpoint.
- Do not commit unless explicitly asked.
- Do not push unless explicitly asked.
- KPI cloud-sync WIP is stashed.
- Do not apply the stash until staging work resumes.
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

- KPI cloud sync implementation exists only in stash/patch.
- Stash name: `WIP KPI cloud sync before master reconciliation`
- Patch file: `.wip/2026-06-17-kpi-cloud-sync-wip.patch`
- Not committed.
- Not pushed.
- Not staging-tested.

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

## Recommended Next Session

Start by reading:

1. `AGENTS.md`
2. `docs/CURRENT_PROJECT_STATE.md`
3. `docs/NEXT_BUILD_PRIORITIES.md`
4. The specific doc for the task area, such as `docs/DATA_SYNC_STRATEGY.md` for sync work.

If resuming KPI cloud sync:

1. Confirm local env still points to staging without displaying secrets.
2. Write the staging KPI cloud-sync test plan before applying WIP.
3. Apply stash only after environment and test plan are safe.
4. Run staging cloud-write tests.
5. Update defect log and testing status.
6. Do not backfill June 16 production KPI values until explicitly planned.
