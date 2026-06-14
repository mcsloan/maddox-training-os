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

## iPhone/iPad Testing

Use production mode for iPhone and iPad testing. Do not rely on Next dev/Turbopack mode for iOS validation.

Run the production build and LAN server:

```bash
npm run build
npx next start --hostname 0.0.0.0 --port 3000
```

Or use the combined command:

```bash
npm run ios:test
```

Keep Terminal running while testing. Find the Mac Wi-Fi IP address:

```bash
ipconfig getifaddr en0
```

On the iPhone or iPad, open:

```text
http://YOUR-MAC-IP:3000/today
```

Phase 1 local storage is separate for each browser and device. Sessions created in Mac Chrome, iPhone Safari, iPhone Chrome, or iPad Safari do not sync with each other.

Local and Vercel production builds use the production build path. The project currently uses `next build --webpack` for build stability, and this is compatible with Vercel. Validate iPhone/iPad behavior with `npm run ios:test` or the deployed Vercel URL, not Next dev/Turbopack mode.

## GitHub Setup

Check the current repository and configured remotes:

```bash
git status
git remote -v
```

Add a GitHub repository and push the current `master` branch:

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin master
```

If using `main` instead of `master`:

```bash
git branch -M main
git push -u origin main
```

## Deploying to Vercel

Phase 1 is ready for the Vercel Hobby/free plan and requires no paid services.

1. Create or use a GitHub repository and push this project.
2. Sign in to Vercel and import the GitHub repository.
3. Confirm Vercel detects the framework as Next.js.
4. Use `npm run build` as the build command.
5. Use Vercel's default output and deployment settings for Next.js.
6. Do not add environment variables for Phase 1.
7. Deploy, then open the generated Vercel URL on iPhone and iPad.
8. In Safari, use **Share → Add to Home Screen**.

The optional `npm run vercel:build` script runs the same production build command. No Vercel CLI setup is required.

## Important: Phase 1 Data Storage

Phase 1 stores session logs and KPI entries in browser-local storage on the device where they are entered.

- Data entered on Maddox's iPhone will not automatically appear on a parent iPad or desktop.
- Data entered in Safari will not automatically appear in Chrome.
- This separation is expected in Phase 1.
- Cross-device and cross-browser sync will come later through Supabase or another backend.
- Clearing browser/site data removes the Phase 1 training logs stored in that browser.

## Add to Home Screen

After deploying to Vercel:

1. Open the Vercel URL in Safari on iPhone or iPad.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Launch Maddox Training OS from the new Home Screen icon.

The app uses its manifest, theme color, standalone display mode, `/today` start URL, and current basic icon. It opens like a standalone web app, but Phase 1 data remains browser-local on that device.

## Deployment Checklist

Before deploying:

- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Confirm `git status` is clean
- [ ] Push the repository to GitHub
- [ ] Import the repository into Vercel
- [ ] Test the Vercel URL on iPhone and iPad
- [ ] Test Today, Start Session, KPIs, History, Dashboard, and Exports

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

## PWA Structure

The app includes mobile viewport metadata, Apple web-app metadata, theme colors, and a generated web manifest. It is web-first and does not require Xcode, native iOS tooling, or App Store deployment.

More install polish, platform-specific icons, and offline caching can be added in a later PWA pass.

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

## Prompt 2 Usability Upgrade

- Rich live-session drill instructions, progress, estimated remaining time, save feedback, and completion confirmation
- Eight detailed mock hockey/off-ice drills with video and QR-ready links
- KPI history with trend labels, attempts, editing, and deletion
- Session history with completion percentages, reflections, KPI summaries, reopen, fresh-attempt, and deletion actions
- Parent dashboard with weekly summary, readiness/reflection review, KPI summaries, attention flags, and quick links
- Export previews and clearer current-device storage warnings

For iPhone/iPad validation, run `npm run ios:test`. Next dev mode is not the validation path for iOS.

### Manual iPhone/iPad Test Checklist

1. Confirm Today loads.
2. Start a session.
3. Complete a drill and confirm save feedback.
4. Enter a KPI result.
5. Finish the reflection and session.
6. View the completed attempt in History.
7. Reopen the completed session.
8. Start a fresh attempt.
9. Confirm KPI trends show saved history.

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
