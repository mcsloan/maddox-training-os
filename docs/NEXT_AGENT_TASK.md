# Next Agent Task

## Purpose

Use this file as the handoff brief for the next Codex/agent session. Keep it short, explicit, and updated before switching contexts.

## Current Default Task

Run Agentic Workflow v1 preflight before any production-risk work:

```bash
node scripts/preflight.mjs
```

Then confirm the intended write target before any cloud write, deploy, or backfill:

```bash
node scripts/confirm-write-target.mjs --target <staging|production> --action "<plain English action>"
```

## Current State Summary

- Production KPI backfill is complete.
- Seven June 16 standalone KPI rows are visible in production `/kpis`.
- Temporary production backfill script was deleted.
- Repo was clean after the backfill cleanup.
- Production Supabase is hardened for immutable `session_logs`.
- Production writes remain real Maddox data only.

## Guardrails

- Do not edit `imports/v8.4/data/*.json` unless explicitly requested.
- Do not mutate Supabase without confirming target and action.
- Do not rely on `.env.local` without printing the target via `env-whoami`.
- Do not commit or push unless explicitly asked.
- Do not expose secrets.

## Next Recommended Work

1. Run `node scripts/preflight.mjs`.
2. Decide whether the next task is production smoke testing, defect cleanup, or docs consolidation.
3. Use `docs/AGENT_REPORT.md` as the completion report format.
