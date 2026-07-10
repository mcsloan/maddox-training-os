# Session Handoff

## Current Verified Checkpoint

- Branch: `main`.
- Current clean checkpoint before this focused fix: `3d4c1d2` (`docs(gantt): record accepted production smoke`).
- The accepted daily-scale Gantt is pushed to `main`, live in production, and production-smoked.
- Completed chain: `e838ced` captured summer 4v4 scope, `0bba866` imported the 4v4 Sport Loads, `d922217` fixed Day stacked Sport Load rendering and stale Lacrosse label risk, and `f247959` fixed Plan/Gantt Sport Load sourcing from v8.4.
- Historical KPI preview checkpoint: `1c336a0` (`feat(kpis): show protocols and compute shuttle distance`).
- Vercel Preview branch `preprod/kpi-protocols-2026-06-30` showed badge `1c336a0 · preview`.
- Preview `/kpis` displayed existing KPI results/baselines similar to production. Mike's later Vercel dashboard check confirmed Preview previously pointed to production Supabase through All-Environments variables; the Vercel config has since been split by environment.
- Previous docs checkpoint: `f5c35a8` (`fix(projections): clarify controlled cardio copy`).
- Repo was clean before the docs-only capture.
- `docs/SCOPE.md` remains the only canonical active scope source.
- v8.4 app import package remains authoritative for current app training data.
- Bell Sensplex 4v4 summer hockey schedule for July-August 2026 is captured in `docs/SCOPE.md` as `SPORT-LOAD-4V4-SUMMER-2026`, a P1 planned Sport Load integration scope item.
- `SPORT-LOAD-4V4-SUMMER-2026` implementation chain is pushed through source import + Day/Today + Calendar + Plan/Gantt v8.4 Sport Load sourcing.
- `DEF-GANTT-SPORTLOAD-DURATION-001` is fixed: Mike visually accepted the daily Gantt locally, and `8c51cc8` was pushed and production-smoked.
- `DEF-REACT-DUPLICATE-KEY-EASY-SPIN-001` is fixed locally: KPI instruction renderers use contextual KPI ID plus instruction index keys, and both valid repeated `Easy spin 2 minutes.` entries remain visible.
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
- `DEF-GANTT-SPORTLOAD-DURATION-001` completed: production served `8c51cc8`; `/plan` returned 200; `Phase Gantt`, `Sport Loads / Events / Testing`, `Methodology Phases`, exact-day milestones, and exact-date bars were present.
- Gantt production smoke confirmed production Supabase ref `mbjcedhysniabbaigsko` present and staging ref `npuankmkxbjtlokbpczz` absent.
- `DEF-REACT-DUPLICATE-KEY-EASY-SPIN-001` fixed locally: `KPIProtocolDetails` and `SessionKPIForm` used `key={instruction}` for a KPI whose valid protocol repeats `Easy spin 2 minutes.`; both now use `${kpi.id}-instruction-${index}` without changing content.
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
| Vercel Preview | `npuankmkxbjtlokbpczz` | Confirmed final config for new deployments; existing old Preview deployments remain production-risk until replaced or verified. |
| Vercel Development | `npuankmkxbjtlokbpczz` | Confirmed final config for new deployments. |

Completed Vercel environment split supplied by Mike on 2026-07-09:

- Production has exactly two Supabase rows and no All Environments Supabase rows.
- Preview has exactly two Supabase rows and no All Environments Supabase rows.
- Development has exactly two Supabase rows and no All Environments Supabase rows.
- Production `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko`.
- Preview `NEXT_PUBLIC_SUPABASE_URL` points to `npuankmkxbjtlokbpczz`.
- Development `NEXT_PUBLIC_SUPABASE_URL` points to `npuankmkxbjtlokbpczz`.
- Production anon key was restored as Production-scoped.
- Preview anon key was set from staging.
- Development anon key was set from staging.
- No Supabase variables remain scoped to All Environments.
- Do not copy, paste, screenshot, or commit Supabase keys, tokens, JWTs, passwords, or full secret values.
- Environment-variable changes affect new deployments.
- Existing old Preview deployments should still be treated as production-risk until replaced or verified.
- Do not redeploy Production as part of the docs-only environment capture.
- Do not perform Preview write testing until a fresh Preview deployment is verified to use staging.

Production runtime smoke after env split:

- Production runtime verification passed on 2026-07-09.
- Served Production output contained commit/hash `87355a4`, which was pushed after the Vercel environment split.
- Production routes returned 200: `/`, `/today`, `/plan`, `/calendar`, `/dashboard`, `/kpis`, `/history`.
- Production output/bundles referenced production Supabase ref `mbjcedhysniabbaigsko`.
- Production output/bundles did not reference staging Supabase ref `npuankmkxbjtlokbpczz`.
- `/api/kpi-export` returned 200 JSON.
- KPI export mode: `cloud`.
- KPI export count: `21`.
- Expected Maddox KPI indicators were visible/readable.
- No writes, config changes, redeploys, commits, pushes, Supabase changes, file edits, or secrets occurred during the smoke.
- Preview/Development runtime verification remains pending.
- Old Preview deployments remain production-risk until replaced or verified.
- Fresh Preview deployment must be verified as staging before Preview write testing.

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
- Do not save KPI results in Vercel Preview until a fresh Preview deployment is verified to use staging or the deployment is explicitly treated read-only.
- Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.
- Do not apply the KPI cloud-sync stash during unrelated tasks.
- Run `node scripts/preflight.mjs` before production-risk work.
- Run `node scripts/confirm-write-target.mjs` before cloud writes, deploys, or backfills.

