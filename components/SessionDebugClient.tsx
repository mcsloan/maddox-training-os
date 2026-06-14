"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { drills, kpis, workouts } from "@/lib/trainingData";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { SessionLog, Workout } from "@/lib/types";

type StepStatus = "SUCCESS" | "FAILURE" | "TIMEOUT";
type RunStatus = "Ready" | "Running" | "Completed all steps" | "Completed with failures" | "Stopped by user" | "Timed out during one or more steps";
type DebugStepResult = {
  name: string;
  status: StepStatus;
  timestamp: string;
  durationMs: number;
  value?: unknown;
  error?: string;
  stack?: string;
};
type StepContext = { routeId: string };
type StepDefinition = { name: string; run: (context: StepContext) => unknown | Promise<unknown> };

const STEP_TIMEOUT_MS = 1500;
const isDevelopment = process.env.NODE_ENV === "development";

function message(reason: unknown) {
  return reason instanceof Error ? reason.message : String(reason);
}

function errorStack(reason: unknown) {
  return isDevelopment && reason instanceof Error ? reason.stack || "" : "";
}

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function findWorkout(routeId: string): Workout {
  const workout = workouts.find((item) => item.id === routeId);
  if (!workout) throw new Error(`Workout not found for route id "${routeId}".`);
  return workout;
}

function validSession(session: SessionLog | null) {
  return Boolean(session?.id && session.workoutId && session.startedAt && session.status && session.readiness && session.exercises && session.kpiResults && session.reflection);
}

function routeParamStep({ routeId }: StepContext) {
  if (!routeId) throw new Error("Route id is empty.");
  return { routeId };
}

function browserClientStep() {
  return { clientSide: typeof window !== "undefined", userAgent: navigator.userAgent, currentUrl: window.location.href };
}

function workoutImportStep({ routeId }: StepContext) {
  const match = workouts.find((item) => item.id === routeId);
  if (!match) throw new Error(`No workout matches "${routeId}".`);
  return { workoutCount: workouts.length, workoutIds: workouts.map((item) => item.id), routeMatch: match.id };
}

function drillImportStep({ routeId }: StepContext) {
  const workout = findWorkout(routeId);
  const requestedIds = workout.warmupDrillIds.concat(workout.mainDrillIds);
  const resolvedIds = requestedIds.filter((id) => drills.some((drill) => drill.id === id));
  const unresolvedIds = requestedIds.filter((id) => resolvedIds.indexOf(id) === -1);
  if (unresolvedIds.length) throw new Error(`Unresolved drill ids: ${unresolvedIds.join(", ")}`);
  return { drillCount: drills.length, requestedIds, resolvedIds, unresolvedIds };
}

function kpiImportStep({ routeId }: StepContext) {
  const workout = findWorkout(routeId);
  const requestedIds = workout.kpiTestIds;
  const resolvedIds = requestedIds.filter((id) => kpis.some((kpi) => kpi.id === id));
  const unresolvedIds = requestedIds.filter((id) => resolvedIds.indexOf(id) === -1);
  if (unresolvedIds.length) throw new Error(`Unresolved KPI ids: ${unresolvedIds.join(", ")}`);
  return { kpiCount: kpis.length, requestedIds, resolvedIds, unresolvedIds };
}

function localStorageStep() {
  const key = `maddox-training-os:debug:${Date.now()}`;
  const expected = "storage-test";
  window.localStorage.setItem(key, expected);
  const actual = window.localStorage.getItem(key);
  window.localStorage.removeItem(key);
  const removed = window.localStorage.getItem(key) === null;
  if (actual !== expected || !removed) throw new Error(`localStorage round trip failed. Read="${actual}", removed=${removed}.`);
  return { setItem: true, getItem: actual, removeItem: removed };
}

function repositoryListStep() {
  const sessions = localSessionRepository.listAllSessions();
  return { count: sessions.length, diagnostics: localSessionRepository.getDiagnostics() };
}

function repositoryWorkoutStep({ routeId }: StepContext) {
  const sessions = localSessionRepository.getSessionsByWorkoutId(routeId);
  return { routeId, count: sessions.length, sessionIds: sessions.map((session) => session.id), diagnostics: localSessionRepository.getDiagnostics() };
}

function createDraftStep({ routeId }: StepContext) {
  const draft = localSessionRepository.createSessionDraft(findWorkout(routeId));
  if (!validSession(draft)) throw new Error("Created session draft is missing required fields.");
  return { valid: true, session: draft };
}

