# Session Handoff

## Current Verified Checkpoint

- Branch: `main`.
- Current clean checkpoint before this docs update: `cd5d8ae` (`docs(env): audit Supabase environment mapping`).
- Completed chain: `e838ced` captured summer 4v4 scope, `0bba866` imported the 4v4 Sport Loads, `d922217` fixed Day stacked Sport Load rendering and stale Lacrosse label risk, and `f247959` fixed Plan/Gantt Sport Load sourcing from v8.4.
- Historical KPI preview checkpoint: `1c336a0` (`feat(kpis): show protocols and compute shuttle distance`).
- Vercel Preview branch `preprod/kpi-protocols-2026-06-30` showed badge `1c336a0 · preview`.
- Preview `/kpis` displayed existing KPI results/baselines similar to production. Mike's later Vercel dashboard check confirmed Preview currently points to production Supabase through All-Environments variables.
- Previous docs checkpoint: `f5c35a8` (`fix(projections): clarify controlled cardio copy`).
- Repo was clean before the docs-only capture.
- `docs/SCOPE.md` remains the only canonical active scope source.
- v8.4 app import package remains authoritative for current app training data.
- Bell Sensplex 4v4 summer hockey schedule for July-August 2026 is captured in `docs/SCOPE.md` as `SPORT-LOAD-4V4-SUMMER-2026`, a P1 planned Sport Load integration scope item.
- `SPORT-LOAD-4V4-SUMMER-2026` implementation chain is pushed through source import + Day/Today + Calendar + Plan/Gantt v8.4 Sport Load sourcing.
- New open product defect: `DEF-GANTT-SPORTLOAD-DURATION-001` — Plan/Gantt displays day-specific Sport Loads as full-week duration bars.
- New environment/data-safety defects: `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` and `DEF-SUPABASE-STAGING-AUTOPAUSE-001`.
- New QA automation ownership scope: `QA-AUTOMATION-OWNERSHIP-001`, `QA-PLAYWRIGHT-SMOKE-001`, `DEF-QA-CODEX-RUNNER-001`, and `DEF-QA-USAGE-LEDGER-001`.

## Current Product QA State

- `ENV-PREVIEW-DB-001` and `ENV-PREVIEW-DB-AUDIT-001` are completed by Mike's Vercel dashboard confirmation.
- Operational rule: do not save KPI results or perform write-capable workflows in Vercel Preview or Vercel Development until `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` is fixed, or those deployments are explicitly classified read-only.
- Product QA after `f5c35a8` found current-app production defects that technical checks did not fully catch.
- `DEF-029` is reopened: `/day/2026-06-30` still displayed `Bike/treadmill are controlled. No treadmill sprinting for U12.` while production badge `f5c35a8` was visible.
- `DEF-030` added: `/day/2026-06-30` showed `STEP 4 · KPI` for `Controlled bike or treadmill`.
- `DEF-031` added: `/day/2026-07-06` uses `Today's Simple Plan` while `/day/2026-06-30` uses `Planned Execution Sequence`; fixes may not apply consistently across rendering paths.
- `DEF-032` added: controlled cardio duration/load-tier classification is not explainable; `/day/2026-06-29` showed 20 minutes with `Recovery conditioning`, which needs audit.
- `AUDIT-LOAD-CLASSIFICATION-001` is the next bounded discovery task for these defects. It is discovery only and must not implement the future methodology architecture.
- `SPORT-LOAD-4V4-SUMMER-2026` added: Bell Sensplex 4v4 summer hockey should be integrated as planned Sport Load. It is a high-value hockey stimulus for game-speed decisions, puck touches under pressure, compete, scanning, shift-like conditioning, and confidence attacking space, not an automatic overload emergency.
- `PLAN-GANTT-SPORTLOAD-V84-001` completed: Plan/Gantt Sport Load overlays now derive from v8.4 `sportLoads` instead of stale hardcoded rows.
- `DEF-GANTT-SPORTLOAD-DURATION-001` added: Plan/Gantt must stop rendering single-day Sport Loads as full-week duration bars. Single-day Sport Loads need date-specific markers/chips; multi-day Sport Loads need actual date ranges.
- `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` added: Local, Vercel Preview, Vercel Production, staging, and production Supabase mapping must be documented without env changes or writes.
- `DEF-SUPABASE-STAGING-AUTOPAUSE-001` added: Supabase staging project `maddox-training-os-staging` / `npuankmkxbjtlokbpczz` may auto-pause from inactivity; decide whether to allow manual resume, add a safe read-only health check, or upgrade if uptime matters.
- `QA-AUTOMATION-OWNERSHIP-001` added: recurring smoke/regression work should shift from Codex-as-runner to deterministic scripts and CI.
- `QA-PLAYWRIGHT-SMOKE-001` added: create read-only smoke tests for Today, Day, Calendar, Plan/Gantt, and KPI visibility.
- `DEF-QA-CODEX-RUNNER-001` added: Codex is being used too often as a recurring manual smoke-test runner.
- `DEF-QA-USAGE-LEDGER-001` added: no prompt-level Codex usage ledger exists.

## Current Environment Mapping Status

Safe local audit on 2026-07-08 found:

