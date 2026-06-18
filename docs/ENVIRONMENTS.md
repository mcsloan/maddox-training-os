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

Current production hardening:

- Production RLS is enabled on `athletes`, `session_logs`, and `session_progress`.
- Production policies are scoped to Maddox athlete ID.
- No DELETE policies exist on `athletes`, `session_logs`, or `session_progress`.
- `session_logs` has SELECT and INSERT policies only.
- `session_progress` has SELECT, INSERT, and UPDATE policies.
- Production anon grants were reset and confirmed:
  - `athletes`: SELECT, INSERT, UPDATE
  - `session_logs`: SELECT, INSERT
  - `session_progress`: SELECT, INSERT, UPDATE
- Production anon has no DELETE, TRUNCATE, REFERENCES, or TRIGGER grants.
- Production anon has no UPDATE grant on `session_logs`.

Current production app deployment state:

- Local `main` contains `bec6008` (`Add KPI cloud sync with immutable delete`) after fast-forward merge.
- Local `main` is ahead of `origin/main` and has not been pushed.
- Vercel Preview exists for `staging/kpi-cloud-sync-test` at `bec6008`.
- Vercel Production currently maps to `origin/main` at `9b44228`.
- Pushing `main` will likely trigger Production.
- Production app has not yet been deployed or tested with `bec6008`.
- Production DB safety checks passed, but production app testing is still pending.

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
- Push `main` only when ready to trigger Production deployment from `bec6008` or later.
- Run production smoke tests after deployment without fake/test records.
