import Link from "next/link";
import { getTodayWorkout, getWorkoutDrills } from "@/lib/trainingData";

export default function Home() {
  const workout = getTodayWorkout();
  const drillCount = getWorkoutDrills(workout).length;
  return (
    <div className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-2">
      <section>
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-blue">Plan · Do · Measure · Improve</p>
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">Train with a clear purpose.</h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">A private training workspace for today&apos;s session, progress tracking, and parent review.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn-primary text-lg" href="/today">Open Today</Link>
          <Link className="btn-secondary text-lg" href="/dashboard">Parent Dashboard</Link>
        </div>
      </section>
      <section className="card bg-navy text-white">
        <p className="label text-lime">Next session</p>
        <h2 className="text-3xl font-black">{workout.dayFocus}</h2>
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div><p className="text-3xl font-black">{workout.totalEstimatedMinutes}</p><p className="text-sm text-slate-300">minutes</p></div>
          <div><p className="text-3xl font-black">{drillCount}</p><p className="text-sm text-slate-300">drills</p></div>
          <div><p className="text-3xl font-black">{workout.intensityLevel}/5</p><p className="text-sm text-slate-300">intensity</p></div>
        </div>
      </section>
    </div>
  );
}
