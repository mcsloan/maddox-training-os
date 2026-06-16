# Maddox Training OS — Startup & Recovery Guide

## Purpose

This document explains how to restart the Maddox Training OS project after a shutdown, reboot, power outage, lost terminal session, or Codex interruption.

Use this for both:

* quick daily startup
* full recovery after something breaks

---

# QUICK START — GET RUNNING FAST

## 1. Open These Browser Links

### Local App

Localhost:

http://localhost:3000/

Local network / iPhone testing:

http://192.168.1.5:3000/

Note: the local network IP may change after router reboot or network change. If the iPhone link stops working, check the Network URL printed by `npm run dev`.

### Production App

https://maddox-training-os.vercel.app/

### GitHub Repo

https://github.com/mcsloan/maddox-training-os

### Vercel Dashboard

https://vercel.com/mcsloans-projects

### Supabase Project

https://supabase.com/dashboard/project/mbjcedhysniabbaigsko

### Dropbox Project Folder

https://www.dropbox.com/home/Apps/Maddox%20Training%20OS

### ChatGPT / Codex

ChatGPT:

https://chatgpt.com/

Codex usage / limits:

https://chatgpt.com/codex/settings/usage

---

## 2. Open Three Terminal Windows

Use three separate terminal windows.

---

## Terminal 1 — Local App Server

Purpose: runs the local Next.js app.

```bash
cd ~/Projects/maddox-training-os
npm run dev
```

Expected output includes:

```text
Local:   http://localhost:3000
Network: http://192.168.1.5:3000
```

Keep this terminal open.

Do not use this terminal for Git or Codex while the dev server is running.

---

## Terminal 2 — Git / Repo Control

Purpose: check repo state, pull/push, commit changes, inspect branches.

```bash
cd ~/Projects/maddox-training-os
git status
git pull
git log --oneline -5
```

Desired normal state:

```text
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

## Terminal 3 — Codex

Purpose: run Codex inside the project repo.

```bash
cd ~/Projects/maddox-training-os
codex
```

If `codex` does not launch:

```bash
npx @openai/codex
```

Once Codex opens, give it the current surgical task.

Current recommended Codex task:

```text
Wire Today / Day pages to v8.4 dayExecutionPlan + sportLoads, while preserving existing logging architecture. Do not change Gantt. Do not invent workouts. Do not wire Session/KPI yet.
```

---

# NORMAL DAILY STARTUP

## Step 1 — Start Local App

Terminal 1:

```bash
cd ~/Projects/maddox-training-os
npm run dev
```

Open:

http://localhost:3000/

For iPhone testing on the same Wi-Fi:

http://192.168.1.5:3000/

---

## Step 2 — Check Git

Terminal 2:

```bash
cd ~/Projects/maddox-training-os
git status
git pull
git log --oneline -5
```

---

## Step 3 — Start Codex

Terminal 3:

```bash
cd ~/Projects/maddox-training-os
codex
```

Fallback:

```bash
npx @openai/codex
```

---

# EXPECTED WORKING STATE

| Area                     | Expected State                                              |
| ------------------------ | ----------------------------------------------------------- |
| Terminal 1               | `npm run dev` running                                       |
| Terminal 2               | available for Git commands                                  |
| Terminal 3               | Codex running                                               |
| Local app                | http://localhost:3000/                                      |
| iPhone/local network app | http://192.168.1.5:3000/                                    |
| Production app           | https://maddox-training-os.vercel.app/                      |
| GitHub                   | https://github.com/mcsloan/maddox-training-os               |
| Vercel                   | https://vercel.com/mcsloans-projects                        |
| Supabase                 | https://supabase.com/dashboard/project/mbjcedhysniabbaigsko |
| Dropbox                  | https://www.dropbox.com/home/Apps/Maddox%20Training%20OS    |

---

# POWER OUTAGE / CRASH RECOVERY

Use this when the iMac shuts down unexpectedly.

---

## 1. Check Repo State

Terminal 2:

```bash
cd ~/Projects/maddox-training-os
git status
git log --oneline -5
```

Look for:

* modified files
* untracked files
* branch name
* whether local is behind origin

---

## 2. Pull Latest Repo State

Terminal 2:

```bash
git pull
```

If it says:

```text
Already up to date.
```

That is good.

---

## 3. Start Local App

Terminal 1:

```bash
cd ~/Projects/maddox-training-os
npm run dev
```

Open:

http://localhost:3000/

---

## 4. Start Codex

Terminal 3:

```bash
cd ~/Projects/maddox-training-os
codex
```

Fallback:

```bash
npx @openai/codex
```

---

## 5. Verify Production

Open production:

https://maddox-training-os.vercel.app/

Open Vercel dashboard:

https://vercel.com/mcsloans-projects

Check:

* latest deployment
* build status
* production URL
* latest commit

---

# COMMON GIT SITUATIONS

## Working Tree Clean

Good state:

```text
nothing to commit, working tree clean
```

No action needed.

---

## Untracked File Appears

Example:

```text
Untracked files:
  lib/imports/v8_4/daily.ts
