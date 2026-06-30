"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DrillCard } from "@/components/DrillCard";
import { ReadinessCheck } from "@/components/ReadinessCheck";
import { ReflectionForm } from "@/components/ReflectionForm";
import { SessionKPIForm } from "@/components/SessionKPIForm";
import { SessionProgress } from "@/components/SessionProgress";
import { SessionSummary } from "@/components/SessionSummary";
import { getV84SessionById, getV84SessionWorkout, getV84VideoForDrillId } from "@/lib/imports/v8_4/session";
import { KPI_RESULT_ENTRY_COPY, KPI_RESULT_ENTRY_HREF, activityToDrill, projectDayPresentationContext, projectPlannedDayActivities, remainingPlannedMinutesFromStep, type ActivityPresentation } from "@/lib/projections/activityPresentation";
import { getWorkout, getWorkoutDrills, kpis as allKpis } from "@/lib/trainingData";
import { loadCloudSessionById, loadCloudSessionsByWorkoutId, saveCloudSessionProgress } from "@/lib/storage/cloudSessionProgressRepository";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { saveCompletedSession } from "@/lib/storage/completedSessionRepository";
import { SessionStorageDiagnostics } from "@/lib/storage/sessionRepository";
import { ExerciseCompletion, SessionLog } from "@/lib/types";

type PageMode = "loading" | "live" | "choice" | "view" | "error";
type InitDiagnostics = {
  currentStage: string;
  routeId: string;
  workoutId: string;
  workoutFound: boolean;
  localStorageTestResult: string;
  repositoryResult: string;
  sessionFound: boolean;
  newSessionAttempted: boolean;
  exactError: string;
  errorStack: string;
  userAgent: string;
  repository: SessionStorageDiagnostics;
};

const isDevelopment = process.env.NODE_ENV === "development";
const emptyRepositoryDiagnostics: SessionStorageDiagnostics = {
  storageReadable: false,
  storageWritable: false,
  jsonParsed: false,
  keysFound: [],
  sessionCount: 0,
  backupKey: null,
  lastError: "",
};

