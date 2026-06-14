import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPlanDate, getPlanDay, getRelatedVideos, getWorkout, getWorkoutBlock, getWorkoutDrills, isUsableExternalUrl } from "@/lib/trainingData";

export default async function DayPreviewPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getPlanDay(date);
  if (!day) notFound();
  const workout = getWorkout(day.workoutId);
  if (!workout) notFound();
  const blocks = day.workoutBlockIds.map(getWorkoutBlock).filter((block) => Boolean(block));
  const drills = getWorkoutDrills(workout);
  const equipment = Array.from(new Set(drills.flatMap((drill) => drill.equipment)));
  const videos = getRelatedVideos(drills.map((drill) => drill.id));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap gap-3"><Link className="text-sm font-bold text-blue" href="/calendar">← Calendar</Link><Link className="text-sm font-bold text-blue" href="/plan">11-Week Plan</Link></div>
      <section className="card bg-navy text-white">
        <p className="label text-lime">Week {day.weekNumber} · {day.phase} · {day.dayRole}</p>
        <h1 className="text-3xl font-black sm:text-5xl">{day.primarySession}</h1>
        <p className="mt-3 text-slate-200">{formatPlanDate(day.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {day.durationMinutes} min · Intensity {day.intensity}/5</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary bg-blue text-lg" href={`/session/${workout.id}`}>Start Session</Link><Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card"><p className="label">Daily micro-skill</p><h2 className="text-xl font-black">{day.dailyMicroSkill}</h2><p className="mt-3"><strong>Shooting/puck:</strong> {day.shootingPuckDetail}</p><p className="mt-3"><strong>External load:</strong> {day.externalLoad || "None scheduled"}</p></article>
        <article className="card"><p className="label">Parent cue</p><h2 className="text-xl font-black">{day.parentCue}</h2><p className="mt-3 text-red-700"><strong>Do not do:</strong> {day.doNotDo}</p><p className="mt-3 text-green-800"><strong>Recovery rule:</strong> {day.recoveryRule}</p></article>
      </section>

      <section className="card mt-6"><h2 className="text-2xl font-black">Workout Blocks</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{blocks.map((block) => <div className="rounded-2xl bg-ice p-4" key={block!.id}><p className="label">{block!.id} · {block!.category}</p><h3 className="font-black">{block!.name}</h3><p className="mt-2 text-sm">{block!.description}</p></div>)}</div></section>
      <section className="card mt-6"><h2 className="text-2xl font-black">Drill Sequence</h2><div className="mt-4 space-y-3">{drills.map((drill, index) => <article className="rounded-2xl border border-rink p-4" key={drill.id}><div className="flex items-start justify-between gap-3"><div><p className="label">Step {index + 1} · {drill.category}</p><h3 className="text-lg font-black">{drill.name}</h3></div>{isUsableExternalUrl(drill.videoUrl) && <a className="text-sm font-bold text-blue" href={drill.videoUrl!} target="_blank" rel="noreferrer">Video ↗</a>}</div><p className="mt-2 text-sm">{drill.purpose}</p></article>)}</div></section>
      <section className="mt-6 grid gap-4 md:grid-cols-2"><article className="card"><h2 className="text-xl font-black">Equipment</h2><ul className="mt-3 list-inside list-disc space-y-1">{equipment.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="card"><h2 className="text-xl font-black">Recovery</h2><p className="mt-3">{day.recovery}</p><p className="mt-3 text-sm text-slate-500">{workout.recoveryNotes}</p></article></section>
      {videos.length > 0 && <section className="card mt-6"><h2 className="text-xl font-black">Related Videos</h2><div className="mt-3 flex flex-wrap gap-3">{videos.map((video) => <a className="btn-secondary" href={video.url} target="_blank" rel="noreferrer" key={video.id}>{video.title} ↗</a>)}</div></section>}
    </div>
  );
}