```

If the file is real project work, commit it:

```bash
git add lib/imports/v8_4/daily.ts
git commit -m "Add v8.4 daily import mapping"
git push
```

---

## next-env.d.ts Changed During Dev Server

Example diff:

```text
import "./.next/types/routes.d.ts";
changed to:
import "./.next/dev/types/routes.d.ts";
```

This can happen when Next.js dev server updates generated type paths.

Usually do not commit this file change.

Restore it:

```bash
git restore next-env.d.ts
git status
```

Then commit only the real project files.

---

## Commit Normal Project Changes

Terminal 2:

```bash
git status
git diff
git add .
git commit -m "Describe the change clearly"
git push
```

After pushing:

```bash
git status
```

Goal:

```text
nothing to commit, working tree clean
```

---

# LOCAL APP TROUBLESHOOTING

## Port 3000 Is Busy

Check the port:

```bash
lsof -i :3000
```

Kill the stuck process:

```bash
kill -9 PID
```

Replace `PID` with the actual process ID.

Then restart:

```bash
npm run dev
```

---

## Next.js Cache Seems Broken

Terminal 1 or Terminal 2:

```bash
cd ~/Projects/maddox-training-os
rm -rf .next
npm run dev
```

---

## Dependencies Seem Broken

Use only if the app will not run and normal restart fails.

```bash
cd ~/Projects/maddox-training-os
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Slow Filesystem Warning

You may see:

```text
Slow filesystem detected.
```

This is not urgent if the app still runs.

Ignore it unless the app becomes unusably slow.

---

# BUILD / VALIDATION COMMANDS

Use Terminal 2 when Terminal 1 is already running the app.

```bash
cd ~/Projects/maddox-training-os
npm run lint
npm run build
```

If the build fails:

1. Copy the first meaningful error.
2. Paste it into ChatGPT or Codex.
3. Do not paste the entire massive log unless needed.

---

# CODEX STARTUP NOTES

## Start Codex

Terminal 3:

```bash
cd ~/Projects/maddox-training-os
codex
```

Fallback:

```bash
npx @openai/codex
```

## Good Codex Prompt Pattern

Use narrow, surgical tasks.

Good:

```text
Wire Today / Day pages to v8.4 dayExecutionPlan + sportLoads, while preserving existing logging architecture. Do not change Gantt. Do not invent workouts. Do not wire Session/KPI yet.
```

Bad:

```text
Make the app better.
```

Bad:

```text
Fix everything.
```

Bad:

```text
Redesign the whole plan.
```

---

# CURRENT PROJECT GUARDRAILS

## Do Not Let Codex Invent Training Logic

Codex implements the approved plan.

Codex must not:

* invent workouts
* alter the training methodology
* redesign the Gantt logic
* create new plan categories
* rename approved labels without instruction
* change source-of-truth data without approval

---

## Current App Priority

Current focus:

```text
Wire Today / Day pages to v8.4 dayExecutionPlan + sportLoads.
```

Preserve:

```text
existing logging architecture
```

Do not work on:

```text
Gantt polishing
Session/KPI wiring
new workout invention
new training plan design
```

---

# IMPORTANT PROJECT LINKS

## GitHub

https://github.com/mcsloan/maddox-training-os

## Vercel Dashboard

https://vercel.com/mcsloans-projects

## Production App

https://maddox-training-os.vercel.app/

## Local App

http://localhost:3000/

## Local Network App

http://192.168.1.5:3000/

## Supabase

https://supabase.com/dashboard/project/mbjcedhysniabbaigsko

## Dropbox

https://www.dropbox.com/home/Apps/Maddox%20Training%20OS

---

# WHERE THIS DOCUMENT SHOULD LIVE

Keep two copies.

## Repo Copy

```text
~/Projects/maddox-training-os/docs/STARTUP.md
```

Purpose:

* version controlled
* archived with the project
* available to Codex
* safe long-term source

## Desktop Copy

```text
~/Desktop/Maddox-Training-OS-Startup.md
```

Purpose:

* easy access after reboot
* available even before opening the repo
* fast recovery during chaos

---

# SAVE THIS DOCUMENT TO THE REPO

Terminal 2:

```bash
cd ~/Projects/maddox-training-os
nano docs/STARTUP.md
```

Paste this document.

Save in nano:

```text
Ctrl + O
Enter
Ctrl + X
```

Then commit:

```bash
git status
git add docs/STARTUP.md
git commit -m "Update startup recovery guide"
git push
```

---

# SAVE THIS DOCUMENT TO THE DESKTOP

```bash
nano ~/Desktop/Maddox-Training-OS-Startup.md
```

Paste this document.

Save in nano:

```text
Ctrl + O
Enter
Ctrl + X
```

---

# MINIMUM RECOVERY COMMANDS

When in doubt, this is the fastest restart:

## Terminal 1

```bash
cd ~/Projects/maddox-training-os
npm run dev
```

## Terminal 2

```bash
cd ~/Projects/maddox-training-os
git status
git pull
git log --oneline -5
```

## Terminal 3

```bash
cd ~/Projects/maddox-training-os
codex
```

Open:

http://localhost:3000/

Check production:

https://maddox-training-os.vercel.app/
