import Link from "next/link";
import { notFound } from "next/navigation";
import { TrainingWorkForm } from "@/components/TrainingWorkForm";
import { projectCanonicalDay } from "@/lib/projections/canonicalDay";
import { formatPlanDate, userFacingPlanText } from "@/lib/trainingData";

export default async function TrainingWorkPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const canonicalDay = projectCanonicalDay(date);
  if (!canonicalDay.isResolvable) notFound();
  const trainingActivities = canonicalDay.activities.filter((activity) => activity.executable && !["none", "checkoff", "sport_load_log", "reflection_log"].includes(activity.logType));
  const title = canonicalDay.title;
  const plannedDurationMinutes = canonicalDay.duration.projectedExecution.trainingWorkMinutes || null;
  const blockIds = trainingActivities.map((activity) => activity.id);
  const blockNames = trainingActivities.map((activity) => activity.athleteTitle);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <Link className="text-sm font-bold text-blue" href={`/day/${date}`}>← Back to day</Link>
      </div>
      <section className="card mb-6 bg-navy text-white">
        <p className="label text-lime">{userFacingPlanText(canonicalDay.dayType || "Planned training work")}</p>
        <h1 className="mt-4 text-3xl font-black">{title}</h1>
        <p className="mt-2 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Planned training work</p>
        <p className="mt-3 text-sm text-slate-300">Saving this log does not mark sport-load logging complete.</p>
      </section>
      <TrainingWorkForm
        blockIds={blockIds}
        blockNames={blockNames}
        date={date}
        plannedDurationMinutes={plannedDurationMinutes}
        workoutId={canonicalDay.sessionId}
        title={title}
      />
    </div>
  );
}
