You are working in the Maddox Training OS repo.

Before changing code, read:
- docs/PROJECT_STATE.md
- docs/CODEX_HANDOFF.md
- the v8.4 app import package README
- manifest.json

Task:
Import the approved v8.4 JSON data package into the app.

Hard rules:
- Do not invent workouts, exercises, phases, videos, Gantt bars, or labels.
- Do not search the internet for videos.
- Do not rename sport loads as external loads.
- Do not alter the locked GANTT model.
- Render the approved data exactly, with normal UI formatting only.

Data files:
- data/dayExecutionPlan.json
- data/sessions.json
- data/drillCards.json
- data/exerciseVideoMap.json
- data/kpis.json
- data/kpiProtocols.json
- data/sportLoads.json
- data/phaseMap.json
- data/phaseLabels.json
- data/ganttModel.json
- data/hockeyIq.json
- data/logSchemas.json

Implement:
1. Today page uses sessions.json + dayExecutionPlan.json.
2. Start Session page renders ordered entries from dayExecutionPlan.json.
3. Drill cards use drillCards.json.
4. Video buttons use the exact URLs from exerciseVideoMap.json / drillCards.json.
5. KPI forms use kpis.json + kpiProtocols.json.
6. Sport-load logging uses sportLoads.json + logSchemas.json.
7. Plan/Gantt page uses ganttModel.json exactly.
8. Preserve existing working app behavior unless directly replacing old seed/mock data.

After implementation, run:
- npm run lint
- npm run build

Report:
- files changed
- data files imported
- any unresolved questions
