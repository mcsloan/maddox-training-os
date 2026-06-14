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
      <p className="mt-5 rounded-xl bg-ice p-3 text-sm font-semibold">Tell a parent before training if anything hurts or soreness is high.</p>
    </article>
  );
}
