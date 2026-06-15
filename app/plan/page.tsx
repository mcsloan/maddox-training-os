import Link from "next/link";
import { ExternalLoadChip, LoadChip, LoadChipLegend, PhaseChip, PlanTagChip } from "@/components/LoadChips";
import { WeeklyLoadChart } from "@/components/WeeklyLoadChart";
import { formatPlanDate, getWeekExternalLoads, getWeekPlanSummary, trainingPlan, userFacingPlanText } from "@/lib/trainingData";
import { ExternalLoadType } from "@/lib/types";

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
        <h2 className="max-w-4xl text-2xl font-black">{overview.primaryGoal}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div><p className="label text-lime">Training bias</p><ul className="list-inside list-disc space-y-1 text-slate-200">{overview.trainingBias.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><p className="label text-lime">Sport loads</p><ul className="list-inside list-disc space-y-1 text-slate-200">{overview.externalLoads.map((item) => <li key={item}>{userFacingPlanText(item)}</li>)}</ul></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary bg-blue" href="/calendar">Open Calendar</Link><Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link></div>
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
          const loads = getWeekExternalLoads(week);
          const summary = getWeekPlanSummary(week);
          const kpiDays = trainingPlan.days.filter((day) => day.weekNumber === week.weekNumber && day.kpiTestIds?.length);
          return <article className="card" key={week.weekNumber}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="label">Week {week.weekNumber} · {formatPlanDate(week.startDate, { month: "short", day: "numeric" })}-{formatPlanDate(week.endDate, { month: "short", day: "numeric" })}</p><h2 className="text-xl font-black">{summary.loadEmphasis}</h2><div className="mt-2 flex flex-wrap gap-2"><PhaseChip phase={summary.loadEmphasis} />{week.weekNumber === 7 ? <LoadChip kind="deload" /> : null}{week.weekNumber === 12 ? <LoadChip kind="taper" /> : null}</div></div>
              <Link className="text-sm font-bold text-blue" href={`/calendar#week-${week.weekNumber}`}>Days</Link>
            </div>
            <p className="mt-3 font-semibold">{userFacingPlanText(week.objective)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Metric label="Training days" value={summary.trainingDays} />
              <Metric label="Sport load days" value={summary.externalLoadDays} />
              <Metric label="Perf testing days" value={summary.kpiDays} />
              <Metric label="Recovery days" value={summary.recoveryProtectedDays} />
              <Metric label="High-load days" value={summary.highLoadDays} />
              <Metric label="Overall load" value={`${summary.loadLevel}/5`} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div className="rounded-xl bg-ice p-3"><p className="label">Hard days</p><p className="font-semibold">{userFacingPlanText(week.hardDays)}</p></div><div className="rounded-xl bg-ice p-3"><p className="label">Skill days</p><p className="font-semibold">{userFacingPlanText(week.skillDays)}</p></div><div className="rounded-xl bg-ice p-3"><p className="label">Recovery days</p><p className="font-semibold">{userFacingPlanText(week.recoveryDays)}</p></div></div>
            {loads.length > 0 && <div className="mt-4"><p className="label">Sport load summary</p><div className="flex flex-wrap gap-2">{uniqueSportLoadTypes(loads.map((load) => load.type)).map((type) => <ExternalLoadChip key={type} type={type} />)}</div></div>}
            {kpiDays.length > 0 && <div className="mt-4"><p className="label">Testing</p><div className="flex flex-wrap gap-2">{kpiDays.map((day) => <Link href={`/day/${day.date}`} key={day.date}><PlanTagChip tag="kpi" /></Link>)}</div></div>}
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Parent watch-out:</strong> {userFacingPlanText(week.parentWatchOut)}</p>
          </article>;
        })}
      </section>
      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>
    </div>
  );
}

function uniqueSportLoadTypes(types: ExternalLoadType[]) {
  const family = (type: (typeof types)[number]) => type.startsWith("lacrosse") ? "lacrosse" : type === "hockey_camp" ? "camp" : "on-ice";
  return types.filter((type, index) => types.findIndex((candidate) => family(candidate) === family(type)) === index);
}

