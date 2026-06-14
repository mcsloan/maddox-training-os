import Link from "next/link";
import { ParentCue, Phase, Workout } from "@/lib/types";

export function TodayCard({ workout, phase, parentCue }: { workout: Workout; phase?: Phase; parentCue?: ParentCue }) {
  return (
    <article className="card overflow-hidden p-0">
      <div className="bg-navy p-6 text-white sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          <span className="rounded-full bg-blue px-3 py-1">{phase?.name || "Training phase"}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{workout.totalEstimatedMinutes} min</span>
          <span className="rounded-full bg-white/15 px-3 py-1">Intensity {workout.intensityLevel}/5</span>
        </div>
        <p className="text-sm font-bold text-lime">Today&apos;s focus</p>
        <h2 className="mt-1 text-3xl font-black leading-tight sm:text-5xl">{workout.dayFocus}</h2>
        <p className="mt-4 text-lg text-slate-200">{workout.confidenceCue}</p>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
        <div>
          <p className="label">Parent cue</p>
          <p className="font-semibold">{parentCue?.cue}</p>
          <p className="mt-3 text-sm text-slate-500">{workout.sessionType} · {workout.campContext}</p>
        </div>
        <Link href={`/session/${workout.id}`} className="btn-primary text-lg sm:min-w-48">
          Start Session
        </Link>
      </div>
    </article>
  );
}