function debug(step: string, details?: unknown) {
  if (isDevelopment) console.info(`[SessionPage] ${step}`, details ?? "");
}

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const routeId = typeof params?.id === "string" ? params.id : "";
  const v84Session = getV84SessionById(routeId);
  const legacyWorkout = getWorkout(routeId);
  const workout = useMemo(() => v84Session ? getV84SessionWorkout(routeId) : legacyWorkout, [routeId, v84Session, legacyWorkout]);
  const dayContext = useMemo(() => v84Session ? projectDayPresentationContext(v84Session.date) : null, [v84Session]);
  const plannedActivities = useMemo(() => v84Session ? projectPlannedDayActivities(v84Session.date) : [], [v84Session]);
  const drills = useMemo(() => v84Session ? plannedActivities.map(activityToDrill) : workout ? getWorkoutDrills(workout) : [], [v84Session, plannedActivities, workout]);
  const workoutKpis = useMemo(() => v84Session ? [] : workout ? workout.kpiTestIds.map((id) => allKpis.find((kpi) => kpi.id === id)).filter((kpi): kpi is (typeof allKpis)[number] => Boolean(kpi)) : [], [v84Session, workout]);
  const [session, setSession] = useState<SessionLog | null>(null);
  const [completedSessions, setCompletedSessions] = useState<SessionLog[]>([]);
  const [mode, setMode] = useState<PageMode>("loading");
  const [error, setError] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("Ready");
  const [cloudWarning, setCloudWarning] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [diagnostics, setDiagnostics] = useState<InitDiagnostics>({
    currentStage: "Component render",
    routeId,
    workoutId: workout?.id || "",
    workoutFound: Boolean(workout),
    localStorageTestResult: "Not tested",
    repositoryResult: "Not called",
    sessionFound: false,
    newSessionAttempted: false,
    exactError: "",
    errorStack: "",
    userAgent: "",
    repository: emptyRepositoryDiagnostics,
  });

  const captureDiagnostics = useCallback((patch: Partial<InitDiagnostics> = {}) => {
    setDiagnostics((current) => ({
      ...current,
      routeId,
      workoutId: workout?.id || "",
      workoutFound: Boolean(workout),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      repository: localSessionRepository.getDiagnostics(),
      ...patch,
    }));
  }, [routeId, workout]);

  const fail = useCallback((reason: unknown) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack || "" : "";
    debug("final render state", { mode: "error", message });
    setError(message);
    captureDiagnostics({ exactError: message, errorStack: stack });
    setMode("error");
  }, [captureDiagnostics]);

  const hydrateExercises = useCallback((next: SessionLog) => {
    const exercises: Record<string, ExerciseCompletion> = { ...next.exercises };
    let changed = false;
    for (const drill of drills) {
      if (!exercises[drill.id]) {
        exercises[drill.id] = { drillId: drill.id, done: false, actualSets: null, actualReps: null, actualDuration: null, actualDistance: null, notes: "", difficulty: null };
        changed = true;
      }
    }
    return changed ? { ...next, exercises } : next;
  }, [drills]);

  const saveCloudProgress = useCallback(async (next: SessionLog) => {
    const result = await saveCloudSessionProgress(next);
    setCloudWarning(result.warning);
    if (result.warning) {
      debug("cloud progress save warning", result.warning);
    }
    return result;
  }, []);

  const initialize = useCallback(async () => {
    try {
      captureDiagnostics({ currentStage: "Route and workout lookup" });
      debug("route id received", routeId);
      debug("workout lookup result", { found: Boolean(workout), workoutId: workout?.id });
      captureDiagnostics({ sessionFound: false, newSessionAttempted: false, exactError: "", errorStack: "" });
      if (!workout) throw new Error("Workout not found");

      captureDiagnostics({ currentStage: "Direct localStorage test" });
      let localStorageTestResult = "Success";
      try {
        const testKey = "maddox-training-os:session-page-test";
        window.localStorage.setItem(testKey, "ok");
        if (window.localStorage.getItem(testKey) !== "ok") localStorageTestResult = "Read-back mismatch";
        window.localStorage.removeItem(testKey);
      } catch (reason) {
        localStorageTestResult = `Failed: ${reason instanceof Error ? reason.message : String(reason)}`;
      }
      captureDiagnostics({ localStorageTestResult });

      captureDiagnostics({ currentStage: "Reading URL query" });
      const query = new URLSearchParams(window.location.search);
      const requestedSession = query.get("sessionId");
      const requestedMode = query.get("mode");
      if (requestedSession) {
        captureDiagnostics({ currentStage: "Cloud session_progress getSessionById" });
        debug("cloud progress read start", { requestedSession });
        const cloudResult = await loadCloudSessionById(requestedSession);
        setCloudWarning(cloudResult.warning);
        if (cloudResult.data) localSessionRepository.updateSession(cloudResult.data);
        captureDiagnostics({ repositoryResult: `cloud getSessionById completed; found=${Boolean(cloudResult.data)}` });

        captureDiagnostics({ currentStage: "Repository getSessionById fallback" });
        debug("repository read start", { requestedSession });
        const found = cloudResult.data || localSessionRepository.getSessionById(requestedSession);
        debug("repository read end", localSessionRepository.getDiagnostics());
        captureDiagnostics({ repositoryResult: `getSessionById completed; found=${Boolean(found)}; source=${cloudResult.data ? "cloud" : "local"}` });
        if (!found || found.workoutId !== workout.id) throw new Error("Session not found");
        captureDiagnostics({ sessionFound: true });
        if (requestedMode === "reopen") {
          const reopened = { ...found, status: "reopened" as const, completedAt: null };
          const hydrated = hydrateExercises(reopened);
          localSessionRepository.updateSession(hydrated);
          void saveCloudProgress(hydrated);
          setSession(hydrated);
          setMode("live");
          debug("final render state", { mode: "live", sessionId: hydrated.id });
          return;
        }
        const hydrated = hydrateExercises(found);
        localSessionRepository.updateSession(hydrated);
        setSession(hydrated);
        const finalMode = requestedMode === "view" || found.status === "completed" ? "view" : "live";
        setMode(finalMode);
        debug("final render state", { mode: finalMode, sessionId: hydrated.id });
        return;
      }

      debug("cloud progress read start", { workoutId: workout.id });
      captureDiagnostics({ currentStage: "Cloud session_progress getSessionsByWorkoutId" });
      const cloudSessionsResult = await loadCloudSessionsByWorkoutId(workout.id);
      setCloudWarning(cloudSessionsResult.warning);
      cloudSessionsResult.data.forEach((item) => localSessionRepository.updateSession(item));
      captureDiagnostics({ repositoryResult: `cloud getSessionsByWorkoutId completed; count=${cloudSessionsResult.data.length}` });

      debug("repository read start", { workoutId: workout.id });
      captureDiagnostics({ currentStage: "Repository getSessionsByWorkoutId fallback" });
      const sessions = cloudSessionsResult.data.length ? cloudSessionsResult.data : localSessionRepository.getSessionsByWorkoutId(workout.id);
      debug("repository read end", localSessionRepository.getDiagnostics());
      captureDiagnostics({ repositoryResult: `getSessionsByWorkoutId completed; count=${sessions.length}; source=${cloudSessionsResult.data.length ? "cloud" : "local"}` });
      const resumable = sessions.find((item) => item.status === "in-progress" || item.status === "reopened");
      if (resumable) {
        captureDiagnostics({ sessionFound: true });
        const hydrated = hydrateExercises(resumable);
        localSessionRepository.updateSession(hydrated);
        setSession(hydrated);
        setMode("live");
        debug("final render state", { mode: "live", sessionId: hydrated.id });
        return;
      }

      const completed = sessions.filter((item) => item.status === "completed");
      if (completed.length > 0) {
        captureDiagnostics({ sessionFound: true });
        const hydrated = completed.map(hydrateExercises);
        hydrated.forEach((item) => localSessionRepository.updateSession(item));
        setCompletedSessions(hydrated);
        setSession(hydrated[0]);
        setMode("choice");
        debug("final render state", { mode: "choice", sessionId: hydrated[0].id });
        return;
      }

      captureDiagnostics({ newSessionAttempted: true });
      captureDiagnostics({ currentStage: "Creating and saving new session" });
      debug("session creation start", { workoutId: workout.id });
      const created = hydrateExercises(localSessionRepository.createSessionFromWorkout(workout));
      localSessionRepository.updateSession(created);
      void saveCloudProgress(created);
      debug("session creation end", { sessionId: created.id, repository: localSessionRepository.getDiagnostics() });
      setSession(created);
      setMode("live");
      captureDiagnostics({ newSessionAttempted: true });
      debug("final render state", { mode: "live", sessionId: created.id });
    } catch (reason) {
      fail(reason);
    }
  }, [captureDiagnostics, fail, hydrateExercises, routeId, saveCloudProgress, workout]);

  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      setMode((current) => {
        if (current !== "loading") return current;
        const reason = new Error("Session initialization timed out before reaching a usable state.");
        setError(reason.message);
        captureDiagnostics({ exactError: reason.message, errorStack: reason.stack || "" });
        debug("final render state", { mode: "error", message: reason.message });
        return "error";
      });
    }, 4000);
    initialize();
    return () => window.clearTimeout(watchdog);
  }, [initialize]);

  function update(next: SessionLog) {
    setSession(next);
    localSessionRepository.updateSession(next);
    setSaveFeedback("Saved just now");
    void saveCloudProgress(next).then((result) => {
      if (result.warning) setSaveFeedback("Local saved; cloud sync pending");
    });
    window.setTimeout(() => setSaveFeedback("Autosave on"), 1200);
  }

  function setSessionUrl(next: SessionLog, nextMode: "resume" | "view") {
    try {
      window.history.replaceState(null, "", `/session/${next.workoutId}?sessionId=${encodeURIComponent(next.id)}&mode=${nextMode}`);
    } catch (reason) {
      debug("history URL update skipped", reason instanceof Error ? reason.message : String(reason));
    }
  }

  function startFresh() {
    if (!workout) return;
    try {
      captureDiagnostics({ newSessionAttempted: true });
      debug("session creation start", { workoutId: workout.id, bypassLookup: true });
      const fresh = hydrateExercises(localSessionRepository.createSessionFromWorkout(workout));
      localSessionRepository.updateSession(fresh);
      void saveCloudProgress(fresh);
      debug("session creation end", { sessionId: fresh.id, repository: localSessionRepository.getDiagnostics() });
      setSession(fresh);
      setSessionUrl(fresh, "resume");
      setMode("live");
      captureDiagnostics({ newSessionAttempted: true });
    } catch (reason) {
      fail(reason);
    }
  }

  function clearLocalData() {
    if (!window.confirm("Clear all local session logs and KPI results from this browser? This cannot be undone.")) return;
    localSessionRepository.clearAll();
    localKpiRepository.clearAll();
    setSession(null);
    captureDiagnostics({ sessionFound: false });
    initialize();
  }

  async function copyDebugInfo() {
    const text = JSON.stringify(diagnostics, null, 2);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (reason) {
      fail(new Error(`Unable to copy debug info: ${reason instanceof Error ? reason.message : String(reason)}`));
    }
  }

  function reopen(target = session) {
    if (!target) return;
    const reopened = localSessionRepository.reopenSession(target.id);
    if (!reopened) {
      setError("Unable to reopen this session");
      setMode("error");
      return;
    }
    const hydrated = hydrateExercises(reopened);
    localSessionRepository.updateSession(hydrated);
    void saveCloudProgress(hydrated);
    setSession(hydrated);
    setSessionUrl(hydrated, "resume");
    setMode("live");
  }

  function view(target = session) {
    if (!target) return;
    const hydrated = hydrateExercises(target);
    localSessionRepository.updateSession(hydrated);
    setSession(hydrated);
    setSessionUrl(hydrated, "view");
    setMode("view");
  }

  if (mode === "error" || !workout) {
    return <div className="mx-auto max-w-3xl space-y-5"><div className="card"><h1 className="text-3xl font-black">{error || "Workout not found"}</h1><p className="mt-3 text-slate-600">Session initialization did not reach a usable state. Use the recovery actions below.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button className="btn-primary" onClick={initialize}>Try Again</button><Link className="btn-primary" href={`/debug/session/${routeId}`}>Open Debug Page</Link><button className="btn-secondary" onClick={clearLocalData}>Clear Local Training Data</button>{workout && <button className="btn-secondary" onClick={startFresh}>Start Fresh Attempt From Workout</button>}<button className="btn-secondary" onClick={copyDebugInfo}>Copy Debug Info</button><Link className="btn-secondary" href="/today">Back to Today</Link><Link className="btn-secondary" href="/dashboard">Back to Dashboard</Link></div></div><article className="card"><p className="label">Session diagnostics</p><dl className="grid gap-2 text-sm sm:grid-cols-2"><dt className="font-bold">Current stage</dt><dd className="break-all">{diagnostics.currentStage}</dd><dt className="font-bold">Route id</dt><dd className="break-all">{diagnostics.routeId || "Unavailable"}</dd><dt className="font-bold">Workout id</dt><dd className="break-all">{diagnostics.workoutId || "None"}</dd><dt className="font-bold">Matching workout found</dt><dd>{String(diagnostics.workoutFound)}</dd><dt className="font-bold">Direct localStorage test</dt><dd className="break-all">{diagnostics.localStorageTestResult}</dd><dt className="font-bold">Repository result</dt><dd className="break-all">{diagnostics.repositoryResult}</dd><dt className="font-bold">Local storage readable</dt><dd>{String(diagnostics.repository.storageReadable)}</dd><dt className="font-bold">Local storage writable</dt><dd>{String(diagnostics.repository.storageWritable)}</dd><dt className="font-bold">Local storage JSON parsed</dt><dd>{String(diagnostics.repository.jsonParsed)}</dd><dt className="font-bold">Session found</dt><dd>{String(diagnostics.sessionFound)}</dd><dt className="font-bold">New session attempted</dt><dd>{String(diagnostics.newSessionAttempted)}</dd><dt className="font-bold">Local storage keys</dt><dd className="break-all">{diagnostics.repository.keysFound.join(", ") || "None"}</dd><dt className="font-bold">Corrupt data backup</dt><dd className="break-all">{diagnostics.repository.backupKey || "None"}</dd><dt className="font-bold">Exact error</dt><dd className="break-all">{diagnostics.exactError || diagnostics.repository.lastError || "None recorded"}</dd>{isDevelopment && <><dt className="font-bold">Exact error stack</dt><dd className="whitespace-pre-wrap break-all">{diagnostics.errorStack || "None"}</dd><dt className="font-bold">User agent</dt><dd className="break-all">{diagnostics.userAgent || "Unavailable"}</dd></>}</dl></article></div>;
  }

  if (mode === "loading") {
    return <div className="card mx-auto max-w-2xl"><h1 className="text-2xl font-black">Loading session…</h1><p className="mt-2 text-slate-500">Checking saved training data on this device. Current stage: {diagnostics.currentStage}</p><div className="mt-5 flex flex-wrap gap-3"><button className="btn-secondary" onClick={initialize}>Try Again</button><Link className="btn-primary" href={`/debug/session/${routeId}`}>Open Hard Debug Page</Link></div></div>;
  }

  if (mode === "choice" && session) {
    return (
      <div className="card mx-auto max-w-2xl">
        <p className="label">Previous attempt found</p>
        <h1 className="text-3xl font-black">You already completed this workout.</h1>
        <p className="mt-3 text-slate-600">Latest completion: {session.completedAt ? new Date(session.completedAt).toLocaleString() : session.date}. Choose what to do next.</p>
        <div className="mt-6 grid gap-3">
          <button className="btn-primary" onClick={() => view()}>View Latest Completed Session</button>
          <button className="btn-secondary" onClick={() => reopen()}>Reopen / Edit Latest Completed Session</button>
          <button className="btn-secondary" onClick={startFresh}>Start Fresh Attempt</button>
          <Link className="btn-secondary" href="/today">Back to Today</Link>
        </div>
        {completedSessions.length > 1 && <p className="mt-5 text-sm text-slate-500">{completedSessions.length} completed attempts are available in Session History.</p>}
      </div>
    );
  }

  if (mode === "view" && session) {
    const displayTitle = dayContext?.heroTitle.trim() || workout.dayFocus;
    return <SessionSummary workout={workout} session={session} drills={drills} kpis={workoutKpis} displayTitle={displayTitle} onReopen={() => reopen()} onFresh={startFresh} />;
  }

  if (!session) {
    return <div className="card mx-auto max-w-2xl"><h1 className="text-2xl font-black">Unable to load session</h1><p className="mt-2 text-slate-500">No usable session was created.</p><button className="btn-primary mt-5" onClick={startFresh}>Start Fresh Attempt</button></div>;
  }

  const totalSteps = v84Session ? Math.max(plannedActivities.length, 1) : drills.length + workoutKpis.length + 2;
  const step = Math.max(0, Math.min(session.currentStep, totalSteps - 1));
  const activeActivity = v84Session ? plannedActivities[step] : null;
  const isV84KpiActivity = Boolean(v84Session && activeActivity?.category === "kpi");
  const drill = v84Session ? activeActivity && !isReadinessActivity(activeActivity) && activeActivity.category !== "reflection" && activeActivity.category !== "kpi" ? drills[step] : null : step > 0 && step <= drills.length ? drills[step - 1] : null;
  const kpiIndex = v84Session ? -1 : step - drills.length - 1;
  const kpi = !v84Session && kpiIndex >= 0 && kpiIndex < workoutKpis.length ? workoutKpis[kpiIndex] : null;
  const isReadiness = v84Session ? Boolean(activeActivity && isReadinessActivity(activeActivity)) : step === 0;
  const isReflection = v84Session ? activeActivity?.category === "reflection" : step === totalSteps - 1;
  const remainingLabel = v84Session
    ? v84RemainingLabel(plannedActivities, step)
    : `About ${Math.max(0, Math.ceil(workout.totalEstimatedMinutes * (totalSteps - step - 1) / totalSteps))} min remaining`;

  function move(nextStep: number) {
    update({ ...session!, currentStep: Math.max(0, Math.min(totalSteps - 1, nextStep)) });
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  async function complete() {
    if (isCompleting) return;
    if (!window.confirm("Finish and submit this training session? You can reopen it later if needed.")) return;
    setIsCompleting(true);
    const completed = { ...session!, status: "completed" as const, completedAt: new Date().toISOString() };
    Object.values(completed.kpiResults).forEach((result) => localKpiRepository.save({ ...result, enteredAt: result.enteredAt || new Date().toISOString() }));
    update(completed);
    setSaveFeedback("Saving completed session...");
    try {
      const progressResult = await saveCloudProgress(completed);
      const result = await saveCompletedSession(completed, workout!);
      setSaveFeedback(result.mode === "cloud" && !progressResult.warning ? "Cloud Synced" : "Local Backup Mode");
    } catch (reason) {
      console.error("Completed session cloud save failed; local backup retained.", reason);
      setSaveFeedback("Local backup saved; cloud sync failed");
    }
    setSessionUrl(completed, "view");
    setMode("view");
    setIsCompleting(false);
  }

  return (
    <div className="mx-auto max-w-4xl">
      {diagnostics.repository.lastError && <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Browser storage warning: {diagnostics.repository.lastError}. This session can continue in memory, but autosave may be unavailable.</div>}
      {cloudWarning && <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{cloudWarning} Local autosave is still active.</div>}
      <div className="card mb-5 bg-navy text-white">
        <p className="label text-lime">{dayContext?.eyebrow || workout.sessionType}</p>
        <h1 className="text-3xl font-black">{dayContext?.heroTitle || workout.dayFocus}</h1>
        <div className="mt-4"><SessionProgress current={step + 1} total={totalSteps} /></div>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm font-bold text-slate-200"><span>{v84Session ? activeActivity?.athleteTitle || `Step ${step + 1}` : drill ? `Drill ${step} of ${drills.length}` : kpi ? `KPI test ${kpiIndex + 1} of ${workoutKpis.length}` : isReflection ? "Final reflection" : "Readiness check"}</span><span>{remainingLabel}</span><span>{saveFeedback}</span></div>
      </div>
      {isReadiness && <ReadinessCheck value={session.readiness} onChange={(readiness) => update({ ...session!, readiness })} />}
      {isV84KpiActivity && activeActivity && (
        <KpiChecklistStep
          activity={activeActivity}
          completion={session.exercises[activeActivity.id] || emptyExerciseCompletion(activeActivity.id)}
          onChange={(completion) => update({ ...session!, exercises: { ...session!.exercises, [activeActivity.id]: completion } })}
        />
      )}
      {drill && <DrillCard drill={drill} completion={session.exercises[drill.id] || emptyExerciseCompletion(drill.id)} presentationChildren={plannedActivities.find((activity) => activity.id === drill.id)?.children} videoState={v84Session ? getV84VideoForDrillId(drill.id) : null} onChange={(completion) => update({ ...session!, exercises: { ...session!.exercises, [drill.id]: completion } })} />}
      {kpi && <SessionKPIForm kpi={kpi} result={session.kpiResults[kpi.id]} onChange={(result) => update({ ...session!, kpiResults: { ...session!.kpiResults, [kpi.id]: result } })} />}
      {isReflection && <ReflectionForm value={session.reflection} onChange={(reflection) => update({ ...session!, reflection })} />}
      <div className="sticky bottom-16 mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-ice/95 py-3 backdrop-blur sm:bottom-0">
        <button className="btn-secondary min-h-16 text-base" disabled={step === 0} onClick={() => move(step - 1)}>{drill ? "Previous Drill" : "Back"}</button>
        {isReflection ? <button className="btn-primary min-h-16 text-lg" disabled={isCompleting} onClick={complete}>{isCompleting ? "Saving..." : "Finish Session"}</button> : <button className="btn-primary min-h-16 text-lg" onClick={() => move(step + 1)}>{drill ? "Next Drill" : "Continue"}</button>}
      </div>
    </div>
  );
}

