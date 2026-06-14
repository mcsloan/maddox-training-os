"use client";

import { KPI, KPIAttempt, KPIResult } from "@/lib/types";

export function SessionKPIForm({ kpi, result, onChange }: { kpi: KPI; result?: KPIResult; onChange: (result: KPIResult) => void }) {
  const attempts = result?.attempts || Array.from({ length: kpi.attempts }, () => ({ result: "" }));
  const values = attempts.map((attempt) => Number(attempt.result)).filter((value) => Number.isFinite(value) && value > 0);
  const best = values.length ? (kpi.scoringMethod === "lowest" ? Math.min(...values) : Math.max(...values)) : null;

  function update(nextAttempts: KPIAttempt[], notes = result?.notes || "") {
    onChange({
      id: result?.id || `${kpi.id}-${Date.now()}`,
      kpiId: kpi.id,
      date: result?.date || new Date().toISOString().slice(0, 10),
      enteredAt: result?.enteredAt || new Date().toISOString(),
      attempts: nextAttempts,
      bestResult: (() => {
        const nextValues = nextAttempts.map((attempt) => Number(attempt.result)).filter((value) => Number.isFinite(value) && value > 0);
        return nextValues.length ? (kpi.scoringMethod === "lowest" ? Math.min(...nextValues) : Math.max(...nextValues)) : null;
      })(),
      notes,
    });
  }

  return (
    <article className="card">
      <p className="label">{kpi.category} KPI</p>
      <h2 className="text-3xl font-black">{kpi.name}</h2>
      <ol className="mt-4 list-inside list-decimal space-y-1 text-slate-600">
        {kpi.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
      </ol>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {attempts.map((attempt, index) => (
          <label key={index}>
            <span className="label">Attempt {index + 1} · {kpi.units}</span>
            <input className="field" type="number" inputMode="decimal" value={attempt.result} onChange={(event) => update(attempts.map((item, itemIndex) => itemIndex === index ? { ...item, result: event.target.value } : item))} />
          </label>
        ))}
      </div>
      <label className="mt-4 block"><span className="label">KPI notes</span><textarea className="field min-h-20" value={result?.notes || ""} onChange={(event) => update(attempts, event.target.value)} /></label>
      <p className="mt-4 rounded-xl bg-ice p-4 text-xl font-black">Best: {best ?? "—"} {best !== null ? kpi.units : ""}</p>
    </article>
  );
}
