import planJson from "../../data/plan.json";
import { dayExecutionPlan, drillCards, exerciseVideoMap, sessions, speedStackPrescriptions } from "../imports/v8_4";
import type { V84DayExecutionPlanEntry } from "../imports/v8_4/types";
import type { Drill, TrainingPlan } from "../types";

const trainingPlan = planJson as TrainingPlan;

export type ActivityPresentationCategory =
  | "readiness"
  | "warmup"
  | "speed_stack"
  | "shooting"
  | "conditioning"
  | "mobility"
  | "recovery"
  | "iq"
  | "kpi"
  | "sport_load"
  | "reflection"
  | "other";

export type ActivityPresentationLogType =
  | "none"
  | "checkoff"
  | "drill_log"
  | "shooting_log"
  | "kpi_log"
  | "sport_load_log"
  | "recovery_log"
  | "reflection_log";

export type ActivityPresentation = {
  id: string;
  date: string;
  sequenceOrder: number;
  sourceBlockId?: string;
  sourceTrace?: {
    dayExecutionPlanId?: string;
    sessionId?: string;
    drillIds?: string[];
  };
  athleteTitle: string;
  parentTitle?: string;
  category: ActivityPresentationCategory;
  plannedDurationMinutes?: number;
  instruction?: string;
  coachingCue?: string;
  logType: ActivityPresentationLogType;
  required: boolean;
  optional: boolean;
  children?: ActivityPresentationChild[];
};

export type ActivityPresentationChild = {
  id: string;
  title: string;
  instruction?: string;
  plannedSets?: number;
  plannedReps?: string;
  plannedDurationMinutes?: number;
  coachingCue?: string;
  videoUrl?: string;
  sourceTrace?: {
    drillId?: string;
    sourceBlockId?: string;
  };
};

export type DayPresentationContext = {
  date: string;
  heroTitle: string;
  eyebrow: string;
  phaseLabel?: string;
  dayRoleLabel?: string;
  dayTypeLabel?: string;
  summary?: string;
};

export function projectDayPresentationContext(date: string): DayPresentationContext {
  const day = trainingPlan.days.find((item) => item.date === date);
  const session = sessions.find((item) => item.date === date) || null;
  const weekNumber = day?.weekNumber || trainingPlan.weeks.find((week) => date >= week.startDate && date <= week.endDate)?.weekNumber || session?.week || 1;
  const phaseLabel = weekLoadLabel(weekNumber);
  const dayRoleLabel = day ? contextUserFacingPlanText(day.dayRole) : undefined;
  const heroTitle = day?.primarySession || session?.summary || "Recovery / planning day";
  const eyebrow = day
    ? `Week ${day.weekNumber} · ${phaseLabel} · ${dayRoleLabel}`
    : session
      ? `Week ${session.week} · ${phaseLabel} · ${session.dayType}`
      : `${phaseLabel} · Planned day`;

  return {
    date,
    heroTitle,
    eyebrow,
    phaseLabel,
    dayRoleLabel,
    dayTypeLabel: session?.dayType,
    summary: session?.summary,
  };
}

export function projectPlannedDayActivities(date: string): ActivityPresentation[] {
  const entries = dayExecutionPlan
    .filter((entry) => entry.date === date)
    .sort((a, b) => a.sequence - b.sequence);
  const session = sessions.find((item) => item.date === date) || null;
  return entries.map((entry) => {
    const category = activityCategory(entry);
    const children = category === "speed_stack" && session ? speedStackChildren(entry) : [];
    return {
      id: `planned:${entry.date}:${entry.sequence}`,
      date: entry.date,
      sequenceOrder: entry.sequence,
      sourceBlockId: entry.sourceBlock,
      sourceTrace: {
        dayExecutionPlanId: `${entry.date}:${entry.sequence}`,
        sessionId: session?.sessionId,
        drillIds: children.map((child) => child.sourceTrace?.drillId).filter((value): value is string => Boolean(value)),
      },
      athleteTitle: activityTitle(entry),
      parentTitle: entry.entryType,
      category,
      plannedDurationMinutes: entry.plannedDurationMin ?? undefined,
      instruction: activityInstruction(entry),
      coachingCue: activityCue(entry),
      logType: activityLogType(entry),
      required: /^required$/i.test(entry.requiredOptional),
      optional: /^optional$/i.test(entry.requiredOptional),
      children,
    };
  });
}

export function activityToDrill(activity: ActivityPresentation): Drill {
  const instruction = activity.instruction || "";
  const coachingCue = activity.coachingCue && activity.coachingCue !== instruction ? activity.coachingCue : "";
  return {
    id: activity.id,
    name: activity.athleteTitle,
    category: categoryLabel(activity.category),
    purpose: "",
    setup: "",
    setupChecklist: [],
    instructions: [instruction].filter((value): value is string => Boolean(value)),
    plannedSets: null,
    plannedReps: plannedReps(activity),
    plannedDuration: activity.plannedDurationMinutes ? activity.plannedDurationMinutes * 60 : null,
    plannedPrescription: activity.plannedDurationMinutes ? `${activity.plannedDurationMinutes} min` : undefined,
    plannedRest: undefined,
    plannedTempo: undefined,
    plannedGroup: undefined,
    equipment: inferActivityEquipment(activity),
    coachingCues: [coachingCue].filter((value): value is string => Boolean(value)),
    commonMistakes: [],
    progression: "",
    regression: "",
    safetyNotes: safetyNotes(activity),
    videoUrl: null,
    qrUrl: null,
    sourceTag: "v8.4-activity-presentation",
  };
}

