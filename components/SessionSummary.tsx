"use client";

import Link from "next/link";
import { Drill, KPI, SessionLog, Workout } from "@/lib/types";

function display(value: number | null, unit = "") {
  return value === null ? "—" : `${value}${unit}`;
}

export function SessionSummary({ workout, session, drills, kpis, onReopen, onFresh }: { workout: Workout; session: SessionLog; drills: Drill[]; kpis: KPI[]; onReopen: () => void; onFresh: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <article className="card bg-navy text-white">
        <p className="label text-lime">Completed session</p>
        <h1 className="text-4xl font-black">{workout.dayFocus}</h1>
        <p className="mt-3 text-slate-300">Started {new Date(session.startedAt).toLocaleString()} · Completed {session.completedAt ? new Date(session.completedAt).toLocaleString() : "—"}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn-primary bg-lime text-navy hover:bg-white" onClick={onReopen}>Reopen / Edit</button>
          <button className="btn-secondary border-white/30 bg-white/10 text-white" onClick={onFresh}>Start Fresh Attempt</button>
          <Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/history">Session History</Link>
        </div>
      </article>
      <article className="card">
        <h2 className="text-2xl font-black">Drill summary</h2>
        <div className="mt-4 space-y-3">
          {drills.map((drill) => {
            const result = session.exercises[drill.id];
            return <div key={drill.id} className="rounded-2xl bg-ice p-4"><div className="flex justify-between gap-3"><p className="font-black">{drill.name}</p><span className="font-bold">{result?.done ? "Done" : "Not done"}</span></div><p className="mt-2 text-sm text-slate-600">Sets {display(result?.actualSets ?? null)} · Reps {display(result?.actualReps ?? null)} · Time {display(result?.actualDuration ?? null, " sec")} · Distance {display(result?.actualDistance ?? null)}</p>{result?.notes && <p className="mt-2 text-sm"><strong>Notes:</strong> {result.notes}</p>}</div>;
          })}
        </div>
      </article>
      <article className="card">
        <h2 className="text-2xl font-black">KPI results</h2>
        <div className="mt-4 space-y-3">
          {kpis.length === 0 && <p className="text-slate-500">No KPI tests planned for this workout.</p>}
          {kpis.map((kpi) => <div key={kpi.id} className="rounded-2xl bg-ice p-4"><p className="font-black">{kpi.name}</p><p className="mt-1 text-sm">Best: {session.kpiResults[kpi.id]?.bestResult ?? "—"} {kpi.units}</p><p className="mt-1 text-sm text-slate-600">{session.kpiResults[kpi.id]?.notes || "No notes"}</p></div>)}
        </div>
      </article>
      <article className="card">
        <h2 className="text-2xl font-black">Reflection</h2>
        <p className="mt-3">Energy {display(session.reflection.energy)} / 5 · Confidence {display(session.reflection.confidence)} / 5 · Difficulty {display(session.reflection.difficulty)} / 5</p>
        <p className="mt-3"><strong>Improved:</strong> {session.reflection.improvement || "—"}</p>
        <p className="mt-2"><strong>Notes:</strong> {session.reflection.notes || "—"}</p>
      </article>
    </div>
  );
}
