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
import { Drill, EquipmentSetup, KPI, LoadRule, ParentCue, Phase, PlannedExternalLoad, PlanDayDisplayModel, PlanWeek, TrainingPlan, VideoReference, WeekPlanSummary, Workout, WorkoutBlock } from "@/lib/types";

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

export function getNextPlanDay(afterDate: string) {
  return trainingPlan.days.find((day) => day.date > afterDate);
}

export function getNextKpiDay(afterDate: string) {
  return trainingPlan.days.find((day) => day.date > afterDate && Boolean(day.kpiTestIds?.length));
}

export function getNextScheduledDate(afterDate: string) {
  return getCalendarDates().find((date) => date > afterDate);
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
    1: "Foundation + Acceleration",
    2: "Foundation + Acceleration",
    3: "Foundation + Acceleration",
    4: "Foundation + Acceleration",
    5: "Speed + Power",
    6: "Speed + Power",
    7: "Deload",
    8: "Game-Speed + Reactive Agility",
    9: "Game-Speed + Reactive Agility",
    10: "Game-Speed + Reactive Agility",
    11: "Training Camp / Tryout Simulation",
    12: "Taper + Peak",
  };
  return labels[weekNumber] || "Offseason Plan";
}

export function getPlanDayDisplayModel(date: string): PlanDayDisplayModel {
  const day = getPlanDay(date);
  const loads = getExternalLoadsForDate(date);
  const weekNumber = day?.weekNumber || trainingPlan.weeks.find((week) => date >= week.startDate && date <= week.endDate)?.weekNumber || 1;
  const methodologyPhase = getWeekLoadLabel(weekNumber) as PlanDayDisplayModel["methodologyPhase"];
  const sportLoads = Array.from(new Set(loads.map((load) =>
    load.type === "hockey_camp" ? "Camp" : load.type.startsWith("lacrosse") ? "Lacrosse" : "On-Ice",
  ))) as PlanDayDisplayModel["sportLoads"];
  const loadRule = weekNumber === 7 ? "Deload" : sportLoads.length || day?.dayRole.toLowerCase().includes("recovery") ? "Recovery" : null;
  const testingEvent = day?.kpiTestIds?.length ? "Perf Testing" : null;
  return {
    methodologyPhase,
    sportLoads,
    loadRule,
    testingEvent,
    displayTags: [methodologyPhase, ...sportLoads, ...(loadRule ? [loadRule] : []), ...(testingEvent ? [testingEvent] : [])],
  };
}

export function userFacingLoadRule(rule: string | undefined, hasSportLoad = false) {
  if (hasSportLoad) return "On camp, lacrosse, or heavy on-ice days, dryland is reduced to mobility, light puck touches, and recovery.";
  return userFacingPlanText(rule || "Follow the planned recovery and training limits.");
}

export function userFacingPlanText(text: string) {
  return text
    .replace(/Deload\s*\/\s*Consolidation/gi, "Deload")
    .replace(/external[- ]load[- ]protected/gi, "Recovery")
    .replace(/external[- ]load/gi, "sport-load")
    .replace(/external load/gi, "sport-load")
    .replace(/treat external hockey as training load\.?/gi, "Treat hockey as planned sport load.")
    .replace(/\bexternal\b/gi, "sport")
    .replace(/recovery protected/gi, "Recovery")
    .replace(/camp protection/gi, "Camp")
    .replace(/limit extra work/gi, "Recovery")
    .replace(/No hard dryland/gi, "Recovery")
    .replace(/No KPI testing/gi, "Skip performance testing")
    .replace(/external[- ]load[- ]protected/gi, "Recovery")
    .replace(/protection/gi, "recovery")
    .replace(/consolidation/gi, "Deload");
}

export function getWeekLoadLevel(week: PlanWeek): 1 | 2 | 3 | 4 | 5 {
  const plannedLevels: Record<number, 1 | 2 | 3 | 4 | 5> = {
    1: 4, 2: 5, 3: 3, 4: 5, 5: 4, 6: 4,
    7: 2, 8: 5, 9: 5, 10: 4, 11: 5, 12: 2,
  };
  return plannedLevels[week.weekNumber] || 3;
}

export function getWeekPlanSummary(week: PlanWeek): WeekPlanSummary {
  const days = trainingPlan.days.filter((day) => day.weekNumber === week.weekNumber);
  const loads = getWeekExternalLoads(week);
  const recoveryProtectedDates = new Set(days.filter((day) =>
    day.tags?.some((tag) => tag === "external-load-protected" || tag === "recovery")
    || day.dayRole.toLowerCase().includes("recovery"),
  ).map((day) => day.date));
  const highLoadDates = new Set([
    ...days.filter((day) => day.intensity >= 4).map((day) => day.date),
    ...loads.filter((load) => load.plannedIntensity >= 4).map((load) => load.date),
  ]);
  return {
    trainingDays: days.filter((day) => Boolean(day.workoutId)).length,
    externalLoadDays: new Set(loads.map((load) => load.date)).size,
    kpiDays: days.filter((day) => Boolean(day.kpiTestIds?.length)).length,
    recoveryProtectedDays: recoveryProtectedDates.size,
    highLoadDays: highLoadDates.size,
    loadLevel: getWeekLoadLevel(week),
    loadEmphasis: getWeekLoadLabel(week.weekNumber),
  };
}

export function getDayTags(date: string) {
  const day = getPlanDay(date);
  const visibleKeys = new Set(["recovery", "external-load-protected", "deload", "taper", "baseline", "conditional", "optional", "kpi"]);
  const tags = (day?.tags || []).filter((tag) => visibleKeys.has(tag));
  if (day?.dayRole.toLowerCase().includes("recovery")) tags.push("recovery");
  if (day?.weekNumber === 7) tags.push("deload");
  if (day?.weekNumber === 12) tags.push("taper");
  if (day?.kpiTestIds?.length && !tags.some((tag) => tag === "baseline" || tag === "conditional" || tag === "optional")) tags.push("kpi");
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

export function getTodayWorkout(date = new Date().toISOString().slice(0, 10)) {
  const day = getPlanDay(date);
  return day?.workoutId ? getWorkout(day.workoutId) : undefined;
}

export function getNextWorkout(afterDate = new Date().toISOString().slice(0, 10)) {
  const day = trainingPlan.days.find((item) => item.date > afterDate && item.workoutId);
  return day?.workoutId ? getWorkout(day.workoutId) : undefined;
}
