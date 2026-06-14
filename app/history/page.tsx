"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { workouts } from "@/lib/trainingData";
import { SessionLog } from "@/lib/types";

function statusLabel(status: SessionLog["status"]) {
  if (status === "in-progress") return "In Progress";
  if (status === "reopened") return "Reopened";
  return "Completed";
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  useEffect(() => setSessions(localSessionRepository.listAllSessions()), []);

  function fresh(workoutId: string) {
    const session = localSessionRepository.startFreshAttempt(workoutId);
    if (session) router.push(`/session/${workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=resume`);
  }

  return (
    <div>
      <div className="mb-6"><p className="label">Saved on this browser</p><h1 className="text-4xl font-black">Session History</h1></div>
      <div className="space-y-4">
        {sessions.map((session) => {
          const workout = workouts.find((item) => item.id === session.workoutId);
          return <article className="card" key={session.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{new Date(session.startedAt).toLocaleString()}</p><h2 className="text-xl font-black">{workout?.dayFocus || "Unknown workout"}</h2></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black text-blue">{statusLabel(session.status)}</span></div><div className="mt-5 flex flex-wrap gap-2">{session.status === "completed" ? <><Link className="btn-secondary" href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=view`}>View</Link><Link className="btn-secondary" href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=reopen`}>Reopen / Edit</Link></> : <Link className="btn-primary" href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=resume`}>Resume</Link>}<button className="btn-secondary" onClick={() => fresh(session.workoutId)}>Start Fresh Attempt</button></div></article>;
        })}
        {workouts.filter((workout) => !sessions.some((session) => session.workoutId === workout.id)).map((workout) => <article className="card" key={workout.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{workout.date}</p><h2 className="text-xl font-black">{workout.dayFocus}</h2></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black text-slate-500">Not Started</span></div><Link className="btn-primary mt-5" href={`/session/${workout.id}`}>Start Session</Link></article>)}
      </div>
    </div>
  );
}
