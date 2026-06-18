# Environment Safety

## Core Rule

Never trust `.env.local` by assumption. Always print the detected target first without printing secrets:

```bash
node scripts/env-whoami.mjs
```

Before any write, deploy, production smoke test, or backfill:

```bash
node scripts/confirm-write-target.mjs --target <staging|production> --action "<plain English action>"
```

Production writes require:

```bash
node scripts/confirm-write-target.mjs --target production --action "<action>" --confirm-production
```

## Production

- Production Supabase is real Maddox data only.
- No fake/test records in production.
- Production smoke tests must use real/intended records only.
- `session_logs` is immutable history.
- Production `session_logs` client access is SELECT/INSERT only.
- Deletes are represented by tombstone rows, not physical deletes.
- KPI backfill must be intentional, documented, and verified.

## Staging

- Staging Supabase is for development and test records.
- Staging project: `maddox-training-os-staging`.
- Staging ref: `npuankmkxbjtlokbpczz`.
- Local development may point to staging.
- Vercel Preview should point to staging.
- Cloud-write tests should run in staging unless the record is real Maddox production history.

## Local

- `.env.local` can point to staging or production depending on recent work.
- `.env.local.production-backup` contains secrets and must not be displayed or committed.
- Scripts must print only URL host/classification, never keys.

## GitHub / Vercel

- Pushing `main` likely triggers Vercel Production.
- Pull requests and preview branches should use verification workflows only unless a deploy is explicitly intended.
- `.github/workflows/verify.yml` has no deployment steps.

## Supabase

- Do not run destructive SQL unless explicitly approved.
- Do not add DELETE grants or DELETE policies for `session_logs`.
- Confirm RLS/policies/grants before production writes.
