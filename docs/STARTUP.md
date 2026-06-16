# Maddox iOS Training App — Startup / Recovery Runbook

## Purpose

Use this document after a shutdown, power outage, reboot, or lost browser/terminal session to restart the Maddox Training OS project quickly.

---

# 1. Project Basics

**Project name:** Maddox Training OS
**Local repo path:** `~/Projects/maddox-training-os`
**Main branch:** `main`
**Local app URL:** `http://localhost:3000`
**Production app:** Vercel deployment
**Primary package manager:** npm
**Framework:** Next.js
**Database/backend:** Supabase
**Source control:** GitHub
**Deployment:** Vercel

---

# 2. Browser Tabs to Reopen

## Local App

Open:

`http://localhost:3000`

Use this for live development and testing on the iMac.

## Production App

Open the Vercel production URL:

`PASTE_VERCEL_PRODUCTION_URL_HERE`

Use this to compare what is actually deployed versus local development.

## GitHub

Open the GitHub repository:

`PASTE_GITHUB_REPO_URL_HERE`

Use this for commits, branches, repo files, issues, and deployment history links.

## Vercel Dashboard

Open:

`https://vercel.com/dashboard`

Then open the Maddox Training OS project.

Use this for:

* Production deployment status
* Preview deployments
* Environment variables
* Build logs
* Domain settings

## Supabase Dashboard

Open:

`https://supabase.com/dashboard/projects`

Then open the Maddox Training OS Supabase project.

Use this for:

* Database tables
* Auth
* Storage
* SQL editor
* API keys
* Environment variables

## ChatGPT / Codex

Open:

`https://chatgpt.com/`

Use this for project planning, Codex prompts, debugging, and documentation generation.

---

# 3. Terminal Window Layout

Use three terminal windows.

---

## Terminal 1 — Main App Server

Purpose: run the local development server.

```bash
cd ~/Projects/maddox-training-os
git status
npm install
npm run dev
```

Expected local app:

```text
http://localhost:3000
```

If port 3000 is busy:

```bash
lsof -i :3000
kill -9 <PID>
npm run dev
```

---

## Terminal 2 — Git / Repo Control

Purpose: check repo state, commit work, and sync with GitHub.

```bash
cd ~/Projects/maddox-training-os
git status
git branch
git log --oneline -5
```

Before starting new work:

```bash
git pull
```

Before committing:

```bash
git status
git diff
```

Commit pattern:

```bash
git add .
git commit -m "Describe the change clearly"
git push
```

Useful check:

```bash
git log --oneline -3
```

---

## Terminal 3 — Diagnostics / Build / Tests

Purpose: run checks without disturbing the dev server.

```bash
cd ~/Projects/maddox-training-os
npm run lint
npm run build
```

If the build fails, copy the first meaningful error into ChatGPT/Codex.

Optional cleanup if things seem corrupted:

```bash
rm -rf .next
npm run dev
```

If dependencies seem broken:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

# 4. After Power Outage Recovery Checklist

## Step 1 — Confirm repo state

```bash
cd ~/Projects/maddox-training-os
git status
```

Look for:

* uncommitted changes
* modified files
* deleted files
* branch name
* whether local is behind origin

## Step 2 — Confirm latest commits

```bash
git log --oneline -5
```

Make sure the latest commit matches the last known good work.

## Step 3 — Start local app

```bash
npm run dev
```

Open:

`http://localhost:3000`

## Step 4 — Check production

Open Vercel production URL:

`PASTE_VERCEL_PRODUCTION_URL_HERE`

Compare:

* local app
* production app
* latest pushed commit
* latest Vercel deployment

## Step 5 — Check Vercel deployment status

Open:

`https://vercel.com/dashboard`

Confirm:

* latest deployment succeeded
* production points to the expected commit
* no failed build logs

## Step 6 — Check Supabase only if data looks wrong

Open:

`https://supabase.com/dashboard/projects`

Check:

* tables
* auth
* storage
* environment variables

Do not change database settings unless the issue is clearly database-related.

---

# 5. Critical Project Rules

## Keep important decisions in the repo

Important decisions should not live only in ChatGPT or Codex chat history.

Save them in files such as:

```text
/docs/DECISIONS.md
/docs/STARTUP.md
/docs/ROADMAP.md
/docs/RELEASE_NOTES.md
/docs/BACKLOG.md
```

## Do not rely on memory alone

After every major decision, update the repo.

Examples:

* changed plan page terminology
* changed chip categories
* changed KPI rules
* changed data model
* changed calendar behavior
* changed Maddox training structure
* changed deployment process

## Commit after stable milestones

Good commit moments:

* app runs locally
* build passes
* UI change is complete
* terminology cleanup is complete
* data model change is complete
* deployment docs are updated

---

# 6. Useful Commands

## Check current folder

```bash
pwd
```

## Go to project

```bash
cd ~/Projects/maddox-training-os
```

## Check ports

```bash
lsof -i :3000
lsof -i :3001
```

## Stop stuck process

```bash
kill -9 <PID>
```

## Check repo status

```bash
git status
```

## Pull latest

```bash
git pull
```

## Start app

```bash
npm run dev
```

## Build app

```bash
npm run build
```

## View recent commits

```bash
git log --oneline -5
```

---

# 7. Provider Links

## GitHub

Repository:

`PASTE_GITHUB_REPO_URL_HERE`

## Vercel

Dashboard:

`https://vercel.com/dashboard`

Project:

`PASTE_VERCEL_PROJECT_URL_HERE`

Production app:

`PASTE_VERCEL_PRODUCTION_URL_HERE`

## Supabase

Dashboard:

`https://supabase.com/dashboard/projects`

Project:

`PASTE_SUPABASE_PROJECT_URL_HERE`

## OpenAI / ChatGPT / Codex

ChatGPT:

`https://chatgpt.com/`

Codex usage/settings:

`https://chatgpt.com/codex/settings/usage`

---

# 8. Current Known Priority

Do not over-polish the Gantt chart right now.

The Gantt is usable.

Higher priority:

* clarify Plan page terminology
* consolidate chip legend
* remove confusing legacy categories
* ensure local/prod startup is reliable
* store decisions in repo docs
* keep the app usable for Maddox training tracking

---

# 9. Immediate Restart Sequence

Run this after reboot:

```bash
cd ~/Projects/maddox-training-os
git status
git log --oneline -5
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Then open:

```text
PASTE_VERCEL_PRODUCTION_URL_HERE
```

Then check:

```text
GitHub → latest commit
Vercel → latest deployment
Supabase → only if data/backend issue
```

