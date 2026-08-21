import planJson from "../../data/plan.json";
import { dayExecutionPlan, drillCards, exerciseVideoMap, sessions, skillShotIqLibrary, speedStackPrescriptions, speedStackSupportModules } from "../imports/v8_4";
import { getApprovedWeaknessModule } from "../weaknessOverlay";
import type { V84DayExecutionPlanEntry, V84SessionEntry } from "../imports/v8_4/types";
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
    detailIds?: string[];
  };
  athleteTitle: string;
  parentTitle?: string;
  category: ActivityPresentationCategory;
  plannedDurationMinutes?: number;
  instruction?: string;
  coachingCue?: string;
  logType: ActivityPresentationLogType;
  executable: boolean;
  summaryVisible: boolean;
  required: boolean;
  optional: boolean;
  focus?: string;
  eventDependent?: boolean;
  children?: ActivityPresentationChild[];
  supportModules?: ActivityPresentationSupportModule[];
};

export type ActivityPresentationSupportModule = {
  id: string;
  title: string;
  position: "before" | "after";
  groups: Array<{
    title: string;
    dose?: string;
    exercises: Array<{ id: string; title: string; dose?: string }>;
  }>;
  instructions: string[];
  sourceDemo?: { href: string; label: string };
};

export type ActivityPresentationChild = {
  id: string;
  title: string;
  instruction?: string;
  plannedSets?: number;
  plannedReps?: string;
  plannedDurationMinutes?: number;
  coachingCue?: string;
  tempo?: string;
  rest?: string;
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

type DayLoadTier = "easy" | "medium" | "hard";

const CONTROLLED_CARDIO_COPY = "Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.";
const JUNE_30_KPI_DATE = "2026-06-30";
export const JUNE_30_KPI_TITLE = "KPI Baseline / Technique Check";
export const KPI_RESULT_ENTRY_COPY = "Enter actual KPI results on the KPI page.";
export const KPI_RESULT_ENTRY_HREF = "/kpis";

export function isJune30KpiHotfixDate(date: string) {
  return date === JUNE_30_KPI_DATE;
}

export function projectDayPresentationContext(date: string): DayPresentationContext {
  const day = trainingPlan.days.find((item) => item.date === date);
  const session = sessions.find((item) => item.date === date) || null;
  const weekNumber = day?.weekNumber || trainingPlan.weeks.find((week) => date >= week.startDate && date <= week.endDate)?.weekNumber || session?.week || 1;
  const phaseLabel = weekLoadLabel(weekNumber);
  const dayRoleLabel = day ? contextUserFacingPlanText(day.dayRole) : undefined;
  const heroTitle = isJune30KpiHotfixDate(date) ? JUNE_30_KPI_TITLE : session?.summary || day?.primarySession || "Recovery / planning day";
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
  const activities = entries.map((entry) => {
    const category = activityCategory(entry);
    const executable = entry.executable !== false && !isExplicitNonExecutableEntry(entry);
    const isForwardCutover = entry.date >= "2026-08-14";
    const children = category === "speed_stack" && session ? speedStackChildren(entry) : forwardDetailChildren(entry);
    return {
      id: entry.activityId || `planned:${entry.date}:${entry.sequence}`,
      date: entry.date,
      sequenceOrder: entry.sequence,
      sourceBlockId: entry.sourceBlock,
      sourceTrace: {
        dayExecutionPlanId: `${entry.date}:${entry.sequence}`,
        sessionId: session?.sessionId,
        drillIds: children.map((child) => child.sourceTrace?.drillId).filter((value): value is string => Boolean(value)),
        detailIds: entry.detailIds,
      },
      athleteTitle: isForwardCutover ? entry.entryTitle : activityTitle(entry),
      parentTitle: entry.entryType,
      category,
      plannedDurationMinutes: executable ? plannedDurationMinutes(entry, session) : undefined,
      instruction: isForwardCutover ? cleanInstruction(entry.notes) : activityInstruction(entry),
      coachingCue: isForwardCutover ? undefined : activityCue(entry),
      logType: executable ? activityLogType(entry) : "none" as const,
      executable,
      summaryVisible: executable && category !== "readiness" && category !== "reflection",
      required: executable && /^required$/i.test(entry.requiredOptional),
      optional: executable && /^optional$/i.test(entry.requiredOptional),
      focus: entry.focus || undefined,
      eventDependent: entry.eventDependent,
      children,
      supportModules: category === "speed_stack" ? speedStackSupportModules
        .filter((module) => module.session === "A")
        .map((module) => ({
          id: module.moduleId,
          title: module.title,
          position: module.position,
          groups: module.groups.map((group) => ({
            title: group.title,
            dose: group.dose ?? undefined,
            exercises: group.exercises.map((exercise) => ({ id: exercise.exerciseId, title: exercise.title, dose: exercise.dose ?? undefined })),
          })),
          instructions: module.instructions,
          sourceDemo: { href: module.sourceDemoUrl, label: "Watch Speed Stack A warm-up and cooldown demonstrations" },
        }))
        : undefined,
    };
  });
  return isJune30KpiHotfixDate(date) ? june30KpiChecklistActivities(activities) : activities;
}

function june30KpiChecklistActivities(activities: ActivityPresentation[]) {
  const readiness = activities.find((activity) => activity.category === "readiness");
  const warmup = activities.find((activity) => activity.category === "warmup");
  const kpi = activities.find((activity) => activity.category === "kpi");
  const cooldown = activities.find((activity) => activity.category === "mobility" || activity.category === "recovery");
  const reflection = activities.find((activity) => activity.category === "reflection");
  return [readiness, warmup, kpi ? june30KpiActivity(kpi) : null, cooldown, reflection].filter((activity): activity is ActivityPresentation => Boolean(activity));
}

function june30KpiActivity(activity: ActivityPresentation): ActivityPresentation {
  return {
    ...activity,
    athleteTitle: "KPI testing",
    instruction: `${KPI_RESULT_ENTRY_COPY} ${KPI_RESULT_ENTRY_HREF}`,
    coachingCue: `Use ${KPI_RESULT_ENTRY_HREF} for the test values, then return here and mark this checklist step done.`,
  };
}

function plannedDurationMinutes(entry: V84DayExecutionPlanEntry, session: V84SessionEntry | null) {
  if (entry.date >= "2026-08-14") return entry.plannedDurationMin ?? undefined;
  if (!isControlledBikeTreadmillEntry(entry)) return entry.plannedDurationMin ?? undefined;
  const dayLoad = controlledCardioDayLoad(entry, session);
  if (dayLoad === "easy") return 45;
  if (dayLoad === "medium") return 30;
  return 20;
}

function controlledCardioDayLoad(entry: V84DayExecutionPlanEntry, session: V84SessionEntry | null): DayLoadTier {
  const dayType = (session?.dayType || "").toLowerCase();
  if (/recovery|aerobic recovery|deload|lighter/.test(dayType)) return "easy";
  if (/speed stack b|skill\/shooting \+ conditioning/.test(dayType)) return "medium";
  if (/kpi \+ technical skill|full speed stack|speed stack c/.test(dayType)) return "hard";
  throw new Error(`[activityPresentation] Cannot determine controlled cardio day load for ${entry.date} sequence ${entry.sequence}`);
}

function isControlledBikeTreadmillEntry(entry: V84DayExecutionPlanEntry) {
  const title = entry.entryTitle.toLowerCase();
  if (/con-shift|con-rsa|camp provides|short speed primer|walk \+ mob/.test(title)) return false;
  return /\bbike\b|\btreadmill\b|\btread\b|bike-z2|bike-int|speedstack conditioning|bike flush/.test(title);
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
  const entryType = entry.entryType.toLowerCase();
  if (entryType.includes("readiness")) return "readiness";
  if (entry.logType === "sportLoadLog" || entryType.includes("sport load")) return "sport_load";
  if (entry.logType === "kpiLog" || entryType === "kpi") return "kpi";
  if (entryType.includes("speed stack") || /speed stack|ss-[abc]/.test(text)) return "speed_stack";
  if (entryType.includes("warmup") || /warmup|wu-?10|wup-?10|activation/.test(text)) return "warmup";
  if (entryType.includes("shooting") || /shoot|shot/.test(text)) return "shooting";
  if (entryType.includes("conditioning") || /bike|treadmill|conditioning|zone 2|rsa|shift/.test(text)) return "conditioning";
  if (entryType.includes("skill") || /skill|iq|head-up|head up|puck touch|skl-hu/.test(text)) return "iq";
  if (entryType.includes("recovery") || /mobility|mob-?15|mob-?20|cooldown|recovery|walk/.test(text)) return "mobility";
  if (entryType.includes("reflection") || /reflection/.test(text)) return "reflection";
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
  if (isExplicitNonExecutableEntry(entry)) return humanize(entry.entryTitle);
  const text = normalizedEntryText(entry);
  if (entry.entryType.toLowerCase().includes("readiness")) return "Readiness check";
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
  if (isExplicitNonExecutableEntry(entry)) return cleanInstruction(entry.notes) || "No additional conditioning is prescribed.";
  const category = activityCategory(entry);
  if (category === "readiness") return "Check energy, soreness, sleep, and mood before starting.";
  if (category === "warmup") return "Prepare to move well. Keep it easy and focused.";
  if (category === "speed_stack") return "Complete the planned Speed Stack work. Keep every rep clean.";
  if (category === "shooting") return "Shoot with clean mechanics. Reset between shots and stop if technique breaks.";
  if (category === "conditioning" && isControlledBikeTreadmillEntry(entry)) return CONTROLLED_CARDIO_COPY;
  if (category === "conditioning") return "Keep this controlled. Skip it if tired, sore, or mechanics are slipping.";
  if (category === "iq") return "Keep this short and low intensity. Focus on seeing the play before making your next move.";
  if (category === "mobility") return "Keep this easy. Bring your breathing down and finish feeling better than when you started.";
  if (category === "kpi") return "Record the planned test while fresh. Clean technique beats ugly numbers.";
  if (category === "reflection") return "Log energy, soreness, confidence, one thing learned, and whether tomorrow needs adjustment.";
  return cleanInstruction(entry.notes);
}

function activityCue(entry: V84DayExecutionPlanEntry) {
  const category = activityCategory(entry);
  if (category === "readiness") return "Reduce the plan if soreness, fatigue, or focus is off.";
  if (category === "iq") return "Stay low intensity and focus on awareness.";
  if (category === "mobility") return "Do light mobility or stretching. No hard conditioning here.";
  if (category === "shooting") return "Call the target and reset before the next shot.";
  if (category === "speed_stack") return "Stop if pain or technique breakdown appears.";
  if (category === "conditioning" && isControlledBikeTreadmillEntry(entry)) return CONTROLLED_CARDIO_COPY;
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
        tempo: prescription?.tempo,
        rest: prescription?.rest,
        videoUrl: exerciseVideoMap.find((video) => video.canonicalExerciseId === card.drillId)?.primaryVideoUrl ?? undefined,
        sourceTrace: {
          drillId: card.drillId,
          sourceBlockId: entry.sourceBlock,
        },
      };
    });
}

