# Maddox Training OS

Maddox Training OS is a private, web-first youth hockey training Progressive Web App. Phase 1 provides the architecture, responsive screens, live session workflow, mock training data, local autosave, KPI entry, parent review, and export placeholders.

The app is designed for iPhone and iPad use during training, with expanded parent/coach dashboards on iPad and desktop. It requires no backend or paid service in Phase 1 and is ready for a later Vercel Hobby deployment.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local JSON training data
- Browser `localStorage` behind repository interfaces
- Web manifest and mobile metadata

## Run Locally

Prerequisite: Node.js 20.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To verify a production build:

```bash
npm run build
npm start
```

## Main Screens

- `/today`: today's workout, focus, phase, cues, and session start
- `/session/[id]`: live one-drill-at-a-time training mode with autosave
- `/dashboard`: weekly plan, readiness, completion, and recent logs
- `/kpis`: six KPI test forms with attempts and best result summaries
- `/exports`: structured placeholders for future PDF and Excel exports

## Training Data

All mock training content lives in `/data`:

- `workouts.json`
- `drills.json`
- `kpis.json`
- `hockeyIq.json`
- `phases.json`
- `campRules.json`
- `parentCues.json`
- `videos.json`

Pages and components load training content through `lib/trainingData.ts`. Replace or expand these JSON files later without hardcoding the professional training library into UI components. Keep IDs stable when records reference each other.

## Local Storage

Active sessions, completed session logs, and KPI results save in the browser. UI components call repository APIs rather than using `localStorage` directly:

- `lib/storage/sessionRepository.ts`
- `lib/storage/localSessionRepository.ts`
- `lib/storage/kpiRepository.ts`
- `lib/storage/localKpiRepository.ts`

This boundary allows a future Supabase repository to replace the local implementation without rewriting page components. Phase 1 data remains on the device and browser where it was entered.

## PWA and Vercel

The app includes mobile viewport metadata, Apple web-app metadata, theme colors, and a generated web manifest. It is web-first and does not require Xcode, native iOS tooling, or App Store deployment.

To deploy later:

1. Push the project to a Git provider.
2. Import it into Vercel.
3. Accept the detected Next.js defaults.
4. Deploy with no environment variables or backend services.

The project fits Vercel Hobby hosting for Phase 1. More install polish, icons, and offline caching can be added in a later PWA pass.

## Phase 1 Scope

- Responsive iPhone training mode and iPad/desktop parent views
- Today plan and session map
- Interactive live session mode with drill completion details
- Timers and local autosave after every session action
- Readiness and end-of-session reflection
- Six KPI entry forms with multiple attempts and best-result calculation
- Parent dashboard and local session history
- Export center placeholders
- Mock JSON data and replaceable repository architecture

## Planned Future Phases

- Replace mock data with the full Maddox training library
- Add real Excel export
- Add real PDF printouts
- Add Supabase sync so iPhone, iPad, and desktop share the same data
- Add parent authentication
- Add long-term KPI trend charts
- Add hockey IQ video library
- Add iPhone/iPad PWA install polish and offline support
- Consider Expo/App Store later only if needed
