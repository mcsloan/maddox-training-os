# Test Cases

## Purpose

This document owns test groups before they expand into concrete tests. It intentionally avoids hundreds of date-specific rows.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

No test group authorizes changing approved v8.4 data, mutating production data, installing tools, or inventing training content.

Detailed day-scenario-derived test material lives in `docs/DAY_SCENARIO_TEST_CASES.md`. That file preserves scenario fixture expectations; this file remains the compact test-group registry.

## Expansion Rule

Expand a group into concrete tests only when:

- it traces to contract/requirement/defect/scope IDs
- the test layer is selected
- fixture/source needs are known
- mutation risk is controlled
- Mike/product acceptance criteria are clear

If information is missing, use:

- Status: Needs source inspection
- Reason
- Next step

## Initial Test Groups

| Test group | Source contracts | Related defects | Intended test layer | Surfaces covered | Fixture needs | Automation readiness | Not-yet-expanded note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TCG-001 Site-wide route smoke coverage | ABC-001, ABC-002, ABC-011 | DEF-016, DEF-027 | Playwright, static | Today, Day, Session, Calendar, History, Dashboard, KPIs, Plan, Exports, Parent view | Route inventory; safe read-only route list. | Needs route/component inspection | Start with one row per surface, not one row per date. |
| TCG-002 Canonical activity presentation across surfaces | ABC-003, ABC-008 | DEF-021, DEF-024, DEF-027, DEF-028 | Vitest, Playwright | Day, Session, completed-session/read-only, Today summaries | ActivityPresentation fixtures; completed-session route/state fixture. | Partially ready for Day/Session; completed-session needs fixture/state. | Expand after source path for completed-session is inspected. |
| TCG-003 Forbidden raw/source labels across athlete-facing UI | ABC-004 | DEF-025, DEF-027 | Vitest, Playwright | Day, Session, Today, Calendar, completed-session, summaries | Known forbidden string list; route inventory. | Partially ready | Keep assertions contract-based; do not add one test per date. |
| TCG-004 Today/Day/Session consistency | ABC-002, ABC-003, ABC-012 | DEF-021, DEF-022, DEF-024 | Vitest, Playwright | Today, Day, Session | Current-date fixture and representative v8.4 dates. | Needs source inspection | Today must equal canonical Day before broader route claims. |
| TCG-005 Calendar/History/Dashboard day-status consistency | ABC-001, ABC-002, ABC-006, ABC-007 | DEF-014, DEF-016, DEF-027 | Vitest, Playwright | Calendar, History, Dashboard, Day | Day status fixtures with explicit caveats. | Needs fixture | Validate status meanings, not every date combination. |
| TCG-006 KPI visibility and deferred status | ABC-002, ABC-007 | DEF-016, KPI roadmap items | Vitest, Playwright, manual UAT | Day, KPIs, Dashboard, History, Calendar | KPI baseline/retest fixtures; explicit deferral support inspection. | Needs fixture | Missing KPI data must not become deferred data. |
| TCG-007 Sport Load as planned work | ABC-005 | DEF-014, data propagation risks | Vitest, Playwright | Today, Day, Calendar, History, Dashboard, Parent view | Sport Load day fixtures and record/caveat fixtures. | Needs fixture | Sport Load and Training Work evidence remain separate. |
| TCG-008 Completed-session/read-only regression coverage | ABC-003, ABC-004, ABC-008, ABC-010 | DEF-028 | Playwright, Vitest | Completed-session/read-only at `app/session/[id]/page.tsx?mode=view`, Previous Attempt gate, Session, Day | Saved-session/read-only route state fixture; safe navigation guards; existing `e2e/activity-presentation-proof.spec.ts` is proof-of-life only and did not exercise this branch. | Needs completed-session/read-only fixture/state | Do not mutate saved session records to create the state. Route ownership is recorded; concrete test generation remains deferred. |
| TCG-009 Read-only QA dangerous-action guardrails | ABC-010 | QA-AUTOMATION-002, DEF-028 | Static, Playwright | Playwright specs and QA scripts | Dangerous action list; route inventory. | Ready for existing proof spec; broader suite needs inventory. | Guardrails must fail before unsafe clicks. |
| TCG-010 Sync/status visibility coverage | ABC-001, ABC-002, ABC-006, ABC-007 | sync/status risks in data propagation docs | Vitest, Playwright, manual UAT | Today, Day, History, Dashboard, KPIs, Exports | Local-only, sync pending, sync failed, record-not-supported fixtures. | Needs fixture | Do not imply cloud sync or completion without explicit evidence. |
