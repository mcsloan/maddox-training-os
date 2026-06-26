# Day Scenario Test Cases

This file preserves detailed day-scenario-derived test material that feeds future fixtures, Vitest cases, Playwright cases, and manual UAT.

Dates in this file are fixtures/examples, not the global testing model. Approved v8.4 data remains authoritative for plan content.

This file must not become a giant surface x requirement x day matrix. Keep detailed cases tied to day scenarios and route future executable coverage through docs/TEST_CASES.md test groups and docs/APPLICATION_BEHAVIOR_CONTRACT.md contract IDs.

## Preserved Detailed Scenario Cases


## Purpose

These are human-readable test cases derived from the committed day-level QA model.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

No test case in this document authorizes changing approved v8.4 data, mutating production data, installing test tools, or inventing training content.

## Automation Labels

- `unit`: suitable for pure derivation or projection helper tests after helpers exist.
- `integration`: suitable for repository/data-flow tests using pre-prod fixtures.
- `Playwright`: suitable for browser workflow automation after fixtures and stable selectors exist.
- `manual only`: requires human review, product decision, or unsupported storage/export behavior.

## TC-D01-SPORT-LOAD-JUN15

- Test ID: `TC-D01-SPORT-LOAD-JUN15`
- Source scenario: D01 Sport-load only day, June 15 4v4 hockey + mobility support
- Priority: P0
- Role: athlete / parent / system
- Starting state: v8.4-backed June 15 day exists; no production mutation; pre-prod or local fixture can create Sport Load log and optional recovery/support records.
- Test steps:
  1. Open June 15 through Today or Day projection in a non-production test context.
  2. Verify planned 4v4 Sport Load and approved support context render from v8.4 data.
  3. Create or fixture a Sport Load log for the June 15 Sport Load.
  4. Fixture recovery completion only if supported by current storage; otherwise mark `record-not-supported`.
  5. Review Today, Calendar, History, Dashboard, KPIs, Plan vs Actual, and Export projections.
- Expected records:
  - `sport_load_log created`
  - `recovery_log saved` if supported; otherwise `record-not-supported`
  - No Training Work completion unless a separate supported Training Work/session record exists
- Expected day status: `sport_load_logged`; also `recovery_logged` if supported recovery record exists; not `completed` unless all required day work has supported completion records.
- Expected Today result: Shows Sport Load as primary event, logged/update state, reduced dryland/support warning, and no false Training Work completion.
- Expected Calendar result: June 15 shows Sport Load planned/logged and Training Work status separately.
- Expected History result: Sport Load log appears; any support session attempt appears separately.
- Expected Dashboard result: Weekly Sport Load count and effort/recovery indicators update; unsupported recovery remains visible as a gap.
- Expected KPI result: No KPI result or trend change.
- Expected Plan vs Actual result: Planned 4v4 maps to actual Sport Load log; support work shown as done, not started, deferred only if explicitly recorded, or unsupported.
- Expected Export result: Includes Sport Load log; includes recovery/support caveat if supported; otherwise marks `export-not-supported`.
- Sync expectation: Sport Load sync uses existing cloud path; local-only or failed sync must show caveat. Live support session sync applies only if session runner is used.
- Defects exposed if failing: Sport Load incorrectly completes Training Work; recovery gap hidden; Calendar/Dashboard over-report completion; local-only state hidden.
- Automation suitability: Playwright for visible projections after fixtures exist; integration for storage/projection; manual only for unsupported recovery/export caveats.

## TC-D02-KPI-BASELINE-JUN16

- Test ID: `TC-D02-KPI-BASELINE-JUN16`
- Source scenario: D02 June 16 KPI baseline day with Puck Weave deferred
- Priority: P0
- Role: athlete / parent / coach review / system
- Starting state: v8.4-backed June 16 baseline KPI day exists; Puck Weave deferral is fixture-only unless approved data and supported deferral storage exist.
- Test steps:
  1. Open June 16 Day projection.
  2. Start or fixture a session/KPI workflow using approved data.
  3. Enter supported baseline KPI completion records.
  4. Attempt to represent Puck Weave deferral only through supported deferral storage; otherwise mark `record-not-supported`.
  5. Save reflection.
  6. Review all screen projections.
