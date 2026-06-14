import { TodayCard } from "@/components/TodayCard";
import { getParentCue, getPhase, getTodayWorkout, getWorkoutDrills } from "@/lib/trainingData";

export default function TodayPage() {
  const workout = getTodayWorkout();
  const drills = getWorkoutDrills(workout);
  return (
    <div>
      <div className="mb-6">
        <p className="label">Training day</p>
        <h1 className="text-4xl font-black">Today</h1>
      </div>
      <TodayCard workout={workout} phase={getPhase(workout.phaseId)} parentCue={getParentCue(workout.parentCueId)} />
      <section className="mt-6 card">
        <h2 className="text-xl font-black">Session map</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {drills.map((drill, index) => <div key={drill.id} className="rounded-2xl bg-ice p-4"><p className="label">Step {index + 1} · {drill.category}</p><p className="font-black">{drill.name}</p></div>)}
        </div>
        <p className="mt-5 text-sm text-slate-500"><strong>Recovery:</strong> {workout.recoveryNotes}</p>
      </section>
    </div>
  );
}
