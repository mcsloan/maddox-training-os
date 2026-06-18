# Testing Status

## Implemented

- `npm run lint`
- `npm run build`
- `node scripts/verify-v8.4-import.mjs`
- Pure projection tests exist for:
  - `dayStatus`
  - `dayProjection`
  - `dayProjectionAdapters`
  - `screenProjections`
- QA docs exist for:
  - `DAY_SCENARIOS`
  - `DATA_PROPAGATION_MATRIX`
  - `ROLE_EXPECTATIONS`
  - `DAY_STATUS_MODEL`
  - `SCREEN_EXPECTATIONS`
  - `TEST_CASES`
  - `GOLDEN_FIXTURES_PLAN`
  - `QA_TRACEABILITY_MATRIX`
  - `QA_AUTOMATION_READINESS`

## Not Implemented

- Playwright E2E tests
- Automated cross-device sync tests
- Staging environment tests beyond manual core KPI cloud sync validation
- Automated KPI cloud sync regression tests
- History Week -> Day -> Evidence regression tests
- Homepage stale card regression
- Formal release gate

## Staging Baseline

- Non-prod Supabase staging project created: `maddox-training-os-staging`.
- Project ref: `npuankmkxbjtlokbpczz`.
- Region: West US (Oregon) `us-west-2`.
- Compute: `t4g.nano`.
- Local development now points to staging.
- `supabase/schema.sql` was applied manually in staging SQL Editor.
- Staging SQL result: "Success. No rows returned."
- Confirmed staging tables: `athletes`, `session_logs`, `session_progress`.
- KPI cloud-sync core staging path passed manually for save, cloud readback, Incognito visibility, and immutable tombstone delete.
- No production deploy readiness is implied by this baseline.
- KPI cloud-sync staging validation plan exists at `docs/KPI_CLOUD_SYNC_STAGING_TEST_PLAN.md`.
- Remaining KPI staging scenarios still pending: Puck-Control Weave deferred state, Plank Quality time plus form score, duplicate/update edge cases beyond the tested delete, offline/local fallback regression, and broader cross-device checks.

## KPI Cloud Sync Manual Staging Evidence

- Initial pre-grant cloud save failed with `permission denied for table session_logs (42501)` while preserving local backup.
- Manual non-destructive anon grants fixed staging API access.
- 10-yard sprint staging test KPI saved with `bestResult = 8.88`.
- Staging readback confirmed `source = kpi_page`, `kind = standalone_kpi_result`, `kpiId = kpi-10-yard`, and `bestResult = 8.88`.
- Incognito confirmed cloud visibility for `8.88` and confirmed a separate `9.99` local-only browser backup was not visible.
- Delete is implemented as immutable tombstone evidence, not a physical delete.
- Staging readback confirmed original result remains and `standalone_kpi_result_deleted` tombstone exists with `reason = user_deleted`.
- Incognito confirmed deleted `8.88` and the tombstone are not displayed.
- Production Supabase and Vercel Production remain untouched.

## Current Manual Production Evidence

- June 17 iPad Sport Load / Log Today save appeared in parent browser.
- This confirms cross-device cloud sync for Sport Load core path.

## Current Test Command Rules

For app-code changes:

- `npm run lint`
- `npm run build`
- `node scripts/verify-v8.4-import.mjs`

For documentation-only changes:

- `git status --short`
- run markdown lint/test only if a script exists
- do not run build unless code changed

For iPhone/LAN production-style validation when needed:

- `npm run ios:test`

Use production mode for iPhone/iPad validation; do not rely on Next dev/Turbopack mode for iOS behavior.
