import type { V84DayExecutionPlanEntry } from "@/lib/imports/v8_4/types";
import { projectDayPresentationContext, projectPlannedDayActivities, type ActivityPresentation, type DayPresentationContext } from "./activityPresentation";
import type { DayProjection } from "./dayProjection";
import type { Drill, KPI, PlannedExternalLoad, PlanDay, PlanDayDisplayModel, VideoReference, Workout, WorkoutBlock } from "../types";

type PresentationChipKind =
  | "foundation" | "speed-power" | "game-speed" | "taper"
  | "on-ice" | "camp" | "lacrosse"
  | "deload" | "recovery" | "perf-testing";

export interface PresentationChip {
  key: string;
  kind: PresentationChipKind;
  label?: string;
}

export interface DayPresentationCta {
  label: string;
  href: string;
  tone: "primary" | "secondary" | "notice";
}

export interface DayPresentationEvidenceSummary {
  label: string;
  count: number;
  state: "logged" | "not_logged" | "planned" | "none" | "partial";
}

export interface DayExecutionStepPresentation {
  hidden: boolean;
  displaySequence: number | null;
  title: string;
  subtitle: string | null;
  loadImpact: string | null;
  note: string | null;
  blockLabels: string[];
  guidance: string[];
  videos: VideoReference[];
}

export interface DayPresentation {
  date: string;
  dayTitle: string;
  chips: PresentationChip[];
  normalizedGuidance: string[];
  equipmentSummary: string[];
  equipmentSetupNotes: string[];
  plannedWorkSummary: string;
  sportLoadEvidenceSummary: DayPresentationEvidenceSummary;
  kpiEvidenceSummary: DayPresentationEvidenceSummary;
  trainingWorkEvidenceSummary: DayPresentationEvidenceSummary;
  reflectionEvidenceSummary: DayPresentationEvidenceSummary;
  unresolvedItems: string[];
  conflictItems: string[];
  ctas: DayPresentationCta[];
  parentCue: string;
  loadRule: string;
  recovery: string;
  parentExplanation: string;
  athleteActionSummary: string;
  isKpiTestingDay: boolean;
  showSourceExecutionInDetails: boolean;
  executionSteps: Record<number, DayExecutionStepPresentation>;
}

export interface BuildDayPresentationArgs {
  date: string;
  day?: PlanDay;
  display?: PlanDayDisplayModel;
  tags?: string[];
  sportLoads?: PlannedExternalLoad[];
  executionEntries?: V84DayExecutionPlanEntry[];
  workout?: Workout;
  workoutBlocks?: WorkoutBlock[];
  drills?: Drill[];
  videos?: VideoReference[];
  plannedKpis?: KPI[];
  plannedActivities?: ActivityPresentation[];
  evidence?: DayProjection;
  logTodayHref?: string;
  trainingWorkHref?: string;
  trainingWorkLogHref?: string;
  fallbackTitle?: string;
  dayContext?: DayPresentationContext;
}

const CONTROLLED_CARDIO_COPY = "Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.";

export function normalizeChips(args: { display?: PlanDayDisplayModel; tags?: string[]; sportLoads?: PlannedExternalLoad[] }) {
  const chips: PresentationChip[] = [];
  if (args.display) addChip(chips, phaseChip(args.display.methodologyPhase));
  for (const load of args.sportLoads ?? []) addChip(chips, { key: `sport:${externalLoadKind(load.type)}`, kind: externalLoadKind(load.type) });
  for (const tag of args.tags ?? []) addChip(chips, { key: `tag:${planTagKind(tag)}`, kind: planTagKind(tag) });
  return chips;
}

export function dedupeGuidance(values: Array<string | undefined | null>) {
  const result: string[] = [];
  for (const value of values) {
    const normalized = cleanSentence(value);
    if (!normalized) continue;
    const existingIndex = result.findIndex((item) => sameGuidance(item, normalized));
    if (existingIndex >= 0) {
      if (normalized.length > result[existingIndex].length) result[existingIndex] = normalized;
      continue;
    }
    result.push(normalized);
  }
  return result;
}

