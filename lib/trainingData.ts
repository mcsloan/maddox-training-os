import drillsJson from "@/data/drills.json";
import equipmentSetupJson from "@/data/equipmentSetup.json";
import externalLoadsJson from "@/data/externalLoads.json";
import kpisJson from "@/data/kpis.json";
import loadRulesJson from "@/data/loadRules.json";
import planJson from "@/data/plan.json";
import parentCuesJson from "@/data/parentCues.json";
import phasesJson from "@/data/phases.json";
import videosJson from "@/data/videos.json";
import workoutBlocksJson from "@/data/workoutBlocks.json";
import workoutsJson from "@/data/workouts.json";
import { Drill, EquipmentSetup, KPI, LoadRule, ParentCue, Phase, PlannedExternalLoad, PlanWeek, TrainingPlan, VideoReference, Workout, WorkoutBlock } from "@/lib/types";

export const drills = drillsJson as Drill[];
export const workouts = workoutsJson as Workout[];
export const kpis = kpisJson as KPI[];
export const phases = phasesJson as Phase[];
export const parentCues = parentCuesJson as ParentCue[];
export const trainingPlan = planJson as TrainingPlan;
export const workoutBlocks = workoutBlocksJson as WorkoutBlock[];
export const equipmentSetups = equipmentSetupJson as EquipmentSetup[];
export const externalLoads = externalLoadsJson as PlannedExternalLoad[];
export const loadRules = loadRulesJson as LoadRule[];
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

export function getPlanWeek(weekNumber: number) {
  return trainingPlan.weeks.find((week) => week.weekNumber === weekNumber);
}

export function getExternalLoadsForDate(date: string) {
  return externalLoads.filter((load) => load.date === date);
}

export function getWeekExternalLoads(week: PlanWeek) {
  return externalLoads.filter((load) => load.date >= week.startDate && load.date <= week.endDate);
}

export function getCalendarDates() {
  return Array.from(new Set([...trainingPlan.days.map((day) => day.date), ...externalLoads.map((load) => load.date)])).sort();
}

export function getWeekLoadLabel(weekNumber: number) {
  const labels: Record<number, string> = {
    1: "Phase 1 Foundation",
    2: "Phase 1 Foundation",
    3: "Chae Hull Camp Load",
    4: "Phase 2 Speed + Power",
    5: "Phase 2 Speed + Power",
    6: "Deload / Consolidation",
    7: "Carleton Camp Load",
    8: "Phase 3 Game-Speed Dominance",
    9: "Deload / Consolidation",
    10: "Sensplex Camp Load",
    11: "Tryout Taper",
  };
  return labels[weekNumber] || "Offseason Plan";
}

export function getWeekLoadLevel(week: PlanWeek) {
  const loads = getWeekExternalLoads(week);
  if (loads.some((load) => load.plannedIntensity === 5)) return 5;
  if (week.weekNumber === 6 || week.weekNumber === 9 || week.weekNumber === 11) return 2;
  return 4;
}

export function getDayTags(date: string) {
  const day = getPlanDay(date);
  const loads = getExternalLoadsForDate(date);
  const tags = [...(day?.tags || [])];
  if (loads.some((load) => load.type === "hockey_camp")) tags.push("camp");
  if (loads.some((load) => load.type === "on_ice")) tags.push("on-ice");
  if (loads.some((load) => load.type === "tryout")) tags.push("tryout");
  if (loads.some((load) => load.type === "lacrosse")) tags.push("lacrosse");
  if (day?.dayRole.toLowerCase().includes("recovery")) tags.push("recovery");
  if (day?.weekNumber === 6 || day?.weekNumber === 9) tags.push("deload");
  if (day?.weekNumber === 11) tags.push("taper");
  return Array.from(new Set(tags));
}

export function getCurrentPlanWeek() {
  const today = new Date().toISOString().slice(0, 10);
  return trainingPlan.weeks.find((week) => today >= week.startDate && today <= week.endDate)
    || trainingPlan.weeks.find((week) => week.startDate > today)
    || trainingPlan.weeks[trainingPlan.weeks.length - 1];
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
