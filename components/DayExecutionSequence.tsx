import Link from "next/link";
import { V84DayExecutionPlanEntry } from "@/lib/imports/v8_4/types";

function durationLabel(minutes: number | null) {
  return minutes ? `${minutes} min` : "Duration to confirm";
}

function entryTone(entry: V84DayExecutionPlanEntry) {
  if (entry.logType === "sportLoadLog" || entry.entryType.toLowerCase().includes("sport")) {
    return "border-indigo-200 bg-indigo-50";
  }
  if (entry.logType === "trainingWorkLog") return "border-rink bg-white";
  if (entry.logType === "kpiLog") return "border-cyan-200 bg-cyan-50";
  return "border-green-200 bg-green-50";
}

export function DayExecutionSequence({ entries, compact = false, plannedKpiNames = [] }: { entries: V84DayExecutionPlanEntry[]; compact?: boolean; plannedKpiNames?: string[] }) {
  if (!entries.length) return null;

  return (
    <section className={compact ? "card mt-6" : "card mt-6"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label">Daily execution</p>
          <h2 className={compact ? "text-xl font-black" : "text-2xl font-black"}>Planned Execution Sequence</h2>
        </div>
        <p className="rounded-full bg-ice px-3 py-1 text-sm font-black text-blue">{entries.length} steps</p>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map((entry) => (
          <article className={`rounded-2xl border p-4 ${entryTone(entry)}`} key={`${entry.date}-${entry.sequence}-${entry.entryTitle}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="label">
                  Step {entry.sequence} · {entry.entryType} · {entry.requiredOptional}
                </p>
                <h3 className="font-black">{entry.entryTitle}</h3>
              </div>
              <span className="text-sm font-bold text-slate-600">{durationLabel(entry.plannedDurationMin)}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{entry.loadImpact}</p>
            {!compact && <p className="mt-2 text-sm text-slate-600">{entry.notes}</p>}
            {!compact && entry.logType === "kpiLog" && plannedKpiNames.length > 0 && (
              <div className="mt-3 rounded-xl bg-white/80 p-3">
                <p className="text-sm font-black text-slate-800">Intended KPI tests</p>
                <ul className="mt-2 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                  {plannedKpiNames.map((name) => <li key={name}>• {name}</li>)}
                </ul>
                <Link className="btn-secondary mt-3" href="/kpis">Review KPI Results</Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
