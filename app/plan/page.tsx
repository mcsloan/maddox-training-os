import Link from "next/link";
import { LoadChip, LoadChipLegend, PhaseChip, PlanTagChip } from "@/components/LoadChips";
import { WeeklyLoadChart } from "@/components/WeeklyLoadChart";
import { ganttModel, phaseLabels, phaseMap } from "@/lib/imports/v8_4";
import {
  buildPlanSportLoadOverlayRows,
  formatShortDate,
  getPlanSportLoadOverlayItemsForWeek,
  getSpanGridColumns,
  getTimelineDays,
  type PlanGanttDisplayKind,
  type PlanSportLoadOverlayKind,
} from "@/lib/planSportLoadOverlay";
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

const TIMELINE_DAY_COUNT = 84;
const GANTT_LABEL_COLUMN_WIDTH = "12rem";
const GANTT_DAY_COLUMN_WIDTH = "1.1rem";
const GANTT_GRID_TEMPLATE_COLUMNS = `${GANTT_LABEL_COLUMN_WIDTH} repeat(${TIMELINE_DAY_COUNT}, ${GANTT_DAY_COLUMN_WIDTH})`;

function PhaseGantt() {
  ensureLockedGanttLaneCount();
  const weekLabels = new Map(phaseLabels.map((entry) => [entry.week, entry.appLabel]));
  const phaseNames = new Map(phaseMap.map((entry) => [entry.week, entry.trainingPhase]));
  const timelineDays = getTimelineDays();
  const sections = buildLockedGanttSections();

  return (
    <section className="card mt-6 bg-white">
      <p className="label">Methodology first</p>
      <h2 className="text-2xl font-black">Phase Gantt</h2>
      <p className="mt-2 text-sm text-slate-600">Method phases span real dates. Sport loads appear as exact-day milestones or exact-date bars.</p>
      <div className="mt-5 overflow-x-auto">
        <div className="w-max">
          <div className="grid border-b border-slate-300 pb-1 text-[10px] font-black uppercase text-slate-500" style={{ gridTemplateColumns: GANTT_GRID_TEMPLATE_COLUMNS }}>
            <div className="sticky left-0 z-40 border-r border-slate-300 bg-white pr-3 shadow-[2px_0_0_rgba(15,23,42,0.06)]" />
            {ganttModel.weeks.map((week, index) => {
              const weekNumber = Number(week.slice(1));
              const weekLabel = weekLabels.get(weekNumber) || week;
              const phaseName = phaseNames.get(weekNumber);
              const startColumn = index * 7 + 2;
              return (
                <Link
                  key={week}
                  className="border border-slate-200 bg-ice py-1 text-center text-blue"
                  href={`/calendar#week-${weekNumber}`}
                  style={{ gridColumn: `${startColumn} / span 7` }}
                  title={phaseName ? `${phaseName} · ${weekLabel}` : weekLabel}
                >
                  {week} · {formatShortDate(phaseLabels[index]?.start ?? timelineDays[index * 7]?.date ?? trainingPlan.overview.startDate)}
                </Link>
              );
            })}
            <div className="sticky left-0 z-40 border-r border-slate-300 bg-white pr-3 shadow-[2px_0_0_rgba(15,23,42,0.06)]" style={{ gridColumn: "1", gridRow: "2 / span 2" }} />
            {timelineDays.map((day) => (
              <div
                key={day.date}
                className="border-x border-t border-slate-200 bg-white py-0.5 text-center leading-tight text-slate-500"
                style={{ gridColumn: dayColumn(day.date), gridRow: 2 }}
                title={`${day.shortDate} · W${day.week}`}
              >
                {day.dayLabel}
              </div>
            ))}
            {timelineDays.map((day) => (
              <div
                key={`${day.date}-day`}
                className="border-x border-b border-slate-200 bg-white py-0.5 text-center text-[10px] font-semibold leading-tight text-slate-500"
                style={{ gridColumn: dayColumn(day.date), gridRow: 3 }}
                title={`${day.shortDate} · W${day.week}`}
              >
                {day.dayOfMonth}
              </div>
            ))}
          </div>

          <div className="relative mt-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 top-0 z-0"
              style={{
                left: GANTT_LABEL_COLUMN_WIDTH,
                width: `calc(${TIMELINE_DAY_COUNT} * ${GANTT_DAY_COLUMN_WIDTH})`,
                backgroundImage: `linear-gradient(to right, transparent calc(${GANTT_DAY_COLUMN_WIDTH} - 1px), rgba(226, 232, 240, 0.8) calc(${GANTT_DAY_COLUMN_WIDTH} - 1px))`,
                backgroundSize: `${GANTT_DAY_COLUMN_WIDTH} 100%`,
              }}
            />
            {Array.from({ length: 13 }, (_, index) => (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 top-0 z-30 w-px bg-slate-300"
                key={index}
                style={{ left: `calc(${GANTT_LABEL_COLUMN_WIDTH} + (${index * 7} * ${GANTT_DAY_COLUMN_WIDTH}))` }}
              />
            ))}
            {sections.map((section) => (
              <div key={section.label}>
                <GanttSectionHeader section={section} />
                {section.rows.map((row) => <GanttDailyRow key={row.label} row={row} sectionTone={section.tone} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type GanttRowKind = "testing" | "phase" | "sport" | "camp" | "onIce" | "travel" | "deload" | "taper";
type GanttSectionTone = "events" | "methodology";

type GanttSection = {
  label: string;
  detail: string;
  tone: GanttSectionTone;
  rows: GanttRow[];
};

type GanttRow = {
  label: string;
  kind: GanttRowKind;
  items: {
    label: string;
    shortLabel: string;
    startDate: string;
    endDate: string;
    displayKind: PlanGanttDisplayKind;
    title: string;
  }[];
};

function buildLockedGanttSections(): GanttSection[] {
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

  const sportLoadRows = buildPlanSportLoadOverlayRows().map((row): GanttRow => ({
    label: row.label,
    kind: markerKindFor(row.kind),
    items: row.markers.map((marker) => ({
      label: marker.label,
      shortLabel: marker.shortLabel,
      title: marker.title,
      startDate: marker.startDate,
      endDate: marker.endDate,
      displayKind: marker.displayKind,
    })),
  }));

  const eventRows: GanttRow[] = [
    { label: "Perf Testing", kind: "testing", items: [1, 3, 5, 7, 10, 12].map((week) => milestoneForWeek(week, "Perf Testing", "Test")) },
    ...sportLoadRows,
  ];

  const methodologyRows: GanttRow[] = [
    phaseSpan("GPP / Foundation", "GPP / Foundation", 1, 2, "phase"),
    phaseSpan("Strength + Acceleration", "Strength + Accel", 3, 4, "phase"),
    phaseSpan("Power Transition", "Power Transition", 5, 6, "phase"),
    phaseSpan("Deload", "Deload", 7, 7, "deload"),
    phaseSpan("Power/Agility + Carleton", "Power/Agility", 8, 8, "phase"),
    phaseSpan("Game-Speed / Sprint", "Game-Speed / Sprint", 9, 10, "phase"),
    phaseSpan("Tryout Sim", "Tryout Sim", 11, 11, "phase"),
    phaseSpan("Taper + Peak", "Taper", 12, 12, "taper"),
  ];

  return [
    {
      label: "Sport Loads / Events / Testing",
      detail: "dated markers and exact-date event bars",
      tone: "events",
      rows: eventRows,
    },
    {
      label: "Methodology Phases",
      detail: "training blocks across the 12-week plan",
      tone: "methodology",
      rows: methodologyRows,
    },
  ];
}

function phaseSpan(label: string, shortLabel: string, startWeek: number, endWeek: number, kind: GanttRowKind): GanttRow {
  const start = phaseLabels.find((entry) => entry.week === startWeek);
  const end = phaseLabels.find((entry) => entry.week === endWeek);
  if (!start || !end) {
    throw new Error(`Cannot render Gantt phase ${label}; missing v8.4 week ${startWeek}-${endWeek}.`);
  }

  return {
    label,
    kind,
    items: [{
      label,
      shortLabel,
      startDate: start.start,
      endDate: end.end,
      displayKind: "bar",
      title: `${label} · ${formatShortDate(start.start)}-${formatShortDate(end.end)}`,
    }],
  };
}

function milestoneForWeek(weekNumber: number, label: string, shortLabel: string): GanttRow["items"][number] {
  const week = phaseLabels.find((entry) => entry.week === weekNumber);
  if (!week) {
    throw new Error(`Cannot render Gantt milestone ${label}; missing v8.4 week ${weekNumber}.`);
  }

  return {
    label: `${label} · W${weekNumber}`,
    shortLabel,
    startDate: week.start,
    endDate: week.start,
    displayKind: "marker",
    title: `${label} · W${weekNumber} · ${formatShortDate(week.start)}`,
  };
}

function GanttSectionHeader({ section }: { section: GanttSection }) {
  const toneClass = section.tone === "events" ? "border-violet-200 bg-violet-50 text-violet-950" : "border-cyan-200 bg-cyan-50 text-cyan-950";

  return (
    <div className={`relative z-20 mt-1 grid h-6 items-center border-y text-[10px] font-black uppercase ${toneClass}`} style={{ gridTemplateColumns: GANTT_GRID_TEMPLATE_COLUMNS }}>
      <div className="sticky left-0 z-40 flex h-6 items-center border-r border-slate-300 bg-inherit px-2 tracking-wide shadow-[2px_0_0_rgba(15,23,42,0.06)]">{section.label}</div>
      <div className="flex h-6 items-center px-2 text-[9px] font-semibold normal-case tracking-normal opacity-80" style={{ gridColumn: "2 / span 84" }}>{section.detail}</div>
    </div>
  );
}

function GanttDailyRow({ row, sectionTone }: { row: GanttRow; sectionTone: GanttSectionTone }) {
  const labelTone = sectionTone === "events" ? "bg-violet-50" : "bg-cyan-50";

  return (
    <div className="relative z-10 grid h-[22px] items-center border-b border-slate-100" style={{ gridTemplateColumns: GANTT_GRID_TEMPLATE_COLUMNS }}>
      <div className={`sticky left-0 z-40 flex h-[22px] items-center overflow-hidden border-r border-slate-300 px-2 text-[10px] font-black leading-none text-slate-800 shadow-[2px_0_0_rgba(15,23,42,0.06)] ${labelTone}`}>{row.label}</div>
      <div className="relative grid h-[22px] grid-cols-subgrid" style={{ gridColumn: "2 / span 84" }}>
        {Array.from({ length: 84 }, (_, index) => (
          <div key={index} className="h-[22px]" />
        ))}
        {row.items.map((item) => (
          item.displayKind === "marker"
            ? <GanttMilestone key={`${item.startDate}-${item.label}`} item={item} kind={row.kind} />
            : <GanttBar key={`${item.startDate}-${item.endDate}-${item.label}`} item={item} kind={row.kind} />
        ))}
      </div>
    </div>
  );
}

function GanttBar({ item, kind }: { item: GanttRow["items"][number]; kind: GanttRowKind }) {
  const columns = getSpanGridColumns(item.startDate, item.endDate);

  return (
    <div
      className="z-10 my-auto h-3 border px-1 text-[8px] font-black leading-3 shadow-sm"
      style={{ ...ganttFillStyleFor(kind), gridColumn: `${columns.startColumn} / ${columns.endColumn}`, gridRow: 1 }}
      title={item.title}
    >
      <span className="block truncate">{item.shortLabel}</span>
    </div>
  );
}

function GanttMilestone({ item, kind }: { item: GanttRow["items"][number]; kind: GanttRowKind }) {
  const columns = getSpanGridColumns(item.startDate, item.endDate);
  const label = kind === "testing" ? "★" : "◆";

  return (
    <div
      className="z-20 flex items-center justify-center"
      style={{ gridColumn: `${columns.startColumn} / ${columns.endColumn}`, gridRow: 1 }}
      title={item.title}
    >
      <span className="flex h-4 w-4 items-center justify-center text-[11px] font-black leading-none" style={ganttMarkerStyleFor(kind)} aria-label={item.label}>
        {label}
      </span>
    </div>
  );
}

function markerKindFor(kind: PlanSportLoadOverlayKind): GanttRowKind {
  switch (kind) {
    case "camp":
      return "camp";
    case "onIce":
      return "onIce";
    case "travel":
      return "travel";
    case "sport":
      return "sport";
  }
}

function dayColumn(date: string) {
  const columns = getSpanGridColumns(date, date);
  return `${columns.startColumn + 1} / ${columns.endColumn + 1}`;
}

function ganttMarkerStyleFor(kind: GanttRowKind) {
  switch (kind) {
    case "testing":
      return { backgroundColor: "#06b6d4", border: "1px solid rgba(22, 78, 99, 0.25)", color: "#083344" };
    case "sport":
      return { backgroundColor: "#ddd6fe", border: "1px solid #7c3aed", color: "#3b0764" };
    case "camp":
      return { backgroundColor: "#fdba74", border: "1px solid #ea580c", color: "#7c2d12" };
    case "onIce":
      return { backgroundColor: "#c7d2fe", border: "1px solid #4338ca", color: "#312e81" };
    case "travel":
      return { backgroundColor: "#99f6e4", border: "1px solid #0f766e", color: "#134e4a" };
    case "phase":
      return { backgroundColor: "#0f6f9f", border: "1px solid #075985", color: "#ffffff" };
    case "deload":
      return { backgroundColor: "#99f6e4", border: "1px solid #0f766e", color: "#134e4a" };
    case "taper":
      return { backgroundColor: "#fde68a", border: "1px solid #d97706", color: "#78350f" };
  }
}

function ganttFillStyleFor(kind: GanttRowKind) {
  switch (kind) {
    case "phase":
      return { backgroundColor: "#0f6f9f", borderColor: "#075985", color: "#ffffff", fontWeight: 800, borderRadius: 0 as const };
    case "sport":
      return { backgroundColor: "#ddd6fe", borderColor: "#7c3aed", color: "#3b0764", fontWeight: 800, borderRadius: 0 as const };
    case "camp":
      return { backgroundColor: "#fdba74", borderColor: "#ea580c", color: "#7c2d12", fontWeight: 800, borderRadius: 0 as const };
    case "onIce":
      return { backgroundColor: "#c7d2fe", borderColor: "#4338ca", color: "#312e81", fontWeight: 800, borderRadius: 0 as const };
    case "travel":
      return { backgroundColor: "#99f6e4", borderColor: "#0f766e", color: "#134e4a", fontWeight: 800, borderRadius: 0 as const };
    case "deload":
      return { backgroundColor: "#99f6e4", borderColor: "#0f766e", color: "#134e4a", fontWeight: 800, borderRadius: 0 as const };
    case "taper":
      return { backgroundColor: "#fde68a", borderColor: "#d97706", color: "#78350f", fontWeight: 800, borderRadius: 0 as const };
    case "testing":
      return { backgroundColor: "#06b6d4", borderColor: "rgba(22, 78, 99, 0.15)", color: "#083344", fontWeight: 800, borderRadius: 0 as const };
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
