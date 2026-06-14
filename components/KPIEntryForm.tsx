"use client";

import { useState } from "react";
import { KPI, KPIAttempt, KPIResult } from "@/lib/types";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";

export function KPIEntryForm({ kpi, onSaved }: { kpi: KPI; onSaved: () => void }) {
  const empty = Array.from({ length: kpi.attempts }, () => ({ result: "" }));
  const [attempts, setAttempts] = useState<KPIAttempt[]>(empty);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const values = attempts.map((attempt) => Number(attempt.result)).filter((value) => Number.isFinite(value) && value > 0);
  const best = values.length ? (kpi.scoringMethod === "lowest" ? Math.min(...values) : Math.max(...values)) : null;

  function save() {
    localKpiRepository.save({
      id: `${kpi.id}-${Date.now()}`,
      kpiId: kpi.id,
      date: new Date().toISOString().slice(0, 10),
      attempts,
      bestResult: best,
      notes,
    } satisfies KPIResult);
    setSaved(true);
    onSaved();
  }

  return (
    <div className="mt-5 rounded-2xl bg-ice p-4">
      <p className="label">New test · {kpi.units}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {attempts.map((attempt, index) => (
          <label key={index}><span className="label">Attempt {index + 1}</span><input className="field" type="number" inputMode="decimal" value={attempt.result} onChange={(event) => setAttempts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, result: event.target.value } : item))} /></label>
        ))}
      </div>
      <label className="mt-3 block"><span className="label">Notes</span><input className="field" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-black">Best: {best ?? "—"} {best !== null ? kpi.units : ""}</p>
        <button className="btn-primary" disabled={best === null} onClick={save}>{saved ? "Saved" : "Save Result"}</button>
      </div>
    </div>
  );
}
