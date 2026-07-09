import Link from "next/link";
import { LoadChip, LoadChipLegend, PhaseChip, PlanTagChip } from "@/components/LoadChips";
import { WeeklyLoadChart } from "@/components/WeeklyLoadChart";
import { ganttModel, phaseLabels, phaseMap } from "@/lib/imports/v8_4";
import { buildPlanSportLoadOverlayRows, getPlanSportLoadOverlayItemsForWeek, type PlanSportLoadOverlayKind } from "@/lib/planSportLoadOverlay";
import { formatPlanDate, getWeekPlanSummary, trainingPlan } from "@/lib/trainingData";

export default function PlanPage() {
  const { overview, weeks, version, sourceTag } = trainingPlan;

  return (
    <div>
      <div className="mb-6">
        <p className="label">12-week offseason plan</p>
        <h1 className="text-4xl font-black">Plan</h1>
        <p className="mt-2 text-slate-600">{formatPlanDate(overview.startDate)} to {formatPlanDate(overview.endDate)}</p>
      </div>

      <section className="card bg-navy text-white">
        <p className="label text-lime">Primary goal</p>
        <h2 className="max-w-4xl text-2xl font-black">{planPageText(overview.primaryGoal)}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="label text-lime">Training bias</p>
            <ul className="list-inside list-disc space-y-1 text-slate-200">
              {overview.trainingBias.map((item) => <li key={item}>{planPageText(item)}</li>)}
            </ul>
          </div>
          <div>
            <p className="label text-lime">Sport loads</p>
            <ul className="list-inside list-disc space-y-1 text-slate-200">
              {overview.externalLoads.map((item) => <li key={item}>{planPageText(item)}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-primary bg-blue" href="/calendar">Open Calendar</Link>
          <Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link>
        </div>
      </section>

      <section className="card mt-6">
        <p className="label">Shared plan language</p>
        <h2 className="text-2xl font-black">Chip Legend</h2>
        <p className="mt-2 text-sm text-slate-600">Every chip uses both text and a consistent visual family. Rules override optional training work.</p>
        <div className="mt-5"><LoadChipLegend /></div>
        <p className="mt-5 rounded-none border-l-4 border-blue bg-ice p-4 text-sm font-semibold">Sport loads are part of the plan. The app adjusts dryland volume around camps, on-ice sessions, lacrosse, and recovery windows.</p>
      </section>

      <MethodologyPanel />
      <PhaseGantt />
      <WeeklyLoadChart />

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {weeks.map((week) => {
          const loads = getPlanSportLoadOverlayItemsForWeek(week.weekNumber);
          const summary = getWeekPlanSummary(week);
          const kpiDays = trainingPlan.days.filter((day) => day.weekNumber === week.weekNumber && day.kpiTestIds?.length);
          return (
            <article className="card" key={week.weekNumber}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label">Week {week.weekNumber} · {formatPlanDate(week.startDate, { month: "short", day: "numeric" })}-{formatPlanDate(week.endDate, { month: "short", day: "numeric" })}</p>
                  <h2 className="text-xl font-black">{planPageText(summary.loadEmphasis)}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <PhaseChip phase={summary.loadEmphasis} />
                    {week.weekNumber === 7 ? <LoadChip kind="deload" /> : null}
                    {week.weekNumber === 12 ? <LoadChip kind="taper" /> : null}
                  </div>
                </div>
                <Link className="text-sm font-bold text-blue" href={`/calendar#week-${week.weekNumber}`}>Days</Link>
              </div>
              <p className="mt-3 font-semibold">{planPageText(week.objective)}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <Metric label="Training days" value={summary.trainingDays} />
                <Metric label="Sport load days" value={summary.externalLoadDays} />
                <Metric label="Perf testing days" value={summary.kpiDays} />
                <Metric label="Recovery days" value={summary.recoveryProtectedDays} />
                <Metric label="High-load days" value={summary.highLoadDays} />
                <Metric label="Overall load" value={`${summary.loadLevel}/5`} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-ice p-3">
                  <p className="label">Hard days</p>
                  <p className="font-semibold">{planPageText(week.hardDays)}</p>
                </div>
                <div className="rounded-xl bg-ice p-3">
                  <p className="label">Skill days</p>
                  <p className="font-semibold">{planPageText(week.skillDays)}</p>
                </div>
                <div className="rounded-xl bg-ice p-3">
                  <p className="label">Recovery days</p>
                  <p className="font-semibold">{planPageText(week.recoveryDays)}</p>
                </div>
              </div>
              {loads.length > 0 && (
                <div className="mt-4">
                  <p className="label">Sport load summary</p>
                  <div className="grid gap-2">
                    {loads.map((load) => (
                      <Link className="rounded-xl bg-ice p-3 text-sm font-semibold text-slate-700 hover:text-blue" href={`/day/${load.date}`} key={`${load.date}-${load.title}`}>
                        <span className="font-black text-navy">{formatPlanDate(load.date, { month: "short", day: "numeric" })} · {load.title}</span>
                        <span className="mt-1 block">{load.details}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {kpiDays.length > 0 && (
                <div className="mt-4">
                  <p className="label">Testing</p>
                  <div className="flex flex-wrap gap-2">{kpiDays.map((day) => <Link href={`/day/${day.date}`} key={day.date}><PlanTagChip tag="kpi" /></Link>)}</div>
                </div>
              )}
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Parent watch-out:</strong> {planPageText(week.parentWatchOut)}</p>
            </article>
          );
        })}
      </section>
      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>
    </div>
  );
}

function MethodologyPanel() {
  return (
    <section className="card mt-6">
      <p className="label">Plan logic</p>
      <h2 className="text-2xl font-black">12-Week Methodology</h2>
      <p className="mt-3 max-w-4xl text-slate-700">This plan blends HockeyTraining-style Speed Stack scheduling, Nike&apos;s 12-week offseason structure, and Maddox&apos;s actual summer sport calendar. The goal is not to do more every week. The goal is to build, express, recover, and peak.</p>
      <ul className="mt-5 list-inside list-disc space-y-2 text-sm font-semibold">
        <li>Build movement quality and acceleration first.</li>
        <li>Layer speed, power, puck skill, and shot habits.</li>
        <li>Treat camps and on-ice sessions as planned hockey stress, not extra work.</li>
        <li>Reduce dryland volume around high sport-load weeks.</li>
        <li>Taper into tryouts with fresh legs, confidence, and speed.</li>
      </ul>
    </section>
  );
}

function PhaseGantt() {
  ensureLockedGanttLaneCount();
  const weekLabels = new Map(phaseLabels.map((entry) => [entry.week, entry.appLabel]));
  const phaseNames = new Map(phaseMap.map((entry) => [entry.week, entry.trainingPhase]));
  const rows = buildLockedGanttRows();

  return (
    <section className="card mt-6 bg-white">
      <p className="label">Methodology first</p>
      <h2 className="text-2xl font-black">Phase Gantt</h2>
      <p className="mt-2 text-sm text-slate-600">Method phases lead the plan. Sport loads and performance tests are scheduled within them.</p>
      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[1120px]">
          <div className="grid grid-cols-[11rem_repeat(12,minmax(3.75rem,1fr))] gap-0.5 border-b border-slate-300 pb-2 text-[11px] font-black uppercase tracking-wide text-slate-500">
            <div />
            {ganttModel.weeks.map((week) => {
              const weekNumber = Number(week.slice(1));
              const weekLabel = weekLabels.get(weekNumber) || week;
              const phaseName = phaseNames.get(weekNumber);
              return (
                <Link key={week} className="text-center text-blue" href={`/calendar#week-${weekNumber}`} title={phaseName ? `${phaseName} · ${weekLabel}` : weekLabel}>
                  {week}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 space-y-1">
            {rows.map((row) => ("markers" in row ? <GanttMarkerRow key={row.label} row={row} /> : <GanttSpanRow key={`${row.label}-${row.startWeek}-${row.endWeek}`} row={row} />))}
          </div>
        </div>
      </div>
    </section>
  );
}

type GanttRow =
  | {
      label: string;
      kind: "testing" | "sportMarkers" | "campMarkers" | "onIceMarkers" | "travelMarkers";
      markers: { week: number; label: string; shortLabel: string; dateLabel: string; title: string }[];
    }
  | {
      label: string;
      shortLabel: string;
      startWeek: number;
      endWeek: number;
      kind: "phase" | "sport" | "camp" | "onIce" | "deload" | "taper";
    };

function buildLockedGanttRows(): GanttRow[] {
  const sourceLaneNames = new Set(ganttModel.lanes.map((lane) => lane.lane));
  const requiredLaneNames = [
    "Perf Testing",
    "GPP/Foundation + Hypertrophy/Tissue Prep",
    "Sport Loads / Playoffs",
    "Strength Foundation + Acceleration Mechanics",
    "Chase Hull Camp",
    "Speed-Strength / Power Transition",
    "Marc O’Connor Ice",
    "Strategic Lighter Week + Toronto Trip",
    "Toronto Trip / Travel",
    "Power/Agility + Carleton Camp Overlay",
    "Carleton U. Camp",
    "Game-Speed + Reactive Agility / Repeat Sprint",
    "Training Camp / Tryout Simulation",
    "Sensplex Camp",
    "Taper + Peak",
    "Legend",
  ];

  if (process.env.NODE_ENV !== "production") {
    const missing = requiredLaneNames.filter((name) => !sourceLaneNames.has(name));
    if (missing.length) {
      throw new Error(`Locked v8.4 Gantt is missing lanes: ${missing.join(", ")}`);
    }
  }

  const sportLoadRows = buildPlanSportLoadOverlayRows().map((row): Extract<GanttRow, { markers: unknown[] }> => ({
    label: row.label,
    kind: markerKindFor(row.kind),
    markers: row.markers.map((marker) => ({
      week: marker.week,
      label: marker.label,
      shortLabel: marker.shortLabel,
      dateLabel: marker.dateLabel,
      title: marker.title,
    })),
  }));

  return [
    { label: "Perf Testing", kind: "testing", markers: [1, 3, 5, 7, 10, 12].map((week) => ({ week, label: "Perf Testing", shortLabel: "Test", dateLabel: `W${week}`, title: "Perf Testing" })) },
    { label: "GPP / Foundation", shortLabel: "GPP / Foundation", startWeek: 1, endWeek: 2, kind: "phase" },
    ...sportLoadRows,
    { label: "Strength + Acceleration", shortLabel: "Strength + Accel", startWeek: 3, endWeek: 4, kind: "phase" },
    { label: "Power Transition", shortLabel: "Power Transition", startWeek: 5, endWeek: 6, kind: "phase" },
    { label: "Deload", shortLabel: "Deload", startWeek: 7, endWeek: 7, kind: "deload" },
    { label: "Power/Agility + Carleton", shortLabel: "Power/Agility", startWeek: 8, endWeek: 10, kind: "phase" },
    { label: "Game-Speed / Sprint", shortLabel: "Game-Speed / Sprint", startWeek: 9, endWeek: 10, kind: "phase" },
    { label: "Tryout Sim", shortLabel: "Tryout Sim", startWeek: 11, endWeek: 11, kind: "phase" },
    { label: "Taper + Peak", shortLabel: "Taper", startWeek: 12, endWeek: 12, kind: "taper" },
  ];
}

function GanttSpanRow({ row }: { row: Extract<GanttRow, { kind: Exclude<GanttRow["kind"], "testing"> }> }) {
  return (
    <div className="grid grid-cols-[11rem_repeat(12,minmax(3.75rem,1fr))] items-center gap-0.5">
      <div className="pr-2 text-[12px] font-black leading-tight text-slate-800">{row.label}</div>
      <div className="grid h-5 grid-cols-12 gap-0.5" style={{ gridColumn: "2 / span 12" }}>
        {Array.from({ length: 12 }, (_, index) => {
          const week = index + 1;
          const isCovered = week >= row.startWeek && week <= row.endWeek;
          return <div key={week} className={`h-5 border ${isCovered ? "border-transparent bg-transparent" : "border-slate-200 bg-white"}`} />;
        })}
        <div
          className="pointer-events-none z-10 h-5 border px-2 py-0.5 text-[11px] font-black leading-tight shadow-sm"
          style={{ ...ganttFillStyleFor(row.kind), gridColumn: `${row.startWeek} / ${row.endWeek + 1}`, gridRow: 1 }}
          title={row.label}
        >
          <span className="block truncate">{row.shortLabel}</span>
        </div>
      </div>
    </div>
  );
}

function GanttMarkerRow({ row }: { row: Extract<GanttRow, { markers: unknown[] }> }) {
  return (
    <div className="grid grid-cols-[11rem_repeat(12,minmax(3.75rem,1fr))] items-stretch gap-0.5">
      <div className="pr-2 text-[12px] font-black leading-tight text-slate-800">{row.label}</div>
      <div className="grid min-h-8 grid-cols-12 gap-0.5" style={{ gridColumn: "2 / span 12" }}>
        {Array.from({ length: 12 }, (_, index) => {
          const week = index + 1;
          const markers = row.markers.filter((item) => item.week === week);
          const markerTitle = markers.map((marker) => marker.label).join("; ");
          return (
            <div key={week} className="min-h-8 border border-slate-200 bg-white p-0.5">
              {markers.map((marker) => (
                <div
                  className="mb-0.5 w-full border px-1 py-0.5 text-[9px] font-black leading-tight shadow-sm last:mb-0"
                  key={`${marker.dateLabel}-${marker.shortLabel}`}
                  style={ganttMarkerStyleFor(row.kind)}
                  title={markerTitle}
                >
                  <span className="block truncate">{marker.dateLabel}</span>
                  <span className="block truncate">{marker.shortLabel}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function markerKindFor(kind: PlanSportLoadOverlayKind): Extract<GanttRow, { markers: unknown[] }>["kind"] {
  switch (kind) {
    case "camp":
      return "campMarkers";
    case "onIce":
      return "onIceMarkers";
    case "travel":
      return "travelMarkers";
    case "sport":
      return "sportMarkers";
  }
}

function ganttMarkerStyleFor(kind: Extract<GanttRow, { markers: unknown[] }>["kind"]) {
  switch (kind) {
    case "testing":
      return { backgroundColor: "#06b6d4", borderColor: "rgba(22, 78, 99, 0.15)", color: "#083344" };
    case "sportMarkers":
      return { backgroundColor: "#ddd6fe", borderColor: "#7c3aed", color: "#3b0764" };
    case "campMarkers":
      return { backgroundColor: "#fdba74", borderColor: "#ea580c", color: "#7c2d12" };
    case "onIceMarkers":
      return { backgroundColor: "#c7d2fe", borderColor: "#4338ca", color: "#312e81" };
    case "travelMarkers":
      return { backgroundColor: "#99f6e4", borderColor: "#0f766e", color: "#134e4a" };
  }
}

function ganttFillStyleFor(kind: Exclude<GanttRow["kind"], "testing">) {
  switch (kind) {
    case "phase":
      return { backgroundColor: "#0f6f9f", borderColor: "#075985", color: "#ffffff", fontWeight: 800, borderRadius: 0 as const };
    case "sport":
      return { backgroundColor: "#ddd6fe", borderColor: "#7c3aed", color: "#3b0764", fontWeight: 800, borderRadius: 0 as const };
    case "camp":
      return { backgroundColor: "#fdba74", borderColor: "#ea580c", color: "#7c2d12", fontWeight: 800, borderRadius: 0 as const };
    case "onIce":
      return { backgroundColor: "#c7d2fe", borderColor: "#4338ca", color: "#312e81", fontWeight: 800, borderRadius: 0 as const };
    case "deload":
      return { backgroundColor: "#99f6e4", borderColor: "#0f766e", color: "#134e4a", fontWeight: 800, borderRadius: 0 as const };
    case "taper":
      return { backgroundColor: "#fde68a", borderColor: "#d97706", color: "#78350f", fontWeight: 800, borderRadius: 0 as const };
  }
}

function ensureLockedGanttLaneCount() {
  if (process.env.NODE_ENV !== "production" && ganttModel.lanes.length !== 17) {
    throw new Error(`Locked v8.4 Gantt should have 17 lanes, found ${ganttModel.lanes.length}.`);
  }
}

function planPageText(text: string) {
  return text
    .replace(/external[- ]load[- ]protected/gi, "Recovery")
    .replace(/external[- ]load/gi, "sport-load")
    .replace(/external load/gi, "sport-load")
    .replace(/external hockey/gi, "sport load")
    .replace(/recovery protected/gi, "Recovery")
    .replace(/camp protection/gi, "Camp")
    .replace(/protection/gi, "recovery")
    .replace(/\bprotected\b/gi, "planned")
    .replace(/consolidation/gi, "Deload");
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-rink p-3"><p className="label">{label}</p><p className="text-xl font-black">{value}</p></div>;
}
