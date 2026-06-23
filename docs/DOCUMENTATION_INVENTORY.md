# Documentation Inventory

## Purpose

This file owns documentation inventory and consolidation status only. It does not own active scope, priority, sequencing, roadmap, defects, KPI roadmap, training/source epics, source-review items, or next-task planning.

Active scope canonical file: `docs/SCOPE.md` only.

## Current Scope Hardening Decision

Old scope-like files are now dead-end stubs. Historical detail was removed from those files to prevent AI context contamination. Historical detail is recoverable through git history.

No active work should read stub files for scope.

## Canonical Documentation Map

| Category | Canonical owner |
| --- | --- |
| Agent behavior rules | `AGENTS.md` |
| Active scope, priority, status, sequencing, roadmap, defects summary, KPI roadmap, training/source epics, source-review items, Active Execution Queue, Current Sprint / Next Codex Task | `docs/SCOPE.md` |
| Current checkpoint / handoff | `docs/SESSION_HANDOFF.md` |
| Latest agent report | `docs/AGENT_REPORT.md` |
| Documentation inventory | `docs/DOCUMENTATION_INVENTORY.md` |
| App training data source | `imports/v8.4/` |

## Dead-End Scope Stubs

These files are intentionally dead-end stubs and must not be used for current scope:

- `docs/SCOPE_LEDGER.md`
- `docs/NEXT_BUILD_PRIORITIES.md`
- `docs/NEXT_AGENT_TASK.md`
- `docs/KPI_TESTING_ROADMAP.md`
- `docs/TRAINING_SYSTEM_EPICS.md`
- `docs/DEFECT_LOG.md`
- `docs/PRODUCT_ROADMAP.md`
- `docs/AI_COACH_STRATEGY.md`
- `docs/DATA_SYNC_STRATEGY.md`
- `docs/ENVIRONMENTS.md`
- `docs/ENVIRONMENT_SAFETY.md`
- `docs/QA_TESTING_STRATEGY.md`
- `docs/TESTING_STATUS.md`
- `docs/QA_AUTOMATION_READINESS.md`
- `docs/CODEX_HANDOFF.md`
- `docs/PROJECT_STATE.md`
- `docs/MASTER_RECONCILIATION.md`

## Active Supporting Docs

These files may still be read for implementation context, QA scenarios, or project operation when relevant. They do not own active scope:

- `README.md`
- `MIGRATION_NOTES.md`
- `docs/CURRENT_PROJECT_STATE.md`
- `docs/DATA_PROPAGATION_MATRIX.md`
- `docs/DAY_PROJECTION_ADAPTER_NOTES.md`
- `docs/DAY_PROJECTION_IMPLEMENTATION_NOTES.md`
- `docs/DAY_SCENARIOS.md`
- `docs/DAY_STATUS_IMPLEMENTATION_NOTES.md`
- `docs/DAY_STATUS_MODEL.md`
- `docs/GOLDEN_FIXTURES_PLAN.md`
- `docs/KPI_CLOUD_SYNC_STAGING_TEST_PLAN.md`
- `docs/QA_TRACEABILITY_MATRIX.md`
- `docs/ROLE_EXPECTATIONS.md`
- `docs/SCREEN_EXPECTATIONS.md`
- `docs/SCREEN_PROJECTION_IMPLEMENTATION_NOTES.md`
- `docs/STARTUP.md`
- `docs/TEST_CASES.md`
- `imports/v8.4/CODEX_IMPORT_PROMPT.md`
- `imports/v8.4/README.md`

## Archive Later

After Mike reviews `docs/SCOPE.md`, consider archiving or leaving the dead-end stubs permanently. Do not restore historical bodies into active docs. Use git history for historical review.
