# Golden Fixtures Plan

## Purpose

This plan defines fake/pre-prod fixture records needed to exercise the day-level QA model without using real production data.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

Fixtures must never edit `imports/v8.4/data/*.json`, mutate production data, or invent approved training content. They may reference approved v8.4 IDs only as anchors.

## Fixture Principles

- Use pre-prod Supabase, localStorage, or isolated test stores only.
- Keep fixture record IDs visibly synthetic, for example `fixture-d05-partial-session`.
- Use approved v8.4 plan/session/Sport Load/KPI IDs only when the scenario is explicitly v8.4-backed or date-bound.
- Do not create fake drills, videos, KPIs, sessions, phases, or Sport Loads.
- Represent unsupported records as caveat fixtures, not fabricated app records.
- Include sync-state fixtures separately from completion-state fixtures.

## Fixture Groups

### FG-01 Sport Load Log Fixture

Purpose:

- Supports D01, D03, D06, D08.

Required fields:

- Synthetic log ID.
- Approved planned Sport Load ID.
- Date.
- Attendance.
- Actual duration if supported.
- Effort, energy, confidence, difficulty, soreness, pain flag.
- Recovery completed if current Sport Load log shape supports it.
- Source field preserved as Sport Load/external-load internal source where the app requires it.

Constraints:

- Must not mark Training Work complete.
- Must not create or complete a session attempt.

### FG-02 Live Session Progress Fixture

Purpose:

- Supports D04 and D05.

Required fields:

- Synthetic session progress ID.
- Approved v8.4 session/workout ID.
- Date.
- `status`: `in-progress`, `reopened`, or `completed`.
- Current step.
- Readiness fields.
- Drill completion map using approved drill IDs.
- Reflection fields when applicable.
- `sync pending`, `sync failed`, or cloud-synced state as separate fixture metadata.

Storage targets:

- LocalStorage session record for local fallback cases.
- Supabase `session_progress` row for cross-device cases in pre-prod.

Constraints:

- Must not write to production Supabase.
- Must not alter completed `session_logs` unless the fixture is specifically testing completion snapshot behavior in pre-prod.

### FG-03 Completed Session Snapshot Fixture

Purpose:

- Supports D04, D05 export/history expectations, and completed history projections.

Required fields:

- Synthetic completed snapshot ID.
- Approved v8.4 session/workout anchor.
- Completed `SessionLog` shape.
- Drill logs.
- Reflection.
- Timestamps.

Storage target:

- Pre-prod `session_logs` only, or local fixture equivalent.

Constraints:

- Do not use production completed history.

### FG-04 KPI Completion Fixture

Purpose:

- Supports D02 and D07.

Required fields:

- Synthetic KPI result ID.
- Approved KPI ID from v8.4 or app data.
- Date.
- Attempts.
- Best result.
- Notes.
- Source session ID if entered through session runner.

Constraints:

- If standalone KPI cloud sync is unsupported, fixture must mark standalone records `local-only`.
- Do not create KPI results for unapproved KPIs.

### FG-05 KPI Deferral Caveat Fixture

Purpose:

- Supports D02 and D07.

Required fields:

- Scenario ID.
- Date.
- Planned KPI or item label only if approved data contains it.
- Caveat type: `record-not-supported` unless explicit deferral storage exists.
- Reason text for manual review.

Storage target:

- Documentation/test harness metadata until app storage exists.

Constraints:

- Do not infer deferral from a missing KPI score.
- Do not fabricate Puck Weave or any KPI item if it is not present in approved data.

### FG-06 Recovery Caveat Fixture

Purpose:

- Supports D01, D03, D06, D08, D09.

Required fields:

- Scenario ID.
- Date.
- Caveat type: `record-not-supported` unless recovery is captured by an existing supported field.
- Reference to the supported field when applicable, such as Sport Load recovery completion or session reflection.

Constraints:

- Do not create a fake recovery storage model.
- Do not mark the day completed solely because recovery was expected.

### FG-07 Sync State Fixture

Purpose:

- Supports D05 and all local-only/sync projection tests.

Fixture variants:

- `sync pending`: local record exists, cloud confirmation absent.
- `sync failed`: local record exists, cloud write failed or table missing.
- `local-only`: feature has no cloud path or record has never synced.
- `cloud-synced`: matching pre-prod cloud row exists.

Required fields:

- Record ID.
- Record type.
- Device ID.
- Last local update timestamp.
- Last cloud update timestamp when applicable.
- Warning/caveat expected on projections.

Constraints:

- Sync state must not change completion status by itself.

### FG-08 Legacy/Orphan Fixture

Purpose:

- Supports D10.

Fixture variants:

- Legacy/mock workout ID where v8.4 session ID is expected.
- Unattached KPI-like record.
- Corrupt localStorage backup.
- Record with date outside approved program range.

Required fields:

- Synthetic record ID.
- Source/type.
- Optional date.
- Reason it cannot attach to approved day truth.
- Expected `manual-review-required` caveat.

Constraints:

- Must not overwrite cloud truth.
- Must not be merged into KPI trends, completion counts, or plan-vs-actual without review.

## Scenario Fixture Map

| Scenario | Fixture groups |
| --- | --- |
| D01 | FG-01, FG-06, FG-07 optional |
| D02 | FG-02, FG-04, FG-05, FG-07 optional |
| D03 | FG-01, FG-02 optional, FG-06, FG-07 optional |
| D04 | FG-02, FG-03, FG-07 |
| D05 | FG-02, FG-07 |
| D06 | FG-01, FG-02 optional, FG-06, FG-07 |
| D07 | FG-02 optional, FG-04, FG-05, FG-07 optional |
| D08 | FG-01, FG-06, FG-07 optional |
| D09 | FG-06, FG-02 optional |
| D10 | FG-08 |

## Open Fixture Blockers

- Explicit KPI deferral storage does not appear to be defined yet.
- Explicit standalone recovery-log storage may not exist.
- Export fixture format for partial/deferred/sync caveats is not defined.
- Approved v8.4 date binding is still needed for D03 through D09 before executable tests can claim current-data coverage.
- Concurrency fixtures for same-session multi-device edits are not defined.

## Recommended Fixture Order

1. Create local-only fixtures for D05 and D10 because they do not require production data mutation.
2. Create pre-prod cloud fixtures for `session_progress`.
3. Add Sport Load fixture coverage for D01.
4. Bind D03 through D09 to approved v8.4 dates.
5. Decide KPI deferral and recovery storage before automating D02, D07, D09 caveats.
