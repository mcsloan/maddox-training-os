"use client";

import { showExcelPlaceholder } from "@/lib/exportExcel";
import { showPdfPlaceholder } from "@/lib/exportPdf";

const exports = [
  { title: "Weekly Plan", detail: "A clean family view of this week.", action: () => showPdfPlaceholder("Weekly Plan"), button: "Export PDF" },
  { title: "KPI Report", detail: "Latest results and trend summary.", action: () => showPdfPlaceholder("KPI Report"), button: "Export PDF" },
  { title: "Training Log", detail: "Session history in spreadsheet format.", action: showExcelPlaceholder, button: "Export Excel" },
  { title: "Printable Rink Cards", detail: "Compact drill prompts for the rink.", action: () => showPdfPlaceholder("Rink Cards"), button: "Export PDF" },
];

export function ExportButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {exports.map((item) => (
        <article className="card" key={item.title}>
          <h2 className="text-xl font-black">{item.title}</h2>
          <p className="my-3 text-slate-500">{item.detail}</p>
          <button className="btn-secondary w-full" onClick={item.action}>{item.button}</button>
        </article>
      ))}
    </div>
  );
}
