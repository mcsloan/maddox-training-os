# QA Traceability Matrix

## Purpose

This matrix maps the day-level QA model from scenarios to data events, screen projections, test cases, known defects, and open product decisions.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

## Matrix

| Day scenario | Data events | Screens | Test cases | Known defects / open product decisions |
| --- | --- | --- | --- | --- |
| D01 June 15 sport-load only day | `sport_load_log created`, optional `recovery_log saved`, optional `sync pending`/`sync failed` | Today, Day, Calendar, History, Dashboard, Exports, Parent view, Athlete view | `TC-D01-SPORT-LOAD-JUN15` | Recovery record support may be field-based only; export may not include recovery/support caveats. |
| D02 June 16 KPI baseline day with Puck Weave deferred | `session_attempt started`, `kpi_result completed`, `kpi_result deferred` or `record-not-supported`, `reflection_log saved` | Today, Day, Calendar, History, Dashboard, KPIs, Exports, Parent view, Athlete view, Coach review | `TC-D02-KPI-BASELINE-JUN16` | Puck Weave deferral blocked unless approved data and explicit deferral storage exist; standalone KPI cloud sync remains out of scope. |
| D03 mixed sport + recovery day | `sport_load_log created`, optional `session_attempt started`, optional `drill_log completed`, `recovery_log saved` or `record-not-supported` | Today, Day, Calendar, History, Dashboard, Exports, Parent view, Athlete view | `TC-D03-MIXED-SPORT-RECOVERY-PENDING-DATE` | Pending approved lacrosse-date binding; recovery storage/export behavior open. |
| D04 normal training day | `session_attempt started`, `drill_log completed`, `reflection_log saved`, completed snapshot | Today, Day, Session Runner, Calendar, History, Dashboard, Exports, Parent view, Athlete view, Coach review | `TC-D04-NORMAL-TRAINING-DATE-BOUND` | Pending approved normal Training Work date binding; export coverage for all fields should be verified. |
| D05 partial/interrupted session | `session_attempt started`, optional `drill_log completed`, `sync pending`, `sync failed`, `local-only` | Today, Day, Session Runner, Calendar, History, Dashboard, Exports, Parent view, Athlete view | `TC-D05-PARTIAL-INTERRUPTED-SESSION` | Conflict handling for same session on multiple devices remains open; export partial/sync caveat support may be missing. |
| D06 multi-activity day | `sport_load_log created`, optional `session_attempt started`, optional `drill_log completed`, `reflection_log saved`, optional `recovery_log saved` | Today, Day, Calendar, History, Dashboard, Exports, Parent view, Athlete view | `TC-D06-MULTI-ACTIVITY-DAY` | Pending approved multi-activity date binding; optional/recovery/export caveat support open. |
| D07 KPI retest day | `session_attempt started` optional, `kpi_result completed`, optional `kpi_result deferred`, `reflection_log saved` | Today, Day, Calendar, History, Dashboard, KPIs, Exports, Parent view, Athlete view, Coach review | `TC-D07-KPI-RETEST` | Pending approved retest date binding; KPI deferral storage and export comparison/caveats open. |
| D08 camp day | `sport_load_log created`, camp reflection fields if supported, `recovery_log saved` or `record-not-supported` | Today, Day, Calendar, History, Dashboard, Exports, Parent view, Athlete view, Coach review | `TC-D08-CAMP-DAY` | Pending approved camp date binding; camp field and recovery export coverage open. |
| D09 travel/recovery day | `recovery_log saved` or `record-not-supported`, optional approved light activity/session record | Today, Day, Calendar, History, Dashboard, Exports, Parent view, Athlete view | `TC-D09-TRAVEL-RECOVERY` | Pending approved travel/recovery date binding; standalone recovery storage decision blocks automation. |
| D10 legacy/test/orphan data day | `legacy_orphan_record found`, `manual-review-required`, optional `export-not-supported` | Today if action-affecting, Calendar if dated, History, Dashboard, KPIs, Exports, Parent view, Coach review | `TC-D10-LEGACY-ORPHAN-REVIEW` | Operator review workflow and export exception support remain open; must prevent orphan data from polluting trends. |

## Screen Coverage Map

| Screen | Covered by test cases |
| --- | --- |
| Today | TC-D01, TC-D02, TC-D03, TC-D04, TC-D05, TC-D06, TC-D07, TC-D08, TC-D09, TC-D10 when action-affecting |
| Day | TC-D01, TC-D02, TC-D03, TC-D04, TC-D05, TC-D06, TC-D07, TC-D08, TC-D09 |
| Session Runner | TC-D02, TC-D04, TC-D05, TC-D07 if session-runner retest |
| Calendar | TC-D01 through TC-D10 when date exists |
| History | TC-D01 through TC-D10 |
| Dashboard | TC-D01 through TC-D10 |
| KPIs | TC-D02, TC-D07, TC-D10 |
| Plan | All cases as no-mutation approved-plan check |
| Exports | All cases as supported/export-not-supported projection |
| Parent view | All cases |
| Athlete view | TC-D01 through TC-D09 |
| Coach review | TC-D02, TC-D04, TC-D07, TC-D08, TC-D10 |

## Data Event Coverage Map

| Data event | Covered by test cases |
| --- | --- |
| `sport_load_log created` | TC-D01, TC-D03, TC-D06, TC-D08 |
| `kpi_result completed` | TC-D02, TC-D07 |
| `kpi_result deferred` | TC-D02, TC-D07, blocked by storage support |
| `session_attempt started` | TC-D02, TC-D04, TC-D05, TC-D06, TC-D07 |
| `drill_log completed` | TC-D04, TC-D05, TC-D06 |
| `reflection_log saved` | TC-D02, TC-D04, TC-D06, TC-D07 |
| `recovery_log saved` | TC-D01, TC-D03, TC-D06, TC-D08, TC-D09, blocked where storage unsupported |
| `sync pending` | TC-D05, optional in TC-D01, TC-D06 |
| `sync failed` | TC-D05, optional in TC-D01, TC-D06 |
| `legacy_orphan_record found` | TC-D10 |

## Product Decisions Blocking Executable Automation

- Explicit KPI deferral storage and projection rules.
- Explicit recovery-log storage, or formal decision to use existing Sport Load/session fields as recovery evidence.
- Export representation for partial attempts, deferred items, sync pending, sync failed, local-only, unsupported records, and legacy/orphan review caveats.
- Approved v8.4 date binding for D03 through D09.
- Multi-device conflict policy for same live session edited from multiple devices.
- Operator workflow for accepting, ignoring, or attaching legacy/orphan records.

## Traceability Rule

No automated test should be written from a scenario until its row identifies:

- Approved v8.4 date or fixture-only/pre-prod status.
- Supported fixture records.
- Expected day status.
- Expected screen projections.
- Known blockers explicitly marked as skipped, manual, or product-decision pending.
