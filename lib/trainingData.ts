import drillsJson from "@/data/drills.json";
import equipmentSetupJson from "@/data/equipmentSetup.json";
import kpisJson from "@/data/kpis.json";
import planJson from "@/data/plan.json";
import parentCuesJson from "@/data/parentCues.json";
import phasesJson from "@/data/phases.json";
import videosJson from "@/data/videos.json";
import workoutBlocksJson from "@/data/workoutBlocks.json";
import workoutsJson from "@/data/workouts.json";
import { Drill, EquipmentSetup, KPI, ParentCue, Phase, TrainingPlan, VideoReference, Workout, WorkoutBlock } from "@/lib/types";

export const drills = drillsJson as Drill[];
export const workouts = workoutsJson as Workout[];
export const kpis = kpisJson as KPI[];
export const phases = phasesJson as Phase[];
export const parentCues = parentCuesJson as ParentCue[];
export const trainingPlan = planJson as TrainingPlan;
export const workoutBlocks = workoutBlocksJson as WorkoutBlock[];
export const equipmentSetups = equipmentSetupJson as EquipmentSetup[];
export const videos = videosJson as VideoReference[];

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

export function getPlanDay(date: string) {
  return trainingPlan.days.find((day) => day.date === date);
}

export function getWorkoutBlock(id: string) {
  return workoutBlocks.find((block) => block.id === id);
}

export function getRelatedVideos(drillIds: string[]) {
  return videos.filter((video) => video.url && video.drillIds?.some((id) => drillIds.includes(id)));
}

export function isUsableExternalUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && parsed.hostname !== "example.com";
  } catch {
    return false;
  }
}

export function formatPlanDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-CA", options || { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${date}T12:00:00`));
}

export function getTodayWorkout() {
  const today = new Date().toISOString().slice(0, 10);
  return workouts.find((workout) => workout.date === today) || workouts[0];
}
