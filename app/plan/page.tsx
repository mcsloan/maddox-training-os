import Link from "next/link";
import { ExternalLoadChip, LoadChip, LoadChipLegend, PhaseChip, PlanTagChip } from "@/components/LoadChips";
import { WeeklyLoadChart } from "@/components/WeeklyLoadChart";
import { formatPlanDate, getWeekExternalLoads, getWeekPlanSummary, trainingPlan } from "@/lib/trainingData";

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
          <div><p className="label text-lime">Sport loads</p><ul className="list-inside list-disc space-y-1 text-slate-200">{overview.externalLoads.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary bg-blue" href="/calendar">Open Calendar</Link><Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link></div>
      </section>

      <section className="card mt-6">
        <p className="label">Shared plan language</p>
        <h2 className="text-2xl font-black">Chip Legend</h2>
        <p className="mt-2 text-sm text-slate-600">Every chip uses both text and a consistent visual family. Rules override optional training work.</p>
        <div className="mt-5"><LoadChipLegend /></div>
      </section>

      <PhaseGantt />
      <WeeklyLoadChart />

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {weeks.map((week) => {
          const loads = getWeekExternalLoads(week);
          const summary = getWeekPlanSummary(week);
          const kpiDays = trainingPlan.days.filter((day) => day.weekNumber === week.weekNumber && day.kpiTestIds?.length);
          return <article className="card" key={week.weekNumber}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="label">Week {week.weekNumber} · {formatPlanDate(week.startDate, { month: "short", day: "numeric" })}-{formatPlanDate(week.endDate, { month: "short", day: "numeric" })}</p><h2 className="text-xl font-black">{summary.loadEmphasis}</h2><div className="mt-2 flex flex-wrap gap-2"><PhaseChip phase={week.phase} />{week.weekNumber === 7 || week.weekNumber === 10 ? <LoadChip kind="deload" /> : null}{week.weekNumber === 12 ? <LoadChip kind="taper" /> : null}</div></div>
              <Link className="text-sm font-bold text-blue" href={`/calendar#week-${week.weekNumber}`}>Days</Link>
            </div>
            <p className="mt-3 font-semibold">{week.objective}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Metric label="Training days" value={summary.trainingDays} />
              <Metric label="Sport load days" value={summary.externalLoadDays} />
              <Metric label="KPI days" value={summary.kpiDays} />
              <Metric label="Recovery / limited" value={summary.recoveryProtectedDays} />
              <Metric label="High-load days" value={summary.highLoadDays} />
              <Metric label="Overall load" value={`${summary.loadLevel}/5`} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div className="rounded-xl bg-ice p-3"><p className="label">Hard days</p><p className="font-semibold">{week.hardDays}</p></div><div className="rounded-xl bg-ice p-3"><p className="label">Skill days</p><p className="font-semibold">{week.skillDays}</p></div><div className="rounded-xl bg-ice p-3"><p className="label">Recovery days</p><p className="font-semibold">{week.recoveryDays}</p></div></div>
            {loads.length > 0 && <div className="mt-4"><p className="label">Sport load summary</p><div className="flex flex-wrap gap-2">{loads.map((load) => <ExternalLoadChip key={load.id} type={load.type} provider={load.provider} title={`${formatPlanDate(load.date, { month: "short", day: "numeric" })}: ${load.title}`} />)}</div></div>}
            {kpiDays.length > 0 && <div className="mt-4"><p className="label">Testing</p><div className="flex flex-wrap gap-2">{kpiDays.map((day) => <Link href={`/day/${day.date}`} key={day.date}><PlanTagChip tag={day.tags?.includes("baseline") ? "baseline" : day.tags?.includes("optional") ? "optional" : "conditional"} label={`${formatPlanDate(day.date, { month: "short", day: "numeric" })}: ${day.primarySession}`} /></Link>)}</div></div>}
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Parent watch-out:</strong> {week.parentWatchOut}</p>
          </article>;
        })}
      </section>
      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>
    </div>
  );
}

function PhaseGantt() {
  const rows = [
    { label: "Foundation", start: 1, span: 3, kind: "foundation" as const },
    { label: "Chase Hull Camp Load", start: 4, span: 1, kind: "chase-hull-camp" as const },
    { label: "Speed + Power", start: 5, span: 2, kind: "speed-power" as const },
    { label: "Deload / Consolidation", start: 7, span: 1, kind: "deload" as const },
    { label: "Carleton Camp Load", start: 8, span: 1, kind: "carleton-camp" as const },
    { label: "Game-Speed / Peak Build", start: 9, span: 2, kind: "game-speed" as const },
    { label: "Sensplex Camp Load", start: 11, span: 1, kind: "sensplex-camp" as const },
    { label: "Tryout Taper", start: 12, span: 1, kind: "taper" as const },
  ];
  return <section className="card mt-6"><p className="label">12-week strategy</p><h2 className="text-2xl font-black">Phase Gantt</h2><p className="mt-2 text-sm text-slate-600">The plan builds capacity, protects camp weeks, adds game pace, and finishes fresh.</p><div className="mt-5 overflow-x-auto"><div className="min-w-[760px]"><div className="mb-2 grid grid-cols-12 gap-1">{trainingPlan.weeks.map((week) => <Link className="text-center text-xs font-black text-blue" href={`/calendar#week-${week.weekNumber}`} key={week.weekNumber}>W{week.weekNumber}</Link>)}</div><div className="space-y-2">{rows.map((row) => <div className="grid grid-cols-12 gap-1" key={row.label}><div className="rounded-xl py-2 text-center" style={{ gridColumn: `${row.start} / span ${row.span}` }}><LoadChip kind={row.kind} label={row.label} /></div></div>)}</div></div></div></section>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-rink p-3"><p className="label">{label}</p><p className="text-xl font-black">{value}</p></div>;
}
