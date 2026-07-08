# Scope

## Purpose

This is the canonical scope, priority, status, sequencing, roadmap, defects-summary, KPI-roadmap, training/source-epic, source-review, and next-task document for Maddox Training OS.

Other planning docs may retain historical detail temporarily, but active scope decisions should be represented here.

## Current Checkpoint

- Branch: `main`.
- Current checkpoint before this audit: `897b42b` (`docs(scope): capture environment and QA automation defects`), and the working tree was clean before the environment-mapping docs update.
- Completed chain: `e838ced` captured summer 4v4 scope, `0bba866` imported the 4v4 Sport Loads, `d922217` fixed Day stacked Sport Load rendering, and `f247959` fixed Plan/Gantt Sport Load sourcing from v8.4.
- New next-scope capture: `DEF-GANTT-SPORTLOAD-DURATION-001`, `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`, `DEF-SUPABASE-STAGING-AUTOPAUSE-001`, `QA-AUTOMATION-OWNERSHIP-001`, `QA-PLAYWRIGHT-SMOKE-001`, `DEF-QA-CODEX-RUNNER-001`, and `DEF-QA-USAGE-LEDGER-001` are now the immediate scope-control items before additional implementation.
- Earlier docs capture after commit `1c336a0` (`feat(kpis): show protocols and compute shuttle distance`); Vercel Preview for `preprod/kpi-protocols-2026-06-30` showed badge `1c336a0 · preview`.
- Preview `/kpis` displayed existing KPI results/baselines similar to production. This does not prove Preview is using production Supabase; database target is unverified and must be audited before any Preview write testing.
- Previous docs checkpoint: docs capture after pushed commit `f5c35a8` (`fix(projections): clarify controlled cardio copy`); repo was clean before that docs-only capture.
- Product QA after `f5c35a8` found remaining production Day rendering defects: `DEF-029` is reopened, and `DEF-030`, `DEF-031`, and `DEF-032` are added as P1 product-trust defects.
- Bell Sensplex 4v4 summer hockey schedule for July-August 2026 is captured as `SPORT-LOAD-4V4-SUMMER-2026`, a P1 planned Sport Load integration scope item. It is a high-value hockey stimulus, not an automatic overload emergency.
- Summer 4v4 implementation chain is pushed through `f247959`: source import, Day/Today, Calendar, and Plan/Gantt now derive planned Sport Loads from v8.4 where expected.
- Closed-Loop Training Intelligence is registered as a future design-governed architecture program. It is not current app behavior and must not be retrofitted into the current application until `DESIGN-GATE-001` passes.
- Previous projection-readiness checkpoint: repo clean and synced after pushed commit `6ab3f5e` (`test(projections): cover all v8.4 day readiness`).
- Tonight's stabilization commits are pushed: `9fd4c73` (`fix(session): align completed summary title with canonical presentation`), `c20432c` (`fix(projections): align planned activity classification across day and session`), and `05019f5` (`test(projections): cover day-session parity across v8.4 sessions`).
- Earlier settled production baseline: local `main` == `origin/main` == Vercel production at the time of Phase 1 completion.
- Last verified pushed/deployed production baseline before this realignment: `f02bff4` (`docs(scope): correct checkpoint wording before push`).
- Production badge confirmed: `v0.1.0 · f02bff4 · production`.
- Historical pre-hardening production baseline: `7b48a3e` (`Render calendar from v8.4 day coverage`).
- Git state is the repo source of truth; browser/build badges are runtime context only.
- Phase 1 docs/scope-control checkpoint is complete.
- Calendar coverage from v8.4 was fixed and accepted.
- v8.4 covers all 84 dates from `2026-06-15` through `2026-09-06`.
- v8.4 app import package remains authoritative for app training data.
- Stash exists and must not be applied unless explicitly requested: `stash@{0} WIP KPI cloud sync before master reconciliation`.
- ACTIVITY-PRESCRIPTION-001A/B/C produced local uncommitted app-code WIP, but it is blocked and not commit-ready.
- `SURFACE-PRESENTATION-CONSUMER-AUDIT-001` is completed as an inspect-only audit; no files were changed during the audit.
- `QA-AUTOMATION-002` Playwright proof-of-life is completed: installed Google Chrome channel launched successfully on macOS Catalina `10.15.8` without bundled browser install.
- `DEF-028` is fixed, automated-tested, committed, and pushed at `9fd4c73`; completed-session/read-only now prefers canonical day/session presentation title without mutating saved records.
- Day + active Session planned-activity parity is verified across all 84 v8.4 active session dates by `05019f5`.
- All 84 v8.4 plan dates from `2026-06-15` through `2026-09-06` are verified athlete-usable at the Day projection layer by `6ab3f5e`; no manual UAT is required for this risk.
- QA Contract Framework Loop 1B completed as inspect-only route/component discovery.
- QA Contract Framework Loop 1C records discovered route/component ownership in QA docs only; no app behavior or test generation.
- Next stabilization lane should be selected from the remaining P1 queue; data-write/sync tasks still require separate approval.

## Scope System Rules

- `docs/SCOPE.md` owns active scope, priority, status, sequencing, roadmap, defects summary, KPI roadmap, training/source epics, source-review items, and next-task planning.
- `AGENTS.md` owns durable Codex rules.
- `docs/SESSION_HANDOFF.md` owns the current checkpoint/handoff only.
- `docs/AGENT_REPORT.md` owns the latest agent report only.
- `docs/DOCUMENTATION_INVENTORY.md` owns temporary documentation inventory and consolidation recommendations.
- Do not create new planning markdown files without explicit user approval.
- If new scope is discovered, add or update a record here using the Minimum Record Template.
- Before answering "what is next", inspect this file.

## Scope Hardening

Old scope-like markdown files are dead-end stubs. Do not read them for active scope, priority, sequencing, roadmap, defects, KPI roadmap, training/source epics, source-review items, or next-task ownership.

Historical detail for those files is recoverable through git history. This avoids contaminating future AI context with stale planning bodies.

## Minimum Record Template

Every active scope item should use this structure, either as a detailed record below or as a compact row in an index that links to a detailed record.

- ID:
- Title:
- Type: Initiative / Epic / Feature / Defect / Decision / Source Review / Task
- Parent:
- Priority: P0 / P1 / P2 / P3
- Status: Scope review required / Not started / In progress / Blocked / Completed / Deferred / Historical
- Lane: Docs-only / Fast lane / Safe lane / Source-review / Future roadmap
- Owner:
- Source:
- Problem:
- Desired outcome:
- In scope:
- Out of scope:
- Acceptance criteria:
- Dependencies:
- Risks:
- Next action:
- Links / evidence:

## Status Model

- Scope review required
- Not started
- In progress
- Reopened / product QA found incomplete rendering-path coverage
- Blocked
- Completed
- Deferred
- Historical

`Scope review required` means the item must be inspected/reconciled before implementation. It does not mean ready to code.

## Priority Model

- P0: data integrity, production safety, scope-control blockers.
- P1: core workflow or product-trust failure.
- P2: confusing UX, incomplete explanation, or medium defect.
- P3: future enhancement.

## Lane Model

- Docs-only
- Fast lane
- Safe lane
- Source-review
- Future roadmap

## Product Decisions

| ID | Decision | Status | Links / evidence |
| --- | --- | --- | --- |
| DEC-DAY-001 | Today must route to canonical Day page; one day, one truth. | In progress | `AGENTS.md`, `docs/SESSION_HANDOFF.md` |
| DEC-SOURCE-001 | v8.4 app import package is authoritative for app training data. | Completed | `imports/v8.4/README.md` |
| DEC-CALENDAR-001 | Calendar date coverage must come from v8.4, not legacy `data/plan.json`. | Completed | Commit `7b48a3e` |
| DEC-EVIDENCE-001 | Missing data is not deferred data; deferral must be explicit. | In progress | prior KPI roadmap content merged here; use git history only |
| DEC-RECOVERY-001 | Recovery days are not blank days; appropriate recovery days include intentional low-intensity development work. | In progress | prior training epics content merged here; use git history only |
| DEC-SPORTLOAD-001 | Sport Load logging and Training Work logging remain independent. | Completed | `AGENTS.md` |
| DEC-LANGUAGE-001 | User-facing UI should say `Sport Load`, not `External Load`, except legacy/internal names. | In progress | `AGENTS.md` |
| DEC-KPI-001 | Compare Maddox against himself over time, not adult/NHL standards. | Completed | KPI roadmap intake |
| DEC-KPI-002 | Do not use flat 400m as the primary hockey-shift test; prefer a 45-second repeated shuttle / shift simulation. | Completed | KPI roadmap intake |
| DEC-AI-001 | AI Coach recommends; parent approves. | Not started | Prior AI Coach strategy content merged here; use git history only |
| DEC-SOURCE-REVIEW-001 | Gemini/OvertimeAthlete recommendations are source-review inputs only, not source of truth. | Completed | Gemini intake |
| DEC-DESIGN-GATE-001 | Closed-Loop Training Intelligence implementation is forbidden until conceptual, functional, technical, research/validation, transition, data-retention, integration, QA/safety, and build-readiness gates are accepted. | In progress | `DESIGN-GATE-001`, `docs/design/DESIGN_GATE.md` |
| DEC-CURRENT-APP-001 | Current Maddox Training OS remains the production system; v8.4 remains authoritative while future methodology architecture is designed in parallel. | In progress | `TRANSITION-001`, `docs/design/DESIGN_GATE.md` |
| DEC-METHODOLOGY-001 | No silent plan rewrites; future recommendation-driven adjustments require parent approval and audit trail. | In progress | `MODEL-GOVERNANCE-001`, `docs/design/DECISION_LOG.md` |
| DEC-SCORING-001 | LLMs may extract structured exercise attributes, but final exercise-domain scores must come from deterministic, testable scoring rules plus review/approval gates. | In progress | `KNOWLEDGE-INGESTION-001`, `HEURISTIC-SCORING-001` |
| DEC-LOAD-VECTOR-001 | Expert/rule-derived baseline domain vectors and athlete-specific personalized effective load vectors are separate concepts; athlete output must not mutate the global baseline matrix. | In progress | `ATHLETE-PERSONALIZATION-001` |
| DEC-RESEARCH-001 | Open-source/research repositories may inform validation and thresholds, but no repository, dataset, commercial API, graph DB, vector DB, ML service, or final domain count is selected by this docs capture. | In progress | `RESEARCH-REPOSITORIES-001`, `DOMAIN-DECISION-001`, `docs/design/DECISION_LOG.md` |

## Active Execution Queue

| Order | ID | Title | Priority | Status | Lane | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SCOPE-CONSOLIDATION-001 | Scope system consolidation | P0 | Completed | Docs-only | Phase 1 docs/scope-control checkpoint is complete after the `f02bff4` pushed/deployed baseline. |
| 2 | ENV-SAFETY-RECON-001 | Environment/data safety reconciliation | P0 | Completed | Docs-only | Mike review of findings; require explicit approval before any write/deploy/backfill. |
| 3 | ENV-PREVIEW-DB-001 | Vercel Preview Supabase environment is unverified / may be sharing production-like KPI data | P1 | Not started | Docs-only / environment-safety | Treat Vercel Preview as no-write until `ENV-PREVIEW-DB-AUDIT-001` verifies target isolation. |
| 4 | ENV-PREVIEW-DB-AUDIT-001 | Verify Vercel Preview Supabase target | P1 | Not started | Docs-only / environment-safety | Verify Production, Preview, and local Supabase project refs without exposing secrets before Preview write testing. |
| 4.5 | SPORT-LOAD-4V4-SUMMER-2026 | Bell Sensplex 4v4 Summer Hockey Integration | P1 | Completed | Source-review -> Safe lane app import | Source import, Day/Today, Calendar, and Plan/Gantt Sport Load sourcing are pushed through `f247959`. |
| 4.6 | PLAN-GANTT-SPORTLOAD-V84-001 | Render Plan/Gantt Sport Load overlays from v8.4 Sport Loads | P1 | Completed | Fast lane | Plan/Gantt now derives Sport Load overlay rows and week summaries from v8.4 `sportLoads`. |
| 4.7 | DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | Preview/Staging/Production Supabase mapping is not sufficiently visible | P1 | In progress | Docs-only / environment-safety | Local/staging/production refs are documented; Vercel Preview and Production env values still need dashboard confirmation without exposing secrets. |
| 4.8 | DEF-GANTT-SPORTLOAD-DURATION-001 | Plan/Gantt displays day-specific Sport Loads as full-week duration bars | P1 | Not started | Fast lane | Fix Plan/Gantt date semantics so single-day Sport Loads are markers/chips and multi-day Sport Loads show actual spans. |
| 4.9 | QA-AUTOMATION-OWNERSHIP-001 | Shift recurring smoke/regression testing from Codex to deterministic scripts and CI | P1 | Not started | Docs-only / QA ownership | Define ownership model: Codex writes tests, scripts/CI run repeatable tests, Codex analyzes failures, Mike does product acceptance. |
| 4.10 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | Not started | Safe lane / QA automation | Add read-only smoke coverage for Today, Day, Calendar, Plan/Gantt, and KPI visibility after ownership scope is captured. |
| 4.11 | DEF-QA-CODEX-RUNNER-001 | Codex is being used as a recurring manual smoke-test runner | P1 | Not started | Docs-only / QA workflow | Capture the workflow defect and move repeat smoke checks into deterministic scripts/CI. |
| 4.12 | DEF-SUPABASE-STAGING-AUTOPAUSE-001 | Supabase staging project at risk of inactivity auto-pause | P2 | In progress | Docs-only / environment-safety | Warning and project ref are documented; decision remains whether to allow manual resume, add a safe read-only health check, or upgrade if staging uptime matters. |
| 4.13 | DEF-QA-USAGE-LEDGER-001 | No prompt-level Codex usage ledger exists | P2 | Not started | Docs-only / workflow | Define a lightweight usage ledger after the environment and Gantt duration items are handled. |
| 5 | CODE-COMMENT-AUDIT-001 | Stale Inline Comment / TODO Audit | P1 | Not started | Fast lane | Run inspect-only comment audit before the next app-code implementation task if time allows. |
| 6 | FORENSIC-DAY-SESSION-MISMATCH-001 | Forensic Day/Session data-flow audit | P1 | Completed | Fast lane | Audit found Day and Session use divergent presentation paths; use findings to drive canonical contract. |
| 7 | SURFACE-PRESENTATION-CONSUMER-AUDIT-001 | Site-wide activity presentation consumer audit | P1 | Completed | Fast lane | Audit completed; use findings to constrain the next Day + Session parity implementation. |
| 8 | ACTIVITY-PRESENTATION-CONTRACT-001 | Planned activity presentation contract, Day + Session parity only | P1 | Completed | Fast lane | Implemented and pushed through `c20432c`; all 84 v8.4 active session dates are covered by `05019f5`. |
| 9 | ACTIVITY-PRESCRIPTION-001 | Activity Prescription Display Layer | P1 | Blocked | Fast lane | Current WIP is not commit-ready; address DEF-021 through DEF-027 before acceptance or commit. |
| 10 | TEST-FIXTURE-001 | Verify and Establish Test Fixture Structure | P1 | Not started | Fast lane | Inspect-only QA fixture discovery before or alongside the first Activity Prescription implementation task. |
| 11 | FUTURE-DAY-READINESS-001 | Future-day readiness audit from June 23 onward | P1 | Completed | Fast lane | Automated proof at `6ab3f5e` verifies all 84 v8.4 plan dates are athlete-usable at the Day projection layer. |
| 12 | CONDITIONING-CARDIO-DURATION-001 | Permanent load-based controlled bike/treadmill duration rule | P1 | Completed | Fast lane / canonical plan-source or projection-rule implementation | Completed by `a01beca`; shared planned-activity projection now applies load-based controlled cardio durations while preserving Day/active Session parity. |
| 13 | ACTIVITY-LOGGING-001 | Activity-specific logging fields | P1 | Scope review required | Safe lane | Define fields after prescription display is stable. |
| 14 | DAY-SESSION-PARITY-001 | Day/Session sequence parity | P1 | Completed | Fast lane | Day + active Session planned-activity parity is projection-verified across all 84 v8.4 active session dates. |
| 15 | PLAN-CONTENT-001 | Plan content/title correctness | P1 | Not started | Source-review | Review title/block mismatches against v8.4 source. |
| 16 | RECOVERY-DAY-MODEL-001 | Recovery-day model completion | P1 | Not started | Source-review | Ensure intentional recovery prescriptions are represented from source. |
| 17 | KPI-ROADMAP-001 | KPI roadmap and advanced KPI scope | P1 | In progress | Safe lane | Preserve scope; implement only after sync/model review. |
| 18 | DAY-FIRST-ARCH-001 | Day-first architecture docs/test fixtures | P1 | Not started | Docs-only | Add fixtures and acceptance docs around canonical Day projection. |
| 19 | KPI-HISTORY-DASHBOARD-001 | KPI/History/Dashboard reconciliation | P1 | Not started | Safe lane | Reconcile projections after day evidence model stabilizes. |
| 20 | QA-SYSTEM-001 | QA/testing system | P1 | Not started | Safe lane | Route/component ownership is recorded; latest projection proofs cover DEF-028 and Day/active Session parity without manual UAT. |
| 21 | QA-AUTOMATION-002 | Playwright proof-of-life strategy | P1 | Completed | Safe lane | Playwright installed Chrome channel proof-of-life passed locally; use it as a base for targeted DEF-028 regression after display/projection repair. |
| 22 | SESSION-UX-001 | Medium Session UX backlog | P2 | Not started | Fast lane | Improve session usability after core workflow readiness. |
| 23 | SOURCE-INGEST-OTA-001 | OvertimeAthlete source ingestion | P2 | Scope review required | Source-review | Ingest/review source later; do not replace v8.4. |
| 24 | RECOVERY-READINESS-001 | Recovery/readiness system | P2 | Not started | Safe lane | Add readiness fields and parent review model later. |
| 25 | EXPORTS-REPORTING-001 | Exports/reporting | P2 | Not started | Safe lane | Reconcile after evidence model is trusted. |
| 26 | HOCKEY-IQ-001 | Hockey IQ system | P2 | Not started | Source-review | Build Watch -> Apply -> Reflect later from approved sources. |
| 27 | DEF-029 | Controlled bike/treadmill copy clarity | P1 | Reopened / product QA found incomplete rendering-path coverage | Fast lane | Run `AUDIT-LOAD-CLASSIFICATION-001` before another narrow rendering fix. |
| 28 | DEF-030 | Controlled cardio activity displays as KPI | P1 | Not started | Fast lane | Audit Day rendering/classification path for `/day/2026-06-30`; do not change behavior in docs capture. |
| 29 | DEF-031 | Multiple day presentation formats produce inconsistent day/activity rendering | P1 | Not started | Fast lane | Audit Simple Plan vs Planned Execution Sequence paths for classification, safety copy, and source-label suppression. |
| 30 | DEF-032 | Controlled cardio duration/load-tier classification is not explainable | P1 | Not started | Source-review / Fast lane audit | Run all-day load classification audit; explain controlled-cardio duration sources before changing rules. |
| 31 | AUDIT-LOAD-CLASSIFICATION-001 | All-day load classification audit | P1 | Not started | Docs-only / inspect-only | Discovery only: map day/activity classification, durations, copy leaks, KPI category leaks, and rendering paths. |
| 32 | DESIGN-GATE-001 | Conceptual to Functional to Technical Design Governance | P1 | In progress | Docs-only / design-governance | Gate Closed-Loop methodology through accepted design packages before implementation. |
| 33 | TRANSITION-001 | Current App Protection and Closed-Loop Architecture Transition Plan | P1 | In progress | Docs-only / architecture-safety | Keep current app stable; design methodology layer in parallel before integration. |
| 34 | DATA-GOV-001 | Data Retention, Provenance, and Integrity Design | P1 | In progress | Docs-only / data-governance | Define versioning, provenance, audit, no-data-loss, and no silent mutation requirements. |
| 35 | SOURCE-VALIDATION-001 | Exercise Domain Scoring Source and Validation Strategy | P1 | In progress | Docs-only / research-capture | Define source/validation candidates and scoring governance without selecting authoritative sources. |
| 36 | METHODOLOGY-001 | Closed-Loop Training Methodology Architecture | P1 | Scope review required | Future roadmap / design-gated | Future multi-Epic architecture track; implementation priority not decided. |
| 37 | AI-COACH-001 | AI Coach strategy | P3 | Not started | Future roadmap | Start only after data/sync/QA trust and methodology governance. |
| 38 | AGENTIC-WORKFLOW-001 | Agentic workflow evaluation | P3 | Scope review required | Future roadmap | Review workflow tools/process after product P1s. |

