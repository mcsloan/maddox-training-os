# Day Scenarios

## Purpose

These scenarios challenge the application model from the perspective of day-level truth, all screens, all roles, and downstream features.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

Each scenario should be validated without inventing plan content. Planned work, Sport Loads, sessions, drills, videos, and KPIs must come from approved v8.4 data or existing adapter mappings.

## Scenario Date Authority

Use two scenario classes:

- `v8.4-backed`: the scenario is tied to a real approved v8.4 date and can be executed against current app data.
- `fixture-only/pre-prod`: the scenario defines process expectations and must not be treated as a current-data assertion until a real approved v8.4 date is selected.

Current scenario authority:

| Scenario | Date authority | Notes |
| --- | --- | --- |
| D01 | `v8.4-backed` | June 15, 4v4 hockey plus approved support context. |
| D02 | `v8.4-backed` | June 16 baseline KPI day. Puck Weave deferment is a test condition only if that item exists in approved day data or a supported deferment record. |
| D03 | `v8.4-backed when bound to the approved lacrosse date` | Use the real v8.4 lacrosse-game date selected for the test run. Do not assume a date from this doc alone. |
| D04 | `fixture-only/pre-prod until date-bound` | Bind to a real v8.4 normal Training Work date before execution. |
| D05 | `fixture-only/pre-prod until date-bound` | Bind to any real v8.4 session date before execution. |
| D06 | `fixture-only/pre-prod until date-bound` | Bind to a real multi-activity v8.4 date before execution. |
| D07 | `fixture-only/pre-prod until date-bound` | Bind to a real v8.4 KPI retest/checkpoint date before execution. |
| D08 | `fixture-only/pre-prod until date-bound` | Bind to a real v8.4 camp date before execution. |
| D09 | `fixture-only/pre-prod until date-bound` | Bind to a real v8.4 travel/recovery date before execution. |
| D10 | `fixture-only/pre-prod` | Uses synthetic/legacy/orphan records and must never mutate approved plan data. |

If a scenario is not date-bound to approved v8.4 data, tests may create local/pre-prod fixture records but must not mutate production data or assert that the approved plan contains that content.

## Unsupported Record Fallback

Some expected record types are product requirements even if storage is not implemented yet.

When expected storage does not exist:

- Do not fabricate the record in app data.
- Mark the scenario step as `export-not-supported`, `record-not-supported`, or `manual-review-required`.
- Preserve the day-level expectation as a requirement.
- Project the missing record as an explicit gap, not as `not_started`, `completed`, or `deferred`.

Current fallback assumptions:

- `kpi_result deferred`: if no explicit deferral storage exists, the scenario cannot prove deferral. Screens should show a needs-review or unsupported-state caveat instead of inferring deferral from a missing KPI result.
- `recovery_log saved`: if no distinct recovery record exists, use the closest supported record only when it is actually present, such as a Sport Load recovery field or session reflection. Otherwise mark recovery logging as unsupported for that scenario.
- Export caveats: if exports cannot include partial, deferred, sync, unsupported-record, or legacy/orphan caveats, the export projection should be marked `export-not-supported` and the scenario should expose a product gap.

## Scenario Format

Each scenario includes:

- Planned day.
- Actual events.
- Expected records created.
- Expected derived day status.
- Athlete view expectations.
- Parent view expectations.
- Today expectations.
- Calendar expectations.
- History expectations.
- Dashboard expectations.
- KPI expectations.
- Plan vs Actual expectations.
- Export expectations.
- Sync expectations.
- Failure modes.
- Defects this scenario can expose.

## D01 Sport-load only day: June 15 4v4 hockey + mobility support

Scenario authority:

- `v8.4-backed`.

Planned day:

- June 15 is a Sport Load day with 4v4 hockey and approved recovery-adjusted support work.
- Any mobility/light support must come from approved plan data.

Actual events:

- 4v4 hockey is attended.
- Sport Load log is completed.
- Mobility support may be completed, skipped, or deferred.
- Recovery is logged.

Expected records created:

- `sport_load_log created`
- `recovery_log saved` if recovery storage or Sport Load recovery fields support it; otherwise mark `record-not-supported`.
- Optional separate Training Work or session progress record only if Maddox actually starts support work.

Expected derived day status:

- `sport_load_logged` if only the Sport Load is logged.
- `recovery_logged` also applies if recovery is recorded.
- `completed` only if all required day work is complete.
- `completed_with_deferred` if optional support work is explicitly deferred.

Athlete view expectations:

- Clear Sport Load context.
- Reduced dryland/support warning.
- No implication that Sport Load logging completes Training Work.

