# Screen Expectations

## Purpose

Each screen is a projection of day-level truth. No screen is an independent source of truth.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

## Source of Truth

Screens should project:

- Approved v8.4 plan data.
- Approved v8.4 sessions, drills, videos, KPIs, Sport Loads, and execution entries.
- User-created records.
- Sync state.
- Legacy/orphan review state.

Screens should not invent:

- Workouts.
- Drills.
- KPIs.
- Videos.
- Sport Loads.
- Coaching logic.
- Gantt or phase changes.

## Shared Projection States

Every screen that shows day records must use these projection meanings:

- `deferred`: show only when an explicit supported deferment record or field exists.
- `partial`: show when some record evidence exists but required work is incomplete and not explicitly deferred.
- `sync pending`: show when a local record is waiting for cloud confirmation.
- `sync failed`: show when a local record could not be saved to cloud.
- `local-only`: show when a feature has no cloud storage yet or the record exists only in localStorage.
- `record-not-supported`: show when a scenario expects a record type that current storage cannot create/read.
- `export-not-supported`: show when export cannot represent an existing record or caveat.
- `legacy_needs_review`: show when a record cannot be attached safely to approved day truth.

Absence is not deferment. Unsupported storage is not absence. Local-only is not cloud-synced.

## Today

Today should answer:

- What is true about today?
- What is the primary action now?
- Should Maddox start, resume, log, recover, or review?

Expected projections:

- Planned Training Work.
- Planned Sport Load.
- Planned KPI.
- Live session progress if present.
- Sport Load log status if present.
- Recovery requirements.
- Sync warning if live progress is not cloud-synced.
- Partial/interrupted state when a live session exists but is incomplete.
- Deferred state only when explicitly recorded.
- Record-not-supported caveat when a required expected record has no supported storage.

Today must not:

- Hide a partial session.
- Treat Sport Load logging as Training Work completion.
- Treat Training Work completion as Sport Load logging.
- Hide local-only progress that can still be resumed on the current device.

## Day Page

The Day page should answer:

- What was planned for this specific date?
- What has actually happened?
- What records exist?
- What remains unresolved?

Expected projections:

- Approved day title and execution sequence.
- Start or resume correct v8.4 session ID when available.
- Sport Load records.
- Training Work records.
- KPI records and deferrals.
- Recovery records.
- Derived day status.
- Plan vs actual summary.
- Legacy/orphan warning if records do not attach cleanly.
- Sync pending/failed/local-only caveats for records shown on the day.
- Unsupported-record caveats for expected deferral or recovery records that cannot yet be stored.

## Session Runner

The session runner should answer:

- What step am I on?
- What drill or KPI is next?
- What has been completed in this live attempt?
- Is progress synced?

Expected projections:

- Approved v8.4 drill cards and video buttons for v8.4 sessions.
- Readiness, drill logs, KPI-in-session values, reflection, and current step.
- Live progress loaded from Supabase `session_progress` when configured.
- Local fallback when Supabase is unavailable.
- Completed snapshot saved to `session_logs` at completion.
- Local-only or sync-failed warning when Supabase cannot save live progress.

The session runner remains a workflow surface, not the whole-day authority.

## Calendar

Calendar should answer:

- What is planned across weeks and dates?
- Which dates have records?
- Which dates need attention?

Expected projections:

- Week and day plan.
- Sport Load count and logged state.
- Training Work or live session status.
- KPI status.
- Recovery status.
- Legacy/orphan warning badges.
- Deferred, partial, sync, local-only, and unsupported badges when those records affect the date.

Calendar must preserve plan vs actual distinction.

## History

History should answer:

- What records exist?
- What attempts are completed, partial, in progress, reopened, or legacy?
- What can be resumed or reviewed?

Expected projections:

- Completed session snapshots.
- Active live session progress.
- Sport Load logs.
- Partial/interrupted attempts.
- Sync state.
- Legacy/orphan records needing review.
- Export-not-supported caveats only when History is being used to audit export readiness.

History should not present local-only records as cloud-synced.

## Dashboard

Dashboard should answer:

- What should the parent/operator pay attention to?
- How is the week going against the plan?
- What is complete, partial, deferred, or concerning?

Expected projections:

- Week load context.
- Actual perceived load.
- Sport Load logging state.
- Training Work completion state.
- KPI status and trends.
- Recovery reminders.
- Readiness and pain/soreness flags.
- Sync warnings.
- Export-readiness gaps when dashboard is used as the parent/operator attention surface.

Dashboard should aggregate records but not create them.

## KPIs

KPIs should answer:

- What KPI results exist?
- What is baseline, current best, and trend?
- What was deferred?

Expected projections:

- Completed KPI results.
- Deferred KPI entries.
- KPI results embedded in completed sessions.
- Standalone KPI results if the app supports them.
- Unsupported deferral caveat if a KPI is expected to be deferred but there is no storage path.
- Local-only or sync-failed caveat for standalone KPI entries that have not reached cloud.

Current known constraint:

- Standalone KPI cloud sync uses the `session_logs` evidence path and should still surface local-only/sync-failed caveats when cloud confirmation fails.

## Plan

Plan should answer:

- What is approved for the program and week?
- How does the day fit the larger plan?

Expected projections:

- Program, week, phase, and day plan.
- Planned days, Sport Loads, KPI checkpoints, and recovery protections.
- No mutation from actual records.

Plan should remain an approved-plan projection, not a logging surface.

## Exports

Exports should answer:

- What evidence can be shared outside the app?
- What happened compared with the approved plan?

Expected projections:

- Completed sessions.
- Drill logs.
- KPI results.
- Sport Load logs.
- Recovery records.
- Deferred items.
- Partial/interrupted attempts.
- Sync status and local-only caveats where relevant.
- Export-not-supported status when a partial, deferred, sync, local-only, or legacy/orphan caveat exists but cannot be represented in the generated export.

Exports should not silently omit partial or deferred records.
Exports should not imply cloud sync if the source record is local-only, sync pending, or sync failed.

If export support is missing:

- The export screen should show that the export cannot yet include the affected caveat.
- The source record remains valid in day, history, dashboard, or role projections.
- The missing export support should be tracked as a product gap, not patched by deleting or flattening the record.

## Parent View

Parent view should answer:

- What happened today?
- What needs action?
- Is Maddox ready, sore, tired, confident, or at risk?
- What did not sync?

Expected projections:

- Day status.
- Plan vs actual.
- Readiness and reflection.
- Sport Load and Training Work separation.
- Recovery completion.
- KPI completion/deferment.
- Sync health.
- Unsupported-record and export-not-supported caveats when they affect parent decisions.

## Athlete View

Athlete view should answer:

- What do I do now?
- What is next?
- What is already done?

Expected projections:

- Start/resume button.
- Current step.
- Drill video buttons.
- Simple completion feedback.
- Recovery prompt.
- Blocking warnings only when action needs to change.
- Sync warnings only when they affect resume reliability or current-device safety.

## Projection Rule

If two screens disagree, the defect is not resolved by changing one screen's display copy. The day-level records and derivation rules must be inspected first.

## Fixture vs v8.4-Backed Screen Tests

Screen tests must name whether their day is:

- `v8.4-backed`: the screen is validating current approved plan data and real records.
- `fixture-only/pre-prod`: the screen is validating process behavior with synthetic or staging records.

Fixture-only tests must not claim that the approved plan contains the fixture content, and must not mutate production data.