## Current Sprint / Next Codex Task

Current sprint: tactical 4v4 Sport Load sourcing is complete through `f247959`, but Plan/Gantt still needs date-semantics cleanup for single-day versus multi-day Sport Loads. Before more implementation, capture and sequence the environment-safety and QA-automation ownership work so Codex is not repeatedly used as an ad hoc smoke-test runner.

Next task brief:

- Read `AGENTS.md`, `docs/SESSION_HANDOFF.md`, and this file first.
- First complete the remaining dashboard confirmation for `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`: verify Vercel Preview and Vercel Production Supabase URL project refs without exposing secrets, changing env vars, or writing data.
- Then fix `DEF-GANTT-SPORTLOAD-DURATION-001`: single-day Sport Loads render as date-specific markers/chips; multi-day Sport Loads render as actual date spans.
- Then implement `QA-PLAYWRIGHT-SMOKE-001` under `QA-AUTOMATION-OWNERSHIP-001` so recurring route smoke checks move to deterministic scripts/CI.
- Then capture/implement `DEF-QA-USAGE-LEDGER-001`.
- Preserve the broader pre-4v4 queue: `AUDIT-LOAD-CLASSIFICATION-001` remains the next bounded discovery task for `DEF-029`, `DEF-030`, `DEF-031`, and `DEF-032` after the newly captured environment/Gantt/QA sequencing work.
- Do not implement Closed-Loop methodology architecture during any of these current-app tasks.
- Do not edit `imports/v8.4/data/*.json` unless a later task explicitly asks.
- Do not mutate Supabase or saved records.

Execution gate: tactical current-app defects may be fixed separately as bounded work after discovery, but Closed-Loop methodology implementation remains gated by `DESIGN-GATE-001`.

## Scope Item Index By Priority And Status

### P0

| Status | IDs |
| --- | --- |
| In progress | None |
| Not started | None |
| Scope review required | SCOPE-GATE-001, ENV-SAFETY-LOCAL-PROD-GUARD, SPORT-SCHEDULE-VERIFY-001, DEF-001, DEF-015 |
| Completed | SCOPE-CONSOLIDATION-001, DOC-DRIFT-001, DOC-INV-001, ENV-SAFETY-RECON-001, DPM-QA-006 |

### P1

| Status | IDs |
| --- | --- |
| In progress | DEF-ENV-PREVIEW-SUPABASE-MAPPING-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001 |
| Reopened / product QA found incomplete rendering-path coverage | DEF-029 |
| Blocked | ACTIVITY-PRESCRIPTION-001, DEF-021, DEF-022, DEF-023, DEF-024, DEF-025, DEF-026, DEF-027 |
| Not started | ENV-PREVIEW-DB-001, ENV-PREVIEW-DB-AUDIT-001, DEF-GANTT-SPORTLOAD-DURATION-001, QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, CODE-COMMENT-AUDIT-001, TEST-FIXTURE-001, PLAN-CONTENT-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, QA-SYSTEM-001, AUDIT-LOAD-CLASSIFICATION-001, DEF-014, DEF-016, DEF-018, DEF-030, DEF-031, DEF-032 |
| Scope review required | ACTIVITY-LOGGING-001, TRAINING-SAFETY-U12-001, CONDITIONING-MODEL-001, METHODOLOGY-001, DOMAIN-001, DOMAIN-DECISION-001, LOAD-001, ANALYTICS-001, PHASE-001, KPI-DOMAIN-001, READINESS-001, VISUALIZATION-001, RECOMMENDATION-001, QA-SAFETY-001, MLOPS-001, DEF-002, DEF-003, DEF-005, DEF-006, DEF-013, DEF-017, DEF-019, DEF-020 |
| Completed | SPORT-LOAD-4V4-SUMMER-2026, PLAN-GANTT-SPORTLOAD-V84-001, FORENSIC-DAY-SESSION-MISMATCH-001, SURFACE-PRESENTATION-CONSUMER-AUDIT-001, ACTIVITY-PRESENTATION-CONTRACT-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, CONDITIONING-CARDIO-DURATION-001, QA-AUTOMATION-002, DEF-007, DEF-028 |

### P2

| Status | IDs |
| --- | --- |
| In progress | DEF-SUPABASE-STAGING-AUTOPAUSE-001 |
| Not started | DEF-QA-USAGE-LEDGER-001, SESSION-UX-001, RECOVERY-READINESS-001, EXPORTS-REPORTING-001, HOCKEY-IQ-001, DEF-008, DEF-009, DEF-010, DEF-011, DEF-012 |
| Scope review required | SOURCE-INGEST-OTA-001, PLAN-RECON-OTA-001, DEF-004 |

### P3

| Status | IDs |
| --- | --- |
| Deferred | None |
| Not started | AI-COACH-001 |
| Scope review required | AGENTIC-WORKFLOW-001, AGENTIC-WORKFLOW-002 |

## Detailed Scope Records

### SCOPE-CONSOLIDATION-001

- ID: SCOPE-CONSOLIDATION-001
- Title: Scope system consolidation
- Type: Task
- Parent: Scope control
- Priority: P0
- Status: Completed
- Lane: Docs-only
- Owner: Mike / Codex
- Source: Current task
- Problem: Scope and priority were split across several docs with overlapping ownership.
- Desired outcome: `docs/SCOPE.md` becomes the single canonical active scope system.
- In scope: create this file, merge active scope, update pointers, update AGENTS/session/report/inventory.
- Out of scope: app code, v8.4 source JSON, Supabase, tooling, stash, commit, push.
- Acceptance criteria: active queue and current sprint exist here; duplicate scope docs are non-canonical; AGENTS points here.
- Dependencies: Completed Phase 1 review/push checkpoint after the `f02bff4` pushed/deployed baseline.
- Risks: historical detail may still need archive review.
- Next action: Use this file as the active scope source for the next approved implementation task.
- Links / evidence: `docs/DOCUMENTATION_INVENTORY.md`, prior reconciled docs.

### ENV-SAFETY-RECON-001

- ID: ENV-SAFETY-RECON-001
- Title: Environment/data safety reconciliation
- Type: Initiative
- Parent: Data integrity / production safety
- Priority: P0
- Status: Completed
- Lane: Docs-only
- Owner: Mike / Codex
- Source: prior environment, data sync, environment safety, and testing docs were merged here; use git history only.
- Problem: Environment, deployment, KPI sync, and production backfill docs contain historical/stale claims.
- Desired outcome: current environment and write-target truth is clear before any cloud write or deploy.
- In scope: reconcile staging/production/local state, KPI stash status, required confirmation commands, production-risk guardrails.
- Out of scope: cloud writes, deploys, schema changes, stash application.
- Acceptance criteria: package scripts are classified; Supabase/Vercel/env references are identified by file path and purpose; key names are listed without values; forbidden write/deploy/backfill actions are blocked pending explicit approval.
- Dependencies: docs-only review; no production action.
- Risks: stale docs could lead to accidental production writes if not reconciled.
- Next action: Mike reviews these findings, then explicitly approves any future write/deploy/backfill work before it starts.
- Links / evidence: `scripts/confirm-write-target.mjs`, `scripts/env-whoami.mjs`, `scripts/preflight.mjs`, `stash`.

Ground Truth Baseline:

- Do not read, print, copy, or expose secret values.
- List env key names only, never values.
- Observed env key names:
  - `NEXT_PUBLIC_LOCAL_GIT_COMMIT_SHA`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_VERCEL_ENV`
  - `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_PROJECT_URL`
  - `SUPABASE_URL`
  - `VERCEL_ENV`
- Files/scripts observed to reference Supabase/Vercel/env keys or environment behavior:
  - `AGENTS.md`
  - `README.md`
  - `MIGRATION_NOTES.md`
  - `app/plan/page.tsx`
  - `app/session/[id]/error.tsx`
  - `app/session/[id]/page.tsx`
  - `components/BuildBadge.tsx`
  - `components/ClientErrorProbe.tsx`
  - `components/DataStatus.tsx`
  - `components/SessionDebugClient.tsx`
  - `lib/imports/v8_4/index.ts`
  - `lib/storage/cloudKpiRepository.ts`
  - `lib/storage/cloudSessionProgressRepository.ts`
  - `lib/storage/completedSessionRepository.ts`
  - `lib/storage/externalLoadRepository.ts`
  - `lib/storage/localSessionRepository.ts`
  - `lib/storage/trainingWorkRepository.ts`
  - `lib/supabase/client.ts`
  - `scripts/confirm-write-target.mjs`
  - `scripts/env-whoami.mjs`
  - `scripts/run-with-build-info.mjs`
- `package.json` script names observed:
  - `dev`
  - `build`
  - `start`
  - `start:lan`
  - `ios:test`
  - `vercel:build`
  - `test`
  - `lint`
- Allowed read-only/safe verification commands for the inspect-only reconciliation:
  - `git status --short`
  - `git diff --check`
  - `find . -maxdepth 3 -name "*.md" | sort`
  - `rg -l` / `rg -o` searches that print file names or env key names only
  - `node -e` commands that print package script names only
  - reading source files without printing secret values
- Forbidden until explicitly approved:
  - destructive scripts
  - migrations
  - Supabase writes
  - production deploys
  - backfill scripts
  - any command requiring production credentials
  - any command that prints `.env.local` values or Supabase keys/tokens/URLs
- Exact next action: perform an inspect-only environment reconciliation that records current env/sync/deploy truth, key names only, and safe/forbidden command boundaries.
- Blocker rule: if key names cannot be safely determined without exposing values, mark this item `Blocked` and ask Mike to provide a redacted key-name list.

Environment Safety Findings:

- Inspection date: 2026-06-23.
- Worktree at inspection start: clean.
- `package.json` script classification:
  - Safe local verification:
    - `lint`: TypeScript compile check; no cloud write expected.
    - `test`: Vitest run; no cloud write expected unless future tests add live-cloud behavior.
    - `build`: local Next build through build-info wrapper; no deploy.
    - `vercel:build`: runs the same build command; no Vercel deploy.
  - Caution-required:
    - `dev`: starts local app; UI paths can write to Supabase if env points at a configured target.
    - `start`: starts built app; UI paths can write to Supabase if env points at a configured target.
    - `start:lan`: exposes built app on LAN; UI paths can write to Supabase if env points at a configured target.
    - `ios:test`: builds and starts LAN server; useful for validation but can expose write-capable app flows.
  - Forbidden without explicit approval:
    - No package script directly runs deploy, migration, seed, or backfill.
    - Any future `vercel deploy`, Supabase CLI write, SQL migration, seed, backfill, production smoke write, or command requiring production credentials is forbidden until explicitly approved.
- Supabase/Vercel/env references found:
  - `lib/supabase/client.ts`: creates browser Supabase client from public env keys.
  - `lib/storage/completedSessionRepository.ts`: upserts athlete and inserts completed session snapshots into `session_logs`; reads `session_logs`.
  - `lib/storage/externalLoadRepository.ts`: upserts athlete and inserts Sport Load snapshots into `session_logs`; reads `session_logs`.
  - `lib/storage/cloudKpiRepository.ts`: upserts athlete, inserts standalone KPI snapshots and tombstone delete snapshots into `session_logs`; reads `session_logs`.
  - `lib/storage/cloudSessionProgressRepository.ts`: upserts athlete and upserts live session progress into `session_progress`; reads `session_progress`.
  - `lib/storage/localSessionRepository.ts`, `lib/storage/localKpiRepository.ts`, `app/history/page.tsx`, `components/SessionDebugClient.tsx`: local delete paths only; no Supabase delete path observed.
  - `supabase/schema.sql`: schema/RLS/grants SQL; migration-class file, forbidden to apply without explicit approval and target confirmation.
  - `scripts/env-whoami.mjs`: reads env key names/values internally to classify target and prints host/classification; safe only when target disclosure is acceptable.
  - `scripts/confirm-write-target.mjs`: read-only confirmation gate; performs no writes.
  - `scripts/preflight.mjs`: read-only summary but invokes `env-whoami`; can reveal target classification/host.
  - `scripts/run-with-build-info.mjs`: injects local git SHA into build/dev env; no cloud write.
  - `components/BuildBadge.tsx`: displays public build/deploy metadata.
  - `README.md`, `MIGRATION_NOTES.md`, `docs/SESSION_HANDOFF.md`, `docs/KPI_CLOUD_SYNC_STAGING_TEST_PLAN.md`, `docs/GOLDEN_FIXTURES_PLAN.md`, `docs/STARTUP.md`: supporting docs with environment, deploy, sync, staging, or production-safety references; not active scope authority.
- Environment key names found, names only:
  - `CONFIRM_PRODUCTION`
  - `NEXT_PUBLIC_LOCAL_GIT_COMMIT_SHA`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_VERCEL_ENV`
  - `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_PROJECT_URL`
  - `SUPABASE_URL`
  - `VERCEL_ENV`
  - `WRITE_ACTION`
  - `WRITE_TARGET`
- Risk classification:
  - Supabase mutation paths exist in repositories through `upsert`/`insert` to `athletes`, `session_logs`, and `session_progress`.
  - No client physical Supabase delete path was observed; standalone KPI delete uses an inserted tombstone snapshot.
  - Applying `supabase/schema.sql` is a migration/write operation and forbidden without explicit target confirmation.
  - Starting the app is caution-required because user interaction can create cloud writes if env points at a configured Supabase target.
  - Vercel deploy is not present as a package script, but any deploy command or push intended to deploy remains forbidden without explicit approval.
  - `.env.local` and env backup files were not read; key names were discovered from code/docs only.

### ENV-PREVIEW-DB-001

- ID: ENV-PREVIEW-DB-001
- Title: Vercel Preview Supabase environment is unverified / may be sharing production-like KPI data
- Type: Defect
- Parent: Data integrity / production safety
- Priority: P1
- Status: In progress
- Lane: Docs-only / environment-safety
- Owner: Mike / Codex
- Source: Vercel Preview smoke after `1c336a0`
- Problem: Vercel Preview deployment for branch `preprod/kpi-protocols-2026-06-30` showed badge `1c336a0 · preview`, and Preview `/kpis` displayed existing KPI results/baselines similar to production. Current evidence does not prove whether Preview is using production Supabase, staging Supabase seeded/copied with similar data, or another mirrored source.
- Desired outcome: Preview database target is verified before any Preview write testing.
- In scope: docs capture of unverified risk, no-write operational rule, and verification task.
- Out of scope: env var changes, Vercel configuration changes, Supabase changes, app code, tests, deploys, or writes.
- Acceptance criteria: Preview write testing remains blocked until `ENV-PREVIEW-DB-AUDIT-001` confirms Preview points to staging/non-production or is explicitly treated as read-only.
- Dependencies: Vercel environment variable inspection or safe runtime evidence that does not expose secret values.
- Risks: Preview KPI saves or other write flows could mutate production data if Preview env vars point to production Supabase.
- Next action: run `ENV-PREVIEW-DB-AUDIT-001` before any Preview save/write testing.
- Links / evidence: Preview badge `1c336a0 · preview`; Preview `/kpis` production-like KPI results/baselines; user recalls staging/preview Supabase setup exists; no deterministic proof captured yet.