export function computeEquipmentSummary(args: { drills?: Drill[]; executionEntries?: V84DayExecutionPlanEntry[]; plannedKpis?: KPI[]; workoutBlocks?: WorkoutBlock[] } = {}) {
  let maxCones = 0;
  const output: string[] = [];
  const drills = args.drills ?? [];
  for (const item of drills.flatMap((drill) => drill.equipment)) {
    const normalized = item.trim();
    const coneMatch = normalized.match(/^(\d+)\s+cones?$/i);
    if (coneMatch) {
      maxCones = Math.max(maxCones, Number(coneMatch[1]));
      continue;
    }
    if (/^timer$/i.test(normalized)) {
      addUnique(output, "timer or phone");
      continue;
    }
    if (/^stick$/i.test(normalized)) {
      addUnique(output, "stick");
      continue;
    }
    if (/^water$/i.test(normalized)) {
      addUnique(output, "water bottle");
      continue;
    }
    if (/^puck or ball$/i.test(normalized)) {
      addUnique(output, "pucks or ball");
      continue;
    }
    if (/^training shoes$/i.test(normalized)) {
      addUnique(output, "training shoes");
      continue;
    }
    if (/^50 pucks$/i.test(normalized)) {
      addUnique(output, "pucks or ball");
      continue;
    }
    if (/^net$/i.test(normalized) || /^net or shooting tarp$/i.test(normalized) || /^targets?$/i.test(normalized)) {
      addUnique(output, "net or target");
      continue;
    }
    if (/^callout cards$/i.test(normalized)) {
      addUnique(output, "callout cards");
      continue;
    }
    addUnique(output, normalized);
  }
  const activityText = [
    ...drills.map((drill) => `${drill.name} ${drill.category} ${drill.purpose} ${drill.setup} ${drill.instructions.join(" ")}`),
    ...(args.executionEntries ?? []).map((entry) => `${entry.entryType} ${entry.entryTitle} ${entry.sourceBlock} ${entry.notes} ${entry.appRenderHint}`),
    ...(args.plannedKpis ?? []).map((kpi) => `${kpi.name} ${kpi.category} ${kpi.instructions.join(" ")}`),
    ...(args.workoutBlocks ?? []).map((block) => `${block.name} ${block.category} ${block.description}`),
  ].join(" ").toLowerCase();
  addDerivedEquipment(output, activityText);
  if (maxCones > 0) output.unshift(`Cones: up to ${maxCones}`);
  return output;
}

export function detectPlanConflicts(args: { day?: PlanDay; executionEntries?: V84DayExecutionPlanEntry[]; plannedKpis?: KPI[] }) {
  const conflicts: string[] = [];
  const text = [
    args.day?.shootingPuckDetail,
    args.day?.primarySession,
    ...(args.executionEntries ?? []).map((entry) => `${entry.entryTitle} ${entry.notes} ${entry.sourceBlock}`),
  ].join(" ");
  const hasShot100 = /\bSHOT-?100\b|100\+?\s+shots?/i.test(text);
  const hasShot50 = /\bSHOT-?50\b|50[-\s]?shot/i.test(text) || (args.plannedKpis ?? []).some((kpi) => /50[-\s]?shot/i.test(kpi.name));
  if (isKpiTestingDay(args) && hasShot100 && hasShot50) conflicts.push("shooting_volume_mismatch");
  return conflicts;
}

