import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPlanDate } from "@/lib/trainingData";
import { projectCanonicalDay } from "@/lib/projections/canonicalDay";

export default async function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = projectCanonicalDay(date);
  if (!day.isResolvable) notFound();
  const activities = day.activities.filter((activity) => activity.summaryVisible);
  const trainingTotal = activities
    .filter((activity) => activity.logType !== "sport_load_log")
    .reduce((sum, activity) => sum + (activity.plannedDurationMinutes ?? 0), 0);

  return (
    <main className="mx-auto max-w-2xl pb-8">
      <Link className="mb-4 inline-block text-sm font-bold text-blue" href="/calendar">← Calendar</Link>
      <section className="card bg-navy text-white">
        <p className="label text-lime">{day.phase}</p>
        <h1 className="text-3xl font-black sm:text-4xl">{day.title}</h1>
        <p className="mt-2 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
      </section>

      <section className="card mt-4">
        <div className="divide-y divide-rink">
          {activities.map((activity) => {
            const sportLoad = activity.logType === "sport_load_log"
              ? day.sportLoads.find((load) => load.title === activity.athleteTitle)
              : null;
            const duration = activity.plannedDurationMinutes ?? sportLoad?.plannedDurationMinutes ?? null;
            return (
              <article className="py-3 first:pt-0 last:pb-0" data-activity-id={activity.id} key={activity.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-black">{activity.athleteTitle}</h2>
                    {activity.focus && <p className="mt-1 text-sm font-semibold text-blue">Focus: {activity.focus}</p>}
                    {activity.eventDependent && <p className="mt-1 text-xs font-semibold text-slate-500">Only if no tryout/event is scheduled.</p>}
                  </div>
                  {duration !== null && <span className="shrink-0 text-sm font-bold text-slate-600">{duration} min</span>}
                </div>
              </article>
            );
          })}
        </div>
        {activities.length === 0 && <p className="font-semibold text-slate-600">No required training is scheduled.</p>}
        {trainingTotal > 0 && <p className="mt-4 border-t border-rink pt-3 text-right font-black">Training total: {trainingTotal} min</p>}
      </section>

      <Link className="btn-primary mt-4 min-h-14 w-full text-center text-lg" href={day.logging.primaryHref}>Log Today&apos;s Training</Link>
    </main>
  );
}
