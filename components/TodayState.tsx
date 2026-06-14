"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLoadActions } from "@/components/ExternalLoadActions";
import { ExternalLoadChip, PlanTagChip } from "@/components/LoadChips";
import { TodayCard } from "@/components/TodayCard";
import { formatPlanDate, getExternalLoadsForDate, getNextScheduledDate, getParentCue, getPhase, getPlanDay, getTodayWorkout, getWorkoutDrills, trainingPlan } from "@/lib/trainingData";

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function TodayState() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(localDate()), []);
  if (!today) return <section className="card"><p className="font-semibold">Checking today&apos;s plan...</p></section>;

  const { startDate, endDate } = trainingPlan.overview;
  if (today < startDate) return <PrePlanState today={today} />;
  if (today > endDate) return <PlanCompleteState />;

  const day = getPlanDay(today);
  const loads = getExternalLoadsForDate(today);
  const workout = getTodayWorkout(today);
  const nextDate = getNextScheduledDate(today);

  if (!day && loads.length > 0) return <ExternalOnlyState date={today} />;
  if (!day && !loads.length) return <NoSessionState nextDate={nextDate} />;

  return (
    <div>
      {workout && <><TodayCard workout={workout} phase={getPhase(workout.phaseId)} parentCue={getParentCue(workout.parentCueId)} /><SessionMap workoutId={workout.id} /></>}
      {!workout && day && <section className="card"><p className="label">{day.dayRole}</p><h2 className="text-3xl font-black">{day.primarySession}</h2><p className="mt-3">{day.recovery}</p><p className="mt-3 font-semibold text-red-700">{day.doNotDo}</p><Link className="btn-secondary mt-5" href={`/day/${today}`}>Open Today&apos;s Plan</Link></section>}
      {loads.length > 0 && <section className="card mt-6"><p className="label">External load today</p><div className="flex flex-wrap gap-2">{loads.map((load) => <ExternalLoadChip key={load.id} type={load.type} title={load.title} />)}</div><p className="mt-4 font-semibold text-red-700">{loads[0].doNotDoRule}</p><ExternalLoadActions loads={loads} /></section>}
    </div>
  );
}

function PrePlanState({ today }: { today: string }) {
  const nextDate = getNextScheduledDate(today) || trainingPlan.overview.startDate;
  const day = getPlanDay(nextDate);
  return <section className="card overflow-hidden p-0"><div className="bg-navy p-6 text-white sm:p-8"><p className="label text-lime">Plan begins soon</p><h2 className="text-3xl font-black sm:text-5xl">Plan starts Monday June 15</h2><p className="mt-4 text-slate-200">Next Session: {day?.primarySession || "Open the calendar to preview the plan."}</p></div><div className="flex flex-wrap gap-3 p-6 sm:p-8"><Link className="btn-primary" href={`/day/${nextDate}`}>Preview Next Session</Link><Link className="btn-secondary" href="/calendar">View Full Calendar</Link>{day?.workoutId && <Link className="btn-secondary" href={`/session/${day.workoutId}`}>Start Early / Practice Preview</Link>}</div></section>;
}

function ExternalOnlyState({ date }: { date: string }) {
  const loads = getExternalLoadsForDate(date);
  return <section className="card"><p className="label">External Load Day</p><div className="flex flex-wrap gap-2">{loads.map((load) => <ExternalLoadChip key={load.id} type={load.type} title={load.title} />)}</div><h2 className="mt-4 text-3xl font-black">{loads[0].title}</h2><p className="mt-3 text-green-800"><strong>Recovery:</strong> {loads[0].recoveryRule}</p><p className="mt-3 text-red-700"><strong>Do not do:</strong> {loads[0].doNotDoRule}</p><ExternalLoadActions loads={loads} /><Link className="btn-secondary mt-4" href={`/day/${date}`}>Open Full Day</Link></section>;
}

function NoSessionState({ nextDate }: { nextDate?: string }) {
  return <section className="card"><PlanTagChip tag="recovery" /><h2 className="mt-4 text-3xl font-black">No training session scheduled today</h2><p className="mt-3 text-slate-600">Use the day for recovery, normal activity, equipment prep, and sleep.</p>{nextDate && <div className="mt-5"><p className="label">Next scheduled event · {formatPlanDate(nextDate)}</p><Link className="btn-primary" href={`/day/${nextDate}`}>Preview Next Session</Link></div>}</section>;
}

function PlanCompleteState() {
  return <section className="card"><p className="label">12-week plan</p><h2 className="text-4xl font-black">Plan complete</h2><p className="mt-3 text-slate-600">Review completed work, history, and export-ready summaries.</p><div className="mt-5 flex flex-wrap gap-3"><Link className="btn-primary" href="/dashboard">Dashboard</Link><Link className="btn-secondary" href="/history">History</Link><Link className="btn-secondary" href="/exports">Exports</Link></div></section>;
}

function SessionMap({ workoutId }: { workoutId: string }) {
  const workout = getTodayWorkout(localDate());
  if (!workout || workout.id !== workoutId) return null;
  const drills = getWorkoutDrills(workout);
  return <section className="card mt-6"><h2 className="text-xl font-black">Session map</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{drills.map((drill, index) => <div key={drill.id} className="rounded-2xl bg-ice p-4"><p className="label">Step {index + 1} · {drill.category}</p><p className="font-black">{drill.name}</p></div>)}</div><p className="mt-5 text-sm text-slate-500"><strong>Recovery:</strong> {workout.recoveryNotes}</p></section>;
}
