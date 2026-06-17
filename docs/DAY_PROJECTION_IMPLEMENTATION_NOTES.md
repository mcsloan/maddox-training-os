# Day Projection Implementation Notes

## What Was Implemented

- Added `lib/projections/dayProjection.ts` as a pure, fixture-friendly builder over `deriveDayStatus()`.
- Added `buildDayProjection(input)` to combine one approved planned day shape with fixture/local record groups.
- Added unit coverage in `lib/projections/dayProjection.test.ts`.

## Mapping To QA Model

- The module preserves the hierarchy: Program > Week > Day > Records > Screen projections.
- Planned activities and actual record groups remain separate inside one `DayProjection`.
- Sport Load logs and Training Work records are not merged, but both roll up under the same day object.
- `deriveDayStatus()` remains the single source for status and caveat rules.
- Legacy/orphan records flow into `hasLegacyReview` and `requiresManualReview`, not completion.
- Local-only, unsupported record, and export caveats are exposed as projection flags.

## Intentionally Not Wired Yet

- No React pages, app routes, storage repositories, Supabase clients, localStorage code, or v8.4 JSON imports use this module.
- Today, Calendar, History, Dashboard, KPIs, Plan vs Actual, and Export behavior is unchanged.
- No production data or approved import data was edited.

## Blocked By Product Decisions

- Final screen-specific copy for caveats and status labels.
- Whether unsupported storage gaps should block user actions or only surface parent/operator warnings.
- Export schema for supported records that cannot yet be exported.
- Conflict behavior when local-only records disagree with cloud records.

## First Test Coverage

- D01 Sport Load-only day.
- D02 KPI baseline with explicit deferred Puck Weave.
- D05 in-progress and partial interrupted sessions.
- D10 legacy/orphan review.
- Planned versus not-started empty planned day states.
- Local-only caveat preservation.
- Unsupported storage/export caveat projection.
