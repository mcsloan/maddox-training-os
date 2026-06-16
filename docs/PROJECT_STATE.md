# Project State — Maddox Training OS

## Project Purpose

Maddox Training OS is a private web/iPhone training operating system for Maddox’s U12 hockey offseason preparation.

It must serve three users:

* Maddox, the athlete
* Mike, the parent/operator
* a coach/trainer reviewing the plan

The app must be practical, clear, and usable during real training. It is not just a static calendar.

## Current Source-of-Truth Files

* docs/CODEX_HANDOFF.md — implementation and product rules for Codex.
* docs/PROJECT_STATE.md — current project handover state for future ChatGPT and Codex sessions.
* Latest workbook: Maddox_Training_OS_12Week_Methodology_v6_Source_Video_Map.xlsx.
* Approved app-import package: imports/v8.4/.

The workbook is the source of truth for:

* training methodology
* Gantt layout
* execution tabs
* workout/session details
* video-map direction

The app should render approved data. Codex should not invent coaching logic.

The approved source-of-truth import package is v8.4 in imports/v8.4/. Future import work should use the data files in that package, not ad hoc reconstruction.

## Current Stable App Status

The Plan page Gantt has been stabilized enough for now.

The Gantt is methodology-first:

* methodology phases are primary
* sport loads and camps are overlays within the plan
* overlays sit under the phase they relate to
* sport loads are not treated as external to the plan

The mixed-day logging model has been improved:

* sport-load logging and planned-training logging are separate
* workout blocks mean planned training work exists
* planned training work no longer disappears simply because a sport load exists
* Log Training Work is functional
* Log Sport Load remains separate

## Current App Priorities

1. Keep Plan page Gantt stable.
2. Keep mixed-day logging stable.
3. Ensure sport-load logging and planned-training logging remain independent.
4. Integrate the approved v8.4 import package in a controlled, source-first way.
5. Build the source-video map from HockeyTraining playlists and USA Hockey Training@Home links.
6. Import the final approved video map into the app.
7. Improve workout/session execution flow.

## Gantt Status

The Plan page Gantt is methodology-first.

Primary phases:

* Foundation + Acceleration — W1-W4
* Speed + Power — W5-W6
* Deload — W7
* Game-Speed + Reactive Agility — W8-W10
* Training Camp / Tryout Simulation — W11
* Taper + Peak — W12

Sport loads and camps are overlays within the plan, not external to the plan.

Important overlay rules:

* Lacrosse sits under Foundation + Acceleration.
* 4v4 sits under Foundation + Acceleration.
* Chase Hull Camp sits under Foundation + Acceleration at W4.
* Marc O’Connor Ice sits under Speed + Power at W5 and W6.
* Carleton Camp sits under Game-Speed + Reactive Agility at W8.
* Marc O’Connor Ice sits under Game-Speed + Reactive Agility at W9.
* Sensplex Camp sits under Training Camp / Tryout Simulation at W11.
* Performance Testing can appear in its own lane.

Do not use user-facing labels such as:

* external load
* external-load
* external-load-protected
* external hockey
* Protection
* Camp Protection
* Recovery Protected
* Consolidation

## Logging Model

Sport loads and planned training work are separate loggable items.

A day may have:

* only planned training work
* only sport load
* both planned training work and sport load
* recovery only

If workout blocks exist, planned training work exists.

Sport-load logging must not replace training-work logging.

On mixed days, the app should show both:

* Log Training Work
* Log Sport Load

Completing one must not complete the other.

## Planned Training Work Rule

The Planned Training Work card must be consistent with the Workout Blocks section.

If the page shows workout blocks such as:

* WU-10
* MOB-15
* MOB-20
* SKL-HU10

then the Planned Training Work card must not say:
“No planned training work today — recovery only.”

Instead, it should summarize the recovery-adjusted training work and provide a functional Log Training Work action.

## Sport Load Rule

Sport loads include:

* lacrosse
* 4v4 hockey
* on-ice sessions
* camps
* other planned hockey/sport activities

Sport loads are part of the plan. They are not external load.

Preferred copy:
“Sport loads are part of the plan. The app adjusts dryland volume around camps, on-ice sessions, lacrosse, and recovery windows.”

## Video Map Direction

Do not ask Codex to find or choose videos.

The video system must be source-first.

Allowed primary video sources:

* HockeyTraining.com playlist URLs from the guide QR codes
* USA Hockey Training@Home PDF hyperlinks
* Nike program videos only for Nike-specific exercises

Do not use random YouTube substitutions.

Do not use generic 10-minute videos unless the source itself only provides a sequence video and the workbook marks it as a Source Sequence Video.

The future video-map table should use:

* canonicalExerciseId
* exerciseName
* sourceFamily
* sourcePlaylistUrl
* sourceVideoTitle
* directVideoUrl
* matchStatus
* matchNotes

Allowed match statuses:

* Exact Source Video
* Source Sequence Video
* Source Playlist Fallback
* Needs Exact Source Video
* Not Video Required

Codex should only import and render the approved map. Codex must not search the web for videos or invent links.

## Current Workflow

Before starting a new Codex task:

1. Read docs/CODEX_HANDOFF.md.
2. Read docs/PROJECT_STATE.md.
3. Work surgically.
4. Do not make coaching or training-design decisions.
5. Do not refactor unrelated areas.
6. Do not change unrelated app behavior.

After app-code edits, run:

* git status
* npm run lint
* npm run build
* git diff --stat

After doc-only edits, run:

* git status
* git diff -- docs/PROJECT_STATE.md

## Next Known Work

Next priorities:

1. Integrate imports/v8.4/ as the approved source-of-truth import package.
2. Build v6.1 Source Video Map with enumerated HockeyTraining playlist items.
3. Review Needs_Review video rows.
4. Export approved app seed data.
5. Give Codex a tiny import-only video-map prompt.
6. Continue improving live session execution only after the data model is stable.

## Non-Negotiable Rule

Codex implements. Codex does not design the training plan.

Training design, workout content, phase model, video-source reconciliation, and coaching logic must be approved before Codex implements them.

For this task only:

* Create or update docs/PROJECT_STATE.md.
* Do not change app code.
* Show git status and git diff -- docs/PROJECT_STATE.md when done.
