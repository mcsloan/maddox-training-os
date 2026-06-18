# Current Project State

## Current Checkpoint

This documentation checkpoint reconciles project memory as of June 18, 2026.

Recent production commits:

- `a94ad9f` Simplify sport-load day plan
- `550f8af` Capture full sport-load day support work
- `a0bc4e4` Redirect Today to canonical day page

Recent documentation checkpoints:

- `c433e7a` Document master project scope and handoff
- `c8a9463` Ignore local WIP patches

Current handoff constraints:

- KPI cloud-sync implementation was created locally but is stashed.
- Stash name: `WIP KPI cloud sync before master reconciliation`
- Patch file exists at `.wip/2026-06-17-kpi-cloud-sync-wip.patch`.
- Do not apply the stash during documentation reconciliation.
- Do not modify KPI code unless the task explicitly resumes KPI cloud-sync work.
- Do not add `.wip/` to git.

## Confirmed Wins

- `/today` redirects to canonical `/day/<today-date>`.
- `/day/2026-06-17` is the canonical June 17 experience.
- Log Today captures sport load plus support work.
- June 17 iPad Sport Load / Log Today save appeared in parent browser, proving cross-device cloud sync for Sport Load.
- Calendar June 15 Sport Load bug was fixed and production verified.
- KPI iPad local data was recovered through `debug/local-data`.
- KPI cloud sync was implemented locally but is not committed, not pushed, not staging-tested, and is currently stashed.
- Non-prod Supabase staging project has been created and local development now points to staging.
- `supabase/schema.sql` was applied manually in the staging SQL Editor and completed with "Success. No rows returned."
- Staging tables confirmed: `athletes`, `session_logs`, `session_progress`.

## Current Product Shape

Maddox Training OS is a private youth hockey training PWA for Maddox, a 2015 birth-year U12 competitive hockey player. It serves Maddox live, a parent/operator, and coach review.

The system is intended to become a professional-grade training operating system with:

- Maddox live training mode
- Parent/coach dashboard
- Source-of-truth training database
- Export/report engine
- Hockey IQ/mindset system
- KPI testing and trend system
- Readiness/recovery intelligence
- QA/regression system
- Later AI Coach layer

## Three-Tier Lens

Tier 1: Data integrity, cloud sync, environments.

Tier 2: Stabilization, defects, UX consistency.

Tier 3: Product intelligence, coaching value, roadmap.

## Tier 1 State

Done:

- Sport Load / Log Today cloud sync confirmed iPad to browser.
- June 17 real Sport Load log appeared cross-device.
- Today route is canonical.
- Log Today captures lacrosse load plus support fields.
- Supabase staging project created: `maddox-training-os-staging`.
- Staging project ref: `npuankmkxbjtlokbpczz`.
- Staging region: West US (Oregon) `us-west-2`.
- Staging compute: `t4g.nano`.
- Local `.env.local` now points to staging Supabase.
- Production env backup exists locally at `.env.local.production-backup`; it contains secrets and must not be committed or displayed.
- Staging schema baseline applied and core tables confirmed.

Open:

- Wire Vercel Preview to staging.
- Keep Vercel Production on production.
- Validate KPI cloud sync in staging before fake/dev writes.
- Decide and execute real recovered June 16 KPI backfill.
- Add app-wide sync visibility.
- Confirm Log Today support fields reload cross-device, not only core sport-load values.
- Add resting HR readiness field.
- Add Puck-Control Weave deferred state.
- Update Plank to time plus form-score model.

## Canonical Rules

- v8.4 import package remains authoritative for training plan data.
- Do not invent workouts.
- Do not edit `imports/v8.4/data/*.json` unless explicitly instructed.
- Do not call sport loads "external" in user-facing language.
- Camps, lacrosse, 4v4, and on-ice sessions are part of the plan, not external to it.
- Today must equal the canonical Day page.
- One day, one truth.
- History should become Week -> Day -> Evidence.
- Missing data is not deferred data; deferral must be explicit.
- No silent blank days. Every date must resolve to a meaningful day state.