function MethodologyPanel() {
  return <section className="card mt-6"><p className="label">Plan logic</p><h2 className="text-2xl font-black">12-Week Methodology</h2><p className="mt-3 max-w-4xl text-slate-700">This plan blends HockeyTraining-style Speed Stack scheduling, Nike&apos;s 12-week offseason structure, and Maddox&apos;s actual summer sport calendar. The goal is not to do more every week. The goal is to build, express, recover, and peak.</p><ul className="mt-5 list-inside list-disc space-y-2 text-sm font-semibold"><li>Build movement quality and acceleration first.</li><li>Layer speed, power, puck skill, and shot habits.</li><li>Treat camps and on-ice sessions as planned hockey stress, not extra work.</li><li>Reduce dryland volume around high sport-load weeks.</li><li>Taper into tryouts with fresh legs, confidence, and speed.</li></ul></section>;
}

const PERF_TEST_WEEKS = [1, 3, 5, 7, 10, 12] as const;

const GANTT_GROUPS = [
  {
    phase: {
      label: "Foundation + Acceleration",
      shortLabel: "Foundation",
      startWeek: 1,
      endWeek: 4,
      kind: "phase",
    },
    overlays: [
      {
        label: "Lacrosse",
        shortLabel: "Lacrosse",
        startWeek: 1,
        endWeek: 2,
        kind: "sport",
      },
      {
        label: "4v4",
        shortLabel: "4v4",
        startWeek: 1,
        endWeek: 2,
        kind: "sport",
      },
      {
        label: "Chase Hull Camp",
        shortLabel: "Chase",
        startWeek: 4,
        endWeek: 4,
        kind: "camp",
      },
    ],
  },
  {
    phase: {
      label: "Speed + Power",
      shortLabel: "Speed + Power",
      startWeek: 5,
      endWeek: 6,
      kind: "phase",
    },
    overlays: [
      {
        label: "Marc O’Connor Ice",
        shortLabel: "Marc",
        startWeek: 5,
        endWeek: 5,
        kind: "onIce",
      },
      {
        label: "Marc O’Connor Ice",
        shortLabel: "Marc",
        startWeek: 6,
        endWeek: 6,
        kind: "onIce",
      },
    ],
  },
  {
    phase: {
      label: "Deload",
      shortLabel: "Deload",
      startWeek: 7,
      endWeek: 7,
      kind: "deload",
    },
    overlays: [],
  },
  {
    phase: {
      label: "Game-Speed + Reactive Agility",
      shortLabel: "Game-Speed",
      startWeek: 8,
      endWeek: 10,
      kind: "phase",
    },
    overlays: [
      {
        label: "Carleton Camp",
        shortLabel: "Carleton",
        startWeek: 8,
        endWeek: 8,
        kind: "camp",
      },
      {
        label: "Marc O’Connor Ice",
        shortLabel: "Marc",
        startWeek: 9,
        endWeek: 9,
        kind: "onIce",
      },
    ],
  },
  {
    phase: {
      label: "Training Camp / Tryout Simulation",
      shortLabel: "Training Camp",
      startWeek: 11,
      endWeek: 11,
      kind: "phase",
    },
    overlays: [
      {
        label: "Sensplex Camp",
        shortLabel: "Sensplex",
        startWeek: 11,
        endWeek: 11,
        kind: "camp",
      },
    ],
  },
  {
    phase: {
      label: "Taper + Peak",
      shortLabel: "Taper + Peak",
      startWeek: 12,
      endWeek: 12,
      kind: "taper",
    },
    overlays: [],
  },
] as const;

