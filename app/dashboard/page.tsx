"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DataStatus } from "@/components/DataStatus";
import { ParentDashboardCard } from "@/components/ParentDashboardCard";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { DataMode, loadTrainingHistory } from "@/lib/storage/completedSessionRepository";
import { kpis, workouts } from "@/lib/trainingData";
import { kpiTrend, sessionCompletionPercent, workoutName } from "@/lib/trainingMetrics";
import { KPIResult, SessionLog } from "@/lib/types";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [results, setResults] = useState<KPIResult[]>([]);
  const [dataMode, setDataMode] = useState<DataMode>("local");
  const [warning, setWarning] = useState("Checking completed training history...");
  useEffect(() => {
    let active = true;
    setResults(localKpiRepository.getAll());
    loadTrainingHistory().then((result) => {
      if (!active) return;
      setSessions(result.sessions);
      setDataMode(result.mode);
      setWarning(result.warning);
    });
    return () => { active = false; };
  }, []);
  const completed = sessions.filter((session) => session.status === "completed");
  const active = sessions.filter((session) => session.status !== "completed");
  const latest = sessions[0];
  const missed = workouts.filter((workout) => !sessions.some((session) => session.workoutId === workout.id));
  const needsAttention = [
    ...missed.map((workout) => `Not started: ${workout.dayFocus}`),
    ...active.map((session) => `Incomplete session: ${workoutName(workouts.find((workout) => workout.id === session.workoutId))} (${sessionCompletionPercent(session)}%)`),
    ...sessions.filter((session) => session.readiness.energy !== null && session.readiness.energy <= 2).map(() => "Low pre-session energy recorded"),
    ...sessions.filter((session) => session.reflection.confidence !== null && session.reflection.confidence <= 2).map(() => "Low confidence reflection recorded"),
  ];

  return (
    <div>
      <div className="mb-6"><p className="label">Parent / coach view</p><h1 className="text-4xl font-black">Dashboard</h1></div>
      <DataStatus mode={dataMode} warning={warning} />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ParentDashboardCard label="Weekly summary" value={`${completed.length} complete`} detail={`${sessions.length} available attempts`} />
        <ParentDashboardCard label="Planned vs completed" value={`${completed.length} / ${workouts.length}`} detail={`${missed.length} workouts not started`} />
        <ParentDashboardCard label="Latest energy" value={latest?.readiness.energy ? `${latest.readiness.energy}/5` : "—"} detail="Pre-session readiness" />
        <ParentDashboardCard label="Latest confidence" value={latest?.reflection.confidence ? `${latest.reflection.confidence}/5` : "—"} detail="Post-session reflection" />
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="card"><h2 className="text-xl font-black">Needs attention</h2><div className="mt-4 space-y-2">{needsAttention.slice(0, 6).map((item, index) => <p className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900" key={`${item}-${index}`}>{item}</p>)}{!needsAttention.length && <p className="rounded-xl bg-lime/30 p-3 font-semibold">No current attention flags.</p>}</div></article>
        <article className="card"><h2 className="text-xl font-black">Quick links</h2><div className="mt-4 grid grid-cols-2 gap-3"><Link className="btn-primary" href="/today">Today</Link><Link className="btn-secondary" href="/history">History</Link><Link className="btn-secondary" href="/kpis">KPIs</Link><Link className="btn-secondary" href="/exports">Exports</Link><Link className="btn-secondary col-span-2" href="/compatibility">Debug / Compatibility</Link></div></article>
        <article className="card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Weekly plan</h2><Link href="/exports" className="text-sm font-bold text-blue">Export</Link></div><div className="mt-4 space-y-3">{workouts.map((workout) => { const done = sessions.some((session) => session.workoutId === workout.id && session.status === "completed"); return <div key={workout.id} className="flex items-center justify-between gap-3 rounded-2xl bg-ice p-4"><div><p className="label">{workout.date}</p><p className="font-black">{workout.dayFocus}</p></div><span className="shrink-0 text-sm font-bold">{done ? "Completed" : `${workout.totalEstimatedMinutes} min`}</span></div>; })}</div></article>
        <article className="card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Recent attempts</h2><Link href="/history" className="text-sm font-bold text-blue">View all</Link></div><div className="mt-4 space-y-3">{sessions.slice(0, 5).map((session) => <Link href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=${session.status === "completed" ? "view" : "resume"}`} key={session.id} className="block rounded-2xl border border-rink p-4 hover:border-blue"><div className="flex justify-between gap-3"><p className="font-black">{workoutName(workouts.find((workout) => workout.id === session.workoutId))}</p><span className="text-sm font-bold capitalize text-blue">{session.status}</span></div><p className="mt-1 text-sm text-slate-500">{new Date(session.startedAt).toLocaleString()} · {sessionCompletionPercent(session)}% complete</p></Link>)}{!sessions.length && <p className="text-slate-500">No attempts saved yet.</p>}</div></article>
      </section>
      <section className="card mt-6"><div className="flex items-center justify-between"><h2 className="text-xl font-black">KPI summary</h2><Link href="/kpis" className="text-sm font-bold text-blue">Open KPIs</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{kpis.map((kpi) => { const entries = results.filter((result) => result.kpiId === kpi.id); return <div className="rounded-2xl bg-ice p-4" key={kpi.id}><p className="font-black">{kpi.name}</p><p className="mt-2 text-sm">Recent: <strong>{entries[0]?.bestResult ?? "—"}</strong> · {kpiTrend(kpi, entries)}</p></div>; })}</div></section>
    </div>
  );
}
