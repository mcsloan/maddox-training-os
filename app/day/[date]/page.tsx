import Link from "next/link";
import { notFound } from "next/navigation";
import { DayExecutionSequence } from "@/components/DayExecutionSequence";
import { DayEvidenceStatus } from "@/components/DayEvidenceStatus";
import { ExternalLoadChip, PhaseChip, PlanTagChip } from "@/components/LoadChips";
import { getV84DayExecutionEntries, getV84SportLoadsForDate, getV84TrainingWorkEntries } from "@/lib/imports/v8_4/daily";
import { getV84SessionByDate, getV84SessionDrills } from "@/lib/imports/v8_4/session";
import { formatPlanDate, getDayTags, getPlanDay, getPlanDayDisplayModel, getRelatedVideos, getWorkout, getWorkoutBlock, getWorkoutDrills, kpis, userFacingLoadRule, userFacingPlanText } from "@/lib/trainingData";
import type { WorkoutBlock } from "@/lib/types";

export default async function DayPreviewPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getPlanDay(date);
  const executionEntries = getV84DayExecutionEntries(date);
  const trainingWorkEntries = getV84TrainingWorkEntries(date);
  const externalLoads = getV84SportLoadsForDate(date);
  const v84Session = getV84SessionByDate(date);
  if (!day && !externalLoads.length && !executionEntries.length) notFound();
  const workout = day?.workoutId ? getWorkout(day.workoutId) : undefined;
  const trainingWorkHref = workout ? v84Session ? `/session/${v84Session.sessionId}` : `/session/${workout.id}` : "";
  const blocks = day ? day.workoutBlockIds.map(getWorkoutBlock).filter((block): block is WorkoutBlock => Boolean(block)) : [];
  const equipmentDrills = workout ? getWorkoutDrills(workout) : [];
  const drills = v84Session ? getV84SessionDrills(v84Session.sessionId) : equipmentDrills;
  const equipment = smartEquipmentSummary(Array.from(new Set(equipmentDrills.flatMap((drill) => drill.equipment))));
  const videos = getRelatedVideos(drills.map((drill) => drill.id));
  const tags = getDayTags(date);
  const display = getPlanDayDisplayModel(date);
  const intensity = Math.max(day?.intensity || 0, ...externalLoads.map((load) => load.plannedIntensity));
  const plannedKpis = (day?.kpiTestIds || workout?.kpiTestIds || []).map((id) => kpis.find((kpi) => kpi.id === id)).filter((kpi) => Boolean(kpi));
  const plannedKpiNames = plannedKpis.map((kpi) => kpi!.name);
  const hasPlannedTrainingWork = Boolean(workout || blocks.length > 0 || trainingWorkEntries.length > 0 || (day?.durationMinutes || 0) > 0);
  const isSportLoadDay = externalLoads.length > 0;
  const logTodayHref = externalLoads[0] ? `/external-load/${encodeURIComponent(externalLoads[0].id)}` : trainingWorkHref || `/day/${date}`;
  const sportLoadTags = isSportLoadDay ? uniqueSportLoadTags(tags) : tags;
  const externalLoadChips = uniqueExternalLoadChips(externalLoads);
  const sportLoadLabel = externalLoads[0]?.title?.toLowerCase().includes("lacrosse") ? "Lacrosse" : "Sport load";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap gap-3"><Link className="text-sm font-bold text-blue" href="/calendar">← Calendar</Link><Link className="text-sm font-bold text-blue" href="/plan">12-Week Plan</Link></div>
      <section className="card bg-navy text-white">
        <p className="label text-lime">{day ? `Week ${day.weekNumber} · ${display.methodologyPhase} · ${userFacingPlanText(day.dayRole)}` : "Sport load day"}</p>
        <h1 className="text-3xl font-black sm:text-5xl">{day?.primarySession || externalLoads[0]?.title}</h1>
        <p className="mt-3 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Load {intensity}/5</p>
        {isSportLoadDay && <p className="mt-2 font-semibold text-lime">Load {intensity}/5 because {sportLoadLabel.toLowerCase()} is today’s main workload.</p>}
        <div className="mt-4 flex flex-wrap gap-2">{!isSportLoadDay && day && <PhaseChip phase={display.methodologyPhase} />}{externalLoadChips.map((load) => <ExternalLoadChip key={load.type} type={load.type} />)}{uniquePlanTagsByChipKind(sportLoadTags).map((tag) => <PlanTagChip key={tag} tag={tag} />)}</div>
        <div className="mt-6 flex flex-wrap gap-3">{!isSportLoadDay && workout && <Link className="btn-primary bg-blue text-lg" href={trainingWorkHref}>Start Training Work</Link>}{isSportLoadDay && <span className="rounded-2xl bg-red-100 px-5 py-3 font-bold text-red-800">Lacrosse / sport load is the hard work today</span>}{!isSportLoadDay && <Link className="btn-secondary border-white/30 bg-white/10 text-white" href="/library">Open Library</Link>}</div>
      </section>

      {isSportLoadDay && (
        <section className="card mt-6 border-2 border-lime bg-lime/10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="label text-navy">Athlete plan</p>
              <h2 className="text-3xl font-black">Today’s Simple Plan</h2>
              <p className="mt-2 text-lg font-semibold text-slate-700">{sportLoadLabel} is the main workload today. Keep extra work skill-focused, not conditioning-focused.</p>
            </div>
            <div className="max-w-sm">
              <DayEvidenceStatus date={date} logTodayHref={logTodayHref} mode="sport-load" plannedKpiCount={plannedKpis.length} sportLoads={externalLoads} />
              <p className="mt-2 text-sm font-semibold text-slate-600">This saves or updates lacrosse plus today’s skill, shooting, bike, mobility, and reflection notes.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <SimplePlanItem
              label="A"
              title={externalLoads[0]?.title || "Sport load"}
              body="Play the game. Afterward, open the day log to record or update duration, effort, energy, confidence, soreness, and pain."
            />
            <SimplePlanItem
              label="B"
              title="Head-up puck touches — 10 minutes"
              body="Use a puck or ball. Keep eyes up. Every few seconds, look up and call out a number, colour, object, or parent signal. Smooth hands, quiet body, no rushing."
            />
            <SimplePlanItem
              label="C"
              title="Accuracy shooting — 25 to 50 quality shots"
              body="This is skill work, not a conditioning workout. Pick corners or targets. Reset between shots. Shoot with good form. Track hits if practical. Stop only for pain, unsafe setup, or mechanics falling apart."
            />
            <SimplePlanItem
              label="D"
              title="Cooldown bike — 10 to 15 minutes easy"
              body="Easy spin only. Conversational pace. No intervals, no race effort. Goal is cooldown and recovery, not extra conditioning."
            />
            <SimplePlanItem label="E" title="Recovery mobility — 8 to 10 minutes" body="Easy recovery only: 2 min easy walk or breathing; 1 min ankle rocks each side; 1 min hip flexor stretch each side; 1 min hamstring stretch each side; 1 min child’s pose or easy back stretch. Move smoothly. Nothing should hurt." />
            <SimplePlanItem label="F" title="End-of-day reflection" body="Log one thing learned, energy, soreness, confidence, and whether tomorrow should be easier." />
          </div>
          <div className="mt-4 rounded-xl bg-white/80 p-3 text-sm font-bold text-amber-900">
            <p>Shooting today is accuracy and mechanics only — not a fatigue workout.</p>
            <p className="mt-2">Avoid: hard conditioning, leg strength, sprint work, long dryland, and rushed shooting for fatigue.</p>
          </div>
        </section>
      )}

      {!isSportLoadDay && <DayEvidenceStatus date={date} logTodayHref={logTodayHref} mode="summary" plannedKpiCount={plannedKpis.length} sportLoads={externalLoads} trainingWorkLogHref={`/training-work/${date}`} />}
      {!isSportLoadDay && (
        <DayExecutionSequence
          dayMicroSkill={day?.dailyMicroSkill}
          entries={executionEntries}
          plannedKpiNames={plannedKpiNames}
          recoveryRule={day?.recovery || day?.recoveryRule}
          shootingDetail={day?.shootingPuckDetail}
          videos={videos}
          workoutBlocks={blocks}
        />
      )}

      {!isSportLoadDay && <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card"><p className="label">Parent cue</p><h2 className="text-xl font-black">{userFacingPlanText(day?.parentCue || "Prioritize recovery and ask about energy.")}</h2><p className="mt-3 text-amber-800"><strong>Load rule:</strong> {userFacingLoadRule(externalLoads[0]?.doNotDoRule || day?.doNotDo, externalLoads.length > 0)}</p><p className="mt-3 text-green-800"><strong>Recovery:</strong> {userFacingLoadRule(externalLoads[0]?.recoveryRule || day?.recoveryRule, externalLoads.length > 0)}</p></article>
        {hasPlannedTrainingWork && <article className="card"><h2 className="text-xl font-black">Equipment summary</h2>{equipment.length ? <ul className="mt-3 list-inside list-disc space-y-1">{equipment.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 text-slate-500">Use the equipment needed for the steps above.</p>}</article>}
      </section>}
      {isSportLoadDay && (
        <details className="card mt-6">
          <summary className="cursor-pointer text-xl font-black">Parent and source details</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-ice p-4"><p className="label">Parent cue</p><p className="font-semibold">{userFacingPlanText(day?.parentCue || "Prioritize recovery and ask about energy.")}</p></article>
            <article className="rounded-2xl bg-ice p-4"><p className="label">Load rule</p><p className="font-semibold">{userFacingLoadRule(externalLoads[0]?.doNotDoRule || day?.doNotDo, true)}</p></article>
            <article className="rounded-2xl bg-ice p-4"><p className="label">Recovery</p><p className="font-semibold">{userFacingPlanText(day?.recovery || externalLoads[0]?.recoveryRule || "Recovery as needed")}</p></article>
            <article className="rounded-2xl bg-ice p-4"><p className="label">Source plan</p><p className="font-semibold">{day?.primarySession || externalLoads[0]?.title}</p></article>
          </div>
          <div className="mt-5"><DayExecutionSequence entries={executionEntries} /></div>
        </details>
      )}
    </div>
  );
}

function SimplePlanItem({ body, label, title }: { body: string; label: string; title: string }) {
  return (
    <article className="rounded-2xl border border-rink bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label">Required {label}</p>
          <h3 className="text-xl font-black">{title}</h3>
        </div>
      </div>
      <p className="mt-3 text-base font-semibold text-slate-700">{body}</p>
    </article>
  );
}

function uniqueSportLoadTags(tags: string[]) {
  const result: string[] = [];
  if (tags.some((tag) => tag === "recovery" || tag === "external-load-protected")) result.push("recovery");
  return result;
}

function uniqueExternalLoadChips<T extends { type: string }>(loads: T[]) {
  const seen = new Set<string>();
  return loads.filter((load) => {
    if (seen.has(load.type)) return false;
    seen.add(load.type);
    return true;
  });
}

function uniquePlanTagsByChipKind(tags: string[]) {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    const kind = planTagChipKind(tag);
    if (seen.has(kind)) return false;
    seen.add(kind);
    return true;
  });
}