export function buildDayPresentation(args: BuildDayPresentationArgs): DayPresentation {
  const sportLoads = args.sportLoads ?? [];
  const executionEntries = args.executionEntries ?? [];
  const plannedActivities = args.plannedActivities ?? projectPlannedDayActivities(args.date);
  const dayContext = args.dayContext ?? projectDayPresentationContext(args.date);
  const plannedKpis = args.plannedKpis ?? [];
  const evidence = args.evidence;
  const isSportLoadDay = sportLoads.length > 0;
  const hasPlannedTrainingWork = Boolean(args.workout || args.workoutBlocks?.length || executionEntries.some((entry) => entry.logType === "trainingWorkLog") || (args.day?.durationMinutes || 0) > 0);
  const conflictItems = detectPlanConflicts({ day: args.day, executionEntries, plannedKpis });
  const isKpiDay = isKpiTestingDay({ day: args.day, display: args.display, executionEntries });
  const kpiCount = evidence?.records.kpiResults.length ?? 0;
  const sportLoadCount = evidence?.records.sportLoadLogs.length ?? 0;
  const trainingWorkCount = evidence ? evidence.records.sessionAttempts.length + evidence.records.drillLogs.length : 0;
  const reflectionCount = evidence?.records.reflections.length ?? 0;
  const kpiPartial = isKpiDay && plannedKpis.length > 0 && kpiCount > 0 && kpiCount < plannedKpis.length;
  const sharedHeroTitle = dayContext.heroTitle === "Recovery / planning day" ? "" : dayContext.heroTitle;
  const dayTitle = displayDayTitle(sharedHeroTitle || args.day?.primarySession || args.fallbackTitle || sportLoads[0]?.title || "Recovery / planning day", isKpiDay);
  const guidance = dedupeGuidance([
    args.day?.parentCue,
    args.day?.doNotDo,
    args.day?.recoveryRule,
    args.day?.recovery,
    sportLoads[0]?.doNotDoRule,
    sportLoads[0]?.recoveryRule,
  ].map((value) => value ? userFacingPlanText(value) : value));

  return {
    date: args.date,
    dayTitle,
    chips: normalizeChips({ display: args.display, tags: isSportLoadDay ? sportLoadTagsOnly(args.tags ?? []) : args.tags, sportLoads }),
    normalizedGuidance: guidance,
    equipmentSummary: computeEquipmentSummary({ drills: args.drills, executionEntries, plannedKpis, workoutBlocks: args.workoutBlocks }),
    equipmentSetupNotes: equipmentSetupNotes({ executionEntries, plannedKpis, workoutBlocks: args.workoutBlocks }),
    plannedWorkSummary: plannedWorkSummary({ day: args.day, hasPlannedTrainingWork, isSportLoadDay, plannedKpis, isKpiDay }),
    sportLoadEvidenceSummary: {
      label: "Sport Load evidence",
      count: sportLoadCount,
      state: sportLoadCount > 0 ? "logged" : sportLoads.length > 0 ? "planned" : "none",
    },
    kpiEvidenceSummary: {
      label: "KPI evidence",
      count: kpiCount,
      state: !isKpiDay ? "none" : kpiPartial ? "partial" : kpiCount > 0 ? "logged" : plannedKpis.length > 0 ? "planned" : "none",
    },
    trainingWorkEvidenceSummary: {
      label: "Training Work evidence",
      count: trainingWorkCount,
      state: trainingWorkCount > 0 ? "logged" : hasPlannedTrainingWork ? "not_logged" : "none",
    },
    reflectionEvidenceSummary: {
      label: "Reflection evidence",
      count: reflectionCount,
      state: reflectionCount > 0 ? "logged" : "none",
    },
    unresolvedItems: unresolvedItems({ kpiPartial, plannedKpis }),
    conflictItems,
    ctas: buildCtas({ args, hasPlannedTrainingWork, isKpiDay, kpiCount, sportLoadCount }),
    parentCue: parentCue(args.day, isKpiDay),
    loadRule: loadRule(args.day, sportLoads[0], isKpiDay),
    recovery: recoveryCopy(args.day, sportLoads[0], isKpiDay),
    parentExplanation: parentExplanation(args.day, sportLoads[0]),
    athleteActionSummary: athleteActionSummary({ day: args.day, isSportLoadDay, plannedKpis, isKpiDay }),
    isKpiTestingDay: isKpiDay,
    showSourceExecutionInDetails: !isSportLoadDay,
    executionSteps: buildExecutionSteps({ day: args.day, executionEntries, plannedActivities, plannedKpis, videos: args.videos ?? [], workoutBlocks: args.workoutBlocks ?? [], conflictItems }),
  };
}

