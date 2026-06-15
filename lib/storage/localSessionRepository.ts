"use client";

import { getWorkout, getWorkoutDrills } from "@/lib/trainingData";
import { ExerciseCompletion, SessionLog, Workout } from "@/lib/types";
import { SessionRepository, SessionStorageDiagnostics } from "./sessionRepository";

const KEY = "maddox-training-os:sessions";
const CORRUPT_BACKUP_PREFIX = "maddox-training-os:sessions:corrupt:";
const isDevelopment = process.env.NODE_ENV === "development";

let diagnostics: SessionStorageDiagnostics = {
  storageReadable: false,
  storageWritable: false,
  jsonParsed: false,
  keysFound: [],
  sessionCount: 0,
  backupKey: null,
  lastError: "",
};

function debug(step: string, details?: unknown) {
  if (isDevelopment) console.info(`[SessionRepository] ${step}`, details ?? "");
}

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : String(reason);
}

function listStorageKeys(): string[] {
  const keys: string[] = [];
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key) keys.push(key);
    }
  } catch (reason) {
    diagnostics.lastError = `Unable to list local storage keys: ${errorMessage(reason)}`;
  }
  return keys;
}

function emptyExercise(drillId: string): ExerciseCompletion {
  return { drillId, done: false, actualSets: null, actualReps: null, actualDuration: null, actualDistance: null, notes: "", difficulty: null };
}

function buildExercises(workout: Workout): Record<string, ExerciseCompletion> {
  const exercises: Record<string, ExerciseCompletion> = {};
  getWorkoutDrills(workout).forEach((drill) => {
    exercises[drill.id] = emptyExercise(drill.id);
  });
  return exercises;
}

function isSessionLog(value: unknown): value is SessionLog {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<SessionLog>;
  return typeof session.id === "string" && typeof session.workoutId === "string" && typeof session.startedAt === "string";
}

function normalize(session: SessionLog): SessionLog {
  const workout = getWorkout(session.workoutId);
  const plannedExercises = workout ? buildExercises(workout) : {};
  const rawStatus = (session as unknown as { status?: string }).status;
  const status = rawStatus === "active" ? "in-progress" : rawStatus;
  return {
    ...session,
    status: status === "completed" || status === "reopened" || status === "in-progress" ? status : "in-progress",
    completedAt: session.completedAt || null,
    currentStep: Number.isFinite(session.currentStep) ? session.currentStep : 0,
    readiness: {
      energy: session.readiness?.energy ?? null,
      soreness: session.readiness?.soreness ?? null,
      focus: session.readiness?.focus ?? null,
      restingHeartRate: session.readiness?.restingHeartRate ?? null,
      sleepHours: session.readiness?.sleepHours ?? null,
      notes: session.readiness?.notes ?? "",
    },
    exercises: { ...plannedExercises, ...(session.exercises || {}) },
    kpiResults: session.kpiResults || {},
    reflection: session.reflection || { energy: null, confidence: null, difficulty: null, improvement: "", notes: "" },
  };
}

function backupCorruptData(raw: string) {
  try {
    const backupKey = `${CORRUPT_BACKUP_PREFIX}${Date.now()}`;
    window.localStorage.setItem(backupKey, raw);
    diagnostics.backupKey = backupKey;
  } catch {
    diagnostics.backupKey = null;
  }
}

function read(): SessionLog[] {
  diagnostics = { ...diagnostics, storageReadable: false, jsonParsed: false, keysFound: [], sessionCount: 0, lastError: "" };
  if (typeof window === "undefined") {
    diagnostics.lastError = "Browser window is unavailable.";
    return [];
  }

  debug("read start");
  try {
    diagnostics.keysFound = listStorageKeys();
    debug("local storage keys found", diagnostics.keysFound);
    const raw = window.localStorage.getItem(KEY);
    diagnostics.storageReadable = true;
    if (!raw) {
      diagnostics.jsonParsed = true;
      debug("read end", { sessions: 0, empty: true });
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
      diagnostics.jsonParsed = true;
    } catch (reason) {
      backupCorruptData(raw);
      diagnostics.lastError = `Session JSON could not be parsed: ${errorMessage(reason)}`;
      debug("read corrupt JSON", diagnostics);
      return [];
    }

    if (!Array.isArray(parsed)) {
      backupCorruptData(raw);
      diagnostics.lastError = "Session storage JSON was not an array.";
      return [];
    }

    const sessions = parsed.filter(isSessionLog).map(normalize).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    diagnostics.sessionCount = sessions.length;
    debug("read end", { sessions: sessions.length });
    return sessions;
  } catch (reason) {
    diagnostics.lastError = `Local storage is unavailable: ${errorMessage(reason)}`;
    debug("read failed", diagnostics);
    return [];
  }
}

