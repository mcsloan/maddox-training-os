import Link from "next/link";
import { ExternalLoadChip, PlanTagChip } from "@/components/LoadChips";
import { formatPlanDate, getWeekExternalLoads, getWeekLoadLabel, getWeekLoadLevel, trainingPlan } from "@/lib/trainingData";

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
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="label">Visual load overview</p><h2 className="text-2xl font-black">12-Week Load Timeline</h2></div><div className="flex flex-wrap gap-2"><PlanTagChip tag="recovery" /><PlanTagChip tag="kpi" /><ExternalLoadChip type="hockey_camp" title="Camp" /><ExternalLoadChip type="on_ice" title="On-Ice" /></div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {weeks.map((week) => {
            const loads = getWeekExternalLoads(week);
            const level = getWeekLoadLevel(week);
            return <Link href={`/calendar#week-${week.weekNumber}`} className={`rounded-2xl border-2 p-4 ${level >= 5 ? "border-red-300 bg-red-50" : level <= 2 ? "border-teal-300 bg-teal-50" : "border-rink bg-ice"}`} key={week.weekNumber}><p className="label">Week {week.weekNumber} · Load {level}/5</p><h3 className="font-black">{getWeekLoadLabel(week.weekNumber)}</h3><p className="mt-2 text-xs text-slate-600">{loads.length ? `${loads.length} external load${loads.length === 1 ? "" : "s"}` : "Training + recovery"}</p></Link>;
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {weeks.map((week) => {
          const loads = getWeekExternalLoads(week);
          const loadLevel = getWeekLoadLevel(week);
          const kpiDays = trainingPlan.days.filter((day) => day.weekNumber === week.weekNumber && day.kpiTestIds?.length);
          return <article className="card" key={week.weekNumber}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="label">Week {week.weekNumber} · {formatPlanDate(week.startDate, { month: "short", day: "numeric" })}-{formatPlanDate(week.endDate, { month: "short", day: "numeric" })}</p><h2 className="text-xl font-black">{getWeekLoadLabel(week.weekNumber)}</h2><p className="text-sm font-semibold text-slate-500">{week.phase} · Load {loadLevel}/5</p></div>
              <Link className="text-sm font-bold text-blue" href={`/calendar#week-${week.weekNumber}`}>Days</Link>
            </div>
            <p className="mt-3 font-semibold">{week.objective}</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-ice p-3"><p className="label">Hard</p><p className="font-semibold">{week.hardDays}</p></div>
              <div className="rounded-xl bg-ice p-3"><p className="label">Skill</p><p className="font-semibold">{week.skillDays}</p></div>
              <div className="rounded-xl bg-ice p-3"><p className="label">Recovery</p><p className="font-semibold">{week.recoveryDays}</p></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl border border-rink p-3"><p className="label">External load days</p><p className="text-xl font-black">{new Set(loads.map((load) => load.date)).size}</p></div><div className="rounded-xl border border-rink p-3"><p className="label">KPI days</p><p className="text-xl font-black">{kpiDays.length}</p></div></div>
            {loads.length > 0 && <div className="mt-4"><p className="label">External load summary</p><div className="flex flex-wrap gap-2">{loads.map((load) => <ExternalLoadChip key={load.id} type={load.type} title={`${formatPlanDate(load.date, { month: "short", day: "numeric" })}: ${load.title}`} />)}</div></div>}
            {kpiDays.length > 0 && <div className="mt-4"><p className="label">KPI events</p><div className="flex flex-wrap gap-2">{kpiDays.map((day) => <Link href={`/day/${day.date}`} key={day.date}><PlanTagChip tag={`${formatPlanDate(day.date, { month: "short", day: "numeric" })}: KPI checkpoint`} /></Link>)}</div></div>}
            {(week.weekNumber === 7 || week.weekNumber === 10 || week.weekNumber === 12) && <div className="mt-4 flex gap-2"><PlanTagChip tag={week.weekNumber === 12 ? "taper" : "deload"} /></div>}
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Parent watch-out:</strong> {week.parentWatchOut}</p>
          </article>;
        })}
      </section>
      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>
    </div>
  );
}
