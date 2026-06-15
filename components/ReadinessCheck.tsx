"use client";

import { Rating, Readiness } from "@/lib/types";

export function ReadinessCheck({ value, onChange }: { value: Readiness; onChange: (value: Readiness) => void }) {
  return (
    <article className="card">
      <p className="label">Before training</p>
      <h2 className="text-3xl font-black">How are you feeling?</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {(["energy", "soreness", "focus"] as const).map((key) => (
          <label key={key}>
            <span className="label">{key}</span>
            <select className="field" value={value[key] ?? ""} onChange={(event) => onChange({ ...value, [key]: event.target.value ? Number(event.target.value) as Rating : null })}>
              <option value="">Choose 1-5</option>
              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} / 5</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label><span className="label">Morning resting heart rate (optional BPM)</span><input className="field" type="number" inputMode="numeric" min="30" max="220" value={value.restingHeartRate ?? ""} onChange={(event) => onChange({ ...value, restingHeartRate: event.target.value ? Number(event.target.value) : null })} /></label>
        <label><span className="label">Sleep hours (optional)</span><input className="field" type="number" inputMode="decimal" min="0" max="24" step="0.25" value={value.sleepHours ?? ""} onChange={(event) => onChange({ ...value, sleepHours: event.target.value ? Number(event.target.value) : null })} /></label>
      </div>
      <label className="mt-4 block"><span className="label">Readiness notes (optional)</span><textarea className="field min-h-20" value={value.notes ?? ""} onChange={(event) => onChange({ ...value, notes: event.target.value })} /></label>
      <p className="mt-5 rounded-xl bg-ice p-3 text-sm font-semibold">Resting heart rate is a trend signal. If it rises above baseline with low energy or soreness, reduce load. Tell a parent before training if anything hurts or soreness is high.</p>
    </article>
  );
}
