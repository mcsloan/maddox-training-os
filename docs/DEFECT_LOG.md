# Defect Log

## Status Terms

- Open: known issue, not fixed.
- In progress: implementation or investigation has started but is not complete.
- Closed / production verified: fixed and verified in production.
- Deferred: intentionally postponed with explicit rationale.

## Tier 1 Defects

### DEF-001 - Standalone KPI results were local-only

Status: In progress.

KPI cloud-sync code was implemented locally, stashed, not staging-tested, not committed, and not pushed. Stash name: `WIP KPI cloud sync before master reconciliation`. Patch file: `.wip/2026-06-17-kpi-cloud-sync-wip.patch`.

### DEF-014 - No consistent sync status across app

Status: Open.

Partially addressed in stashed KPI work only. The app still needs app-wide sync visibility for parent troubleshooting.

### DEF-015 - Production contains unclear seed/test/legacy/orphan data

Status: Open.

Needs operator review workflow and clear rules for production data cleanup.

### DEF-016 - Formal production regression plan still needed

Status: Open.

Needs release gate and documented smoke checklist.

### DEF-018 - Resting HR not captured on Log Today / readiness

Status: Open.

Readiness/recovery model should include resting HR.

## Tier 2 Defects

### DEF-002 - June 16 reflection appears as "Unknown workout"

Status: Open.

### DEF-003 - KPI-like drills appear as normal workout cards with sets/reps

Status: Open.

### DEF-004 - June 14 duplicate/test-looking sessions

Status: Open.

### DEF-005 - 0% completion displayed with Completed status

Status: Open.

### DEF-006 - June 16 planned baseline fragmented from actual KPI work

Status: Open.

### DEF-007 - Calendar June 15 sport load showed not logged despite logged data

Status: Closed / production verified.

### DEF-008 - Dashboard metrics ambiguous

Status: Open.

### DEF-009 - Needs Attention false positives

Status: Open.

### DEF-010 - Weekly Load actual bar unclear

Status: Open.

### DEF-011 - Plank Quality KPI missing separate time plus form score model

Status: Open.

### DEF-012 - Puck-Control Weave needs deferred / space-unavailable state

Status: Open.

### DEF-013 - History is record-fragmented instead of Week -> Day -> Evidence

Status: Open.

### DEF-017 - Homepage Next Session card uses stale session logic

Status: Open.

Homepage showed "Fresh Baseline KPI + speed mechanics" even though canonical day was June 17 lacrosse/recovery. Homepage should use canonical Day projection or be replaced with Today's Plan.

### DEF-019 - Blank / unclear future day state

Status: Open.

Problem: Calendar / Plan can appear empty for tomorrow without clearly saying whether it is a rest day, recovery day, active recovery day, no-plan day, or data issue.

Expected: If no hard work is planned, the app must explicitly show Rest Day, Recovery Day, or Recovery / Skill Habit Day. Safe optional work can include light stickhandling, easy shooting mechanics, mobility, easy walk/bike, and Hockey IQ. Pain/soreness overrides ambition.
