# Day Status Model

## Purpose

Day status is the normalized answer to: "What is true about this day now?"

Screens must not invent their own status rules. They should project the same day-level truth through the hierarchy:

Program > Week > Day > Records > Screen projections.

## Day-Level Inputs

A day status is derived from approved plan data and user-created records.

Approved plan inputs:

- Program identity and plan version.
- Week number and phase.
- Day date.
- Planned Training Work.
- Planned Sport Load.
- Planned KPI event.
- Planned recovery requirement.
- Approved v8.4 session, drill, video, KPI, sport-load, and execution data.

Record inputs:

- `session_attempt started`
- `drill_log completed`
- `kpi_result completed`
- `kpi_result deferred`
- `reflection_log saved`
- `sport_load_log created`
- `recovery_log saved`
- `sync pending`
- `sync failed`
- `legacy_orphan_record found`

## Record Support States

Record support must be explicit. A scenario may require a record type before the application has storage for it.

Use these support states when deriving or projecting day truth:

- `supported`: the app has a storage path and can create/read the record.
- `record-not-supported`: the scenario requires the record type, but current storage cannot create/read it.
- `export-not-supported`: the app can represent the record somewhere, but the export projection cannot include it or its caveat yet.
- `manual-review-required`: the record exists but cannot be safely attached to day truth without operator review.

Rules:

- `record-not-supported` must not be treated as absence, completion, or deferral.
- `export-not-supported` must not remove the source record from screen projections.
- `manual-review-required` should normally derive `legacy_needs_review`.
- Unsupported expected records expose product gaps; they do not authorize invented data.

## Status Rules

### `not_started`

Use when:

- The day is in the approved program range.
- The day has planned work, Sport Load, KPI, or recovery.
- No user-created records exist for that date.

Do not use when:

- Any session attempt, Sport Load log, KPI result, recovery log, reflection, or legacy/orphan record exists.

### `planned`

Use when:

- The day is visible as a planned future day.
- No actual records exist yet.
- The primary purpose is preview, not execution.

Relationship to `not_started`:

- `planned` is the forward-looking projection of the same no-record state.
- `not_started` is the execution-status projection for a day that can be acted on.

### `in_progress`

Use when:

- A live session attempt exists with status `in-progress` or `reopened`.
- Completion is not recorded.

Notes:

- Drill completion may be 0% through 99%.
- Reflection may be empty or partial.
- Supabase `session_progress` should be the cross-device source when configured, with localStorage as fallback.

### `completed`

Use when:

- Planned required Training Work for the day is completed, or the live session attempt is completed.
- Required reflection is saved when the workflow requires it.
- Required Sport Load logging is complete on Sport Load days, if the day status is meant to represent the whole day rather than just Training Work.

Notes:

- A completed Training Work session must not imply Sport Load completion.
- A completed Sport Load log must not imply Training Work completion.

### `completed_with_deferred`

Use when:

- The day has completed required work.
- At least one planned KPI, drill, optional skill, or non-critical element is explicitly deferred.
- The deferment is represented by a supported explicit record or supported field.

Examples:

- Baseline KPI completed, but Puck Weave deferred.
- Sport Load completed, recovery logged, optional light skill deferred.

Fallback:

- If the app has no supported deferral record or field, do not derive `completed_with_deferred`.
- Use the closest supported completion status plus a visible `record-not-supported` caveat.

### `partial`

Use when:

- A session attempt or day record exists.
- Some work was completed.
- The day was not completed and not explicitly deferred.

Examples:

- A session starts, one drill is completed, and the athlete stops.
- A Sport Load log is started but missing key fields.

### `deferred`

Use when:

- Planned work is intentionally moved, skipped, or postponed.
- The record includes an explicit deferral reason or equivalent status.
- The deferral record type is supported.

Do not infer deferral from absence alone.

Fallback:

- If the intended deferral cannot be stored, project `record-not-supported` and preserve the scenario as a product gap.

### `sport_load_logged`

Use when:

- A Sport Load log exists for the day.
- Training Work is not necessarily complete.

Notes:

- This can combine with other statuses in projections, but the model must preserve the distinction.
- Sport Load logging must not mark Training Work complete.

### `recovery_logged`

Use when:

- Recovery work, recovery check, or post-load recovery completion is recorded.
- Training Work and Sport Load completion remain separate.

Fallback:

- If no distinct recovery storage exists, only use `recovery_logged` when a supported record or field actually captures recovery completion.
- If recovery completion is expected but unsupported, project `record-not-supported` instead of `not_started` or `completed`.

### `legacy_needs_review`

Use when:

- A record exists but cannot be confidently attached to approved v8.4 day truth.
- A record uses a legacy/mock workout ID where a v8.4 session ID is expected.
- A record date, session ID, source, or storage shape is inconsistent with current app expectations.

Expected behavior:

- Preserve the record.
- Do not silently merge it into current day truth.
- Surface it for parent/operator review.

## Status Precedence

When multiple records exist, evaluate in this order:

1. `legacy_needs_review`
2. `record-not-supported` / `manual-review-required`
3. `sync failed`
4. `sync pending`
5. `in_progress`
6. `partial`
7. `completed_with_deferred`
8. `completed`
9. `sport_load_logged`
10. `recovery_logged`
11. `deferred`
12. `planned`
13. `not_started`

Screen projections may display multiple badges, but the day-level status should remain deterministic.

## Sync Projection Rules

Sync state is attached to a record, not to the approved plan.

### `sync pending`

Use when:

- A record exists locally.
- Cloud sync is configured or expected.
- The app has not confirmed the cloud write.

Projection rule:

- The record remains valid for local screen projections.
- Screens that show parent/operator, history, dashboard, or export evidence must label the record as local/pending.

### `sync failed`

Use when:

- A record exists locally.
- Cloud sync failed or cloud schema is missing.

Projection rule:

- The app must continue locally.
- The record must not be presented as cloud-synced.
- Cross-device resume should not be promised for that record until sync succeeds.

### Local-only record

Use when:

- A record exists only in localStorage.
- The feature has no cloud storage yet, or cloud sync failed.

Projection rule:

- Athlete screens may continue to use the record.
- Parent/operator, History, Dashboard, and Export projections must show local-only or sync caveats when they include the record.
- Local-only records should not overwrite newer cloud records without explicit conflict handling.

## Export Projection Rules

Exports are downstream projections. They do not define day truth.

When export cannot represent a supported record or caveat:

- Mark the projection `export-not-supported`.
- Do not silently omit partial, deferred, sync pending, sync failed, local-only, or legacy/orphan caveats.
- Keep the source record visible in other supported screens.
- Treat the export gap as a product decision or implementation task.

## Non-Rules

- Do not derive day status from screen navigation alone.
- Do not derive Training Work completion from Sport Load logs.
- Do not derive Sport Load completion from Training Work logs.
- Do not treat local-only sync state as completion state.
- Do not invent missing drills, KPIs, videos, sessions, or coaching content.
