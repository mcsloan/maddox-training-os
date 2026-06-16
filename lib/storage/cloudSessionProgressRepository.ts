"use client";

import { readableError } from "@/lib/errorMessage";
import { MADDOX_ATHLETE_ID, MADDOX_ATHLETE_NAME } from "@/lib/storage/completedSessionRepository";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { SessionLog } from "@/lib/types";

const DEVICE_KEY = "maddox-training-os:device-id";
const SCHEMA_VERSION = 1;

export interface CloudSessionProgressResult<T> {
  data: T;
  warning: string;
}

function createId() {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  } catch {
    // Use stable fallback format below.
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

function isSessionLog(value: unknown): value is SessionLog {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<SessionLog>;
  return typeof session.id === "string" && typeof session.workoutId === "string" && typeof session.startedAt === "string";
}

function sessionFromRow(row: { session_data: unknown } | null): SessionLog | null {
  return isSessionLog(row?.session_data) ? row.session_data : null;
}

async function ensureAthlete() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("athletes").upsert({
    id: MADDOX_ATHLETE_ID,
    name: MADDOX_ATHLETE_NAME,
  }, { onConflict: "id" });
  if (error) throw new Error(readableError(error));
}

export async function loadCloudSessionById(sessionId: string): Promise<CloudSessionProgressResult<SessionLog | null>> {
  if (!isSupabaseConfigured()) return { data: null, warning: "" };
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { data: null, warning: "Supabase is not configured." };
    const { data, error } = await supabase
      .from("session_progress")
      .select("session_data")
      .eq("athlete_id", MADDOX_ATHLETE_ID)
      .eq("id", sessionId)
      .maybeSingle();
    if (error) throw error;
    return { data: sessionFromRow(data), warning: "" };
  } catch (reason) {
    return { data: null, warning: `Cloud session progress unavailable. ${readableError(reason)}` };
  }
}

export async function loadCloudSessionsByWorkoutId(workoutId: string): Promise<CloudSessionProgressResult<SessionLog[]>> {
  if (!isSupabaseConfigured()) return { data: [], warning: "" };
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { data: [], warning: "Supabase is not configured." };
    const { data, error } = await supabase
      .from("session_progress")
      .select("session_data")
      .eq("athlete_id", MADDOX_ATHLETE_ID)
      .eq("workout_id", workoutId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return {
      data: (data || []).map(sessionFromRow).filter((session): session is SessionLog => Boolean(session)),
      warning: "",
    };
  } catch (reason) {
    return { data: [], warning: `Cloud session progress unavailable. ${readableError(reason)}` };
  }
}

export async function saveCloudSessionProgress(session: SessionLog): Promise<CloudSessionProgressResult<SessionLog>> {
  if (!isSupabaseConfigured()) return { data: session, warning: "" };
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { data: session, warning: "Supabase is not configured." };
    await ensureAthlete();
    const { error } = await supabase.from("session_progress").upsert({
      id: session.id,
      athlete_id: MADDOX_ATHLETE_ID,
      workout_id: session.workoutId,
      session_date: session.date,
      status: session.status,
      current_step: session.currentStep,
      started_at: session.startedAt,
      completed_at: session.completedAt,
      session_data: session,
      device_id: getDeviceId(),
      schema_version: SCHEMA_VERSION,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
    if (error) throw error;
    return { data: session, warning: "" };
  } catch (reason) {
    return { data: session, warning: `Cloud session progress save failed. ${readableError(reason)}` };
  }
}
