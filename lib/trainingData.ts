import drillsJson from "@/data/drills.json";
import kpisJson from "@/data/kpis.json";
import parentCuesJson from "@/data/parentCues.json";
import phasesJson from "@/data/phases.json";
import workoutsJson from "@/data/workouts.json";
import { Drill, KPI, ParentCue, Phase, Workout } from "@/lib/types";

export const drills = drillsJson as Drill[];
export const workouts = workoutsJson as Workout[];
export const kpis = kpisJson as KPI[];
export const phases = phasesJson as Phase[];
export const parentCues = parentCuesJson as ParentCue[];

export function getWorkout(id: string) {
  return workouts.find((workout) => workout.id === id);
}

export function getWorkoutDrills(workout: Workout) {
  return [...workout.warmupDrillIds, ...workout.mainDrillIds]
    .map((id) => drills.find((drill) => drill.id === id))
    .filter((drill): drill is Drill => Boolean(drill));
}

export function getPhase(id: string) {
  return phases.find((phase) => phase.id === id);
}

export function getParentCue(id: string) {
  return parentCues.find((cue) => cue.id === id);
}

export function getTodayWorkout() {
  const today = new Date().toISOString().slice(0, 10);
  return workouts.find((workout) => workout.date === today) || workouts[0];
}