### ENV-PREVIEW-DB-AUDIT-001

- ID: ENV-PREVIEW-DB-AUDIT-001
- Title: Verify Vercel Preview Supabase target
- Type: Task
- Parent: ENV-PREVIEW-DB-001
- Priority: P1
- Status: Not started
- Lane: Docs-only / environment-safety
- Owner: Mike / Codex
- Source: ENV-PREVIEW-DB-001
- Problem: Preview DB isolation cannot be assumed from visible KPI data or build badge alone.
- Desired outcome: determine whether Production, Preview, and local development use separate Supabase project refs without exposing secret values.
- In scope: verify Supabase project refs/URLs by redacted Vercel env var review, safe non-secret runtime evidence, or approved read-only environment confirmation.
- Out of scope: changing env vars, changing Vercel config, changing Supabase, running writes, migrations, schema changes, or deploys.
- Acceptance criteria: answers are captured for all required verification questions; Preview writes are either allowed only against staging/non-production or explicitly disabled/treated read-only.
- Dependencies: access to Vercel env configuration or safe runtime target labeling.
- Risks: exposing secrets while verifying, or testing writes before target isolation is known.
- Next action: answer the verification questions below before any Preview write test.
- Links / evidence: `scripts/env-whoami.mjs`, `scripts/preflight.mjs`, `scripts/confirm-write-target.mjs`, Vercel project env settings.

Required verification questions:

- What Supabase URL/project ref is configured for Vercel Production?
- What Supabase URL/project ref is configured for Vercel Preview?
- What Supabase URL/project ref is configured locally in `.env.local`?
- Are Preview and Production using different Supabase project refs?
- If Preview uses staging, does staging contain copied/backfilled KPI rows that explain the visible data?
- Does the app expose a safe non-secret environment label or build badge that indicates DB target?
- Should preview writes be disabled until staging isolation is proven?

Operational rule:

- Do not save KPI results or perform any write-capable workflow in Vercel Preview until `ENV-PREVIEW-DB-AUDIT-001` confirms the Preview database target is staging/non-production, or Preview is explicitly classified as read-only.

### CODE-COMMENT-AUDIT-001

- ID: CODE-COMMENT-AUDIT-001
- Title: Stale Inline Comment / TODO Audit
- Type: Task
- Parent: Scope system hardening
- Priority: P1
- Status: Completed
- Lane: Fast lane
- Owner: Mike / Codex
- Source: External audit / scope hardening
- Problem: old code comments may contain stale instructions that conflict with `docs/SCOPE.md` and confuse future Codex work.
- Desired outcome: code comments that imply scope are either verified against active scope IDs, updated, or removed in a future dedicated comment-cleanup task.
- In scope: inspect comments/TODOs/docstrings in `app`, `components`, `lib`, `scripts`, import adapters, and tests if present.
- Out of scope: behavior changes, refactors, source JSON edits, package installs, Supabase writes.
- Acceptance criteria: produce a list of stale/suspicious comments and recommended action; no behavior changes.
- Dependencies: `docs/SCOPE.md` remains the only active scope authority.
- Risks: stale implementation notes may be mistaken for planned product work.
- Next action: run inspect-only comment audit before the next app-code implementation task if time allows.
- Links / evidence: targeted comment-risk scan from this docs-only hardening task.

Known comment-risk findings:

- `components/SessionMinimalDiagnostic.tsx:13`: low risk. Comment says `Fall through to the older-browser-safe id.` This appears to describe an implementation fallback, not scope. Recommended action: verify during the future audit; keep only if still accurate.
- No `tests/` directory was present during the initial scan.

### ACTIVITY-PRESCRIPTION-001

- ID: ACTIVITY-PRESCRIPTION-001
- Title: Activity Prescription Display Layer
- Type: Feature
- Parent: Training system
- Priority: P1
- Status: Blocked
- Lane: Fast lane
- Owner: Mike / Codex
- Source: v8.4 import package and Activity Prescription intake
- Problem: Athlete-actionable cards can hide available sets/reps/time/rest/tempo/source/cue detail.
- Desired outcome: Maddox can open planned work and understand exactly what to do from approved source metadata.
- In scope: render existing v8.4 prescription fields, honest missing-source states, instruction/video status if available.
- Out of scope: source JSON edits, invented prescriptions, logging field changes, Supabase/schema changes.
- Acceptance criteria: available prescription detail appears in Day/Session activity cards; missing data is identified honestly.
- Dependencies: `FORENSIC-DAY-SESSION-MISMATCH-001`; `SURFACE-PRESENTATION-CONSUMER-AUDIT-001`; v8.4 metadata/loaders/components.
- Risks: current uncommitted WIP may contain surface-specific fixes that do not solve the shared Day/Session architecture.
- Next action: stop cosmetic display patching; implement the approved planned-activity presentation contract for Day + Session parity only before revising current WIP for broader surfaces.
- Links / evidence: `imports/v8.4/data/`, prior training epics content merged here; use git history only.

Current WIP gate:

- ACTIVITY-PRESCRIPTION-001A/B/C WIP is not commit-ready.
- Browser QA on June 19 found Day/Session presentation divergence, missing loggable steps, title/duration conflicts, and stale Session form copy.
- Do not mark product accepted.
- Do not commit current WIP until DEF-021 through DEF-027 are addressed or dispositioned through an approved fix plan.
- No further cosmetic display patches are allowed until the forensic Day/Session data-flow audit and site-wide consumer audit identify the canonical projection layer, affected consumers, and WIP disposition.

### FORENSIC-DAY-SESSION-MISMATCH-001

- ID: FORENSIC-DAY-SESSION-MISMATCH-001
- Title: Forensic Day/Session data-flow audit
- Type: Task
- Parent: ACTIVITY-PRESCRIPTION-001
- Priority: P1
- Status: Completed
- Lane: Fast lane
- Owner: Mike / Codex
- Source: June 19 browser QA during ACTIVITY-PRESCRIPTION-001A/B/C
- Problem: Day page and Session form render different activity labels, planned steps, durations, and instructions for the same date/session.
- Desired outcome: identify the exact data-flow mismatch before more implementation work, then approve a fix plan that creates one canonical activity presentation contract.
- In scope: inspect Day page source path, Session form source path, step projection, duration/title derivation, shared helper usage, current WIP disposition, and tests needed for parity.
- Out of scope: fixing app code, editing v8.4 JSON, changing logging behavior, Supabase/schema changes, package changes, browser automation.
- Acceptance criteria: audit documents Day path, Session path, why steps differ, why duration/title conflict occurs, which canonical projection layer both must use, and which WIP changes should be kept, revised, or reverted.
- Dependencies: current uncommitted ACTIVITY-PRESCRIPTION WIP; v8.4 import package.
- Risks: applying more display patches before this audit may hide architectural defects and increase divergence.
- Next action: use the completed forensic and site-wide consumer audit findings to guide `ACTIVITY-PRESENTATION-CONTRACT-001`.
- Links / evidence: DEF-021 through DEF-026; Mike June 19 browser QA.

### SURFACE-PRESENTATION-CONSUMER-AUDIT-001

- ID: SURFACE-PRESENTATION-CONSUMER-AUDIT-001
- Title: Site-wide activity presentation consumer audit
- Type: Task
- Parent: ACTIVITY-PRESCRIPTION-001
- Priority: P1
- Status: Completed
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Mike review after FORENSIC-DAY-SESSION-MISMATCH-001
- Problem: Day and Session already diverged, and similar display/data drift may exist anywhere the app renders plan/activity/session labels, durations, instructions, source labels, or logging representations.
- Desired outcome: identify every consumer of plan/activity/session display data and produce a wiring plan for the canonical activity presentation contract.
- In scope: inspect routes, components, adapters, projections, repositories, exports, reports, and helpers that render plan, day, session, drill, activity, sport-load, recovery, IQ, shooting, conditioning, Speed Stack, source-block, or logging labels.
- Out of scope: app-code fixes, test edits, source JSON edits, logging behavior changes, Supabase/schema changes, package changes, browser automation.
- Acceptance criteria: every athlete-facing consumer is identified and classified as must consume canonical activity presentation contract now, can consume summary projection from the same contract, admin/source/reference-only exception, or deferred with explicit rationale.
- Dependencies: FORENSIC-DAY-SESSION-MISMATCH-001; current uncommitted ACTIVITY-PRESCRIPTION WIP; v8.4 import package.
- Risks: without this audit, fixes may continue as surface-specific cosmetic patches and create new drift across Calendar, Dashboard, History, Today, Library, exports, and reports.
- Next action: use completed audit findings to implement `ACTIVITY-PRESENTATION-CONTRACT-001` as a Day + Session planned-activity parity slice only.
- Links / evidence: DEF-027; FORENSIC-DAY-SESSION-MISMATCH-001 report; inspect-only SURFACE-PRESENTATION-CONSUMER-AUDIT-001 report; Mike review.

Completed audit conclusions:

- The Day page is closest to canonical because it uses `dayExecutionPlan` plus `buildDayPresentation`.
- The Session page is the main divergent path because it builds a synthetic flattened workout/drill model from `sessions.json` and `drills.json`.
- Site-wide presentation consumers exist across Day, Session, Today/Home, Calendar, Training Work, Sport Load, Dashboard, History, Library, Plan, KPIs, Exports, storage snapshots, and debug/reference surfaces.
- Site-wide consumers must be classified before broad fixes: canonical-contract-now, summary-from-contract, admin/source/reference-only exception, or deferred with explicit rationale.
- Current ACTIVITY-PRESCRIPTION-001A/B/C WIP remains intentionally uncommitted and not commit-ready.

Consumer classification summary:

- Must consume canonical activity presentation contract now: Day execution, Session form/cards/summary, Training Work logging surface, and the v8.4 session adapter path that currently synthesizes workout/drill display.
- Can consume summary projection from the same contract: Today/Home, Calendar, Dashboard, History, DayEvidenceStatus, Plan summaries, KPI day summaries, Sport Load support-work summaries, and future exports/reports.
- Admin/source/reference-only exceptions: Library source catalog and debug/diagnostic session surfaces, as long as they are not used as athlete execution UI.
- Deferred with rationale: broad Dashboard/History/KPI/Exports rewiring until Day + Session parity is stable and product-reviewed.

Approved architecture direction:

- v8.4 `dayExecutionPlan` owns top-level day activity coverage and order.
- `sessions.json` and `drills.json` enrich details but must not replace top-level planned day order.
- Speed Stack child drills attach under parent Speed Stack activities.
- Duration precedence is `dayExecutionPlan` first, session/drill detail second, code-derived fallback only when no authoritative duration exists and no conflict is present.
- Presentation fixes must not mutate saved data.
- Implementation is not product-accepted until Mike completes future browser/product QA.

Split-pass implementation strategy:

- Pass 1, immediate: `projectPlannedDayActivities(date)`. Scope is master/reference plan data plus metadata only. No Supabase, no saved logs, no transactional joins.
- Pass 2, deferred: `projectDayEvidence(date)`. Scope is saved evidence/status/logs only.
- Pass 3, deferred: `composeDayViewModel(date)`. Scope is composition of planned presentation plus evidence.

Documentation-only target baseline:

```ts
export type ActivityPresentation = {
  id: string;
  date: string;
  sequenceOrder: number;

  sourceBlockId?: string;
  sourceTrace?: {
    dayExecutionPlanId?: string;
    sessionId?: string;
    drillIds?: string[];
  };

  athleteTitle: string;
  parentTitle?: string;

  category:
    | "warmup"
    | "speed_stack"
    | "shooting"
    | "conditioning"
    | "mobility"
    | "recovery"
    | "iq"
    | "kpi"
    | "sport_load"
    | "reflection"
    | "other";

  plannedDurationMinutes?: number;
  instruction?: string;
  coachingCue?: string;

  logType:
    | "none"
    | "checkoff"
    | "drill_log"
    | "shooting_log"
    | "kpi_log"
    | "sport_load_log"
    | "recovery_log"
    | "reflection_log";

  required: boolean;
  optional: boolean;

  children?: ActivityPresentationChild[];
};

export type ActivityPresentationChild = {
  id: string;
  title: string;
  instruction?: string;
  plannedSets?: number;
  plannedReps?: string;
  plannedDurationMinutes?: number;
  coachingCue?: string;
  videoUrl?: string;
  sourceTrace?: {
    drillId?: string;
    sourceBlockId?: string;
  };
};
```

This contract is an approved target baseline for the next implementation task. It is not implemented in app code yet.

### ACTIVITY-PRESENTATION-CONTRACT-001

- ID: ACTIVITY-PRESENTATION-CONTRACT-001
- Title: Planned activity presentation contract, Day + Session parity only
- Type: Task
- Parent: ACTIVITY-PRESCRIPTION-001
- Priority: P1
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Completed SURFACE-PRESENTATION-CONSUMER-AUDIT-001
- Problem: Day and Session did not consume one canonical planned-activity presentation model, causing missing planned steps, stale source language, and duration/title conflicts.
- Desired outcome: Day and Session render planned activities from one `projectPlannedDayActivities(date)` contract while preserving raw IDs and avoiding saved-data mutation.
- In scope: completed Pass 1 only; derived top-level planned activity presentation from v8.4 `dayExecutionPlan`; enriched with session/drill metadata where available; attached Speed Stack child drills under parent Speed Stack activities; wired Day + Session parity; added focused tests for planned-step parity, duration precedence, and source-language filtering.
- Out of scope: Supabase, saved logs, transactional joins, Dashboard, History, KPI, Exports, Gantt, source JSON edits, logging schema changes, broad redesign, product acceptance claims.
- Acceptance criteria: Day and Session use the same planned-activity contract; Warmup, Speed Stack, controlled bike/treadmill, shooting, IQ, cooldown/mobility, readiness, and reflection are represented or classified; athlete-facing labels do not leak known source/workbook language; duration labels follow authoritative precedence.
- Dependencies: completed `FORENSIC-DAY-SESSION-MISMATCH-001`; completed `SURFACE-PRESENTATION-CONSUMER-AUDIT-001`; v8.4 import package.
- Risks: expanding the first pass into evidence/log composition could change logging behavior or saved data; overfitting June 19 could leave site-wide drift unresolved.
- Next action: broader surfaces remain separate future stabilization; do not expand into Dashboard, History, KPI, Calendar, Exports, or Gantt without a new approved loop.
- Links / evidence: commits `c20432c` and `05019f5`; DEF-021 through DEF-027; completed consumer audit; current uncommitted ACTIVITY-PRESCRIPTION-001A/B/C WIP.

Ground Truth Baseline:

- Inspect only during scope hardening; do not implement app code in this pass.
- Source files observed under `imports/v8.4/data/` that may contain prescription or logging data:
  - `dayExecutionPlan.json`
  - `sessions.json`
  - `drills.json`
  - `drillCards.json`
  - `speedStackPrescriptions.json`
  - `workoutBlockDetails.json`
  - `skillShotIqLibrary.json`
  - `recoveryRules.json`
  - `logSchemas.json`
- Observed key names by file:
  - `dayExecutionPlan.json`: `appRenderHint`, `date`, `day`, `entryTitle`, `entryType`, `loadImpact`, `logType`, `notes`, `plannedDurationMin`, `requiredOptional`, `sequence`, `sourceBlock`, `week`
  - `sessions.json`: `date`, `day`, `dayType`, `estimatedDurationMin`, `hasSportLoad`, `hasTrainingWork`, `implementationStatus`, `sequenceCount`, `sessionId`, `sourceTable`, `speedStackAlignment`, `sportLoad`, `summary`, `trainingPhase`, `week`
  - `drills.json`: `category`, `code`, `drillId`, `exercise`, `lastReviewedVersion`, `logFields`, `matchStatus`, `notes`, `phase`, `primaryVideoUrl`, `secondaryVideoUrls`, `session`, `sourcePage`, `videoReviewStatus`
  - `drillCards.json`: `category`, `code`, `drillId`, `exercise`, `humanReviewComment`, `humanReviewStatus`, `lastReviewedVersion`, `logFields`, `matchConfidence`, `matchStatus`, `notes`, `phase`, `primaryVideoUrl`, `secondaryVideoUrls`, `session`, `sourcePage`, `urlType`, `videoReviewStatus`
  - `speedStackPrescriptions.json`: `coachingNotes`, `code`, `exercise`, `extractionStatus`, `group`, `phase`, `rest`, `session`, `setsXReps`, `sourceDocument`, `sourcePage`, `sourceSection`, `sourceWeek`, `tempo`
  - `workoutBlockDetails.json`: `category`, `coachingCue`, `code`, `commonMistake`, `drillID`, `executionSteps`, `exercise`, `group`, `loggingInputs`, `parentCue`, `phase`, `secondaryVideoURLs`, `session`, `setup`, `sourcePage`, `sourceTable`, `videoReviewNotes`, `videoStatus`
  - `skillShotIqLibrary.json`: `appInputs`, `coachingCue`, `commonMistake`, `domain`, `drill`, `drillID`, `equipment`, `executionSteps`, `iQMindsetCue`, `prescription`, `progression`, `purpose`, `setup`, `sourceNotes`, `videoStatus`
  - `recoveryRules.json`: `allowedWork`, `avoid`, `logging`, `rule`, `situation`
  - `logSchemas.json`: `kpiLog`, `kpiLog.fields`, `readinessLog`, `readinessLog.fields`, `reflectionLog`, `reflectionLog.fields`, `sessionCompletion`, `sessionCompletion.completionStatusValues`, `sessionCompletion.fields`, `shotCounterLog`, `shotCounterLog.fields`, `sportLoadLog`, `sportLoadLog.fields`, `trainingWorkLog`, `trainingWorkLog.fields`, `version`
