# Maddox Training OS — Codex Operating Instructions

## Project Identity

Maddox Training OS is a private youth hockey training PWA for Maddox, a parent/operator, and coach review. The app must be practical during real training and must render approved plan data rather than invent coaching content.

## Source Of Truth

- `imports/v8.4/` is the approved app import package.
- The v8.4 package is authoritative for daily execution, sport loads, sessions, drills, video map, KPI data, and the locked Gantt model.
- Do not invent workouts, drills, phases, sport loads, sessions, videos, KPIs, or coaching logic.
- Do not edit `imports/v8.4/data/*.json` unless the user explicitly asks.
- Use adapter/mapping code such as `lib/imports/v8_4/` when wiring v8.4 data into the app.

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

## Guardrails

- Do not polish or rework GANTT unless explicitly asked.
- Do not change the locked Gantt model or phase model unless explicitly asked.
- Do not merge Sport Load logging with Training Work logging.
- Sport Load logging must not mark Training Work complete, and Training Work logging must not mark Sport Load complete.
- Preserve v8.4 import counts and smoke-test integrity.
- User-facing UI language should say `Sport Load`, not `External Load`, unless discussing legacy internal route, storage, schema, or repository names.
- Preserve legacy/internal names such as route folders, storage keys, repository names, schemas, IDs, and `source = external_load` unless explicitly asked.

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

## End-Of-Task Report

Report:

- files changed
- reason for each file
- checks run
- browser/iPhone test steps
- remaining risks

Keep the report concise and specific.

## Low-Usage Codex Rule

- Read this `AGENTS.md` first.
- Then read only the specific docs and files needed for the task.
- Prefer targeted `rg` searches over broad repo exploration.
- Avoid re-reading large docs unless the task requires it.
- Do not rely on chat history for durable project rules.
