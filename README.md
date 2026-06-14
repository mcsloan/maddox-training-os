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

## Browser Compatibility

Maddox Training OS uses Next.js 16. Supported targets are current Chrome/Edge/Firefox, Safari 16.4+, and iPhone/iPad browsers on iOS/iPadOS 16.4+.

Safari 15.6.1 on old macOS Catalina is not a valid Next.js 16 test target. It may render server HTML and plain JavaScript while failing to hydrate React controls. Use Chrome on that Mac instead.

iOS Chrome uses Apple WebKit and follows the installed iOS version. Updating the Chrome app alone does not provide a newer browser engine. See `/compatibility` for recommended test devices and browsers.

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
- `/history`: all local session attempts with view, resume, reopen, and fresh-attempt actions
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

### Browser and Device Storage

Phase 1 storage is browser-local. Mac Chrome, Mac Safari, iPhone Safari, and iPhone Chrome each maintain separate local storage. A session completed in one browser or device will not appear in another until shared Supabase sync is added in a future phase.

Completed workouts can have multiple session attempts. Opening a completed workout offers options to view the latest attempt, reopen it for editing, or start fresh. The Export Center also contains a confirmed **Clear Local Training Data** developer tool for Phase 1 testing.

### Safari and iOS Regression Checklist

iPhone Chrome uses Apple WebKit, so test it like Safari rather than desktop Chrome.

1. Open `/today` and start the workout with empty browser storage.
2. Refresh during a live session and confirm it resumes.
3. Complete the session and confirm the completed-session choices appear.
4. View the completed summary, reopen it, and start a fresh attempt.
5. Repeat in Mac Safari, iPhone Safari, iPhone Chrome, and iPad Safari.

If session initialization fails, the recovery screen displays browser and storage diagnostics. Use **Copy Debug Info** and include the copied report with the browser and device details. **Clear Local Training Data** is available on the recovery screen and in the Export Center; it only clears sessions and KPI results in the current browser.

For hard diagnostics, open `/debug/session/[workoutId]` or use **Debug Today's Session** in the Export Center. The debug route does not reuse the normal session UI. It tests route parameters, imported workout/drill/KPI data, browser storage, repository reads, dry-run session creation, saving, read-back, and final render eligibility as independent on-screen steps.

### Safari/WebKit Hydration Diagnostics

Test these routes in order:

1. `/debug/plain-js`
   - Uses server-rendered HTML and inline vanilla JavaScript without React state.
   - If its button does nothing, client JavaScript is not executing or inline scripts are blocked.
2. `/debug/react-hydration`
   - Uses only a tiny React client component.
   - If plain JavaScript works but this remains `server/default` or its button does nothing, React/Next hydration or the client bundle is failing.
3. `/debug/session-minimal/foundation-control-a`
   - Uses a tiny client component plus the app's workout, drill, and KPI imports.
   - If React hydration works but this fails, the problem is likely in training-data imports, session construction, or browser storage.
4. `/debug/session/foundation-control-a`
   - Runs the detailed repository and session prerequisite tests.
5. `/session/foundation-control-a`
   - Runs the full live-session route.

In development, the global client error probe displays uncaught client errors and unhandled promise rejections in a red fixed box with a **Copy Error** button.

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
