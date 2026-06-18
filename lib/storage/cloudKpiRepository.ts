"use client";

import packageJson from "@/package.json";
import { readableError } from "@/lib/errorMessage";
import { MADDOX_ATHLETE_ID, MADDOX_ATHLETE_NAME, DataMode } from "@/lib/storage/completedSessionRepository";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { KPIResult, StandaloneKPIResultDeletedSnapshot, StandaloneKPIResultSnapshot } from "@/lib/types";

const DEVICE_KEY = "maddox-training-os:device-id";
const SCHEMA_VERSION = 1;
const PLAN_VERSION = "2026-seed-v1";

export type KPIResultSyncState = "cloud" | "local";
export type SyncedKPIResult = KPIResult & { syncState: KPIResultSyncState };

export interface KPIHistoryResult {
  results: SyncedKPIResult[];
  mode: DataMode;
  warning: string;
}

function uniqueId() {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  } catch {
    // Fall back to timestamp below.
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

function dedupeKey(result: KPIResult) {
  return result.enteredAt ? `${result.kpiId}:${result.date}:${result.enteredAt}` : `id:${result.id}`;
}

function sortResults<T extends KPIResult>(results: T[]) {
  return [...results].sort((a, b) => (b.enteredAt || b.date).localeCompare(a.enteredAt || a.date));
}

function mergeResults(local: KPIResult[], cloud: KPIResult[]): SyncedKPIResult[] {
  const byKey = new Map<string, SyncedKPIResult>();
  cloud.forEach((result) => {
    byKey.set(dedupeKey(result), { ...result, syncState: "cloud" });
  });
  local.forEach((result) => {
    const key = dedupeKey(result);
    if (!byKey.has(key)) byKey.set(key, { ...result, syncState: "local" });
  });
  return sortResults(Array.from(byKey.values()));
}

function createSnapshot(result: KPIResult): StandaloneKPIResultSnapshot {
  return {
    kind: "standalone_kpi_result",
    kpiId: result.kpiId,
    date: result.date,
    enteredAt: result.enteredAt,
    bestResult: result.bestResult,
    attempts: result.attempts,
    notes: result.notes,
    source: "kpi_page",
    kpiResult: result,
  };
}

function createDeletedSnapshot(resultId: string, deletedAt: string, currentDeviceId: string): StandaloneKPIResultDeletedSnapshot {
  return {
    kind: "standalone_kpi_result_deleted",
    deletedResultId: resultId,
    deletedAt,
    reason: "user_deleted",
    source: "kpi_page",
    athleteId: MADDOX_ATHLETE_ID,
    schemaVersion: SCHEMA_VERSION,
    appVersion: packageJson.version,
    planVersion: PLAN_VERSION,
    deviceId: currentDeviceId,
  };
}

async function ensureAthlete() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { error } = await supabase.from("athletes").upsert({
    id: MADDOX_ATHLETE_ID,
    name: MADDOX_ATHLETE_NAME,
  }, { onConflict: "id" });
  if (error) throw new Error(readableError(error));
  return supabase;
}

export async function saveStandaloneKpiResult(result: KPIResult) {
  localKpiRepository.save(result);
  const supabase = await ensureAthlete();
  if (!supabase) return { mode: "local" as const, result };

  const snapshot = createSnapshot(result);
  const completedAt = new Date().toISOString();
  const { error } = await supabase.from("session_logs").insert({
    id: `standalone-kpi:${result.id}:${completedAt}:${uniqueId()}`,
    athlete_id: MADDOX_ATHLETE_ID,
    scheduled_session_id: `kpi:${result.kpiId}`,
    session_date: result.date,
    title: `KPI Result: ${result.kpiId}`,
    status: "completed",
    started_at: result.enteredAt || completedAt,
    completed_at: completedAt,
    schema_version: SCHEMA_VERSION,
    app_version: packageJson.version,
    plan_version: PLAN_VERSION,
    device_id: deviceId(),
    source: "kpi_page",
    session_snapshot: snapshot,
  });
  if (error) throw new Error(readableError(error));
  return { mode: "cloud" as const, result };
}

export async function loadStandaloneKpiResults(): Promise<KPIHistoryResult> {
  const local = localKpiRepository.getAll();
  if (!isSupabaseConfigured()) {
    return {
      results: mergeResults(local, []),
      mode: "local",
      warning: "KPI results are saved on this browser only.",
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { results: mergeResults(local, []), mode: "local", warning: "Supabase is not configured." };
    const { data, error } = await supabase
      .from("session_logs")
      .select("session_snapshot, completed_at")
      .eq("athlete_id", MADDOX_ATHLETE_ID)
      .eq("source", "kpi_page")
      .order("completed_at", { ascending: false });
    if (error) throw error;
    const snapshots = (data || [])
      .map((row) => row.session_snapshot as StandaloneKPIResultSnapshot | StandaloneKPIResultDeletedSnapshot | null)
      .filter((snapshot): snapshot is StandaloneKPIResultSnapshot | StandaloneKPIResultDeletedSnapshot => Boolean(snapshot));
    const deletedResultIds = new Set(
      snapshots
        .filter((snapshot): snapshot is StandaloneKPIResultDeletedSnapshot => snapshot.kind === "standalone_kpi_result_deleted")
        .map((snapshot) => snapshot.deletedResultId),
    );
    const seenCloud = new Set<string>();
    const cloud = snapshots
      .filter((snapshot): snapshot is StandaloneKPIResultSnapshot => snapshot.kind === "standalone_kpi_result")
      .map((snapshot) => snapshot.kpiResult)
      .filter((result) => !deletedResultIds.has(result.id))
      .filter((result) => {
        const key = dedupeKey(result);
        if (seenCloud.has(key)) return false;
        seenCloud.add(key);
        return true;
      });
    cloud.forEach((result) => localKpiRepository.save(result));
    const results = mergeResults(local.filter((result) => !deletedResultIds.has(result.id)), cloud);
    const hasLocalOnly = results.some((result) => result.syncState === "local");
    return {
      results,
      mode: hasLocalOnly ? "local" : "cloud",
      warning: hasLocalOnly ? "Some KPI results are local only / pending sync." : "",
    };
  } catch (reason) {
    return {
      results: mergeResults(local, []),
      mode: "local",
      warning: `Cloud KPI history unavailable. Showing local backup. ${readableError(reason)}`,
    };
  }
}

export async function deleteStandaloneKpiResult(resultId: string) {
  const supabase = await ensureAthlete();
  if (!supabase) {
    localKpiRepository.delete(resultId);
    return { mode: "local" as const };
  }

  const deletedAt = new Date().toISOString();
  const currentDeviceId = deviceId();
  const snapshot = createDeletedSnapshot(resultId, deletedAt, currentDeviceId);
  const { error } = await supabase.from("session_logs").insert({
    id: `standalone-kpi-deleted:${resultId}:${deletedAt}:${uniqueId()}`,
    athlete_id: MADDOX_ATHLETE_ID,
    scheduled_session_id: `kpi-deleted:${resultId}`,
    session_date: deletedAt.slice(0, 10),
    title: `KPI Result Deleted: ${resultId}`,
    status: "deleted",
    started_at: deletedAt,
    completed_at: deletedAt,
    schema_version: SCHEMA_VERSION,
    app_version: packageJson.version,
    plan_version: PLAN_VERSION,
    device_id: currentDeviceId,
    source: "kpi_page",
    session_snapshot: snapshot,
  });
  if (error) throw new Error(readableError(error));
  localKpiRepository.delete(resultId);
  return { mode: "cloud" as const };
}
