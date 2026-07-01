import { NextResponse } from "next/server";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { kpis } from "@/lib/trainingData";
import { kpiBaseline, kpiBest } from "@/lib/trainingMetrics";
import type { KPIResult, StandaloneKPIResultDeletedSnapshot, StandaloneKPIResultSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";

const MADDOX_ATHLETE_ID = "00000000-0000-4000-8000-000000000012";

type SessionLogRow = {
  completed_at: string | null;
  session_snapshot: StandaloneKPIResultSnapshot | StandaloneKPIResultDeletedSnapshot | null;
};

type ExportedKpiResult = {
  id: string;
  kpiId: string;
  date: string;
  enteredAt: string | null;
  bestResult: number | null;
  attempts: KPIResult["attempts"];
  notes: string;
};

function dedupeKey(result: KPIResult) {
  return result.enteredAt ? `${result.kpiId}:${result.date}:${result.enteredAt}` : `id:${result.id}`;
}

function exportResult(result: KPIResult): ExportedKpiResult {
  return {
    id: result.id,
    kpiId: result.kpiId,
    date: result.date,
    enteredAt: result.enteredAt ?? null,
    bestResult: result.bestResult,
    attempts: result.attempts,
    notes: result.notes,
  };
}

function buildSummary(results: KPIResult[]) {
  const summary: Record<string, { entries: number; baseline: number | null; recent: number | null; best: number | null; latestDate: string | null }> = {};
  const ids = Array.from(new Set(results.map((result) => result.kpiId)));
  for (const kpiId of ids) {
    const entries = results.filter((result) => result.kpiId === kpiId);
    const kpi = kpis.find((item) => item.id === kpiId);
    summary[kpiId] = {
      entries: entries.length,
      baseline: kpiBaseline(entries),
      recent: entries.find((entry) => entry.bestResult !== null)?.bestResult ?? null,
      best: kpi ? kpiBest(kpi, entries) : entries.find((entry) => entry.bestResult !== null)?.bestResult ?? null,
      latestDate: entries[0]?.date ?? null,
    };
  }
  return summary;
}

export async function GET() {
  const generatedAt = new Date().toISOString();
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      generatedAt,
      mode: "cloud",
      count: 0,
      results: [],
      summaryByKpi: {},
      error: "Supabase is not configured.",
    }, { status: 503 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      generatedAt,
      mode: "cloud",
      count: 0,
      results: [],
      summaryByKpi: {},
      error: "Supabase client unavailable.",
    }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("session_logs")
    .select("session_snapshot, completed_at")
    .eq("athlete_id", MADDOX_ATHLETE_ID)
    .eq("source", "kpi_page")
    .order("completed_at", { ascending: false });

  if (error) {
    return NextResponse.json({
      generatedAt,
      mode: "cloud",
      count: 0,
      results: [],
      summaryByKpi: {},
      error: error.message,
    }, { status: 500 });
  }

  const snapshots = ((data || []) as SessionLogRow[])
    .map((row) => row.session_snapshot)
    .filter((snapshot): snapshot is StandaloneKPIResultSnapshot | StandaloneKPIResultDeletedSnapshot => Boolean(snapshot));
  const deletedResultIds = new Set(
    snapshots
      .filter((snapshot): snapshot is StandaloneKPIResultDeletedSnapshot => snapshot.kind === "standalone_kpi_result_deleted")
      .map((snapshot) => snapshot.deletedResultId),
  );
  const seen = new Set<string>();
  const results = snapshots
    .filter((snapshot): snapshot is StandaloneKPIResultSnapshot => snapshot.kind === "standalone_kpi_result")
    .map((snapshot) => snapshot.kpiResult)
    .filter((result) => !deletedResultIds.has(result.id))
    .filter((result) => {
      const key = dedupeKey(result);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return NextResponse.json({
    generatedAt,
    mode: "cloud",
    count: results.length,
    results: results.map(exportResult),
    summaryByKpi: buildSummary(results),
  });
}
