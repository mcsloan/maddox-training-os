import Link from "next/link";
import { formatPlanDate, trainingPlan } from "@/lib/trainingData";

export default function CalendarPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="label">Daily calendar</p>
        <h1 className="text-4xl font-black">Training Days</h1>
        <p className="mt-2 text-slate-600">Open any scheduled day to inspect the complete plan before starting.</p>
      </div>
      <div className="space-y-8">
        {trainingPlan.weeks.map((week) => {
          const days = trainingPlan.days.filter((day) => day.weekNumber === week.weekNumber);
          return (
            <section id={`week-${week.weekNumber}`} className="scroll-mt-24" key={week.weekNumber}>
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><p className="label">Week {week.weekNumber}</p><h2 className="text-2xl font-black">{week.phase}</h2></div><p className="text-sm font-semibold text-slate-500">{formatPlanDate(week.startDate)} to {formatPlanDate(week.endDate)}</p></div>
              <div className="grid gap-4 lg:grid-cols-2">
                {days.map((day) => (
                  <Link href={`/day/${day.date}`} className="card block border-2 border-transparent transition hover:border-blue" key={day.date}>
                    <div className="flex items-start justify-between gap-3"><div><p className="label">{formatPlanDate(day.date, { weekday: "long", month: "short", day: "numeric" })} · Week {day.weekNumber}</p><h3 className="text-xl font-black">{day.primarySession}</h3></div><span className="rounded-full bg-ice px-3 py-1 text-xs font-black text-blue">{day.dayRole}</span></div>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <p><strong>Phase:</strong> {day.phase}</p><p><strong>Duration:</strong> {day.durationMinutes} min · {day.intensity}/5</p>
                      <p><strong>Micro-skill:</strong> {day.dailyMicroSkill}</p><p><strong>Puck/shot:</strong> {day.shootingPuckDetail}</p>
                      <p><strong>Recovery:</strong> {day.recovery}</p><p><strong>External load:</strong> {day.externalLoad || "None scheduled"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
