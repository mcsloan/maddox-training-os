# Agent Report

## Latest Task

Document Confirmed Vercel Supabase Environment Mapping.

## Result

Documented Mike's manual Vercel dashboard confirmation for `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`.

Confirmed Vercel mapping:

- Vercel Production `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko` production Supabase.
- Vercel Preview `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko` production Supabase.
- Vercel Development `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko` production Supabase.
- Vercel shows these Supabase variables as "All Environments."

Known local/Supabase mapping:

- Local development: `npuankmkxbjtlokbpczz` via `.env.local`; classified as staging.
- Supabase staging: `npuankmkxbjtlokbpczz`, project name `maddox-training-os-staging`.
- Supabase production: `mbjcedhysniabbaigsko`, known from `.env.local.production-backup` URL ref and historical docs.

Confirmed defect:

- Vercel Preview and Vercel Development currently inherit production Supabase variables through "All Environments."
- Preview/Development deployments can read/write production Supabase unless app logic, RLS, or operator discipline prevents it.

New follow-up defect:

- `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` — Configure Vercel Preview and Development Supabase variables to use staging.
- Required future behavior: Production -> `mbjcedhysniabbaigsko`; Preview -> `npuankmkxbjtlokbpczz`; Development -> `npuankmkxbjtlokbpczz`.

Staging auto-pause status captured:

- Supabase warning applies to staging project `maddox-training-os-staging`, project ref `npuankmkxbjtlokbpczz`.
- Mike reported staging is not paused yet, but may auto-pause if inactive.
- If staging pauses, local development and correctly configured Preview QA may fail until staging is resumed.

No secrets were captured or printed. No Supabase or Vercel changes occurred. No app code, source import data, tests, build, commit, or push actions were performed.

## Files Changed

- `docs/SCOPE.md`
- `docs/SESSION_HANDOFF.md`
- `docs/AGENT_REPORT.md`

## Status Updates

- Updated `docs/SCOPE.md` with the confirmed Vercel mapping under `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`.
- Added `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` as the follow-up P1 environment-safety item.
- Updated `docs/SCOPE.md` Data / Sync / Environment Scope with the confirmed All-Environments production inheritance risk.
- Updated `docs/SESSION_HANDOFF.md` with current mapping status and the revised next order.
- Updated this report with Mike's manual dashboard confirmation and no-secrets/no-change confirmations.

Recommended next implementation order:

1. `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` — decide/fix Vercel Preview/Development staging override, no secret exposure.
2. `DEF-GANTT-SPORTLOAD-DURATION-001` — fix Gantt date semantics.
3. `QA-PLAYWRIGHT-SMOKE-001` — create deterministic Playwright smoke suite.
4. `DEF-QA-USAGE-LEDGER-001` — create Codex usage ledger.

After those items, return to the broader pre-4v4 queue: `AUDIT-LOAD-CLASSIFICATION-001` for `DEF-029`, `DEF-030`, `DEF-031`, and `DEF-032`.

## Scope Capture Check

- Defects added/updated: `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` updated to confirmed finding / follow-up required; `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` added; `DEF-SUPABASE-STAGING-AUTOPAUSE-001` preserved.
- Epics/features added/updated: none.
- Product decisions added/updated: Preview/Development write testing remains blocked until staging overrides are configured or those deployments are explicitly treated read-only.
- Data/sync/environment decisions added/updated: Vercel Production points to production; Vercel Preview and Development currently point to production through All Environments; required future mapping captured.
- Testing requirements added/updated: none.
- Training-plan/source items added/updated: none.
- Docs updated: `docs/SCOPE.md`, `docs/SESSION_HANDOFF.md`, `docs/AGENT_REPORT.md`.
- Items intentionally deferred: Vercel env var changes, Supabase changes, keepalive/billing decisions, app implementation, tests, builds, source JSON edits, commit, push.
