"use client";

import packageJson from "@/package.json";
import { readableError } from "@/lib/errorMessage";
import { MADDOX_ATHLETE_ID, MADDOX_ATHLETE_NAME, DataMode } from "@/lib/storage/completedSessionRepository";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ExternalLoadLog, ExternalLoadSnapshot, PlannedExternalLoad } from "@/lib/types";

const KEY = "maddox-training-os:external-load-logs";
const DEVICE_KEY = "maddox-training-os:device-id";
const SCHEMA_VERSION = 1;
const PLAN_VERSION = "2026-seed-v1";

export interface ExternalLoadHistoryResult {
  logs: ExternalLoadLog[];
  mode: DataMode;
  warning: string;
}

function uniqueId() {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  } catch {
    // Use timestamp fallback.
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function deviceId() {
  try {
    const current = window.localStorage.getItem(DEVICE_KEY);
    if (current) return current;
    const next = uniqueId();
    window.localStorage.setItem(DEVICE_KEY, next);
    return next;
  } catch {
    return "storage-unavailable";
  }
}

function readLocal(): ExternalLoadLog[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]") as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is ExternalLoadLog => Boolean(item && typeof item === "object" && "externalLoadId" in item))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      : [];
  } catch {
    return [];
  }
}

function saveLocal(log: ExternalLoadLog) {
  const logs = readLocal();
  if (logs.some((item) => item.id === log.id)) return;
  logs.unshift(log);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(logs));
  } catch {
    // Cloud save may still succeed if local storage is unavailable.
  }
}

function latestOnly(logs: ExternalLoadLog[]) {
  const seen = new Set<string>();
  return logs.filter((log) => {
    if (seen.has(log.externalLoadId)) return false;
    seen.add(log.externalLoadId);
    return true;
  });
}

export function createExternalLoadLog(load: PlannedExternalLoad, previous?: ExternalLoadLog): ExternalLoadLog {
  const now = new Date().toISOString();
  const previousSkillRecoveryWork = previous?.skillRecoveryWork;
  return {
    id: uniqueId(),
    athleteId: MADDOX_ATHLETE_ID,
    externalLoadId: load.id,
    date: load.date,
    title: load.title,
    type: load.type,
    provider: load.provider,
    plannedDuration: load.plannedDurationMinutes,
    actualDuration: previous?.actualDuration ?? load.plannedDurationMinutes,
    plannedIntensity: load.plannedIntensity,
    attended: previous?.attended ?? true,
    effort: previous?.effort ?? null,
    energyAfter: previous?.energyAfter ?? null,
    confidence: previous?.confidence ?? null,
    difficulty: previous?.difficulty ?? null,
    soreness: previous?.soreness ?? 0,
    painFlag: previous?.painFlag ?? false,
    whatWentWell: previous?.whatWentWell ?? "",
    whatToAdjust: previous?.whatToAdjust ?? "",
    parentNotes: previous?.parentNotes ?? "",
    recoveryCompleted: previous?.recoveryCompleted ?? false,
    skillRecoveryWork: {
      headUpPuckTouchesCompleted: previousSkillRecoveryWork?.headUpPuckTouchesCompleted ?? false,
      headUpPuckTouchesMinutes: previousSkillRecoveryWork?.headUpPuckTouchesMinutes ?? null,
      accuracyShootingCompleted: previousSkillRecoveryWork?.accuracyShootingCompleted ?? false,
      shotsTaken: previousSkillRecoveryWork?.shotsTaken ?? null,
      targetHits: previousSkillRecoveryWork?.targetHits ?? null,
      cooldownBikeCompleted: previousSkillRecoveryWork?.cooldownBikeCompleted ?? false,
      cooldownBikeMinutes: previousSkillRecoveryWork?.cooldownBikeMinutes ?? null,
      bikeIntensity: previousSkillRecoveryWork?.bikeIntensity ?? "easy",
      recoveryMobilityCompleted: previousSkillRecoveryWork?.recoveryMobilityCompleted ?? false,
      recoveryMobilityMinutes: previousSkillRecoveryWork?.recoveryMobilityMinutes ?? null,
    },
    campReflection: load.type === "hockey_camp" ? previous?.campReflection || {
      competeLevel: null,
      skatingPace: null,
      puckConfidence: null,
      communication: null,
      attackedOrPassive: "",
    } : undefined,
    createdAt: now,
    updatedAt: now,
    schemaVersion: SCHEMA_VERSION,
    appVersion: packageJson.version,
    planVersion: PLAN_VERSION,
    source: "external_load",
  };
}

export async function saveExternalLoadLog(log: ExternalLoadLog, load: PlannedExternalLoad) {
  const saved = { ...log, updatedAt: new Date().toISOString() };
  saveLocal(saved);
  const supabase = getSupabaseClient();
  if (!supabase) return { mode: "local" as const, log: saved };

  const { error: athleteError } = await supabase.from("athletes").upsert({
    id: MADDOX_ATHLETE_ID,
    name: MADDOX_ATHLETE_NAME,
  }, { onConflict: "id" });
  if (athleteError) throw new Error(readableError(athleteError));

  const snapshot: ExternalLoadSnapshot = { kind: "external_load", externalLoadLog: saved, plannedExternalLoad: load };
  const { error } = await supabase.from("session_logs").insert({
    id: `external-load:${saved.id}`,
    athlete_id: MADDOX_ATHLETE_ID,
    scheduled_session_id: load.id,
    session_date: load.date,
    title: load.title,
    status: "completed",
    started_at: saved.createdAt,
    completed_at: saved.updatedAt,
    schema_version: saved.schemaVersion,
    app_version: saved.appVersion,
    plan_version: saved.planVersion,
    device_id: deviceId(),
    source: "external_load",
    session_snapshot: snapshot,
  });
  if (error) throw new Error(readableError(error));
  return { mode: "cloud" as const, log: saved };
}

export async function loadExternalLoadLogs(): Promise<ExternalLoadHistoryResult> {
  const local = readLocal();
  if (!isSupabaseConfigured()) return { logs: latestOnly(local), mode: "local", warning: "Sport Load logs are backed up on this browser." };
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { logs: latestOnly(local), mode: "local", warning: "Supabase is not configured." };
    const { data, error } = await supabase
      .from("session_logs")
      .select("session_snapshot, completed_at")
      .eq("athlete_id", MADDOX_ATHLETE_ID)
      .eq("source", "external_load")
      .order("completed_at", { ascending: false });
    if (error) throw error;
    const cloud = (data || [])
      .map((row) => (row.session_snapshot as ExternalLoadSnapshot | null)?.externalLoadLog)
      .filter((log): log is ExternalLoadLog => Boolean(log));
    cloud.forEach(saveLocal);
    const cloudIds = new Set(cloud.map((log) => log.id));
    const unsyncedLocal = local.filter((log) => !cloudIds.has(log.id));
    const logs = latestOnly([...cloud, ...local].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    if (unsyncedLocal.length) {
      return { logs, mode: "local", warning: `${unsyncedLocal.length} sport load log backup${unsyncedLocal.length === 1 ? " is" : "s are"} not present in cloud history.` };
    }
    return { logs, mode: "cloud", warning: "" };
  } catch (reason) {
    return { logs: latestOnly(local), mode: "local", warning: `Cloud Sport Load history unavailable. ${readableError(reason)}` };
  }
}

export function clearLocalExternalLoadLogs() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Best effort.
  }
}
