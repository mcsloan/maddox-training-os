"use client";

import { getWorkoutDrills } from "@/lib/trainingData";
import { readableError } from "@/lib/errorMessage";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { CompletedSessionSnapshot, SessionLog, Workout } from "@/lib/types";

export const MADDOX_ATHLETE_ID = "00000000-0000-4000-8000-000000000012";
export const MADDOX_ATHLETE_NAME = "Maddox";
const DEVICE_KEY = "maddox-training-os:device-id";
const SCHEMA_VERSION = 1;
const APP_VERSION = "0.1.0";
const PLAN_VERSION = "phase-1-local-json";

export type DataMode = "cloud" | "local";

export interface HistoryLoadResult {
  sessions: SessionLog[];
  mode: DataMode;
  warning: string;
}

function createId() {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  } catch {
    // Use the stable fallback format below.
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDeviceId() {
  try {
    const existing = window.localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const next = createId();
    window.localStorage.setItem(DEVICE_KEY, next);
    return next;
  } catch {
    return "storage-unavailable";
  }
}

export function createCompletedSessionSnapshot(session: SessionLog, workout: Workout): CompletedSessionSnapshot {
  return {
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    planVersion: PLAN_VERSION,
    athlete: { id: MADDOX_ATHLETE_ID, name: MADDOX_ATHLETE_NAME },
    workout,
    plannedDrills: getWorkoutDrills(workout),
    completedSession: session,
    drillLogs: session.exercises,
    kpiResults: session.kpiResults,
    readiness: session.readiness,
    reflection: session.reflection,
    timestamps: {
      sessionDate: session.date,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      snapshotCreatedAt: new Date().toISOString(),
    },
  };
}

export async function saveCompletedSession(session: SessionLog, workout: Workout) {
  // Local completed copy is always retained as a backup.
  localSessionRepository.saveSession(session);
  const snapshot = createCompletedSessionSnapshot(session, workout);
  const supabase = getSupabaseClient();
  if (!supabase) return { mode: "local" as const, snapshot };

  const { error: athleteError } = await supabase.from("athletes").upsert({
    id: MADDOX_ATHLETE_ID,
    name: MADDOX_ATHLETE_NAME,
  }, { onConflict: "id" });
  if (athleteError) throw new Error(readableError(athleteError));

  const immutableId = `${session.id}:${session.completedAt || snapshot.timestamps.snapshotCreatedAt}`;
  const { error } = await supabase.from("session_logs").insert({
    id: immutableId,
    athlete_id: MADDOX_ATHLETE_ID,
    scheduled_session_id: workout.id,
    session_date: session.date,
    title: workout.dayFocus,
    status: "completed",
    started_at: session.startedAt,
    completed_at: session.completedAt,
    schema_version: SCHEMA_VERSION,
    app_version: APP_VERSION,
    plan_version: PLAN_VERSION,
    device_id: getDeviceId(),
    source: "web",
    session_snapshot: snapshot,
  });
  if (error) throw new Error(readableError(error));
  return { mode: "cloud" as const, snapshot };
}

export async function loadTrainingHistory(): Promise<HistoryLoadResult> {
  const local = localSessionRepository.listAllSessions();
  if (!isSupabaseConfigured()) {
    return {
      sessions: local,
      mode: "local",
      warning: "Local data can be lost if browser data is cleared.",
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { sessions: local, mode: "local", warning: "Supabase is not configured." };
    const { data, error } = await supabase
      .from("session_logs")
      .select("id, session_snapshot, completed_at")
      .eq("athlete_id", MADDOX_ATHLETE_ID)
      .order("completed_at", { ascending: false });
    if (error) throw error;
    const seenSessionIds = new Set<string>();
    const cloudCompleted = (data || [])
      .map((row) => (row.session_snapshot as CompletedSessionSnapshot | null)?.completedSession)
      .filter((session): session is SessionLog => Boolean(session))
      .filter((session) => {
        if (seenSessionIds.has(session.id)) return false;
        seenSessionIds.add(session.id);
        return true;
      });
    cloudCompleted.forEach((session) => localSessionRepository.saveSession(session));
    const cloudSessionIds = new Set(cloudCompleted.map((session) => session.id));
    const localDrafts = local.filter((session) => session.status !== "completed");
    const unsyncedLocalCompleted = local.filter((session) => session.status === "completed" && !cloudSessionIds.has(session.id));
    if (unsyncedLocalCompleted.length) {
      return {
        sessions: [...localDrafts, ...unsyncedLocalCompleted, ...cloudCompleted],
        mode: "local",
        warning: `${unsyncedLocalCompleted.length} completed session backup${unsyncedLocalCompleted.length === 1 ? " is" : "s are"} not present in cloud history.`,
      };
    }
    return { sessions: [...localDrafts, ...cloudCompleted], mode: "cloud", warning: "" };
  } catch (reason) {
    return {
      sessions: local,
      mode: "local",
      warning: `Cloud history unavailable. Showing local backup. ${readableError(reason)}`,
    };
  }
}
