# Scope Ledger

## Purpose

This ledger captures durable scope so future work does not depend on chat memory.

## Scope Capture Rule

At the end of every meaningful work session, update or explicitly review:

1. New defects discovered?
2. Existing defects changed status?
3. New epics/features added?
4. Product decisions made?
5. Data model / sync / environment decisions made?
6. Testing requirements added or changed?
7. Training-plan decisions made?
8. AI Coach / future roadmap items added?
9. Docs updated?
10. Next priorities changed?

Every Codex report must include:

- Defects added/updated
- Epics/features added/updated
- Product decisions added/updated
- Data/sync/environment decisions added/updated
- Testing requirements added/updated
- Docs updated
- Items intentionally deferred

## Product Decisions

- Today must route to canonical Day page.
- One day, one truth.
- "Open Today" should be the primary user path.
- Homepage Next Session should either use canonical Day projection or be replaced with Today's Plan.
- Rest days must be explicit.
- For Maddox, low-load days may still include optional light skill habits.
- Pain/soreness overrides ambition; pain/soreness logged after sport load should trigger parent review and no hard lower-body/conditioning recommendation.
- KPI testing should compare Maddox against himself over time, not adult NHL standards.
- AI Coach recommends; parent approves.
- Testing is part of the product, not an afterthought.
- Missing data is not deferred data; deferral must be explicit.
- No silent blank days.

## Active Defects Summary

- DEF-001: Standalone KPI results were local-only. KPI cloud-sync code exists as stashed WIP, not committed, not pushed, and not staging-tested.
- DEF-002: June 16 reflection appears as "Unknown workout."
- DEF-003: KPI-like drills appear as normal workout cards with sets/reps.
- DEF-004: June 14 duplicate/test-looking sessions.
- DEF-005: 0% completion displayed with Completed status.
- DEF-006: June 16 planned baseline fragmented from actual KPI work.
- DEF-007: Calendar June 15 Sport Load showed not logged despite logged data. Closed / production verified.
- DEF-008: Dashboard metrics ambiguous.
- DEF-009: Needs Attention false positives.
- DEF-010: Weekly Load actual bar unclear.
- DEF-011: Plank Quality KPI missing separate time plus form score model.
- DEF-012: Puck-Control Weave needs deferred / space-unavailable state.
- DEF-013: History is record-fragmented instead of Week -> Day -> Evidence.
- DEF-014: No consistent sync status across app.
- DEF-015: Production contains unclear seed/test/legacy/orphan data.
- DEF-016: Formal production regression plan still needed.
- DEF-017: Homepage Next Session card uses stale session logic instead of canonical Day projection.
- DEF-018: Resting HR not captured on Log Today / readiness.
- DEF-019: Blank / unclear future day state; future days must explicitly show Rest Day, Recovery Day, Recovery / Skill Habit Day, no-plan state, or data issue.

## Active Epics / Features Summary

- Private PWA / Live Training Mode: Today's plan, start session, drill cards, checkboxes, timers, notes, completion log, Add to Home Screen support, athlete-safe language.
- Parent Dashboard + Exports: weekly dashboard, KPI dashboard, camp load/recovery view, Excel export, PDF weekly printout, rink card export, season report.
- Daily Plan / One Day Truth: Program > Week > Day > Evidence; Today, Calendar, History, Dashboard, KPIs, and Exports project from canonical Day evidence.
- Training System Details: exact exercise names, sets/reps/time/rest, setup, execution steps, cues, mistakes, parent cue, source, video/instruction status, logging inputs.
- Source Video / Instruction Coverage: every athlete-actionable item needs inline instructions and/or approved video/source link; raw exercise codes cannot stand alone.
- Hockey IQ / Built for Hockey System: daily cue, Watch -> Apply -> Reflect, scan, shoulder check, demand puck, support, protect puck, first-touch plan, communication, confidence.
- KPI Testing System: baseline and retest tracking for speed, agility, jump, shooting, head-up, quick hands, plank, and puck-control weave.
- Advanced KPI / Combine-Inspired Testing System: age-appropriate expanded performance testing library that compares Maddox against himself over time.
- QA / Testing / Regression System: unit, projection, smoke, fixture, E2E, sync, staging, production, and release-gate coverage.
- Recovery / Readiness System: readiness and recovery evidence that informs parent review and tomorrow recommendations without silently rewriting the plan.
- AI Coach: future intelligence layer that recommends; parent approves.

