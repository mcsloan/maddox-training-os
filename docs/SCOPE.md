# Scope

## Purpose

This is the canonical scope, priority, status, sequencing, roadmap, defects-summary, KPI-roadmap, training/source-epic, source-review, and next-task document for Maddox Training OS.

Other planning docs may retain historical detail temporarily, but active scope decisions should be represented here.

## Current Checkpoint

- Branch: `main`.
- Pushed docs checkpoint before the DEF-028 evidence-script commit: `6b174a9` (`docs(qa): record Playwright proof-of-life checkpoint`).
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
- `DEF-028` remains open/not fixed because the completed-session/read-only surface was not exercised in the passing Playwright run.
- Next implementation candidate after this documentation capture: `DEF-028` completed-session display/projection inspect/fix.

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

## Active Execution Queue

| Order | ID | Title | Priority | Status | Lane | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SCOPE-CONSOLIDATION-001 | Scope system consolidation | P0 | Completed | Docs-only | Phase 1 docs/scope-control checkpoint is complete after the `f02bff4` pushed/deployed baseline. |
| 2 | ENV-SAFETY-RECON-001 | Environment/data safety reconciliation | P0 | Completed | Docs-only | Mike review of findings; require explicit approval before any write/deploy/backfill. |
| 3 | CODE-COMMENT-AUDIT-001 | Stale Inline Comment / TODO Audit | P1 | Not started | Fast lane | Run inspect-only comment audit before the next app-code implementation task if time allows. |
| 4 | FORENSIC-DAY-SESSION-MISMATCH-001 | Forensic Day/Session data-flow audit | P1 | Completed | Fast lane | Audit found Day and Session use divergent presentation paths; use findings to drive canonical contract. |
| 5 | SURFACE-PRESENTATION-CONSUMER-AUDIT-001 | Site-wide activity presentation consumer audit | P1 | Completed | Fast lane | Audit completed; use findings to constrain the next Day + Session parity implementation. |
| 6 | ACTIVITY-PRESENTATION-CONTRACT-001 | Planned activity presentation contract, Day + Session parity only | P1 | Not started | Fast lane | Implement `projectPlannedDayActivities(date)` for master/reference plan presentation only; wire Day + Session parity before broader surfaces. |
| 7 | ACTIVITY-PRESCRIPTION-001 | Activity Prescription Display Layer | P1 | Blocked | Fast lane | Current WIP is not commit-ready; address DEF-021 through DEF-027 before acceptance or commit. |
| 8 | TEST-FIXTURE-001 | Verify and Establish Test Fixture Structure | P1 | Not started | Fast lane | Inspect-only QA fixture discovery before or alongside the first Activity Prescription implementation task. |
| 9 | FUTURE-DAY-READINESS-001 | Future-day readiness audit from June 23 onward | P1 | Not started | Fast lane | Audit upcoming Day/Calendar/Session usability. |
| 10 | ACTIVITY-LOGGING-001 | Activity-specific logging fields | P1 | Scope review required | Safe lane | Define fields after prescription display is stable. |
| 11 | DAY-SESSION-PARITY-001 | Day/Session sequence parity | P1 | Not started | Fast lane | Ensure Day planned sequence and Session execution cards match. |
| 12 | PLAN-CONTENT-001 | Plan content/title correctness | P1 | Not started | Source-review | Review title/block mismatches against v8.4 source. |
| 13 | RECOVERY-DAY-MODEL-001 | Recovery-day model completion | P1 | Not started | Source-review | Ensure intentional recovery prescriptions are represented from source. |
| 14 | KPI-ROADMAP-001 | KPI roadmap and advanced KPI scope | P1 | In progress | Safe lane | Preserve scope; implement only after sync/model review. |
| 15 | DAY-FIRST-ARCH-001 | Day-first architecture docs/test fixtures | P1 | Not started | Docs-only | Add fixtures and acceptance docs around canonical Day projection. |
| 16 | KPI-HISTORY-DASHBOARD-001 | KPI/History/Dashboard reconciliation | P1 | Not started | Safe lane | Reconcile projections after day evidence model stabilizes. |
| 17 | QA-SYSTEM-001 | QA/testing system | P1 | Not started | Safe lane | Formalize release gate, fixtures, and later Playwright. |
| 18 | QA-AUTOMATION-002 | Playwright proof-of-life strategy | P1 | Completed | Safe lane | Playwright installed Chrome channel proof-of-life passed locally; use it as a base for targeted DEF-028 regression after display/projection repair. |
| 19 | SESSION-UX-001 | Medium Session UX backlog | P2 | Not started | Fast lane | Improve session usability after core workflow readiness. |
| 20 | SOURCE-INGEST-OTA-001 | OvertimeAthlete source ingestion | P2 | Scope review required | Source-review | Ingest/review source later; do not replace v8.4. |
| 21 | RECOVERY-READINESS-001 | Recovery/readiness system | P2 | Not started | Safe lane | Add readiness fields and parent review model later. |
| 22 | EXPORTS-REPORTING-001 | Exports/reporting | P2 | Not started | Safe lane | Reconcile after evidence model is trusted. |
| 23 | HOCKEY-IQ-001 | Hockey IQ system | P2 | Not started | Source-review | Build Watch -> Apply -> Reflect later from approved sources. |
| 24 | AI-COACH-001 | AI Coach strategy | P3 | Not started | Future roadmap | Start only after data/sync/QA trust. |
| 25 | AGENTIC-WORKFLOW-001 | Agentic workflow evaluation | P3 | Scope review required | Future roadmap | Review workflow tools/process after product P1s. |

