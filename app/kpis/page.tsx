"use client";

import { useEffect, useState } from "react";
import { KPIEntryForm } from "@/components/KPIEntryForm";
import { kpis } from "@/lib/trainingData";
import { kpiBest, kpiTrend } from "@/lib/trainingMetrics";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { KPIResult } from "@/lib/types";

export default function KpisPage() {
  const [results, setResults] = useState<KPIResult[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const refresh = () => { setResults(localKpiRepository.getAll()); setEditingId(null); };
  useEffect(refresh, []);

  function remove(id: string) {
    if (!window.confirm("Delete this KPI result? This cannot be undone.")) return;
    localKpiRepository.delete(id);
    refresh();
  }

  return (
    <div>
      <div className="mb-6"><p className="label">Measure progress</p><h1 className="text-4xl font-black">KPI Dashboard</h1><p className="mt-2 text-slate-500">History and trends are stored on this browser. Use the same setup each time.</p></div>
      <div className="space-y-6">
        {kpis.map((kpi) => {
          const entries = results.filter((result) => result.kpiId === kpi.id);
          const recent = entries[0];
          const best = kpiBest(kpi, entries);
          const trend = kpiTrend(kpi, entries);
          return (
            <article className="card" key={kpi.id}>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{kpi.category}</p><h2 className="text-2xl font-black">{kpi.name}</h2></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black">{entries.length} entries</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-navy p-4 text-white sm:grid-cols-4">
                <div><p className="label text-slate-300">Recent</p><p className="font-black">{recent?.bestResult ?? "—"}</p></div>
                <div><p className="label text-slate-300">Best</p><p className="font-black">{best ?? "—"}</p></div>
                <div><p className="label text-slate-300">Trend</p><p className="font-black">{trend}</p></div>
                <div><p className="label text-slate-300">Units</p><p className="font-black">{kpi.units}</p></div>
              </div>
              <details><summary className="mt-4 cursor-pointer font-bold text-blue">Add a new KPI result</summary><KPIEntryForm kpi={kpi} onSaved={refresh} /></details>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-rink"><th className="p-2">Date/time</th><th className="p-2">Best</th><th className="p-2">Attempts</th><th className="p-2">Notes</th><th className="p-2">Actions</th></tr></thead><tbody>
                  {entries.map((entry) => <tr className="border-b border-rink/70 align-top" key={entry.id}><td className="p-2">{entry.enteredAt ? new Date(entry.enteredAt).toLocaleString() : entry.date}</td><td className="p-2 font-black">{entry.bestResult ?? "—"} {kpi.units}</td><td className="p-2">{entry.attempts.map((attempt, index) => <span className="mr-2 inline-block" key={index}>#{index + 1}: {attempt.result || "—"}</span>)}</td><td className="p-2">{entry.notes || "—"}</td><td className="p-2"><div className="flex gap-2"><button className="font-bold text-blue" onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}>Edit</button><button className="font-bold text-red-700" onClick={() => remove(entry.id)}>Delete</button></div></td></tr>)}
                  {!entries.length && <tr><td className="p-3 text-slate-500" colSpan={5}>No results entered yet.</td></tr>}
                </tbody></table>
              </div>
              {editingId && entries.some((entry) => entry.id === editingId) && <KPIEntryForm kpi={kpi} existing={entries.find((entry) => entry.id === editingId)} onSaved={refresh} />}
            </article>
          );
        })}
      </div>
    </div>
  );
}
