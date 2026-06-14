import { ExternalLoadType } from "@/lib/types";

export type LoadChipKind =
  | "foundation" | "speed-power" | "game-speed" | "peak-tryout"
  | "recovery" | "recovery-protected" | "deload" | "taper" | "kpi"
  | "camp" | "on-ice" | "4v4-hockey" | "marc-oconnor"
  | "lacrosse-practice" | "lacrosse-game" | "lacrosse-playoff"
  | "external-load" | "no-hard-dryland" | "no-kpi-testing";

const chipDefinitions: Record<LoadChipKind, { label: string; style: string }> = {
  foundation: { label: "Foundation", style: "bg-blue-100 text-blue-900" },
  "speed-power": { label: "Speed + Power", style: "bg-blue-200 text-blue-950" },
  "game-speed": { label: "Game-Speed", style: "bg-indigo-100 text-indigo-900" },
  "peak-tryout": { label: "Peak / Tryout Prep", style: "bg-indigo-200 text-indigo-950" },
  recovery: { label: "Recovery", style: "bg-green-100 text-green-800" },
  "recovery-protected": { label: "Recovery Protected", style: "bg-green-200 text-green-900" },
  deload: { label: "Deload", style: "bg-teal-100 text-teal-900" },
  taper: { label: "Taper", style: "bg-amber-100 text-amber-900" },
  kpi: { label: "KPI", style: "bg-cyan-100 text-cyan-950" },
  camp: { label: "Camp", style: "bg-orange-100 text-orange-900" },
  "on-ice": { label: "On-Ice", style: "bg-indigo-100 text-indigo-900" },
  "4v4-hockey": { label: "4v4 Hockey", style: "bg-indigo-200 text-indigo-950" },
  "marc-oconnor": { label: "Marc O'Connor", style: "bg-blue-900 text-white" },
  "lacrosse-practice": { label: "Lacrosse Practice", style: "bg-purple-100 text-purple-900" },
  "lacrosse-game": { label: "Lacrosse Game", style: "bg-purple-200 text-purple-950" },
  "lacrosse-playoff": { label: "Lacrosse Playoff", style: "bg-fuchsia-200 text-fuchsia-950" },
  "external-load": { label: "External Load", style: "border border-slate-400 bg-white text-slate-800" },
  "no-hard-dryland": { label: "No Hard Dryland", style: "border border-red-500 bg-red-50 text-red-800" },
  "no-kpi-testing": { label: "No KPI Testing", style: "border border-amber-500 bg-amber-50 text-amber-900" },
};

const tagKinds: Record<string, LoadChipKind> = {
  recovery: "recovery",
  "external-load-protected": "recovery-protected",
  deload: "deload",
  taper: "taper",
  camp: "camp",
  "on-ice": "on-ice",
  tryout: "peak-tryout",
  lacrosse: "lacrosse-game",
  playoff: "lacrosse-playoff",
  kpi: "kpi",
  "kpi-checkpoint": "kpi",
  baseline: "kpi",
};

function externalLoadKind(type: ExternalLoadType, provider?: string): LoadChipKind {
  if (provider === "Marc O'Connor") return "marc-oconnor";
  const kinds: Record<ExternalLoadType, LoadChipKind> = {
    lacrosse_practice: "lacrosse-practice",
    lacrosse_game: "lacrosse-game",
    lacrosse_playoff: "lacrosse-playoff",
    hockey_camp: "camp",
    on_ice: "on-ice",
    on_ice_4v4: "4v4-hockey",
    tryout: "peak-tryout",
    other: "external-load",
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
  return <LoadChip kind={tagKinds[tag] || "external-load"} label={label || tag} />;
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
        ["Training phase", ["foundation", "speed-power", "game-speed", "peak-tryout"]],
        ["Recovery + testing", ["recovery", "recovery-protected", "deload", "taper", "kpi"]],
        ["External load", ["camp", "on-ice", "4v4-hockey", "marc-oconnor", "lacrosse-practice", "lacrosse-game", "lacrosse-playoff", "external-load"]],
        ["Rules", ["no-hard-dryland", "no-kpi-testing"]],
      ].map(([title, kinds]) => (
        <div key={title as string}>
          <p className="label mb-2">{title as string}</p>
          <div className="flex flex-wrap gap-2">{(kinds as LoadChipKind[]).map((kind) => <LoadChip kind={kind} key={kind} />)}</div>
        </div>
      ))}
    </div>
  );
}
