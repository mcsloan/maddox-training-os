# Maddox Training OS v8.4 App Import Package

Generated from: `Maddox_Training_OS_v8_3_Source_Of_Truth_Lock.xlsx`  
Package version: `v8.4`  
Generated: `2026-06-16T04:53:35+00:00`

## Purpose

This package converts the approved workbook source of truth into app-ready JSON files for the Maddox Training OS PWA.

The app should import these files and render the approved plan. Codex must not redesign training logic, phase names, Gantt bars, workouts, videos, or sport-load rules.

## Highest-priority source files

1. `data/dayExecutionPlan.json` — source for Today and Start Session sequencing.
2. `data/sessions.json` — daily session metadata.
3. `data/drillCards.json` — app-ready drill cards with merged detail/video fields.
4. `data/exerciseVideoMap.json` — canonical exercise-to-video source map.
5. `data/kpis.json` and `data/kpiProtocols.json` — KPI display and logging.
6. `data/ganttModel.json` — locked Gantt model.
7. `data/logSchemas.json` — recommended logging fields.

## Guardrails

- Sport loads are part of the plan, not external load.
- The locked Gantt must match the workbook model.
- Video URLs came from the workbook/human-reviewed source map.
- No app/Codex video searching.
- No app/Codex exercise or workout invention.
- Keep the iPhone live session mode simple: Start, Done, Enter result, Next, Finish.

## Record counts

```json
{
  "dayExecutionPlan.json": 630,
  "sessions.json": 84,
  "drills.json": 154,
  "workoutBlockDetails.json": 154,
  "exerciseVideoMap.json": 154,
  "speedStackPrescriptions.json": 616,
  "kpis.json": 7,
  "kpiProtocols.json": 6,
  "sportLoads.json": 37,
  "phaseMap.json": 12,
  "phaseLabels.json": 12,
  "hockeyIq.json": 6,
  "skillShotIqLibrary.json": 22,
  "integratedSkillSessions.json": 9,
  "skillShotIqSeed.json": 30,
  "shootingProgression.json": 12,
  "recoveryRules.json": 6,
  "ganttModel.json": 17,
  "drillCards.json": 154,
  "logSchemas.json": 8,
  "videoCoverageReport.json": 10,
  "sourceTrace.json": 11,
  "sourceOfTruthLock.json": 39,
  "needsReview.json": 0
}
```

## Video status

```json
{
  "Exact Source Video": 149,
  "Not Video Required": 5
}
```