- Do not invent TypeScript props.
- Do not assume Gemini's proposed interface is correct.
- Future implementation must map observed v8.4 keys to UI fields without editing v8.4 JSON.
- If source files or keys are not found during implementation, mark this item `Blocked` or `Scope review required` with a next action to inspect the actual import model.

### FUTURE-DAY-READINESS-001

- ID: FUTURE-DAY-READINESS-001
- Title: Future-day readiness audit from June 23 onward
- Type: Task
- Parent: Day-first architecture
- Priority: P1
- Status: Completed
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Calendar coverage acceptance and DPM-QA follow-up
- Problem: Calendar/date coverage is fixed, but upcoming day usability still needs QA.
- Desired outcome: future days load, communicate day type, show executable content when planned, and avoid misleading statuses.
- In scope: inspect Day/Calendar/Session projections for upcoming dates; add narrow fixes only if requested.
- Out of scope: source-plan rewrite, broad redesign, Playwright unless separately approved.
- Acceptance criteria: all 84 v8.4 plan dates from `2026-06-15` through `2026-09-06` project athlete-usable Day readiness with nonblank titles, guidance, visible planned elements, and forbidden source/internal label filtering.
- Dependencies: Activity Prescription may expose more day usability gaps.
- Risks: source gaps may be confused with app projection gaps.
- Next action: maintain as regression proof before broader Day/Calendar/Session readiness work.
- Links / evidence: Calendar date coverage commit `7b48a3e`; automated proof commit `6ab3f5e`.

### ACTIVITY-LOGGING-001

- ID: ACTIVITY-LOGGING-001
- Title: Activity-specific logging fields
- Type: Feature
- Parent: Evidence model
- Priority: P1
- Status: Completed locally
- Lane: Safe lane
- Owner: Mike / Codex
- Source: Friday readiness QA and training log observations
- Problem: Generic logging may not capture useful evidence for shots, stickhandling, readiness, or specific work types.
- Desired outcome: logging fields reflect planned activities without creating duplicate logging systems.
- In scope: define field needs and schema/storage impact after display layer is stable.
- Out of scope: immediate schema changes, production writes, separate workaround logging systems.
- Acceptance criteria: field design is reviewed before implementation; Sport Load and Training Work evidence remain separate.
- Dependencies: Activity Prescription Display Layer and evidence model review.
- Risks: premature logging changes could corrupt evidence semantics.
- Next action: review after display parity clarifies what activity types need input fields.
- Links / evidence: Friday/Saturday/Sunday readiness findings.

### DAY-SESSION-PARITY-001

- ID: DAY-SESSION-PARITY-001
- Title: Day/Session sequence parity
- Type: Feature
- Parent: Day-first architecture
- Priority: P1
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Day Presentation Model and Friday QA
- Problem: Day sequence and Session execution could drift, confusing the athlete about the real plan.
- Desired outcome: Day planned sequence and execution session cards represent the same approved work.
- In scope: projection parity, card ordering, links/actions.
- Out of scope: source training edits and logging schema changes.
- Acceptance criteria: planned blocks visible on Day are represented in execution flow where applicable.
- Dependencies: Activity Prescription layer.
- Risks: source-plan title/block mismatches need source-review instead of UI masking.
- Next action: maintain this proof as the guardrail before broader surface work.
- Links / evidence: `app/day/[date]/page.tsx`, session components, commits `c20432c` and `05019f5`.

### PLAN-CONTENT-001

- ID: PLAN-CONTENT-001
- Title: Plan content/title correctness
- Type: Source Review
- Parent: Training/source system
- Priority: P1
- Status: Not started
- Lane: Source-review
- Owner: Mike / Codex
- Source: Friday title/block mismatch observations
- Problem: Some day titles may imply work that is not represented in executable blocks.
- Desired outcome: source-plan mismatches are identified honestly and resolved through approved source-update process.
- In scope: inspect titles, blocks, sessions, source provenance, mismatch reports.
- Out of scope: silent content invention or source JSON edits without explicit approval.
- Acceptance criteria: mismatches are logged with proposed source-review action.
- Dependencies: v8.4 source package and Mike approval for any source update.
- Risks: UI workarounds could hide real data-integrity issues.
- Next action: review mismatches surfaced during future-day and prescription audits.
- Links / evidence: v8.4 dayExecutionPlan/session data.

### RECOVERY-DAY-MODEL-001

- ID: RECOVERY-DAY-MODEL-001
- Title: Recovery-day model completion
- Type: Epic
- Parent: Training/source system
- Priority: P1
- Status: Not started
- Lane: Source-review
- Owner: Mike / Codex
- Source: Plan coverage audit and product decision
- Problem: Recovery days must be intentional, not blank.
- Desired outcome: appropriate recovery days include easy mobility, low-intensity skill, light cardio, cognitive work, and reflection when approved by source.
- In scope: source-review model, intensity guardrails, app representation of approved recovery prescriptions.
- Out of scope: invented workouts and silent hard conditioning.
- Acceptance criteria: recovery days show intentional low-intensity work or explicit source deferral.
- Dependencies: v8.4/source-review process.
- Risks: adding content without source approval could change the training plan.
- Next action: review recovery-related source data and gaps.
- Links / evidence: prior training epics content merged here; use git history only.

### KPI-ROADMAP-001

- ID: KPI-ROADMAP-001
- Title: KPI roadmap and advanced KPI scope
- Type: Epic
- Parent: KPI system
- Priority: P1
- Status: In progress
- Lane: Safe lane
- Owner: Mike / Codex
- Source: KPI roadmap reconciliation
- Problem: KPI scope, sync status, and future tests had conflicting documentation.
- Desired outcome: KPI roadmap is preserved while implementation waits for sync/model safety.
- In scope: initial KPI tests, advanced KPI candidates, KPI decisions, source-review of backfill/sync status.
- Out of scope: production backfill, stash application, schema changes, implementation without explicit task.
- Acceptance criteria: advanced KPI scope remains available here and future work uses personal trends, not adult standards.
- Dependencies: Environment/data safety reconciliation.
- Risks: stale cloud-sync assumptions could cause production data risk.
- Next action: reconcile KPI sync/backfill docs before any KPI implementation.
- Links / evidence: prior KPI roadmap content merged here; use git history only, `stash@{0}`.

Advanced KPI scope:

- 100m sprint
- 45-second hockey shift simulation / repeated shuttle
- push-up test
- pull-up or flexed-arm hang
- vertical jump
- optional bike power / repeated-effort test later
- shooting accuracy trend
- head-up callout / scan-and-handle trend
- puck-control weave trend with deferred state
- decision: do not use flat 400m as primary hockey-shift test
- decision: compare Maddox against himself over time, not adult/NHL standards

### DAY-FIRST-ARCH-001

- ID: DAY-FIRST-ARCH-001
- Title: Day-first architecture docs/test fixtures
- Type: Initiative
- Parent: Day-first architecture
- Priority: P1
- Status: Not started
- Lane: Docs-only
- Owner: Mike / Codex
- Source: QA/testing strategy and day projection notes
- Problem: Day-first projection behavior needs durable fixtures and acceptance docs.
- Desired outcome: Today, Calendar, History, Dashboard, KPIs, and Exports can be validated against canonical Day evidence.
- In scope: fixture definitions, acceptance docs, projection rules.
- Out of scope: broad app refactor unless separately tasked.
- Acceptance criteria: critical day scenarios are fixture-backed and traceable.
- Dependencies: stable Day projection model.
- Risks: tests may encode stale behavior if written before projection reconciliation.
- Next action: plan fixture coverage after current P1 display/readiness work.
- Links / evidence: `docs/DAY_SCENARIOS.md`, `docs/GOLDEN_FIXTURES_PLAN.md`.

### KPI-HISTORY-DASHBOARD-001

- ID: KPI-HISTORY-DASHBOARD-001
- Title: KPI/History/Dashboard reconciliation
- Type: Initiative
- Parent: Evidence projections
- Priority: P1
- Status: Not started
- Lane: Safe lane
- Owner: Mike / Codex
- Source: defect log and roadmap
- Problem: KPI, History, and Dashboard projections may not consistently reflect canonical Day evidence.
- Desired outcome: parent/operator screens summarize one trusted evidence model.
- In scope: projection audit, History Week -> Day -> Evidence, KPI summary, Dashboard clarity.
- Out of scope: cloud writes or backfill unless separately approved.
- Acceptance criteria: projections agree with Day evidence and documented caveats.
- Dependencies: evidence model, sync safety, fixtures.
- Risks: mixing local/cloud evidence without clear sync states.
- Next action: revisit after day/session and logging model work.
- Links / evidence: DEF-008, DEF-013, `docs/DATA_PROPAGATION_MATRIX.md`.

### QA-SYSTEM-001

- ID: QA-SYSTEM-001
- Title: QA/testing system
- Type: Initiative
- Parent: Quality system
- Priority: P1
- Status: Not started
- Lane: Safe lane
- Owner: Mike / Codex
- Source: QA strategy/status docs
- Problem: Release gates, fixture coverage, and E2E scope remain incomplete.
- Desired outcome: critical athlete workflows have repeatable validation before release through contract-driven, site-wide coverage that avoids matrix bloat.
- In scope: release gate, fixture strategy, test status reconciliation, Playwright plan, QA contract kernel, testing pyramid, test generation rules, and matrix-bloat controls.
- Out of scope: installing Playwright or new tooling without explicit task.
- Acceptance criteria: QA docs reflect current tooling, define release checks by risk level, and require tests to trace to contracts/requirements/defects/scope items.
- Dependencies: current projection model and environment safety.
- Risks: stale QA docs can misstate coverage; giant matrices can obscure missing source inspection.
- Next action: use the current route-surface map and compact test groups for future fixture/release-gate planning; DEF-028 fix design is complete.
- Links / evidence: `docs/QA_TESTING_PYRAMID.md`, `docs/APPLICATION_BEHAVIOR_CONTRACT.md`, `docs/TEST_GENERATION_RULES.md`, `docs/QA_MATRIX_BLOAT_CONTROLS.md`, `docs/ROUTE_SURFACE_COVERAGE_MATRIX.md`, `docs/TEST_CASES.md`.

### QA-AUTOMATION-002

- ID: QA-AUTOMATION-002
- Title: Playwright proof-of-life strategy
- Type: Task
- Parent: QA-SYSTEM-001
- Priority: P1
- Status: Completed
- Lane: Safe lane
- Owner: Mike / Codex
- Source: Completed-session presentation defect and local QA harness limits
- Problem: Manual browser QA was finding presentation regressions that static HTTP checks could not fully cover, including completed-session/read-only flows.
- Desired outcome: Add the smallest approved Playwright proof-of-life that verifies the June 19 Day + Session title/context flow without saving, finishing, mutating production data, or relying on Mike as the only QA harness.
- In scope: package install, local proof-of-life spec, production/read-only navigation, artifact capture, and explicit no-save/no-finish guardrails.
- Out of scope: broad Playwright rollout, CI changes, bundled browser downloads, app code fixes, Supabase writes, data backfills, migrations, or saved-record mutation.
- Acceptance criteria: Playwright launches installed Chrome on Catalina, opens production Day and Session routes, verifies Day title/badge, safely handles absent previous-attempt gate, and does not click Finish/Save/Submit/Start Fresh/logging actions.
- Dependencies: macOS 10.15.8 Catalina; installed Google Chrome; current no-package QA harness; DEF-028.
- Risks: production session data state can change, so previous-attempt/completed-session branch may not appear in every run.
- Next action: keep Playwright expansion deferred until deterministic fixtures are approved; DEF-028 display behavior is covered by component-level automated proof.
- Links / evidence: Playwright proof-of-life code commit `402edc8`; DEF-028 evidence logging script commit `66ab959`; DEF-028 fix and component proof commit `9fd4c73`; all-date Day/Session parity proof commit `05019f5`.

### TEST-FIXTURE-001

- ID: TEST-FIXTURE-001
- Title: Verify and Establish Test Fixture Structure
- Type: Task
- Parent: QA/testing system
- Priority: P1
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: External audit / QA scope risk
- Problem: A scan found no top-level `tests/` directory. The project needs a verified test/fixture convention before risky environment, KPI, or Activity Prescription implementation work proceeds.
- Desired outcome: Confirm where tests currently live, define the fixture location, and create initial read-only golden fixtures for v8.4 day/activity/prescription data in a future dedicated task.
- In scope: inspect `package.json` test scripts, existing test files, existing fixture files, and v8.4 import data structure; recommend a single fixture location; create dummy/sanitized v8.4-shaped fixtures only in a later approved implementation task.
- Out of scope: package installs, Playwright setup, app behavior changes, Supabase writes, v8.4 JSON edits, production data, real athlete data in fixtures.
- Acceptance criteria: future task identifies the current test convention, creates or confirms fixture directory, adds sanitized fixture data, and wires validation without changing production behavior.
- Dependencies: `docs/SCOPE.md`, v8.4 import package, `package.json` test scripts.
- Risks: creating fixtures from real data, creating parallel test conventions, or adding test tooling before scope approval.
- Next action: inspect-only QA fixture discovery before or alongside the first Activity Prescription implementation task.
- Links / evidence: previous comment-risk scan found no top-level `tests/` directory; this is not proof that no tests exist elsewhere.

### SESSION-UX-001

- ID: SESSION-UX-001
- Title: Medium Session UX backlog
- Type: Epic
- Parent: Session experience
- Priority: P2
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: product roadmap and session QA
- Problem: session UX needs refinement after core workflow readiness.
- Desired outcome: training execution is clearer, faster, and less error-prone.
- In scope: medium-priority interaction and display improvements.
- Out of scope: changing source plan or evidence semantics without separate tasks.
- Acceptance criteria: backlog items are reviewed and prioritized after P1 trust issues.
- Dependencies: Activity Prescription and parity work.
- Risks: UX polish could distract from data-integrity fixes.
- Next action: defer until P1 workflow issues are stable.
- Links / evidence: session QA findings.

### SOURCE-INGEST-OTA-001

- ID: SOURCE-INGEST-OTA-001
- Title: OvertimeAthlete source ingestion
- Type: Source Review
- Parent: Training/source system
- Priority: P2
- Status: Scope review required
- Lane: Source-review
- Owner: Mike / Codex
- Source: Gemini intake / OvertimeAthlete recommendation
- Problem: OTA material may contain useful training concepts but is not approved source truth.
- Desired outcome: OTA source is ingested/reviewed without replacing v8.4 unless Mike approves a source update.
- In scope: source provenance review, concept comparison, future source-update proposal.
- Out of scope: app/training-plan changes and unverified schedule changes.
- Acceptance criteria: reviewed concepts are categorized as adopt/reject/defer/source-update-needed.
- Dependencies: source files and Mike approval.
- Risks: treating OTA/Gemini recommendations as authoritative would violate source control.
- Next action: defer until source-review phase.
- Links / evidence: Gemini intake.

### RECOVERY-READINESS-001

- ID: RECOVERY-READINESS-001
- Title: Recovery/readiness system
- Type: Epic
- Parent: Recovery model
- Priority: P2
- Status: Not started
- Lane: Safe lane
- Owner: Mike / Codex
- Source: roadmap and defect log
- Problem: readiness inputs and recovery recommendations are incomplete.
- Desired outcome: parent-reviewed readiness model supports safe day decisions without silent plan rewrites.
- In scope: energy, soreness, pain, sleep, resting HR, workload, parent review flags.
- Out of scope: AI auto-rewrites or production data changes without review.
- Acceptance criteria: readiness model is explicit and age-appropriate.
- Dependencies: evidence model and logging fields.
- Risks: overinterpreting incomplete data.
- Next action: defer until core evidence and projection model stabilize.
- Links / evidence: DEF-018, prior training epics content merged here; use git history only.

### EXPORTS-REPORTING-001

- ID: EXPORTS-REPORTING-001
- Title: Exports/reporting
- Type: Feature
- Parent: Parent/coach reporting
- Priority: P2
- Status: Not started
- Lane: Safe lane
- Owner: Mike / Codex
- Source: roadmap
- Problem: exports need trusted evidence before they can be reliable.
- Desired outcome: PDF/Excel/season reports summarize canonical Day evidence for parent/coach review.
- In scope: reporting design after evidence model is stable.
- Out of scope: reporting implementation before projection reconciliation.
- Acceptance criteria: reports match canonical records and disclose caveats.
- Dependencies: History/Dashboard/KPI reconciliation.
- Risks: exporting misleading data.
- Next action: defer until evidence model is trusted.
- Links / evidence: prior roadmap content merged here; use git history only.

### HOCKEY-IQ-001

- ID: HOCKEY-IQ-001
- Title: Hockey IQ system
- Type: Epic
- Parent: Training/source system
- Priority: P2
- Status: Not started
- Lane: Source-review
- Owner: Mike / Codex
- Source: training system epics
- Problem: Hockey IQ content needs approved source structure before app implementation.
- Desired outcome: Watch -> Apply -> Reflect workflow for age-appropriate hockey IQ development.
- In scope: daily cue, scan, support, protect puck, communication, center-specific concepts from approved sources.
- Out of scope: invented clips or unapproved coaching content.
- Acceptance criteria: source-reviewed IQ content can be rendered and reflected on.
- Dependencies: source-review and content approval.
- Risks: unapproved coaching content.
- Next action: future source-review.
- Links / evidence: prior training epics content merged here; use git history only.