- Expected records:
  - `session_attempt started`
  - `kpi_result completed`
  - `kpi_result deferred` only if supported; otherwise `record-not-supported`
  - `reflection_log saved`
- Expected day status: `completed_with_deferred` only if explicit deferral storage exists; otherwise `completed` plus unsupported-deferral caveat.
- Expected Today result: Shows June 16 complete/completed-with-deferred state or unsupported-deferral caveat.
- Expected Calendar result: Marks KPI complete and shows deferred/unsupported caveat.
- Expected History result: Session/KPI attempt includes completed KPI results and reflection.
- Expected Dashboard result: KPI summary updates; unsupported or deferred Puck Weave appears as follow-up.
- Expected KPI result: Completed baseline values affect KPI history/trends; deferred/unsupported Puck Weave does not count as score.
- Expected Plan vs Actual result: Baseline complete; Puck Weave deferred only if explicitly represented; reflection complete.
- Expected Export result: Includes KPI attempts and reflection; shows `export-not-supported` if deferral caveat cannot be exported.
- Sync expectation: Live session progress syncs through `session_progress`; completed snapshot syncs through `session_logs`; standalone KPI cloud sync is not expected.
- Defects exposed if failing: Missing unsupported-deferral caveat; KPI double-counting; deferral inferred from absence; completed-with-deferred derived without supported deferral record.
- Automation suitability: Playwright/integration for supported KPI flow; manual only for Puck Weave deferral until product/storage support exists.

## TC-D03-MIXED-SPORT-RECOVERY-PENDING-DATE

- Test ID: `TC-D03-MIXED-SPORT-RECOVERY-PENDING-DATE`
- Source scenario: D03 mixed sport + recovery day
- Priority: P1
- Role: athlete / parent / system
- Starting state: Pending approved date binding. Must bind to a real v8.4 lacrosse-game date before executable testing.
- Test steps:
  1. Select and record the approved v8.4 lacrosse-game date for the test run.
  2. Open the Day projection for that date.
  3. Fixture a Sport Load log.
  4. Fixture light puck/support attempt only if approved for that date.
  5. Fixture recovery only if supported; otherwise mark `record-not-supported`.
  6. Review all projections.
- Expected records:
  - `sport_load_log created`
  - Optional `session_attempt started`
  - Optional `drill_log completed`
  - `recovery_log saved` if supported; otherwise `record-not-supported`
- Expected day status: `sport_load_logged` plus `recovery_logged` if supported; `partial` for started unfinished support work; `completed_with_deferred` only for explicit supported deferment.
- Expected Today result: Shows Sport Load and reduced support/recovery context when date is today.
- Expected Calendar result: Bound date shows lacrosse planned/logged and separate support/recovery state.
- Expected History result: Sport Load log and support attempt are separate records.
- Expected Dashboard result: Load, soreness, pain, recovery, and partial support warnings update.
- Expected KPI result: No KPI effect unless approved/planned KPI was actually performed.
- Expected Plan vs Actual result: Lacrosse actuals map to planned Sport Load; support work remains distinct.
- Expected Export result: Includes Sport Load and supported recovery/support records; unsupported partial/recovery caveats are marked `export-not-supported`.
- Sync expectation: Sport Load sync through existing path; live support progress through `session_progress` if session runner is used.
- Defects exposed if failing: Sport Load and support work collapse into one status; recovery unsupported state hidden; date-bound plan assumptions invented.
- Automation suitability: Blocked from executable automation until approved date binding is recorded; then Playwright/integration for supported parts.

## TC-D04-NORMAL-TRAINING-DATE-BOUND

- Test ID: `TC-D04-NORMAL-TRAINING-DATE-BOUND`
- Source scenario: D04 normal training day
- Priority: P0
- Role: athlete / parent / coach review / system
- Starting state: Fixture-only/pre-prod until bound to a real approved v8.4 Training Work date with video-backed drill cards.
- Test steps:
  1. Bind to an approved v8.4 normal Training Work date.
  2. Open Day and start the session.
  3. Verify the route opens the v8.4 session ID.
  4. Complete readiness, drills, and reflection.
  5. Finish the session.
  6. Review Today, Calendar, History, Dashboard, KPI, Plan vs Actual, and Export projections.
