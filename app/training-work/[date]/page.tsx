import Link from "next/link";
import { notFound } from "next/navigation";
import { TrainingWorkForm } from "@/components/TrainingWorkForm";
import { getV84TrainingWorkEntries } from "@/lib/imports/v8_4/daily";
import { formatPlanDate, getPlanDay, getWorkout, getWorkoutBlock, userFacingPlanText } from "@/lib/trainingData";

export default async function TrainingWorkPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getPlanDay(date);
  const trainingWorkEntries = getV84TrainingWorkEntries(date);
  if (!day && !trainingWorkEntries.length) notFound();

  const workout = day?.workoutId ? getWorkout(day.workoutId) : undefined;
  const blocks = (day?.workoutBlockIds || []).map(getWorkoutBlock).filter((block): block is NonNullable<typeof block> => Boolean(block));
  const title = day?.primarySession || workout?.dayFocus || trainingWorkEntries.map((entry) => entry.entryTitle).join(", ") || "Training work log";
  const plannedDurationMinutes = day?.durationMinutes || workout?.totalEstimatedMinutes || trainingWorkEntries.reduce((total, entry) => total + (entry.plannedDurationMin || 0), 0) || null;
  const blockIds = blocks.length > 0 ? blocks.map((block) => block.id) : trainingWorkEntries.map((entry) => `v8.4-step-${entry.sequence}`);
  const blockNames = blocks.length > 0 ? blocks.map((block) => block.name) : trainingWorkEntries.map((entry) => entry.entryTitle);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <Link className="text-sm font-bold text-blue" href={`/day/${date}`}>← Back to day</Link>
      </div>
      <section className="card mb-6 bg-navy text-white">
        <p className="label text-lime">{userFacingPlanText(day?.dayRole || "Planned training work")}</p>
        <h1 className="mt-4 text-3xl font-black">{title}</h1>
        <p className="mt-2 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Planned training work</p>
        <p className="mt-3 text-sm text-slate-300">Saving this log does not mark sport-load logging complete.</p>
      </section>
      <TrainingWorkForm
        blockIds={blockIds}
        blockNames={blockNames}
        date={date}
        plannedDurationMinutes={plannedDurationMinutes}
        workoutId={workout?.id || null}
        title={title}
      />
    </div>
  );
}