export function remainingPlannedMinutesFromStep(activities: ActivityPresentation[], currentStepIndex: number) {
  const remaining = activities.slice(Math.max(0, currentStepIndex));
  if (remaining.length === 0) return 0;
  if (remaining.some((activity) => typeof activity.plannedDurationMinutes !== "number")) return null;
  return remaining.reduce((total, activity) => total + (activity.plannedDurationMinutes ?? 0), 0);
}

function activityCategory(entry: V84DayExecutionPlanEntry): ActivityPresentationCategory {
  const text = normalizedEntryText(entry);
  if (/readiness/.test(text)) return "readiness";
  if (entry.logType === "sportLoadLog" || entry.entryType.toLowerCase().includes("sport load")) return "sport_load";
  if (entry.logType === "kpiLog" || /\bkpi\b|baseline|test/.test(text)) return "kpi";
  if (/speed stack|ss-[abc]/.test(text)) return "speed_stack";
  if (/warmup|wu-?10|wup-?10|activation/.test(text)) return "warmup";
  if (/shoot|shot/.test(text)) return "shooting";
  if (/bike|treadmill|conditioning|zone 2|rsa|shift/.test(text)) return "conditioning";
  if (/skill|iq|head-up|head up|puck touch|skl-hu/.test(text)) return "iq";
  if (/mobility|mob-?15|mob-?20|cooldown|recovery|walk/.test(text)) return "mobility";
  if (/reflection/.test(text)) return "reflection";
  return "other";
}

function activityLogType(entry: V84DayExecutionPlanEntry): ActivityPresentationLogType {
  if (entry.logType === "sportLoadLog") return "sport_load_log";
  if (entry.logType === "kpiLog") return "kpi_log";
  if (entry.logType === "reflectionLog") return "reflection_log";
  const category = activityCategory(entry);
  if (category === "shooting") return "shooting_log";
  if (category === "mobility" || category === "recovery") return "recovery_log";
  if (entry.logType === "trainingWorkLog") return "drill_log";
  return "checkoff";
}

function activityTitle(entry: V84DayExecutionPlanEntry) {
  const text = normalizedEntryText(entry);
  if (/readiness/.test(text)) return "Readiness check";
  if (activityCategory(entry) === "speed_stack") return speedStackTitle(entry.sourceBlock || entry.entryTitle);
  if (/wu-?10|wup-?10|warmup/.test(text)) return "Warm-up / mobility";
  if (/skl-hu10|head-up|head up/.test(text)) return "Head-up puck touches";
  if (activityCategory(entry) === "iq") return "Hockey awareness cue";
  if (/shot-100|100\s*shot/.test(text)) return "Shooting - 100 shots";
  if (/shot-50|50\s*shot/.test(text)) return "Shooting - 50 shots";
  if (/con-shift|shift/.test(text)) return "Shift-based conditioning";
  if (/con-rsa|repeated sprint/.test(text)) return "Repeated-sprint conditioning";
  if (/bike|treadmill/.test(text)) return "Controlled bike or treadmill";
  if (/mob-?15|mobility|cooldown|recovery/.test(text)) return "Cooldown / mobility";
  if (activityCategory(entry) === "kpi") return "KPI testing";
  if (activityCategory(entry) === "reflection") return "End-of-day reflection";
  return humanize(entry.entryTitle);
}

function activityInstruction(entry: V84DayExecutionPlanEntry) {
  const category = activityCategory(entry);
  if (/readiness/.test(normalizedEntryText(entry))) return "Check energy, soreness, sleep, and mood before starting.";
  if (category === "warmup") return "Prepare to move well. Keep it easy and focused.";
  if (category === "speed_stack") return "Complete the planned Speed Stack work. Keep every rep clean.";
  if (category === "shooting") return "Shoot with clean mechanics. Reset between shots and stop if technique breaks.";
  if (category === "conditioning") return "Keep this controlled. Skip it if tired, sore, or mechanics are slipping.";
  if (category === "iq") return "Keep this short and low intensity. Focus on seeing the play before making your next move.";
  if (category === "mobility") return "Keep this easy. Bring your breathing down and finish feeling better than when you started.";
  if (category === "kpi") return "Record the planned test while fresh. Clean technique beats ugly numbers.";
  if (category === "reflection") return "Log energy, soreness, confidence, one thing learned, and whether tomorrow needs adjustment.";
  return cleanInstruction(entry.notes);
}

