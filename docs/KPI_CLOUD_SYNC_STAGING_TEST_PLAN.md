# KPI Cloud Sync Staging Test Plan

## Purpose

Validate standalone KPI cloud sync safely in Supabase staging before any production deploy, production data write, or recovered June 16 KPI backfill.

This plan does not mark KPI cloud sync complete. It defines the validation path to run after the current KPI cloud-sync WIP is applied locally.

## Live Staging Result

Core standalone KPI cloud sync path passed in staging after adding non-destructive anon API grants.

Verified:

- `/kpis` loaded against staging with no visible entries initially.
- First KPI save before API grants saved a local backup but cloud failed with `permission denied for table session_logs (42501)`.
- Staging SQL grants were applied manually:
  - `grant usage on schema public to anon;`
  - `grant select, insert, update on table public.athletes to anon;`
  - `grant select, insert on table public.session_logs to anon;`
  - `grant select, insert, update on table public.session_progress to anon;`
- After grants, a 10-yard sprint staging test KPI saved with `bestResult = 8.88` and note `STAGING CLOUD TEST AFTER GRANTS - DELETE LATER`.
- Supabase staging readback confirmed `source = kpi_page`, `kind = standalone_kpi_result`, `kpiId = kpi-10-yard`, and `bestResult = 8.88`.
- Incognito confirmed `8.88` was visible from cloud and a separate `9.99` local-only browser backup was not visible.
- Initial delete failed because `session_logs` is immutable and has no delete policy.
- Tombstone delete fix was implemented.
- Browser retest deleted `8.88` from UI.
- Supabase staging readback confirmed the original `standalone_kpi_result` row remains and a new `standalone_kpi_result_deleted` tombstone row exists.
- Tombstone fields confirmed: `deletedResultId = kpi-10-yard-1781758488979`, `reason = user_deleted`.
- Incognito confirmed `8.88` is not visible, tombstone is not visible, and no error appears.

Not yet complete:

- Production deploy readiness.
- June 16 real KPI backfill.
- Full scenario coverage for Puck-Control Weave deferred state, Plank Quality time plus form score, and broader app-wide sync visibility.

## Preconditions

- Repo is clean at `c352af8` or later before applying WIP.
- Local `.env.local` points to Supabase staging.
- Staging Supabase project exists:
  - name: `maddox-training-os-staging`
  - ref: `npuankmkxbjtlokbpczz`
  - region: West US (Oregon) `us-west-2`
- Staging schema has been applied.
- Staging tables are confirmed: `athletes`, `session_logs`, `session_progress`.
- Non-destructive anon API grants are present for staging/fresh environments with automatic table exposure off.
- Production Supabase remains untouched.
- Vercel Production remains untouched.
- No secrets are displayed in terminal, docs, screenshots, or reports.
- `.env.local.production-backup` exists locally and must not be displayed or committed.

## Guardrails

- No production Supabase changes.
- No Vercel production deploy.
- No destructive SQL.
- No delete grants or delete policies for `session_logs`.
- No clearing iPad/browser storage until data is backed up.
- No service-role key in client env.
- Do not edit `imports/v8.4/data/*.json`.
- Do not backfill recovered June 16 KPI values during this staging test.
- Do not commit KPI cloud-sync code until staging validation passes.
- Do not add `.wip/` to git.

## WIP Application Options

Preferred:

- Apply the git stash to a local working branch only.
- Stash name: `WIP KPI cloud sync before master reconciliation`

Fallback:

- Apply `.wip/2026-06-17-kpi-cloud-sync-wip.patch` only if the stash cannot be used.
- Do not add or commit `.wip/`.

After applying WIP:

- Confirm only expected KPI cloud-sync files changed.
- Do not modify unrelated app code.
- Do not modify env files.

## Staging Verification Flow

1. Confirm env target is staging without displaying secrets.
   - Confirm staging URL/ref only: `npuankmkxbjtlokbpczz`.
   - Do not print keys.
2. Apply WIP using the preferred stash option.
3. Run:
   - `npm run lint`
   - `npm run build`
   - `node scripts/verify-v8.4-import.mjs`
4. Run the local app against staging.
5. Record staging row counts before test writes:
   - `athletes`
   - `session_logs`
   - `session_progress`
6. Create a test standalone KPI entry in the KPI page.
7. Confirm the expected KPI cloud record appears in staging Supabase.
   - Expected table is likely `session_logs`, following the existing snapshot pattern.
   - Expected source should match the WIP implementation, likely `kpi_page`.
8. Reload the KPI page and confirm the test KPI still appears.
9. Use another browser profile/device if possible and confirm the KPI result hydrates from staging.
10. Confirm the KPI appears across relevant app screens where KPI summaries are expected.
11. Confirm local fallback still works if cloud write fails.
12. Record staging row counts after test writes.
13. Confirm production row counts/data were not changed.