- Expected records:
  - `session_attempt started`
  - `drill_log completed`
  - `reflection_log saved`
  - Completed session snapshot
- Expected day status: `completed`
- Expected Today result: No false start prompt after completion; reflects completed session.
- Expected Calendar result: Bound date shows Training Work complete.
- Expected History result: Completed session appears with drill completion and reflection.
- Expected Dashboard result: Completion and actual work evidence update.
- Expected KPI result: No KPI effect unless approved session includes KPI records.
- Expected Plan vs Actual result: Completed drill records match approved planned drills.
- Expected Export result: Includes session, drills, reflection, timestamps; marks caveat if export cannot include any supported field.
- Sync expectation: Live progress syncs during session; completed snapshot syncs after finish; local fallback remains available.
- Defects exposed if failing: Wrong session ID; missing video-backed cards; completed session not propagating; cloud progress not marked completed.
- Automation suitability: Playwright after date binding and stable fixtures; integration for storage sync; unit for status derivation.

## TC-D05-PARTIAL-INTERRUPTED-SESSION

- Test ID: `TC-D05-PARTIAL-INTERRUPTED-SESSION`
- Source scenario: D05 partial/interrupted session
- Priority: P0
- Role: athlete / parent / system
- Starting state: Fixture-only/pre-prod until bound to a real approved v8.4 session date.
- Test steps:
  1. Bind to an approved v8.4 session date.
  2. Start the session on Device A.
  3. Save readiness and complete one or more drills.
  4. Stop before reflection/finish.
  5. Open same session on Device B if cloud sync is configured.
  6. Simulate or observe local-only, sync pending, and sync failed caveats in pre-prod fixtures.
  7. Review all projections.
- Expected records:
  - `session_attempt started`
  - Optional `drill_log completed`
  - `sync pending`, `sync failed`, or `local-only` depending on fixture
- Expected day status: `in_progress` while resumable; `partial` if abandoned without explicit deferral.
- Expected Today result: Shows Resume Training Work and sync/local caveat when relevant.
- Expected Calendar result: Shows in-progress or partial badge on bound date.
- Expected History result: Active attempt appears with completion percentage and sync/local state.
- Expected Dashboard result: Incomplete session appears as attention item.
- Expected KPI result: Any KPI values inside live session remain session progress only; no standalone KPI cloud expectation.
- Expected Plan vs Actual result: Planned session compared with completed subset.
- Expected Export result: Includes partial attempt and sync caveat if supported; otherwise `export-not-supported`.
- Sync expectation: `session_progress` enables cross-device resume when configured; local fallback continues if cloud fails.
- Defects exposed if failing: Duplicate active attempts; cross-device resume failure; local-only record shown as cloud-synced; missing partial status.
- Automation suitability: Playwright for cross-device-like browser contexts after fixture setup; integration for repository behavior; manual for real multi-device confidence.

## TC-D06-MULTI-ACTIVITY-DAY

- Test ID: `TC-D06-MULTI-ACTIVITY-DAY`
- Source scenario: D06 multi-activity day
- Priority: P1
- Role: athlete / parent / system
- Starting state: Fixture-only/pre-prod until bound to a real approved v8.4 multi-activity date.
- Test steps:
  1. Bind to an approved multi-activity v8.4 date.
  2. Fixture Sport Load log.
  3. Fixture optional skill/session attempt only if approved for the day.
  4. Fixture reflection and recovery only through supported storage.
  5. Review all projections for separation of record types.
- Expected records:
  - `sport_load_log created`
  - Optional `session_attempt started`
  - Optional `drill_log completed`
  - `reflection_log saved`
  - Optional `recovery_log saved` or `record-not-supported`
- Expected day status: `sport_load_logged`; `completed` if required records complete; `completed_with_deferred` only for supported explicit deferment.
- Expected Today result: Shows the correct next action without overloading the day.
- Expected Calendar result: Shows multiple records on one date without collapsing them.
- Expected History result: Sport Load and session attempt listed separately.
- Expected Dashboard result: Load aggregation avoids double-counting optional skill.
- Expected KPI result: No KPI impact unless approved/planned KPI is performed.
- Expected Plan vs Actual result: Multiple actual records map to one approved day.
- Expected Export result: Separate sections/caveats for Sport Load, optional skill/session, reflection, recovery.
- Sync expectation: Sport Load uses existing cloud path; live session uses `session_progress`; unsupported/local-only states are labeled.
- Defects exposed if failing: Multi-activity completion flattened; reflection attached to wrong record; over-counted load.
- Automation suitability: Integration/Playwright after date binding; manual for unsupported recovery/export caveats.

