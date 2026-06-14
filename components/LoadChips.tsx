import { ExternalLoadType } from "@/lib/types";

const loadStyles: Record<ExternalLoadType, string> = {
  lacrosse_practice: "bg-purple-100 text-purple-800",
  lacrosse_game: "bg-purple-200 text-purple-900",
  lacrosse_playoff: "bg-fuchsia-200 text-fuchsia-900",
  hockey_camp: "bg-red-100 text-red-800",
  on_ice: "bg-blue-100 text-blue-800",
  on_ice_4v4: "bg-sky-200 text-sky-900",
  tryout: "bg-amber-100 text-amber-900",
  other: "bg-slate-100 text-slate-700",
};

const tagStyles: Record<string, string> = {
  recovery: "bg-green-100 text-green-800",
  deload: "bg-teal-100 text-teal-800",
  taper: "bg-amber-100 text-amber-900",
  camp: "bg-red-100 text-red-800",
  "on-ice": "bg-blue-100 text-blue-800",
  tryout: "bg-amber-100 text-amber-900",
  lacrosse: "bg-purple-100 text-purple-800",
  kpi: "bg-cyan-100 text-cyan-900",
};

export function ExternalLoadChip({ type, title }: { type: ExternalLoadType; title: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${loadStyles[type]}`}>{title}</span>;
}

export function PlanTagChip({ tag }: { tag: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${tagStyles[tag] || "bg-ice text-blue"}`}>{tag}</span>;
}