function saveSessionStep({ routeId }: StepContext) {
  const draft = localSessionRepository.createSessionDraft(findWorkout(routeId));
  try {
    localSessionRepository.saveSession(draft);
    const readBack = localSessionRepository.getSessionById(draft.id);
    if (!readBack) throw new Error(`Saved session "${draft.id}" could not be read back.`);
    return { savedSessionId: draft.id, readBackFound: true, readBack, diagnostics: localSessionRepository.getDiagnostics() };
  } finally {
    localSessionRepository.delete(draft.id);
  }
}

function renderEligibilityStep({ routeId }: StepContext) {
  const workout = findWorkout(routeId);
  const requestedDrills = workout.warmupDrillIds.concat(workout.mainDrillIds);
  const drillsResolved = requestedDrills.every((id) => drills.some((drill) => drill.id === id));
  const kpisResolved = workout.kpiTestIds.every((id) => kpis.some((kpi) => kpi.id === id));
  const draft = localSessionRepository.createSessionDraft(workout);
  const conclusion = {
    workoutFound: true,
    drillsResolved,
    kpisResolved,
    storageDiagnostics: localSessionRepository.getDiagnostics(),
    sessionObjectValid: validSession(draft),
    safeToRenderNormalSession: drillsResolved && kpisResolved && validSession(draft),
  };
  if (!conclusion.safeToRenderNormalSession) throw new Error(`Normal session render is not eligible: ${JSON.stringify(conclusion)}`);
  return conclusion;
}

const stepDefinitions: StepDefinition[] = [
  { name: "A. Route param", run: routeParamStep },
  { name: "B. Browser/client status", run: browserClientStep },
  { name: "C. Workout data import", run: workoutImportStep },
  { name: "D. Drill data import", run: drillImportStep },
  { name: "E. KPI data import", run: kpiImportStep },
  { name: "F. localStorage availability", run: localStorageStep },
  { name: "G. sessionRepository listAllSessions", run: repositoryListStep },
  { name: "H. getSessionsByWorkoutId", run: repositoryWorkoutStep },
  { name: "I. createSessionFromWorkout dry run", run: createDraftStep },
  { name: "J. saveSession test", run: saveSessionStep },
  { name: "K. Render eligibility", run: renderEligibilityStep },
];

async function executeWithTimeout(definition: StepDefinition, context: StepContext): Promise<DebugStepResult> {
  const startedAt = Date.now();
  let timer = 0;
  try {
    const value = await Promise.race([
      Promise.resolve().then(() => definition.run(context)),
      new Promise<never>((_, reject) => {
        timer = window.setTimeout(() => reject(new Error(`Step exceeded ${STEP_TIMEOUT_MS}ms timeout.`)), STEP_TIMEOUT_MS);
      }),
    ]);
    window.clearTimeout(timer);
    return { name: definition.name, status: "SUCCESS", timestamp: new Date().toISOString(), durationMs: Date.now() - startedAt, value };
  } catch (reason) {
    window.clearTimeout(timer);
    const timedOut = message(reason).indexOf("timeout") >= 0;
    return { name: definition.name, status: timedOut ? "TIMEOUT" : "FAILURE", timestamp: new Date().toISOString(), durationMs: Date.now() - startedAt, error: message(reason), stack: errorStack(reason) };
  }
}