function PhaseGantt() {
  const perfRow: GanttPerfRow = {
    label: "Perf Testing",
    shortLabel: "Perf",
    kind: "testing",
    markers: PERF_TEST_WEEKS.map((week) => ({
      label: "Perf Testing",
      shortLabel: "Test",
      startWeek: week,
      endWeek: week,
      kind: "testing",
    })),
  };

  const rows: Array<GanttPerfRow | GanttGroupRow> = [
    perfRow,
    ...GANTT_GROUPS.flatMap((group) => [
      {
        ...group.phase,
        isPrimary: true,
      },
      ...group.overlays,
    ]),
  ];

  return (
    <section className="card mt-6 bg-white">
      <p className="label">Methodology first</p>
      <h2 className="text-2xl font-black">Phase Gantt</h2>
      <p className="mt-2 text-sm text-slate-600">Method phases lead the plan. Sport loads and performance tests are scheduled within them.</p>
      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="grid grid-cols-[12rem_repeat(12,minmax(3.75rem,1fr))] gap-1 border-b border-slate-300 pb-2 text-xs font-black uppercase tracking-wide text-slate-500">
            <div />
            {trainingPlan.weeks.map((week) => (
              <Link className="text-center text-blue" href={`/calendar#week-${week.weekNumber}`} key={week.weekNumber}>
                W{week.weekNumber}
              </Link>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {rows.map((row) => (
              "markers" in row ? (
                <GanttPerfRow key={row.label} row={row} />
              ) : (
                <GanttRow key={`${row.label}-${row.startWeek}`} row={row} />
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type GanttGroupRow = {
  label: string;
  shortLabel: string;
  startWeek: number;
  endWeek: number;
  kind: "phase" | "sport" | "camp" | "onIce" | "deload" | "taper";
  isPrimary?: boolean;
};

type GanttPerfRow = {
  label: string;
  shortLabel: string;
  kind: "testing";
  markers: {
    label: string;
    shortLabel: string;
    startWeek: number;
    endWeek: number;
    kind: "testing";
  }[];
};

function GanttRow({ row }: { row: GanttGroupRow }) {
  const style = ganttStyleFor(row.kind, row.isPrimary);
  return (
    <div className="grid grid-cols-[12rem_repeat(12,minmax(3.75rem,1fr))] items-center gap-1">
      <div className={`pr-3 text-sm font-black text-slate-800 ${row.isPrimary ? "uppercase tracking-wide text-slate-950" : ""}`}>{row.label}</div>
      <div className="min-w-0" style={{ gridColumn: `${row.startWeek + 1} / ${row.endWeek + 2}` }}>
        <div className={`${style} w-full min-w-0 overflow-hidden border border-slate-900/10 px-2 py-2 text-xs font-black leading-tight shadow-sm`} title={row.label}>
          <span className="block truncate">{row.shortLabel}</span>
        </div>
      </div>
    </div>
  );
}

function GanttPerfRow({ row }: { row: GanttPerfRow }) {
  return (
    <div className="grid grid-cols-[12rem_repeat(12,minmax(3.75rem,1fr))] items-center gap-1">
      <div className="pr-3 text-sm font-black text-slate-800">{row.label}</div>
      <div className="grid min-w-0 grid-cols-12 gap-1" style={{ gridColumn: "2 / span 12" }}>
        {row.markers.map((marker) => (
          <div
            key={`${marker.label}-${marker.startWeek}`}
            className="min-h-[2.25rem] border border-cyan-900/15 bg-cyan-500 px-2 py-1 text-[11px] font-black text-cyan-950 shadow-sm"
            style={{ gridColumn: `${marker.startWeek} / span 1` }}
            title={marker.label}
          >
            <span className="block truncate">{marker.shortLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ganttStyleFor(kind: GanttGroupRow["kind"], primary = false) {
  if (primary) {
    switch (kind) {
      case "phase":
        return "bg-blue-800 text-white";
      case "deload":
        return "bg-teal-700 text-white";
      case "taper":
        return "bg-amber-400 text-amber-950";
      default:
        return "bg-blue-800 text-white";
    }
  }

  switch (kind) {
    case "sport":
      return "bg-purple-200 text-purple-950";
    case "camp":
      return "bg-orange-300 text-orange-950";
    case "onIce":
      return "bg-indigo-300 text-indigo-950";
    case "deload":
      return "bg-teal-200 text-teal-950";
    case "taper":
      return "bg-amber-200 text-amber-950";
    default:
      return "bg-slate-200 text-slate-950";
  }
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-rink p-3"><p className="label">{label}</p><p className="text-xl font-black">{value}</p></div>;
}
