"use client";

import { useEffect, useState } from "react";
import { KPIEntryForm } from "@/components/KPIEntryForm";
import { kpis } from "@/lib/trainingData";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { KPIResult } from "@/lib/types";

export default function KpisPage() {
  const [results, setResults] = useState<KPIResult[]>([]);
  const refresh = () => setResults(localKpiRepository.getAll());
  useEffect(refresh, []);

  return (
    <div>
      <div className="mb-6"><p className="label">Measure progress</p><h1 className="text-4xl font-black">KPI Dashboard</h1><p className="mt-2 text-slate-500">Use the same setup each time for useful comparisons.</p></div>
      <div className="grid gap-5 lg:grid-cols-2">
        {kpis.map((kpi) => {
          const entries = results.filter((result) => result.kpiId === kpi.id);
          const recent = entries[0];
          const bestValues = entries.map((entry) => entry.bestResult).filter((value): value is number => value !== null);
          const best = bestValues.length ? (kpi.scoringMethod === "lowest" ? Math.min(...bestValues) : Math.max(...bestValues)) : null;
          return (
            <article className="card" key={kpi.id}>
              <p className="label">{kpi.category}</p><h2 className="text-2xl font-black">{kpi.name}</h2>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-navy p-4 text-white">
                <div><p className="label text-slate-300">Recent</p><p className="font-black">{recent?.bestResult ?? "—"}</p></div>
                <div><p className="label text-slate-300">Best</p><p className="font-black">{best ?? "—"}</p></div>
                <div><p className="label text-slate-300">Trend</p><p className="font-black">{entries.length > 1 ? "Tracking" : "—"}</p></div>
              </div>
              <details><summary className="mt-4 cursor-pointer font-bold text-blue">Enter a new result</summary><KPIEntryForm kpi={kpi} onSaved={refresh} /></details>
              <p className="mt-4 text-sm text-slate-500">{recent?.notes || kpi.coachingNotes.join(" ")}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
