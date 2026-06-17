# Role Expectations

## Purpose

This document defines what the athlete and parent/operator should see when the same day-level truth is projected through the app.

Canonical hierarchy:

Program > Week > Day > Records > Screen projections.

## Athlete View

The athlete view should answer:

- What do I do now?
- What is the next step?
- What is already done?
- What should I avoid today?
- Is there a video-backed drill card for the current work?

The athlete view should prioritize:

- Today's planned execution order.
- Start or resume Training Work.
- Sport Load logging only when it is the relevant action.
- Short recovery prompts.
- Clear completion state.
- Offline/local fallback messaging only when it affects action.
- Resume reliability warnings when progress exists locally but is not cloud-synced.

The athlete view should not prioritize:

- Long weekly analytics.
- Export concepts.
- Administrative schema details.
- Legacy/internal names except where unavoidable.
- Export limitations unless they affect the current action.

## Parent/Operator View

The parent/operator view should answer:

- What was planned for the day?
- What actually happened?
- What changed from the plan?
- Are there deferred KPIs, partial sessions, or recovery concerns?
- Is data synced across devices?
- What requires follow-up?

The parent/operator view should prioritize:

- Plan vs actual by day.
- Readiness, soreness, pain, effort, confidence, and recovery notes.
- Sport Load and Training Work separation.
- KPI completion and deferral.
- Sync health.
- Legacy/orphan data needing review.
- Unsupported expected records.
- Export caveats when exported evidence would omit partial, deferred, sync, or local-only facts.

The parent/operator view should not:

- Mark Training Work complete because Sport Load was logged.
- Mark Sport Load complete because Training Work was logged.
- Hide partial/interrupted progress.
- Treat local-only data as cloud-synced.
- Treat unsupported storage as if the event did not matter.

## Coach Review View

Coach-facing projections should answer:

- What training stimulus was planned?
- What work was completed?
- What was skipped or deferred?
- What readiness/recovery signals matter?
- Which drill/KPI results should influence the next review?

Coach-facing projections should stay grounded in approved records and avoid invented coaching logic.

Coach-facing projections should label unsupported or local-only records when those labels affect review confidence.

## Shared Expectations

All roles should see consistent day truth:

- Same day status.
- Same completed records.
- Same deferred records.
- Same sync warnings.
- Same legacy/orphan warnings.
- Same unsupported-record and export-not-supported caveats when those caveats affect the fact being shown.

Differences should be in emphasis, not facts.

## Unsupported Record Expectations By Role

Some process scenarios include expected records that may not have storage yet, such as explicit KPI deferrals or standalone recovery logs.

Athlete:

- Should not be blocked by an unsupported record unless safety or current workflow depends on it.
- Should not see a missing unsupported record presented as failure or completion.

Parent/operator:

- Should see that the expected record cannot yet be captured.
- Should see the affected day as requiring review or product follow-up when the unsupported record changes status interpretation.

Coach review:

- Should not use unsupported records as evidence.
- Should see the limitation if it affects plan-vs-actual interpretation.

## Role-Specific Examples

### Sport Load Day

Athlete:

- Sees the Sport Load and any approved light support work.
- Sees warnings to keep dryland reduced.
- Can log the Sport Load without completing Training Work.

Parent/operator:

- Sees planned Sport Load, completed Sport Load log, recovery status, and any remaining Training Work status separately.

### KPI Day

Athlete:

- Sees the planned KPI workflow and any safety/recovery warnings.
- Can complete or defer a KPI item.

Parent/operator:

- Sees completed KPI results, deferred KPI items, and whether the day is completed or completed with deferred work.

### Interrupted Session

Athlete:

- Sees resume state and next unfinished step.

Parent/operator:

- Sees partial state, completed drills, missing reflection, and sync state.

## Sync Expectations By Role

Athlete:

- Should be able to resume a live session across iPhone, iPad, and laptop when Supabase is configured.
- Should be able to keep working locally if Supabase fails.
- If a record exists locally but is not cloud-synced, the athlete can continue on the current device, but cross-device resume should not be promised.

Parent/operator:

- Should see whether data is cloud-synced, pending, failed, or local-only.
- Should be able to identify local-only KPI or Training Work records until those systems are explicitly synced.
- Should see local-only records as valid current-device evidence with limited cross-device/export confidence.

## Export Expectations By Role

Athlete:

- Usually does not need export caveats during training.

Parent/operator:

- Must know when an export cannot include a partial, deferred, sync pending, sync failed, local-only, or legacy/orphan caveat.
- Should treat `export-not-supported` as an evidence limitation, not as absence of the source record.

Coach review:

- Should not receive an export that silently omits known caveats.
- If export support is incomplete, coach review should use in-app History/Dashboard/Day projections or a manually noted caveat.

## Language Expectations

- User-facing language should say `Sport Load`.
- Legacy/internal names may appear only when discussing storage, routes, schemas, repository names, or review diagnostics.
- Screen copy should not imply a broader completion state than the records support.