export function SessionDebugClient({ routeId }: { routeId: string }) {
  const [results, setResults] = useState<DebugStepResult[]>([]);
  const [currentStepName, setCurrentStepName] = useState("None");
  const [runStatus, setRunStatus] = useState<RunStatus>("Ready");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [nextManualIndex, setNextManualIndex] = useState(0);
  const [topLevelError, setTopLevelError] = useState("");
  const runToken = useRef(0);
  const runStartedAt = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (runStartedAt.current) setElapsedMs(Date.now() - runStartedAt.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  const runOne = useCallback(async (index: number, token: number) => {
    const definition = stepDefinitions[index];
    if (!definition || token !== runToken.current) return null;
    setCurrentStepName(definition.name);
    await delay(40);
    if (token !== runToken.current) return null;
    const result = await executeWithTimeout(definition, { routeId });
    if (token !== runToken.current) return null;
    setResults((current) => [...current, result]);
    setNextManualIndex(index + 1);
    await delay(40);
    return result;
  }, [routeId]);

  const runAll = useCallback(async () => {
    const token = runToken.current + 1;
    runToken.current = token;
    runStartedAt.current = Date.now();
    setElapsedMs(0);
    setResults([]);
    setNextManualIndex(0);
    setTopLevelError("");
    setRunStatus("Running");
    const completed: DebugStepResult[] = [];
    try {
      for (let index = 0; index < stepDefinitions.length; index += 1) {
        if (token !== runToken.current) return;
        const result = await runOne(index, token);
        if (result) completed.push(result);
      }
      if (token !== runToken.current) return;
      setCurrentStepName("None");
      runStartedAt.current = 0;
      if (completed.some((result) => result.status === "TIMEOUT")) setRunStatus("Timed out during one or more steps");
      else if (completed.some((result) => result.status === "FAILURE")) setRunStatus("Completed with failures");
      else setRunStatus("Completed all steps");
    } catch (reason) {
      setTopLevelError(`${message(reason)}${errorStack(reason) ? `\n${errorStack(reason)}` : ""}`);
      setRunStatus("Completed with failures");
      setCurrentStepName("None");
      runStartedAt.current = 0;
    }
  }, [runOne]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      runAll().catch((reason) => setTopLevelError(message(reason)));
    }, 0);
    return () => {
      window.clearTimeout(timer);
      runToken.current += 1;
    };
  }, [runAll]);

  async function runNextManually() {
    if (nextManualIndex >= stepDefinitions.length) {
      setNextManualIndex(0);
      setResults([]);
    }
    const index = nextManualIndex >= stepDefinitions.length ? 0 : nextManualIndex;
    const token = runToken.current + 1;
    runToken.current = token;
    runStartedAt.current = Date.now();
    setRunStatus("Running");
    setTopLevelError("");
    try {
      const result = await runOne(index, token);
      if (!result || token !== runToken.current) return;
      setCurrentStepName("None");
      runStartedAt.current = 0;
      const completed = results.concat(result);
      if (completed.some((item) => item.status === "TIMEOUT")) setRunStatus("Timed out during one or more steps");
      else if (completed.some((item) => item.status === "FAILURE")) setRunStatus("Completed with failures");
      else setRunStatus(index === stepDefinitions.length - 1 ? "Completed all steps" : "Ready");
    } catch (reason) {
      setTopLevelError(`${message(reason)}${errorStack(reason) ? `\n${errorStack(reason)}` : ""}`);
      setRunStatus("Completed with failures");
    }
  }

  function stop() {
    runToken.current += 1;
    runStartedAt.current = 0;
    setCurrentStepName("None");
    setRunStatus("Stopped by user");
  }

  async function copy() {
    const text = JSON.stringify({ routeId, runStatus, currentStepName, elapsedMs, topLevelError, results }, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy debug info:", text);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="card mb-5">
        <p className="label">Independent diagnostic route</p>
        <h1 className="text-3xl font-black">Session Debug: {routeId}</h1>
        <div className="mt-4 grid gap-2 rounded-2xl bg-ice p-4 text-sm sm:grid-cols-3"><p><strong>Status:</strong> {runStatus}</p><p><strong>Current step:</strong> {currentStepName}</p><p><strong>Elapsed:</strong> {(elapsedMs / 1000).toFixed(1)}s</p></div>
        {topLevelError && <pre className="mt-4 whitespace-pre-wrap break-all rounded-xl bg-red-100 p-4 text-sm font-bold text-red-800">Unexpected debug runner error: {topLevelError}</pre>}
        <div className="mt-5 flex flex-wrap gap-3"><button className="btn-primary" onClick={runAll}>Run All Steps</button><button className="btn-secondary" onClick={runNextManually}>Run Next Step Manually</button><button className="btn-secondary border-red-200 text-red-700" onClick={stop}>Stop Debug Run</button><button className="btn-secondary" onClick={copy}>Copy Debug Info</button><Link className="btn-secondary" href={`/session/${routeId}`}>Open Normal Session</Link><Link className="btn-secondary" href="/today">Back to Today</Link></div>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => <article className={`card border-2 ${result.status === "SUCCESS" ? "border-green-200" : result.status === "TIMEOUT" ? "border-amber-300" : "border-red-300"}`} key={`${result.name}-${index}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-black">{result.name}</h2><p className="mt-1 text-xs text-slate-500">{result.timestamp} · {result.durationMs}ms</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${result.status === "SUCCESS" ? "bg-green-100 text-green-800" : result.status === "TIMEOUT" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>{result.status}</span></div>{result.error && <p className="mt-3 break-all font-bold text-red-700">Error: {result.error}</p>}{result.stack && <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-red-50 p-3 text-xs">{result.stack}</pre>}{result.value !== undefined && <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-3 text-xs text-white">{JSON.stringify(result.value, null, 2)}</pre>}</article>)}
      </div>
    </div>
  );
}
