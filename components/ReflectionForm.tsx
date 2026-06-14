"use client";

import { Rating, Reflection } from "@/lib/types";

export function ReflectionForm({ value, onChange }: { value: Reflection; onChange: (value: Reflection) => void }) {
  return (
    <article className="card">
      <p className="label">Finish strong</p>
      <h2 className="text-3xl font-black">Quick reflection</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {(["energy", "confidence", "difficulty"] as const).map((key) => (
          <label key={key}><span className="label">{key}</span><select className="field" value={value[key] ?? ""} onChange={(event) => onChange({ ...value, [key]: event.target.value ? Number(event.target.value) as Rating : null })}><option value="">Choose 1-5</option>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select></label>
        ))}
      </div>
      <label className="mt-4 block"><span className="label">One thing I improved today</span><input className="field" value={value.improvement} onChange={(event) => onChange({ ...value, improvement: event.target.value })} /></label>
      <label className="mt-4 block"><span className="label">Notes</span><textarea className="field min-h-24" value={value.notes} onChange={(event) => onChange({ ...value, notes: event.target.value })} /></label>
    </article>
  );
}