### AI-COACH-001

- ID: AI-COACH-001
- Title: AI Coach strategy
- Type: Epic
- Parent: Future intelligence layer
- Priority: P3
- Status: Not started
- Lane: Future roadmap
- Owner: Mike
- Source: AI Coach strategy doc
- Problem: AI recommendations are unsafe until data model, sync, projections, and QA are trustworthy.
- Desired outcome: future AI provides short, age-appropriate, parent-approved recommendations based on approved data.
- In scope: future strategy and guardrails.
- Out of scope: AI implementation now.
- Acceptance criteria: AI waits for data/sync/QA trust and never silently rewrites the plan.
- Dependencies: KPI sync, staging, History, recovery states, app-wide sync visibility, QA gate.
- Risks: overtraining, bad advice, or source drift if implemented early.
- Next action: keep deferred.
- Links / evidence: `docs/AI_COACH_STRATEGY.md`.

### AGENTIC-WORKFLOW-001

- ID: AGENTIC-WORKFLOW-001
- Title: Agentic workflow evaluation
- Type: Initiative
- Parent: Workflow/process
- Priority: P3
- Status: Scope review required
- Lane: Future roadmap
- Owner: Mike
- Source: Gemini intake
- Problem: agent workflow options may help later, but tool setup is not product-critical now.
- Desired outcome: evaluate workflow options without interrupting P0/P1 product readiness.
- In scope: future comparison of Codex, Cursor, Claude Code, Roo Code, Continue.dev, and process changes.
- Out of scope: installing tools, package changes, Husky, or IDE setup now.
- Acceptance criteria: tool/process choice is reviewed after product-trust work.
- Dependencies: none immediate.
- Risks: process churn can distract from athlete readiness.
- Next action: defer after P1 backlog.
- Links / evidence: Gemini scope intake.

## Gemini / Source-Review Intake Records

### SCOPE-GATE-001

- ID: SCOPE-GATE-001
- Title: Lightweight scope-capture commit gate
- Type: Task
- Parent: Scope control
- Priority: P0
- Status: Scope review required
- Lane: Docs-only
- Owner: Mike
- Source: Gemini intake
- Problem: scope capture can drift without a lightweight check.
- Desired outcome: evaluate a process gate before any hard pre-commit hook.
- In scope: docs/process evaluation.
- Out of scope: Husky setup or package installs.
- Acceptance criteria: Mike chooses whether to add a gate after docs consolidation is accepted.
- Dependencies: `docs/SCOPE.md` acceptance.
- Risks: excessive process friction.
- Next action: review after environment safety reconciliation.
- Links / evidence: Gemini intake.

### ENV-SAFETY-LOCAL-PROD-GUARD

- ID: ENV-SAFETY-LOCAL-PROD-GUARD
- Title: Local startup guard against accidental production Supabase writes
- Type: Task
- Parent: Environment/data safety
- Priority: P0
- Status: Scope review required
- Lane: Safe lane
- Owner: Mike / Codex
- Source: Gemini intake
- Problem: local startup could point at production unintentionally.
- Desired outcome: evaluate a guard that makes write target obvious before risky local work.
- In scope: design review after environment docs reconciliation.
- Out of scope: implementation now.
- Acceptance criteria: guard design avoids printing secrets and respects production-write confirmation rules.
- Dependencies: ENV-SAFETY-RECON-001.
- Risks: false confidence if guard is incomplete.
- Next action: evaluate during environment/data safety reconciliation.
- Links / evidence: prior environment safety content merged here; use git history only.

### PLAN-RECON-OTA-001

- ID: PLAN-RECON-OTA-001
- Title: Review OTA concepts against v8.4
- Type: Source Review
- Parent: OvertimeAthlete source ingestion
- Priority: P2
- Status: Scope review required
- Lane: Source-review
- Owner: Mike / Codex
- Source: Gemini intake
- Problem: OTA concepts may or may not align with v8.4.
- Desired outcome: compare concepts only after source ingestion and approval.
- In scope: future concept comparison.
- Out of scope: immediate plan changes.
- Acceptance criteria: any source-update proposal is explicit and approved.
- Dependencies: SOURCE-INGEST-OTA-001.
- Risks: unapproved source drift.
- Next action: defer.
- Links / evidence: Gemini intake.

### SPORT-SCHEDULE-VERIFY-001

- ID: SPORT-SCHEDULE-VERIFY-001
- Title: Verify unconfirmed camp claims before plan changes
- Type: Source Review
- Parent: Training/source system
- Priority: P0
- Status: Scope review required
- Lane: Source-review
- Owner: Mike
- Source: Gemini intake
- Problem: unverified camps or schedule claims must not become training-plan facts.
- Desired outcome: schedule changes are backed by confirmed project source.
- In scope: verification requirement and future review.
- Out of scope: adding unconfirmed schedule items.
- Acceptance criteria: every new schedule claim is marked verify-before-plan-change until confirmed.
- Dependencies: source documents.
- Risks: plan corruption from unverified schedule assumptions.
- Next action: apply during source-review tasks.
- Links / evidence: AGENTS source-of-truth rules.

### SPORT-LOAD-4V4-SUMMER-2026

- ID: SPORT-LOAD-4V4-SUMMER-2026
- Title: Bell Sensplex 4v4 Summer Hockey Integration
- Type: Source Review / Feature
- Parent: Training/source system
- Priority: P1
- Status: Scope review required
- Lane: Source-review -> Safe lane app import
- Owner: Mike / Codex
- Source: Mike-provided Bell Sensplex 4v4 summer hockey schedule.
- Problem: Confirmed July-August 2026 Bell Sensplex 4v4 games were not represented as planned Sport Load in the current offseason plan surfaces.
- Desired outcome: 4v4 appears as planned Sport Load and part of Maddox's offseason development environment across the approved app surfaces.
- In scope: source capture, schedule verification against user-provided times/arenas, and safe-lane app import into planned Sport Load, Day Execution Plan, Calendar, Day/Today, and Plan/Gantt.
- Out of scope: app implementation in this docs-only task, `imports/v8.4/data/*.json` edits, Supabase writes, completed logs, workout rewrites, KPI work, AI Coach, automatic load-risk labeling, or automatic dryland cancellation.
- Acceptance criteria: the exact schedule is preserved; 4v4 is framed as planned hockey development and Sport Load; integration rules avoid automatic cancellation and use readiness-based adjustment only; source import, Day/Today, Calendar, and Plan/Gantt render the planned Sport Loads.
- Dependencies: source-review approval for the import path; current Sport Load display/logging rules; v8.4 source-update or overlay-import strategy if approved later.
- Risks: treating 4v4 as an overload emergency would misframe the product decision; treating it as non-plan work would hide a high-value hockey stimulus from Day/Calendar/Gantt planning.
- Next action: post-commit/deploy smoke for Plan/Gantt, then return to `AUDIT-LOAD-CLASSIFICATION-001`.
- Links / evidence: Mike source-capture request on 2026-07-05; commits `0bba866`, `d922217`; local `PLAN-GANTT-SPORTLOAD-V84-001` fix.

Product interpretation:

- 4v4 is planned Sport Load and part of Maddox's offseason development environment.
- It supports game-speed decisions, puck touches under pressure, compete, scanning, shift-like conditioning, and confidence attacking space.
- Mike is not concerned that Maddox is overtired; Maddox is faring well.
- Do not label these dates as automatic load-risk days.
- Do not auto-cancel training because of 4v4.
- Adjust surrounding work only based on readiness, soreness, camp stacking, travel, or parent observation.

Schedule to integrate:

| Date | Time | Venue |
| --- | --- | --- |
| 2026-07-05 | 3:15-3:40 PM | Bell Sensplex Canadian Tire Arena |
| 2026-07-05 | 4:15-4:40 PM | Bell Sensplex Canadian Tire Arena |
| 2026-07-12 | 4:30-4:55 PM | Bell Sensplex Myers Automotive Arena |
| 2026-07-12 | 4:55-5:20 PM | Bell Sensplex Myers Automotive Arena |
| 2026-07-19 | 3:30-3:55 PM | Bell Sensplex BrokerLink Arena |
| 2026-07-19 | 3:55-4:20 PM | Bell Sensplex BrokerLink Arena |
| 2026-07-26 | 2:15-2:40 PM | Bell Sensplex Canadian Tire Arena |
| 2026-07-26 | 2:40-3:05 PM | Bell Sensplex Canadian Tire Arena |
| 2026-08-03 | 3:25-3:50 PM | Bell Sensplex BrokerLink Arena |
| 2026-08-03 | 4:00-4:25 PM | Bell Sensplex BrokerLink Arena |
| 2026-08-05 | 7:00-7:25 PM | Bell Sensplex BrokerLink Arena |
| 2026-08-05 | 7:25-7:50 PM | Bell Sensplex BrokerLink Arena |
| 2026-08-09 | 4:30-4:55 PM | Bell Sensplex Myers Automotive Arena |
| 2026-08-09 | 4:55-5:20 PM | Bell Sensplex Myers Automotive Arena |
| 2026-08-16 | 6:55-7:20 PM | Bell Sensplex Myers Automotive Arena |
| 2026-08-16 | 7:55-8:20 PM | Bell Sensplex Myers Automotive Arena |
| 2026-08-23 | 3:25-3:50 PM | Bell Sensplex Myers Automotive Arena |
| 2026-08-23 | 4:00-4:25 PM | Bell Sensplex Myers Automotive Arena |

Scheduling interactions to consider, not automatic risk dates:

- 2026-07-05: day before Chase Hull camp.
- 2026-08-03: return-from-trip day, VIA52 arrival 13:11.
- 2026-08-05: during Carleton camp week.
- 2026-08-16: possible Marc O'Connor + 4v4 same day.
- 2026-08-23: day before Sensplex camp.

### PLAN-GANTT-SPORTLOAD-V84-001

- ID: PLAN-GANTT-SPORTLOAD-V84-001
- Title: Render Plan/Gantt Sport Load overlays from v8.4 Sport Loads
- Type: Defect / Feature
- Parent: `SPORT-LOAD-4V4-SUMMER-2026`
- Priority: P1
- Status: Completed
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Production/source-impact QA after `0bba866` and `d922217`.
- Problem: Plan/Gantt still used stale hardcoded/legacy Sport Load interpretation while Day/Today and Calendar rendered v8.4 planned Sport Loads correctly.
- Desired outcome: Plan/Gantt Sport Load overlays and week summaries derive from v8.4 `sportLoads` so July-August 4v4 and existing Sport Loads are visible without duplicating the schedule.
- In scope: bounded Plan page helper and rendering update, focused tests, docs handoff/report update.
- Out of scope: source JSON edits, v8.4 count changes, Supabase, completed logs, Day/Calendar/KPI/Weakness Overlay changes, Gantt visual redesign.
- Acceptance criteria: Plan/Gantt includes Bell Sensplex 4v4 dates and existing Sport Loads; derives from v8.4 data; user-facing copy avoids `External Load`; no forbidden wording.
- Dependencies: v8.4 `sportLoads.json`; existing locked Gantt weeks/phase model.
- Risks: stale hardcoded Plan rows can hide newly imported Sport Loads or mislead planning.
- Next action: post-deploy smoke, then return to `AUDIT-LOAD-CLASSIFICATION-001`.
- Links / evidence: local helper `lib/planSportLoadOverlay.ts`; tests `lib/planSportLoadOverlay.test.ts`.

### DEF-GANTT-SPORTLOAD-DURATION-001

- ID: DEF-GANTT-SPORTLOAD-DURATION-001
- Title: Plan/Gantt displays day-specific Sport Loads as full-week duration bars
- Type: Defect
- Parent: Plan/Gantt / Sport Load presentation
- Priority: P1
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Mike product QA after `f247959`.
- Problem: Daily Sport Loads such as 4v4 Hockey, lacrosse, and Marc O'Connor ice should not render as full-week duration bars. They occur on specific dates inside a week and need date-specific markers/chips. Multi-day Sport Loads such as Toronto Trip should show actual date ranges, not full-week duration.
- Desired outcome: Plan/Gantt date semantics distinguish single-day Sport Loads from multi-day Sport Loads while preserving v8.4 as the source of truth.
- In scope: bounded Plan/Gantt presentation fix, v8.4-derived Sport Load date/span logic, focused tests, and no data mutation.
- Out of scope: source JSON edits, import count changes, Supabase, completed logs, Calendar/Day/KPI changes, broad Gantt redesign, or new training content.
- Acceptance criteria:
  - Single-day Sport Loads render as date-specific markers/chips.
  - Multi-day Sport Loads render as actual date spans.
  - 4v4 appears in every scheduled date's correct week.
  - Lacrosse appears only on actual lacrosse dates.
  - Marc O'Connor appears only on actual Marc O'Connor dates.
  - Toronto Trip shows its real multi-day range.
  - Camps show actual camp date ranges.
  - Gantt must not imply a single-day Sport Load lasts a full week.
- Dependencies: `PLAN-GANTT-SPORTLOAD-V84-001`; v8.4 `sportLoads`; existing Plan/Gantt helper.
- Risks: week-wide bars can mislead Mike/Maddox into thinking a single-day Sport Load lasts all week.
- Next action: implement after `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` is documented.
- Links / evidence: Mike scope-capture request after production smoke passed for `/plan`.

### DEF-ENV-PREVIEW-SUPABASE-MAPPING-001

- ID: DEF-ENV-PREVIEW-SUPABASE-MAPPING-001
- Title: Preview/Staging/Production Supabase mapping is not sufficiently visible
- Type: Defect
- Parent: Environment safety
- Priority: P1
- Status: Not started
- Lane: Docs-only / environment-safety
- Owner: Mike / Codex
- Source: Mike environment-safety concern after preview/staging observations.
- Problem: The project previously had confusion about whether Vercel Preview was connected to the production Supabase database. A new Supabase warning for `maddox-training-os-staging` highlights that staging may auto-pause, making environment mapping more important.
- Desired outcome: Environment mapping is documented clearly enough that Mike can tell whether local, Preview, and Production operations are safe before any write-capable test.
- In scope: inspect/document mapping for local development, Vercel Preview, Vercel Production, Supabase staging, and Supabase production; document staging auto-pause behavior; confirm no writes or env changes during audit.
- Out of scope: changing environment variables, rotating keys, mutating Supabase, adding keepalive automation, or deploying.
- Acceptance criteria:
  - Identify which Supabase project local development uses.
  - Identify which Supabase project Vercel Preview uses.
  - Identify which Supabase project Vercel Production uses.
  - Document staging auto-pause risk.
  - Document what happens if staging is paused.
  - Confirm no environment variables are changed during the audit.
  - Confirm no Supabase writes are performed.
- Dependencies: `scripts/preflight.mjs`, `scripts/env-whoami.mjs`, Vercel/Supabase environment access where available.
- Risks: Preview or local testing could accidentally point to production; a paused staging project can look like an app failure.
- Next action: manually confirm Vercel Preview and Vercel Production Supabase env vars in the Vercel dashboard without copying or displaying secret values.
- Links / evidence: prior `ENV-PREVIEW-DB-001`, `ENV-PREVIEW-DB-AUDIT-001`, and Supabase staging warning for project `npuankmkxbjtlokbpczz`.

Audit findings on 2026-07-08:

| Environment / project | Supabase project ref | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Local development | `npuankmkxbjtlokbpczz` | Known | `.env.local` `NEXT_PUBLIC_SUPABASE_URL` project ref; `node scripts/env-whoami.mjs` classified local as staging | This matches the known staging project. No keys were printed. |
| Supabase staging | `npuankmkxbjtlokbpczz` | Known | Mike-provided staging warning; `docs/KPI_CLOUD_SYNC_STAGING_TEST_PLAN.md`; `.env.local` | Project name: `maddox-training-os-staging`. Region previously documented as West US (Oregon) `us-west-2`. |
| Supabase production | `mbjcedhysniabbaigsko` | Known from local backup/docs | `.env.local.production-backup` URL project ref; `docs/STARTUP.md` production Supabase dashboard link | Treat as production Maddox data. Do not print keys or use for local writes without explicit production confirmation. |
| Vercel Preview | Unknown | Needs dashboard confirmation | No `.vercel/project.json` or `vercel.json` exists locally; local repo files do not expose Vercel Preview env values | Preview previously displayed production-like KPI data, but this does not prove whether it uses production, staging with copied data, or another mirrored source. No Preview writes until confirmed staging/non-production or explicitly read-only. |
| Vercel Production | Unknown from safe local repo inspection | Needs dashboard confirmation | No local Vercel project config or safe env-value listing proves Production env vars | Expected target is production Supabase `mbjcedhysniabbaigsko`, but this remains dashboard-confirmation-needed until Vercel env values are checked without exposing secrets. |

Manual / dashboard confirmation required:

- In Vercel project settings, confirm `NEXT_PUBLIC_SUPABASE_URL` for Production points to project ref `mbjcedhysniabbaigsko`.
- In Vercel project settings, confirm `NEXT_PUBLIC_SUPABASE_URL` for Preview points to project ref `npuankmkxbjtlokbpczz`, or explicitly classify Preview as read-only if it points to production.
- Confirm whether Vercel Development env vars exist and whether they match staging.
- Do not copy, paste, screenshot, or commit Supabase anon keys, service-role keys, tokens, JWTs, passwords, or full secret values.
- Do not perform Preview save/write testing until Preview mapping is confirmed.

### DEF-SUPABASE-STAGING-AUTOPAUSE-001

