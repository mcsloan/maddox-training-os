"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DrillCard } from "@/components/DrillCard";
import { ReadinessCheck } from "@/components/ReadinessCheck";
import { ReflectionForm } from "@/components/ReflectionForm";
import { SessionProgress } from "@/components/SessionProgress";
import { getWorkout, getWorkoutDrills } from "@/lib/trainingData";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { ExerciseCompletion, SessionLog } from "@/lib/types";

function makeSession(workoutId: string, drillIds: string[]): SessionLog {
  return {
    id: `${workoutId}-${Date.now()}`,
    workoutId,
    date: new Date().toISOString().slice(0, 10),
    startedAt: new Date().toISOString(),
    completedAt: null,
    currentStep: 0,
    status: "active",
    readiness: { energy: null, soreness: null, focus: null },
    exercises: Object.fromEntries(drillIds.map((drillId) => [drillId, { drillId, done: false, actualSets: null, actualReps: null, actualDuration: null, actualDistance: null, notes: "", difficulty: null } satisfies ExerciseCompletion])),
    reflection: { energy: null, confidence: null, difficulty: null, improvement: "", notes: "" },
  };
}

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const workout = getWorkout(params.id);
  const drills = useMemo(() => workout ? getWorkoutDrills(workout) : [], [workout]);
  const [session, setSession] = useState<SessionLog | null>(null);

  useEffect(() => {
    if (!workout) return;
    const active = localSessionRepository.getActive(workout.id);
    const next = active || makeSession(workout.id, drills.map((drill) => drill.id));
    if (!active) localSessionRepository.save(next);
    setSession(next);
  }, [workout, drills]);

  function update(next: SessionLog) {
    setSession(next);
    localSessionRepository.save(next);
  }

  if (!workout) return <div className="card"><h1 className="text-2xl font-black">Session not found</h1><Link className="btn-primary mt-4" href="/today">Back to Today</Link></div>;
  if (!session) return <p className="font-bold">Loading session…</p>;

  const totalSteps = drills.length + 2;
  const step = session.currentStep;
  const drill = step > 0 && step <= drills.length ? drills[step - 1] : null;
  const isReflection = step === totalSteps - 1;

  function move(nextStep: number) {
    update({ ...session!, currentStep: Math.max(0, Math.min(totalSteps - 1, nextStep)) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function complete() {
    update({ ...session!, status: "completed", completedAt: new Date().toISOString() });
  }

  if (session.status === "completed") {
    return <div className="card mx-auto max-w-2xl text-center"><p className="text-6xl font-black text-blue">✓</p><h1 className="mt-4 text-4xl font-black">Session complete</h1><p className="mt-3 text-slate-600">{session.reflection.improvement || "Good work finishing today's plan."}</p><Link href="/dashboard" className="btn-primary mt-6">View Dashboard</Link></div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5"><SessionProgress current={step + 1} total={totalSteps} /><p className="mt-3 text-sm font-semibold text-slate-500">Autosaved on this device</p></div>
      {step === 0 && <ReadinessCheck value={session.readiness} onChange={(readiness) => update({ ...session!, readiness })} />}
      {drill && <DrillCard drill={drill} completion={session.exercises[drill.id]} onChange={(completion) => update({ ...session!, exercises: { ...session!.exercises, [drill.id]: completion } })} />}
      {isReflection && <ReflectionForm value={session.reflection} onChange={(reflection) => update({ ...session!, reflection })} />}
      <div className="sticky bottom-16 mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-ice/95 py-3 backdrop-blur sm:bottom-0">
        <button className="btn-secondary" disabled={step === 0} onClick={() => move(step - 1)}>Back</button>
        {isReflection ? <button className="btn-primary" onClick={complete}>Finish Session</button> : <button className="btn-primary" onClick={() => move(step + 1)}>Next</button>}
      </div>
    </div>
  );
}