Parent view expectations:

- Sport Load effort, energy, soreness, pain, confidence, and recovery status.
- Separate visibility for support work status.

Today expectations:

- Shows Sport Load as the primary event if today is June 15.
- Shows logging/update action for Sport Load.
- Shows support work only if approved for the day.

Calendar expectations:

- June 15 shows Sport Load planned and logged.
- Training Work remains separate.

History expectations:

- Sport Load log appears.
- Any session attempt appears separately.

Dashboard expectations:

- Weekly Sport Load count and effort metrics update.
- Recovery reminder clears only if recovery is logged.

KPI expectations:

- No KPI result should be created unless a planned KPI is actually performed.

Plan vs Actual expectations:

- Planned 4v4 hockey maps to actual attendance and load data.
- Optional support work is shown as done, deferred, or not started.

Export expectations:

- Export includes Sport Load log and recovery status.
- Export does not claim Training Work completion unless a Training Work/session record exists.
- If recovery status or optional support deferment cannot be exported, export must show an unsupported/caveat state rather than omit it silently.

Sync expectations:

- Sport Load log should sync through existing Sport Load cloud path if configured.
- Live support session progress should sync through live session progress if it uses the session runner.

Failure modes:

- Supabase unavailable.
- Sport Load log saved locally but not in cloud.
- Mobility support started on one device and resumed on another.

Defects this scenario can expose:

- Sport Load incorrectly completing Training Work.
- Calendar badge over-reporting completion.
- Dashboard missing recovery reminder.
- Local-only Sport Load warnings not surfaced.

## D02 KPI baseline day: June 16 baseline KPIs, Puck Weave deferred, reflection completed

Scenario authority:

- `v8.4-backed` for the baseline KPI date.
- Puck Weave deferment is `fixture-only/pre-prod` unless Puck Weave is present in approved v8.4 day data and a supported deferral record exists.

Planned day:

- June 16 is a baseline KPI day with approved KPI work.
- Puck Weave is planned or expected in the day workflow only if present in approved data.

Actual events:

- Baseline KPI work is completed.
- Puck Weave is explicitly deferred.
- Reflection is completed.

Expected records created:

- `session_attempt started`
- One or more `kpi_result completed`
- `kpi_result deferred` for Puck Weave if deferral storage exists; otherwise mark `record-not-supported` and do not infer deferral from absence.
- `reflection_log saved`

Expected derived day status:

- `completed_with_deferred`
- If deferral storage is unsupported, expected status is `completed` plus a visible unsupported-deferral caveat, not `completed_with_deferred`.

Athlete view expectations:

- Shows KPI workflow and completed reflection.
- Shows Puck Weave as deferred rather than missing.

Parent view expectations:

- Sees completed baseline results and deferred Puck Weave.
- Sees reflection and any readiness concerns.

Today expectations:

- Shows complete or completed-with-deferred state when viewed on June 16.

Calendar expectations:

- June 16 indicates KPI completed with deferred item.

History expectations:

- Session attempt includes KPI results and reflection.

Dashboard expectations:

- KPI summary updates from completed KPI results.
- Deferred Puck Weave appears as follow-up.

KPI expectations:

- Completed baseline results appear in KPI history/trends.
- Deferred result does not count as a completed score.

Plan vs Actual expectations:

- Baseline complete; Puck Weave deferred; reflection complete.

Export expectations:

- Export includes completed KPI attempts, best results, notes, reflection, and deferred Puck Weave.
- If deferred KPI export is not supported, export must show `export-not-supported` for the deferment caveat.

Sync expectations:

- Live session progress syncs while the session is in progress.
- Completed session snapshot syncs on finish.
- Standalone KPI cloud sync is not expected in the current MVP.

Failure modes:

- KPI entered in session but session not completed.
- Puck Weave absence treated as not started instead of deferred.
- Reflection saved on one device but cloud progress not applied.

Defects this scenario can expose:

- KPI deferral not modeled.
- KPI results double-counted between session and standalone KPI page.
- Completed-with-deferred status missing.

## D03 Mixed sport + recovery day: lacrosse game + light puck touches/recovery

Scenario authority:

- `v8.4-backed when bound to the approved lacrosse date`.
- The test run must name the actual approved v8.4 date before executing this scenario.

Planned day:

- A lacrosse game day with approved light puck touches and recovery support.

Actual events:

- Lacrosse game is logged.
- Light puck touches are partially completed or deferred.
- Recovery is logged.

Expected records created:

- `sport_load_log created`
- Optional `session_attempt started`
- Optional `drill_log completed`
- `recovery_log saved` if recovery storage or Sport Load recovery fields support it; otherwise mark `record-not-supported`.