- ID: DEF-SUPABASE-STAGING-AUTOPAUSE-001
- Title: Supabase staging project at risk of inactivity auto-pause
- Type: Defect
- Parent: Environment safety
- Priority: P2
- Status: In progress
- Lane: Docs-only / environment-safety
- Owner: Mike / Codex
- Source: Supabase inactivity warning reported by Mike.
- Problem: Supabase sent an inactivity warning for `maddox-training-os-staging`, project ID `npuankmkxbjtlokbpczz`. The project is not paused yet, but may be paused automatically if it continues not to receive sufficient activity.
- Desired outcome: Decide how staging uptime should be handled without confusing staging failures with production app defects.
- In scope: document the warning, staging/local QA impact, and decision options.
- Out of scope: keepalive implementation, paid-plan upgrade, Supabase writes, or environment changes in this docs capture.
- Acceptance criteria: Production is not identified in the warning; staging/local QA failure mode is documented; decision options are captured.
- Dependencies: `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`.
- Risks: paused staging can break local/preview QA and drive accidental production testing.
- Next action: decide whether to allow staging to pause and manually resume, create a safe read-only staging health check, or upgrade Supabase if staging uptime becomes important.
- Links / evidence: Supabase warning for `maddox-training-os-staging`, project ID `npuankmkxbjtlokbpczz`.

Audit findings on 2026-07-08:

- Supabase staging project name: `maddox-training-os-staging`.
- Supabase staging project ID/ref: `npuankmkxbjtlokbpczz`.
- Current warning state from Mike: project is not paused yet, but may auto-pause if inactive.
- Local development currently points to this staging project.
- If staging pauses, local development and any correctly configured Vercel Preview environment may fail to load or sync cloud data until staging is resumed.
- This warning does not identify production.
- No keepalive, billing, project-resume, environment-variable, or database changes were made during this audit.

Decision options:

- Allow staging to auto-pause and manually resume it from Supabase dashboard when needed.
- Add a safe read-only staging health check only if keeping staging warm becomes important.
- Upgrade Supabase only if staging uptime becomes important enough to justify it.

### QA-AUTOMATION-OWNERSHIP-001

- ID: QA-AUTOMATION-OWNERSHIP-001
- Title: Shift recurring smoke/regression testing from Codex to deterministic scripts and CI
- Type: Epic
- Parent: QA system
- Priority: P1
- Status: Not started
- Lane: Docs-only / QA ownership
- Owner: Mike / Codex
- Source: Mike workflow concern after repeated production smoke tasks.
- Problem: Codex is being used too often as a recurring manual test runner. This burns context, 5-hour limit, weekly limit, and Mike approval time.
- Desired outcome: Recurring QA moves into deterministic scripts and CI, with Codex used to write tests and analyze failures rather than repeatedly click or fetch the same pages.
- In scope: ownership model, QA automation sequencing, smoke-suite scope, and usage-reduction guardrails.
- Out of scope: implementing Playwright tests in this docs capture, installing packages, GitHub Actions, or production smoke execution.
- Acceptance criteria:
  - Codex writes tests.
  - npm scripts / Terminal / CI run repeatable tests.
  - Codex analyzes failures.
  - Mike performs product acceptance only.
- Dependencies: `QA-PLAYWRIGHT-SMOKE-001`, existing QA contract docs.
- Risks: continued manual smoke work burns Codex usage and increases approval friction.
- Next action: capture ownership model, then create deterministic smoke suite scope.
- Links / evidence: post-4v4 smoke workflow and Mike usage concern.

### QA-PLAYWRIGHT-SMOKE-001

- ID: QA-PLAYWRIGHT-SMOKE-001
- Title: Create deterministic Playwright smoke suite for core routes
- Type: Task
- Parent: `QA-AUTOMATION-OWNERSHIP-001`
- Priority: P1
- Status: Not started
- Lane: Safe lane / QA automation
- Owner: Mike / Codex
- Source: Mike workflow concern and repeated read-only production smoke checks.
- Problem: Core-route smoke validation is being performed manually/ad hoc by Codex instead of repeatable automation.
- Desired outcome: Read-only deterministic smoke tests cover Today, Day, Calendar, Plan/Gantt, and KPI visibility so recurring route checks do not require bespoke Codex sessions.
- In scope: reusable Playwright smoke suite design and implementation in a later task using existing approved tooling.
- Out of scope: Playwright install in this docs capture, production writes, save/submit flows, broad QA matrix expansion, or app behavior changes.
- Acceptance criteria: repeatable smoke command validates core route rendering and key labels without mutating data.
- Dependencies: `QA-AUTOMATION-OWNERSHIP-001`, QA contract docs, existing Playwright proof-of-life.
- Risks: without deterministic smoke coverage, product acceptance continues to rely on screenshots and one-off Codex runs.
- Next action: implement after environment mapping and Gantt duration semantics are handled.
- Links / evidence: `QA-AUTOMATION-002`; repeated post-deploy smoke tasks.

### DEF-QA-CODEX-RUNNER-001

- ID: DEF-QA-CODEX-RUNNER-001
- Title: Codex is being used as a recurring manual smoke-test runner
- Type: Defect
- Parent: `QA-AUTOMATION-OWNERSHIP-001`
- Priority: P1
- Status: Not started
- Lane: Docs-only / QA workflow
- Owner: Mike / Codex
- Source: Mike workflow concern.
- Problem: Codex sessions are repeatedly used for manual browser/fetch smoke checks that should be deterministic scripts.
- Desired outcome: Recurring smoke checks become scripted/CI-owned, with Codex reserved for test creation, interpretation, and fixes.
- In scope: workflow defect capture and linkage to `QA-PLAYWRIGHT-SMOKE-001`.
- Out of scope: implementing tests in this docs capture.
- Acceptance criteria: recurring smoke scope has a deterministic owner and no longer defaults to ad hoc Codex sessions.
- Dependencies: `QA-AUTOMATION-OWNERSHIP-001`.
- Risks: Codex usage limits and Mike approval burden continue to be consumed by repeat validation.
- Next action: include in QA ownership scope.
- Links / evidence: repeated production smoke requests after 4v4 Day/Plan fixes.

### DEF-QA-USAGE-LEDGER-001

- ID: DEF-QA-USAGE-LEDGER-001
- Title: No prompt-level Codex usage ledger exists
- Type: Defect / Task
- Parent: `QA-AUTOMATION-OWNERSHIP-001`
- Priority: P2
- Status: Not started
- Lane: Docs-only / workflow
- Owner: Mike / Codex
- Source: Mike usage concern.
- Problem: There is no lightweight ledger that helps track when Codex usage is spent on implementation, QA automation creation, repeated smoke execution, or planning.
- Desired outcome: A prompt-level usage ledger or equivalent workflow record helps avoid spending Codex time on repeatable test-running work.
- In scope: define a small usage-ledger approach after higher-priority environment and Gantt items.
- Out of scope: building dashboards, automating billing/usage introspection, or changing Codex product settings.
- Acceptance criteria: future sessions can classify usage by task type and identify repeat work that should move to scripts/CI.
- Dependencies: `QA-AUTOMATION-OWNERSHIP-001`.
- Risks: usage concerns remain anecdotal and hard to improve.
- Next action: create ledger scope/design after `QA-PLAYWRIGHT-SMOKE-001` is underway.
- Links / evidence: Mike concern that Codex is burning context, the 5-hour limit, weekly limit, and approval time.

### TRAINING-SAFETY-U12-001

- ID: TRAINING-SAFETY-U12-001
- Title: Youth strength safety guardrails
- Type: Source Review
- Parent: Training/source system
- Priority: P1
- Status: Scope review required
- Lane: Source-review
- Owner: Mike / Codex
- Source: Gemini intake
- Problem: strength and conditioning content must remain age-appropriate for a U12 athlete.
- Desired outcome: safety guardrails inform future source review and app language.
- In scope: safety review, pain/fatigue/sloppy-mechanics stop rules, adult-pressure avoidance.
- Out of scope: immediate app changes unless separately tasked.
- Acceptance criteria: future source updates respect U12 safety constraints.
- Dependencies: source-review phase.
- Risks: overloading or unsafe guidance.
- Next action: include in source-review backlog.
- Links / evidence: prior training epics content merged here; use git history only.

### CONDITIONING-MODEL-001

- ID: CONDITIONING-MODEL-001
- Title: Distinguish hockey conditioning from recovery Zone 2 cardio
- Type: Source Review
- Parent: Training/source system
- Priority: P1
- Status: Scope review required
- Lane: Source-review
- Owner: Mike / Codex
- Source: Gemini intake
- Problem: hard hockey conditioning and easy recovery cardio serve different purposes.
- Desired outcome: source model and app language distinguish intervals from recovery work.
- In scope: source-review model and future app copy/rules.
- Out of scope: adding conditioning load silently.
- Acceptance criteria: recovery bike/walk is not treated as hard conditioning.
- Dependencies: recovery day model.
- Risks: accidental overtraining or misleading load.
- Next action: clarify during recovery/source-review work.
- Links / evidence: Gemini intake.

### CONDITIONING-CARDIO-DURATION-001

- ID: CONDITIONING-CARDIO-DURATION-001
- Title: Permanent load-based controlled bike/treadmill duration rule
- Type: Task
- Parent: Training/source system
- Priority: P1
- Status: Completed
- Lane: Fast lane / canonical plan-source or projection-rule implementation
- Owner: Mike / Codex
- Source: Mike scope registration request; related DEF-020 and CONDITIONING-MODEL-001.
- Problem: Controlled bike/treadmill cardio duration must manage total training load instead of using a single duration across easy, medium, and hard days.
- Desired outcome: Controlled bike/treadmill cardio uses a permanent day-load rule: easy days 45 minutes, medium days 30 minutes, hard days 20 minutes.
- In scope: identify the canonical source/rule layer for planned controlled bike/treadmill duration, determine day load reliably, recognize controlled bike/treadmill entries, implement the smallest permanent rule, and prove Day plus active Session parity and all-84 Day readiness.
- Out of scope: DEF-029 copy clarity unless the exact same canonical source row must be touched and the copy change is narrow and obvious; saved records; Supabase; logging behavior; KPI logic; Dashboard; History; Calendar; Exports; Gantt; broad training-plan rewrites; hardcoded date exceptions.
- Acceptance criteria: controlled bike/treadmill cardio easy days = 45 minutes; controlled bike/treadmill cardio medium days = 30 minutes; controlled bike/treadmill cardio hard days = 20 minutes; implemented in canonical source/rule layer, not a page-specific override; Day and active Session duration parity remains verified; all-84 Day readiness proof remains passing; no saved data or Supabase mutation.
- Dependencies: DEF-020; CONDITIONING-MODEL-001; completed ACTIVITY-PRESENTATION-CONTRACT-001 and DAY-SESSION-PARITY-001 guardrails.
- Risks: corrupting approved plan data, masking source issues with UI-only overrides, mutating saved evidence, or accidentally changing non-bike/treadmill conditioning prescriptions.
- Next action: keep the completed duration rule unchanged; use `AUDIT-LOAD-CLASSIFICATION-001` to explain current duration/load-tier rendering and feed `DEF-032`.
- Links / evidence: Completed by `a01beca`; shared planned-activity projection applies controlled cardio durations of 45 minutes for easy/recovery/lighter/deload days, 30 minutes for medium days, and 20 minutes for hard days; Day and active Session consume the same projected planned duration; proof passed with `npx vitest run lib/projections/activityPresentation.test.ts lib/projections/dayPresentation.test.ts` (20/20), `npm run lint`, `npm run build`, `node scripts/verify-v8.4-import.mjs`, and `git diff --check`. Related: DEF-020; DEF-029 was reopened by later product QA; DEF-032 now owns explainability concerns; CONDITIONING-MODEL-001; commits `c20432c`, `05019f5`, `6ab3f5e`, and `f5c35a8`.

Hard rejection criteria:

- Saved session rewrite.
- Supabase mutation.
- User-entered data mutation.
- Logging behavior change.
- Hardcoded date table.
- UI-only override if a canonical source/rule exists.

### AGENTIC-WORKFLOW-002

- ID: AGENTIC-WORKFLOW-002
- Title: Evaluate VS Code agent workflow alternatives
- Type: Task
- Parent: Agentic workflow evaluation
- Priority: P3
- Status: Scope review required
- Lane: Future roadmap
- Owner: Mike
- Source: Gemini intake
- Problem: workflow tools may help but are not urgent product scope.
- Desired outcome: compare Roo Code, Continue.dev, Cursor, Claude Code, Codex alternatives later.
- In scope: future review.
- Out of scope: installing or configuring tools now.
- Acceptance criteria: recommendation made only after product P1s.
- Dependencies: AGENTIC-WORKFLOW-001.
- Risks: tooling churn.
- Next action: defer.
- Links / evidence: Gemini intake.

## Closed-Loop Design Governance Records

These records capture future architecture and governance only. They do not authorize app behavior changes, Supabase/schema changes, source JSON edits, package installs, model implementation, recommendation behavior, sensor/video capture, or methodology retrofit into the current app.

### DESIGN-GATE-001

- ID: DESIGN-GATE-001
- Title: Conceptual to Functional to Technical Design Governance
- Type: Initiative
- Parent: Closed-Loop Training Intelligence
- Priority: P1
- Status: In progress
- Lane: Docs-only / design-governance
- Owner: Mike / Codex
- Source: Product QA after `f5c35a8`; architecture checkpoint
- Problem: Tactical controlled-cardio defects exposed multiple rendering paths, inconsistent classification, source/raw wording leaks, ad hoc load classification risk, and no accepted methodology-grade day/activity/domain load model.
- Desired outcome: Closed-Loop methodology moves through Conceptual Design -> Functional Design -> Technical Design -> Research / Validation Design -> Current-App Transition Plan -> Data-Retention / No-Data-Loss Plan -> QA / Safety Design -> Build Readiness -> Implementation.
- In scope: design gates, role/RACI, required design packages, current-app protection, no-data-loss requirements, and build-readiness criteria.
- Out of scope: implementation, current-app retrofit, final domain count selection, final data source selection, Supabase mutation, source JSON edits, app code edits.
- Acceptance criteria: no Closed-Loop implementation begins until conceptual, functional, technical, research/validation, transition, data-retention, integration/retrofit, QA/test, and build-readiness gates are accepted.
- Dependencies: TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, DOMAIN-DECISION-001.
- Risks: conceptual design could be mistaken for accepted implementation scope.
- Next action: complete design package review; do not implement.
- Links / evidence: `docs/design/DESIGN_GATE.md`, `docs/design/ROLE_RACI.md`, `docs/design/DECISION_LOG.md`.

### TRANSITION-001

- ID: TRANSITION-001
- Title: Current App Protection and Closed-Loop Architecture Transition Plan
- Type: Initiative
- Parent: DESIGN-GATE-001
- Priority: P1
- Status: In progress
- Lane: Docs-only / architecture-safety
- Owner: Mike / Codex
- Source: Architecture checkpoint
- Problem: Future methodology architecture could destabilize current production app or silently change saved training history if retrofitted too early.
- Desired outcome: current app remains production system; v8.4 remains authoritative; future methodology layer is designed in parallel before integration.
- In scope: current-app protection, compatibility requirements, rollback/no-data-loss strategy, source JSON protection, Supabase/schema protection, saved-data immutability.
- Out of scope: migrations, schema changes, Supabase writes, source edits, behavior changes.
- Acceptance criteria: implementation cannot start without approved transition, integration/retrofit, rollback, and no-data-loss plan.
- Dependencies: DATA-GOV-001, TD-006, TD-012.
- Risks: tactical defects could become stealth methodology implementation.
- Next action: define current-app transition functional and technical designs.
- Links / evidence: `docs/design/DESIGN_GATE.md`, `docs/design/FUNCTIONAL_DESIGN_BACKLOG.md`, `docs/design/TECHNICAL_DESIGN_BACKLOG.md`.

### DATA-GOV-001

- ID: DATA-GOV-001
- Title: Data Retention, Provenance, and Integrity Design
- Type: Initiative
- Parent: DESIGN-GATE-001
- Priority: P1
- Status: In progress
- Lane: Docs-only / data-governance
- Owner: Mike / Codex
- Source: Architecture checkpoint
- Problem: Future domain scoring, personalization, recommendations, and plan adjustments require versioning, provenance, auditability, and no-data-loss rules before persistence work.
- Desired outcome: version every exercise-domain profile, methodology model, and scoring rule set; preserve provenance, confidence, validation status, recommendation audit trail, and parent approval/rejection/defer decisions.
- In scope: data-retention design, immutable production history rule, reversible/replayable migration requirement, child-athlete privacy/safety considerations.
- Out of scope: current Supabase mutation, schema changes, data migration.
- Acceptance criteria: future methodology data cannot overwrite production history, silently rewrite plans, or mutate global baseline matrix scores from athlete-specific output.
- Dependencies: MODEL-GOVERNANCE-001, ATHLETE-PERSONALIZATION-001.
- Risks: model/scoring changes could become untraceable.
- Next action: define data retention/provenance functional and technical designs.
- Links / evidence: `docs/design/DECISION_LOG.md`, `docs/design/TECHNICAL_DESIGN_BACKLOG.md`.

### SOURCE-VALIDATION-001

- ID: SOURCE-VALIDATION-001
- Title: Exercise Domain Scoring Source and Validation Strategy
- Type: Source Review
- Parent: DESIGN-GATE-001
- Priority: P1
- Status: In progress
- Lane: Docs-only / research-capture
- Owner: Mike / Codex
- Source: Architecture checkpoint
- Problem: The app lacks an accepted way to source and validate exercise-domain scores without in-house sports science staff.
- Desired outcome: candidate source classes are evaluated without treating any one source as authoritative.
- In scope: commercial metadata APIs, open-source biomechanics datasets, literature review, manual expert review, deterministic heuristic scoring, LLM-assisted attribute extraction.
- Out of scope: selecting final source, final score model, final domain count, commercial API, or production scoring dataset.
- Acceptance criteria: LLMs may extract structured biomechanical attributes but may not directly assign final 0-10 exercise-domain scores without deterministic rules and validation.
- Dependencies: RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001.
- Risks: adult/elite biomechanics or commercial metadata could be misapplied to a U12 athlete.
- Next action: evaluate source credibility, licensing, validation use, production use, conflict handling, and approval workflow.
- Links / evidence: `docs/design/OPEN_SOURCE_RESEARCH_REPOSITORIES.md`, `docs/design/RULE_BASED_SCORING_ENGINE_APPROACH.md`.

