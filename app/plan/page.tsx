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

function PhaseGantt() {
  const groups = [
    { phase: { label: "Foundation + Acceleration", start: 1, span: 4, style: "bg-blue-800 text-white" }, overlays: [{ label: "Lacrosse", start: 1, span: 2, style: "bg-purple-300 text-purple-950" }, { label: "4v4", start: 1, span: 2, style: "bg-indigo-300 text-indigo-950" }, { label: "Chase Camp", start: 4, span: 1, style: "bg-orange-300 text-orange-950" }] },
    { phase: { label: "Speed + Power", start: 5, span: 2, style: "bg-blue-600 text-white" }, overlays: [{ label: "Marc Ice", start: 5, span: 1, style: "bg-indigo-300 text-indigo-950" }, { label: "Marc Ice", start: 6, span: 1, style: "bg-indigo-300 text-indigo-950" }] },
    { phase: { label: "Deload", start: 7, span: 1, style: "bg-teal-600 text-white" }, overlays: [] },
    { phase: { label: "Game-Speed + Reactive Agility", start: 8, span: 3, style: "bg-indigo-800 text-white" }, overlays: [{ label: "Carleton", start: 8, span: 1, style: "bg-orange-300 text-orange-950" }, { label: "Marc Ice", start: 9, span: 1, style: "bg-indigo-300 text-indigo-950" }] },
    { phase: { label: "Training Camp / Tryout Simulation", start: 11, span: 1, style: "bg-slate-800 text-white" }, overlays: [{ label: "Sensplex", start: 11, span: 1, style: "bg-orange-300 text-orange-950" }] },
    { phase: { label: "Taper + Peak", start: 12, span: 1, style: "bg-amber-400 text-amber-950" }, overlays: [] },
  ];
  return <section className="card mt-6 bg-white"><p className="label">Methodology first</p><h2 className="text-2xl font-black">Phase Gantt</h2><p className="mt-2 text-sm text-slate-600">Method phases lead the plan. Sport loads and performance tests are scheduled within them.</p><div className="mt-5 overflow-x-auto"><div className="min-w-[900px]"><div className="grid grid-cols-12 gap-1 border-b border-slate-300 pb-2">{trainingPlan.weeks.map((week) => <Link className="text-center text-xs font-black text-blue" href={`/calendar#week-${week.weekNumber}`} key={week.weekNumber}>W{week.weekNumber}</Link>)}</div><div className="mt-3 grid grid-cols-12 gap-1"><GanttBar label="Perf Test" start={1} span={1} style="bg-cyan-500 text-cyan-950" /><GanttBar label="Perf Test" start={3} span={1} style="bg-cyan-500 text-cyan-950" /></div><div className="mt-4 space-y-4">{groups.map((group) => <div className="border-l-4 border-slate-200 pl-2" key={group.phase.label}><div className="grid grid-cols-12 gap-1"><GanttBar {...group.phase} primary /></div>{group.overlays.length > 0 && <div className="mt-1 space-y-1">{group.overlays.map((overlay, index) => <div className="grid grid-cols-12 gap-1" key={`${overlay.label}-${index}`}><GanttBar {...overlay} /></div>)}</div>}</div>)}</div></div></div></section>;
}

function GanttBar({ label, start, span, style, primary = false }: { label: string; start: number; span: number; style: string; primary?: boolean }) {
  return <div className={`${style} min-w-0 overflow-hidden rounded-none px-2 ${primary ? "py-3 text-sm font-black" : "py-1 text-xs font-bold"}`} style={{ gridColumn: `${start} / span ${span}` }} title={label}><span className="block truncate">{label}</span></div>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-rink p-3"><p className="label">{label}</p><p className="text-xl font-black">{value}</p></div>;
}
