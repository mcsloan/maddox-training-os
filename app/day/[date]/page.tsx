import Link from "next/link";
import { notFound } from "next/navigation";
import { DayExecutionSequence } from "@/components/DayExecutionSequence";
import { ExternalLoadActions } from "@/components/ExternalLoadActions";
import { ExternalLoadChip, PhaseChip, PlanTagChip } from "@/components/LoadChips";
import { TrainingWorkActions } from "@/components/TrainingWorkActions";
import { getV84DayExecutionEntries, getV84SportLoadsForDate, getV84TrainingWorkEntries } from "@/lib/imports/v8_4/daily";
import { formatPlanDate, getDayTags, getPlanDay, getPlanDayDisplayModel, getRelatedVideos, getWorkout, getWorkoutBlock, getWorkoutDrills, isUsableExternalUrl, kpis, userFacingLoadRule, userFacingPlanText } from "@/lib/trainingData";

export default async function DayPreviewPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getPlanDay(date);
  const executionEntries = getV84DayExecutionEntries(date);
  const trainingWorkEntries = getV84TrainingWorkEntries(date);
  const externalLoads = getV84SportLoadsForDate(date);
  if (!day && !externalLoads.length && !executionEntries.length) notFound();
  const workout = day?.workoutId ? getWorkout(day.workoutId) : undefined;
  const blocks = day ? day.workoutBlockIds.map(getWorkoutBlock).filter((block) => Boolean(block)) : [];
  const drills = workout ? getWorkoutDrills(workout) : [];
  const equipment = Array.from(new Set(drills.flatMap((drill) => drill.equipment)));
  const videos = getRelatedVideos(drills.map((drill) => drill.id));
  const tags = getDayTags(date);
  const display = getPlanDayDisplayModel(date);
  const intensity = Math.max(day?.intensity || 0, ...externalLoads.map((load) => load.plannedIntensity));
  const plannedKpis = (day?.kpiTestIds || workout?.kpiTestIds || []).map((id) => kpis.find((kpi) => kpi.id === id)).filter((kpi) => Boolean(kpi));
  const hasPlannedTrainingWork = Boolean(workout || blocks.length > 0 || trainingWorkEntries.length > 0 || (day?.durationMinutes || 0) > 0);
  const plannedTrainingWorkSummary = hasPlannedTrainingWork
    ? externalLoads.length > 0
      ? "Recovery-adjusted training work"
      : "Planned training work"
    : "No planned training work today — recovery only.";
  const plannedTrainingWorkDetails = hasPlannedTrainingWork
    ? blocks.length > 0
      ? `Complete the planned warmup, mobility, and light skill blocks around today's sport load. Blocks: ${blocks.map((block) => block!.id).join(", ")}`
      : trainingWorkEntries.length > 0
        ? `Complete the v8.4 planned training entries: ${trainingWorkEntries.map((entry) => entry.entryTitle).join(", ")}`
        : "Complete the planned warmup, mobility, and light skill blocks around today's sport load."
    : "Focus on recovery, mobility, and getting ready for the next planned training day.";
  const trainingActionSummary = blocks.length > 0 ? blocks.map((block) => block!.id) : trainingWorkEntries.map((entry) => entry.entryTitle);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap gap-3"><Link className="text-sm font-bold text-blue" href="/calendar">← Calendar</Link><Link className="text-sm font-bold text-blue" href="/plan">12-Week Plan</Link></div>
      <section className="card bg-navy text-white">
        <p className="label text-lime">{day ? `Week ${day.weekNumber} · ${display.methodologyPhase} · ${userFacingPlanText(day.dayRole)}` : "Sport load day"}</p>
        <h1 className="text-3xl font-black sm:text-5xl">{day?.primarySession || externalLoads[0]?.title}</h1>
        <p className="mt-3 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Load {intensity}/5</p>
        <div className="mt-4 flex flex-wrap gap-2">{day && <PhaseChip phase={display.methodologyPhase} />}{externalLoads.map((load) => <ExternalLoadChip key={load.id} type={load.type} />)}{tags.map((tag) => <PlanTagChip key={tag} tag={tag} />)}</div>
        <div className="mt-6 flex flex-wrap gap-3">{workout && <Link className="btn-primary bg-blue text-lg" href={`/session/${workout.id}`}>Start Training Work</Link>}{!workout && externalLoads.length > 0 && <span className="rounded-2xl bg-red-100 px-5 py-3 font-bold text-red-800">Reduced Off-Ice Work Today</span>}<Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link></div>
      </section>

      <DayExecutionSequence entries={executionEntries} />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card">
          <p className="label">Planned training work</p>
          <h2 className="text-xl font-black">{plannedTrainingWorkSummary}</h2>
          {hasPlannedTrainingWork && day?.primarySession && <p className="mt-2 font-semibold">{day.primarySession}</p>}
          {hasPlannedTrainingWork ? (
            <>
              <p className="mt-3 text-slate-600">{plannedTrainingWorkDetails}</p>
              <p className="mt-3"><strong>Daily micro-skill:</strong> {day?.dailyMicroSkill || "Recovery and sport-load focus"}</p>
              <p className="mt-3"><strong>Shooting/puck:</strong> {day?.shootingPuckDetail || "None planned"}</p>
              <p className="mt-3"><strong>Duration:</strong> {day ? `${day.durationMinutes} minutes` : "No off-ice duration"}</p>
              <TrainingWorkActions blockSummary={trainingActionSummary} date={date} />
            </>
          ) : (
            <p className="mt-3 text-slate-600">Focus on recovery, mobility, and getting ready for the next planned training day.</p>
          )}
        </article>
        <article className="card"><p className="label">Parent cue</p><h2 className="text-xl font-black">{userFacingPlanText(day?.parentCue || "Prioritize recovery and ask about energy.")}</h2><p className="mt-3 text-amber-800"><strong>Load rule:</strong> {userFacingLoadRule(externalLoads[0]?.doNotDoRule || day?.doNotDo, externalLoads.length > 0)}</p><p className="mt-3 text-green-800"><strong>Recovery:</strong> {userFacingLoadRule(externalLoads[0]?.recoveryRule || day?.recoveryRule, externalLoads.length > 0)}</p></article>
      </section>

      {externalLoads.length > 0 && <section className="card mt-6"><h2 className="text-2xl font-black">Sport Loads</h2><p className="mt-2 text-sm font-semibold text-slate-600">On camp, lacrosse, or heavy on-ice days, dryland is reduced to mobility, light puck touches, and recovery.</p><div className="mt-4 grid gap-4 md:grid-cols-2">{externalLoads.map((load) => <article className="rounded-2xl border border-rink p-4" key={load.id}><ExternalLoadChip type={load.type} /><p className="mt-3 font-black">{load.title}</p><p className="mt-1 text-sm">{load.provider} · {load.startTime}{load.endTime ? `-${load.endTime}` : ""} · {load.plannedDurationMinutes ? `${load.plannedDurationMinutes} min` : "Duration to confirm"} · Intensity {load.plannedIntensity}/5</p><p className="mt-3 text-sm">{userFacingPlanText(load.notes)}</p><p className="mt-3 text-sm text-green-800"><strong>Recovery:</strong> {userFacingLoadRule(load.recoveryRule, true)}</p><p className="label mt-4">Track after</p><ul className="list-inside list-disc text-sm">{load.trackingQuestions.map((question) => <li key={question}>{question}</li>)}</ul></article>)}</div><ExternalLoadActions loads={externalLoads} /></section>}
      {plannedKpis.length > 0 && <section className="card mt-6 border-2 border-cyan-200"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label">First-class plan event</p><h2 className="text-2xl font-black">KPI Checkpoint</h2></div><Link className="btn-secondary" href="/kpis">Open KPI Dashboard</Link></div><p className="mt-3 font-semibold text-amber-900">{day?.recoveryRule}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{plannedKpis.map((kpi) => <div className="rounded-2xl bg-ice p-4" key={kpi!.id}><p className="label">{kpi!.category}</p><p className="font-black">{kpi!.name}</p></div>)}</div></section>}
      {blocks.length > 0 && <section className="card mt-6"><h2 className="text-2xl font-black">Workout Blocks</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{blocks.map((block) => <div className="rounded-2xl bg-ice p-4" key={block!.id}><p className="label">{block!.id} · {block!.category}</p><h3 className="font-black">{block!.name}</h3><p className="mt-2 text-sm">{userFacingPlanText(block!.description)}</p></div>)}</div></section>}
      {drills.length > 0 && <section className="card mt-6"><h2 className="text-2xl font-black">Drill Sequence</h2><div className="mt-4 space-y-3">{drills.map((drill, index) => <article className="rounded-2xl border border-rink p-4" key={drill.id}><div className="flex items-start justify-between gap-3"><div><p className="label">Step {index + 1} · {drill.category}</p><h3 className="text-lg font-black">{drill.name}</h3></div>{isUsableExternalUrl(drill.videoUrl) && <a className="text-sm font-bold text-blue" href={drill.videoUrl!} target="_blank" rel="noreferrer">Video ↗</a>}</div><p className="mt-2 text-sm">{drill.purpose}</p></article>)}</div></section>}
      <section className="mt-6 grid gap-4 md:grid-cols-2"><article className="card"><h2 className="text-xl font-black">Equipment</h2>{equipment.length ? <ul className="mt-3 list-inside list-disc space-y-1">{equipment.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 text-slate-500">Use equipment required by the sport provider.</p>}</article><article className="card"><h2 className="text-xl font-black">Recovery</h2><p className="mt-3">{userFacingPlanText(day?.recovery || externalLoads[0]?.recoveryRule || "Recovery as needed")}</p>{workout && <p className="mt-3 text-sm text-slate-500">{workout.recoveryNotes}</p>}</article></section>
      {videos.length > 0 && <section className="card mt-6"><h2 className="text-xl font-black">Related Videos</h2><div className="mt-3 flex flex-wrap gap-3">{videos.map((video) => <a className="btn-secondary" href={video.url} target="_blank" rel="noreferrer" key={video.id}>{video.title} ↗</a>)}</div></section>}
    </div>
  );
}
