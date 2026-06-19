import { dayExecutionPlan, drillCards, exerciseVideoMap, sessions, speedStackPrescriptions } from "./index";
import { V84DayExecutionPlanEntry, V84DrillCard, V84ExerciseVideoMap, V84SessionEntry, V84SpeedStackPrescription } from "./types";
import { Drill, Workout } from "@/lib/types";

export interface V84DrillVideoState {
  primaryVideoUrl: string | null;
  sourcePlaylistUrl: string | null;
  sourceVideoTitle: string | null;
  matchStatus: string;
}

interface SpeedStackSelection {
  phase: string;
  session: string;
  sourceWeek: number;
}

export function getV84SessionById(sessionId: string) {
  return sessions.find((session) => session.sessionId === sessionId) || null;
}

export function getV84SessionByDate(date: string) {
  return sessions.find((session) => session.date === date) || null;
}

export function getV84VideoForDrillId(drillId: string): V84DrillVideoState | null {
  const video = exerciseVideoMap.find((item) => item.canonicalExerciseId === drillId);
  return video ? toVideoState(video) : null;
}

export function getV84SessionDrillCards(sessionId: string) {
  const session = getV84SessionById(sessionId);
  if (!session) return [];
  const selection = getSpeedStackSelection(session);
  if (!selection) return [];
  return drillCards.filter((card) => card.phase === selection.phase && card.session === selection.session);
}

export function getV84SessionDrills(sessionId: string): Drill[] {
  const session = getV84SessionById(sessionId);
  if (!session) return [];
  const speedStackDrills = getV84SessionDrillCards(sessionId).map((card) => toDrill(card, getPrescriptionForCard(session, card)));
  const executionDrills = dayExecutionPlan
    .filter((entry) => entry.date === session.date && entry.logType === "trainingWorkLog" && entry.entryType !== "Speed Stack" && entry.entryType !== "Warmup/Mobility")
    .map(toExecutionDrill);
  return [...speedStackDrills, ...executionDrills];
}

export function getV84SessionWorkout(sessionId: string): Workout | null {
  const session = getV84SessionById(sessionId);
  if (!session) return null;
  const drills = getV84SessionDrills(sessionId);
  return {
    id: session.sessionId,
    date: session.date,
    phaseId: `v8.4-week-${session.week}`,
    dayFocus: session.summary,
    sessionType: session.dayType,
    totalEstimatedMinutes: session.estimatedDurationMin,
    warmupDrillIds: [],
    mainDrillIds: drills.map((drill) => drill.id),
    kpiTestIds: [],
    recoveryNotes: session.speedStackAlignment,
    parentCueId: "",
    confidenceCue: session.trainingPhase,
    campContext: session.speedStackAlignment,
    intensityLevel: session.hasSportLoad ? 4 : 3,
  };
}

function getSpeedStackSelection(session: V84SessionEntry): SpeedStackSelection | null {
  const speedStackEntry = dayExecutionPlan.find((entry) => entry.date === session.date && entry.entryType === "Speed Stack");
  const sourceBlock = speedStackEntry?.sourceBlock || "";
  const match = sourceBlock.match(/^SS-([A-Z])-P(\d+)W\d+$/);
  if (!match) return null;
  const sourceWeek = Number(sourceBlock.match(/W(\d+)$/)?.[1]);
  return {
    phase: `Phase ${match[2]}`,
    session: match[1],
    sourceWeek,
  };
}

function getPrescriptionForCard(session: V84SessionEntry, card: V84DrillCard) {
  const selection = getSpeedStackSelection(session);
  if (!selection) return null;
  return speedStackPrescriptions.find((prescription) =>
    prescription.phase === card.phase
    && prescription.session === card.session
    && prescription.code === card.code
    && prescription.sourceWeek === selection.sourceWeek
  ) || null;
}

function toDrill(card: V84DrillCard, prescription: V84SpeedStackPrescription | null): Drill {
  const parsed = parseSetsAndReps(prescription?.setsXReps || "");
  return {
    id: card.drillId,
    name: card.exercise,
    category: card.category,
    purpose: `${prescription?.group || `${card.phase} · Session ${card.session}`} · ${card.code}`,
    setup: `${prescription?.sourceDocument || "OSD25 Full BW"} · ${prescription?.sourceSection || `${card.phase} Speed Stack ${card.session}`}`,
    setupChecklist: [`Source: ${prescription?.sourcePage || card.sourcePage}`, `Code: ${card.code}`, `Video: ${card.matchStatus}`],
    instructions: dedupe([prescription?.coachingNotes, cleanDrillNote(card.notes)]),
    plannedSets: parsed.sets,
    plannedReps: parsed.reps,
    plannedDuration: parsed.duration,
    plannedPrescription: prescription?.setsXReps || undefined,
    plannedRest: prescription?.rest || undefined,
    plannedTempo: prescription?.tempo && prescription.tempo !== "N/A" ? prescription.tempo : undefined,
    plannedGroup: prescription?.group || undefined,
    sourceCode: card.code,
    sourcePage: prescription?.sourcePage || card.sourcePage,
    equipment: inferEquipment(card.exercise),
    coachingCues: dedupe([prescription?.coachingNotes, cleanDrillNote(card.notes)]),
    commonMistakes: [],
    progression: "",
    regression: "",
    safetyNotes: "Keep movement clean and stop if pain or technique breakdown appears.",
    videoUrl: getV84VideoForDrillId(card.drillId)?.primaryVideoUrl ?? null,
    qrUrl: null,
    sourceTag: "v8.4-drill-card",
  };
}

