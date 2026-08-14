"use client";

import { useEffect, useState } from "react";
import { KPIEntryForm } from "@/components/KPIEntryForm";
import { KPIProtocolDetails } from "@/components/KPIProtocolDetails";
import { loadStandaloneKpiResults, type SyncedKPIResult } from "@/lib/storage/cloudKpiRepository";
import { kpis } from "@/lib/trainingData";
import { kpiBaseline, kpiBest } from "@/lib/trainingMetrics";

export function ScheduledKpiTest({ date, kpiIds }: { date: string; kpiIds: string[] }) {
  const [results, setResults] = useState<SyncedKPIResult[]>([]);
  const [historyStatus, setHistoryStatus] = useState("Loading prior results...");
  const refresh = () => loadStandaloneKpiResults().then((history) => {
    setResults(history.results);
    setHistoryStatus(history.warning || "Prior results loaded.");
  });
  useEffect(() => { void refresh(); }, []);
  return <section aria-label="KPI Test" className="space-y-4">
    <div className="card border-2 border-blue/30"><p className="label">KPI Test</p><h2 className="text-2xl font-black">14 comparable tests</h2><p className="mt-2 text-sm font-semibold text-slate-600">Enter each result here. If a test cannot be completed safely, mark it Deferred / Not Tested and record why.</p><p className="mt-2 text-xs font-semibold text-slate-500">{historyStatus}</p></div>
    {kpiIds.map((id, index) => {
      const kpi = kpis.find((candidate) => candidate.id === id);
      if (!kpi) return null;
      const history = results.filter((result) => result.kpiId === id && result.testStatus !== "deferred");
      const baseline = kpiBaseline(history);
      const best = kpiBest(kpi, history);
      return <article className="card" data-kpi-id={id} key={id}><p className="label">Test {index + 1} of {kpiIds.length}</p><h2 className="text-xl font-black">{kpi.name}</h2>{(baseline !== null || best !== null) && <p className="mt-2 text-sm font-bold text-blue">Prior baseline: {baseline ?? "—"} {kpi.units} · Best: {best ?? "—"} {kpi.units}</p>}<KPIProtocolDetails kpi={kpi} /><KPIEntryForm allowDeferred kpi={kpi} onSaved={refresh} resultDate={date} /></article>;
    })}
  </section>;
}
