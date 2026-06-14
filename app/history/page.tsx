"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataStatus } from "@/components/DataStatus";
import { DataMode, loadTrainingHistory } from "@/lib/storage/completedSessionRepository";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { workouts } from "@/lib/trainingData";
import { sessionCompletionPercent, workoutName } from "@/lib/trainingMetrics";
import { ExternalLoadLog, SessionLog } from "@/lib/types";

function statusLabel(status: SessionLog["status"]) {
  if (status === "in-progress") return "In Progress";
  if (status === "reopened") return "Reopened";
  return "Completed";
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [externalLogs, setExternalLogs] = useState<ExternalLoadLog[]>([]);
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
    return () => { active = false; };
  }, []);

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
        <div className="flex items-center justify-between gap-3"><div><p className="label">Separate from training sessions</p><h2 className="text-2xl font-black">External Load Logs</h2></div><Link className="text-sm font-bold text-blue" href="/calendar">Calendar</Link></div>
        <div className="mt-4 space-y-3">{externalLogs.slice(0, 8).map((log) => <Link className="block rounded-2xl border border-rink p-4 hover:border-blue" href={`/external-load/${log.externalLoadId}`} key={log.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{new Date(`${log.date}T12:00:00`).toLocaleDateString()} · External Load Log</p><p className="font-black">{log.title}</p></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black text-blue">{log.attended ? "Attended" : "Did not attend"}</span></div><p className="mt-2 text-sm">Effort {log.effort ?? "—"}/5 · Energy {log.energyAfter ?? "—"}/5 · Confidence {log.confidence ?? "—"}/5 · Soreness {log.soreness}/5{log.painFlag ? " · Pain flagged" : ""}</p></Link>)}{!externalLogs.length && <p className="text-slate-500">No external load logs saved yet.</p>}</div>
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