function forwardDetailChildren(entry: V84DayExecutionPlanEntry): ActivityPresentationChild[] {
  if (entry.date < "2026-08-14") return [];
  const children = (entry.detailIds ?? []).flatMap((id): ActivityPresentationChild[] => {
    const drill = skillShotIqLibrary.find((candidate) => candidate.drillID === id);
    if (drill) return [{
      id: drill.drillID,
      title: drill.drill,
      instruction: `${drill.setup} ${drill.executionSteps}`,
      plannedReps: drill.prescription,
      coachingCue: drill.coachingCue,
      videoUrl: exerciseVideoMap.find((video) => video.canonicalExerciseId === drill.drillID)?.primaryVideoUrl ?? undefined,
      sourceTrace: { drillId: drill.drillID, sourceBlockId: entry.sourceBlock },
    }];
    const module = getApprovedWeaknessModule(id);
    if (module) return (module.exercises ?? []).map((exercise, index) => ({
      id: `${module.id}:${index + 1}`,
      title: exercise,
      instruction: (module.safety ?? []).join(" · "),
      coachingCue: module.cue,
      sourceTrace: { drillId: module.id, sourceBlockId: entry.sourceBlock },
    }));
    return [];
  });
  return children;
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

export function weekLoadLabel(weekNumber: number) {
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

function isExplicitNonExecutableEntry(entry: V84DayExecutionPlanEntry) {
  return entry.entryType.toLowerCase().includes("conditioning") && /^none\s*-\s*camp provides sport conditioning$/i.test(entry.entryTitle.trim());
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
