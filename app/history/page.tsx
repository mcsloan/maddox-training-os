"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataStatus } from "@/components/DataStatus";
import { DataMode, loadTrainingHistory } from "@/lib/storage/completedSessionRepository";
import { loadStandaloneKpiResults, SyncedKPIResult } from "@/lib/storage/cloudKpiRepository";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { formatPlanDate, getCalendarDates, getPlanDay, trainingPlan, workouts } from "@/lib/trainingData";
import { buildDayEvidenceProjection } from "@/lib/projections/dayEvidence";
import { buildHistoryDayProjection, type HistoryDayScreenProjection } from "@/lib/projections/screenProjections";
import { sessionCompletionPercent, workoutName } from "@/lib/trainingMetrics";
import { ExternalLoadLog, SessionLog } from "@/lib/types";

function statusLabel(status: SessionLog["status"]) {
  if (status === "in-progress") return "In Progress";
  if (status === "reopened") return "Reopened";
  return "Completed";
}

interface WeekHistoryGroup {
  id: string;
  label: string;
  dateRange: string;
  days: HistoryDayScreenProjection[];
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [externalLogs, setExternalLogs] = useState<ExternalLoadLog[]>([]);
  const [kpiResults, setKpiResults] = useState<SyncedKPIResult[]>([]);
  const [dataMode, setDataMode] = useState<DataMode>("local");
  const [warning, setWarning] = useState("Checking completed training history...");
  useEffect(() => {
    let active = true;
    loadTrainingHistory().then((result) => {
      if (!active) return;
      setSessions(result.sessions);
      setDataMode(result.mode);
      setWarning(result.warning);
    });
    loadExternalLoadLogs().then((result) => {
      if (active) setExternalLogs(result.logs);
    });
    loadStandaloneKpiResults().then((result) => {
      if (active) setKpiResults(result.results);
    });
    return () => { active = false; };
  }, []);
  const planDates = new Set(getCalendarDates());
  const knownWorkoutIds = new Set(workouts.map((workout) => workout.id));
  const attachedSessions = sessions.filter((session) => planDates.has(session.date) && knownWorkoutIds.has(session.workoutId));
  const legacySessions = sessions.filter((session) => !planDates.has(session.date) || !knownWorkoutIds.has(session.workoutId));
  const legacyOrphanRecords = legacySessions.map((session) => ({
    id: `${session.date}:${session.id}`,
    reason: !knownWorkoutIds.has(session.workoutId) ? "Unknown workout" : "Outside approved plan dates",
  }));
  const evidenceDates = Array.from(new Set([
    ...getCalendarDates(),
    ...externalLogs.map((log) => log.date),
    ...kpiResults.map((result) => result.date),
    ...sessions.map((session) => session.date),
  ])).sort((a, b) => b.localeCompare(a));
  const dayEvidence = evidenceDates
    .map((date) => buildHistoryDayProjection(buildDayEvidenceProjection({
      date,
      sportLoadLogs: externalLogs,
      kpiResults,
      sessionAttempts: attachedSessions,
      legacyOrphanRecords,
      projection: "preview",
    })))
    .filter((day) => day.groups.sportLoad.hasRecords || day.groups.trainingWork.hasRecords || day.groups.kpi.hasRecords || day.groups.reflection.hasRecords || day.groups.recovery.hasRecords || day.groups.legacy.hasRecords);
  const weekHistoryGroups = buildWeekHistoryGroups(dayEvidence);

  function fresh(workoutId: string) {
    const session = localSessionRepository.startFreshAttempt(workoutId);
    if (session) router.push(`/session/${workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=resume`);
  }

  function remove(sessionId: string) {
    if (!window.confirm("Delete this session attempt? This cannot be undone.")) return;
    localSessionRepository.delete(sessionId);
    setSessions(localSessionRepository.listAllSessions());
  }

