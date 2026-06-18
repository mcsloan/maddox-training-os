# Product Roadmap

## Vision

Maddox Training OS should become a professional-grade private youth hockey training operating system. It should support live training, parent review, coach review, evidence capture, recovery decisions, reporting, and future AI-assisted coaching.

## Three-Tier Roadmap

### Tier 1 - Data Integrity / Cloud Sync / Environments

Goal: Make real data safe, durable, and cross-device.

Current priorities:

1. Create staging Supabase project.
2. Wire local development to staging.
3. Wire Vercel Preview to staging.
4. Keep Vercel Production on production.
5. Reapply and validate KPI cloud-sync WIP against staging.
6. Plan and execute recovered June 16 KPI backfill only as documented real historical production data.
7. Add app-wide sync visibility.
8. Confirm Log Today support fields reload cross-device.

### Tier 2 - Stabilization / Defects / UX Consistency

Goal: Remove conflicting experiences and ambiguous evidence.

Current priorities:

- Fix Homepage stale Next Session card.
- Make History Week -> Day -> Evidence.
- Add explicit blank/rest/recovery day states.
- Fix dashboard ambiguity and false positives.
- Add readiness fields including resting HR.
- Clarify KPI-like drills versus KPI tests.

### Tier 3 - Product Intelligence / Coaching Value

Goal: Build the operating system layer after data is trustworthy.

Current priorities:

- Expand KPI testing roadmap safely.
- Add Hockey IQ / Built for Hockey system.
- Add source video / instruction coverage audit.
- Add recovery/readiness recommendations.
- Add AI Coach only after data model, sync, and projections are reliable.

## Major Epics

- Private PWA / Live Training Mode
- Parent Dashboard + Exports
- Daily Plan / One Day Truth
- Training System Details
- Source Video / Instruction Coverage
- Hockey IQ / Built for Hockey System
- KPI Testing System
- Advanced KPI / Combine-Inspired Testing System
- QA / Testing / Regression System
- Recovery / Readiness System
- AI Coach

## Near-Term Build Priorities

See `docs/NEXT_BUILD_PRIORITIES.md`.