function buildExecutionSteps(args: { day?: PlanDay; executionEntries: V84DayExecutionPlanEntry[]; plannedActivities: ActivityPresentation[]; plannedKpis: KPI[]; videos: VideoReference[]; workoutBlocks: WorkoutBlock[]; conflictItems: string[] }) {
  const result: Record<number, DayExecutionStepPresentation> = {};
  let displaySequence = 0;
  for (const entry of args.executionEntries) {
    const hidden = shouldHideExecutionEntry({ entry, plannedKpis: args.plannedKpis, conflictItems: args.conflictItems });
    const activity = args.plannedActivities.find((item) => item.sequenceOrder === entry.sequence);
    if (!hidden) displaySequence += 1;
    const blocks = matchingBlocks(entry, args.workoutBlocks);
    result[entry.sequence] = {
      hidden,
      displaySequence: hidden ? null : displaySequence,
      title: activity?.athleteTitle || entryTitle({ entry, conflictItems: args.conflictItems }),
      subtitle: activity ? activitySubtitle(activity) : entrySubtitle({ entry, conflictItems: args.conflictItems }),
      loadImpact: entryLoadImpact({ entry, conflictItems: args.conflictItems }),
      note: activity?.instruction || entryNote({ entry, conflictItems: args.conflictItems }),
      blockLabels: blocks.map((block) => plainBlockName(block)),
      guidance: activityGuidance(activity) || stepGuidance({ day: args.day, entry, conflictItems: args.conflictItems }),
      videos: matchingVideos(entry, args.videos),
    };
  }
  return result;
}