  return (
    <div>
      <div className="mb-6"><p className="label">Completed history and active drafts</p><h1 className="text-4xl font-black">Session History</h1></div>
      <DataStatus mode={dataMode} warning={warning} />
      <section className="card mb-6">
        <div className="flex items-center justify-between gap-3"><div><p className="label">Program &gt; Week &gt; Day &gt; Evidence</p><h2 className="text-2xl font-black">Training Journal</h2></div><Link className="text-sm font-bold text-blue" href="/calendar">Calendar</Link></div>
        <div className="mt-4 space-y-6">{weekHistoryGroups.map((week) => <section className="rounded-2xl bg-ice p-4" key={week.id}><div className="flex flex-wrap items-end justify-between gap-2"><div><p className="label">{week.dateRange}</p><h3 className="text-xl font-black">{week.label}</h3></div><span className="rounded-full bg-white px-3 py-1 text-sm font-black text-blue">{week.days.length} day{week.days.length === 1 ? "" : "s"} with evidence</span></div><div className="mt-3 space-y-3">{week.days.map((day) => <Link className={`block rounded-2xl border p-4 hover:border-blue ${day.requiresManualReview ? "border-amber-300 bg-amber-50" : "border-rink bg-white"}`} href={getPlanDay(day.date) ? `/day/${day.date}` : "/history"} key={day.date}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{formatPlanDate(day.date)} · {day.summaryLabel}</p><p className="font-black">{journalTitle(day)}</p></div><span className={`rounded-full px-3 py-1 text-sm font-black ${day.requiresManualReview ? "bg-amber-100 text-amber-900" : "bg-ice text-blue"}`}>{day.requiresManualReview ? "Needs review" : statusText(day)}</span></div><div className="mt-3 flex flex-wrap gap-2">{evidenceChip("Sport Load", day.groups.sportLoad.count)}{evidenceChip("Training Work", day.groups.trainingWork.count)}{evidenceChip("KPI", day.groups.kpi.count)}{evidenceChip("Reflection", day.groups.reflection.count)}{day.groups.legacy.hasRecords && evidenceChip("Legacy review", day.groups.legacy.count)}</div><p className="mt-3 text-sm font-semibold text-slate-700">{historySummary(day)}</p></Link>)}</div></section>)}{!dayEvidence.length && <p className="text-slate-500">No day evidence saved yet.</p>}</div>
      </section>
      <section className="card mb-6">
        <div className="flex items-center justify-between gap-3"><div><p className="label">Hockey, lacrosse, camps, and tryouts</p><h2 className="text-2xl font-black">Sport Load Logs</h2></div><Link className="text-sm font-bold text-blue" href="/calendar">Calendar</Link></div>
        <div className="mt-4 space-y-3">{externalLogs.slice(0, 8).map((log) => <Link className="block rounded-2xl border border-rink p-4 hover:border-blue" href={`/external-load/${log.externalLoadId}`} key={log.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{new Date(`${log.date}T12:00:00`).toLocaleDateString()} · Sport Load Log</p><p className="font-black">{log.title}</p></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black text-blue">{log.attended ? "Attended" : "Did not attend"}</span></div><p className="mt-2 text-sm">Effort {log.effort ?? "—"}/5 · Energy {log.energyAfter ?? "—"}/5 · Confidence {log.confidence ?? "—"}/5 · Soreness {log.soreness}/5{log.painFlag ? " · Pain flagged" : ""}</p></Link>)}{!externalLogs.length && <p className="text-slate-500">No sport load logs saved yet.</p>}</div>
      </section>
      <div className="space-y-4">
        {sessions.map((session) => {
          const workout = workouts.find((item) => item.id === session.workoutId);
          const percent = sessionCompletionPercent(session);
          return <article className="card" key={session.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{new Date(session.startedAt).toLocaleString()}</p><h2 className="text-xl font-black">{workoutName(workout)}</h2></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black text-blue">{statusLabel(session.status)}</span></div><div className="mt-4"><div className="mb-1 flex justify-between text-sm font-bold"><span>Completion</span><span>{percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-rink"><div className="h-full bg-blue" style={{ width: `${percent}%` }} /></div></div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p><strong>Reflection:</strong> {session.reflection.improvement || (session.status === "completed" ? "No improvement note entered" : "Not completed")}</p><p><strong>KPI tests:</strong> {Object.keys(session.kpiResults).length ? `${Object.keys(session.kpiResults).length} completed` : "None completed"}</p></div><div className="mt-5 flex flex-wrap gap-2">{session.status === "completed" ? <><Link className="btn-secondary" href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=view`}>View</Link><Link className="btn-secondary" href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=reopen`}>Reopen / Edit</Link></> : <Link className="btn-primary" href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=resume`}>Resume</Link>}<button className="btn-secondary" onClick={() => fresh(session.workoutId)}>Start Fresh Attempt</button>{dataMode === "local" && <button className="btn-secondary border-red-200 text-red-700" onClick={() => remove(session.id)}>Delete Attempt</button>}</div></article>;
        })}
        {workouts.filter((workout) => !sessions.some((session) => session.workoutId === workout.id)).map((workout) => <article className="card" key={workout.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{workout.date}</p><h2 className="text-xl font-black">{workout.dayFocus}</h2></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black text-slate-500">Not Started</span></div><Link className="btn-primary mt-5" href={`/session/${workout.id}`}>Start Session</Link></article>)}
      </div>
    </div>
  );
}

function buildWeekHistoryGroups(days: HistoryDayScreenProjection[]): WeekHistoryGroup[] {
  const groups = trainingPlan.weeks.map((week) => {
    const weekDays = days.filter((day) => day.date >= week.startDate && day.date <= week.endDate);
    return {
      id: `week-${week.weekNumber}`,
      label: `Week ${week.weekNumber}`,
      dateRange: `${formatPlanDate(week.startDate)} to ${formatPlanDate(week.endDate)}`,
      days: weekDays,
    };
  }).filter((week) => week.days.length > 0);
  const needsReview = days.filter((day) => !trainingPlan.weeks.some((week) => day.date >= week.startDate && day.date <= week.endDate));
  if (needsReview.length > 0) {
    groups.push({
      id: "needs-review",
      label: "Needs review",
      dateRange: "Outside approved plan dates",
      days: needsReview,
    });
  }
  return groups;
}

function evidenceChip(label: string, count: number) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${count > 0 ? "bg-blue text-white" : "bg-rink text-slate-500"}`}>{label}: {count}</span>;
}

function journalTitle(day: HistoryDayScreenProjection) {
  return !getPlanDay(day.date) && day.requiresManualReview ? "Legacy / unattached records" : day.displayTitle;
}

function statusText(day: HistoryDayScreenProjection) {
  if (hasPartialKpiEvidence(day)) return "Partial";
  if (day.status === "sport_load_logged") return "Sport Load logged";
  if (day.status === "completed_with_deferred") return "Completed with deferred";
  if (day.status === "legacy_needs_review") return "Needs review";
  return day.status.replaceAll("_", " ");
}

function historySummary(day: HistoryDayScreenProjection) {
  if (day.requiresManualReview) return "Record exists but needs parent/operator review before it is attached to the approved plan.";
  const parts: string[] = [];
  if (day.groups.sportLoad.count > 0) parts.push(`${day.groups.sportLoad.count} Sport Load log${day.groups.sportLoad.count === 1 ? "" : "s"}`);
  if (day.groups.trainingWork.count > 0) parts.push(`${day.groups.trainingWork.count} Training Work record${day.groups.trainingWork.count === 1 ? "" : "s"}`);
  if (day.groups.kpi.count > 0) parts.push(kpiSummary(day));
  if (day.groups.reflection.count > 0) parts.push("reflection saved");
  return parts.length ? `${parts.join(" · ")}.` : "No record details available.";
}

function hasPartialKpiEvidence(day: HistoryDayScreenProjection) {
  const planned = getPlanDay(day.date)?.kpiTestIds?.length ?? 0;
  return planned > 0 && day.groups.kpi.count > 0 && day.groups.kpi.count < planned;
}

function kpiSummary(day: HistoryDayScreenProjection) {
  const planned = getPlanDay(day.date)?.kpiTestIds?.length ?? 0;
  if (planned > 0) return `${day.groups.kpi.count} of ${planned} planned KPI results recorded`;
  return `${day.groups.kpi.count} KPI result${day.groups.kpi.count === 1 ? "" : "s"}`;
}
