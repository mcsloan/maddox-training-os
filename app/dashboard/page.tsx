"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ParentDashboardCard } from "@/components/ParentDashboardCard";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { workouts } from "@/lib/trainingData";
import { SessionLog } from "@/lib/types";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  useEffect(() => setSessions(localSessionRepository.listAllSessions()), []);
  const completed = sessions.filter((session) => session.status === "completed");
  const readiness = sessions[0]?.readiness;
  const energy = readiness?.energy ? `${readiness.energy}/5` : "—";

  return (
    <div>
      <div className="mb-6"><p className="label">Parent / coach view</p><h1 className="text-4xl font-black">Dashboard</h1></div>
      <section className="grid gap-4 sm:grid-cols-3">
        <ParentDashboardCard label="Sessions" value={`${completed.length} / ${workouts.length}`} detail="Completed vs planned" />
        <ParentDashboardCard label="Latest energy" value={energy} detail="Pre-session readiness" />
        <ParentDashboardCard label="KPI direction" value="Baseline" detail="Trend preview starts after more tests" />
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="card">
          <div className="flex items-center justify-between"><h2 className="text-xl font-black">Weekly plan</h2><Link href="/exports" className="text-sm font-bold text-blue">Export</Link></div>
          <div className="mt-4 space-y-3">
            {workouts.map((workout) => <div key={workout.id} className="flex items-center justify-between gap-3 rounded-2xl bg-ice p-4"><div><p className="label">{workout.date}</p><p className="font-black">{workout.dayFocus}</p></div><span className="shrink-0 text-sm font-bold">{workout.totalEstimatedMinutes} min</span></div>)}
          </div>
        </article>
        <article className="card">
          <div className="flex items-center justify-between"><h2 className="text-xl font-black">Recent session logs</h2><Link href="/history" className="text-sm font-bold text-blue">View all</Link></div>
          <div className="mt-4 space-y-3">
            {sessions.length === 0 && <p className="rounded-2xl bg-ice p-4 text-slate-500">Session activity saved on this device will appear here.</p>}
            {sessions.slice(0, 5).map((session) => <Link href={`/session/${session.workoutId}?sessionId=${encodeURIComponent(session.id)}&mode=${session.status === "completed" ? "view" : "resume"}`} key={session.id} className="block rounded-2xl border border-rink p-4 hover:border-blue"><div className="flex justify-between gap-3"><p className="font-black">{workouts.find((workout) => workout.id === session.workoutId)?.dayFocus}</p><span className="text-sm font-bold capitalize text-blue">{session.status}</span></div><p className="mt-1 text-sm text-slate-500">{session.date} · {Object.values(session.exercises).filter((item) => item.done).length} drills done</p></Link>)}
          </div>
        </article>
      </section>
    </div>
  );
}