| Environment / project | Supabase project ref | Status |
| --- | --- | --- |
| Local development | `npuankmkxbjtlokbpczz` | Known; `.env.local` points to staging and `scripts/env-whoami.mjs` classifies local as staging. |
| Supabase staging | `npuankmkxbjtlokbpczz` | Known; project name `maddox-training-os-staging`. |
| Supabase production | `mbjcedhysniabbaigsko` | Known from `.env.local.production-backup` URL ref and historical docs; treat as production Maddox data. |
| Vercel Production | `mbjcedhysniabbaigsko` | Confirmed by Mike in Vercel Project Settings; correct production target. |
| Vercel Preview | `mbjcedhysniabbaigsko` | Confirmed defect; Preview inherits production Supabase via variables scoped to "All Environments." |
| Vercel Development | `mbjcedhysniabbaigsko` | Confirmed defect; Development inherits production Supabase via variables scoped to "All Environments." |

Confirmed Vercel dashboard finding supplied by Mike:

- Vercel Project Settings -> Environments for `maddox-training-os` shows Supabase variables as "All Environments."
- Production `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko`.
- Preview `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko`.
- Development `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko`.
- Required future behavior: Production -> `mbjcedhysniabbaigsko`; Preview -> `npuankmkxbjtlokbpczz`; Development -> `npuankmkxbjtlokbpczz`.
- Do not copy, paste, screenshot, or commit Supabase keys, tokens, JWTs, passwords, or full secret values.
- Do not perform Preview or Vercel Development write testing until `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` is fixed or those deployments are explicitly treated read-only.

Staging auto-pause context:

- Supabase warning applies to staging project `maddox-training-os-staging`, project ref `npuankmkxbjtlokbpczz`.
- Mike reported the project is not paused yet, but may auto-pause if inactive.
- If staging pauses, local development and correctly configured Preview QA may fail until staging is resumed.
- No keepalive, billing, Supabase, or Vercel changes have been made.

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
- Do not save KPI results in Vercel Preview or Vercel Development until `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` maps those environments to staging or they are explicitly treated read-only.
- Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.
- Do not apply the KPI cloud-sync stash during unrelated tasks.
- Run `node scripts/preflight.mjs` before production-risk work.
- Run `node scripts/confirm-write-target.mjs` before cloud writes, deploys, or backfills.

## Current Next Work Sequence

See `docs/SCOPE.md` for the Active Execution Queue and Current Sprint / Next Codex Task.

Recommended next implementation order:

1. `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` — decide/fix Vercel Preview/Development staging override, no secret exposure.
2. `DEF-GANTT-SPORTLOAD-DURATION-001` — fix Gantt date semantics.
3. `QA-PLAYWRIGHT-SMOKE-001` — create deterministic Playwright smoke suite.
4. `DEF-QA-USAGE-LEDGER-001` — create Codex usage ledger.

After those items, return to the broader pre-4v4 queue: `AUDIT-LOAD-CLASSIFICATION-001` for `DEF-029`, `DEF-030`, `DEF-031`, and `DEF-032`.

## Recommended Startup Reading

1. `AGENTS.md`
2. `docs/SESSION_HANDOFF.md`
3. `docs/SCOPE.md`
4. Task-specific docs/files.

## Scope Capture Check

- Defects added/updated: `ENV-PREVIEW-DB-001` added; `DEF-029` reopened; `DEF-030`, `DEF-031`, `DEF-032` added; `DEF-GANTT-SPORTLOAD-DURATION-001`, `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`, `DEF-SUPABASE-STAGING-AUTOPAUSE-001`, `DEF-QA-CODEX-RUNNER-001`, and `DEF-QA-USAGE-LEDGER-001` added; `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` now has confirmed Vercel dashboard findings; `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` added.
- Epics/features added/updated: Closed-Loop methodology Epic group and design-governance records added in `docs/SCOPE.md`; `SPORT-LOAD-4V4-SUMMER-2026` planned Sport Load integration pushed through source import, Day/Today, Calendar, and Plan/Gantt v8.4 Sport Load sourcing; `PLAN-GANTT-SPORTLOAD-V84-001` completed; `QA-AUTOMATION-OWNERSHIP-001` and `QA-PLAYWRIGHT-SMOKE-001` added.
- Product decisions added/updated: design gate, no silent rewrites, parent approval, current-app protection, LLM/scoring separation, baseline/effective-load separation; 4v4 is planned Sport Load, not non-plan work or an automatic load-risk trigger.
- Data/sync/environment decisions added/updated: local development maps to staging ref `npuankmkxbjtlokbpczz`; Supabase staging is `maddox-training-os-staging` / `npuankmkxbjtlokbpczz`; Supabase production ref is `mbjcedhysniabbaigsko`; Vercel Production points to production; Vercel Preview and Development currently point to production through All Environments variables; no Preview/Development writes until staging override is fixed or those deployments are explicitly read-only; no Supabase/data mutation.
- Testing requirements added/updated: adversarial QA/safety design captured for future methodology; all-day classification audit remains pending; Plan/Gantt Sport Load overlay tests added locally; deterministic Playwright smoke scope added through `QA-PLAYWRIGHT-SMOKE-001`.
- Docs updated: `docs/SCOPE.md`, `docs/design/`, `docs/DOCUMENTATION_INVENTORY.md`, `docs/SESSION_HANDOFF.md`; later source-capture update added the 4v4 schedule and this capture added Gantt duration, environment-safety, and QA automation ownership scope.
- Items intentionally deferred: Vercel env changes, behavior fixes, app code, tests, Playwright implementation, builds, source JSON edits, Supabase changes, staging keepalive/billing decision, methodology implementation, final domain/source/stack choices.
