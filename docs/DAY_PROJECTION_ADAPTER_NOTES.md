# Day Projection Adapter Notes

## What Was Implemented

- Added `lib/projections/dayProjectionAdapters.ts` as a pure adapter layer from existing app-shaped records to `DayProjectionInput`.
- Added fixture-local unit tests in `lib/projections/dayProjectionAdapters.test.ts`.
- The adapter maps passed-in records only; it does not read repositories, localStorage, Supabase, routes, current time, or v8.4 JSON.

## Adapter Scope

- Sport Load logs map to `sportLoadLogs`.
- Session attempts and Training Work logs map to `sessionAttempts`.
- Session exercises map to `drillLogs`.
- KPI entries map to `kpiResults`, including explicit deferred records.
- Reflection records and session reflections map to `reflections`.
- Legacy/orphan records map to `legacyOrphanRecords` and require review.
- Unsupported storage/export gaps are passed through as caveats.

## Naming Notes

- Existing storage uses legacy/internal `ExternalLoadLog`, `externalLoadId`, and `source = external_load`.
- The adapter keeps those names only at the input boundary because they are existing storage/schema names.
- Projection outputs use Sport Load record grouping through `sportLoadLogs`.

## Intentionally Not Wired Yet

- No UI, routes, storage repositories, browser APIs, Supabase clients, production data, or approved v8.4 import files were changed.
- Today, Calendar, History, Dashboard, KPIs, Plan vs Actual, and Exports still use existing code paths.

## First Test Coverage

- D01 Sport Load-only mapping into `sportLoadLogs`.
- D02 KPI completion plus explicit deferred Puck Weave.
- Reflection mapping and `hasReflection`.
- Local-only and sync-pending caveats.
- Legacy/orphan manual review mapping.
- Unsupported storage gap without invented completion.