### Research, Scoring, Personalization, Governance, and Stack Records

| ID | Title | Type | Priority | Status | Lane | Purpose / next action |
| --- | --- | --- | --- | --- | --- | --- |
| RESEARCH-REPOSITORIES-001 | Open-Source Research Repository Evaluation | Source Review | P1 | In progress | Docs-only / research-capture | Evaluate OpenBiomechanics, AddBiomechanics, OpenCap, SPORTDiscus, and commercial metadata sources as candidates only; preserve exact source links. |
| KNOWLEDGE-INGESTION-001 | Programmatic Exercise Attribute Ingestion Pipeline | Initiative | P1 | In progress | Docs-only / future design | Design LLM-assisted attribute extraction into validated schema; LLM must not assign final scores. |
| HEURISTIC-SCORING-001 | Deterministic Exercise Domain Scoring Engine | Initiative | P1 | In progress | Docs-only / future design | Translate raw attributes into inspectable, testable, rule-derived 0-10 vectors with constraints, confidence, provenance, and review status. |
| ATHLETE-PERSONALIZATION-001 | Personalized Effective Load Vector | Initiative | P1 | In progress | Docs-only / future design | Keep baseline domain vectors stable while computing session/day-specific personalized effective load from actual output and readiness context. |
| SENSOR-FEEDBACK-001 | Wearable / IMU / Video Feedback Integration | Initiative | P1 | In progress | Docs-only / future design | Document future signal candidates only; no wearable, IMU, or video integration is current scope. |
| MODEL-GOVERNANCE-001 | Baseline Matrix Versioning and Human Approval | Initiative | P1 | In progress | Docs-only / governance | Version matrices, rules, domain model, personalized scaling, and recommendations; require human/parent approval and rollback capability. |
| STACK-EVOLUTION-001 | Technical Stack Evolution Strategy | Initiative | P1 | In progress | Docs-only / architecture | Evaluate Postgres, JSONB, graph-style relational modeling, vector/similarity search, rule engine, offline scoring, ML service, and MLOps candidates without selecting final stack. |

### Methodology Epic Group

This is a multi-Epic architecture track governed by DESIGN-GATE-001. Implementation priority is not decided.

| ID | Title | Type | Priority | Status | Purpose |
| --- | --- | --- | --- | --- | --- |
| METHODOLOGY-001 | Closed-Loop Training Methodology Architecture | Epic | P1 | Scope review required | Define the full architecture connecting plan design, exercise domains, activity load, completed work, KPI response, readiness, and parent-approved recommendations. |
| DOMAIN-001 | Exercise Domain Matrix | Epic | P1 | Scope review required | Define and validate the exercise/activity domain model. Candidate A is the 12-domain hockey-specific model; Candidate B is the 9-domain generalized model; neither is final. |
| DOMAIN-DECISION-001 | Domain Model Selection Study | Task | P1 | Scope review required | Evaluate whether the final model should use the 12-domain hockey-specific model, 9-domain generalized model, or another approved model. |
| LOAD-001 | Day and Activity Load Classification | Epic | P1 | Scope review required | Replace ad hoc title/string matching with a consistent load model after discovery and design approval. |
| ANALYTICS-001 | Planned vs Actual Domain Load Analytics | Epic | P1 | Scope review required | Convert planned and completed work into domain-load analytics. |
| PHASE-001 | Phase Target vs Actual Alignment | Epic | P1 | Scope review required | Compare actual training exposure against intended phase goals. |
| KPI-DOMAIN-001 | KPI-to-Domain Feedback System | Epic | P1 | Scope review required | Connect KPI results to the domains that should influence them. |
| READINESS-001 | Readiness and Recovery Modifier | Epic | P1 | Scope review required | Ensure recovery context can override analytics. |
| VISUALIZATION-001 | Domain Heatmaps and Methodology Visuals | Epic | P1 | Scope review required | Eventually explain load and development visually. |
| RECOMMENDATION-001 | Parent-Approved Training Adjustment Engine | Epic | P1 | Scope review required | Future recommendation system only; no current behavior. |
| QA-SAFETY-001 | Adversarial Safety and Guardrail Testing Design | Epic | P1 | Scope review required | Design synthetic/adversarial cases for unsafe recommendations, bad matrix values, malformed scores, U12 violations, bypass attempts, noisy sensors, and hallucinated metadata. |
| MLOPS-001 | Methodology Model Monitoring and Drift Governance | Epic | P1 | Scope review required | Future monitoring for recommendation quality, safety overrides, drift, latency, auditability, rule/model version changes, and scoring drift. |

### AUDIT-LOAD-CLASSIFICATION-001

- ID: AUDIT-LOAD-CLASSIFICATION-001
- Title: All-day load classification audit
- Type: Task
- Parent: DEF-029 / DEF-030 / DEF-031 / DEF-032
- Priority: P1
- Status: Not started
- Lane: Docs-only / inspect-only
- Owner: Mike / Codex
- Source: Product QA after `f5c35a8`
- Problem: Current production QA indicates copy, category, and duration rendering may vary by Day presentation path.
- Desired outcome: determine how every day and controlled bike/treadmill activity is currently classified; explain 20/30/45/10-15/other durations; identify old-copy leaks and raw KPI category leaks; identify whether behavior is source-data-driven, projection-driven, or page-render-path-driven.
- In scope: discovery only across all v8.4 days and relevant rendering paths.
- Out of scope: behavior fixes, all-day methodology implementation, source JSON edits, tests, Playwright, Supabase.
- Acceptance criteria: audit feeds DEF-029/030/031/032 and future design program without implementing the methodology architecture.
- Dependencies: current app source inspection only.
- Risks: another narrow fix could miss a rendering path without this audit.
- Next action: run the audit as the next bounded current-app discovery task.
- Links / evidence: production `/day/2026-06-30`, `/day/2026-06-29`, `/day/2026-07-06` QA.

## Defect Summary Records

Detailed defect summary records are owned here. Historical detail is recoverable through git history for the former defect log stub.

