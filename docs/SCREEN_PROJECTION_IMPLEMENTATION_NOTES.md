# Screen Projection Implementation Notes

## What Was Implemented

- Added `lib/projections/screenProjections.ts` as a pure selector layer from `DayProjection` to screen-specific view models.
- Added fixture-local tests in `lib/projections/screenProjections.test.ts`.
- The selectors preserve the same day truth from `DayProjection` while shaping it for Today, Calendar, History, Dashboard, KPIs, and weekly dashboard summaries.

## Mapping To Projection Pipeline

- `DayProjection` remains the source of truth for date, display title, status, summary, caveats, flags, and record groups.
- Today selectors expose action, done, and attention labels without merging Sport Load and Training Work.
- Calendar selectors expose consistent status and logged Sport Load state.
- History selectors group Sport Load, Training Work, KPI, Reflection, Recovery, and Legacy records separately.
- Dashboard selectors summarize evidence counts and caveat/attention flags without inventing completion.
- KPI selectors count completed KPI records and explicit deferred KPI records separately.

## Intentionally Not Wired Yet

- No React pages, components, app routes, repositories, browser APIs, Supabase clients, current time, production data, or v8.4 JSON imports use this module.
- Existing Today, Calendar, History, Dashboard, KPI, Plan vs Actual, and Export behavior is unchanged.

## Product Decisions Still Open

- Final UI copy for attention labels and primary actions.
- Whether weekly dashboard rollups should count `completed_with_deferred` as fully complete or separately.
- How much local-only/sync caveat detail each user role should see.
- Export-specific screen models remain a later projection layer.
