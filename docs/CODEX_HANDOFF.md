# Codex Handoff — Maddox Training OS

## Project

Maddox Training OS is a serious training operating system for Maddox’s U12 hockey preparation.

It needs to be usable by:

* a parent
* a youth athlete
* a coach/trainer reviewing the plan

It must not merely be technically correct. It must communicate clearly and professionally.

## Current Priority

Fix the Plan page legend and Gantt/overlay presentation.

The Plan page should explain the offseason methodology clearly:

* methodology phases are primary
* sport loads sit within the plan
* overlays align under the phase they belong to
* the UI should avoid data-model jargon

## Product Decisions

1. Consolidate the chip legend.
2. Avoid too many chip categories.
3. Avoid implementation-style labels in the UI.
4. Do not show labels like `external-load-protected` to the user.
5. Use clear parent/athlete-friendly language.
6. Do not describe lacrosse, on-ice sessions, camps, 4v4, or other scheduled activities as “external” to the plan. These activities are part of the plan.
7. Avoid categories that imply parts of the plan are outside the plan.
8. “Recovery Protected” is confusing unless it is clearly explained or renamed.
9. “Training Phase” should not become a bucket for unrelated things.
10. “Recovery + Testing” is confusing because recovery and testing are different concepts.
11. Gantt overlays should appear sequentially under the relevant training phase.
12. Do not chunk all overlays separately at the bottom.
13. Lacrosse and 4v4 may be their own distinct bars.
14. Performance Testing / KPIs can live in their own lane at the top or bottom.
15. Sport/activity overlays should align visually with the phase they relate to.
16. The app should communicate the plan clearly to a parent and athlete. Avoid technical taxonomy leakage from the data model into the user interface.

## Gantt Source of Truth

The Plan page Gantt should be methodology-first.

Primary methodology rows:

1. Foundation + Acceleration — W1 to W4
2. Speed + Power — W5 to W6
3. Deload — W7
4. Game-Speed + Reactive Agility — W8 to W10
5. Training Camp / Tryout Simulation — W11
6. Taper + Peak — W12

Overlay placement:

* Lacrosse sits under Foundation + Acceleration.
* 4v4 sits under Foundation + Acceleration.
* Chase Hull Camp sits under Foundation + Acceleration at W4.
* Marc O’Connor Ice sits under Speed + Power at W5 and W6.
* Carleton Camp sits under Game-Speed + Reactive Agility at W8.
* Marc O’Connor Ice sits under Game-Speed + Reactive Agility at W9.
* Sensplex Camp sits under Training Camp / Tryout Simulation at W11.
* Performance Testing can appear in its own lane at the top or bottom.

## UI Language Rules

Do not use these user-facing labels:

* external load
* external-load-protected
* Protection
* Camp Protection
* Recovery Protected
* Consolidation
* Limit Extra Work
* No Hard Dryland
* No KPI Testing

Use these labels instead:

* Sport Load
* Recovery
* Deload
* Camp
* On-Ice
* Lacrosse
* Perf Testing

Preferred explanatory copy:

“Sport loads are part of the plan. The app adjusts dryland volume around camps, on-ice sessions, lacrosse, and recovery windows.”

## Implementation Rules

* Work surgically.
* Inspect only relevant files.
* Do not refactor unrelated areas.
* Do not change unrelated app behavior.
* Preserve existing working functionality.
* Do not redesign the training plan.
* Do not invent new phases.
* Do not invent new workout logic.
* Codex implements approved decisions; Codex does not make coaching or training-design decisions.

## Validation Commands

After app-code edits, run:

git status
npm run lint
npm run build
git diff --stat

For documentation-only edits, run:

git status
git diff -- docs/CODEX_HANDOFF.md

## Fresh Session Instruction

At the start of a new Codex session, Codex should read docs/CODEX_HANDOFF.md first and not rely on prior terminal context.

For this task only:

* Create or update docs/CODEX_HANDOFF.md.
* Do not change app code yet.
* Show git status and git diff -- docs/CODEX_HANDOFF.md when done.
