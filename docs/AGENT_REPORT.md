# Safe Lane Fix 2 Report

## Branch Name

- `fix/history-day-evidence`

## Files Changed

- `app/history/page.tsx`
- `lib/projections/dayEvidence.ts`
- `docs/AGENT_REPORT.md`

## What Changed

- Made `/history` primarily a day-based Training Journal organized by Program > Week > Day > Evidence.
- Grouped evidence cards under plan week sections, with a separate needs-review group for records outside approved plan dates.
- Kept raw Sport Load logs and raw session attempts lower on the page as secondary audit detail.
- Added History-specific labels and summaries so evidence-only days do not look like nothing happened.
- Extended the shared day evidence helper to accept legacy/orphan records for review-state projection.

## How History Now Groups Week -> Day -> Evidence

- The primary History section is now `Training Journal`.
- Evidence dates are built from approved calendar dates plus existing Sport Load logs, standalone KPI results, and session attempts.
- Each day card shows date, day title, derived status label, evidence chips/counts for Sport Load, Training Work, KPI, Reflection, and Legacy review when present.
- Week groups use approved plan weeks. Records outside approved plan weeks go into `Needs review`.

## How June 15 Is Shown

- June 15 appears as a Week 1 day when a Sport Load log exists.
- It shows `Sport Load logged` and a Sport Load evidence count.
- It does not mark Training Work complete just because the 4v4 Sport Load was logged.

## How June 16 Is Shown

- June 16 appears as a Week 1 KPI evidence day when standalone KPI results exist.
- If 7 of 8 planned KPI results are present, the card displays `Partial` and summarizes `7 of 8 planned KPI results recorded`.
- Missing Puck-Control Weave is not inferred as deferred without an explicit supported record.

## How June 17 Is Shown

- June 17 appears as a Week 1 day when the lacrosse Sport Load log exists.
- It shows Sport Load evidence and keeps that separate from Training Work evidence.

## How June 14 Legacy/Test/Orphan Data Is Handled

- Sessions outside approved plan dates, or sessions whose workout id cannot be matched to known workouts, are treated as legacy/orphan records.
- Those records are shown under `Needs review` with `Legacy / unattached records`.
- They are preserved and shown, but not silently attached to approved plan truth.

## What Did Not Change

- No `imports/v8.4/data/*.json` files changed.
- No Supabase data was mutated.
- No production data was written.
- No Gantt logic changed.
- Calendar and Dashboard were not redesigned.
- Sport Load logging and Training Work logging remain separate.
- No fake data was created and no existing real data was removed.

## Checks Run / Results

- `node scripts/preflight.mjs` - passed, read-only, local env classified as staging.
- `npm run lint` - passed.
- `npm run build` - passed.
- `node scripts/verify-v8.4-import.mjs` - passed.
- `git diff --check` - passed.

## Risks / Remaining Gaps

- This is still a narrow History projection fix, not the full History evidence-detail redesign.
- Legacy/orphan handling is conservative: records are labeled for review when the app cannot confidently attach them.
- The day status model still does not store an explicit Puck-Control Weave deferment, so June 16 partial KPI evidence is labeled in History rather than by creating a deferment.
- No browser/iPad visual verification was run in this pass.

## git status --short

```text
 M app/history/page.tsx
 M docs/AGENT_REPORT.md
 M lib/projections/dayEvidence.ts
```

## Browser / iPhone / iPad / Supabase / Vercel Checks

- Not run. This pass used local code/build checks only.

## Commit / Push

- Commit happened: no.
- Push happened: no.

## Scope Capture Check

- Defects added/updated: DEF-013 History record fragmentation addressed with a narrow Week -> Day -> Evidence journal; DEF-004/DEF-015 legacy-style records now get needs-review treatment in History when they cannot attach to plan truth.
- Epics/features added/updated: Daily Plan / One Day Truth and QA / Testing / Regression advanced for History projection.
- Product decisions added/updated: History is now day-first; raw records are secondary audit detail.
- Data/sync/environment decisions added/updated: Existing read paths only; no writes or environment changes.
- Testing requirements added/updated: Standard app checks completed; browser/iPad verification still deferred.
- Docs updated: `docs/AGENT_REPORT.md`.
- Items intentionally deferred: full drill-level evidence expansion, explicit KPI deferment storage, export integration, browser/iPad manual verification.
