# Session Handoff

## Current Verified Checkpoint

- Branch: `main`.
- Latest expected commit before docs capture: `f5c35a8` (`fix(projections): clarify controlled cardio copy`).
- Repo was clean before the docs-only capture.
- `docs/SCOPE.md` remains the only canonical active scope source.
- v8.4 app import package remains authoritative for current app training data.

## Current Product QA State

- Product QA after `f5c35a8` found current-app production defects that technical checks did not fully catch.
- `DEF-029` is reopened: `/day/2026-06-30` still displayed `Bike/treadmill are controlled. No treadmill sprinting for U12.` while production badge `f5c35a8` was visible.
- `DEF-030` added: `/day/2026-06-30` showed `STEP 4 · KPI` for `Controlled bike or treadmill`.
- `DEF-031` added: `/day/2026-07-06` uses `Today's Simple Plan` while `/day/2026-06-30` uses `Planned Execution Sequence`; fixes may not apply consistently across rendering paths.
- `DEF-032` added: controlled cardio duration/load-tier classification is not explainable; `/day/2026-06-29` showed 20 minutes with `Recovery conditioning`, which needs audit.
- `AUDIT-LOAD-CLASSIFICATION-001` is the next bounded discovery task for these defects. It is discovery only and must not implement the future methodology architecture.

## Closed-Loop Architecture State

- Closed-Loop Training Intelligence is future architecture, not current app behavior.
- `DESIGN-GATE-001` now gates methodology work through conceptual, functional, technical, research/validation, transition, data-retention, QA/safety, build-readiness, and implementation stages.
- The forbidden shortcut is: Conceptual Design -> Codex prompt -> retrofit into app.
- Supporting design package lives in `docs/design/`.
- No final domain count, data source, biomechanics repository, graph/vector DB, ML service, commercial API, LLM provider, scoring runtime, recommendation strategy, or sensor/video integration is selected.

## Current Constraints

- Do not commit unless explicitly asked.
- Do not push unless explicitly asked.
- Do not edit `imports/v8.4/data/*.json` unless explicitly asked.
- Do not mutate Supabase data without explicit target confirmation.
- Do not change Supabase schema without approved technical design.
- Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.
- Do not apply the KPI cloud-sync stash during unrelated tasks.
- Run `node scripts/preflight.mjs` before production-risk work.
- Run `node scripts/confirm-write-target.mjs` before cloud writes, deploys, or backfills.

## Current Next Work Sequence

See `docs/SCOPE.md` for the Active Execution Queue and Current Sprint / Next Codex Task.

Recommended next lane:

1. Run `AUDIT-LOAD-CLASSIFICATION-001` as inspect-only discovery.
2. Map all day/activity classification and controlled cardio duration outputs across v8.4.
3. Identify rendering paths that still leak old copy or raw KPI categories.
4. Do not implement the Closed-Loop methodology architecture during the audit.
5. Fix DEF-029/030/031/032 only after the audit defines the bounded current-app path.

## Recommended Startup Reading

1. `AGENTS.md`
2. `docs/SESSION_HANDOFF.md`
3. `docs/SCOPE.md`
4. Task-specific docs/files.

## Scope Capture Check

- Defects added/updated: `DEF-029` reopened; `DEF-030`, `DEF-031`, `DEF-032` added.
- Epics/features added/updated: Closed-Loop methodology Epic group and design-governance records added in `docs/SCOPE.md`.
- Product decisions added/updated: design gate, no silent rewrites, parent approval, current-app protection, LLM/scoring separation, baseline/effective-load separation.
- Data/sync/environment decisions added/updated: no Supabase/data mutation; future no-data-loss/provenance requirements captured.
- Testing requirements added/updated: adversarial QA/safety design captured for future methodology; all-day classification audit added as next discovery.
- Docs updated: `docs/SCOPE.md`, `docs/design/`, `docs/DOCUMENTATION_INVENTORY.md`, `docs/SESSION_HANDOFF.md`.
- Items intentionally deferred: behavior fixes, app code, tests, Playwright, builds, source JSON edits, Supabase changes, methodology implementation, final domain/source/stack choices.
