# Route Surface Coverage Matrix

## Purpose

This compact matrix routes future QA coverage by surface. It is not a complete route inventory and is not a test suite.

## Anti-Bloat Warning

One row per surface or surface group. Do not add one row per date. Do not duplicate full contract text. If route/component ownership is unknown, use `Status: Needs route/component inspection`.

## Initial Surface Inventory

| Surface | Purpose | Likely source/projection | Applicable contract IDs | Mutation risk | Automation readiness | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Today | Current-day action and status. | Canonical Day projection / day records. | ABC-001, ABC-002, ABC-011, ABC-012 | Medium if logging actions are present. | Needs route/component inspection. | Status: Needs route/component inspection |
| Day | Date-specific planned work, evidence, status, and primary action. | v8.4 dayExecutionPlan, day presentation, records. | ABC-001, ABC-002, ABC-003, ABC-004, ABC-005, ABC-007, ABC-011 | Medium if start/log buttons are present. | Partially ready through existing Day/Session evidence. | Status: Needs route/component inspection |
| Session | Active/edit training workflow. | ActivityPresentation plus session/drill enrichment and session records. | ABC-002, ABC-003, ABC-004, ABC-010 | High if save/finish actions are clicked. | Partially ready for read-only assertions. | Status: Needs route/component inspection |
| Calendar | Date navigation and day summary status. | v8.4 date coverage plus day/status summaries. | ABC-001, ABC-002, ABC-005, ABC-011 | Low if read-only. | Needs route/component inspection. | Status: Needs route/component inspection |
| History | Week > Day > Evidence review. | Day evidence records and sync caveats. | ABC-001, ABC-006, ABC-007, ABC-009 | Low/medium depending on edit/delete features. | Needs route/component inspection. | Status: Needs route/component inspection |
| Dashboard | Parent/operator summaries and attention items. | Day/evidence summaries, KPI/load/recovery projections. | ABC-001, ABC-002, ABC-005, ABC-007, ABC-009 | Low if read-only. | Needs route/component inspection. | Status: Needs route/component inspection |
| KPIs | KPI results, trends, and deferred/unsupported status. | KPI records, day/session context, KPI roadmap. | ABC-002, ABC-007, ABC-009 | Medium if entry forms are present. | Needs fixture and route/component inspection. | Status: Needs route/component inspection |
| Plan | Plan overview and approved plan context. | v8.4 plan/phase/Gantt/import projections. | ABC-001, ABC-005, ABC-011 | Low if read-only. | Needs route/component inspection. | Status: Needs route/component inspection |
| Exports | Report/export output. | Day/week records, projections, caveats. | ABC-001, ABC-006, ABC-007, ABC-009 | Medium if export generation writes files or records. | Needs source inspection. | Status: Needs source inspection |
| Parent view | Parent/operator details and review state. | Day evidence, records, summaries. | ABC-002, ABC-005, ABC-006, ABC-009 | Low/medium depending on edits. | Needs route/component inspection. | Status: Needs route/component inspection |
| Completed-session/read-only surfaces | Completed attempt display and previous-attempt review. | Saved session records plus canonical presentation context. | ABC-003, ABC-004, ABC-008, ABC-010 | Low if read-only; high if reopen/save paths are clicked. | Needs route/state fixture. | Status: Needs route/component inspection |
| Admin/debug surfaces if present or suspected | Source/reference inspection and operator diagnostics. | Raw/source/debug data. | ABC-001, ABC-010 | Medium/high depending on controls. | Manual/source inspection first. | Status: Needs source inspection |

