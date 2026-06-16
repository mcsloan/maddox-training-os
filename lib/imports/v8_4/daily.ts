import { dayExecutionPlan, sportLoads } from "./index";
import { V84DayExecutionPlanEntry, V84SportLoad } from "./types";
import { ExternalLoadType, PlannedExternalLoad, Rating } from "@/lib/types";

export interface V84DailyExecutionSummary {
  date: string;
  entries: V84DayExecutionPlanEntry[];
  sportLoads: PlannedExternalLoad[];
}

export function getV84DayExecutionEntries(date: string) {
  return dayExecutionPlan.filter((entry) => entry.date === date).sort((a, b) => a.sequence - b.sequence);
}

export function getV84TrainingWorkEntries(date: string) {
  return getV84DayExecutionEntries(date).filter((entry) => entry.logType === "trainingWorkLog");
}

export function getV84SportLoadsForDate(date: string) {
  return sportLoads.filter((load) => load.date === date).map((load, index) => toPlannedSportLoad(load, index));
}

export function getV84SportLoadById(id: string) {
  for (const load of sportLoads) {
    const planned = toPlannedSportLoad(load);
    if (planned.id === id) return planned;
  }
  return null;
}

export function getV84DailyExecutionSummary(date: string): V84DailyExecutionSummary {
  return {
    date,
    entries: getV84DayExecutionEntries(date),
    sportLoads: getV84SportLoadsForDate(date),
  };
}

function toPlannedSportLoad(load: V84SportLoad, index = 0): PlannedExternalLoad {
  const title = load.sportLoad;
  const provider = inferProvider(title);
  const timeLabel = inferTimeLabel(load.details);
  const duration = inferDurationMinutes(load.details);
  return {
    id: `v84-sport-load:${load.date}:${index}:${slugify(title)}`,
    date: load.date,
    type: inferType(title),
    title,
    provider,
    startTime: timeLabel,
    endTime: "",
    plannedDurationMinutes: duration,
    plannedIntensity: clampRating(load.intensity15),
    notes: `${load.details}. Sport load is part of the plan.`,
    recoveryRule: "Keep recovery first: fluids, snack, mobility, and sleep.",
    doNotDoRule: "No hard dryland after this sport load.",
    trackingQuestions: buildTrackingQuestions(title),
  };
}

function inferType(title: string): ExternalLoadType {
  const normalized = title.toLowerCase();
  if (normalized.includes("lacrosse") && normalized.includes("playoff")) return "lacrosse_playoff";
  if (normalized.includes("lacrosse") && normalized.includes("practice")) return "lacrosse_practice";
  if (normalized.includes("lacrosse") && normalized.includes("game")) return "lacrosse_game";
  if (normalized.includes("camp")) return "hockey_camp";
  if (normalized.includes("4v4")) return "on_ice_4v4";
  if (normalized.includes("marc")) return "on_ice";
  if (normalized.includes("tryout")) return "tryout";
  return "other";
}

function inferProvider(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("lacrosse")) return "Knights Lacrosse";
  if (normalized.includes("chase")) return "Chase Hull";
  if (normalized.includes("carleton")) return "Carleton Ravens";
  if (normalized.includes("sensplex")) return "Sensplex";
  if (normalized.includes("marc")) return "Marc O’Connor";
  if (normalized.includes("4v4")) return "On-Ice";
  if (normalized.includes("tryout")) return "Tryout Session";
  return "Maddox Plan";
}

function inferTimeLabel(details: string) {
  const range = details.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  if (range) return `${range[1]}-${range[2]}`;
  if (/all day/i.test(details)) return "All day";
  if (/2\s*[–-]\s*3 hours/i.test(details) || /2\s*[–-]\s*3h/i.test(details)) return "Confirm time";
  if (/two 22-minute games/i.test(details)) return "Confirm time";
  return "Confirm time";
}

function inferDurationMinutes(details: string) {
  if (/two 22-minute games/i.test(details)) return 44;
  if (/2\s*[–-]\s*3 hours/i.test(details) || /2\s*[–-]\s*3h/i.test(details)) return 150;
  if (/approx\.\s*2 hours/i.test(details)) return 120;
  return null;
}

function buildTrackingQuestions(title: string) {
  const base = [
    "Actual duration?",
    "Effort 1-5?",
    "Energy after 1-5?",
    "Confidence 1-5?",
    "Soreness or pain?",
  ];
  if (title.toLowerCase().includes("camp")) {
    return [
      "Compete level?",
      "Skating pace?",
      "Puck confidence?",
      "Communication / talking?",
      "Attack or passive?",
      ...base,
    ];
  }
  return base;
}

function clampRating(value: number): Rating {
  return Math.max(1, Math.min(5, Math.round(value))) as Rating;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "sport-load";
}