## Current Next Work Sequence

See `docs/SCOPE.md` for the Active Execution Queue and Current Sprint / Next Codex Task.

Recommended next implementation order:

1. Review the locally completed `DEF-REACT-DUPLICATE-KEY-EASY-SPIN-001` fix and commit if accepted; do not push unless Mike asks.
2. Verify a fresh Preview runtime uses staging before Preview write testing.
3. `QA-PLAYWRIGHT-SMOKE-001` — create deterministic Playwright smoke suite.
4. `DEF-QA-USAGE-LEDGER-001` — create Codex usage ledger.

Plan/Gantt date-semantics notes:

- Week 7 is `2026-07-27` to `2026-08-02`.
- Week 8 is `2026-08-03` to `2026-08-09`.
- Corrected visual model: the Phase Gantt must be a daily-scale Gantt with 84 day columns, not weekly cells containing stacked labels.
- Current compacting correction after Mike's failed local visual review: Gantt rows are 28px lanes with centered 16px bars and 20px markers; header uses week label, weekday letters, then day-of-month numbers only.
- Second compacting correction: the remaining whitespace source was the Gantt body's `h-7` label, `min-h-7` timeline grid, and `h-7` empty day cells. Current body rows use shared 22px lanes with 12px bars and 16px markers.
- Third visual correction: broken weekly separators were caused by row-local `border-r`/weekly `border-l` day-cell borders. Current body uses continuous chart-level vertical grid lines and full-height weekly rules.
- Fourth visual correction: header/body line misalignment came from separate geometry: header grid with gaps/flexible columns versus body percentage overlay math. Current Gantt uses a shared fixed timeline geometry: `12rem` label plus 84 `1.1rem` day columns.
- Current refinement: Gantt body is split into two visual sections. Upper section is `Sport Loads / Events / Testing`; lower section is `Methodology Phases`.
- Current sticky-label correction: normal row labels now remain frozen during horizontal scroll; the issue was row-level `overflow-hidden` clipping sticky labels while section headers were not clipped.
- Aug 3 4v4 and Aug 3 Toronto Trip return day are therefore Week 8.
- Toronto Trip range is `Jul 31-Aug 3`, spanning Week 7 and Week 8.
- Chase Hull Camp range is `Jul 6-10`.
- Carleton Ravens Camp range is `Aug 4-7`.
- Sensplex Camp range is `Aug 24-28`.
- Marc O'Connor Ice and 4v4 remain single-day markers on their actual dates.
- Single-day Sport Loads should render as point markers; multi-day Sport Loads should render as bars spanning exact start/end dates.

After those items, return to the broader pre-4v4 queue: `AUDIT-LOAD-CLASSIFICATION-001` for `DEF-029`, `DEF-030`, `DEF-031`, and `DEF-032`.

## Recommended Startup Reading

1. `AGENTS.md`
2. `docs/SESSION_HANDOFF.md`
3. `docs/SCOPE.md`
4. Task-specific docs/files.

## Scope Capture Check

- Defects added/updated: `DEF-REACT-DUPLICATE-KEY-EASY-SPIN-001` fixed locally with contextual KPI instruction keys; duplicate valid content is preserved.
- Epics/features added/updated: Closed-Loop methodology Epic group and design-governance records added in `docs/SCOPE.md`; `SPORT-LOAD-4V4-SUMMER-2026` planned Sport Load integration pushed through source import, Day/Today, Calendar, and Plan/Gantt v8.4 Sport Load sourcing; `PLAN-GANTT-SPORTLOAD-V84-001` completed; `QA-AUTOMATION-OWNERSHIP-001` and `QA-PLAYWRIGHT-SMOKE-001` added.
- Product decisions added/updated: design gate, no silent rewrites, parent approval, current-app protection, LLM/scoring separation, baseline/effective-load separation; 4v4 is planned Sport Load, not non-plan work or an automatic load-risk trigger.
- Data/sync/environment decisions added/updated: Gantt production smoke confirmed production ref `mbjcedhysniabbaigsko` present and staging ref `npuankmkxbjtlokbpczz` absent; no Supabase/data mutation or configuration change occurred.
- Testing requirements added/updated: focused KPI protocol render regression proves repeated text remains twice and no duplicate-key error is emitted; `TCG-006` traceability updated.
- Docs updated: `docs/SCOPE.md`, `docs/SESSION_HANDOFF.md`, `docs/AGENT_REPORT.md`, and `docs/TEST_CASES.md`.
- Items intentionally deferred: fresh Preview runtime verification, Playwright smoke implementation, Supabase/Vercel changes, source JSON edits, and unrelated product work.