## Current Sprint / Next Codex Task

Current sprint: Phase 1 docs/scope-control and environment safety reconciliation are complete. The last verified pushed/deployed production baseline before this realignment was `f02bff4`. `ENV-SAFETY-RECON-001` is completed for the inspection pass.

Next implementation candidate: `DEF-028` completed-session display/projection inspect/fix.

Minimum next task brief:

- Read `AGENTS.md`, `docs/SESSION_HANDOFF.md`, and this file first.
- Start from completed `SURFACE-PRESENTATION-CONSUMER-AUDIT-001` findings.
- Implement Pass 1 only: `projectPlannedDayActivities(date)` for master/reference planned activity presentation and metadata.
- Wire Day + Session planned-activity parity only.
- Do not include Supabase, saved logs, transactional joins, Dashboard, History, KPI, Exports, Gantt, or source JSON edits.
- Do not edit `imports/v8.4/data/*.json`.
- Do not invent prescriptions.
- Do not change logging fields or Supabase/schema behavior unless a separate safe-lane task explicitly allows it.
- Do not follow inline TODOs or comments unless they are backed by the active `docs/SCOPE.md` ID.
- For `DEF-028`, do not mutate saved session records; no Supabase writes, backfill, delete, or migration.

Execution gate: no further cosmetic display patches or broad implementation under `ACTIVITY-PRESCRIPTION-001` until the planned-activity contract is implemented and verified for Day + Session parity.

Completed audit findings identified:

1. Day page source path.
2. Session form source path.
3. Why planned steps differ.
4. Why duration/title conflicts occur.
5. The canonical projection layer both surfaces must use.
6. Which current WIP changes should be kept, revised, or reverted.
7. Every athlete-facing consumer of plan/activity/session display data.
8. Which consumers must use the canonical contract now, can use summaries from it, are admin/source/reference-only exceptions, or are deferred with rationale.

Do not touch Dashboard, History, KPI, Exports, Gantt, Supabase, or v8.4 source JSON in the next code task.

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
| In progress | KPI-ROADMAP-001 |
| Blocked | ACTIVITY-PRESCRIPTION-001, DEF-021, DEF-022, DEF-023, DEF-024, DEF-025, DEF-026, DEF-027, DEF-028 |
| Not started | CODE-COMMENT-AUDIT-001, ACTIVITY-PRESENTATION-CONTRACT-001, TEST-FIXTURE-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, PLAN-CONTENT-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, QA-SYSTEM-001, DEF-014, DEF-016, DEF-018 |
| Scope review required | ACTIVITY-LOGGING-001, TRAINING-SAFETY-U12-001, CONDITIONING-MODEL-001, DEF-002, DEF-003, DEF-005, DEF-006, DEF-013, DEF-017, DEF-019, DEF-020 |
| Completed | FORENSIC-DAY-SESSION-MISMATCH-001, SURFACE-PRESENTATION-CONSUMER-AUDIT-001, QA-AUTOMATION-002, DEF-007 |

### P2

| Status | IDs |
| --- | --- |
| Not started | SESSION-UX-001, RECOVERY-READINESS-001, EXPORTS-REPORTING-001, HOCKEY-IQ-001, DEF-008, DEF-009, DEF-010, DEF-011, DEF-012 |
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

### CODE-COMMENT-AUDIT-001

