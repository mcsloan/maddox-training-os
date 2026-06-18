# Data Sync Strategy

## Principle

Real training evidence must be durable, cross-device, and explainable to a parent. Local storage is acceptable as an offline backup or cache, but Tier 1 evidence should not be local-only.

## Current Confirmed Sync State

Cloud-backed:

- Sport Load / Log Today core path.
- June 17 iPad Sport Load / Log Today save appeared in parent browser.
- Staging Supabase baseline exists and is ready for controlled cloud-write validation.
- Standalone KPI core save/read/delete path passed manual staging validation.

Local-only or not fully validated:

- Standalone KPI results in production.
- KPI cloud-sync WIP is not production-deployed.
- App-wide sync visibility.
- Log Today support field cross-device reload has not been explicitly verified.
- Advanced KPI edge cases remain unvalidated: Puck-Control Weave deferred state and Plank Quality time plus form score.

## Existing Cloud Pattern

The app already uses Supabase `session_logs` with JSON `session_snapshot` payloads for immutable evidence snapshots.

Known sources:

- `source = web` for completed sessions.
- `source = external_load` for legacy/internal Sport Load logs.
- KPI cloud-sync WIP uses `source = kpi_page` for standalone KPI snapshots in staging.

Production Supabase now matches the immutable `session_logs` grant model:

- `session_logs`: SELECT and INSERT for anon, no UPDATE, no DELETE.
- No DELETE policies exist for `session_logs`.
- Physical deletion is not part of the client data model.
- Standalone KPI delete must use tombstone records.

## Staging Baseline

Non-prod Supabase staging has been created:

- project name: `maddox-training-os-staging`
- project ref: `npuankmkxbjtlokbpczz`
- region: West US (Oregon) `us-west-2`
- compute: `t4g.nano`
- URL: `https://npuankmkxbjtlokbpczz.supabase.co`

Local development now points to staging through `.env.local`. The staging publishable key is set locally but must not be displayed or committed.

Schema baseline:

- `supabase/schema.sql` applied manually in staging SQL Editor.
- Result: "Success. No rows returned."
- Confirmed tables: `athletes`, `session_logs`, `session_progress`.

Existing cloud save paths upsert the Maddox athlete automatically:

- `lib/storage/externalLoadRepository.ts`
- `lib/storage/cloudSessionProgressRepository.ts`
- `lib/storage/completedSessionRepository.ts`

KPI cloud sync is staging-validated for the core save/read/delete path, but is not production-ready. Production deployment, June 16 backfill, and remaining KPI edge-case validation are still pending.

## Standalone KPI Immutable Delete

Standalone KPI deletion must not physically delete `session_logs` rows.

Decision:

- `session_logs` is immutable history.
- Standalone KPI delete writes a new `source = kpi_page` row with `session_snapshot.kind = standalone_kpi_result_deleted`.
- The tombstone snapshot includes `deletedResultId`, `deletedAt`, `reason = user_deleted`, and audit metadata.
- Load logic reads both `standalone_kpi_result` and `standalone_kpi_result_deleted`, builds a deleted ID set, and excludes deleted results from display.
- Tombstone records are not displayed as KPI entries.
- No delete grants or delete policies are required or desired for `session_logs`.

Staging evidence:

- Original `standalone_kpi_result` row for the `8.88` test remains.
- `standalone_kpi_result_deleted` tombstone row exists.
- Incognito confirmed the deleted result and tombstone are not displayed.

## Local Storage

Known local keys include:

- `maddox-training-os:kpis`
- `maddox-training-os:external-load-logs`
- session/progress keys used by existing repositories

Local-only data must not be silently discarded. Older local-only KPI results should remain visible and should be treated as pending or needing intentional backfill.

## Merge / Dedupe Direction

When local and cloud data both exist:

- Merge local and cloud.
- Prefer cloud for the same stable evidence identity.
- Dedupe by stable identifiers where available.
- For KPI results, use KPI identity/date/enteredAt where possible.
- Do not delete older local-only records automatically.

## Backfill Rule

Recovered June 16 KPI data is real Maddox historical data, but it has not been backfilled. Any production backfill must be intentional, documented, and clearly separated from fake/dev cloud-write testing.

## Sync UI Direction

The app should make sync status clear enough for parent troubleshooting:

- Cloud synced
- Local only / pending sync
- Sync failed

Sync status should become consistent across Sport Load, Training Work, KPIs, History, Dashboard, and Exports.
