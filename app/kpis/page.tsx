"use client";

import { useEffect, useState } from "react";
import { KPIEntryForm } from "@/components/KPIEntryForm";
import { KPIProtocolDetails } from "@/components/KPIProtocolDetails";
import Link from "next/link";
import packageJson from "@/package.json";
import { readableError } from "@/lib/errorMessage";
import { buildKpiHydratedExport } from "@/lib/kpiExport";
import { kpiNextTestDate, kpiTargetDisplay } from "@/lib/kpiDisplay";
import { formatPlanDate, kpis, trainingPlan, userFacingPlanText } from "@/lib/trainingData";
import { kpiBaseline, kpiBest, kpiTargetProgress, kpiTrend } from "@/lib/trainingMetrics";
import { deleteStandaloneKpiResult, loadStandaloneKpiResults, SyncedKPIResult } from "@/lib/storage/cloudKpiRepository";

export default function KpisPage() {
  const [results, setResults] = useState<SyncedKPIResult[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState("Loading KPI history...");
  const [exportStatus, setExportStatus] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const environmentBadge = `v${packageJson.version} · ${(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_LOCAL_GIT_COMMIT_SHA || "local").slice(0, 7)} · ${process.env.NEXT_PUBLIC_VERCEL_ENV || "local"}`;
  const refresh = () => {
    loadStandaloneKpiResults().then((result) => {
      setResults(result.results);
      setSyncStatus(result.warning || (result.mode === "cloud" ? "Cloud synced" : "Local only / pending sync"));
      setEditingId(null);
    });
  };
  useEffect(refresh, []);

  async function remove(id: string) {
    if (!window.confirm("Delete this KPI result? This cannot be undone.")) return;
    try {
      const result = await deleteStandaloneKpiResult(id);
      setSyncStatus(result.mode === "cloud" ? "Cloud synced" : "Local only / pending sync");
      refresh();
    } catch (reason) {
      setSyncStatus(`Delete sync failed. Result was not removed from cloud: ${readableError(reason)}`);
    }
  }

  function buildExportJson() {
    const generatedAt = new Date().toISOString();
    const pageUrl = typeof window === "undefined" ? "/kpis" : window.location.href;
    return JSON.stringify(buildKpiHydratedExport({
      generatedAt,
      environmentBadge,
      cloudSyncStatus: syncStatus,
      pageUrl,
      kpis,
      days: trainingPlan.days,
      results,
      today,
    }), null, 2);
  }

  async function copyKpiJson() {
    try {
      await navigator.clipboard.writeText(buildExportJson());
      setExportStatus("KPI JSON copied");
    } catch {
      setExportStatus("Unable to copy JSON");
    }
  }

  function downloadKpiJson() {
    const blob = new Blob([buildExportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `maddox-kpi-export-${today}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setExportStatus("KPI JSON downloaded");
  }

  return (
    <div>
      <div className="mb-6"><p className="label">Measure progress</p><h1 className="text-4xl font-black">KPI Dashboard</h1><p className="mt-2 text-slate-500">History and trends sync to cloud when available. Use the same setup each time.</p><p className="mt-2 text-sm font-bold text-blue">{syncStatus}</p></div>
      <section className="card mb-6 border-2 border-blue/20 bg-ice">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label">KPI JSON export</p>
            <h2 className="text-xl font-black">Export visible KPI data</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">Generated from the hydrated KPI page state currently rendering the scoreboard and result rows.</p>
            <p className="mt-2 text-xs font-bold text-slate-500">{environmentBadge}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" onClick={copyKpiJson}>Copy KPI JSON</button>
            <button className="btn-primary" onClick={downloadKpiJson}>Download KPI JSON</button>
          </div>
        </div>
        {exportStatus && <p className="mt-3 text-sm font-black text-blue">{exportStatus}</p>}
      </section>
      <section className="card mb-6 border-2 border-cyan-200"><h2 className="text-xl font-black">Planned KPI Checkpoints</h2><div className="mt-4 rounded-2xl bg-cyan-50 p-4 text-sm"><p className="font-black">Beat your best cleanly.</p><p>Clean technique beats ugly numbers.</p><p className="font-semibold text-red-700">Do not test hard if sore, sick, tired, or low energy.</p></div><div className="mt-4 space-y-3">{trainingPlan.days.filter((day) => day.kpiTestIds?.length).map((day) => <Link className="block rounded-2xl bg-ice p-4 hover:ring-2 hover:ring-blue" href={`/day/${day.date}`} key={day.date}><p className="label">{formatPlanDate(day.date)} · Week {day.weekNumber}</p><p className="font-black">{day.primarySession}</p><p className="mt-2 text-sm text-amber-900">{userFacingPlanText(day.recoveryRule)}</p></Link>)}</div></section>
      <section className="card mb-6">
        <p className="label">Plan vs actual</p><h2 className="text-2xl font-black">Offseason KPI Scoreboard</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-rink"><th className="p-2">KPI</th><th className="p-2">Direction</th><th className="p-2">Baseline</th><th className="p-2">Current best</th><th className="p-2">Target</th><th className="p-2">Next test</th><th className="p-2">Progress</th></tr></thead><tbody>{kpis.map((kpi) => {
          const entries = results.filter((result) => result.kpiId === kpi.id);
          const baseline = kpiBaseline(entries);
          const best = kpiBest(kpi, entries);
          const progress = kpiTargetProgress(kpi, baseline, best);
          const nextTestDate = kpiNextTestDate(kpi, trainingPlan.days, today);
          return <tr className="border-b border-rink/70" key={kpi.id}><td className="p-2 font-black">{kpi.name}</td><td className="p-2">{kpi.scoringMethod === "lowest" ? "Lower is better" : "Higher is better"}</td><td className="p-2">{valueLabel(baseline, kpi.units)}</td><td className="p-2">{valueLabel(best, kpi.units)}</td><td className="p-2">{kpiTargetDisplay(kpi)}</td><td className="p-2">{nextTestDate ? formatPlanDate(nextTestDate) : "No future test"}</td><td className="p-2"><ProgressBar progress={progress} /></td></tr>;
        })}</tbody></table></div>
      </section>
      <div className="space-y-6">
        {kpis.map((kpi) => {
          const entries = results.filter((result) => result.kpiId === kpi.id);
          const recent = entries[0];
          const baseline = kpiBaseline(entries);
          const best = kpiBest(kpi, entries);
          const trend = kpiTrend(kpi, entries);
          const progress = kpiTargetProgress(kpi, baseline, best);
          const nextTestDate = kpiNextTestDate(kpi, trainingPlan.days, today);
          return (
            <article className="card" key={kpi.id}>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">{kpi.category} · {kpi.scoringMethod === "lowest" ? "Lower is better" : "Higher is better"}</p><h2 className="text-2xl font-black">{kpi.name}</h2><p className="mt-1 text-sm font-semibold text-blue">{kpi.motivationalCue}</p></div><span className="rounded-full bg-ice px-3 py-1 text-sm font-black">{entries.length} entries</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-navy p-4 text-white sm:grid-cols-3 lg:grid-cols-6">
                <div><p className="label text-slate-300">Baseline</p><p className="font-black">{baseline ?? "—"}</p></div>
                <div><p className="label text-slate-300">Recent</p><p className="font-black">{recent?.bestResult ?? "—"}</p></div>
                <div><p className="label text-slate-300">Best</p><p className="font-black">{best ?? "—"}</p></div>
                <div><p className="label text-slate-300">Target</p><p className="font-black">{kpiTargetDisplay(kpi)}</p></div>
                <div><p className="label text-slate-300">Trend</p><p className="font-black">{trend}</p></div>
                <div><p className="label text-slate-300">Next test</p><p className="font-black">{nextTestDate ? formatPlanDate(nextTestDate, { month: "short", day: "numeric" }) : "—"}</p></div>
              </div>
              <div className="mt-4 rounded-2xl bg-cyan-50 p-4"><div className="flex justify-between gap-3 text-sm font-bold"><span>Baseline-to-target progress</span><span>{progress}%</span></div><ProgressBar progress={progress} /><p className="mt-2 text-xs text-slate-600">{kpi.targetLabel}. Target values are planning settings and can be adjusted without changing historical results.</p></div>
              <KPIProtocolDetails kpi={kpi} />
              <details><summary className="mt-4 cursor-pointer font-bold text-blue">Add a new KPI result</summary><KPIEntryForm kpi={kpi} onSaved={refresh} /></details>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-rink"><th className="p-2">Date/time</th><th className="p-2">Best</th><th className="p-2">Attempts</th><th className="p-2">Notes</th><th className="p-2">Actions</th></tr></thead><tbody>
                  {entries.map((entry) => <tr className="border-b border-rink/70 align-top" key={entry.id}><td className="p-2">{entry.enteredAt ? new Date(entry.enteredAt).toLocaleString() : entry.date}<p className="mt-1 text-xs font-bold text-slate-500">{entry.syncState === "cloud" ? "Cloud synced" : "Local only / pending sync"}</p></td><td className="p-2 font-black">{entry.bestResult ?? "—"} {kpi.units}</td><td className="p-2">{entry.attempts.map((attempt, index) => <span className="mr-2 inline-block" key={index}>#{index + 1}: {attempt.result || "—"}</span>)}</td><td className="p-2">{entry.notes || "—"}</td><td className="p-2"><div className="flex gap-2"><button className="font-bold text-blue" onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}>Edit</button><button className="font-bold text-red-700" onClick={() => remove(entry.id)}>Delete</button></div></td></tr>)}
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

function valueLabel(value: number | null, units: string) {
  return value === null ? "—" : `${value} ${units}`;
}

function ProgressBar({ progress }: { progress: number }) {
  return <div className="mt-1 h-2 min-w-24 overflow-hidden rounded-full bg-slate-200" aria-label={`${progress}% toward target`}><div className="h-full rounded-full bg-cyan-600" style={{ width: `${progress}%` }} /></div>;
}
