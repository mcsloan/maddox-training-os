"use client";

import { useState } from "react";
import { KPI, KPIAttempt, KPIResult } from "../lib/types";
import { readableError } from "../lib/errorMessage";
import { calculateShuttleTotalMetres } from "../lib/kpiShuttle";
import { saveStandaloneKpiResult } from "../lib/storage/cloudKpiRepository";

const SHUTTLE_KPI_ID = "kpi-45-second-shuttle";

export function KPIEntryForm({ kpi, onSaved, existing }: { kpi: KPI; onSaved: () => void; existing?: KPIResult }) {
  const empty = Array.from({ length: kpi.attempts }, () => ({ result: "" }));
  const [attempts, setAttempts] = useState<KPIAttempt[]>(existing?.attempts || empty);
  const [notes, setNotes] = useState(existing?.notes || "");
  const [shuttleLengths, setShuttleLengths] = useState(String(existing?.attempts?.[0]?.completed10mLengths ?? ""));
  const [shuttlePartial, setShuttlePartial] = useState(String(existing?.attempts?.[0]?.partialFinalMetres ?? ""));
  const [status, setStatus] = useState("Ready");
  const [saving, setSaving] = useState(false);

  const isShuttle = kpi.id === SHUTTLE_KPI_ID;
  const shuttleTotal = isShuttle ? calculateShuttleTotalMetres(shuttleLengths, shuttlePartial) : null;
  const displayAttempts = isShuttle
    ? [{ result: shuttleTotal === null ? "" : shuttleTotal, completed10mLengths: shuttleLengths, partialFinalMetres: shuttlePartial }]
    : attempts;
  const values = attempts.map((attempt) => Number(attempt.result)).filter((value) => Number.isFinite(value) && value > 0);
  const best = isShuttle ? shuttleTotal : values.length ? (kpi.scoringMethod === "lowest" ? Math.min(...values) : Math.max(...values)) : null;

  function updateShuttle(completedLengths: string, partialMetres: string) {
    setShuttleLengths(completedLengths);
    setShuttlePartial(partialMetres);
    const total = calculateShuttleTotalMetres(completedLengths, partialMetres);
    setAttempts([{ result: total === null ? "" : total, completed10mLengths: completedLengths, partialFinalMetres: partialMetres }]);
  }

  async function save() {
    setSaving(true);
    setStatus("Saving local backup...");
    const result = {
      id: existing?.id || `${kpi.id}-${Date.now()}`,
      kpiId: kpi.id,
      date: existing?.date || new Date().toISOString().slice(0, 10),
      enteredAt: existing?.enteredAt || new Date().toISOString(),
      attempts: displayAttempts,
      bestResult: best,
      notes,
    } satisfies KPIResult;

    try {
      const saved = await saveStandaloneKpiResult(result);
      setStatus(saved.mode === "cloud" ? "Cloud synced" : "Local only / pending sync");
      onSaved();
    } catch (reason) {
      setStatus(`Sync failed. Local only / pending sync: ${readableError(reason)}`);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl bg-ice p-4">
      <p className="label">New test · {kpi.units}</p>
      {isShuttle ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <label><span className="label">Completed 10m lengths</span><input className="field" type="number" inputMode="numeric" min="0" step="1" value={shuttleLengths} onChange={(event) => updateShuttle(event.target.value, shuttlePartial)} /></label>
          <label><span className="label">Partial final metres</span><input className="field" type="number" inputMode="decimal" min="0" max="9.99" step="0.01" value={shuttlePartial} onChange={(event) => updateShuttle(shuttleLengths, event.target.value)} /></label>
          <div className="rounded-xl bg-white p-3"><p className="label">Computed total</p><p className="text-xl font-black">{shuttleTotal ?? "—"} {shuttleTotal !== null ? "metres" : ""}</p></div>
          <p className="sm:col-span-3 text-sm font-semibold text-slate-600">Example: 10 completed lengths + 0.73m partial = 100.73m. This total saves as the existing numeric KPI result.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {attempts.map((attempt, index) => (
            <label key={index}><span className="label">Attempt {index + 1} {kpi.fields[0]?.label ? `· ${kpi.fields[0].label}` : ""}</span><input className="field" type="number" inputMode="decimal" value={attempt.result} onChange={(event) => setAttempts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, result: event.target.value } : item))} /></label>
          ))}
        </div>
      )}
      <label className="mt-3 block"><span className="label">Notes</span><input className="field" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-black">Best: {best ?? "—"} {best !== null ? kpi.units : ""}</p>
        <button className="btn-primary" disabled={best === null || saving} onClick={save}>{saving ? "Saving..." : existing ? "Update Result" : "Save Result"}</button>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-600">{status}</p>
    </div>
  );
}
