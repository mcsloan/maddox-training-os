# Agent Report

## Latest Task

Document Completed Vercel Supabase Environment Split.

## Result

Documented Mike's completed Vercel environment split for `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001`.

Manual Vercel change summary supplied by Mike:

- Production has exactly two Supabase rows and no All Environments Supabase rows.
- Preview has exactly two Supabase rows and no All Environments Supabase rows.
- Development has exactly two Supabase rows and no All Environments Supabase rows.
- Production `NEXT_PUBLIC_SUPABASE_URL` points to `mbjcedhysniabbaigsko`.
- Preview `NEXT_PUBLIC_SUPABASE_URL` points to `npuankmkxbjtlokbpczz`.
- Development `NEXT_PUBLIC_SUPABASE_URL` points to `npuankmkxbjtlokbpczz`.
- Production anon key was restored as Production-scoped.
- Preview anon key was set from staging.
- Development anon key was set from staging.

Known local/Supabase mapping:

- Local development: `npuankmkxbjtlokbpczz` via `.env.local`; classified as staging.
- Supabase staging: `npuankmkxbjtlokbpczz`, project name `maddox-training-os-staging`.
- Supabase production: `mbjcedhysniabbaigsko`, known from `.env.local.production-backup` URL ref and historical docs.

Defect status:

- `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` is configuration-corrected and awaiting runtime verification.
- `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` is configuration-completed and awaiting runtime verification.

Runtime note:

- Environment-variable changes affect new deployments.
- Existing old Preview deployments should still be treated as production-risk until replaced or verified.
- Production was not redeployed as part of this docs task.

Staging auto-pause status captured:

- Supabase warning applies to staging project `maddox-training-os-staging`, project ref `npuankmkxbjtlokbpczz`.
- Mike reported staging is not paused yet, but may auto-pause if inactive.
- If staging pauses, local development and correctly configured Preview QA may fail until staging is resumed.

No secrets were captured or printed. Codex made no Supabase changes, Vercel changes, redeploys, app code changes, source import data changes, tests, build, commit, or push actions.

## Files Changed

- `docs/SCOPE.md`
- `docs/SESSION_HANDOFF.md`
- `docs/AGENT_REPORT.md`

## Status Updates

- Updated `docs/SCOPE.md` with the final Vercel mapping and no-All-Environments state.
- Marked `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` as configuration-corrected / awaiting runtime verification.
- Marked `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` as configuration-completed / awaiting runtime verification.
- Updated `docs/SESSION_HANDOFF.md` with the completed split, old Preview deployment caveat, and revised next order.
- Updated this report with Mike's manual Vercel change summary and no-secrets/no-redeploy confirmations.

Recommended next implementation order:

1. Commit the environment docs.
2. Later verify a fresh Preview deployment uses staging before Preview write testing.
3. `DEF-GANTT-SPORTLOAD-DURATION-001` — fix Gantt date semantics.
4. `QA-PLAYWRIGHT-SMOKE-001` — create deterministic Playwright smoke suite.
5. `DEF-QA-USAGE-LEDGER-001` — create Codex usage ledger.

After those items, return to the broader pre-4v4 queue: `AUDIT-LOAD-CLASSIFICATION-001` for `DEF-029`, `DEF-030`, `DEF-031`, and `DEF-032`.

## Scope Capture Check

- Defects added/updated: `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` marked configuration-corrected / awaiting runtime verification; `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` marked configuration-completed / awaiting runtime verification; `DEF-SUPABASE-STAGING-AUTOPAUSE-001` preserved.
- Epics/features added/updated: none.
- Product decisions added/updated: fresh Preview runtime verification is required before Preview write testing.
- Data/sync/environment decisions added/updated: Vercel Production points to production; Vercel Preview and Development are configured to staging for new deployments; no Supabase variables remain scoped to All Environments; old Preview deployments remain production-risk until replaced or verified.
- Testing requirements added/updated: none.
- Training-plan/source items added/updated: none.
- Docs updated: `docs/SCOPE.md`, `docs/SESSION_HANDOFF.md`, `docs/AGENT_REPORT.md`.
- Items intentionally deferred: runtime verification of fresh Preview deployment, Supabase changes, redeploys, keepalive/billing decisions, app implementation, tests, builds, source JSON edits, commit, push.