function write(sessions: SessionLog[]): boolean {
  diagnostics.storageWritable = false;
  if (typeof window === "undefined") {
    diagnostics.lastError = "Browser window is unavailable.";
    return false;
  }

  debug("save start", { sessions: sessions.length });
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sessions));
    diagnostics.storageWritable = true;
    diagnostics.storageReadable = true;
    diagnostics.jsonParsed = true;
    diagnostics.sessionCount = sessions.length;
    diagnostics.keysFound = listStorageKeys();
    debug("local storage keys found", diagnostics.keysFound);
    debug("save end", { success: true });
    return true;
  } catch (reason) {
    diagnostics.lastError = `Local storage save failed: ${errorMessage(reason)}`;
    debug("save end", { success: false, error: diagnostics.lastError });
    return false;
  }
}

function uniqueId(workoutId: string) {
  try {
    const cryptoApi = typeof window !== "undefined" ? window.crypto : undefined;
    if (cryptoApi && typeof cryptoApi.randomUUID === "function") return `${workoutId}-${cryptoApi.randomUUID()}`;
  } catch (reason) {
    debug("crypto.randomUUID unavailable", errorMessage(reason));
  }
  return `${workoutId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createSession(workout: Workout): SessionLog {
  debug("session creation start", { workoutId: workout.id });
  const now = new Date();
  const session: SessionLog = {
    id: uniqueId(workout.id),
    workoutId: workout.id,
    date: now.toISOString().slice(0, 10),
    startedAt: now.toISOString(),
    completedAt: null,
    currentStep: 0,
    status: "in-progress",
    readiness: { energy: null, soreness: null, focus: null, restingHeartRate: null, sleepHours: null, notes: "" },
    exercises: buildExercises(workout),
    kpiResults: {},
    reflection: { energy: null, confidence: null, difficulty: null, improvement: "", notes: "" },
  };
  debug("session creation end", { sessionId: session.id });
  return session;
}

function save(session: SessionLog): SessionLog {
  const sessions = read();
  const index = sessions.findIndex((item) => item.id === session.id);
  if (index >= 0) sessions[index] = session;
  else sessions.unshift(session);
  write(sessions);
  return session;
}

export const localSessionRepository: SessionRepository = {
  getSessionsByWorkoutId(workoutId) {
    return read().filter((session) => session.workoutId === workoutId);
  },
  getLatestSessionByWorkoutId(workoutId) {
    return read().find((session) => session.workoutId === workoutId) || null;
  },
  getSessionById(sessionLogId) {
    return read().find((session) => session.id === sessionLogId) || null;
  },
  createSessionDraft(workout) {
    return createSession(workout);
  },
  createSessionFromWorkout(workout) {
    return save(createSession(workout));
  },
  saveSession: save,
  updateSession: save,
  listAllSessions: read,
  startFreshAttempt(workoutId) {
    const workout = getWorkout(workoutId);
    return workout ? save(createSession(workout)) : null;
  },
  reopenSession(sessionLogId) {
    const session = read().find((item) => item.id === sessionLogId);
    if (!session) return null;
    return save({ ...session, status: "reopened", completedAt: null });
  },
  delete(sessionId) {
    write(read().filter((session) => session.id !== sessionId));
  },
  clearAll() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(KEY);
      diagnostics = { ...diagnostics, storageReadable: true, storageWritable: true, jsonParsed: true, sessionCount: 0, lastError: "" };
    } catch (reason) {
      diagnostics.lastError = `Unable to clear local training data: ${errorMessage(reason)}`;
    }
  },
  getDiagnostics() {
    return { ...diagnostics, keysFound: diagnostics.keysFound.slice() };
  },
};