function activitySubtitle(activity: ActivityPresentation) {
  const labels: Record<ActivityPresentation["category"], string> = {
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
  return labels[activity.category];
}

function activityGuidance(activity: ActivityPresentation | undefined) {
  if (!activity) return null;
  return [activity.coachingCue].filter((value): value is string => Boolean(value));
}

function stepGuidance(args: { day?: PlanDay; entry: V84DayExecutionPlanEntry; conflictItems: string[] }) {
  const entryType = args.entry.entryType.toLowerCase();
  const title = args.entry.entryTitle.toLowerCase();
  const values: string[] = [];
  if (args.entry.logType === "kpiLog") {
    values.push(args.day?.recovery || args.day?.recoveryRule || "Full recovery between attempts; finish fresh.");
  }
  if (hasShootingVolumeMismatch(args.conflictItems) && isShootingEntry(args.entry)) {
    values.push("Reset between shots. Prioritize clean technique.");
    values.push("Stop if sore, tired, or mechanics break down.");
  } else if (entryType.includes("shooting") || title.includes("shot")) {
    values.push(displayShootingDetail(args.day?.shootingPuckDetail));
    values.push("Pick targets, reset between shots, and stop if technique breaks.");
  }
  if (entryType.includes("recovery") || title.includes("mob")) {
    values.push("Do light mobility or stretching. No hard conditioning here.");
    values.push("This should help him feel better, not add fatigue.");
  }
  if (entryType.includes("skill") && args.day?.dailyMicroSkill) values.push(`Daily skill focus: ${args.day.dailyMicroSkill}.`);
  return dedupeGuidance(values);
}

function plannedWorkSummary(args: { day?: PlanDay; hasPlannedTrainingWork: boolean; isSportLoadDay: boolean; plannedKpis: KPI[]; isKpiDay: boolean }) {
  if (args.isSportLoadDay) return "Sport Load is the main workload; support work should stay skill and recovery focused.";
  if (args.isKpiDay && args.plannedKpis.length > 0) return `${args.plannedKpis.length} planned KPI checks plus any supporting training work.`;
  if (args.hasPlannedTrainingWork) return args.day?.primarySession || "Planned training work";
  return "No planned training work today; recovery and readiness come first.";
}

function unresolvedItems(args: { kpiPartial: boolean; plannedKpis: KPI[] }) {
  const items: string[] = [];
  if (args.kpiPartial) items.push("One planned KPI remains unresolved or deferred; do not infer a missing result.");
  return items;
}

function equipmentSetupNotes(args: { executionEntries: V84DayExecutionPlanEntry[]; plannedKpis: KPI[]; workoutBlocks?: WorkoutBlock[] }) {
  const notes: string[] = [];
  const text = [
    ...args.executionEntries.map((entry) => `${entry.entryType} ${entry.entryTitle} ${entry.notes}`),
    ...args.plannedKpis.map((kpi) => `${kpi.name} ${kpi.category}`),
    ...(args.workoutBlocks ?? []).map((block) => `${block.name} ${block.category} ${block.description}`),
  ].join(" ").toLowerCase();
  if (/\b(sprint|agility|5-?10-?5)\b/.test(text)) addUnique(notes, "Use cones or markers for sprint/agility setup.");
  if (/\b(sprint|broad jump|jump)\b/.test(text)) addUnique(notes, "Use measuring tape for sprint distance and broad jump.");
  if (/\bshoot|target[-\s]?hit|accuracy\b/.test(text)) addUnique(notes, "Use net or target for the 50-shot target-hit test.");
  if (/\bmobility|warmup|cooldown|recovery\b/.test(text)) addUnique(notes, "Use open floor space for mobility and cooldown.");
  return notes;
}

function parentCue(day: PlanDay | undefined, isKpiDay: boolean) {
  if (isKpiDay) return "Record baseline results while fresh. Clean technique beats ugly numbers.";
  return userFacingPlanText(day?.parentCue || "Prioritize recovery and ask about energy.");
}

function loadRule(day: PlanDay | undefined, sportLoad: PlannedExternalLoad | undefined, isKpiDay: boolean) {
  if (isKpiDay) return "No PR chasing. Stop testing if sore, tired, or technique breaks.";
  return userFacingLoadRule(sportLoad?.doNotDoRule || day?.doNotDo, Boolean(sportLoad));
}

function recoveryCopy(day: PlanDay | undefined, sportLoad: PlannedExternalLoad | undefined, isKpiDay: boolean) {
  if (isKpiDay) return "Hydrate, cool down, and finish feeling fresh.";
  return userFacingLoadRule(sportLoad?.recoveryRule || day?.recoveryRule || day?.recovery, Boolean(sportLoad));
}

function buildCtas({ args, hasPlannedTrainingWork, isKpiDay, kpiCount, sportLoadCount }: { args: BuildDayPresentationArgs; hasPlannedTrainingWork: boolean; isKpiDay: boolean; kpiCount: number; sportLoadCount: number }) {
  const ctas: DayPresentationCta[] = [];
  if (isKpiDay && (args.plannedKpis?.length ?? 0) > 0 && kpiCount > 0) ctas.push({ label: "Review KPI Results", href: "/kpis", tone: "secondary" });
  if ((args.sportLoads?.length ?? 0) > 0 && args.logTodayHref) ctas.push({ label: sportLoadCount > 0 ? "Update Sport Load" : "Log Today", href: args.logTodayHref, tone: sportLoadCount > 0 ? "secondary" : "primary" });
  if (hasPlannedTrainingWork && args.trainingWorkHref) ctas.push({ label: "Start / Log Today's Training", href: args.trainingWorkHref, tone: "primary" });
  return ctas;
}

function parentExplanation(day?: PlanDay, sportLoad?: PlannedExternalLoad) {
  const loadRule = userFacingLoadRule(sportLoad?.doNotDoRule || day?.doNotDo, Boolean(sportLoad));
  const recovery = userFacingLoadRule(sportLoad?.recoveryRule || day?.recoveryRule || day?.recovery, Boolean(sportLoad));
  return dedupeGuidance([day?.parentCue, loadRule, recovery]).join(" ");
}

function athleteActionSummary(args: { day?: PlanDay; isSportLoadDay: boolean; plannedKpis: KPI[]; isKpiDay: boolean }) {
  if (args.isSportLoadDay) return "Complete the sport load, then keep extra work light, skilled, and recovery focused.";
  if (args.isKpiDay && args.plannedKpis.length > 0) return "Do KPI checks while fresh, then only log supporting training work if it was actually completed.";
  return args.day?.primarySession || "Follow today's planned work and log what actually happened.";
}

function phaseChip(phase: string): PresentationChip {
  const normalized = phase.toLowerCase();
  const kind: PresentationChipKind = normalized.includes("deload")
    ? "deload"
    : normalized.includes("taper")
      ? "taper"
      : normalized.includes("foundation")
        ? "foundation"
        : normalized.includes("speed")
          ? "speed-power"
          : "game-speed";
  return { key: `phase:${kind}`, kind };
}

function externalLoadKind(type: PlannedExternalLoad["type"]): PresentationChipKind {
  const kinds: Record<PlannedExternalLoad["type"], PresentationChipKind> = {
    lacrosse_practice: "lacrosse",
    lacrosse_game: "lacrosse",
    lacrosse_playoff: "lacrosse",
    hockey_camp: "camp",
    on_ice: "on-ice",
    on_ice_4v4: "on-ice",
    tryout: "on-ice",
    other: "recovery",
  };
  return kinds[type];
}

function planTagKind(tag: string): PresentationChipKind {
  const tagKinds: Record<string, PresentationChipKind> = {
    recovery: "recovery",
    "external-load-protected": "recovery",
    deload: "deload",
    taper: "taper",
    camp: "camp",
    "on-ice": "on-ice",
    tryout: "on-ice",
    lacrosse: "lacrosse",
    playoff: "lacrosse",
    kpi: "perf-testing",
    "kpi-checkpoint": "perf-testing",
    baseline: "perf-testing",
    conditional: "perf-testing",
    optional: "perf-testing",
  };
  return tagKinds[tag] || "recovery";
}

function addChip(chips: PresentationChip[], chip: PresentationChip) {
  if (chips.some((existing) => existing.kind === chip.kind && existing.label === chip.label)) return;
  chips.push(chip);
}

function addUnique(items: string[], item: string) {
  if (item && !items.includes(item)) items.push(item);
}

function addDerivedEquipment(items: string[], activityText: string) {
  if (/\b(kpi|test|testing|baseline|sprint|agility|5-?10-?5|pro agility)\b/.test(activityText)) {
    addUnique(items, "timer or phone");
    addUnique(items, "cones or markers");
    addUnique(items, "measuring tape");
  }
  if (/\b10[-\s]?yard|sprint\b/.test(activityText)) {
    addUnique(items, "timer or phone");
    addUnique(items, "cones or markers");
    addUnique(items, "measuring tape");
  }
  if (/\b5-?10-?5|agility\b/.test(activityText)) {
    addUnique(items, "timer or phone");
    addUnique(items, "cones or markers");
    addUnique(items, "measuring tape");
  }
  if (/\bbroad jump|jump\b/.test(activityText)) {
    addUnique(items, "measuring tape");
    addUnique(items, "tape line or floor marker");
  }
  if (/\bshoot|target[-\s]?hit|accuracy\b/.test(activityText)) {
    addUnique(items, "stick");
    addUnique(items, "pucks or ball");
    addUnique(items, "net or target");
    addUnique(items, "shooting pad if available");
  }
  if (/\bpuck|stickhandle|head[-\s]?up|callout|quick hands|weave\b/.test(activityText)) {
    addUnique(items, "stick");
    addUnique(items, "pucks or ball");
    if (!items.includes("cones or markers")) addUnique(items, "cones or markers if space allows");
  }
  if (/\bmobility|warmup|cooldown|recovery\b/.test(activityText)) {
    addUnique(items, "open floor space");
    addUnique(items, "mat optional");
  }
  if (/\bbike|treadmill\b/.test(activityText)) {
    addUnique(items, "bike or treadmill");
    addUnique(items, "water bottle");
  }
}

function cleanSentence(value: string | undefined | null) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function sameGuidance(a: string, b: string) {
  const left = normalizeGuidanceForCompare(a);
  const right = normalizeGuidanceForCompare(b);
  return left === right || left.includes(right) || right.includes(left);
}

function normalizeGuidanceForCompare(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sportLoadTagsOnly(tags: string[]) {
  return tags.filter((tag) => tag === "recovery" || tag === "external-load-protected");
}

function shouldHideExecutionEntry(args: { entry: V84DayExecutionPlanEntry; plannedKpis: KPI[]; conflictItems: string[] }) {
  return hasShootingVolumeMismatch(args.conflictItems) && isShootingEntry(args.entry) && plannedKpisIncludeShooting(args.plannedKpis);
}

function isKpiTestingDay(args: { day?: PlanDay; display?: PlanDayDisplayModel; executionEntries?: V84DayExecutionPlanEntry[] }) {
  if (args.display?.displayTags.some((tag) => tag === "Perf Testing") || args.display?.testingEvent === "Perf Testing") return true;
  const dayText = `${args.day?.primarySession || ""} ${args.day?.dayRole || ""} ${(args.day?.tags ?? []).join(" ")}`.toLowerCase();
  if (/\b(kpi baseline|kpi test|performance test|baseline testing|perf testing)\b/.test(dayText)) return true;
  return (args.executionEntries ?? []).some((entry) => {
    const entryText = `${entry.entryType} ${entry.entryTitle} ${entry.sourceBlock} ${entry.appRenderHint}`.toLowerCase();
    return entry.entryType === "KPI" || entry.logType === "kpiLog" || /\b(kpi|baseline testing|performance test|perf testing)\b/.test(entryText);
  });
}

function displayDayTitle(title: string, isKpiDay: boolean) {
  if (!isKpiDay) return title;
  return title
    .replace(/\s*\+\s*controlled shooting\b/i, "")
    .replace(/\s*\+\s*controlled shooting.*$/i, "")
    .trim();
}

function displayShootingDetail(value?: string) {
  if (!value) return "Accuracy and mechanics shooting.";
  return value
    .replace(/\bcontrolled\s+/gi, "")
    .replace(/\bbaseline\b/gi, "test")
    .trim();
}

function displayEntryNote(entry: V84DayExecutionPlanEntry) {
  if (isControlledBikeTreadmillEntry(entry)) return CONTROLLED_CARDIO_COPY;
  if (isShootingEntry(entry)) {
    return entry.notes
      .replace(/100\+?\s+shots?\s+on\s+shooting\s+days;?\s*/i, "")
      .replace(/controlled/gi, "")
      .trim() || "Use clean shooting mechanics and stop if technique breaks.";
  }
  return entry.notes;
}

function userFacingLoadRule(rule: string | undefined, hasSportLoad = false) {
  if (hasSportLoad) return "On camp, lacrosse, or heavy on-ice days, dryland is reduced to mobility, light puck touches, and recovery.";
  return userFacingPlanText(rule || "Follow the planned recovery and training limits.");
}

function userFacingPlanText(text: string) {
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
    .replace(/protection/gi, "recovery")
    .replace(/consolidation/gi, "Deload");
}

function entryTitle(args: { entry: V84DayExecutionPlanEntry; conflictItems: string[] }) {
  if (isEasyConditioningEntry(args.entry)) return "Optional Easy Bike — only if fresh";
  if (hasShootingVolumeMismatch(args.conflictItems) && isShootingEntry(args.entry)) return "50-Shot Target-Hit Test";
  return plainEntryTitle(args.entry.entryTitle);
}

function entryNote(args: { entry: V84DayExecutionPlanEntry; conflictItems: string[] }) {
  if (isEasyConditioningEntry(args.entry)) return CONTROLLED_CARDIO_COPY;
  if (hasShootingVolumeMismatch(args.conflictItems) && isShootingEntry(args.entry)) return "Take 50 shots at targets while fresh. Count target hits. Stop after 50; no extra shooting volume today.";
  return displayEntryNote(args.entry);
}

function entrySubtitle(args: { entry: V84DayExecutionPlanEntry; conflictItems: string[] }) {
  if (isEasyConditioningEntry(args.entry)) return "Recovery conditioning";
  if (hasShootingVolumeMismatch(args.conflictItems) && isShootingEntry(args.entry)) return "Shooting accuracy test";
  return null;
}

function entryLoadImpact(args: { entry: V84DayExecutionPlanEntry; conflictItems: string[] }) {
  if (isEasyConditioningEntry(args.entry)) return "Recovery conditioning";
  if (hasShootingVolumeMismatch(args.conflictItems) && isShootingEntry(args.entry)) return "Shooting accuracy test";
  if (args.entry.loadImpact.toLowerCase() === "skill volume") return "Skill practice";
  return args.entry.loadImpact;
}

function plainEntryTitle(title: string) {
  const labels: Record<string, string> = {
    "WU-10": "Warmup",
    "WUP-10": "Warmup",
    "MOB-15": "Mobility",
    "MOB-20": "Mobility",
    "CD-8": "Cooldown",
    "SKL-HU10": "Head-Up Puck Touches",
    "SHOT-50": "50-Shot Target-Hit Test",
    "SHOT-100": "100-Shot Skill Shooting",
    "SS-A": "Speed Stack A",
    "SS-B": "Speed Stack B",
    "SS-C": "Speed Stack C",
  };
  const matchingCode = Object.keys(labels).find((code) => title === code || title.startsWith(`${code} `) || title.startsWith(`${code}-`) || title.includes(`${code} `));
  return matchingCode ? title.replace(matchingCode, labels[matchingCode]) : title;
}

function hasShootingVolumeMismatch(conflictItems: string[]) {
  return conflictItems.includes("shooting_volume_mismatch");
}

function isShootingEntry(entry: V84DayExecutionPlanEntry) {
  return entry.entryType.toLowerCase().includes("shooting") || entry.entryTitle.toLowerCase().includes("shot");
}

function plannedKpisIncludeShooting(plannedKpis: KPI[]) {
  return plannedKpis.some((kpi) => /50[-\s]?shot|target[-\s]?hit|shooting accuracy|shot accuracy|shooting/i.test(`${kpi.name} ${kpi.category}`));
}

function isEasyConditioningEntry(entry: V84DayExecutionPlanEntry) {
  const text = `${entry.entryType} ${entry.entryTitle} ${entry.notes} ${entry.appRenderHint}`.toLowerCase();
  return text.includes("bike") || text.includes("treadmill") || (entry.entryType.toLowerCase().includes("conditioning") && text.includes("fresh"));
}

function isControlledBikeTreadmillEntry(entry: V84DayExecutionPlanEntry) {
  const title = entry.entryTitle.toLowerCase();
  if (/con-shift|con-rsa|camp provides|short speed primer|walk \+ mob/.test(title)) return false;
  return /\bbike\b|\btreadmill\b|\btread\b|bike-z2|bike-int|speedstack conditioning|bike flush/.test(title);
}

function matchingBlocks(entry: V84DayExecutionPlanEntry, blocks: WorkoutBlock[]) {
  if (isEasyConditioningEntry(entry)) return [];
  return blocks.filter((block) => {
    if (entry.sourceBlock === block.id || entry.entryTitle.includes(block.id)) return true;
    if (entry.logType === "kpiLog") return block.id === "TEST";
    if (entry.entryType.toLowerCase().includes("warmup")) return block.id === "WUP-10" || block.id === "WU-10";
    if (entry.entryType.toLowerCase().includes("conditioning")) return block.id === "SS-A";
    if (entry.entryType.toLowerCase().includes("shooting")) return block.id === "SHOT-50" || block.id === "SHOT-100";
    if (entry.entryType.toLowerCase().includes("recovery")) return block.id === "CD-8" || block.id === "MOB-15";
    return false;
  });
}

function plainBlockName(block: WorkoutBlock) {
  const labels: Record<string, string> = {
    "WUP-10": "Warmup",
    "WU-10": "Warmup",
    TEST: "KPI Testing",
    "SS-A": "Speed Stack A",
    "SS-B": "Speed Stack B",
    "SS-C": "Speed Stack C",
    "SHOT-50": "50-Shot Target-Hit Test",
    "SHOT-100": "100-Shot Skill Shooting",
    "MOB-15": "Mobility",
    "MOB-20": "Mobility",
    "CD-8": "Cooldown",
    "SKL-HU10": "Head-Up Puck Touches",
  };
  return labels[block.id] || block.name;
}

function matchingVideos(entry: V84DayExecutionPlanEntry, videos: VideoReference[]) {
  if (!videos.length) return [];
  const normalized = `${entry.entryTitle} ${entry.entryType} ${entry.sourceBlock}`.toLowerCase();
  return videos.filter((video) => {
    const videoText = `${video.title} ${video.category} ${video.bestUse || ""}`.toLowerCase();
    if (normalized.includes("shot") || normalized.includes("shooting")) return videoText.includes("shoot");
    if (normalized.includes("kpi") || normalized.includes("baseline")) return videoText.includes("kpi") || videoText.includes("sprint") || videoText.includes("agility") || videoText.includes("puck");
    if (normalized.includes("warmup") || normalized.includes("wu-")) return videoText.includes("warm") || videoText.includes("mobility");
    return false;
  });
}