## Advanced KPI / Combine-Inspired Testing Scope

Candidate tests and trends:

- 100m sprint
- 45-second hockey shift simulation / repeated-effort test
- push-up test
- pull-up test or flexed-arm hang
- vertical jump
- standing broad jump
- 5-10-5 / pro agility
- 10-yard or 10m acceleration
- optional bike power / repeat-effort test later
- shooting accuracy trend
- head-up callout / scan-and-handle test
- puck-control weave with deferred state

Product decision:

- Do not use a flat 400m as the primary hockey-shift test. Prefer a 45-second repeated shuttle / shift-simulation test because it better resembles hockey's start-stop-repeat demand.

Age-appropriate rules:

- No adult combine ranking pressure.
- Track personal trends only.
- Standardize warm-up, rest, surface, footwear, and timing.
- Do not test after high-load games/camps unless deliberately planned.
- Use testing to guide training, not to overload him.

## QA / Testing / Regression Scope

- unit tests
- projection tests
- v8.4 import smoke test
- golden fixtures
- Playwright E2E
- cross-device sync tests
- staging cloud-write tests
- production smoke checklist
- formal release gate

## Training-Plan Decisions

- v8.4 import package is authoritative for training plan data.
- Camps, lacrosse, 4v4, on-ice sessions, and other sport loads are part of the plan.
- Do not call sport loads "external" in user-facing language.
- Sport Load logging and Training Work logging remain independent.
- Sport Load logging must not mark Training Work complete.
- Training Work logging must not mark Sport Load complete.
- Gantt and phase model are locked unless explicitly reopened.

## Data / Sync / Environment Decisions

- Sport Load / Log Today cloud sync is production-confirmed.
- Standalone KPI cloud sync remains DEF-001 and is not complete until staged and validated.
- Staging Supabase must be created before fake/dev cloud-write tests.
- Production Supabase is real Maddox data only.
- Local development must point to staging once staging exists.
- Vercel Preview must point to staging once staging exists.
- Vercel Production must point to production.
- No fake/test records in production.
- Recovered June 16 KPI backfill must be intentional, documented, and treated as real historical data.
- KPI cloud-sync WIP is stashed and not committed.
- `.wip/2026-06-17-kpi-cloud-sync-wip.patch` exists and must not be committed.

## Data / Sync / Environment Scope

- Staging Supabase
- Production Supabase is real Maddox data only
- local development must point to staging once staging exists
- no fake/test records in production
- KPI backfill must be intentional
- KPI cloud-sync WIP is stashed and not committed
- `.wip/2026-06-17-kpi-cloud-sync-wip.patch` exists and must not be committed
- app-wide sync visibility
- Log Today support-field cross-device reload verification
- standalone KPI cloud sync staged validation
- production data cleanup for unclear seed/test/legacy/orphan records

## Recovery / Readiness Scope

- energy
- soreness
- pain
- sleep
- Resting HR
- recovery completed
- tomorrow recommendation
- parent review flags
- Recovery / Skill Habit Day

## Testing Decisions

- Critical flows require regression coverage before the app is considered stable.
- Playwright E2E is planned but not implemented.
- Cross-device sync is a first-class test area.
- Staging cloud-write tests are required for KPI cloud sync.
- Production smoke checklist is required before deploys that affect real data.

## Items Intentionally Deferred

- KPI cloud-sync WIP is stashed until staging exists and validation is planned.
- June 16 KPI backfill remains manual/future.
- Homepage DEF-017 is open.
- History Week -> Day -> Evidence is open.
- AI Coach starts only after data model and sync are trustworthy.
