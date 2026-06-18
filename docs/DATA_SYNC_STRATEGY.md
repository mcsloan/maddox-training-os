# Data Sync Strategy

## Principle

Real training evidence must be durable, cross-device, and explainable to a parent. Local storage is acceptable as an offline backup or cache, but Tier 1 evidence should not be local-only.

## Current Confirmed Sync State

Cloud-backed:

- Sport Load / Log Today core path.
- June 17 iPad Sport Load / Log Today save appeared in parent browser.
- Staging Supabase baseline exists and is ready for controlled cloud-write validation.

Local-only or not fully validated:

- Standalone KPI results in production.
- KPI cloud-sync WIP is stashed and not staging-tested.
- App-wide sync visibility.
- Log Today support field cross-device reload has not been explicitly verified.

## Existing Cloud Pattern

The app already uses Supabase `session_logs` with JSON `session_snapshot` payloads for immutable evidence snapshots.

Known sources:

- `source = web` for completed sessions.
- `source = external_load` for legacy/internal Sport Load logs.
- Stashed KPI WIP proposes `source = kpi_page` for standalone KPI snapshots.

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

KPI cloud sync remains not complete. The stash/patch must stay unapplied until the staging baseline and explicit test plan are accepted.

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
