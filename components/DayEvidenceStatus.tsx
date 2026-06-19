"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildDayEvidenceProjection } from "@/lib/projections/dayEvidence";
import { loadStandaloneKpiResults, type SyncedKPIResult } from "@/lib/storage/cloudKpiRepository";
import { loadTrainingHistory } from "@/lib/storage/completedSessionRepository";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { getTrainingWorkLogByDate } from "@/lib/storage/trainingWorkRepository";
import { type DayProjection } from "@/lib/projections/dayProjection";
import { type ExternalLoadLog, type PlannedExternalLoad, type SessionLog, type TrainingWorkLog } from "@/lib/types";

interface DayEvidenceStatusProps {
  date: string;
  sportLoads: PlannedExternalLoad[];
  plannedKpiCount: number;
  logTodayHref: string;
  mode: "sport-load" | "kpi" | "summary";
  trainingWorkLogHref?: string;
}

export function DayEvidenceStatus({ date, logTodayHref, mode, plannedKpiCount, sportLoads, trainingWorkLogHref }: DayEvidenceStatusProps) {
  const [projection, setProjection] = useState<DayProjection | null>(null);
  const [trainingWorkLog, setTrainingWorkLog] = useState<TrainingWorkLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setTrainingWorkLog(getTrainingWorkLogByDate(date));
    Promise.all([loadExternalLoadLogs(), loadStandaloneKpiResults(), loadTrainingHistory()])
      .then(([sportLoadResult, kpiResult, historyResult]) => {
        if (!active) return;
        setProjection(buildDayEvidenceProjection({
          date,
          sportLoadLogs: sportLoadResult.logs,
          kpiResults: kpiResult.results,
          sessionAttempts: historyResult.sessions,
          projection: "preview",
        }));
      })
      .catch(() => {
        if (active) setProjection(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [date]);

  if (loading) {
    return <div className="rounded-2xl bg-white/80 p-4 text-sm font-bold text-slate-700">Checking saved day evidence...</div>;
  }

  if (!projection) {
    return <EvidenceFallback logTodayHref={logTodayHref} mode={mode} />;
  }

  const sportLoadCount = projection.records.sportLoadLogs.length;
  const kpiCount = projection.records.kpiResults.length;
  const trainingWorkCount = projection.records.sessionAttempts.length + projection.records.drillLogs.length + (trainingWorkLog ? 1 : 0);
  const reflectionCount = projection.records.reflections.length;
  const hasAnyEvidence = projection.status.hasAnyRecord;
  const hasSportLoadEvidence = sportLoadCount > 0;
  const hasKpiEvidence = kpiCount > 0;
  const kpiPartial = plannedKpiCount > 0 && kpiCount > 0 && kpiCount < plannedKpiCount;

  if (mode === "sport-load") {
    return (
      <div className="rounded-2xl bg-white/90 p-4 text-navy">
        <p className="label">{hasSportLoadEvidence ? "Sport Load logged" : "Day log"}</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          {hasSportLoadEvidence
            ? sportLoadSummary(projection.records.sportLoadLogs[0], sportLoads[0]?.title)
            : "No Sport Load log found for this day yet."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className={hasSportLoadEvidence ? "btn-secondary" : "btn-primary"} href={logTodayHref}>
            {hasSportLoadEvidence ? "Update Sport Load" : "Log Today"}
          </Link>
          {hasSportLoadEvidence && <Link className="btn-secondary" href={logTodayHref}>Add Recovery Notes</Link>}
        </div>
      </div>
    );
  }

  if (mode === "kpi" && plannedKpiCount > 0) {
    return (
      <div className={`mt-4 rounded-2xl p-4 ${hasKpiEvidence ? "bg-cyan-50" : "bg-ice"}`}>
        <p className="label">{hasKpiEvidence ? "KPI evidence recorded" : "KPI evidence"}</p>
        <p className="mt-1 font-black">{hasKpiEvidence ? `${kpiCount} of ${plannedKpiCount} KPI results recorded` : "No KPI results recorded yet"}</p>
        {kpiPartial && <p className="mt-2 text-sm font-semibold text-amber-900">Partial because Puck-Control Weave or another planned KPI remains unresolved. No missing result is inferred.</p>}
        <Link className="btn-secondary mt-3" href="/kpis">{hasKpiEvidence ? "Review KPI Results" : "Open KPI Dashboard"}</Link>
      </div>
    );
  }

  if (!hasAnyEvidence && !trainingWorkLog && plannedKpiCount === 0) return null;

  return (
    <section className="card mt-6 border-2 border-lime bg-lime/10">
      <p className="label">Day status</p>
      <h2 className="text-2xl font-black">{summaryStatusLabel(projection, kpiPartial, trainingWorkLog)}</h2>
      <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700">
        {plannedKpiCount > 0 && <p><strong>KPI evidence recorded:</strong> {kpiCount} of {plannedKpiCount} planned KPI results.</p>}
        {kpiPartial && <p><strong>Remaining/unresolved:</strong> Puck-Control Weave or another planned KPI remains unresolved. No missing result is inferred.</p>}
        <p><strong>Training Work evidence:</strong> {trainingWorkLog || trainingWorkCount > 0 ? "Logged" : "Not logged"}.</p>
        {sportLoadCount > 0 && <p><strong>Sport Load evidence:</strong> Logged.</p>}
        {reflectionCount > 0 && <p><strong>Reflection evidence:</strong> Saved.</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <EvidenceChip label="Sport Load" count={sportLoadCount} />
        <EvidenceChip label="Training Work" count={trainingWorkCount} />
        <EvidenceChip label="KPI" count={kpiCount} />
        <EvidenceChip label="Reflection" count={reflectionCount} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {plannedKpiCount > 0 && kpiCount > 0 && <Link className="btn-secondary" href="/kpis">Review KPI Results</Link>}
        <Link className="btn-secondary" href={trainingWorkLogHref || logTodayHref}>Log Training Work</Link>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-600">Only log Training Work if the supporting training work was actually completed. KPI evidence and Training Work evidence are tracked separately.</p>
    </section>
  );
}

function EvidenceFallback({ logTodayHref, mode }: { logTodayHref: string; mode: DayEvidenceStatusProps["mode"] }) {
  if (mode !== "sport-load") return null;
  return <Link className="btn-primary text-lg" href={logTodayHref}>Log Today</Link>;
}

function EvidenceChip({ count, label }: { count: number; label: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${count > 0 ? "bg-blue text-white" : "bg-rink text-slate-500"}`}>{label}: {count}</span>;
}

function sportLoadSummary(_record: DayProjection["records"]["sportLoadLogs"][number], fallbackTitle?: string) {
  const title = fallbackTitle || "Sport Load";
  return `${title} is logged. Review or update details if effort, energy, soreness, pain, recovery, or notes changed.`;
}

function summaryStatusLabel(projection: DayProjection, kpiPartial: boolean, trainingWorkLog: TrainingWorkLog | null) {
  if (kpiPartial) return "Partial";
  if (trainingWorkLog?.completed) return "Training Work logged";
  return projection.summaryLabel;
}