function toExecutionDrill(entry: V84DayExecutionPlanEntry): Drill {
  const isShooting = entry.appRenderHint === "shot-counter" || /shoot|shot/i.test(`${entry.entryType} ${entry.entryTitle}`);
  const plannedShots = Number(entry.entryTitle.match(/SHOT-(\d+)/)?.[1]) || null;
  return {
    id: `v84-${entry.date}-step-${entry.sequence}-${slugify(entry.entryTitle)}`,
    name: executionDrillName(entry),
    category: entry.entryType,
    purpose: `${entry.requiredOptional} · ${entry.loadImpact}`,
    setup: `${entry.sourceBlock} · ${entry.appRenderHint}`,
    setupChecklist: [`Source: ${entry.sourceBlock}`, `Plan step: ${entry.sequence}`, `Log type: ${entry.logType}`],
    instructions: executionInstructions(entry),
    plannedSets: null,
    plannedReps: plannedShots,
    plannedDuration: entry.plannedDurationMin ? entry.plannedDurationMin * 60 : null,
    plannedPrescription: plannedShots ? `${plannedShots} shots` : entry.plannedDurationMin ? `${entry.plannedDurationMin} min` : undefined,
    plannedRest: isShooting ? "Reset between shots; rest as needed for clean mechanics" : undefined,
    plannedTempo: undefined,
    plannedGroup: "Daily execution",
    sourceCode: entry.entryTitle,
    sourcePage: entry.sourceBlock,
    equipment: isShooting ? ["stick", "pucks", "net or target", "shooting pad if available"] : inferEquipment(`${entry.entryType} ${entry.entryTitle} ${entry.notes}`),
    coachingCues: executionCues(entry),
    commonMistakes: isShooting ? ["Rushing shots", "Shooting through tired mechanics", "Forgetting to count target hits when tracking accuracy"] : [],
    progression: "",
    regression: "",
    safetyNotes: isShooting ? "Only shoot into a safe target area. Stop for pain, unsafe setup, or mechanics falling apart." : "Stop for pain or technique breakdown.",
    videoUrl: null,
    qrUrl: null,
    sourceTag: "v8.4-day-execution",
  };
}

function parseSetsAndReps(value: string) {
  const match = value.match(/^(\d+)\s*x\s*(.+)$/i);
  if (!match) return { sets: null, reps: null, duration: null };
  const detail = match[2];
  const duration = Number(detail.match(/(\d+)\s*s/)?.[1]) || null;
  const reps = duration ? null : Number(detail.match(/(\d+)/)?.[1]) || null;
  return { sets: Number(match[1]), reps, duration };
}

function executionDrillName(entry: V84DayExecutionPlanEntry) {
  if (entry.entryTitle === "SHOT-100") return "100-Shot Skill Shooting";
  if (entry.entryTitle === "MOB-15") return "Recovery Mobility";
  if (entry.entryTitle === "MOB-20") return "Recovery Mobility";
  if (entry.entryTitle.includes("BIKE")) return "Easy Bike or Walk";
  return entry.entryTitle;
}

function executionInstructions(entry: V84DayExecutionPlanEntry) {
  const instructions = [entry.notes];
  if (entry.appRenderHint === "shot-counter" || /shoot|shot/i.test(`${entry.entryType} ${entry.entryTitle}`)) {
    instructions.push("Log shots taken in Actual reps. If target hits are tracked, write target hits in Quick note.");
  }
  if (entry.entryType === "Skill/IQ") {
    instructions.push("Use Quick note for puck confidence, stickhandling, scanning, or daily IQ notes actually completed.");
  }
  return dedupe(instructions);
}

function executionCues(entry: V84DayExecutionPlanEntry) {
  if (entry.appRenderHint === "shot-counter" || /shoot|shot/i.test(`${entry.entryType} ${entry.entryTitle}`)) {
    return ["Call the target", "Reset between shots", "Clean mechanics first"];
  }
  return [];
}

function inferEquipment(text: string) {
  const normalized = text.toLowerCase();
  const equipment: string[] = [];
  if (/shoot|shot|puck|stick/i.test(normalized)) equipment.push("stick", "pucks or ball");
  if (/shoot|shot|target/i.test(normalized)) equipment.push("net or target", "shooting pad if available");
  if (/bike/i.test(normalized)) equipment.push("bike");
  if (/walk|mob|recovery|iq|reflection/i.test(normalized)) equipment.push("open floor space");
  return equipment;
}

function cleanDrillNote(value: string) {
  return value.replace(/\s*\|\s*Video v[\d.]+:.*$/i, "").trim();
}

function dedupe(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "entry";
}

function toVideoState(video: V84ExerciseVideoMap): V84DrillVideoState {
  return {
    primaryVideoUrl: video.primaryVideoUrl,
    sourcePlaylistUrl: video.sourcePlaylistUrl,
    sourceVideoTitle: video.sourceVideoTitle,
    matchStatus: video.matchStatus,
  };
}
