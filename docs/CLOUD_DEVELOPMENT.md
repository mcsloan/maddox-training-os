# Cloud Development and Remote Continuity

This workflow prevents validated work from existing only on one Mac. **Push does not mean Production.** Only an explicitly approved merge or push to `main` may release Production.

## Branch model

- `main` is the Production release branch. Do not develop directly on it except for an explicitly approved emergency Production correction.
- `work/<short-task-name>` is the default for features, fixes, infrastructure, and documentation.
- Commit and push validated checkpoints on `work/*` so GitHub holds a durable copy and Vercel can create a Preview.

Start from a clean, current `main`:

```bash
git fetch origin
git switch main
git status --short
git rev-parse HEAD
git rev-parse origin/main
git switch -c work/<short-task-name>
git push -u origin work/<short-task-name>
```

## Local and Codespaces startup

The committed dev container uses Node 20, runs `npm ci` after creation, and forwards port 3000 as **Maddox Training OS**. Configure development secrets, verify the environment, then run `npm run checkpoint:status` and `npm run dev`.

Required secret names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional build metadata names are `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` and `NEXT_PUBLIC_VERCEL_ENV`. Never add actual keys, service-role credentials, or `.env.local` to Git.

Playwright is not installed during container creation. For browser QA in a Codespace, run `npx playwright install --with-deps chrome` once. This matches the repository's Chrome-channel configuration without burdening every Codespace startup.

## Staging safety

Local, Codespaces, and Vercel Preview development must target staging project `npuankmkxbjtlokbpczz`. Production project `mbjcedhysniabbaigsko` is only for Vercel Production and real Maddox data.

Before write-capable testing, use the existing environment truth tools:

```bash
node scripts/env-whoami.mjs
node scripts/preflight.mjs
node scripts/confirm-write-target.mjs --target staging --action "<plain English action>"
```

The result must classify as `staging`. `unknown` is unsafe for writes. A `production` classification prohibits development writes unless Mike separately authorizes the exact Production action.

## Validate and checkpoint

Run checks appropriate to the active scope. The standard application gate is `npm run lint`, `npm test`, `npm run build`, `node scripts/verify-v8.4-import.mjs`, and `git diff --check`.

`npm run checkpoint:status` reports branch class, commit, working-tree state, upstream divergence, and the existing environment classification. It never stages, commits, pushes, or writes cloud data.

After reviewing the exact diff, checkpoint meaningful validated work:

```bash
git status --short
git diff --check
git diff --stat
git add <reviewed in-scope files>
git diff --cached --stat
git commit -m "<checkpoint message>"
git push
```

## Vercel Preview and mobile review

The intended flow is `work/*` push -> Vercel Preview -> staging Supabase -> remote review. A work-branch push must not change Production.

The repository records the intended Preview/staging split, but a fresh Preview runtime still requires manual verification under `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` and `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001`. Before write-capable Preview QA, confirm the deployed branch, Preview environment, and staging project ref with read-only environment tooling. Do not guess or write when the result is unknown.

Mike can open the Preview from a phone or tablet. Production release remains separately authorized: review the manifest and validation, then merge or push the accepted commit to `main` through the established release workflow.

## Unattended Codex boundary

On an authorized `work/*` scope, Codex may edit in-scope files, run non-destructive validation, commit meaningful validated checkpoints, and push the current work branch. The preferred stop state is **validated, committed, pushed to the work branch, ready for remote review**.

Without explicit Mike release authorization, Codex must not merge to `main`, push work onto `main`, deploy Production, alter Production environment variables, or write/migrate/seed Production Supabase.

## Remote continuity scenario

1. Mike starts work on `work/<task>`.
2. Codex works locally or in a Codespace.
3. Codex validates the scoped work.
4. Codex commits the checkpoint.
5. Codex pushes the work branch.
6. The original iMac can become unavailable without losing that checkpoint.
7. GitHub retains the branch and commit.
8. A Preview or Codespace enables remote continuation and review after its staging target is verified.
9. Mike approves the release.
10. Only then may the work reach `main` and Production.

If the Mac is lost, open the repository in Codespaces or clone it elsewhere, fetch origin, and switch to the pushed `work/*` branch. Uncommitted changes remain unrecoverable, which is why validated checkpoints should be pushed promptly.

An emergency direct-main correction requires explicit Mike authorization naming the Production correction. It does not relax environment, validation, Supabase, or release safety gates.