- ID: CODE-COMMENT-AUDIT-001
- Title: Stale Inline Comment / TODO Audit
- Type: Task
- Parent: Scope system hardening
- Priority: P1
- Status: Not started
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
- Problem: Day and Session do not consume one canonical planned-activity presentation model, causing missing planned steps, stale source language, and duration/title conflicts.
- Desired outcome: Day and Session render planned activities from one `projectPlannedDayActivities(date)` contract while preserving raw IDs and avoiding saved-data mutation.
- In scope: implement Pass 1 only; derive top-level planned activity presentation from v8.4 `dayExecutionPlan`; enrich with session/drill metadata where available; attach Speed Stack child drills under parent Speed Stack activities; wire Day + Session parity; add focused tests for planned-step parity, duration precedence, and source-language filtering.
- Out of scope: Supabase, saved logs, transactional joins, Dashboard, History, KPI, Exports, Gantt, source JSON edits, logging schema changes, broad redesign, product acceptance claims.
- Acceptance criteria: Day and Session use the same planned-activity contract for June 19-style execution; Warmup and Optional Easy Bike are represented or explicitly classified; athlete-facing labels do not leak known source/workbook language; duration labels follow authoritative precedence; current WIP is revised through the contract rather than committed as surface-specific patches.
- Dependencies: completed `FORENSIC-DAY-SESSION-MISMATCH-001`; completed `SURFACE-PRESENTATION-CONSUMER-AUDIT-001`; v8.4 import package.
- Risks: expanding the first pass into evidence/log composition could change logging behavior or saved data; overfitting June 19 could leave site-wide drift unresolved.
- Next action: implement `projectPlannedDayActivities(date)` as the first planned-activity projection pass and wire Day + Session parity only.
- Links / evidence: DEF-021 through DEF-027; completed consumer audit; current uncommitted ACTIVITY-PRESCRIPTION-001A/B/C WIP.

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
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: Calendar coverage acceptance and DPM-QA follow-up
- Problem: Calendar/date coverage is fixed, but upcoming day usability still needs QA.
- Desired outcome: future days load, communicate day type, show executable content when planned, and avoid misleading statuses.
- In scope: inspect Day/Calendar/Session projections for upcoming dates; add narrow fixes only if requested.
- Out of scope: source-plan rewrite, broad redesign, Playwright unless separately approved.
- Acceptance criteria: June 23 onward readiness issues are listed with priority and safe next actions.
- Dependencies: Activity Prescription may expose more day usability gaps.
- Risks: source gaps may be confused with app projection gaps.
- Next action: audit upcoming dates after Activity Prescription work is scoped/accepted.
- Links / evidence: Calendar date coverage commit `7b48a3e`.

### ACTIVITY-LOGGING-001

- ID: ACTIVITY-LOGGING-001
- Title: Activity-specific logging fields
- Type: Feature
- Parent: Evidence model
- Priority: P1
- Status: Scope review required
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
- Problem: Day sequence and Session execution can drift, confusing the athlete about the real plan.
- Desired outcome: Day planned sequence and execution session cards represent the same approved work.
- In scope: projection parity, card ordering, links/actions.
- Out of scope: source training edits and logging schema changes.
- Acceptance criteria: planned blocks visible on Day are represented in execution flow where applicable.
- Dependencies: Activity Prescription layer.
- Risks: source-plan title/block mismatches need source-review instead of UI masking.
- Next action: compare Day and Session projections after prescription details render.
- Links / evidence: `app/day/[date]/page.tsx`, session components.

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
- Next action: review QA Contract Framework Loop 1A docs, then run Loop 1B route/component inspection before broad test generation.
- Links / evidence: `docs/QA_TESTING_PYRAMID.md`, `docs/APPLICATION_BEHAVIOR_CONTRACT.md`, `docs/TEST_GENERATION_RULES.md`, `docs/QA_MATRIX_BLOAT_CONTROLS.md`, `docs/ROUTE_SURFACE_COVERAGE_MATRIX.md`, `docs/TEST_CASES.md`.

### QA-AUTOMATION-002

