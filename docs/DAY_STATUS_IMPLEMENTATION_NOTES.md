# Day Status Implementation Notes

## What Was Implemented

- Added `lib/projections/dayStatus.ts` as a pure, unused day-status projection module.
- Exported fixture-friendly input and output types plus `deriveDayStatus(input)`.
- Kept the module independent from React, routes, storage repositories, Supabase, localStorage, current time, and v8.4 JSON imports.

## Mapping To `DAY_STATUS_MODEL.md`

- The exported status names match the first isolated model set: `not_started`, `planned`, `in_progress`, `completed`, `completed_with_deferred`, `partial`, `deferred`, `sport_load_logged`, `recovery_logged`, and `legacy_needs_review`.
- The module returns a deterministic primary `status` plus a `statuses` array so later screens can show secondary badges without recomputing day truth.
- Legacy/orphan records and `manual-review-required` caveats take precedence and produce `legacy_needs_review`.
- Explicit deferrals are required for `deferred` and `completed_with_deferred`; missing records alone never create deferral.
- Sport Load logs, Training Work records, KPI records, recovery logs, reflections, and legacy/orphan records remain separate inputs.
- Local-only, sync pending, and sync failed states are exposed as caveats and do not change completion status by themselves.
- Unsupported records are exposed as caveats and block unsupported completion from being treated as real completion.

## Intentionally Not Wired Yet

- No React pages or app routes import the module.
- Today, Calendar, History, Dashboard, KPI, Plan vs Actual, and Export projections still use existing behavior.
- No storage repositories were changed.
- No approved v8.4 import data was edited.
- No unit test framework or executable test harness was added.

## Blocked By Product Decisions

- Exact storage shape for explicit deferrals, especially KPI deferral caveats.
- Whether recovery completion is its own record type or a supported field on existing Sport Load/session records.
- Export handling for records and caveats that are supported on screen but not yet exportable.
- How unsupported expected records should be displayed per role once UI wiring begins.
- Conflict behavior for local-only evidence versus newer cloud records.

## First Test Cases To Support

- `TC-D01-SPORT-LOAD-JUN15`: Sport Load logging remains separate from Training Work, with optional recovery caveats.
- `TC-D02-KPI-BASELINE-JUN16`: completed-with-deferred requires explicit supported deferral; unsupported deferral remains a caveat.
- `TC-D04-NORMAL-TRAINING-DATE-BOUND`: completed Training Work can derive `completed`.
- `TC-D05-PARTIAL-INTERRUPTED-SESSION`: in-progress and partial Training Work states expose sync caveats.
- `TC-D10` legacy/orphan review scenarios from the fixture plan: legacy records derive review status and do not count as real completion.
