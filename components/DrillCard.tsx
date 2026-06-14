"use client";

import { Drill, ExerciseCompletion, Rating } from "@/lib/types";
import { SessionTimer } from "./SessionTimer";

export function DrillCard({ drill, completion, onChange }: { drill: Drill; completion: ExerciseCompletion; onChange: (next: ExerciseCompletion) => void }) {
  const update = (patch: Partial<ExerciseCompletion>) => onChange({ ...completion, ...patch });

  return (
    <article className="card">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-ice px-3 py-1 text-xs font-black uppercase tracking-wide text-blue">{drill.category}</span>
          <h2 className="mt-3 text-3xl font-black leading-tight">{drill.name}</h2>
          <p className="mt-2 text-slate-600">{drill.purpose}</p>
        </div>
        {completion.done && <span className="rounded-full bg-lime px-3 py-1 text-sm font-black">DONE</span>}
      </div>

      <div className="mb-5 grid gap-3 rounded-2xl bg-ice p-4 sm:grid-cols-3">
        <div><p className="label">Plan</p><p className="font-bold">{drill.plannedSets ? `${drill.plannedSets} sets` : "Quality reps"}{drill.plannedReps ? ` × ${drill.plannedReps}` : ""}</p></div>
        <div><p className="label">Time</p><p className="font-bold">{drill.plannedDuration ? `${drill.plannedDuration} sec` : "Untimed"}</p></div>
        <div><p className="label">Equipment</p><p className="font-bold">{drill.equipment.join(", ")}</p></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="label">Setup</p>
          <p>{drill.setup}</p>
          <p className="label mt-5">Do it</p>
          <ol className="list-inside list-decimal space-y-2">
            {drill.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
          </ol>
          <p className="label mt-5">Coach cues</p>
          <div className="flex flex-wrap gap-2">
            {drill.coachingCues.map((cue) => <span key={cue} className="rounded-full bg-lime/60 px-3 py-1 text-sm font-bold">{cue}</span>)}
          </div>
          <details className="mt-5 rounded-xl border border-rink p-3">
            <summary className="cursor-pointer font-bold">More details</summary>
            <p className="label mt-3">Common mistakes</p>
            <p>{drill.commonMistakes.join(" · ")}</p>
            <p className="label mt-3">Safety</p>
            <p>{drill.safetyNotes}</p>
          </details>
        </div>
        <div className="space-y-4">
          {drill.plannedDuration && <SessionTimer initialSeconds={completion.actualDuration || 0} onChange={(actualDuration) => update({ actualDuration })} />}
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Actual sets</span><input className="field" type="number" inputMode="numeric" value={completion.actualSets ?? ""} onChange={(event) => update({ actualSets: event.target.value ? Number(event.target.value) : null })} /></label>
            <label><span className="label">Actual reps</span><input className="field" type="number" inputMode="numeric" value={completion.actualReps ?? ""} onChange={(event) => update({ actualReps: event.target.value ? Number(event.target.value) : null })} /></label>
            <label><span className="label">Time (sec)</span><input className="field" type="number" inputMode="numeric" value={completion.actualDuration ?? ""} onChange={(event) => update({ actualDuration: event.target.value ? Number(event.target.value) : null })} /></label>
            <label><span className="label">Distance</span><input className="field" type="number" inputMode="decimal" value={completion.actualDistance ?? ""} onChange={(event) => update({ actualDistance: event.target.value ? Number(event.target.value) : null })} /></label>
          </div>
          <label><span className="label">Difficulty</span><select className="field" value={completion.difficulty ?? ""} onChange={(event) => update({ difficulty: event.target.value ? Number(event.target.value) as Rating : null })}><option value="">Choose 1-5</option>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select></label>
          <label><span className="label">Quick note</span><textarea className="field min-h-20" value={completion.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Optional" /></label>
          <button className={`min-h-16 w-full rounded-2xl text-xl font-black ${completion.done ? "bg-lime text-navy" : "bg-blue text-white"}`} onClick={() => update({ done: !completion.done })}>
            {completion.done ? "Completed ✓" : "Mark Done"}
          </button>
        </div>
      </div>
    </article>
  );
}
