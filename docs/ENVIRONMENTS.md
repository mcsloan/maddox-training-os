# Environments

## Current Rule

Never recommend or run cloud-write testing without confirming the target environment.

## Production

Production Supabase is for real Maddox data only.

Rules:

- No fake/test records in production.
- Vercel Production points to production.
- KPI backfill into production must be intentional and documented.
- Production smoke tests must not create fake data.

## Staging

Staging Supabase is a separate non-prod Supabase project.

Project:

- name: `maddox-training-os-staging`
- ref: `npuankmkxbjtlokbpczz`
- region: West US (Oregon) `us-west-2`
- compute: `t4g.nano`
- URL: `https://npuankmkxbjtlokbpczz.supabase.co`

Rules:

- Staging is for dev/test data.
- Local development now points to staging via `.env.local`.
- Vercel Preview must point to staging once staging exists.
- Cloud-write tests must run against staging unless the record is real Maddox historical data.
- KPI cloud sync must be validated in staging before committing/deploying production changes.
- Do not display or commit staging keys.

Current staging baseline:

- Local production env backup exists at `.env.local.production-backup`.
- The backup contains secrets; do not commit or display its contents.
- `.env.local` has been updated locally to use the staging Supabase URL and staging publishable key.
- `supabase/schema.sql` was applied manually in the staging SQL Editor.
- Staging SQL result: "Success. No rows returned."
- Confirmed tables exist in staging: `athletes`, `session_logs`, `session_progress`.
- Existing code paths upsert Maddox athlete automatically in:
  - `lib/storage/externalLoadRepository.ts`
  - `lib/storage/cloudSessionProgressRepository.ts`
  - `lib/storage/completedSessionRepository.ts`

## Current Open Environment Work

- Wire Vercel Preview to staging.
- Keep Vercel Production on production.
- Add explicit pre-test environment confirmation step to release workflow.
- Validate staging cloud writes before applying KPI cloud-sync WIP.
