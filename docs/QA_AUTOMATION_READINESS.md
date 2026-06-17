# QA Automation Readiness

## Purpose

This inspect-only report evaluates how close the app is to supporting projection-based automated tests from the committed day-level QA model.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

No app behavior, production data, approved v8.4 import data, test frameworks, or executable tests were changed for this report.

## Current Test Tooling Status

Current `package.json` scripts:

- `dev`: starts Next dev through build-info wrapper.
- `build`: runs `next build --webpack` through build-info wrapper.
- `start`: runs `next start`.
- `start:lan`: runs production server on `0.0.0.0:3000`.
- `ios:test`: builds and starts LAN production server.
- `vercel:build`: runs production build.
- `lint`: runs `tsc --noEmit`.

Current test frameworks:

- No Vitest, Jest, Playwright, Testing Library, or similar test framework is installed.
- No `test`, `unit`, `e2e`, `spec`, or Playwright scripts are configured.
- No existing test/spec files were found by filename scan.

Current verification tools:

- TypeScript compile via `npm run lint`.
- Next production build via `npm run build`.
- v8.4 smoke verification through `node scripts/verify-v8.4-import.mjs`.

## Current Projection/Data-Flow Seams

### Today

Files:

- `app/today/page.tsx`
- `components/TodayState.tsx`

Current flow:

- `TodayState` computes local date through a component-local `localDate()`.
- It checks `trainingPlan.overview.startDate/endDate`.
- It derives current day with `getPlanDay(today)`.
- It reads v8.4 day execution entries with `getV84DayExecutionEntries(today)`.
- It reads v8.4 Sport Loads with `getV84SportLoadsForDate(today)`.
- It reads v8.4 live session by date with `getV84SessionByDate(today)`.
- It reads legacy workout mapping with `getTodayWorkout(today)`.
- It renders pre-plan, complete-plan, no-session, Sport Load-only, or Training Work UI directly.

Readiness:

- Today has no pure `buildTodayProjection(date, records)` function.
- Projection choices are embedded in React render branches.
- Date dependency is component-local, which makes deterministic unit tests harder.

### Calendar

File:

- `app/calendar/page.tsx`

Current flow:

- Loads Sport Load logs asynchronously through `loadExternalLoadLogs()`.
- Uses `getCalendarDates()`, `trainingPlan.weeks`, `getPlanDay(date)`, `getExternalLoadsForDate(date)`, `getDayTags(date)`, and `getPlanDayDisplayModel(date)`.
- Logged/not-logged state is derived inline by matching `logs.find((item) => item.externalLoadId === load.id)`.

Readiness:

- Plan/date display helpers are pure enough to test.
- Calendar record projection is inline in the component.
- No pure `buildCalendarProjection()` exists to combine dates, plan day, Sport Loads, logs, and day status.

### History

File:

- `app/history/page.tsx`

Current flow:

- Loads sessions through `loadTrainingHistory()`.
- Loads Sport Load logs through `loadExternalLoadLogs()`.
- Lists Sport Load logs separately from session attempts.
- Session labels are derived through local `statusLabel()`.
- Completion percentage comes from pure `sessionCompletionPercent()`.
- Missing/not-started workouts are computed inline with `workouts.filter(...)`.

Readiness:

- Some pure helper coverage is possible through `sessionCompletionPercent()` and `workoutName()`.
- History grouping/listing rules are inline.
- No pure `buildHistoryGroups()` exists for completed, active, Sport Load, not-started, local-only, or legacy/orphan groups.

### Dashboard

File:

- `app/dashboard/page.tsx`

Current flow:

- Loads KPI results from `localKpiRepository.getAll()`.
- Loads Sport Load logs through `loadExternalLoadLogs()`.
- Loads training history through `loadTrainingHistory()`.
- Calculates completed sessions, active sessions, missed workouts, needs-attention strings, week loads, external logs, averages, recovery reminders, resting-heart-rate warning, actual perceived load, and KPI summary inline.
- Reuses pure helpers from `lib/trainingData.ts` and `lib/trainingMetrics.ts`.

Readiness:

- `estimateWeeklyActualLoad()`, KPI metric helpers, and plan summary helpers are unit-testable now.
- Dashboard summary and needs-attention logic should be extracted before reliable unit tests.
- No pure `buildDashboardSummary()` exists.

### KPIs

Files:

- `app/kpis/page.tsx`
- `components/KPIEntryForm.tsx`
- `lib/storage/localKpiRepository.ts`
- `lib/storage/kpiRepository.ts`
- `lib/trainingMetrics.ts`

Current flow:

