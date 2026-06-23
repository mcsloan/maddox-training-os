# Maddox Training OS - Codex Operating Instructions

## Project Identity

Maddox Training OS is a private youth hockey training PWA for Maddox, a 2015 birth-year U12 competitive hockey player, a parent/operator, and coach review. The app must be practical during real training and must render approved plan data rather than invent coaching content.

This is not just a checklist app. It is intended to become a professional-grade training operating system with:

- Maddox live training mode
- parent/coach dashboard
- source-of-truth training database
- export/report engine
- hockey IQ/mindset system
- KPI testing and trend system
- readiness/recovery intelligence
- QA/regression system
- later AI Coach layer

## Source Of Truth

- `imports/v8.4/` is the approved app import package.
- The v8.4 package is authoritative for daily execution, sport loads, sessions, drills, video map, KPI data, and the locked Gantt model.
- Do not invent workouts, drills, phases, sport loads, sessions, videos, KPIs, or coaching logic.
- Do not edit `imports/v8.4/data/*.json` unless the user explicitly asks.
- Use adapter/mapping code such as `lib/imports/v8_4/` when wiring v8.4 data into the app.
- Camps, lacrosse, 4v4, on-ice sessions, and other planned sport loads are part of the plan, not external to it.
- User-facing UI language should say `Sport Load`, not `External Load`, unless discussing legacy internal route, storage, schema, repository names, or `source = external_load`.
- `Today` must equal the canonical Day page. One day, one truth.
- Missing data is not deferred data; deferral must be explicit.
- No silent blank days. Every date must resolve to a meaningful day state.

## Workflow Rules

- Terminal 1 is for the app server only.
- Terminal 2 is for commands and Git only.
- Codex edits code only when the user asks for edits.
- Browser and iPhone are for testing only.
- Make small, surgical changes that match the current codebase.
- Do not refactor unrelated areas.
- Do not commit unless the user explicitly asks and the files plus reason are clear.
- Do not push unless the user explicitly asks.
- Assume the worktree may contain user changes; do not revert changes you did not make.
- For cloud-write testing, confirm the target environment before recommending or running the test.
- Production Supabase is for real Maddox data only.
- Staging Supabase is for dev/test data once created.
- Local development must point to staging once staging exists.
- Vercel Preview must point to staging once staging exists.
- Vercel Production must point to production.
- No fake/test records in production.

## Agentic Workflow v1

Use repo files as the handoff contract between ChatGPT, Codex, Terminal, GitHub, Vercel, and Supabase.

- `docs/SCOPE.md` is the single canonical owner for active scope, priority, roadmap, defects summary, epics, source-review items, execution sequencing, and next-task ownership.
- `docs/AGENT_REPORT.md` is the standard completion report template.
- `docs/SESSION_HANDOFF.md` is the durable current-state handoff only; it must point to `docs/SCOPE.md` for scope and priorities.
- `scripts/env-whoami.mjs` is read-only and identifies the local git/env target without printing secrets.
- `scripts/confirm-write-target.mjs` is read-only and must be used before any cloud write test or production-risk action.
- `scripts/preflight.mjs` is read-only and summarizes git/env/package-script state without running builds.

Do not create new planning markdown files without explicit user approval. If new scope is discovered, update `docs/SCOPE.md` using its Minimum Record Template. Before answering "what is next", inspect `docs/SCOPE.md`.

Scope failure rules:

- Before answering "what is next", inspect `docs/SCOPE.md`.
- Before changing code, identify the active scope ID from `docs/SCOPE.md`.
- Do not create new planning markdown files without explicit user approval.
- If new scope is discovered, update `docs/SCOPE.md` using the Minimum Record Template.
- If a prompt asks for work not linked to an active `docs/SCOPE.md` ID, stop and report: `[CRITICAL SCOPE VIOLATION]`.
- If Codex would need to create a new markdown planning file, stop and report: `[CRITICAL SCOPE VIOLATION]`.
- If Codex would need to modify app code without an active scope ID, stop and report: `[CRITICAL SCOPE VIOLATION]`.
- Do not attempt to salvage a violating prompt by inventing a new scope path.

Code Comment Authority:

- Inline comments, TODOs, docstrings, and historical code comments are not scope authority.
- Before following a TODO/comment that implies scope, verify the work maps to an active scope ID in `docs/SCOPE.md`.
- If a code comment conflicts with `docs/SCOPE.md`, ignore the comment and report the conflict.
- Do not implement a TODO/comment unless it is explicitly in the active scope item.

Before any cloud write, deploy, production-impacting operation, or data backfill:

```bash
node scripts/preflight.mjs
node scripts/confirm-write-target.mjs --target <staging|production> --action "<plain English action>"
```

Production writes require explicit confirmation:

```bash
node scripts/confirm-write-target.mjs --target production --action "<action>" --confirm-production
```

## Guardrails

- Do not polish or rework GANTT unless explicitly asked.
- Do not change the locked Gantt model or phase model unless explicitly asked.
- Do not merge Sport Load logging with Training Work logging.
- Sport Load logging must not mark Training Work complete, and Training Work logging must not mark Sport Load complete.
- Preserve v8.4 import counts and smoke-test integrity.
- User-facing UI language should say `Sport Load`, not `External Load`, unless discussing legacy internal route, storage, schema, or repository names.
- Preserve legacy/internal names such as route folders, storage keys, repository names, schemas, IDs, and `source = external_load` unless explicitly asked.
- Do not merge Sport Load evidence with Training Work evidence.
- History should become Week -> Day -> Evidence.
- Homepage/Today/Calendar/History/Dashboard/KPIs/Exports should be projections from canonical Day evidence.

## Standard Checks

For app-code changes, run:

```bash
npm run lint
npm run build
node scripts/verify-v8.4-import.mjs
```

For iPhone/LAN production-style verification when needed, run:

```bash
npm run ios:test
```

Use production mode for iPhone/iPad validation; do not rely on Next dev/Turbopack mode for iOS behavior.

For documentation-only changes, do not run `npm run build` unless code changed. Run `git status --short` and any markdown lint/test script if one exists.

## End-Of-Task Report

Report:

- what changed
- what it means
- files changed
- reason for each file
- checks run/results
- browser/iPhone/iPad test steps when applicable
- `git status --short`
- whether commit/push happened
- remaining risks
- scope capture check

Keep the report concise and specific.

## Mandatory Scope Capture Check

At the end of every meaningful work session, update or explicitly review:

1. New defects discovered?
2. Existing defects changed status?
3. New epics/features added?
4. Product decisions made?
5. Data model / sync / environment decisions made?
6. Testing requirements added or changed?
7. Training-plan decisions made?
8. AI Coach / future roadmap items added?
9. Docs updated?
10. Next priorities changed?

Every Codex report must include:

Scope Capture Check:

- Defects added/updated:
- Epics/features added/updated:
- Product decisions added/updated:
- Data/sync/environment decisions added/updated:
- Testing requirements added/updated:
- Docs updated:
- Items intentionally deferred:

Durable scope files to update or explicitly review when relevant:

- `docs/SCOPE.md`
- `docs/CURRENT_PROJECT_STATE.md`
- `docs/SESSION_HANDOFF.md`
- `docs/AGENT_REPORT.md`
- `docs/DOCUMENTATION_INVENTORY.md`

## Low-Usage Codex Rule

- Read this `AGENTS.md` first.
- Then read only the specific docs and files needed for the task.
- Prefer targeted `rg` searches over broad repo exploration.
- Avoid re-reading large docs unless the task requires it.
- Do not rely on chat history for durable project rules.
