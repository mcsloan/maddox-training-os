import Link from "next/link";
import type { V84DayExecutionPlanEntry } from "@/lib/imports/v8_4/types";
import type { VideoReference, WorkoutBlock } from "@/lib/types";

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

export function DayExecutionSequence({
  dayMicroSkill,
  entries,
  compact = false,
  plannedKpiNames = [],
  recoveryRule,
  shootingDetail,
  videos = [],
  workoutBlocks = [],
}: {
  dayMicroSkill?: string;
  entries: V84DayExecutionPlanEntry[];
  compact?: boolean;
  plannedKpiNames?: string[];
  recoveryRule?: string;
  shootingDetail?: string;
  videos?: VideoReference[];
  workoutBlocks?: WorkoutBlock[];
}) {
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
        {entries.map((entry) => {
          const stepBlocks = matchingBlocks(entry, workoutBlocks);
          const stepVideos = matchingVideos(entry, videos);
          const details = stepDetails(entry, { dayMicroSkill, recoveryRule, shootingDetail });
          return (
            <article className={`rounded-2xl border p-4 ${entryTone(entry)}`} key={`${entry.date}-${entry.sequence}-${entry.entryTitle}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="label">
                    Step {entry.sequence} · {entry.entryType} · {entry.requiredOptional}
                  </p>
                  <h3 className="font-black">{plainEntryTitle(entry.entryTitle)}</h3>
                </div>
                <span className="text-sm font-bold text-slate-600">{durationLabel(entry.plannedDurationMin)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{entry.loadImpact}</p>
              {!compact && <p className="mt-2 text-sm text-slate-600">{entry.notes}</p>}
              {!compact && stepBlocks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {stepBlocks.map((block) => <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-700" key={block.id}>{block.id}: {plainBlockName(block)}</span>)}
                </div>
              )}
              {!compact && details.length > 0 && (
                <ul className="mt-3 grid gap-1 text-sm font-semibold text-slate-700">
                  {details.map((detail) => <li key={detail}>• {detail}</li>)}
                </ul>
              )}
              {!compact && entry.logType === "kpiLog" && plannedKpiNames.length > 0 && (
                <div className="mt-3 rounded-xl bg-white/80 p-3">
                  <p className="text-sm font-black text-slate-800">Intended KPI tests</p>
                  <ul className="mt-2 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                    {plannedKpiNames.map((name) => <li key={name}>• {name}</li>)}
                  </ul>
                  <Link className="btn-secondary mt-3" href="/kpis">Review KPI Results</Link>
                </div>
              )}
              {!compact && stepVideos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {stepVideos.map((video) => <a className="text-sm font-bold text-blue" href={video.url} target="_blank" rel="noreferrer" key={video.id}>▶ {video.title}</a>)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function plainEntryTitle(title: string) {
  const labels: Record<string, string> = {
    "WU-10": "WU-10 - Warmup / mobility preparation",
    "WUP-10": "WUP-10 - Warmup / mobility preparation",
    "MOB-15": "MOB-15 - Mobility / cooldown support",
    "CD-8": "CD-8 - Cooldown and reflection",
    "SHOT-50": "SHOT-50 - 50-shot controlled accuracy block",
    "SHOT-100": "SHOT-100 - Controlled accuracy / mechanics shooting",
    "SS-A": "SS-A - Strength and speed support",
  };
  const matchingCode = Object.keys(labels).find((code) => title === code || title.startsWith(`${code} `) || title.startsWith(`${code}-`) || title.includes(`${code} `));
  return matchingCode ? title.replace(matchingCode, labels[matchingCode]) : title;
}

function matchingBlocks(entry: V84DayExecutionPlanEntry, blocks: WorkoutBlock[]) {
  return blocks.filter((block) => {
    if (entry.sourceBlock === block.id || entry.entryTitle.includes(block.id)) return true;
    if (entry.logType === "kpiLog") return block.id === "TEST";
    if (entry.entryType.toLowerCase().includes("warmup")) return block.id === "WUP-10" || block.id === "WU-10";
    if (entry.entryType.toLowerCase().includes("conditioning")) return block.id === "SS-A";
    if (entry.entryType.toLowerCase().includes("shooting")) return block.id === "SHOT-50" || block.id === "SHOT-100";
    if (entry.entryType.toLowerCase().includes("recovery")) return block.id === "CD-8" || block.id === "MOB-15";
    return false;
  });
}

function matchingVideos(entry: V84DayExecutionPlanEntry, videos: VideoReference[]) {
  if (!videos.length) return [];
  const normalized = `${entry.entryTitle} ${entry.entryType} ${entry.sourceBlock}`.toLowerCase();
  return videos.filter((video) => {
    const videoText = `${video.title} ${video.category} ${video.bestUse || ""}`.toLowerCase();
    if (normalized.includes("shot") || normalized.includes("shooting")) return videoText.includes("shoot");
    if (normalized.includes("kpi") || normalized.includes("baseline")) return videoText.includes("kpi") || videoText.includes("sprint") || videoText.includes("agility") || videoText.includes("puck");
    if (normalized.includes("warmup") || normalized.includes("wu-")) return videoText.includes("warm") || videoText.includes("mobility");
    return false;
  });
}

function plainBlockName(block: WorkoutBlock) {
  const labels: Record<string, string> = {
    "WUP-10": "10-minute warmup",
    "WU-10": "10-minute warmup",
    TEST: "KPI testing block",
    "SS-A": "strength and speed support",
    "SHOT-50": "controlled accuracy shooting",
    "SHOT-100": "controlled accuracy shooting",
    "MOB-15": "15-minute mobility support",
    "CD-8": "8-minute cooldown",
  };
  return labels[block.id] || block.name;
}

function stepDetails(entry: V84DayExecutionPlanEntry, context: { dayMicroSkill?: string; recoveryRule?: string; shootingDetail?: string }) {
  const details: string[] = [];
  const entryType = entry.entryType.toLowerCase();
  const title = entry.entryTitle.toLowerCase();
  if (entry.logType === "kpiLog") {
    if (context.recoveryRule) details.push(context.recoveryRule);
    details.push("Full recovery between attempts; finish fresh. Do not chase ugly personal records.");
  }
  if (entryType.includes("shooting") || title.includes("shot")) {
    if (context.shootingDetail) details.push(context.shootingDetail);
    details.push("Shot work is accuracy and mechanics first: pick targets, reset between shots, and stop if technique breaks.");
  }
  if (entryType.includes("recovery") || title.includes("mob")) {
    details.push("MOB-15 means mobility, cooldown, hydration, breathing, and recovery support.");
    details.push("This should help him feel better, not add fatigue.");
  }
  if (entryType.includes("skill") && context.dayMicroSkill) details.push(`Daily skill focus: ${context.dayMicroSkill}.`);
  return Array.from(new Set(details));
}