- KPI page reads standalone KPI results from `localKpiRepository.getAll()`.
- KPI write/edit/delete uses `localKpiRepository`.
- `KPIEntryForm` calculates attempts and best score locally before saving.
- KPI projection uses pure helpers: `kpiBaseline()`, `kpiBest()`, `kpiTargetProgress()`, and `kpiTrend()`.

Readiness:

- KPI math is the most automation-ready area for unit tests.
- Storage remains localStorage-bound and browser-dependent.
- No pure `buildKpiSummary(kpis, results, planDays, today)` exists.

### Sport Load Logs

Files:

- `components/ExternalLoadForm.tsx`
- `components/ExternalLoadActions.tsx`
- `lib/storage/externalLoadRepository.ts`

Current flow:

- `ExternalLoadForm` creates a local editable log with `createExternalLoadLog(load, previous)`.
- `saveExternalLoadLog(log, load)` writes local backup first and then writes a Supabase `session_logs` snapshot with `source = external_load`.
- `loadExternalLoadLogs()` merges cloud and local logs, dedupes to latest per planned Sport Load through internal `latestOnly()`, and returns mode/warning.
- `ExternalLoadActions` reads logs and renders logged/update state by `externalLoadId`.

Readiness:

- `createExternalLoadLog()` is pure-ish except ID/time generation through `window.crypto` and `new Date()`.
- `latestOnly()` is useful projection logic but is not exported.
- Sport Load logged/not-logged projection should be extracted before unit tests.

### Existing Pure Functions/Selectors

Strongest current pure or near-pure functions:

- `lib/trainingMetrics.ts`
  - `sessionCompletionPercent(session)`
  - `kpiBest(kpi, entries)`
  - `kpiBaseline(entries)`
  - `kpiTargetProgress(kpi, baseline, current)`
  - `kpiTrend(kpi, entries)`
  - `workoutName(workout)`
  - `estimateWeeklyActualLoad(week, sessions, sportLoads, workouts)`
- `lib/trainingData.ts`
  - `getWorkout(id)`
  - `getWorkoutDrills(workout)`
  - `getPlanDay(date)`
  - `getNextKpiDay(afterDate)`
  - `getNextScheduledDate(afterDate)`
  - `getExternalLoadsForDate(date)`
  - `getWeekExternalLoads(week)`
  - `getCalendarDates()`
  - `getPlanDayDisplayModel(date)`
  - `userFacingLoadRule(rule, hasSportLoad)`
  - `userFacingPlanText(text)`
  - `getWeekPlanSummary(week)`
  - `getDayTags(date)`
  - `isUsableExternalUrl(url)`

Limitations:

- Many `trainingData` helpers close over imported JSON data, so they are deterministic but not fixture-injectable.
- Some helpers use `new Date()` internally, such as `getCurrentPlanWeek()` and default arguments on workout lookup helpers.
- Storage repositories depend on `window.localStorage`, Supabase client, `window.crypto`, and current time.

## Need for a Pure Projection Module

The app is close enough to start with a small pure projection layer, but not ready for broad projection tests without extraction.

Recommended module:

- `lib/projections/day.ts`

Recommended first functions:

- `deriveDayStatus(input)`
- `buildDayProjection(input)`
- `buildCalendarProjection(input)`
- `buildHistoryGroups(input)`
- `buildDashboardSummary(input)`
- `buildKpiSummary(input)`

Suggested input style:

- Pass approved plan data and records as parameters.
- Do not read `window`, localStorage, Supabase, or current date inside projection functions.
- Accept `today` as an explicit string.
- Accept sync state and unsupported-record caveats as explicit record inputs.

Recommended return style:

- Return plain serializable objects.
- Include status, badges, actions, caveats, and screen-specific summaries.
- Keep display strings stable enough to test, but avoid tying unit tests to full JSX markup.

## Recommended First Pure Functions To Test

1. `deriveDayStatus(input)`

Why first:

- It directly implements `docs/DAY_STATUS_MODEL.md`.
- It decouples status rules from screen rendering.
- It gives unit coverage for D01, D02 caveat behavior, D05 partial state, and D10 legacy/orphan state.

2. `buildKpiSummary(input)`

Why second:

- Existing KPI metric helpers are already pure.
- It can cover `TC-D02-KPI-BASELINE-JUN16` supported KPI result behavior and `TC-D07-KPI-RETEST` math without touching browser UI.

3. `buildDashboardSummary(input)`

Why third:

- Dashboard has important parent/operator logic currently inline.
- Needs-attention rules are likely to regress as records and sync caveats expand.

4. `buildCalendarProjection(input)`

Why fourth:

- Calendar currently checks Sport Load log existence inline.
- This would cover logged/not-logged, date tags, sync caveats, and needs-review badges.

