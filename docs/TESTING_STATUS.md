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
- Staging environment tests beyond schema/table baseline
- KPI cloud sync regression tests
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
- No KPI cloud-sync staging validation has been run yet.
- No production deploy readiness is implied by this baseline.
- KPI cloud-sync staging validation plan exists at `docs/KPI_CLOUD_SYNC_STAGING_TEST_PLAN.md`.

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
