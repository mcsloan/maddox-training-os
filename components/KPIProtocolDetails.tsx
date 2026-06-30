import type { KPI } from "../lib/types";

export function KPIProtocolDetails({ kpi }: { kpi: KPI }) {
  return (
    <details className="mt-4 rounded-2xl bg-ice p-4" open>
      <summary className="cursor-pointer font-black text-blue">Protocol details</summary>
      <div className="mt-4 grid gap-4 text-sm lg:grid-cols-3">
        <section>
          <p className="label">How to run</p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-slate-700">
            {kpi.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
          </ol>
        </section>
        <section>
          <p className="label">Scoring</p>
          <p className="mt-2 font-semibold text-slate-700">{kpi.scoringMethod === "lowest" ? "Lower is better." : "Higher is better."}</p>
          <p className="mt-1 text-slate-700">{kpi.attempts} {kpi.attempts === 1 ? "attempt" : "attempts"} · {kpi.fields[0]?.label || "Result"} {kpi.fields[0]?.unit ? `(${kpi.fields[0].unit})` : ""}</p>
          {kpi.coachingNotes.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              {kpi.coachingNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          )}
        </section>
        <section>
          <p className="label">Safety</p>
          <p className="mt-2 font-semibold text-red-700">{kpi.safetyNotes}</p>
        </section>
      </div>
    </details>
  );
}