5. `buildHistoryGroups(input)`

Why fifth:

- History will need grouping for active, completed, Sport Load, not-started, legacy/orphan, local-only, and sync states.

## Recommended Fixture Files To Create Later

Do not create these yet. Recommended later fixture files:

- `tests/fixtures/day-scenarios/d01-june15-sport-load.ts`
- `tests/fixtures/day-scenarios/d02-june16-kpi-baseline.ts`
- `tests/fixtures/day-scenarios/d05-partial-session.ts`
- `tests/fixtures/day-scenarios/d10-legacy-orphan.ts`
- `tests/fixtures/records/session-progress.ts`
- `tests/fixtures/records/sport-load-logs.ts`
- `tests/fixtures/records/kpi-results.ts`
- `tests/fixtures/records/sync-states.ts`
- `tests/fixtures/records/unsupported-caveats.ts`
- `tests/fixtures/approved-plan/v84-anchors.ts`

Fixture guidance:

- Reference approved v8.4 IDs only as anchors.
- Do not copy or mutate `imports/v8.4/data/*.json`.
- Keep fixture-only cases clearly labeled.
- Represent missing storage support with explicit caveat records, not fake app records.

## Recommended Minimal Automation Stack

Do not install now. Recommended when implementation is approved:

1. Vitest for pure projection and metric tests.
   - Minimal fit for TypeScript pure functions.
   - First target: `deriveDayStatus()`, `buildKpiSummary()`, and existing `trainingMetrics` helpers.

2. Playwright later for screen projection smoke tests.
   - Use after pure projections and fixtures stabilize.
   - First target: D01, D04, D05 resume behavior, D10 review banners.

3. Avoid adding React component testing first.
   - Current components mix data loading, projection, and rendering.
   - Pure projection functions will provide better signal with less setup.

## Test Cases To Automate First

Best first unit-test candidates:

- `TC-D05-PARTIAL-INTERRUPTED-SESSION`
  - Unit target: `deriveDayStatus()` for `in_progress`, `partial`, `sync pending`, `sync failed`, and `local-only`.
- `TC-D10-LEGACY-ORPHAN-REVIEW`
  - Unit target: `deriveDayStatus()` and `buildHistoryGroups()` for `legacy_needs_review`.
- `TC-D02-KPI-BASELINE-JUN16`
  - Unit target: `buildKpiSummary()` for completed KPI records.
  - Deferral portion remains blocked until explicit deferral storage/product model exists.
- `TC-D01-SPORT-LOAD-JUN15`
  - Unit/integration target: Sport Load logged vs Training Work incomplete separation.

Best first integration candidates after projection extraction:

- D01 Sport Load log propagation into Today/Calendar/History/Dashboard projection objects.
- D05 live session progress local-only/sync-failed projection.
- D10 legacy/orphan grouping.

Best first Playwright candidates after fixture support:

- D04 normal v8.4 session opens with video-backed drill cards.
- D05 resume live session from saved progress.
- D01 Sport Load logged/not-logged UI.

## Blockers Before Automation

Code structure blockers:

- Day status rules are not centralized in `deriveDayStatus()`.
- Today, Calendar, History, and Dashboard projections are embedded in React components.
- Current pure helpers close over imported data rather than accepting injected fixture data.
- Storage repositories depend on browser globals and Supabase, making direct unit tests awkward.

Product/model blockers:

- KPI deferral storage is not defined.
- Recovery-log storage is not clearly distinct from Sport Load recovery fields or session reflection.
- Export representation for partial/deferred/sync/local-only/legacy caveats is not defined.
- Approved v8.4 date binding is still needed for D03 through D09 fixture-only scenarios.
- Multi-device conflict handling policy for live session progress is still open.

Tooling blockers:

- No test runner installed.
- No fixture directory.
- No test script.
- No Playwright config or browser automation setup.

## Recommended Next Implementation Step

Implement a documentation-aligned pure projection module before installing test tools.

Smallest useful step:

1. Add `lib/projections/day.ts`.
2. Implement `deriveDayStatus(input)` only.
3. Keep input/output plain and fixture-injectable.
4. Cover supported statuses first:
   - `not_started`
   - `planned`
   - `in_progress`
   - `completed`
   - `partial`
   - `sport_load_logged`
   - `legacy_needs_review`
   - `sync pending`
   - `sync failed`
   - `record-not-supported`
5. Leave KPI deferral and recovery-log unsupported paths explicit.
6. After that, add Vitest and unit tests for `deriveDayStatus()` using D01, D02, D05, and D10 fixtures.

This keeps the first automation pass aligned with the day-level QA model without rewriting the app or creating brittle UI tests first.
