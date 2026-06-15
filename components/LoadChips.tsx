import { ExternalLoadType } from "@/lib/types";

export type LoadChipKind =
  | "foundation" | "speed-power" | "game-speed" | "taper"
  | "on-ice" | "camp" | "lacrosse"
  | "deload" | "recovery" | "perf-testing";

const chipDefinitions: Record<LoadChipKind, { label: string; style: string }> = {
  foundation: { label: "Foundation", style: "bg-blue-100 text-blue-900" },
  "speed-power": { label: "Speed + Power", style: "bg-blue-200 text-blue-950" },
  "game-speed": { label: "Game-Speed", style: "bg-indigo-100 text-indigo-900" },
  recovery: { label: "Recovery", style: "bg-green-100 text-green-800" },
  deload: { label: "Deload", style: "bg-teal-100 text-teal-900" },
  taper: { label: "Taper", style: "bg-amber-100 text-amber-900" },
  "on-ice": { label: "On-Ice", style: "bg-indigo-200 text-indigo-950" },
  camp: { label: "Camp", style: "bg-orange-100 text-orange-900" },
  lacrosse: { label: "Lacrosse", style: "bg-purple-200 text-purple-950" },
  "perf-testing": { label: "Perf Testing", style: "bg-cyan-100 text-cyan-950" },
};

const tagKinds: Record<string, LoadChipKind> = {
  recovery: "recovery",
  "external-load-protected": "recovery",
  deload: "deload",
  taper: "taper",
  camp: "camp",
  "on-ice": "on-ice",
  tryout: "on-ice",
  lacrosse: "lacrosse",
  playoff: "lacrosse",
  kpi: "perf-testing",
  "kpi-checkpoint": "perf-testing",
  baseline: "perf-testing",
  conditional: "perf-testing",
  optional: "perf-testing",
};

function externalLoadKind(type: ExternalLoadType): LoadChipKind {
  const kinds: Record<ExternalLoadType, LoadChipKind> = {
    lacrosse_practice: "lacrosse",
    lacrosse_game: "lacrosse",
    lacrosse_playoff: "lacrosse",
    hockey_camp: "camp",
    on_ice: "on-ice",
    on_ice_4v4: "on-ice",
    tryout: "on-ice",
    other: "recovery",
  };
  return kinds[type];
}

export function LoadChip({ kind, label }: { kind: LoadChipKind; label?: string }) {
  const definition = chipDefinitions[kind];
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${definition.style}`}>{label || definition.label}</span>;
}

export function ExternalLoadChip({ type }: { type: ExternalLoadType; title?: string; provider?: string }) {
  return <LoadChip kind={externalLoadKind(type)} />;
}

export function PlanTagChip({ tag, label }: { tag: string; label?: string }) {
  return <LoadChip kind={tagKinds[tag] || "recovery"} label={label} />;
}

export function PhaseChip({ phase }: { phase: string }) {
  const normalized = phase.toLowerCase();
  const kind: LoadChipKind = normalized.includes("deload")
    ? "deload"
    : normalized.includes("taper")
      ? "taper"
    : normalized.includes("foundation")
    ? "foundation"
    : normalized.includes("speed")
      ? "speed-power"
      : "game-speed";
  return <LoadChip kind={kind} />;
}

export function LoadChipLegend() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["Method Phase", ["foundation", "speed-power", "game-speed", "taper"]],
        ["Sport Load", ["on-ice", "camp", "lacrosse"]],
        ["Recovery / Load Management", ["deload", "recovery"]],
        ["Testing", ["perf-testing"]],
      ].map(([title, kinds]) => (
        <div key={title as string}>
          <p className="label mb-2">{title as string}</p>
          <div className="flex flex-wrap gap-2">{(kinds as LoadChipKind[]).map((kind) => <LoadChip kind={kind} key={kind} />)}</div>
        </div>
      ))}
    </div>
  );
}
