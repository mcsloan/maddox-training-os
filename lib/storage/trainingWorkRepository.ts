"use client";

import { readableError } from "@/lib/errorMessage";
import { TrainingWorkLog } from "@/lib/types";

const KEY = "maddox-training-os:training-work-logs";
const SCHEMA_VERSION = 1;

function uniqueId(date: string) {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return `training-work-${date}-${window.crypto.randomUUID()}`;
  } catch {
    // Use fallback below.
  }
  return `training-work-${date}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function read(): TrainingWorkLog[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]") as unknown;
    return Array.isArray(parsed)
      ? parsed
          .filter((item): item is TrainingWorkLog => Boolean(item && typeof item === "object" && "date" in item && "notes" in item))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      : [];
  } catch (reason) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[TrainingWorkRepository] read failed", readableError(reason));
    }
    return [];
  }
}

function write(logs: TrainingWorkLog[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(logs));
  } catch (reason) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[TrainingWorkRepository] write failed", readableError(reason));
    }
  }
}

export function getTrainingWorkLogByDate(date: string) {
  return read().find((log) => log.date === date) || null;
}

export function createTrainingWorkLog(date: string, workoutId: string | null, title: string, plannedBlockIds: string[], plannedDurationMinutes: number | null, previous?: TrainingWorkLog): TrainingWorkLog {
  const now = new Date().toISOString();
  return {
    id: previous?.id || uniqueId(date),
    date,
    workoutId,
    title,
    plannedBlockIds,
    plannedDurationMinutes,
    completed: previous?.completed ?? false,
    actualDuration: previous?.actualDuration ?? plannedDurationMinutes,
    effort: previous?.effort ?? null,
    notes: previous?.notes ?? "",
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    schemaVersion: SCHEMA_VERSION,
    source: "training_work",
  };
}

export function loadTrainingWorkLogs() {
  return read();
}

export function saveTrainingWorkLog(log: TrainingWorkLog) {
  const saved = { ...log, updatedAt: new Date().toISOString() };
  const logs = read();
  const index = logs.findIndex((item) => item.date === saved.date);
  if (index >= 0) logs[index] = saved;
  else logs.unshift(saved);
  write(logs);
  return saved;
}
