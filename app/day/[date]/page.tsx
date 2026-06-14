import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLoadActions } from "@/components/ExternalLoadActions";
import { ExternalLoadChip, PlanTagChip } from "@/components/LoadChips";
import { formatPlanDate, getDayTags, getExternalLoadsForDate, getPlanDay, getRelatedVideos, getWorkout, getWorkoutBlock, getWorkoutDrills, isUsableExternalUrl } from "@/lib/trainingData";

export default async function DayPreviewPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getPlanDay(date);
  const externalLoads = getExternalLoadsForDate(date);
  if (!day && !externalLoads.length) notFound();
  const workout = day ? getWorkout(day.workoutId) : undefined;
  const blocks = day ? day.workoutBlockIds.map(getWorkoutBlock).filter((block) => Boolean(block)) : [];
  const drills = workout ? getWorkoutDrills(workout) : [];
  const equipment = Array.from(new Set(drills.flatMap((drill) => drill.equipment)));
  const videos = getRelatedVideos(drills.map((drill) => drill.id));
  const tags = getDayTags(date);
  const intensity = Math.max(day?.intensity || 0, ...externalLoads.map((load) => load.plannedIntensity));
  const externalLoadReplacesTraining = externalLoads.some((load) => load.type === "hockey_camp" || load.type === "tryout");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap gap-3"><Link className="text-sm font-bold text-blue" href="/calendar">← Calendar</Link><Link className="text-sm font-bold text-blue" href="/plan">11-Week Plan</Link></div>
      <section className="card bg-navy text-white">
        <p className="label text-lime">{day ? `Week ${day.weekNumber} · ${day.phase} · ${day.dayRole}` : "External load day"}</p>
        <h1 className="text-3xl font-black sm:text-5xl">{day?.primarySession || externalLoads[0]?.title}</h1>
        <p className="mt-3 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Load {intensity}/5</p>
        <div className="mt-4 flex flex-wrap gap-2">{externalLoads.map((load) => <ExternalLoadChip key={load.id} type={load.type} title={load.title} />)}{tags.map((tag) => <PlanTagChip key={tag} tag={tag} />)}</div>
        <div className="mt-6 flex flex-wrap gap-3">{workout && !externalLoadReplacesTraining && <Link className="btn-primary bg-blue text-lg" href={`/session/${workout.id}`}>Start Training Session</Link>}{workout && externalLoadReplacesTraining && <span className="rounded-2xl bg-red-100 px-5 py-3 font-bold text-red-800">Off-Ice Session Replaced by External Load</span>}<Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card"><p className="label">Planned training work</p><h2 className="text-xl font-black">{day?.primarySession || "No off-ice session planned"}</h2><p className="mt-3"><strong>Daily micro-skill:</strong> {day?.dailyMicroSkill || "Recovery and external-load focus"}</p><p className="mt-3"><strong>Shooting/puck:</strong> {day?.shootingPuckDetail || "None planned"}</p><p className="mt-3"><strong>Duration:</strong> {day ? `${day.durationMinutes} minutes` : "No off-ice duration"}</p></article>
        <article className="card"><p className="label">Parent cue</p><h2 className="text-xl font-black">{day?.parentCue || "Protect recovery and ask about energy."}</h2><p className="mt-3 text-red-700"><strong>Do not do:</strong> {externalLoads[0]?.doNotDoRule || day?.doNotDo}</p><p className="mt-3 text-green-800"><strong>Recovery rule:</strong> {externalLoads[0]?.recoveryRule || day?.recoveryRule}</p></article>
      </section>

      {externalLoads.length > 0 && <section className="card mt-6"><h2 className="text-2xl font-black">External Loads</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{externalLoads.map((load) => <article className="rounded-2xl border border-rink p-4" key={load.id}><ExternalLoadChip type={load.type} title={load.title} /><p className="mt-3 font-black">{load.provider}</p><p className="mt-1 text-sm">{load.startTime}{load.endTime ? `-${load.endTime}` : ""} · {load.plannedDurationMinutes ? `${load.plannedDurationMinutes} min` : "Duration to confirm"} · Intensity {load.plannedIntensity}/5</p><p className="mt-3 text-sm">{load.notes}</p><p className="mt-3 text-sm text-green-800"><strong>Recovery:</strong> {load.recoveryRule}</p><p className="mt-2 text-sm text-red-700"><strong>Do not do:</strong> {load.doNotDoRule}</p><p className="label mt-4">Track after</p><ul className="list-inside list-disc text-sm">{load.trackingQuestions.map((question) => <li key={question}>{question}</li>)}</ul></article>)}</div><ExternalLoadActions loads={externalLoads} /></section>}
      {blocks.length > 0 && <section className="card mt-6"><h2 className="text-2xl font-black">Workout Blocks</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{blocks.map((block) => <div className="rounded-2xl bg-ice p-4" key={block!.id}><p className="label">{block!.id} · {block!.category}</p><h3 className="font-black">{block!.name}</h3><p className="mt-2 text-sm">{block!.description}</p></div>)}</div></section>}
      {drills.length > 0 && <section className="card mt-6"><h2 className="text-2xl font-black">Drill Sequence</h2><div className="mt-4 space-y-3">{drills.map((drill, index) => <article className="rounded-2xl border border-rink p-4" key={drill.id}><div className="flex items-start justify-between gap-3"><div><p className="label">Step {index + 1} · {drill.category}</p><h3 className="text-lg font-black">{drill.name}</h3></div>{isUsableExternalUrl(drill.videoUrl) && <a className="text-sm font-bold text-blue" href={drill.videoUrl!} target="_blank" rel="noreferrer">Video ↗</a>}</div><p className="mt-2 text-sm">{drill.purpose}</p></article>)}</div></section>}
      <section className="mt-6 grid gap-4 md:grid-cols-2"><article className="card"><h2 className="text-xl font-black">Equipment</h2>{equipment.length ? <ul className="mt-3 list-inside list-disc space-y-1">{equipment.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 text-slate-500">Use equipment required by the external provider.</p>}</article><article className="card"><h2 className="text-xl font-black">Recovery</h2><p className="mt-3">{day?.recovery || externalLoads[0]?.recoveryRule}</p>{workout && <p className="mt-3 text-sm text-slate-500">{workout.recoveryNotes}</p>}</article></section>
      {videos.length > 0 && <section className="card mt-6"><h2 className="text-xl font-black">Related Videos</h2><div className="mt-3 flex flex-wrap gap-3">{videos.map((video) => <a className="btn-secondary" href={video.url} target="_blank" rel="noreferrer" key={video.id}>{video.title} ↗</a>)}</div></section>}
    </div>
  );
}