## TC-D07-KPI-RETEST

- Test ID: `TC-D07-KPI-RETEST`
- Source scenario: D07 KPI retest day
- Priority: P1
- Role: athlete / parent / coach review / system
- Starting state: Fixture-only/pre-prod until bound to a real approved v8.4 KPI retest/checkpoint date.
- Test steps:
  1. Bind to approved KPI retest/checkpoint date.
  2. Complete retest through supported session or KPI workflow.
  3. Save reflection if workflow supports it.
  4. Fixture explicit deferral only if supported.
  5. Review KPI, Dashboard, History, and export projections.
- Expected records:
  - `session_attempt started` if through session runner
  - `kpi_result completed`
  - `reflection_log saved`
  - Optional supported `kpi_result deferred`
- Expected day status: `completed`; `completed_with_deferred` only for supported explicit deferment.
- Expected Today result: Shows KPI checkpoint complete/deferred/unsupported state.
- Expected Calendar result: Marks KPI retest complete or deferred/unsupported.
- Expected History result: Session or KPI record attaches to bound day.
- Expected Dashboard result: KPI trend and follow-up items update.
- Expected KPI result: Retest result affects current best/trend; deferred/unsupported does not score.
- Expected Plan vs Actual result: Planned retest compared with actual result/deferment.
- Expected Export result: Includes attempts, best score, notes, and comparison/caveat if supported; otherwise `export-not-supported`.
- Sync expectation: Session-runner KPI data syncs inside live progress; standalone KPI cloud sync remains out of scope.
- Defects exposed if failing: Deferred retest counted as completed; local-only standalone KPI treated as cloud trend; duplicate KPI result.
- Automation suitability: Integration/Playwright after date binding; manual for unsupported deferral/export decisions.

## TC-D08-CAMP-DAY

- Test ID: `TC-D08-CAMP-DAY`
- Source scenario: D08 camp day
- Priority: P1
- Role: athlete / parent / coach review / system
- Starting state: Fixture-only/pre-prod until bound to a real approved v8.4 camp date.
- Test steps:
  1. Bind to approved camp date.
  2. Fixture camp Sport Load attendance log.
  3. Fixture camp-specific reflection fields if supported by Sport Load log shape.
  4. Fixture recovery if supported.
  5. Review projections.
- Expected records:
  - `sport_load_log created`
  - Camp reflection fields if supported
  - `recovery_log saved` if supported; otherwise `record-not-supported`
  - Optional support/session records
- Expected day status: `sport_load_logged`; `recovery_logged` if supported; `completed` only if required work complete; `completed_with_deferred` only for explicit supported support-work deferral.
- Expected Today result: Shows camp as primary Sport Load and avoids inappropriate extra dryland emphasis.
- Expected Calendar result: Camp day marked planned/logged.
- Expected History result: Camp Sport Load log appears.
- Expected Dashboard result: Camp contributes to weekly actual load and recovery reminders.
- Expected KPI result: No KPI effect unless approved/planned KPI is performed.
- Expected Plan vs Actual result: Camp actuals map to camp plan.
- Expected Export result: Includes camp fields/recovery if supported; otherwise `export-not-supported`.
- Sync expectation: Sport Load cloud path should sync camp log; local-only failures are caveated.
- Defects exposed if failing: Camp treated as normal Training Work; camp-specific fields hidden; recovery reminder not updated.
- Automation suitability: Integration/Playwright after date binding; manual for camp field/export coverage.

## TC-D09-TRAVEL-RECOVERY

