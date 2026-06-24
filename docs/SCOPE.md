# Scope

## Purpose

This is the canonical scope, priority, status, sequencing, roadmap, defects-summary, KPI-roadmap, training/source-epic, source-review, and next-task document for Maddox Training OS.

Other planning docs may retain historical detail temporarily, but active scope decisions should be represented here.

## Current Checkpoint

- Branch: `main`.
- Local HEAD: `3ebc157` (`docs(scope): record environment safety reconciliation`).
- Local `main` is ahead of `origin/main` by 2 commits.
- Local docs commits not pushed yet:
  - `3dadea0` (`build(scope): harden documentation architecture and scope controls`)
  - `3ebc157` (`docs(scope): record environment safety reconciliation`)
- Historical pre-hardening / current production baseline: `7b48a3e` (`Render calendar from v8.4 day coverage`).
- Vercel production is expected to remain on `v0.1.0 · 7b48a3e · production` until the local docs commits are pushed and deployed.
- Local browser/build badge may show stale running-server context and is not the repo source of truth.
- Git state from Terminal 2 is authoritative for repo checkpoint.
- Calendar coverage from v8.4 was fixed and accepted.
- v8.4 covers all 84 dates from `2026-06-15` through `2026-09-06`.
- v8.4 app import package remains authoritative for app training data.
- Stash exists and must not be applied unless explicitly requested: `stash@{0} WIP KPI cloud sync before master reconciliation`.
- No app code work has started after the docs hardening checkpoint.
- Next action: Mike review / push approval for the local docs checkpoint.

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
| 1 | SCOPE-CONSOLIDATION-001 | Scope system consolidation | P0 | In progress | Docs-only | Mike review / push approval for the local docs checkpoint. |
| 2 | ENV-SAFETY-RECON-001 | Environment/data safety reconciliation | P0 | Completed | Docs-only | Mike review of findings; require explicit approval before any write/deploy/backfill. |
| 3 | CODE-COMMENT-AUDIT-001 | Stale Inline Comment / TODO Audit | P1 | Not started | Fast lane | Run inspect-only comment audit before the next app-code implementation task if time allows. |
| 4 | ACTIVITY-PRESCRIPTION-001 | Activity Prescription Display Layer | P1 | Not started | Fast lane | Render approved v8.4 prescription detail where available. |
| 5 | TEST-FIXTURE-001 | Verify and Establish Test Fixture Structure | P1 | Not started | Fast lane | Inspect-only QA fixture discovery before or alongside the first Activity Prescription implementation task. |
| 6 | FUTURE-DAY-READINESS-001 | Future-day readiness audit from June 23 onward | P1 | Not started | Fast lane | Audit upcoming Day/Calendar/Session usability. |
| 7 | ACTIVITY-LOGGING-001 | Activity-specific logging fields | P1 | Scope review required | Safe lane | Define fields after prescription display is stable. |
| 8 | DAY-SESSION-PARITY-001 | Day/Session sequence parity | P1 | Not started | Fast lane | Ensure Day planned sequence and Session execution cards match. |
| 9 | PLAN-CONTENT-001 | Plan content/title correctness | P1 | Not started | Source-review | Review title/block mismatches against v8.4 source. |
| 10 | RECOVERY-DAY-MODEL-001 | Recovery-day model completion | P1 | Not started | Source-review | Ensure intentional recovery prescriptions are represented from source. |
| 11 | KPI-ROADMAP-001 | KPI roadmap and advanced KPI scope | P1 | In progress | Safe lane | Preserve scope; implement only after sync/model review. |
| 12 | DAY-FIRST-ARCH-001 | Day-first architecture docs/test fixtures | P1 | Not started | Docs-only | Add fixtures and acceptance docs around canonical Day projection. |
| 13 | KPI-HISTORY-DASHBOARD-001 | KPI/History/Dashboard reconciliation | P1 | Not started | Safe lane | Reconcile projections after day evidence model stabilizes. |
| 14 | QA-SYSTEM-001 | QA/testing system | P1 | Not started | Safe lane | Formalize release gate, fixtures, and later Playwright. |
| 15 | SESSION-UX-001 | Medium Session UX backlog | P2 | Not started | Fast lane | Improve session usability after core workflow readiness. |
| 16 | SOURCE-INGEST-OTA-001 | OvertimeAthlete source ingestion | P2 | Scope review required | Source-review | Ingest/review source later; do not replace v8.4. |
| 17 | RECOVERY-READINESS-001 | Recovery/readiness system | P2 | Not started | Safe lane | Add readiness fields and parent review model later. |
| 18 | EXPORTS-REPORTING-001 | Exports/reporting | P2 | Not started | Safe lane | Reconcile after evidence model is trusted. |
| 19 | HOCKEY-IQ-001 | Hockey IQ system | P2 | Not started | Source-review | Build Watch -> Apply -> Reflect later from approved sources. |
| 20 | AI-COACH-001 | AI Coach strategy | P3 | Not started | Future roadmap | Start only after data/sync/QA trust. |
| 21 | AGENTIC-WORKFLOW-001 | Agentic workflow evaluation | P3 | Scope review required | Future roadmap | Review workflow tools/process after product P1s. |

## Current Sprint / Next Codex Task

Current sprint: Mike review / push approval for the local docs checkpoint. `ENV-SAFETY-RECON-001` is completed for the inspection pass.

Next implementation task after docs checkpoint review/push approval: Activity Prescription Display Layer.

Minimum next task brief:

