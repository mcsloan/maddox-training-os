# Data Propagation Matrix

## Purpose

This matrix shows how each event type should propagate from day-level records into screen projections.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

## Support and Caveat Rules

Use these caveats consistently across the matrix:

- `record-not-supported`: the event is required by a scenario, but the app cannot store/read that record type yet.
- `export-not-supported`: the event exists or is expected, but export cannot include the record or caveat yet.
- `local-only`: the event exists only in localStorage or another device-local store.
- `sync pending`: the event exists locally and cloud confirmation has not completed.
- `sync failed`: cloud confirmation failed; local record remains valid on the current device.

If a record type is unsupported, the event should still appear as a validation requirement in docs/test cases, but screens must not fabricate the record or infer completion/deferment from absence.

## Matrix

| Event type | Today | Calendar | History | Dashboard | KPIs | Plan | Exports | Parent view | Athlete view |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sport_load_log created` | Show Sport Load logged state; do not mark Training Work complete. | Mark Sport Load logged on that date. | List Sport Load log. | Update logged Sport Loads, effort, energy, soreness, pain, recovery reminders. | No direct KPI effect. | No plan mutation. | Include Sport Load log and planned-vs-actual load details. | Show Sport Load complete and recovery follow-up. | Show Sport Load logged or update action. |
| `kpi_result completed` | Show KPI done if today has KPI work. | Mark KPI complete on date. | Show within session or KPI history. | Update KPI summary/trend. | Add result to KPI history and derived best/baseline/current. | No plan mutation. | Include KPI result, attempts, best result, notes. | Show completed KPI and any concerns. | Show KPI complete in workflow. |
| `kpi_result deferred` | Show deferred item and remaining day state. | Mark KPI deferred on date. | Show deferred item attached to day/session. | Flag deferred KPI as follow-up. | Preserve as deferred, not completed. | No plan mutation. | Include deferment reason/status. | Show follow-up needed. | Show item deferred and next action if any. |
| `session_attempt started` | Show Resume Training Work. | Mark day in progress. | List active/in-progress attempt. | Add incomplete session attention item. | No standalone KPI update unless KPI is entered. | No plan mutation. | Include partial attempt if export scope includes in-progress data. | Show started, percent complete, sync state. | Resume at current step. |
| `drill_log completed` | Update live progress and next step. | Mark day in progress or partial until full completion. | Show in attempt details. | Update completion percent and actual work evidence. | No direct KPI effect. | No plan mutation. | Include drill completion and notes. | Show completed drills and missing drills. | Mark drill done and advance workflow. |
| `reflection_log saved` | Show reflection complete for current attempt. | Support completed or partial status. | Show reflection in session history. | Surface confidence, difficulty, improvement, notes. | No direct KPI effect. | No plan mutation. | Include reflection. | Show parent-relevant notes and confidence. | Show finish/complete feedback. |
| `recovery_log saved` | Show recovery logged. | Mark recovery logged on date. | Show recovery record if history supports it. | Update recovery reminders. | No direct KPI effect. | No plan mutation. | Include recovery completion and notes. | Show recovery done or concern. | Show recovery done or remaining prompt. |
| `sync pending` | Show local saved/cloud pending warning when action-relevant. | Optional sync badge. | Show local/pending state for affected record. | Add sync attention item. | Show local-only or pending if KPI sync exists. | No plan mutation. | Include caveat that record may be local-only. | Show follow-up warning. | Keep workflow usable locally. |
| `sync failed` | Show local fallback warning; do not block training. | Show sync issue badge. | Show local backup mode for affected record. | Add sync failure attention item. | Keep local KPI usable. | No plan mutation. | Include sync failure caveat. | Show cloud sync failed and local backup retained. | Continue local session. |
| `legacy_orphan_record found` | Show review warning if record affects today. | Badge date as needs review. | List under review, not merged silently. | Add needs-review item. | Do not include in KPI trends unless attached. | No plan mutation. | Include in exception/review section. | Show record needs operator review. | Avoid confusing athlete unless it blocks current action. |

## Unsupported or Local-Only Event Projection

| Caveat | Today | Calendar | History | Dashboard | KPIs | Plan | Exports | Parent view | Athlete view |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `record-not-supported` | Show only if it affects today's action or status. | Optional badge on affected date. | Show as product gap if record was expected. | Add attention item when parent/operator action is needed. | Show unsupported deferral/result caveat; do not score. | No plan mutation. | Show `export-not-supported` if export cannot include the caveat. | Show what cannot yet be captured. | Avoid blocking unless the missing record prevents safe execution. |
| `export-not-supported` | No completion effect. | No completion effect. | Show export-readiness gap if relevant. | Add export-readiness attention item if parent/operator needs it. | No score effect. | No plan mutation. | Explicitly state the export cannot include the record/caveat yet. | Show that screen data is richer than export data. | Usually hidden. |
| `local-only` | Allow current-device use; show caveat if resume across devices is expected. | Badge only if local record affects date status. | Show local-only status. | Add sync/local-only attention item. | Show local-only KPI entries until KPI sync exists. | No plan mutation. | Include local-only caveat or mark `export-not-supported`. | Show not available across devices yet. | Continue current-device workflow. |
| `sync pending` | Show cloud pending if action-relevant. | Optional pending badge. | Show pending state. | Add sync attention item. | Show pending only for supported synced KPI records. | No plan mutation. | Include pending caveat or mark `export-not-supported`. | Show follow-up if cloud evidence is needed. | Continue locally. |
| `sync failed` | Show local fallback warning; continue locally. | Sync issue badge. | Show local backup mode. | Add sync failure attention item. | Keep local KPI usable; do not imply cloud trend. | No plan mutation. | Include failure caveat or mark `export-not-supported`. | Show cloud sync failed and local backup retained. | Continue locally. |

## Propagation Principles

- Records are appended or updated at the record layer first.
- Day status is derived after records are evaluated.
- Screens project the day status and record details.
- Plan screens must stay anchored to approved plan data.
- Sport Load and Training Work records remain separate.
- Sync state is a record-level condition, not a completion state.
- Deferment must be explicit; missing results are not deferred results.
- Unsupported expected records remain product gaps.
- Export gaps must be represented as export gaps, not by hiding the source record.

## Known Current Constraints

- Live session progress can sync through Supabase `session_progress` when configured.
- Completed session history can sync through Supabase `session_logs`.
- Sport Load logs can sync through `session_logs` with `source = external_load`.
- Standalone KPI entries remain local-only unless a future KPI sync pass changes that.
- Training Work logs remain local-only unless a future Training Work sync pass changes that.