- Test ID: `TC-D09-TRAVEL-RECOVERY`
- Source scenario: D09 travel/recovery day
- Priority: P2
- Role: athlete / parent / system
- Starting state: Fixture-only/pre-prod until bound to a real approved v8.4 travel/recovery date.
- Test steps:
  1. Bind to approved travel/recovery date.
  2. Open Today/Day for that date.
  3. Fixture recovery completion only through supported storage; otherwise mark `record-not-supported`.
  4. Confirm no hard Training Work is prompted unless approved and actually started.
  5. Review all projections.
- Expected records:
  - `recovery_log saved` if supported; otherwise `record-not-supported`
  - Optional approved light activity/session record
- Expected day status: `recovery_logged` if supported; `completed` only if recovery is required and recorded; otherwise planned/not_started plus unsupported caveat.
- Expected Today result: Shows recovery focus and no inappropriate hard-session prompt.
- Expected Calendar result: Date remains recovery/travel protected.
- Expected History result: Recovery record appears if supported.
- Expected Dashboard result: Recovery reminders clear only when supported recovery record exists.
- Expected KPI result: No KPI effect unless approved/planned KPI is performed.
- Expected Plan vs Actual result: Recovery planned vs recovery completed/unsupported.
- Expected Export result: Includes recovery completion/notes if supported; otherwise `export-not-supported`.
- Sync expectation: No live session sync assumption unless recovery is captured through session runner.
- Defects exposed if failing: Recovery day modeled as empty; app prompts hard session; unsupported recovery treated as completed.
- Automation suitability: Manual only until recovery storage/product behavior is decided; unit later for status derivation.

## TC-D10-LEGACY-ORPHAN-REVIEW

- Test ID: `TC-D10-LEGACY-ORPHAN-REVIEW`
- Source scenario: D10 legacy/test/orphan data day
- Priority: P1
- Role: parent / coach review / system
- Starting state: Fixture-only/pre-prod synthetic local/staging record using legacy/mock ID, corrupt backup, or unattached record. Do not mutate approved v8.4 data or production records.
- Test steps:
  1. Seed a synthetic legacy/orphan record in local or pre-prod storage.
  2. Open the affected day if a date is present.
  3. Review History, Dashboard, Parent view, KPI trend, and Export projections.
  4. Confirm no automatic merge into approved day truth.
- Expected records:
  - `legacy_orphan_record found`
  - `manual-review-required`
- Expected day status: `legacy_needs_review`
- Expected Today result: Warning only if orphan affects today's action.
- Expected Calendar result: Needs-review badge if record has a date.
- Expected History result: Record listed separately from approved day history.
- Expected Dashboard result: Needs-review attention item.
- Expected KPI result: Orphan KPI-like data excluded from trends until reviewed/attached.
- Expected Plan vs Actual result: Orphan data not silently merged into approved plan actuals.
- Expected Export result: Review exception section if supported; otherwise `export-not-supported`.
- Sync expectation: Preserve local data; do not overwrite cloud truth with unreviewed orphan data.
- Defects exposed if failing: Orphan record deleted; legacy IDs treated as current v8.4 IDs; corrupt/test data pollutes metrics.
- Automation suitability: Integration for repository fixtures; Playwright for review projections after UI support; manual for operator review decisions.

## Automation-Ready Summary

Automation-ready after fixture setup:

- `TC-D01-SPORT-LOAD-JUN15`: supported Sport Load projections.
- `TC-D04-NORMAL-TRAINING-DATE-BOUND`: once date-bound to approved v8.4 session.
- `TC-D05-PARTIAL-INTERRUPTED-SESSION`: local/session progress portions.
- `TC-D10-LEGACY-ORPHAN-REVIEW`: repository/projection portions with synthetic fixtures.

Blocked or partially blocked:

- `TC-D02-KPI-BASELINE-JUN16`: Puck Weave deferral blocked by deferral storage/product decision.
- `TC-D03-MIXED-SPORT-RECOVERY-PENDING-DATE`: blocked by approved date binding and recovery storage behavior.
- `TC-D06-MULTI-ACTIVITY-DAY`: blocked by date binding and unsupported optional/recovery/export caveats.
- `TC-D07-KPI-RETEST`: blocked by date binding and deferral/export decisions.
- `TC-D08-CAMP-DAY`: blocked by date binding and camp/recovery export coverage.
- `TC-D09-TRAVEL-RECOVERY`: blocked by recovery storage/product decision.