Expected derived day status:

- `sport_load_logged` plus `recovery_logged`.
- `partial` if light puck touches are started but not completed.
- `completed_with_deferred` if light puck touches are explicitly deferred and required work is otherwise complete.

Athlete view expectations:

- Reinforces recovery-first day.
- Keeps light puck touches clearly optional or reduced if approved as such.

Parent view expectations:

- Shows lacrosse load and recovery completion.
- Shows whether support work was done, partial, or deferred.

Today expectations:

- Shows Sport Load and reduced support work.

Calendar expectations:

- Shows lacrosse planned and logged.

History expectations:

- Sport Load log and any support session attempt appear separately.

Dashboard expectations:

- Load, soreness, pain, and recovery indicators update.

KPI expectations:

- No KPI score created unless planned and performed.

Plan vs Actual expectations:

- Lacrosse done; support work actual status is distinct.

Export expectations:

- Includes Sport Load and recovery.
- Includes partial support work only if attempted.
- If partial or recovery caveats cannot be exported, export must show `export-not-supported`.

Sync expectations:

- Sport Load sync uses existing Sport Load path.
- Live support session progress syncs if session runner is used.

Failure modes:

- Support work completion incorrectly inferred from Sport Load.
- Recovery logged but not shown on dashboard.

Defects this scenario can expose:

- Mixed-day aggregation errors.
- Role views hiding reduced-work context.

## D04 Normal training day: planned workout with drills, shooting, reflection

Scenario authority:

- `fixture-only/pre-prod until date-bound`.
- Before execution, bind to a real approved v8.4 Training Work date. Do not invent drills, shooting work, or videos.

Planned day:

- Approved v8.4 Training Work session with drill cards, video-backed drills, shooting or skill work if approved, and reflection.

Actual events:

- Session is started.
- All required drills are completed.
- Reflection is saved.
- Session is finished.

Expected records created:

- `session_attempt started`
- Multiple `drill_log completed`
- `reflection_log saved`

Expected derived day status:

- `completed`

Athlete view expectations:

- Correct v8.4 session opens.
- Drill cards and video buttons render.
- Progress advances step by step.

Parent view expectations:

- Sees completed session, readiness, drill completion, and reflection.

Today expectations:

- Shows completed or no longer prompts start after completion.

Calendar expectations:

- Date shows Training Work complete.

History expectations:

- Completed session appears with completion percent and reflection.

Dashboard expectations:

- Actual week load and completion indicators update.

KPI expectations:

- No KPI change unless session includes KPI results.

Plan vs Actual expectations:

- Planned drills align with completed drill records.

Export expectations:

- Includes session, drills, reflection, and timestamps.

Sync expectations:

- Live progress syncs during the session.
- Completion writes immutable completed session snapshot.

Failure modes:

- Video-backed v8.4 session not used.
- Live progress only available on one device.
- Completed snapshot saved but progress table not marked completed.

Defects this scenario can expose:

- Wrong session ID routing.
- Drill card/video mapping gaps.
- Completed session not reflected across screens.

## D05 Partial/interrupted session

Scenario authority:

- `fixture-only/pre-prod until date-bound`.
- Before execution, bind to a real approved v8.4 session date.

Planned day:

- Approved Training Work session.

Actual events:

- Maddox starts the session.
- Readiness is entered.
- One or more drills are completed.
- Session is interrupted before reflection or finish.

Expected records created:

- `session_attempt started`
- Optional `drill_log completed`
- `sync pending` or `sync failed` if cloud save does not complete.

Expected derived day status:

- `in_progress` while active.
- `partial` if abandoned without explicit deferral.

Athlete view expectations:

- Resume at the next unfinished step.
- Works across iPad, iPhone, and laptop when live session sync is configured.

Parent view expectations:

- Sees incomplete/partial attempt and completed steps.

Today expectations:

- Shows Resume Training Work.

Calendar expectations:

- Shows in-progress or partial badge.

History expectations:

- Shows active attempt with completion percentage.

Dashboard expectations:

- Flags incomplete session as attention item.

KPI expectations:

- KPI results entered before interruption should stay inside live session progress.
- They should not become standalone cloud KPI results in the current MVP.

Plan vs Actual expectations:

- Planned session compared with completed subset.

Export expectations:

- If exports include partial data, include partial attempt and sync caveat.
- If exports do not yet support partial attempts or sync caveats, show `export-not-supported` and keep the partial record visible elsewhere.

Sync expectations:

- Live session progress is saved to Supabase `session_progress` and localStorage.
- If Supabase fails, local fallback remains usable.
- If a record exists locally but is not cloud-synced, Today, History, Dashboard, Parent view, and Export projections must show local-only or sync-failed caveats when they include that record.

Failure modes:

- Device B starts a duplicate session instead of resuming.
- Local-only progress overwrites newer cloud progress.

Defects this scenario can expose:

- Cross-device resume failure.
- Duplicate active attempts.
- Missing partial state.

## D06 Multi-activity day: sport load + optional skill + reflection

Scenario authority:

- `fixture-only/pre-prod until date-bound`.
- Before execution, bind to a real approved v8.4 multi-activity date.

Planned day:

- Approved Sport Load plus optional or reduced skill support, with reflection/recovery expectation as applicable.

Actual events:

- Sport Load is logged.
- Optional skill is completed or deferred.
- Reflection is saved.

Expected records created:

- `sport_load_log created`
- Optional `session_attempt started`
- Optional `drill_log completed`
- `reflection_log saved`
- Optional `recovery_log saved` if storage supports it; otherwise mark `record-not-supported`.

Expected derived day status:

- `sport_load_logged`
- `completed` if all required items complete.
- `completed_with_deferred` if optional skill is deferred and day requirements are otherwise complete.

Athlete view expectations:

- Shows the correct next action without overloading the day.

Parent view expectations:

- Shows each activity separately.

Today expectations:

- Shows Sport Load and optional skill status.

Calendar expectations:

- Shows multiple records on one date.

History expectations:

- Lists Sport Load and session attempt separately.

Dashboard expectations:

- Aggregates load without double-counting optional skill.

KPI expectations:

- No KPI impact unless KPI is planned and performed.

Plan vs Actual expectations:

- Multiple actual records map to one planned day.

Export expectations:

- Includes separate sections for Sport Load, optional skill/session, and reflection.
- If optional/deferred/recovery sections are not supported in exports, export must disclose the unsupported caveat.

Sync expectations:

- Sport Load uses existing path.
- Live session progress uses `session_progress`.

Failure modes:

- Multi-activity day collapses into one completion flag.
- Reflection attaches to wrong record.

Defects this scenario can expose:

- Bad day aggregation.
- Role views showing conflicting completion states.

## D07 KPI retest day

Scenario authority:

- `fixture-only/pre-prod until date-bound`.
- Before execution, bind to a real approved v8.4 KPI retest/checkpoint date.

Planned day:

- Approved KPI retest or checkpoint day.

Actual events:

- Retest is performed.
- Results are saved.
- Reflection is saved.

Expected records created:

- `session_attempt started` if retest happens through session runner.
- `kpi_result completed`
- `reflection_log saved`

Expected derived day status:

- `completed`
- `completed_with_deferred` if any KPI item is explicitly deferred.
- If deferral storage is unsupported, show completed plus unsupported-deferral caveat instead of `completed_with_deferred`.

Athlete view expectations:

- Shows KPI instructions and current test step.

Parent view expectations:

- Shows comparison to prior baseline/current best if available.

Today expectations:

- Shows KPI checkpoint and completion state.

Calendar expectations:

- Marks KPI retest complete or deferred.

History expectations:

- Shows session or KPI record attached to day.

Dashboard expectations:

- Updates KPI trend and follow-up items.

KPI expectations:

- Retest result should affect current best/trend.
- Deferred items should not affect scoring.

Plan vs Actual expectations:

- Planned retest compared with actual result or deferment.

Export expectations:

- Includes retest attempts, best score, notes, and comparison fields if available.
- If deferred retest or comparison caveats cannot be exported, show `export-not-supported`.

Sync expectations:

- Session-runner KPI data syncs inside live session progress.
- Standalone KPI cloud sync remains out of scope.

Failure modes:

- Retest result saved locally only through standalone KPI page.
- Deferred retest counted as completed.

Defects this scenario can expose:

- KPI trend mismatch.
- Session KPI and standalone KPI duplication.

## D08 Camp day

Scenario authority:

- `fixture-only/pre-prod until date-bound`.
- Before execution, bind to a real approved v8.4 camp date.

Planned day:

- Approved camp Sport Load day with recovery-adjusted support if present in v8.4 data.

Actual events:

- Camp attendance is logged.
- Camp-specific reflections are recorded.
- Recovery is logged.
- Support work may be skipped, deferred, or completed.

Expected records created:

- `sport_load_log created`
- Camp reflection fields within Sport Load log if supported.
- `recovery_log saved` if storage supports it; otherwise mark `record-not-supported`.
- Optional session/support records.

Expected derived day status:

