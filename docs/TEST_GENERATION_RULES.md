# Test Generation Rules

## Purpose

This document defines how future Codex sessions should generate tests from repo docs without creating broad, brittle, or mutating test suites.

## Required Traceability

- Do not generate tests directly from vague prose.
- Every test must trace to at least one contract, requirement, defect, or scope item.
- Preferred trace order:
  1. `docs/APPLICATION_BEHAVIOR_CONTRACT.md`
  2. `docs/SCOPE.md`
  3. defect rows such as DEF-028
  4. scenario/status/screen/data docs
  5. Mike-approved product decision
- If traceability is missing, record:
  - Status: Needs source inspection
  - Reason
  - Next step

## Layer Selection

- Classify the test layer before writing code.
- Prefer Vitest for projection/data/status logic.
- Reserve Playwright for browser routes, visible surfaces, and safe interaction coverage.
- Use manual UAT for product acceptance, wording trust, and real-device confidence.
- Do not use Playwright to cover pure projection logic that can be tested faster and more deterministically in Vitest.

## Production Safety

- Do not create mutating Playwright tests against production.
- Read-only Playwright tests must not click dangerous mutation actions such as Finish Session, Save, Submit, Start Fresh Attempt, Log Today's Training, or Start / Log Today's Training.
- No test may mutate Supabase, run migrations, backfill, delete, or create fake production records unless a separate explicit approved task allows it in the correct environment.

## Fixture Rules

- Use dates only as fixtures/examples.
- Do not make June 19 or any other single date the testing model.
- v8.4 import data remains authoritative for plan data.
- If source data or fixture support is missing, mark the test group as needing fixture/source inspection rather than inventing details.
- Detailed day-scenario-derived cases in `docs/DAY_SCENARIO_TEST_CASES.md` may feed fixtures, Vitest cases, Playwright cases, and manual UAT, but executable tests should still route through `docs/TEST_CASES.md` test groups and contract IDs.

## Documentation Rules

- Update `docs/TEST_CASES.md` when tests are added or changed.
- Keep `docs/TEST_CASES.md` at test-group level until a group is ready to expand.
- Keep detailed scenario expectations in `docs/DAY_SCENARIO_TEST_CASES.md`; do not duplicate them into `docs/TEST_CASES.md`.
- Save meaningful Playwright evidence under `qa-artifacts/`.
- Do not duplicate full contract text inside matrices or test cases. Link by contract ID.

## Acceptance Rule

No automated test result is product acceptance by itself. A test can support acceptance, but behavior is not product-accepted until Mike/product QA accepts it.
