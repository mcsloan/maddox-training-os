# Application Behavior Contract

## Purpose

This is the compact contract kernel for future site-wide QA generation. Tests should reference these stable contract IDs instead of duplicating long prose or creating one-off date assertions.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

If a contract lacks enough implementation detail, use:

- Status: Needs source inspection
- Reason
- Next step

## Contract Kernel

| ID | Statement | Applies to surfaces | Source / related scope or defect | Testable assertions | Forbidden outcomes | Primary test layer | Automation readiness |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ABC-001 | Day-first architecture: Program > Week > Day > Records > Screen projections. | All plan, day, record, and projection surfaces. | `docs/SCOPE.md`, `docs/DATA_PROPAGATION_MATRIX.md` | Screens derive display/status from day and record truth; no screen owns independent day facts. | Screen-specific status or plan truth that contradicts day/record truth. | Static, Vitest | Needs route inventory |
| ABC-002 | One day, one truth. | Today, Day, Session, Calendar, History, Dashboard, KPIs, Plan, Exports, Parent view. | AGENTS.md, `docs/SCOPE.md` | Same date has consistent planned title, status meaning, and record caveats across surfaces. | Same date shown as conflicting plan/status without explicit caveat. | Vitest, Playwright | Needs fixture |
| ABC-003 | Canonical activity presentation across athlete-facing surfaces. | Day, Session, Today, completed-session/read-only surfaces, athlete-visible summaries. | ACTIVITY-PRESENTATION-CONTRACT-001, DEF-021, DEF-024, DEF-027 | Athlete-facing activity title/category/duration/instruction comes from shared presentation contract or approved summary projection. | Surface-specific display patches that produce divergent labels/copy. | Vitest, Playwright | Ready for Day/Session; needs route inventory for broader surfaces |
| ABC-004 | No raw source/internal labels in athlete-facing UI. | Athlete-facing Day, Today, Session, Calendar cards, completed-session, summaries. | DEF-025, ACTIVITY-PRESENTATION-CONTRACT-001 | Known raw codes/source labels are absent from normal user-visible text. | `MOB-15`, `SS-C`, `sourceBlock`, workbook/source labels, or similar internal strings shown as primary UI. | Vitest, Playwright | Ready for known forbidden strings; needs route inventory |
| ABC-005 | Sport Load is part of the plan, not external to it. | Today, Day, Calendar, History, Dashboard, Parent view, Exports. | AGENTS.md, DATA_PROPAGATION_MATRIX | Sport Load appears as planned work and remains distinct from Training Work evidence. | Sport Load hidden as external-only or Sport Load logging completing Training Work. | Vitest, Playwright, manual UAT | Needs fixture |
| ABC-006 | History is Week > Day > Evidence. | History, Dashboard, Exports, Parent view. | AGENTS.md, DATA_PROPAGATION_MATRIX | History groups evidence by week and day and preserves record type/caveat. | Flat orphan logs without day/week context unless marked review-only. | Vitest, manual UAT | Needs source inspection |
| ABC-007 | Missing data is not deferred data. | Day, Today, Calendar, History, Dashboard, KPIs, Exports. | AGENTS.md, DAY_SCENARIOS, SCREEN_EXPECTATIONS | Deferred status appears only from explicit supported deferment data. | Absence interpreted as deferred, complete, or skipped without evidence. | Vitest | Needs fixture |
| ABC-008 | Completed-session/read-only surfaces cannot contradict canonical day/session context. | Completed-session, Previous Attempt gate, Session read-only, Day. | DEF-028 | Completed-session/read-only titles/context match shared day/session presentation where appropriate. | Completed-session title says stale legacy focus while Day/Session edit shows canonical title. | Playwright, Vitest | Needs route/state fixture |
| ABC-009 | Parent and athlete views may differ in detail but must not contradict facts. | Parent view, athlete view, Dashboard, History, Day, Today. | ROLE_EXPECTATIONS if present, SCREEN_EXPECTATIONS | Parent and athlete views can summarize differently but agree on date, status, records, and caveats. | Parent sees completed while athlete sees unresolved without explainable caveat. | Playwright, manual UAT | Needs route inventory |
| ABC-010 | Read-only QA must not click dangerous mutation actions. | Playwright tests, QA scripts, production browser checks. | QA-AUTOMATION-002, AGENTS.md | Tests avoid Finish, Save, Submit, Start Fresh Attempt, Log Training, and mutation paths unless explicitly approved in non-production. | Production test creates, deletes, backfills, saves, or finishes records. | Static, Playwright | Ready |
| ABC-011 | No silent blank days. | Today, Day, Calendar, Plan. | AGENTS.md, calendar coverage work | Every in-range date resolves to meaningful planned/recovery/status state or explicit source gap. | Blank day card/page without source-gap explanation. | Vitest, Playwright | Needs fixture |
| ABC-012 | Today equals canonical Day. | Today, Day. | AGENTS.md | Today projection for the current date matches canonical Day truth and primary action semantics. | Today invents separate status/action from Day. | Vitest, Playwright | Needs source inspection |

## Notes

- Dates such as June 19 are fixtures/examples only.
- Contract IDs should be stable. Update the statement carefully; do not create duplicate contracts for the same rule.
- If a surface needs an exception, document whether it is admin/source/reference-only or deferred with rationale.

