# Agent Report

## Latest Task

Durable Capture of SURFACE-PRESENTATION-CONSUMER-AUDIT-001 Findings.

## Result

Persisted the completed inspect-only site-wide activity presentation consumer audit into canonical repo control docs.

The audit found that the Day page is closest to canonical because it uses `dayExecutionPlan` plus `buildDayPresentation`, while the Session page is the main divergent path because it builds a synthetic flattened workout/drill model from `sessions.json` and `drills.json`. Site-wide consumers must be classified before broad display fixes continue.

Documented the approved target architecture: v8.4 `dayExecutionPlan` owns top-level day activity coverage and order; `sessions.json` and `drills.json` enrich details; Speed Stack child drills attach under parent Speed Stack activities; duration precedence is `dayExecutionPlan` first, session/drill detail second, code-derived fallback only when no authoritative duration exists; presentation fixes must not mutate saved data.

This was documentation capture only. No app code, tests, source JSON, imports, logging behavior, Supabase, env, package files, commits, or pushes were changed.

`ACTIVITY-PRESCRIPTION-001` remains blocked/not commit-ready. The next implementation candidate is `ACTIVITY-PRESENTATION-CONTRACT-001` - Planned activity presentation contract, Day + Session parity only.

## Files Changed

- `docs/SCOPE.md`
- `docs/AGENT_REPORT.md`
- `docs/SESSION_HANDOFF.md`

## Audit Findings Captured

- `SURFACE-PRESENTATION-CONSUMER-AUDIT-001` marked `Completed`.
- Core conclusion captured: Day is closest to canonical; Session is the main divergent path; site-wide consumers need classification before broad fixes.
- Consumer classification captured at summary level:
  - canonical-contract-now: Day execution, Session form/cards/summary, Training Work logging surface, v8.4 synthetic session adapter path.
  - summary-from-contract: Today/Home, Calendar, Dashboard, History, DayEvidenceStatus, Plan summaries, KPI day summaries, Sport Load support-work summaries, future exports/reports.
  - admin/source/reference-only exceptions: Library source catalog and debug/diagnostic session surfaces.
  - deferred: broad Dashboard/History/KPI/Exports rewiring until Day + Session parity is stable.

## Architecture Captured

- Added documentation-only `ActivityPresentation` and `ActivityPresentationChild` target baseline to `docs/SCOPE.md`.
- Captured split-pass strategy:
  - Pass 1: `projectPlannedDayActivities(date)` for master/reference plan data plus metadata only. No Supabase, saved logs, or transactional joins.
  - Pass 2: `projectDayEvidence(date)` for saved evidence/status/logs only.
  - Pass 3: `composeDayViewModel(date)` to compose planned presentation plus evidence.
- Added `ACTIVITY-PRESENTATION-CONTRACT-001` as the next implementation candidate.
- Updated `docs/SESSION_HANDOFF.md` so the next start point is completed consumer audit -> docs capture -> planned-activity projection implementation.

## Current WIP Status

The local ACTIVITY-PRESCRIPTION-001A/B/C WIP remains intentionally uncommitted and not commit-ready. It must not be committed, reverted, or built on blindly. Future implementation should revise or discard it only through the approved canonical contract plan.

## Scope Capture Check

- Defects added/updated: `DEF-027` updated to reference completed audit findings; `DEF-021` through `DEF-026` remain blockers; `DEF-020` remains scope review required.
- Epics/features added/updated: `SURFACE-PRESENTATION-CONSUMER-AUDIT-001` completed; `ACTIVITY-PRESENTATION-CONTRACT-001` added as the next implementation candidate; `ACTIVITY-PRESCRIPTION-001` remains blocked.
- Product decisions added/updated: top-level day activity order belongs to v8.4 `dayExecutionPlan`; sessions/drills enrich but do not replace that order; duration precedence documented.
- Data/sync/environment decisions added/updated: presentation pass must not mutate saved data, use Supabase, or perform transactional joins.
- Testing requirements added/updated: future implementation needs Day + Session parity, duration precedence, and source-language filtering coverage.
- Docs updated: `docs/SCOPE.md`, `docs/AGENT_REPORT.md`, `docs/SESSION_HANDOFF.md`.
- Items intentionally deferred: app-code fixes, test edits, source JSON edits, logging changes, Dashboard/History/KPI/Exports/Gantt/Supabase work, browser checks, commit, push.
