# Master Reconciliation

## Purpose

This file is the durable scope checkpoint for Maddox Training OS. Future Codex sessions and future ChatGPT chats should use this as the top-level reconciliation index before making product, data, testing, or implementation decisions.

## One Day Truth

Product decision:

- Today must route to the canonical Day page.
- The canonical Day page owns the day experience.
- There must not be a separate stale Today experience.
- Calendar, Dashboard, History, KPIs, and Exports should become projections from canonical Day evidence.

Current status:

- `/today` redirects to `/day/<today-date>`.
- `/day/2026-06-17` is the canonical June 17 experience.
- Log Today captures lacrosse load plus skill, shooting, bike, mobility, reflection, and parent notes.

## Source Data Truth

The approved app import package is `imports/v8.4/`.

Rules:

- Use v8.4 for daily execution, sport loads, sessions, drills, video map, KPI data, and locked Gantt model.
- Do not edit `imports/v8.4/data/*.json` unless explicitly instructed.
- Do not invent workouts, drills, phases, sport loads, sessions, videos, KPIs, or coaching logic.
- Use adapter/mapping code such as `lib/imports/v8_4/` when wiring v8.4 data into the app.

## Data Integrity Truth

Cross-device evidence matters more than local convenience.

Known state:

- Sport Load / Log Today uses a cloud-backed path and was verified cross-device.
- Standalone KPI results are local-only in production until KPI cloud sync is resumed, staged, validated, committed, and deployed.
- The stashed KPI cloud-sync WIP is not production code.
- Recovered June 16 KPI values are known, but production backfill has not been executed.

## Environment Truth

- Production Supabase is real Maddox data only.
- Staging Supabase should be a separate free project, not a preview branch, unless explicitly chosen later.
- Local development must point to staging once staging exists.
- Vercel Preview must point to staging once staging exists.
- Vercel Production must point to production.
- No fake/test records in production.
- KPI backfill into production must be intentional and documented.
- Cloud-write tests must run against staging unless the record is real Maddox historical data.
- Never recommend cloud-write testing without confirming target environment.

## Reconciled Documentation Map

- Current state: `docs/CURRENT_PROJECT_STATE.md`
- Scope ledger: `docs/SCOPE_LEDGER.md`
- Defects: `docs/DEFECT_LOG.md`
- Roadmap: `docs/PRODUCT_ROADMAP.md`
- Training epics: `docs/TRAINING_SYSTEM_EPICS.md`
- KPI roadmap: `docs/KPI_TESTING_ROADMAP.md`
- QA strategy: `docs/QA_TESTING_STRATEGY.md`
- Testing status: `docs/TESTING_STATUS.md`
- Data sync: `docs/DATA_SYNC_STRATEGY.md`
- Environments: `docs/ENVIRONMENTS.md`
- AI Coach: `docs/AI_COACH_STRATEGY.md`
- Next priorities: `docs/NEXT_BUILD_PRIORITIES.md`
- Session handoff: `docs/SESSION_HANDOFF.md`

Existing QA reference docs remain valid supporting material:

- `docs/DAY_SCENARIOS.md`
- `docs/DATA_PROPAGATION_MATRIX.md`
- `docs/ROLE_EXPECTATIONS.md`
- `docs/DAY_STATUS_MODEL.md`
- `docs/SCREEN_EXPECTATIONS.md`
- `docs/TEST_CASES.md`
- `docs/GOLDEN_FIXTURES_PLAN.md`
- `docs/QA_TRACEABILITY_MATRIX.md`
- `docs/QA_AUTOMATION_READINESS.md`

## Future Work Rule

Every meaningful work session must update or explicitly review scope docs, defect logs, product decisions, testing status, environment/sync decisions, and next priorities before or alongside implementation.
