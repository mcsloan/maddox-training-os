"use client";

import { showExcelPlaceholder } from "@/lib/exportExcel";
import { showPdfPlaceholder } from "@/lib/exportPdf";

const exports = [
  { title: "Weekly Plan", detail: "A family-friendly schedule for planned workouts.", preview: "Dates, day focus, session type, estimated time, intensity, and parent cues.", action: () => showPdfPlaceholder("Weekly Plan"), button: "Export PDF" },
  { title: "KPI Report", detail: "A progress report for athletic and hockey-skill tests.", preview: "Recent result, best result, attempts, notes, and trend labels.", action: () => showPdfPlaceholder("KPI Report"), button: "Export PDF" },
  { title: "Training Log", detail: "A spreadsheet-ready history of every session attempt.", preview: "Status, completion, drill results, readiness, reflection, and KPI tests.", action: showExcelPlaceholder, button: "Export Excel" },
  { title: "Printable Rink Cards", detail: "Compact drill instruction prompts for training.", preview: "Setup checklist, planned work, coaching cues, safety, and QR-ready links.", action: () => showPdfPlaceholder("Rink Cards"), button: "Export PDF" },
];

export function ExportButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {exports.map((item) => (
        <article className="card" key={item.title}>
          <h2 className="text-xl font-black">{item.title}</h2>
          <p className="my-3 text-slate-500">{item.detail}</p>
          <p className="rounded-xl bg-ice p-3 text-sm"><strong>Preview:</strong> {item.preview}</p>
          <p className="my-3 text-xs font-black uppercase tracking-wide text-amber-700">Status: Placeholder · Coming next</p>
          <button className="btn-secondary w-full" onClick={item.action}>{item.button}</button>
        </article>
      ))}
    </div>
  );
}