function planTagChipKind(tag: string) {
  const tagKinds: Record<string, string> = {
    recovery: "recovery",
    "external-load-protected": "recovery",
    deload: "deload",
    taper: "taper",
    camp: "camp",
    "on-ice": "on-ice",
    tryout: "on-ice",
    lacrosse: "lacrosse",
    playoff: "lacrosse",
    kpi: "perf-testing",
    "kpi-checkpoint": "perf-testing",
    baseline: "perf-testing",
    conditional: "perf-testing",
    optional: "perf-testing",
  };
  return tagKinds[tag] || "recovery";
}

function smartEquipmentSummary(items: string[]) {
  let maxCones = 0;
  const output: string[] = [];
  for (const item of items) {
    const coneMatch = item.match(/^(\d+)\s+cones?$/i);
    if (coneMatch) {
      maxCones = Math.max(maxCones, Number(coneMatch[1]));
      continue;
    }
    if (/^puck or ball$/i.test(item)) {
      addUnique(output, "Puck or ball: for stickhandling");
      continue;
    }
    if (/^50 pucks$/i.test(item)) {
      addUnique(output, "50 pucks or shooting supply: for shot block, if available");
      continue;
    }
    addUnique(output, item);
  }
  if (maxCones > 0) output.unshift(`Cones: up to ${maxCones}`);
  return output;
}

function addUnique(items: string[], item: string) {
  if (!items.includes(item)) items.push(item);
}
