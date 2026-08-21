"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActivityPresentation } from "@/lib/projections/activityPresentation";
import type { CanonicalDayViewModel } from "@/lib/projections/canonicalDay";
import { skillShotIqLibrary } from "@/lib/imports/v8_4";
import { createExternalLoadLog, saveExternalLoadLog } from "@/lib/storage/externalLoadRepository";
import { createTrainingWorkLog, getTrainingWorkLogByDate, saveTrainingWorkLog } from "@/lib/storage/trainingWorkRepository";
import type { ExerciseCompletion, Rating, Readiness, Reflection } from "@/lib/types";
import { ScheduledKpiTest } from "@/components/ScheduledKpiTest";
import { VideoDemoLink } from "@/components/VideoDemoLink";

export function CanonicalDayLogForm({ day }: { day: CanonicalDayViewModel }) {
  const router = useRouter();
  const executable = day.activities.filter((activity) => activity.executable);
  const training = executable.filter((activity) => activity.logType !== "sport_load_log" && activity.logType !== "kpi_log");
  const previous = useMemo(() => getTrainingWorkLogByDate(day.date), [day.date]);
  const plannedMinutes = training.reduce((sum, activity) => sum + (activity.plannedDurationMinutes ?? 0), 0);
  const [log, setLog] = useState(() => createTrainingWorkLog(day.date, day.sessionId, day.title, training.map((activity) => activity.id), plannedMinutes || null, previous || undefined));
  const [sportValues, setSportValues] = useState(() => Object.fromEntries(day.sportLoads.map((load) => [load.id, { attended: true, actualDuration: load.plannedDurationMinutes, effort: null as Rating | null, notes: "" }])));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Ready to log today.");

  function updateActivity(activity: ActivityPresentation, patch: Partial<ExerciseCompletion>) {
    const current = log.activityResults?.[activity.id] || emptyCompletion(activity.id, activity.plannedDurationMinutes);
    setLog({ ...log, activityResults: { ...log.activityResults, [activity.id]: { ...current, ...patch } } });
  }

  async function save() {
    setSaving(true);
    setStatus("Saving today’s evidence...");
    try {
      if (training.length || day.kpi.isCheckpoint) saveTrainingWorkLog({ ...log, completed: training.length > 0 && training.every((activity) => log.activityResults?.[activity.id]?.done), actualDuration: sumActualMinutes(log.activityResults), updatedAt: new Date().toISOString() });
      for (const load of day.sportLoads) {
        const values = sportValues[load.id];
        const sportLog = createExternalLoadLog(load);
        await saveExternalLoadLog({ ...sportLog, attended: values.attended, actualDuration: values.actualDuration, effort: values.effort, parentNotes: values.notes }, load);
      }
      setStatus("Today’s evidence is saved.");
      router.push(`/day/${day.date}`);
    } catch (error) {
      setStatus(`Could not finish saving: ${error instanceof Error ? error.message : "Unknown error"}`);
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <ReadinessFields value={log.readiness!} onChange={(readiness) => setLog({ ...log, readiness })} />
      {!day.kpi.isCheckpoint && executable.map((activity) => activity.logType === "sport_load_log"
        ? <SportFields activity={activity} day={day} key={activity.id} value={sportValues[day.sportLoads.find((load) => load.title === activity.athleteTitle)?.id || ""]} onChange={(loadId, value) => setSportValues({ ...sportValues, [loadId]: value })} />
        : <ActivityFields activity={activity} key={activity.id} value={log.activityResults?.[activity.id] || emptyCompletion(activity.id, activity.plannedDurationMinutes)} onChange={(patch) => updateActivity(activity, patch)} />)}
      {day.kpi.isCheckpoint && <ScheduledKpiTest date={day.date} kpiIds={day.kpi.kpiIds} />}
      <ReflectionFields value={log.reflection!} onChange={(reflection) => setLog({ ...log, reflection })} />
      <div className="sticky bottom-16 rounded-2xl bg-ice/95 p-3 backdrop-blur sm:bottom-0"><button className="btn-primary min-h-14 w-full text-lg" disabled={saving} onClick={save}>{saving ? "Saving..." : day.kpi.isCheckpoint ? "Save Test Readiness & Reflection" : "Save Today’s Training"}</button><p className="mt-2 text-center text-sm font-semibold text-slate-500">{status}</p></div>
    </div>
  );
}

function ActivityFields({ activity, value, onChange }: { activity: ActivityPresentation; value: ExerciseCompletion; onChange: (patch: Partial<ExerciseCompletion>) => void }) {
  const before = activity.supportModules?.filter((module) => module.position === "before") ?? [];
  const after = activity.supportModules?.filter((module) => module.position === "after") ?? [];
  return <section className="card"><div className="flex justify-between gap-3"><div><p className="label">{activity.optional ? "Optional" : "Training"}</p><h2 className="text-xl font-black">{activity.athleteTitle}</h2>{activity.focus && <p className="mt-1 text-sm font-bold text-blue">Focus: {activity.focus}</p>}</div>{activity.plannedDurationMinutes && <span className="font-black">{activity.plannedDurationMinutes} min</span>}</div>{activity.instruction && <p className="mt-3 text-sm font-semibold text-slate-700">{activity.instruction}</p>}{before.map((module) => <SupportModule key={module.id} module={module} showDemo />)}{activity.children?.length ? <div className="mt-4 space-y-3"><p className="label">Main prescription</p>{activity.children.map((child) => <PrescriptionChild child={child} key={child.id} />)}</div> : null}{after.map((module) => <SupportModule key={module.id} module={module} />)}<div className="mt-4 grid gap-3 sm:grid-cols-2"><YesNo label="Completed?" value={value.done} onChange={(done) => onChange({ done })} /><NumberField label="Actual minutes" value={value.actualDuration} onChange={(actualDuration) => onChange({ actualDuration })} /><RatingField label="Quality / difficulty" value={value.difficulty} onChange={(difficulty) => onChange({ difficulty })} /><label><span className="label">Notes</span><textarea className="field min-h-20" value={value.notes} onChange={(event) => onChange({ notes: event.target.value })} /></label></div></section>;
}

function PrescriptionChild({ child }: { child: NonNullable<ActivityPresentation["children"]>[number] }) {
  const sourceDrill = child.sourceTrace?.drillId ? skillShotIqLibrary.find((drill) => drill.drillID === child.sourceTrace?.drillId) : undefined;
  const instruction = sourceDrill && child.instruction?.startsWith(`${sourceDrill.setup} `)
    ? child.instruction.slice(sourceDrill.setup.length + 1)
    : child.instruction;
  return <article className="rounded-xl bg-ice p-3"><div className="flex items-start justify-between gap-2"><h3 className="font-black">{child.title}</h3>{child.videoUrl && <VideoDemoLink exerciseName={child.title} href={child.videoUrl} />}</div><p className="text-sm">{[child.plannedSets && `${child.plannedSets} sets`, child.plannedReps, child.tempo && `Tempo ${child.tempo}`, child.rest && `Rest ${child.rest}`].filter(Boolean).join(" · ")}</p>{sourceDrill && <div className="mt-2 rounded-lg border border-rink bg-white/70 p-2 text-sm text-slate-700"><p><span className="font-black">Equipment / space:</span> {sourceDrill.equipment}</p><p className="mt-1"><span className="font-black">Setup:</span> {sourceDrill.setup}</p></div>}{instruction && <p className="mt-2 text-sm text-slate-700">{instruction}</p>}{child.coachingCue && child.coachingCue !== child.instruction && <p className="mt-1 text-sm text-slate-700">{child.coachingCue}</p>}</article>;
}

function SupportModule({ module, showDemo = false }: { module: NonNullable<ActivityPresentation["supportModules"]>[number]; showDemo?: boolean }) {
  return <section className="mt-4 rounded-2xl border border-rink p-3"><div className="flex items-start justify-between gap-2"><div><p className="label">{module.position === "before" ? "Before main work" : "After main work"}</p><h3 className="text-lg font-black">{module.title}</h3></div>{showDemo && module.sourceDemo && <VideoDemoLink exerciseName={module.title} href={module.sourceDemo.href} label={module.sourceDemo.label} />}</div><div className="mt-3 space-y-3">{module.groups.map((group) => <div className="rounded-xl bg-ice p-3" key={group.title}><h4 className="font-black">{group.title}</h4>{group.dose && <p className="text-sm font-semibold text-slate-600">{group.dose}</p>}<ul className="mt-2 space-y-1 text-sm">{group.exercises.map((exercise) => <li className="flex justify-between gap-3" key={exercise.id}><span>{exercise.title}</span>{exercise.dose && <span className="shrink-0 font-bold">{exercise.dose}</span>}</li>)}</ul></div>)}</div>{module.instructions.map((instruction, index) => <p className="mt-3 text-sm font-semibold text-slate-700" key={`${module.id}-instruction-${index}`}>{instruction}</p>)}</section>;
}

function SportFields({ activity, day, value, onChange }: { activity: ActivityPresentation; day: CanonicalDayViewModel; value?: { attended: boolean; actualDuration: number | null; effort: Rating | null; notes: string }; onChange: (id: string, value: { attended: boolean; actualDuration: number | null; effort: Rating | null; notes: string }) => void }) {
  const load = day.sportLoads.find((candidate) => candidate.title === activity.athleteTitle);
  if (!load || !value) return null;
  return <section className="card"><p className="label">Sport Load</p><h2 className="text-xl font-black">{load.title}</h2><p className="mt-2 text-sm font-semibold text-slate-700">{load.notes}</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><YesNo label="Attended?" value={value.attended} onChange={(attended) => onChange(load.id, { ...value, attended })} /><NumberField label="Actual minutes" value={value.actualDuration} onChange={(actualDuration) => onChange(load.id, { ...value, actualDuration })} /><RatingField label="Effort" value={value.effort} onChange={(effort) => onChange(load.id, { ...value, effort })} /><label><span className="label">Notes</span><textarea className="field min-h-20" value={value.notes} onChange={(event) => onChange(load.id, { ...value, notes: event.target.value })} /></label></div></section>;
}

function ReadinessFields({ value, onChange }: { value: Readiness; onChange: (value: Readiness) => void }) { return <section className="card"><p className="label">Before training</p><h2 className="text-xl font-black">Readiness</h2><div className="mt-3 grid gap-3 sm:grid-cols-3"><RatingField label="Energy" value={value.energy} onChange={(energy) => onChange({ ...value, energy })} /><RatingField label="Soreness" value={value.soreness} onChange={(soreness) => onChange({ ...value, soreness })} /><RatingField label="Focus" value={value.focus} onChange={(focus) => onChange({ ...value, focus })} /></div></section>; }
function ReflectionFields({ value, onChange }: { value: Reflection; onChange: (value: Reflection) => void }) { return <section className="card"><p className="label">After training</p><h2 className="text-xl font-black">Reflection</h2><div className="mt-3 grid gap-3 sm:grid-cols-3"><RatingField label="Energy" value={value.energy} onChange={(energy) => onChange({ ...value, energy })} /><RatingField label="Confidence" value={value.confidence} onChange={(confidence) => onChange({ ...value, confidence })} /><RatingField label="Difficulty" value={value.difficulty} onChange={(difficulty) => onChange({ ...value, difficulty })} /></div><label className="mt-3 block"><span className="label">One thing improved</span><input className="field" value={value.improvement} onChange={(event) => onChange({ ...value, improvement: event.target.value })} /></label></section>; }
function RatingField({ label, value, onChange }: { label: string; value: Rating | null; onChange: (value: Rating | null) => void }) { return <label><span className="label">{label}</span><select className="field" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) as Rating : null)}><option value="">Choose</option>{[1,2,3,4,5].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>; }
function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) { return <label><span className="label">{label}</span><select className="field" value={value ? "yes" : "no"} onChange={(event) => onChange(event.target.value === "yes")}><option value="yes">Yes</option><option value="no">No</option></select></label>; }
function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) { return <label><span className="label">{label}</span><input className="field" inputMode="numeric" type="number" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)} /></label>; }
function emptyCompletion(id: string, minutes?: number): ExerciseCompletion { return { drillId: id, done: false, actualSets: null, actualReps: null, actualDuration: minutes ?? null, actualDistance: null, notes: "", difficulty: null }; }
function sumActualMinutes(results: Record<string, ExerciseCompletion> | undefined) { const values=Object.values(results || {}); return values.length ? values.reduce((sum, result) => sum + (result.actualDuration ?? 0), 0) : null; }
