# Current Project State

## Current Verified State - June 30, 2026

This section is the current checkpoint. Historical June 22 and June 17/18 state is preserved below and should not be treated as current unless restated here.

- Branch: `main`.
- Current commit before environment-risk docs capture: `1c336a0` (`feat(kpis): show protocols and compute shuttle distance`).
- Vercel Preview branch `preprod/kpi-protocols-2026-06-30` showed badge `1c336a0 · preview`.
- Preview `/kpis` displayed existing KPI results/baselines similar to production; this is unverified and does not prove whether Preview uses production Supabase, staging Supabase seeded/copied with similar data, or another mirrored source.
- `ENV-PREVIEW-DB-001` and `ENV-PREVIEW-DB-AUDIT-001` are now active in `docs/SCOPE.md`.
- Do not save KPI results or perform write-capable workflows in Vercel Preview until `ENV-PREVIEW-DB-AUDIT-001` confirms Preview uses staging/non-production, or Preview is explicitly classified read-only.
- Previous docs checkpoint: `f5c35a8` (`fix(projections): clarify controlled cardio copy`).
- `docs/SCOPE.md` is the canonical owner for active scope, defects, priorities, roadmap, and next-task ownership.
- Product QA after `f5c35a8` reopened `DEF-029` and added `DEF-030`, `DEF-031`, and `DEF-032`.
- Next bounded discovery task is `AUDIT-LOAD-CLASSIFICATION-001`.
- Closed-Loop Training Intelligence is registered as future design-governed architecture, not current app behavior.
- `docs/design/` contains the supporting design-gate, conceptual, research, scoring, RACI, risk, decision, functional backlog, and technical backlog docs.
- v8.4 app import package remains authoritative for current app training data.
- No app behavior, tests, source JSON, Supabase, package, build, commit, or push action is implied by the docs capture.

## Historical Current Verified State - June 22, 2026

This section is the current checkpoint. Historical June 17/18 state is preserved below and should not be treated as current unless restated here.

- Branch: `main`.
- Current commit: `7b48a3e` (`Render calendar from v8.4 day coverage`).
- Calendar coverage from v8.4 is fixed and accepted.
- v8.4 app import package is authoritative for training plan data.
- Active v8.4 plan range: `2026-06-15` through `2026-09-06`.
- v8.4 has 84/84 `dayExecutionPlan` dates and 84/84 session dates.
- Current active product issue after docs reconciliation: Activity Prescription Display Layer.
- KPI cloud-sync stash exists and must not be applied unless explicitly requested: `stash@{0} WIP KPI cloud sync before master reconciliation`.

## Current Product Shape

Maddox Training OS is a private youth hockey training PWA for Maddox, a 2015 birth-year U12 competitive hockey player. It serves Maddox live, a parent/operator, and coach review.

The system is intended to become a professional-grade training operating system with:

- Maddox live training mode
- Parent/coach dashboard
- Source-of-truth training database
- Export/report engine
- Hockey IQ/mindset system
- KPI testing and trend system
- Readiness/recovery intelligence
- QA/regression system
- Later AI Coach layer

## Current Confirmed Wins

- `/today` routes to canonical Day flow.
- Friday June 19 is usable enough for training.
- Direct `/day/2026-06-20` works and shows `Game-speed skill and shooting volume.`
- Calendar renders all 84 v8.4 dates, including June 20 and June 21.
- Sport Load logging and Training Work logging remain separate.
- v8.4 source JSON remains unchanged for recent projection/navigation fixes.
- `docs/SCOPE.md` is the only active scope source and identifies the Active Execution Queue and Current Sprint / Next Codex Task.

## Current Open Scope Themes

| Theme | Priority | Lane | Status | Canonical owner |
| --- | --- | --- | --- | --- |
| Scope/docs reconciliation | P0 | Docs-only | In progress | `docs/SCOPE.md` |
| Documentation inventory/consolidation | P0 | Docs-only | In progress | `docs/DOCUMENTATION_INVENTORY.md` |
| Environment/data safety reconciliation | P0 | Docs-only | Not started | `docs/SCOPE.md` |
| Activity Prescription Display Layer | P1 | Fast lane | Not started | `docs/SCOPE.md` |
| Future-day readiness audit from June 23 onward | P1 | Fast lane | Not started | `docs/SCOPE.md` |
| KPI roadmap and advanced KPI scope | P1 | Safe lane | In progress | `docs/SCOPE.md` |
| OvertimeAthlete source ingestion | P2 | Source-review | Scope review required | `docs/SCOPE.md` |
| Agentic workflow evaluation | P3 | Future roadmap | Scope review required | `docs/SCOPE.md` |

## Canonical Rules

- v8.4 import package remains authoritative for training plan data.
- Do not invent workouts, drills, phases, sport loads, sessions, videos, KPIs, or coaching logic.
- Do not edit `imports/v8.4/data/*.json` unless explicitly instructed.
- Do not call sport loads "external" in user-facing language.
- Camps, lacrosse, 4v4, and on-ice sessions are part of the plan, not external to it.
- Today must equal the canonical Day page.
- One day, one truth.
- Missing data is not deferred data; deferral must be explicit.
- No silent blank days. Every date must resolve to a meaningful day state.
- Recovery days are intentional low-intensity development days where appropriate, not blanks.
- Gemini/OvertimeAthlete recommendations are scope-review/source-review inputs only until reconciled into approved source docs.

## Historical Checkpoint - June 18, 2026

Historical only. This section explains prior docs and should not override the current verified state above.

Earlier docs reconciled project memory as of June 18, 2026, when:

- KPI cloud-sync implementation had been created locally but was stashed.
- Stash name was `WIP KPI cloud sync before master reconciliation`.
- A patch file was referenced at `.wip/2026-06-17-kpi-cloud-sync-wip.patch`.
- June 17 Sport Load / Log Today cross-device save had been observed.
- Staging Supabase had been created and baseline tables were confirmed.
- Several docs still referenced stale branch, deployment, and KPI backfill states.

Those claims are historical unless restated in the current verified section.

## Current Handoff Constraints

- Do not apply the KPI cloud-sync stash during docs or unrelated app work.
- Do not modify KPI code unless the task explicitly resumes KPI cloud sync.
- Do not add `.wip/` to git.
- Do not display or commit secrets.
- Run target-confirmation scripts before cloud writes, deploys, or production-risk actions.
