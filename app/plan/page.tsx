import Link from "next/link";
import { formatPlanDate, trainingPlan } from "@/lib/trainingData";

export default function PlanPage() {
  const { overview, weeks, version, sourceTag } = trainingPlan;

  return (
    <div>
      <div className="mb-6">
        <p className="label">11-week offseason plan</p>
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

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {weeks.map((week) => (
          <article className="card" key={week.weekNumber}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="label">Week {week.weekNumber} · {formatPlanDate(week.startDate, { month: "short", day: "numeric" })}-{formatPlanDate(week.endDate, { month: "short", day: "numeric" })}</p><h2 className="text-xl font-black">{week.phase}</h2></div>
              <Link className="text-sm font-bold text-blue" href={`/calendar#week-${week.weekNumber}`}>Days</Link>
            </div>
            <p className="mt-3 font-semibold">{week.objective}</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-ice p-3"><p className="label">Hard</p><p className="font-semibold">{week.hardDays}</p></div>
              <div className="rounded-xl bg-ice p-3"><p className="label">Skill</p><p className="font-semibold">{week.skillDays}</p></div>
              <div className="rounded-xl bg-ice p-3"><p className="label">Recovery</p><p className="font-semibold">{week.recoveryDays}</p></div>
            </div>
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Parent watch-out:</strong> {week.parentWatchOut}</p>
          </article>
        ))}
      </section>
      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>
    </div>
  );
}
