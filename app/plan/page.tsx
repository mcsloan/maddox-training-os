import Link from "next/link";
import { ExternalLoadChip, LoadChip, LoadChipLegend, PhaseChip, PlanTagChip } from "@/components/LoadChips";
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
          <div><p className="label text-lime">External loads</p><ul className="list-inside list-disc space-y-1 text-slate-200">{overview.externalLoads.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary bg-blue" href="/calendar">Open Calendar</Link><Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link></div>
      </section>

      <section className="card mt-6">
        <p className="label">Shared plan language</p>
        <h2 className="text-2xl font-black">Chip Legend</h2>
        <p className="mt-2 text-sm text-slate-600">Every chip uses both text and a consistent visual family. Rules override optional training work.</p>
        <div className="mt-5"><LoadChipLegend /></div>
      </section>

      <section className="card mt-6">
        <div><p className="label">Visual load overview</p><h2 className="text-2xl font-black">12-Week Strategy</h2><p className="mt-2 text-sm text-slate-600">Build the foundation, absorb camps and external loads, add game speed, then taper into tryouts.</p></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {weeks.map((week) => {
            const summary = getWeekPlanSummary(week);
            return <Link href={`/calendar#week-${week.weekNumber}`} className={`rounded-2xl border-2 p-4 ${summary.loadLevel >= 5 ? "border-red-300 bg-red-50" : summary.loadLevel <= 2 ? "border-teal-300 bg-teal-50" : "border-rink bg-ice"}`} key={week.weekNumber}>
              <p className="label">Week {week.weekNumber} · {formatPlanDate(week.startDate, { month: "short", day: "numeric" })}-{formatPlanDate(week.endDate, { month: "short", day: "numeric" })}</p>
              <PhaseChip phase={week.phase} />
              <h3 className="mt-2 font-black">{summary.loadEmphasis}</h3>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-blue" style={{ width: `${summary.loadLevel * 20}%` }} /></div>
              <p className="mt-1 text-xs font-bold">Overall load {summary.loadLevel}/5</p>
              <p className="mt-2 text-xs text-slate-600">{summary.trainingDays} training · {summary.externalLoadDays} external · {summary.recoveryProtectedDays} protected</p>
            </Link>;
          })}
        </div>
      </section>

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
              <Metric label="External load days" value={summary.externalLoadDays} />
              <Metric label="KPI days" value={summary.kpiDays} />
              <Metric label="Recovery / protected" value={summary.recoveryProtectedDays} />
              <Metric label="High-load days" value={summary.highLoadDays} />
              <Metric label="Overall load" value={`${summary.loadLevel}/5`} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div className="rounded-xl bg-ice p-3"><p className="label">Hard days</p><p className="font-semibold">{week.hardDays}</p></div><div className="rounded-xl bg-ice p-3"><p className="label">Skill days</p><p className="font-semibold">{week.skillDays}</p></div><div className="rounded-xl bg-ice p-3"><p className="label">Recovery days</p><p className="font-semibold">{week.recoveryDays}</p></div></div>
            {loads.length > 0 && <div className="mt-4"><p className="label">External load summary</p><div className="flex flex-wrap gap-2">{loads.map((load) => <ExternalLoadChip key={load.id} type={load.type} provider={load.provider} title={`${formatPlanDate(load.date, { month: "short", day: "numeric" })}: ${load.title}`} />)}</div></div>}
            {kpiDays.length > 0 && <div className="mt-4"><p className="label">KPI events</p><div className="flex flex-wrap gap-2">{kpiDays.map((day) => <Link href={`/day/${day.date}`} key={day.date}><PlanTagChip tag="kpi" label={`${formatPlanDate(day.date, { month: "short", day: "numeric" })}: KPI checkpoint`} /></Link>)}</div></div>}
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Parent watch-out:</strong> {week.parentWatchOut}</p>
          </article>;
        })}
      </section>
      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-rink p-3"><p className="label">{label}</p><p className="text-xl font-black">{value}</p></div>;
}