## Test Scenarios

### Scenario 1 - Baseline KPI Completed

Create one complete standalone KPI result in staging.

Pass signals:

- The result saves locally.
- A cloud record appears in staging.
- Reloading the KPI page shows the result.
- A second browser/profile can load the result from staging.
- Sync status is understandable.

### Scenario 2 - Partial KPI With Deferred Puck-Control Weave

Validate how the WIP handles Puck-Control Weave when not tested or explicitly deferred.

Pass signals:

- Missing data is not silently treated as completed data.
- Deferred state is explicit if supported.
- If unsupported by WIP, record the gap and keep DEF-012 open.

### Scenario 3 - Plank Quality With Time + Form Score

If supported by WIP, validate Plank Quality as time plus form score.

Pass signals:

- Time and form score are distinct.
- Cloud snapshot preserves both values.
- KPI dashboard displays or preserves the evidence without flattening it incorrectly.

If not supported by WIP:

- Record the gap and keep DEF-011 open.

### Scenario 4 - Duplicate / Update Behavior

Create a KPI result, then edit/update it.

Pass signals:

- The app does not display duplicate attempts for the same KPI identity/date/enteredAt when cloud and local both exist.
- The most recent intended evidence is visible.
- Older immutable cloud evidence is either safely deduped in UI or clearly handled by the repository strategy.

### Scenario 5 - Offline / Local Fallback Behavior

Simulate cloud write failure in a safe local/staging manner.

Pass signals:

- KPI result remains visible locally.
- UI reports local only / pending sync or sync failed.
- No data is deleted because cloud write failed.
- Existing local-only records remain preserved.

### Scenario 6 - Cross-Device Visibility

Where possible, use another browser profile, Incognito session, iPad, or parent browser against staging.

Pass signals:

- KPI result created in one context appears in another context.
- Evidence hydrates from staging, not only from localStorage.
- Sync caveats are clear.

## Expected Evidence

Capture enough evidence to make the validation auditable:

- Terminal check results for lint, build, and v8.4 import smoke test.
- App screenshots or manual observations for save, reload, and cross-device/profile visibility.
- Staging table row counts before and after.
- Staging record details without secrets.
- Confirmation that production row counts/data did not change.
- `git status --short` before and after WIP application/testing.
- Notes for any failed or skipped scenario.

## Pass / Fail Criteria

Pass only if:

- Required terminal checks pass.
- KPI save writes to staging cloud path.
- KPI page can hydrate cloud-backed results.
- Existing local KPI behavior still works.
- Local fallback works when cloud write fails.
- Dedupe prevents duplicate display for cloud/local copies of the same KPI evidence.
- No production Supabase rows change.
- No secrets are exposed.
- No source training data changes.
- Delete uses immutable tombstone records, not physical deletes.

Fail if:

- Any production Supabase write occurs.
- Any secret is displayed or committed.
- Any `session_logs` delete grant, delete policy, or physical delete is introduced.
- KPI result is local-only after a normal staging save.
- Existing local KPI results disappear.
- Duplicate cloud/local rows show as duplicate KPI attempts.
- Terminal checks fail.
- WIP requires schema changes not explicitly reviewed and approved.

## Rollback Plan

If local WIP fails:

- Do not commit.
- Preserve useful notes/screenshots.
- Use `git status --short` to inspect changes.
- Prefer stashing failed local WIP for later analysis.
- Use a non-destructive reset only if explicitly approved.

Environment rollback:

- Restore `.env.local` from `.env.local.production-backup` only when intentionally returning to production-local mode.
- Do not display backup contents.
- Confirm the target environment before any future cloud-write test.

## Scope Capture Check

After the staging test run, update or explicitly review:

- Defects added/updated:
  - DEF-001 standalone KPI cloud sync
  - DEF-011 Plank Quality time plus form score
  - DEF-012 Puck-Control Weave deferred state
  - DEF-014 app-wide sync status
- Epics/features added/updated:
  - KPI Testing System
  - Data Sync Strategy
  - QA / Testing / Regression System
- Product decisions added/updated:
  - Whether WIP snapshot shape is accepted
  - Whether deferred KPI state is supported or still open
- Data/sync/environment decisions added/updated:
  - Staging validation outcome
  - Production backfill remains deferred unless explicitly approved
- Testing requirements added/updated:
  - New regression cases from failures or gaps
- Docs updated:
  - `docs/TESTING_STATUS.md`
  - `docs/DEFECT_LOG.md`
  - `docs/DATA_SYNC_STRATEGY.md`
  - `docs/SESSION_HANDOFF.md`
- Items intentionally deferred:
  - Production deploy
  - June 16 KPI backfill
  - Vercel production changes