function activityCue(entry: V84DayExecutionPlanEntry) {
  const category = activityCategory(entry);
  if (/readiness/.test(normalizedEntryText(entry))) return "Reduce the plan if soreness, fatigue, or focus is off.";
  if (category === "iq") return "Stay low intensity and focus on awareness.";
  if (category === "mobility") return "Do light mobility or stretching. No hard conditioning here.";
  if (category === "shooting") return "Call the target and reset before the next shot.";
  if (category === "speed_stack") return "Stop if pain or technique breakdown appears.";
  return cleanInstruction(entry.notes);
}

function speedStackChildren(entry: V84DayExecutionPlanEntry): ActivityPresentationChild[] {
  const selection = speedStackSelection(entry);
  if (!selection) return [];
  return drillCards
    .filter((card) => card.phase === selection.phase && card.session === selection.session)
    .map((card) => {
      const prescription = speedStackPrescriptions.find((item) =>
        item.phase === card.phase
        && item.session === card.session
        && item.code === card.code
        && item.sourceWeek === selection.sourceWeek
      ) || null;
      const parsed = parseSetsAndReps(prescription?.setsXReps || "");
      return {
        id: card.drillId,
        title: card.exercise,
        instruction: cleanInstruction(prescription?.coachingNotes || card.notes),
        plannedSets: parsed.sets ?? undefined,
        plannedReps: parsed.reps ?? undefined,
        plannedDurationMinutes: parsed.durationSeconds ? Math.ceil(parsed.durationSeconds / 60) : undefined,
        coachingCue: cleanInstruction(prescription?.coachingNotes || ""),
        videoUrl: exerciseVideoMap.find((video) => video.canonicalExerciseId === card.drillId)?.primaryVideoUrl ?? undefined,
        sourceTrace: {
          drillId: card.drillId,
          sourceBlockId: entry.sourceBlock,
        },
      };
    });
}

function speedStackSelection(entry: V84DayExecutionPlanEntry) {
  const sourceBlock = entry.sourceBlock || entry.entryTitle;
  const match = sourceBlock.match(/^SS-([A-Z])-P(\d+)W(\d+)$/);
  if (!match) return null;
  return {
    phase: `Phase ${match[2]}`,
    session: match[1],
    sourceWeek: Number(match[3]),
  };
}

function speedStackTitle(value: string) {
  const match = value.match(/^SS-([A-Z])/);
  return match ? `Speed Stack ${match[1]}` : humanize(value);
}

function parseSetsAndReps(value: string) {
  const match = value.match(/^(\d+)\s*x\s*(.+)$/i);
  if (!match) return { sets: null, reps: undefined, durationSeconds: null };
  const detail = match[2];
  const durationSeconds = Number(detail.match(/(\d+)\s*s/)?.[1]) || null;
  const reps = durationSeconds ? detail : detail.trim();
  return { sets: Number(match[1]), reps, durationSeconds };
}

function plannedReps(activity: ActivityPresentation) {
  const match = activity.athleteTitle.match(/(\d+)\s+shots/i);
  return match ? Number(match[1]) : null;
}

function inferActivityEquipment(activity: ActivityPresentation) {
  const equipment: string[] = [];
  if (activity.category === "shooting" || activity.category === "iq") equipment.push("stick", "pucks or ball");
  if (activity.category === "shooting") equipment.push("net or target", "shooting pad if available");
  if (activity.category === "conditioning") equipment.push("bike or treadmill if used");
  if (activity.category === "warmup" || activity.category === "mobility" || activity.category === "recovery" || activity.category === "readiness") equipment.push("open floor space");
  return equipment;
}

function safetyNotes(activity: ActivityPresentation) {
  if (activity.category === "shooting") return "Only shoot into a safe target area. Stop for pain or mechanics falling apart.";
  return "Stop for pain or technique breakdown.";
}

function categoryLabel(category: ActivityPresentationCategory) {
  const labels: Record<ActivityPresentationCategory, string> = {
    readiness: "Readiness",
    warmup: "Warm-up",
    speed_stack: "Speed Stack",
    shooting: "Shooting",
    conditioning: "Conditioning",
    mobility: "Mobility",
    recovery: "Recovery",
    iq: "Skill / awareness",
    kpi: "KPI",
    sport_load: "Sport Load",
    reflection: "Reflection",
    other: "Training",
  };
  return labels[category];
}

function weekLoadLabel(weekNumber: number) {
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

function contextUserFacingPlanText(text: string) {
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

function normalizedEntryText(entry: V84DayExecutionPlanEntry) {
  return `${entry.entryType} ${entry.entryTitle} ${entry.sourceBlock} ${entry.notes} ${entry.appRenderHint}`.toLowerCase();
}

function humanize(value: string) {
  return value
    .replace(/\b([A-Z]+)-(\d+)\b/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanInstruction(value: string | undefined) {
  return (value || "")
    .replace(/\s*\|\s*Video v[\d.]+:.*$/i, "")
    .replace(/\bsource\s+conflict\b/gi, "")
    .replace(/\bunresolved\s+plan\s+items\b/gi, "")
    .replace(/\bsource\s+sheet\b/gi, "")
    .replace(/\bworkbook\b/gi, "")
    .replace(/\bexternal[- ]load\b/gi, "Sport Load")
    .replace(/\s+/g, " ")
    .trim();
}
