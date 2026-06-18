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

Staging Supabase should be a separate free Supabase project, not a preview branch, unless explicitly chosen later.

Rules:

- Staging is for dev/test data.
- Local development must point to staging once staging exists.
- Vercel Preview must point to staging once staging exists.
- Cloud-write tests must run against staging unless the record is real Maddox historical data.
- KPI cloud sync must be validated in staging before committing/deploying production changes.

## Current Open Environment Work

- Create non-prod Supabase staging project.
- Wire local development to staging.
- Wire Vercel Preview to staging.
- Keep Vercel Production on production.
- Document environment variables after staging is created.
- Add explicit pre-test environment confirmation step to release workflow.