- Read `AGENTS.md`, `docs/SESSION_HANDOFF.md`, and this file first.
- Inspect existing v8.4 prescription metadata and display components.
- Render exact sets/reps/time/rest/tempo/group/source/cue/detail where available.
- Show honest missing-source states where data is absent.
- Do not edit `imports/v8.4/data/*.json`.
- Do not invent prescriptions.
- Do not change logging fields or Supabase/schema behavior unless a separate safe-lane task explicitly allows it.
- Do not follow inline TODOs or comments unless they are backed by the active `docs/SCOPE.md` ID.

Active source files to inspect next:

- `package.json` script names only for environment safety reconciliation.
- `scripts/env-whoami.mjs`
- `scripts/preflight.mjs`
- `scripts/confirm-write-target.mjs`
- `lib/supabase/client.ts`
- `lib/storage/`
- `imports/v8.4/data/dayExecutionPlan.json`
- `imports/v8.4/data/sessions.json`
- `imports/v8.4/data/drills.json`
- `imports/v8.4/data/drillCards.json`
- `imports/v8.4/data/speedStackPrescriptions.json`
- `imports/v8.4/data/workoutBlockDetails.json`
- `imports/v8.4/data/skillShotIqLibrary.json`
- `imports/v8.4/data/recoveryRules.json`
- `imports/v8.4/data/logSchemas.json`

## Scope Item Index By Priority And Status

### P0

| Status | IDs |
| --- | --- |
| In progress | SCOPE-CONSOLIDATION-001, DOC-DRIFT-001, DOC-INV-001 |
| Not started | None |
| Scope review required | SCOPE-GATE-001, ENV-SAFETY-LOCAL-PROD-GUARD, SPORT-SCHEDULE-VERIFY-001, DEF-001, DEF-015 |
| Completed | ENV-SAFETY-RECON-001, DPM-QA-006 |

### P1

| Status | IDs |
| --- | --- |
| In progress | KPI-ROADMAP-001 |
| Not started | CODE-COMMENT-AUDIT-001, ACTIVITY-PRESCRIPTION-001, TEST-FIXTURE-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, PLAN-CONTENT-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, QA-SYSTEM-001, DEF-014, DEF-016, DEF-018 |
| Scope review required | ACTIVITY-LOGGING-001, TRAINING-SAFETY-U12-001, CONDITIONING-MODEL-001, DEF-002, DEF-003, DEF-005, DEF-006, DEF-013, DEF-017, DEF-019 |
| Completed | DEF-007 |

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
- Status: In progress
- Lane: Docs-only
- Owner: Mike / Codex
- Source: Current task
- Problem: Scope and priority were split across several docs with overlapping ownership.
- Desired outcome: `docs/SCOPE.md` becomes the single canonical active scope system.
- In scope: create this file, merge active scope, update pointers, update AGENTS/session/report/inventory.
- Out of scope: app code, v8.4 source JSON, Supabase, tooling, stash, commit, push.
- Acceptance criteria: active queue and current sprint exist here; duplicate scope docs are non-canonical; AGENTS points here.
- Dependencies: Mike review before commit.
- Risks: historical detail may still need archive review.
- Next action: Mike reviews this consolidation.
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
- Status: Not started
- Lane: Fast lane
- Owner: Mike / Codex
- Source: v8.4 import package and Activity Prescription intake
- Problem: Athlete-actionable cards can hide available sets/reps/time/rest/tempo/source/cue detail.
- Desired outcome: Maddox can open planned work and understand exactly what to do from approved source metadata.
- In scope: render existing v8.4 prescription fields, honest missing-source states, instruction/video status if available.
- Out of scope: source JSON edits, invented prescriptions, logging field changes, Supabase/schema changes.
- Acceptance criteria: available prescription detail appears in Day/Session activity cards; missing data is identified honestly.
- Dependencies: v8.4 metadata/loaders/components.
- Risks: source gaps may require later source-review rather than UI fixes.
- Next action: inspect v8.4 prescription files/loaders and relevant card components.
- Links / evidence: `imports/v8.4/data/`, prior training epics content merged here; use git history only.

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
- Desired outcome: critical athlete workflows have repeatable validation before release.
- In scope: release gate, fixture strategy, test status reconciliation, future Playwright plan.
- Out of scope: installing Playwright or new tooling without explicit task.
- Acceptance criteria: QA docs reflect current tooling and define release checks by risk level.
- Dependencies: current projection model and environment safety.
- Risks: stale QA docs can misstate coverage.
- Next action: reconcile QA/testing docs after environment safety.
- Links / evidence: prior QA docs merged here; use git history only.

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
| DOC-DRIFT-001 | Documentation current-state drift | Defect | Scope control | P0 | In progress | Docs-only | Mike / Codex | Docs reconciliation | Docs diverged from current reality. | docs are trustworthy. | docs consolidation. | app changes. | active scope centralized. | SCOPE-CONSOLIDATION-001 | wrong next work. | Mike review. | `docs/DOCUMENTATION_INVENTORY.md` |
| DOC-INV-001 | Documentation inventory/consolidation needed | Defect | Scope control | P0 | In progress | Docs-only | Mike / Codex | Docs reconciliation | Docs lacked inventory. | inventory guides archive/merge. | inventory update. | deletion. | inventory reflects SCOPE canonical. | SCOPE-CONSOLIDATION-001 | stale ownership. | review inventory. | `docs/DOCUMENTATION_INVENTORY.md` |

## Training / Source Scope

- Activity Prescription Display Layer is the next P1 implementation feature after docs/environment safety work.
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
