"use client";

import { useState } from "react";
import { drills, kpis, workouts } from "@/lib/trainingData";
import { ExerciseCompletion, SessionLog } from "@/lib/types";

const TEST_KEY = "maddox-training-os:session-minimal-test";

function createId(workoutId: string) {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return `${workoutId}-${window.crypto.randomUUID()}`;
  } catch {
    // Fall through to the older-browser-safe id.
  }
  return `${workoutId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function SessionMinimalDiagnostic({ routeId }: { routeId: string }) {
  const workout = workouts.find((item) => item.id === routeId);
  const [session, setSession] = useState<SessionLog | null>(null);
  const [log, setLog] = useState("No actions run yet.");

  function report(label: string, action: () => unknown) {
    try {
      const value = action();
      setLog(`${new Date().toISOString()} ${label}: SUCCESS\n${JSON.stringify(value, null, 2)}`);
    } catch (reason) {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      setLog(`${new Date().toISOString()} ${label}: FAILURE\n${error.message}\n${error.stack || ""}`);
    }
  }

  function createInMemory() {
    report("Create In-Memory Session", () => {
      if (!workout) throw new Error(`Workout "${routeId}" was not found.`);
      const exercises: Record<string, ExerciseCompletion> = {};
      workout.warmupDrillIds.concat(workout.mainDrillIds).forEach((drillId) => {
        exercises[drillId] = { drillId, done: false, actualSets: null, actualReps: null, actualDuration: null, actualDistance: null, notes: "", difficulty: null };
      });
      const now = new Date();
      const next: SessionLog = { id: createId(workout.id), workoutId: workout.id, date: now.toISOString().slice(0, 10), startedAt: now.toISOString(), completedAt: null, currentStep: 0, status: "in-progress", readiness: { energy: null, soreness: null, focus: null, restingHeartRate: null, sleepHours: null, notes: "" }, exercises, kpiResults: {}, reflection: { energy: null, confidence: null, difficulty: null, improvement: "", notes: "" } };
      setSession(next);
      return next;
    });
  }

  function save() {
    report("Save Session To localStorage", () => {
      if (!session) throw new Error("Create an in-memory session first.");
      window.localStorage.setItem(TEST_KEY, JSON.stringify(session));
      return { key: TEST_KEY, readBack: JSON.parse(window.localStorage.getItem(TEST_KEY) || "null") };
    });
  }

  function clear() {
    report("Clear Test Storage", () => {
      window.localStorage.removeItem(TEST_KEY);
      return { key: TEST_KEY, removed: window.localStorage.getItem(TEST_KEY) === null };
    });
  }

  return (
    <article className="card">
      <p className="label">Independent minimal client component</p>
      <h1 className="text-3xl font-black">Minimal Session Diagnostic</h1>
      <div className="mt-5 grid gap-2 rounded-2xl bg-ice p-4 text-sm sm:grid-cols-2">
        <p><strong>Route id:</strong> {routeId}</p><p><strong>Workout exists:</strong> {String(Boolean(workout))}</p>
        <p><strong>Workout count:</strong> {workouts.length}</p><p><strong>Drill count:</strong> {drills.length}</p>
        <p><strong>KPI count:</strong> {kpis.length}</p><p><strong>In-memory session:</strong> {session?.id || "None"}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3"><button className="btn-primary" onClick={createInMemory}>Create In-Memory Session</button><button className="btn-secondary" onClick={save}>Save Session To localStorage</button><button className="btn-secondary" onClick={clear}>Clear Test Storage</button></div>
      <pre className="mt-5 min-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-3 text-xs text-white">{log}</pre>
    </article>
  );
}
