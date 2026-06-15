import Link from "next/link";
import { notFound } from "next/navigation";
import { TrainingWorkForm } from "@/components/TrainingWorkForm";
import { formatPlanDate, getPlanDay, getWorkout, getWorkoutBlock, userFacingPlanText } from "@/lib/trainingData";

export default async function TrainingWorkPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getPlanDay(date);
  if (!day) notFound();

  const workout = day.workoutId ? getWorkout(day.workoutId) : undefined;
  const blocks = day.workoutBlockIds.map(getWorkoutBlock).filter((block): block is NonNullable<typeof block> => Boolean(block));
  const title = day.primarySession || workout?.dayFocus || "Training work log";
  const plannedDurationMinutes = day.durationMinutes || workout?.totalEstimatedMinutes || null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <Link className="text-sm font-bold text-blue" href={`/day/${date}`}>← Back to day</Link>
      </div>
      <section className="card mb-6 bg-navy text-white">
        <p className="label text-lime">{userFacingPlanText(day.dayRole)}</p>
        <h1 className="mt-4 text-3xl font-black">{title}</h1>
        <p className="mt-2 text-slate-200">{formatPlanDate(day.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Planned training work</p>
        <p className="mt-3 text-sm text-slate-300">Saving this log does not mark sport-load logging complete.</p>
      </section>
      <TrainingWorkForm
        blockIds={blocks.map((block) => block.id)}
        blockNames={blocks.map((block) => block.name)}
        date={date}
        plannedDurationMinutes={plannedDurationMinutes}
        workoutId={workout?.id || null}
        title={title}
      />
    </div>
  );
}