- `sport_load_logged`
- `recovery_logged`
- `completed` only if required day work is complete.
- `completed_with_deferred` if support work is deferred.

Athlete view expectations:

- Keeps camp as main load.
- Avoids pushing inappropriate extra dryland.

Parent view expectations:

- Shows camp effort, skating pace, confidence, communication, soreness, pain, and recovery.

Today expectations:

- Shows camp as primary Sport Load.

Calendar expectations:

- Camp day marked planned/logged.

History expectations:

- Camp log appears in Sport Load history.

Dashboard expectations:

- Camp load contributes to weekly actual load and recovery reminders.

KPI expectations:

- No KPI result unless planned and performed.

Plan vs Actual expectations:

- Camp actuals map to camp plan.

Export expectations:

- Includes camp reflection fields where available.
- If camp-specific fields or recovery caveats cannot be exported, show `export-not-supported`.

Sync expectations:

- Sport Load cloud path should sync camp log.

Failure modes:

- Camp treated as normal Training Work.
- Recovery reminder not updated.

Defects this scenario can expose:

- Sport Load type-specific fields missing from projections.
- Load aggregation errors.

## D09 Travel/recovery day

Scenario authority:

- `fixture-only/pre-prod until date-bound`.
- Before execution, bind to a real approved v8.4 travel/recovery date.

Planned day:

- Approved travel or recovery-protected day.

Actual events:

- Recovery is completed.
- No hard Training Work is started.
- Optional light activity may be recorded only if approved and actually performed.

Expected records created:

- `recovery_log saved` if storage supports it; otherwise mark `record-not-supported`.
- Optional light activity/session record if applicable.

Expected derived day status:

- `recovery_logged`
- `completed` if recovery was the required day work.
- `not_started` or `planned` if nothing is recorded yet.

Athlete view expectations:

- Shows recovery focus and avoids prompting hard work.

Parent view expectations:

- Shows recovery completion and any concerns.

Today expectations:

- Shows recovery day state.

Calendar expectations:

- Date remains recovery/travel protected.

History expectations:

- Recovery record appears if history supports recovery records.

Dashboard expectations:

- Recovery reminders clear when logged.

KPI expectations:

- No KPI result unless planned and performed.

Plan vs Actual expectations:

- Recovery planned vs recovery completed.

Export expectations:

- Includes recovery completion and notes.
- If recovery records cannot be exported, show `export-not-supported`.

Sync expectations:

- Depends on recovery storage implementation. Do not assume live session progress sync unless recovery is captured through session runner.

Failure modes:

- App prompts a hard session on recovery day.
- Recovery completion hidden from parent/operator.

Defects this scenario can expose:

- Recovery day modeled as empty day.
- Plan vs actual ignores recovery records.

## D10 Legacy/test/orphan data day

Scenario authority:

- `fixture-only/pre-prod`.
- Use local, staging, or synthetic records only. Do not mutate approved v8.4 data or production records.

Planned day:

- Any day with approved v8.4 data or no matching approved day.

Actual events:

- A legacy/mock session ID, test record, corrupt localStorage backup, or unattached record exists.

Expected records created:

- `legacy_orphan_record found`

Expected derived day status:

- `legacy_needs_review`

Athlete view expectations:

- Avoid confusing the athlete unless the record blocks current action.

Parent view expectations:

- Shows review-needed status with enough detail to decide whether to keep, attach, or ignore.

Today expectations:

- Shows warning only if the orphan affects today's action.

Calendar expectations:

- Date badge shows needs review if the record has a date.

History expectations:

- Lists record separately from approved day history.

Dashboard expectations:

- Adds needs-review attention item.

KPI expectations:

- Does not include orphan KPI-like data in trends until reviewed and attached.

Plan vs Actual expectations:

- Does not silently merge orphan data into approved plan actuals.

Export expectations:

- Includes review exception section if export scope includes data-quality issues.
- If export cannot include review exceptions, show `export-not-supported` and keep the exception visible in History/Dashboard/Parent view.

Sync expectations:

- Preserve local data.
- Do not overwrite cloud truth with unreviewed orphan data.

Failure modes:

- Orphan record is deleted.
- Orphan record is silently counted as completed work.

Defects this scenario can expose:

- Legacy route IDs treated as current v8.4 IDs.
- Corrupt/test records polluting metrics.

## Missing Scenario Candidates

- Same session edited on two devices at the same time.
- Parent reopens a completed session after the completed snapshot has already synced.
- Supabase configured but `session_progress` table not applied.
- Athlete completes Sport Load on one device and live Training Work on another.
- Local-only standalone KPI entered before a session-based KPI retest.