| ID | Title | Type | Parent | Priority | Status | Lane | Owner | Source | Problem | Desired outcome | In scope | Out of scope | Acceptance criteria | Dependencies | Risks | Next action | Links / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | Standalone KPI results / cloud sync status requires reconciliation | Defect | KPI system | P0 | Scope review required | Safe lane | Mike / Codex | Defect log | KPI sync/backfill docs conflict. | Current sync/backfill truth before work. | Doc/source review. | Stash apply/backfill now. | Conflicting claims reconciled. | ENV-SAFETY-RECON-001 | Production data risk. | Reconcile sync/env docs. | former defect log stub; use git history only |
| DEF-014 | No consistent sync status across app | Defect | Data sync | P1 | Not started | Safe lane | Mike / Codex | Defect log | Parent cannot consistently see sync state. | App-wide sync visibility. | Design/implementation later. | Current docs task. | Core screens expose clear sync status. | sync model | Ambiguous evidence. | Defer until sync reconciliation. | former defect log stub; use git history only |
| DEF-015 | Production contains unclear seed/test/legacy/orphan data | Defect | Production data safety | P0 | Scope review required | Safe lane | Mike | Defect log | Production data needs review. | Cleanup rules without fake data. | Operator review. | Data mutation now. | Cleanup plan approved. | env safety | Accidental deletion. | Review later. | former defect log stub; use git history only |
| DEF-016 | Formal production regression plan still needed | Defect | QA system | P1 | Not started | Safe lane | Mike / Codex | Defect log | No formal release gate. | Smoke checklist and gate. | QA process. | Tool installs now. | Gate documented. | QA-SYSTEM-001 | Missed regressions. | Reconcile QA docs later. | former defect log stub; use git history only |
| DEF-018 | Resting HR not captured on Log Today / readiness | Defect | Recovery/readiness | P1 | Not started | Safe lane | Mike / Codex | Defect log | Readiness lacks resting HR. | Readiness model includes resting HR. | future logging/readiness design. | immediate schema changes. | Resting HR plan accepted. | RECOVERY-READINESS-001 | incomplete readiness. | Defer. | former defect log stub; use git history only |
| DPM-QA-006 | Calendar page did not render all v8.4 plan days | Defect | Calendar | P0 | Completed | Fast lane | Codex | Calendar QA | Calendar omitted v8.4-only dates. | Calendar renders all 84 dates. | Completed fix. | none. | June 20/21 visible in Week 1. | accepted commit | regression risk. | Keep regression coverage in future. | commit `7b48a3e` |
| DEF-002 | June 16 reflection appears as "Unknown workout" | Defect | History/projection | P1 | Scope review required | Safe lane | Mike / Codex | Defect log | Needs current verification. | Correct labels. | Verify/fix later. | current docs task. | Verified current state. | projection audit | stale claim risk. | Review during KPI/History work. | former defect log stub; use git history only |
| DEF-003 | KPI-like drills appear as normal workout cards with sets/reps | Defect | KPI/day display | P1 | Scope review required | Fast lane | Mike / Codex | Defect log | KPI-like training can be confused with tests. | Distinguish KPI tests from training. | verify/render rules. | source invention. | no misleading KPI status. | Activity Prescription | misleading status. | Review with display layer. | former defect log stub; use git history only |
| DEF-004 | June 14 duplicate/test-looking sessions | Defect | Production data | P2 | Scope review required | Safe lane | Mike | Defect log | Production data may contain questionable records. | Operator review. | Review only. | mutation now. | disposition decided. | env safety | production data risk. | Defer. | former defect log stub; use git history only |
| DEF-005 | 0% completion displayed with Completed status | Defect | History/session display | P1 | Scope review required | Fast lane | Mike / Codex | Defect log | Status/percent conflict. | Consistent status display. | verify/fix projection. | broad redesign. | no completed/0% conflict. | projection audit | trust loss. | Review during projections. | former defect log stub; use git history only |
| DEF-006 | June 16 planned baseline fragmented from actual KPI work | Defect | KPI/day evidence | P1 | Scope review required | Safe lane | Mike / Codex | Defect log | KPI evidence fragmentation. | June 16 is coherent. | verify/reconcile. | backfill now. | KPI evidence behavior accepted. | KPI sync review | data confusion. | Review later. | former defect log stub; use git history only |
| DEF-007 | Calendar June 15 Sport Load showed not logged despite logged data | Defect | Calendar | P1 | Completed | Fast lane | Codex | Defect log | Calendar did not show logged state. | logged state preserved. | Completed. | none. | state accepted. | regression coverage | regression risk. | Preserve in future. | former defect log stub; use git history only |
| DEF-4V4-DAY-STACK-001 | Day page only renders first planned Sport Load on stacked Sport Load days | Defect | Day / Sport Load presentation | P1 | Completed locally | Fast lane | Mike / Codex | Production smoke after `0bba866`; `/day/2026-08-03`, `/day/2026-08-05`, `/day/2026-08-16` | Calendar rendered stacked Sport Loads correctly, but Day simple-plan rendering used the first planned Sport Load for the main card/action and hid the added 4v4 item on stacked dates. | Day page renders every planned Sport Load for a date as visible/actionable planned Sport Load work without creating completed logs. | Bounded Day presentation fix and regression tests. | source JSON edits, Supabase writes, completed logs, KPI changes, Calendar redesign, Plan/Gantt work. | Aug 3 shows Toronto Trip + 4v4; Aug 5 shows Carleton Ravens Camp + 4v4; Aug 16 shows Marc O'Connor Ice + 4v4; Jul 5 still shows 4v4. | SPORT-LOAD-4V4-SUMMER-2026 | stacked Sport Loads can be hidden if render paths collapse to first record. | Post-deploy smoke after fix. | local fix in current worktree |
| DEF-4V4-DAY-LABEL-001 | Today/Day page shows stale or incorrect Lacrosse Sport Load chip when no lacrosse is planned | Defect | Day / Today Sport Load presentation | P1 | Completed locally | Fast lane | Mike / Codex | UAT after stacked Sport Load fix | Day Sport Load summary label could show a lacrosse-derived/hardcoded summary instead of the actual planned Sport Load title/count for the date. | Visible Sport Load labels derive from the actual planned Sport Load records; `Lacrosse` appears only when a planned lacrosse Sport Load exists. | Bounded Day label-rule fix and helper tests. | source JSON edits, Supabase writes, completed logs, KPI changes, Calendar redesign, Plan/Gantt work. | `/today` via Day route and `/day/2026-07-05` do not show Lacrosse unless lacrosse is planned; stacked dates still show individual Sport Load titles. | DEF-4V4-DAY-STACK-001, SPORT-LOAD-4V4-SUMMER-2026 | stale/hardcoded labels can misrepresent planned sport work. | Post-deploy smoke after fix. | local fix in current worktree |
| DEF-GANTT-SPORTLOAD-DURATION-001 | Plan/Gantt displays day-specific Sport Loads as full-week duration bars | Defect | Plan/Gantt / Sport Load presentation | P1 | Not started | Fast lane | Mike / Codex | Mike QA after `f247959` | Daily Sport Loads such as 4v4, lacrosse, and Marc O'Connor ice should be date-specific markers/chips, while multi-day trips/camps should show actual spans. | Gantt date semantics reflect real single-day and multi-day Sport Load timing. | bounded Plan/Gantt presentation fix and tests. | source JSON edits, Supabase writes, completed logs, broad Gantt redesign. | single-day markers/chips; multi-day actual spans; 4v4, lacrosse, Marc O'Connor, Toronto Trip, and camps render on correct dates/ranges. | PLAN-GANTT-SPORTLOAD-V84-001 | full-week bars misrepresent daily Sport Loads. | Implement after environment mapping docs. | current docs capture |
| DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | Preview/Staging/Production Supabase mapping is not sufficiently visible | Defect | Environment safety | P1 | In progress | Docs-only / environment-safety | Mike / Codex | Preview DB concern plus staging warning | Local/Preview/Production Supabase target mapping is not visible enough for safe write-testing decisions. | Document local, Preview, Production, staging, and production Supabase mapping without changing env vars or writing data. | inspect/document mapping and staging pause risk. | env var changes, key rotation, Supabase writes, Vercel changes. | local/staging/production refs are documented; Vercel Preview/Production mappings need dashboard confirmation; staging pause behavior documented; no env changes or writes. | ENV-PREVIEW-DB-001, ENV-PREVIEW-DB-AUDIT-001 | accidental production writes or confusing paused-staging failures. | Manually confirm Vercel env URL project refs in dashboard without exposing secrets. | current docs capture plus local audit |
| DEF-SUPABASE-STAGING-AUTOPAUSE-001 | Supabase staging project at risk of inactivity auto-pause | Defect | Environment safety | P2 | In progress | Docs-only / environment-safety | Mike / Codex | Supabase warning | `maddox-training-os-staging` project `npuankmkxbjtlokbpczz` may auto-pause if inactivity continues. | Decide whether to allow pause/manual resume, add a safe read-only health check, or upgrade if uptime matters. | document warning and decision options. | keepalive implementation, Supabase writes, env changes. | warning captured; production not identified in warning; staging/local QA failure mode documented. | DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | paused staging can derail QA and encourage unsafe production testing. | Decide whether to allow manual resume, add a safe read-only health check, or upgrade. | current docs capture plus local audit |
| DEF-QA-CODEX-RUNNER-001 | Codex is being used as a recurring manual smoke-test runner | Defect | QA automation ownership | P1 | Not started | Docs-only / QA workflow | Mike / Codex | Mike usage concern | Codex is repeatedly running manual/ad hoc smoke checks that should be deterministic scripts. | Move recurring smoke checks to scripts/CI, with Codex writing tests and analyzing failures. | workflow capture linked to Playwright smoke scope. | implementing tests now. | recurring smoke has deterministic owner and no longer defaults to ad hoc Codex sessions. | QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001 | usage and approval burden remain high. | Capture in QA ownership scope. | current docs capture |
| DEF-QA-USAGE-LEDGER-001 | No prompt-level Codex usage ledger exists | Defect / Task | QA automation ownership | P2 | Not started | Docs-only / workflow | Mike / Codex | Mike usage concern | There is no lightweight way to track prompt-level Codex usage by implementation, QA automation, smoke execution, or planning. | Define a usage ledger so repeated runner work can be identified and shifted to automation. | ledger approach/design later. | dashboards, product setting changes, automated billing introspection. | future sessions can classify usage and identify repeat work. | QA-AUTOMATION-OWNERSHIP-001 | usage concerns stay anecdotal. | Create after higher-priority env/Gantt/QA smoke work. | current docs capture |
| DEF-008 | Dashboard metrics ambiguous | Defect | Dashboard | P2 | Not started | Safe lane | Mike / Codex | Defect log | Parent summaries unclear. | Clear metrics. | future projection work. | now. | metrics map to evidence. | KPI-HISTORY-DASHBOARD-001 | misread progress. | Defer. | former defect log stub; use git history only |
| DEF-009 | Needs Attention false positives | Defect | Dashboard | P2 | Not started | Safe lane | Mike / Codex | Defect log | App may flag incorrectly. | Accurate attention rules. | future audit. | now. | false positives reduced. | dashboard model | alert fatigue. | Defer. | former defect log stub; use git history only |
| DEF-010 | Weekly Load actual bar unclear | Defect | Dashboard | P2 | Not started | Fast lane | Mike / Codex | Defect log | Load visualization unclear. | Explainable load. | future UI. | now. | bar meaning clear. | dashboard model | misinterpretation. | Defer. | former defect log stub; use git history only |
| DEF-011 | Plank Quality KPI missing separate time plus form score model | Defect | KPI model | P2 | Not started | Safe lane | Mike / Codex | Defect log | Plank metric shape incomplete. | Time and form score separated. | KPI model design. | now. | model accepted. | KPI-ROADMAP-001 | data mismatch. | Defer. | former defect log stub; use git history only |
| DEF-012 | Puck-Control Weave needs deferred / space-unavailable state | Defect | KPI model | P2 | Not started | Safe lane | Mike / Codex | Defect log | Missing result vs deferred not explicit. | explicit deferred state. | KPI model design. | now. | deferment visible. | KPI-ROADMAP-001 | false missing data. | Defer. | former defect log stub; use git history only |
| DEF-029 | Controlled bike/treadmill copy clarity | Defect | Activity Presentation / Conditioning | P1 | Reopened / product QA found incomplete rendering-path coverage | Fast lane | Mike / Codex | Production QA after `f5c35a8`; `/day/2026-06-30` | Earlier projection copy fix passed technical checks, but production badge `f5c35a8` was visible and `/day/2026-06-30` still displayed `Bike/treadmill are controlled. No treadmill sprinting for U12.` Product acceptance is not complete. | All athlete-facing controlled cardio rendering paths use `Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.` | Audit and bounded current-app rendering-path fix after discovery. | methodology retrofit, source JSON edits, conditioning duration changes, logging changes, Supabase, broad redesign. | Old copy no longer appears on any production Day rendering path; product QA accepts the result separately from technical checks. | DEF-030, DEF-031, DEF-032, AUDIT-LOAD-CLASSIFICATION-001 | multiple rendering paths can pass tests while leaking source/raw wording in production. | Run all-day load classification/rendering-path audit before another fix. | production badge `f5c35a8`; `/day/2026-06-30` old copy visible; exact approved copy remains `Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.` |
| DEF-030 | Controlled cardio activity displays as KPI | Defect | Activity Presentation / Classification | P1 | Not started | Fast lane | Mike / Codex | Production QA after `f5c35a8`; `/day/2026-06-30` | `/day/2026-06-30` shows `STEP 4 · KPI` for `Controlled bike or treadmill`. Raw source entry type or projection classification may be leaking into athlete-facing UI. | Controlled bike/treadmill displays as Conditioning, Recovery Conditioning, or another approved non-KPI activity type unless it is a true KPI protocol. | Audit classification source and bounded current-app fix after discovery. | methodology implementation, source JSON edits, KPI model redesign. | Controlled cardio is not labeled KPI unless it is a true KPI protocol. | AUDIT-LOAD-CLASSIFICATION-001, DEF-031 | athlete/parent may mistake cardio for a test protocol. | Include category rendering in all-day audit. | production `/day/2026-06-30` screenshot QA. |
| DEF-031 | Multiple day presentation formats produce inconsistent day/activity rendering | Defect | Day Presentation / Activity Presentation | P1 | Not started | Fast lane | Mike / Codex | Production QA after `f5c35a8`; `/day/2026-07-06` and `/day/2026-06-30` | `/day/2026-07-06` uses `Today's Simple Plan` while `/day/2026-06-30` uses `Planned Execution Sequence`; copy/category fixes may not apply consistently across Day presentation paths. | Page format may vary by day type, but activity classification, safety copy, source-label suppression, and one day/one truth remain consistent. | Audit presentation paths and define bounded current-app fix. | broad UI redesign, methodology retrofit, Dashboard/History/Calendar/Gantt/Exports/KPI changes. | Same canonical classification/copy rules apply across Simple Plan and Planned Execution Sequence paths. | AUDIT-LOAD-CLASSIFICATION-001, DEF-029, DEF-030 | rendering-path drift undermines product trust. | Include Day format/path mapping in all-day audit. | production `/day/2026-07-06` and `/day/2026-06-30` screenshot QA. |
| DEF-032 | Controlled cardio duration/load-tier classification is not explainable | Defect | Conditioning / Load Classification | P1 | Not started | Source-review / Fast lane audit | Mike / Codex | Product QA after controlled-cardio duration rule | User has not found obvious 30-minute or 45-minute bike/treadmill days after the duration rule; `/day/2026-06-29` shows `Controlled bike or treadmill` as 20 minutes with `Recovery conditioning`, which may be correct hard-day duration with misleading label or incorrect duration for a recovery-classified block. | System can explain why controlled cardio is 20, 30, 45, 10-15, or other minutes; classification should not depend only on ad hoc title/string matching. | All-day classification audit and explanation of current duration/classification sources. | changing durations, changing conditioning model, source JSON edits, methodology implementation. | Audit identifies every controlled cardio duration, load tier, source basis, and rendering label mismatch. | CONDITIONING-CARDIO-DURATION-001, AUDIT-LOAD-CLASSIFICATION-001, LOAD-001 | unexplainable load rules reduce trust and may hide incorrect recovery/hard-day classification. | Run all-day classification audit. | `/day/2026-06-29` screenshot QA; completed rule from `CONDITIONING-CARDIO-DURATION-001`. |
| DEF-013 | History is record-fragmented instead of Week -> Day -> Evidence | Defect | History | P1 | Scope review required | Safe lane | Mike / Codex | Defect log | History grouping may fragment records. | Week -> Day -> Evidence. | verify/reconcile. | now. | grouping accepted. | evidence model | confusing history. | Review later. | former defect log stub; use git history only |
| DEF-017 | Homepage Next Session card uses stale session logic | Defect | Homepage/today | P1 | Scope review required | Fast lane | Mike / Codex | Defect log | Homepage may not use canonical Day. | Today/next card aligns with Day. | verify/fix. | now. | no stale next session. | day projection | stale nav. | Review later. | former defect log stub; use git history only |
| DEF-019 | Blank / unclear future day state | Defect | Day readiness | P1 | Scope review required | Fast lane | Mike / Codex | Defect log | Future days may be unclear. | intentional usable day states. | future audit. | source invention. | upcoming days usable. | FUTURE-DAY-READINESS-001 | athlete blocked. | Audit after display work. | former defect log stub; use git history only |
| DEF-020 | Optional easy bike volume may be too low | Defect | Activity Prescription | P1 | Scope review required | Source-review | Mike / Codex | June 19 browser QA | `Optional Easy Bike — only if fresh` at 20 minutes may be too low-volume for the intended conditioning/recovery prescription. | Verify intended bike/conditioning prescription against approved source before changing display or content. | source review and prescription validation. | changing bike duration/load in display-label slice. | volume concern is reviewed and either source-confirmed or corrected through approved source/update path. | ACTIVITY-PRESCRIPTION-001 | silent content change risk. | Review in a source/prescription scope pass; not fixed in `ACTIVITY-PRESCRIPTION-001A`. | Mike QA note |
| DEF-021 | Day page and Session form use divergent presentation paths | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | June 19 browser QA | June 19 Day page display improved after ACTIVITY-PRESCRIPTION-001A/B/C, but `/session/session-2026-06-19` still showed old labels/copy. | Day and Session surfaces render from the same shared activity presentation/projection contract. | forensic data-flow audit and shared projection fix plan. | more cosmetic surface-only patches. | a change to an activity display label/copy is reflected consistently in both Day and Session surfaces. | FORENSIC-DAY-SESSION-MISMATCH-001 | duplicate projection paths keep producing mismatched athlete instructions. | Audit Day and Session source paths before further implementation. | Mike browser QA |
| DEF-022 | Session form missing planned Day steps | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | June 19 browser QA | June 19 Day page includes Step 2 Warmup and Step 4 Optional Easy Bike, but Session form did not provide corresponding loggable forms. | Every planned Day execution step that should be loggable has a corresponding Session/logging representation, or is explicitly non-loggable with rationale. | audit planned step to session step mapping. | changing logging behavior before approved plan. | Warmup and Optional Easy Bike are either loggable or intentionally excluded by documented rule. | FORENSIC-DAY-SESSION-MISMATCH-001 | planned work may be unloggable. | Audit why Day and Session steps differ. | Mike browser QA |
| DEF-023 | Activity title/duration mismatch | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | June 19 browser QA | Session form showed `Mobility — 15 minutes` while the same form showed `Plan: 10 min`. | Display duration comes from authoritative planned duration when available. | audit duration derivation and code-derived label behavior. | changing source data or bike/recovery prescriptions now. | code-derived duration labels do not conflict with plan duration; discrepancies are preserved for source review. | FORENSIC-DAY-SESSION-MISMATCH-001 | athlete sees contradictory prescription. | Audit title/duration derivation before further display work. | Mike browser QA |
| DEF-024 | Display fixes were surface-specific, not canonical | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | June 19 browser QA | Day page labels/copy changed while Session form retained stale/internal/source copy. | One shared projection/helper is consumed by all athlete-facing execution surfaces. | audit projection ownership and test parity. | additional one-off Day or Session display patches. | tests prove Day and Session projections agree for the same activity IDs. | FORENSIC-DAY-SESSION-MISMATCH-001 | fixes may mask symptoms without correcting architecture. | Decide which current WIP changes to keep, revise, or revert. | Mike browser QA |
| DEF-025 | Session form leaks stale/internal/source language | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | June 19 browser QA | Session form showed labels/copy such as `IQ 5 daily cue`, `Skill IQ Mindset`, `Recovery Rules`, and older scan/support/talk style copy. | Session form does not expose raw/source/workbook labels as athlete-facing primary labels or instructions. | audit Session projection output and add parity tests. | source JSON edits or invented instructions. | known forbidden/internal phrases are covered by tests in Session projection output. | FORENSIC-DAY-SESSION-MISMATCH-001 | session execution remains confusing during live training. | Audit Session form source path and display transformations. | Mike browser QA |
| DEF-026 | Current ACTIVITY-PRESCRIPTION WIP is not commit-ready | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | June 19 browser QA | Browser QA failed across Day/Session consistency and missing loggable steps. | Current WIP is not committed until architecture mismatch is resolved. | forensic audit, fix plan approval, Day/Session parity implementation, browser verification. | committing or pushing current WIP. | forensic data-flow audit completed, fix plan approved, Day and Session parity implemented and browser-verified. | DEF-021, DEF-022, DEF-023, DEF-024, DEF-025 | committing WIP would preserve known critical defects. | Keep WIP uncommitted; start forensic audit. | Mike browser QA |
| DEF-027 | Site-wide activity presentation drift risk | Defect | Activity Prescription | P1 | Blocked | Fast lane | Mike / Codex | FORENSIC-DAY-SESSION-MISMATCH-001 and Mike review | Day and Session already diverged for June 19; similar display/data drift may exist wherever the app renders plan/activity/session labels, including Today, Calendar, Dashboard, History, Library, exports, and reports. | Every athlete-facing consumer of plan/activity/session display data uses or is intentionally classified against the canonical activity presentation contract. | site-wide consumer audit, canonical presentation rules for label, duration, description, source-language filtering, loggable classification, and trace fields. | broad app fixes before Day + Session planned-activity parity; broad redesign; source JSON edits. | every athlete-facing consumer is identified and classified as must consume canonical activity presentation contract now, can consume summary projection from the same contract, admin/source/reference-only exception, or deferred with explicit rationale; tests or fixtures prevent drift for critical surfaces. | SURFACE-PRESENTATION-CONSUMER-AUDIT-001 | surface-specific cosmetic patches may keep creating inconsistent athlete instructions and logging representations. | Use completed `SURFACE-PRESENTATION-CONSUMER-AUDIT-001` findings to constrain `ACTIVITY-PRESENTATION-CONTRACT-001`; defer broad surfaces until Day + Session parity is stable. | Mike review; Day/Session forensic audit; completed consumer audit |
| DEF-028 | Completed-session surfaces bypass ActivityPresentation context | Defect | Activity Presentation | P1 | Completed | Fast lane | Mike / Codex | Production browser QA after `9964e52`; commits `9fd4c73`, `05019f5` | Completed-session/read-only flow previously showed stale legacy title `Speed Stack C, conditioning, and shooting.` while Day and reopened/edit Session showed `Acceleration and accurate shooting.` | Completed-session and previous-attempt surfaces use the same presentation contract where appropriate without mutating saved historical records. | completed-session/read-only display path repaired to prefer canonical day/session presentation title; automated component proof added. | saved session mutation, Supabase writes, backfill, delete, migration, or changing transactional session records to fix display. | Completed-session/read-only title no longer contradicts canonical Day / active Session title when canonical context is available; saved data remains intact. | ACTIVITY-PRESENTATION-CONTRACT-001, QA-AUTOMATION-002 | route-state browser visibility remains state-dependent, but the display fallback behavior is covered by component-level automated proof. | Keep saved records immutable; use targeted fixture work only if future browser coverage is needed. | Commit `9fd4c73` fixed and tested DEF-028; commit `05019f5` verifies Day + active Session planned-activity parity across all 84 v8.4 active session dates. |
| DOC-DRIFT-001 | Documentation current-state drift | Defect | Scope control | P0 | Completed | Docs-only | Mike / Codex | Docs reconciliation | Docs diverged from current reality. | docs are trustworthy. | docs consolidation. | app changes. | active scope centralized. | SCOPE-CONSOLIDATION-001 | wrong next work. | Use `docs/SCOPE.md` as canonical active scope source. | `docs/DOCUMENTATION_INVENTORY.md` |
| DOC-INV-001 | Documentation inventory/consolidation needed | Defect | Scope control | P0 | Completed | Docs-only | Mike / Codex | Docs reconciliation | Docs lacked inventory. | inventory guides archive/merge. | inventory update. | deletion. | inventory reflects SCOPE canonical. | SCOPE-CONSOLIDATION-001 | stale ownership. | Use `docs/DOCUMENTATION_INVENTORY.md` for inventory only. | `docs/DOCUMENTATION_INVENTORY.md` |

## Training / Source Scope

- Activity Prescription Display Layer is the next P1 implementation feature; docs/scope-control and environment safety work are complete.
- Recovery days are not blank days.
- OvertimeAthlete source ingestion/review is future source-review only.
- U12 safety guardrails are source-review scope, not immediate app changes.
- Hockey conditioning intervals must be distinguished from recovery Zone 2 cardio.
- Bell Sensplex 4v4 summer hockey is planned Sport Load and a high-value hockey stimulus; integrate `SPORT-LOAD-4V4-SUMMER-2026` through source-review and safe-lane app import rather than treating it as non-plan work.
- Instruction/video coverage audit is required for athlete-actionable items.
- v8.4 remains authoritative unless Mike explicitly approves a source update.
- Unverified schedule claims must remain "verify before plan change".

## Data / Sync / Environment Scope

- Production Supabase is real Maddox data only.
- Supabase production project ref is `mbjcedhysniabbaigsko` based on local production backup URL and historical docs; treat it as production Maddox data.
- Staging Supabase is for dev/test data once created/configured; current known staging project is `maddox-training-os-staging` with project ref `npuankmkxbjtlokbpczz`.
- Local development currently points to staging ref `npuankmkxbjtlokbpczz` through `.env.local`; `scripts/env-whoami.mjs` classifies local as staging.
- Vercel Preview must point to staging once staging exists.
- Vercel Production must point to production.
- Vercel Preview database target remains unverified after safe local repo inspection because no `.vercel/project.json` or `vercel.json` exists locally and Vercel env values were not pulled. Preview `/kpis` previously showed production-like KPI data at badge `1c336a0 · preview`; do not save KPI results or perform write-capable flows in Preview until dashboard confirmation proves staging/non-production isolation or Preview is explicitly treated read-only.
- Vercel Production database target remains dashboard-confirmation-needed from safe local repo inspection. Expected target is production ref `mbjcedhysniabbaigsko`, but do not treat that as verified Vercel configuration until the dashboard env var is checked without exposing secrets.
- Supabase staging auto-pause warning is active context for project `npuankmkxbjtlokbpczz`; if staging pauses, local and Preview QA may fail until the project is resumed.
- No fake/test records in production.
- KPI cloud-sync stash exists and is not applied.
- `.env.local.production-backup` exists locally and contains secrets; do not commit or display it.
- Environment docs require reconciliation before any deploy/write/backfill.

## Testing Scope

- App-code changes use the standard check set: `npm run lint`, `npm run test`, `npm run build`, `node scripts/verify-v8.4-import.mjs`, `git diff --check`, `git status --short`.
- Documentation-only changes require `git status --short`, `git diff --check`, and markdown/docs lint only if configured.
- Playwright is planned future scope, not implemented in this consolidation.
- Production smoke and release gate remain future QA work.

## Documentation Consolidation / Archive Recommendations

- Keep `AGENTS.md` as rules only.
- Keep `docs/SESSION_HANDOFF.md` as checkpoint only.
- Keep `docs/AGENT_REPORT.md` as latest report only.
- Keep `docs/DOCUMENTATION_INVENTORY.md` as temporary inventory/consolidation tracker.
- Keep former scope-like docs as dead-end stubs with no historical body.
- Archive candidates after Mike review: former handoff/state stubs, old implementation notes that are superseded by tests/docs.
- Historical detail remains available through git history only.

## Items Intentionally Deferred

- KPI cloud-sync stash.
- Production/staging write tests.
- Activity Prescription implementation until docs consolidation and environment safety sequencing are accepted.
- Activity-specific logging fields.
- OvertimeAthlete source ingestion.
- Gemini workflow/tooling setup.
- Husky/pre-commit hook setup.
- Playwright setup.
- AI Coach implementation.
