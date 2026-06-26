# QA Testing Pyramid

## Purpose

This document defines how Maddox Training OS turns contracts, defects, requirements, and scope into tests without creating one-off browser checks or unmaintainable matrices.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

Tests should validate that screens project shared truth. Screens are not independent sources of truth.

## Layers

| Layer | Purpose | Scope | Examples | Does not belong | When it runs | Test creation trigger | Creator | Evidence | Manual UAT impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Static / contract / traceability checks | Prove docs and test plans trace to contracts, defects, requirements, or scope IDs before code tests are written. | Contract IDs, route/surface inventory, test group coverage, dangerous-action rules. | Verify every TEST_CASES group has source contracts; check no matrix row lacks status. | Browser route behavior, data mutation, visual acceptance. | During docs/QA planning and before broad test generation. | New contract, defect, surface, or product decision. | Codex with Mike review. | Updated docs and traceability notes. | Reduces manual UAT by preventing unclear test requests, but does not prove product behavior. |
| Vitest logic/projection tests | Prove deterministic data, projection, status, and adapter logic. | Pure functions, import adapters, day/status projection, ActivityPresentation, forbidden-label filtering. | `projectPlannedDayActivities`, day status derivation, v8.4 import verification wrappers. | Browser layout, clicks, saved production records, route auth/state. | On app-code changes touching projection, adapters, status, fixtures, or shared display logic. | New projection rule, defect fix, contract assertion suitable for pure logic. | Codex. | Test output and fixture diffs. | Reduces manual UAT for logic regressions; Mike still reviews live UX and product meaning. |
| Playwright browser tests | Prove route rendering, cross-surface consistency, and read-only or safe interactions in a browser. | Route smoke, visible titles/context, forbidden strings, read-only guardrails, safe state-dependent navigation. | Day/Session title parity, completed-session read-only regression, no dangerous production clicks. | Broad data setup, mutating production flows, every date permutation, source-plan edits. | For release candidates and after UI/surface changes. | Contract requires browser evidence or defect can only reproduce through route state. | Codex, with Mike reviewing evidence. | Playwright logs, screenshots/traces when useful, qa-artifacts when generated. | Reduces repetitive manual checks; Mike still performs final product QA for important workflows. |
| Manual UAT | Validate product usefulness, wording, trust, and athlete/parent workflow fit. | Real-device checks, confusing copy, flow confidence, safety/scope acceptance. | Mike reviewing Day/Session usability, completed-session trust, iPhone behavior. | Repeating checks already covered by stable automated tests unless validating acceptance. | Before product acceptance, commit eligibility when requested, and high-risk workflow release. | New athlete-facing workflow, product decision, or automation gap. | Mike, optionally guided by Codex. | Human acceptance notes and defect updates. | Reduced by automated evidence but not eliminated. |
| Optional future CI/release gate | Run approved non-mutating checks consistently before merge/deploy. | Lint, build, Vitest, selected Playwright, v8.4 import verification, docs traceability. | GitHub Actions or local release script after explicit approval. | Production writes, package installs without approval, broad browser matrix by default. | Future approved release pipeline. | Stable local checks exist and Mike approves CI/release gate scope. | Mike/Codex. | CI logs and release checklist. | Reduces manual regression burden after the gate is trusted. |

## Layer Selection Rules

- Start with the contract or defect being tested.
- Prefer static checks for traceability and docs governance.
- Prefer Vitest for deterministic projections, adapters, status logic, and fixture rules.
- Use Playwright only when route rendering, cross-surface visibility, or browser interaction matters.
- Use manual UAT for product meaning, athlete clarity, and final acceptance.
- Do not use Playwright as a substitute for missing projection tests.
- Do not add date-specific Playwright tests when a reusable contract test can cover the rule.

## Evidence Rules

- Vitest evidence is command output and focused fixture expectations.
- Playwright evidence is command output plus screenshots/traces/artifacts only when useful.
- Meaningful Playwright artifacts should live under `qa-artifacts/`.
- Product acceptance is not automatic. A passing test can support acceptance, but Mike/product QA must accept the behavior.

