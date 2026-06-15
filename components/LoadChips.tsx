import { ExternalLoadType } from "@/lib/types";

export type LoadChipKind =
  | "foundation" | "speed-power" | "game-speed" | "peak-tryout"
  | "recovery" | "limit-extra-work" | "deload" | "taper"
  | "chase-hull-camp" | "carleton-camp" | "sensplex-camp" | "4v4-hockey" | "marc-oconnor"
  | "lacrosse-practice" | "lacrosse-game" | "lacrosse-playoff"
  | "no-hard-dryland" | "no-kpi-testing"
  | "kpi-baseline" | "kpi-retest" | "kpi-technique";

const chipDefinitions: Record<LoadChipKind, { label: string; style: string }> = {
  foundation: { label: "Foundation", style: "bg-blue-100 text-blue-900" },
  "speed-power": { label: "Speed + Power", style: "bg-blue-200 text-blue-950" },
  "game-speed": { label: "Game-Speed", style: "bg-indigo-100 text-indigo-900" },
  "peak-tryout": { label: "Peak / Tryout Prep", style: "bg-indigo-200 text-indigo-950" },
  recovery: { label: "Recovery Day", style: "bg-green-100 text-green-800" },
  "limit-extra-work": { label: "Limit Extra Work", style: "border border-green-500 bg-green-50 text-green-900" },
  deload: { label: "Deload", style: "bg-teal-100 text-teal-900" },
  taper: { label: "Taper", style: "bg-amber-100 text-amber-900" },
  "chase-hull-camp": { label: "Chase Hull Camp", style: "bg-orange-100 text-orange-900" },
  "carleton-camp": { label: "Carleton Camp", style: "bg-orange-200 text-orange-950" },
  "sensplex-camp": { label: "Sensplex Camp", style: "bg-red-100 text-red-900" },
  "4v4-hockey": { label: "4v4 Hockey", style: "bg-indigo-200 text-indigo-950" },
  "marc-oconnor": { label: "Marc O'Connor", style: "bg-blue-900 text-white" },
  "lacrosse-practice": { label: "Lacrosse Practice", style: "bg-purple-100 text-purple-900" },
  "lacrosse-game": { label: "Lacrosse Game", style: "bg-purple-200 text-purple-950" },
  "lacrosse-playoff": { label: "Lacrosse Playoff", style: "bg-fuchsia-200 text-fuchsia-950" },
  "no-hard-dryland": { label: "No Hard Dryland", style: "border border-red-500 bg-red-50 text-red-800" },
  "no-kpi-testing": { label: "No KPI Testing", style: "border border-amber-500 bg-amber-50 text-amber-900" },
  "kpi-baseline": { label: "KPI Baseline", style: "bg-cyan-100 text-cyan-950" },
  "kpi-retest": { label: "KPI Retest", style: "bg-cyan-200 text-cyan-950" },
  "kpi-technique": { label: "KPI Technique Check", style: "border border-cyan-500 bg-cyan-50 text-cyan-950" },
};

const tagKinds: Record<string, LoadChipKind> = {
  recovery: "recovery",
  "external-load-protected": "limit-extra-work",
  deload: "deload",
  taper: "taper",
  camp: "limit-extra-work",
  "on-ice": "limit-extra-work",
  tryout: "peak-tryout",
  lacrosse: "lacrosse-game",
  playoff: "lacrosse-playoff",
  kpi: "kpi-retest",
  "kpi-checkpoint": "kpi-retest",
  baseline: "kpi-baseline",
  conditional: "kpi-retest",
  optional: "kpi-technique",
};

function externalLoadKind(type: ExternalLoadType, provider?: string): LoadChipKind {
  if (provider === "Marc O'Connor") return "marc-oconnor";
  if (provider === "Chase Hull") return "chase-hull-camp";
  if (provider === "Carleton Ravens") return "carleton-camp";
  if (provider === "Sensplex") return "sensplex-camp";
  const kinds: Record<ExternalLoadType, LoadChipKind> = {
    lacrosse_practice: "lacrosse-practice",
    lacrosse_game: "lacrosse-game",
    lacrosse_playoff: "lacrosse-playoff",
    hockey_camp: "limit-extra-work",
    on_ice: "limit-extra-work",
    on_ice_4v4: "4v4-hockey",
    tryout: "peak-tryout",
    other: "limit-extra-work",
  };
  return kinds[type];
}

export function LoadChip({ kind, label }: { kind: LoadChipKind; label?: string }) {
  const definition = chipDefinitions[kind];
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${definition.style}`}>{label || definition.label}</span>;
}

export function ExternalLoadChip({ type, title, provider }: { type: ExternalLoadType; title: string; provider?: string }) {
  return <LoadChip kind={externalLoadKind(type, provider)} label={title} />;
}

export function PlanTagChip({ tag, label }: { tag: string; label?: string }) {
  return <LoadChip kind={tagKinds[tag] || "limit-extra-work"} label={label} />;
}

export function PhaseChip({ phase }: { phase: string }) {
  const normalized = phase.toLowerCase();
  const kind: LoadChipKind = normalized.includes("deload")
    ? "deload"
    : normalized.includes("foundation")
    ? "foundation"
    : normalized.includes("speed")
      ? "speed-power"
      : normalized.includes("game")
        ? "game-speed"
        : "peak-tryout";
  return <LoadChip kind={kind} />;
}

export function LoadChipLegend() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["Plan Focus", ["foundation", "speed-power", "game-speed", "peak-tryout", "taper"]],
        ["Sport Load", ["4v4-hockey", "lacrosse-game", "lacrosse-playoff", "chase-hull-camp", "carleton-camp", "sensplex-camp", "marc-oconnor"]],
        ["Recovery / Limits", ["recovery", "deload", "limit-extra-work", "no-hard-dryland", "no-kpi-testing"]],
        ["Testing", ["kpi-baseline", "kpi-retest", "kpi-technique"]],
      ].map(([title, kinds]) => (
        <div key={title as string}>
          <p className="label mb-2">{title as string}</p>
          <div className="flex flex-wrap gap-2">{(kinds as LoadChipKind[]).map((kind) => <LoadChip kind={kind} key={kind} />)}</div>
        </div>
      ))}
    </div>
  );
}
