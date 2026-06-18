# QA Testing Strategy

## Principle

Testing is part of the product, not an afterthought. Maddox Training OS handles real youth athlete training data, so regressions can affect trust, parent decisions, and historical evidence.

## Existing QA Reference Docs

These docs already exist and remain supporting material:

- `docs/DAY_SCENARIOS.md`
- `docs/DATA_PROPAGATION_MATRIX.md`
- `docs/ROLE_EXPECTATIONS.md`
- `docs/DAY_STATUS_MODEL.md`
- `docs/SCREEN_EXPECTATIONS.md`
- `docs/TEST_CASES.md`
- `docs/GOLDEN_FIXTURES_PLAN.md`
- `docs/QA_TRACEABILITY_MATRIX.md`
- `docs/QA_AUTOMATION_READINESS.md`

## Required Test Layers

- Unit tests for pure projection logic
- Smoke tests for v8.4 import integrity
- Regression tests for canonical day scenarios
- Golden fixtures
- Playwright E2E tests for critical flows
- Cross-device sync validation
- Staging cloud-write tests
- Production smoke checklist
- Release gate before deploy
- Test status documentation

## Critical Flows

- Today -> canonical Day
- Day -> Log Today -> Save -> reload
- iPad save -> parent browser view
- KPI save -> cloud -> other device
- Calendar status matches day evidence
- History groups by Week -> Day -> Evidence
- Dashboard summaries match day evidence
- Blank/rest days display explicitly
- Homepage does not show stale Next Session
- Production vs staging environment safety

## Release Gate Direction

Before deploying data-affecting work:

1. Confirm environment target.
2. Run lint/build/import verification for app-code changes.
3. Run unit/projection tests where available.
4. Run staging cloud-write tests for cloud sync changes.
5. Run production smoke checklist only with real production data.
6. Update `docs/TESTING_STATUS.md`.