function KpiChecklistStep({ activity, completion, onChange }: { activity: ActivityPresentation; completion: ExerciseCompletion; onChange: (next: ExerciseCompletion) => void }) {
  return (
    <article className={`card border-2 transition ${completion.done ? "border-lime bg-lime/10" : "border-cyan-200 bg-cyan-50"}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-blue">KPI checklist</span>
          <h2 className="mt-3 text-3xl font-black leading-tight">{activity.athleteTitle}</h2>
          <p className="mt-2 text-lg font-semibold text-slate-700">{KPI_RESULT_ENTRY_COPY}</p>
        </div>
        {completion.done && <span className="rounded-full bg-lime px-3 py-1 text-sm font-black">DONE</span>}
      </div>
      <div className="rounded-2xl bg-white p-4">
        <p className="font-semibold text-slate-700">{activity.instruction}</p>
        {activity.coachingCue && <p className="mt-2 text-sm font-bold text-slate-600">{activity.coachingCue}</p>}
        <Link className="btn-primary mt-4" href={KPI_RESULT_ENTRY_HREF}>Open KPI Page</Link>
      </div>
      <button
        className={`mt-5 min-h-20 w-full rounded-2xl text-xl font-black ${completion.done ? "bg-lime text-navy" : "bg-blue text-white"}`}
        onClick={() => onChange({ ...completion, done: !completion.done })}
      >
        {completion.done ? "Checklist Step Done" : "Mark Checklist Step Done"}
      </button>
    </article>
  );
}

function emptyExerciseCompletion(drillId: string) {
  return { drillId, done: false, actualSets: null, actualReps: null, actualDuration: null, actualDistance: null, notes: "", difficulty: null };
}

function isReadinessActivity(activity: { athleteTitle: string; category: string }) {
  return activity.athleteTitle.toLowerCase().includes("readiness");
}

function v84RemainingLabel(activities: ReturnType<typeof projectPlannedDayActivities>, step: number) {
  const remainingMinutes = remainingPlannedMinutesFromStep(activities, step);
  return typeof remainingMinutes === "number" ? `About ${remainingMinutes} min remaining` : "Planned time shown per step";
}