- ID: QA-AUTOMATION-002
- Title: Playwright proof-of-life strategy
- Type: Task
- Parent: QA-SYSTEM-001
- Priority: P1
- Status: Scope review required
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
- Next action: use completed proof-of-life as base for targeted DEF-028 browser regression after completed-session display/projection repair.
- Links / evidence: Playwright proof-of-life code commit `402edc8`; command passed: `npx playwright test e2e/activity-presentation-proof.spec.ts --project=chrome`; Previous Attempt gate, Reopen/Edit, and View Latest Completed Session were not visible in the passing run. DEF-028 evidence logging script commit `66ab959` improved evidence output; the Terminal 2 run passed with production badge `v0.1.0 · 6b174a9 · production`, Day expected title present `true`, Session expected title present `false`, Previous Attempt/Reopen/Edit/View Latest all not visible, completed-session branch not exercised, and DEF-028 not reproduced by that run.

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
| DEF-008 | Dashboard metrics ambiguous | Defect | Dashboard | P2 | Not started | Safe lane | Mike / Codex | Defect log | Parent summaries unclear. | Clear metrics. | future projection work. | now. | metrics map to evidence. | KPI-HISTORY-DASHBOARD-001 | misread progress. | Defer. | former defect log stub; use git history only |
| DEF-009 | Needs Attention false positives | Defect | Dashboard | P2 | Not started | Safe lane | Mike / Codex | Defect log | App may flag incorrectly. | Accurate attention rules. | future audit. | now. | false positives reduced. | dashboard model | alert fatigue. | Defer. | former defect log stub; use git history only |
| DEF-010 | Weekly Load actual bar unclear | Defect | Dashboard | P2 | Not started | Fast lane | Mike / Codex | Defect log | Load visualization unclear. | Explainable load. | future UI. | now. | bar meaning clear. | dashboard model | misinterpretation. | Defer. | former defect log stub; use git history only |
| DEF-011 | Plank Quality KPI missing separate time plus form score model | Defect | KPI model | P2 | Not started | Safe lane | Mike / Codex | Defect log | Plank metric shape incomplete. | Time and form score separated. | KPI model design. | now. | model accepted. | KPI-ROADMAP-001 | data mismatch. | Defer. | former defect log stub; use git history only |
| DEF-012 | Puck-Control Weave needs deferred / space-unavailable state | Defect | KPI model | P2 | Not started | Safe lane | Mike / Codex | Defect log | Missing result vs deferred not explicit. | explicit deferred state. | KPI model design. | now. | deferment visible. | KPI-ROADMAP-001 | false missing data. | Defer. | former defect log stub; use git history only |
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
| DEF-028 | Completed-session surfaces bypass ActivityPresentation context | Defect | Activity Presentation | P1 | Blocked | Fast lane | Mike / Codex | Production browser QA after `9964e52` | Active/edit Day + Session surfaces use the shared ActivityPresentation context, but completed-session/read-only flow still showed stale legacy title `Speed Stack C, conditioning, and shooting.` while Day and reopened/edit Session showed `Acceleration and accurate shooting.` The later Playwright proof-of-life at `402edc8` did not reproduce this because the Previous Attempt gate and completed-session buttons were not visible during that run. Evidence logging script commit `66ab959` improved output; the Terminal 2 run passed with production badge `v0.1.0 · 6b174a9 · production`, Day expected title present `true`, Session expected title present `false`, Previous Attempt/Reopen/Edit/View Latest all not visible, completed-session branch not exercised, and DEF-028 not reproduced by that run. | Completed-session and previous-attempt surfaces use the same presentation contract where appropriate without mutating saved historical records. | audit completed-session/read-only presentation path; route display through shared day/session presentation context where safe; add browser regression coverage. | saved session mutation, Supabase writes, backfill, delete, migration, or changing transactional session records to fix display. | `/day/2026-06-19`, reopened/edit Session, previous-attempt gate, and View Latest Completed Session do not contradict the shared day title/context; saved data remains intact. | ACTIVITY-PRESENTATION-CONTRACT-001, QA-AUTOMATION-002 | stale completed-session copy can make accepted presentation work look inconsistent and untrusted; production session route visibility is state-dependent. | Inspect and fix completed-session display/projection only; keep saved session records intact; use Playwright proof-of-life as targeted regression base after fix. | Mike production flow: View Latest Completed Session showed stale title; Reopen/Edit showed corrected title. Playwright evidence runs passed but did not exercise completed-session surface; latest run also showed Session expected title absent in that browser state. |
| DOC-DRIFT-001 | Documentation current-state drift | Defect | Scope control | P0 | Completed | Docs-only | Mike / Codex | Docs reconciliation | Docs diverged from current reality. | docs are trustworthy. | docs consolidation. | app changes. | active scope centralized. | SCOPE-CONSOLIDATION-001 | wrong next work. | Use `docs/SCOPE.md` as canonical active scope source. | `docs/DOCUMENTATION_INVENTORY.md` |
| DOC-INV-001 | Documentation inventory/consolidation needed | Defect | Scope control | P0 | Completed | Docs-only | Mike / Codex | Docs reconciliation | Docs lacked inventory. | inventory guides archive/merge. | inventory update. | deletion. | inventory reflects SCOPE canonical. | SCOPE-CONSOLIDATION-001 | stale ownership. | Use `docs/DOCUMENTATION_INVENTORY.md` for inventory only. | `docs/DOCUMENTATION_INVENTORY.md` |

## Training / Source Scope

- Activity Prescription Display Layer is the next P1 implementation feature; docs/scope-control and environment safety work are complete.
- Recovery days are not blank days.
- OvertimeAthlete source ingestion/review is future source-review only.
- U12 safety guardrails are source-review scope, not immediate app changes.
- Hockey conditioning intervals must be distinguished from recovery Zone 2 cardio.
- Instruction/video coverage audit is required for athlete-actionable items.
- v8.4 remains authoritative unless Mike explicitly approves a source update.
- Unverified schedule claims must remain "verify before plan change".

## Data / Sync / Environment Scope

- Production Supabase is real Maddox data only.
- Staging Supabase is for dev/test data once created/configured.
- Local development must point to staging once staging exists.
- Vercel Preview must point to staging once staging exists.
- Vercel Production must point to production.
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
