import { dayExecutionPlan, drillCards, exerciseVideoMap, sessions } from "./index";
import { V84DrillCard, V84ExerciseVideoMap, V84SessionEntry } from "./types";
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
}

export function getV84SessionById(sessionId: string) {
  return sessions.find((session) => session.sessionId === sessionId) || null;
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
  return getV84SessionDrillCards(sessionId).map(toDrill);
}

export function getV84SessionWorkout(sessionId: string): Workout | null {
  const session = getV84SessionById(sessionId);
  if (!session) return null;
  const drills = getV84SessionDrillCards(sessionId);
  return {
    id: session.sessionId,
    date: session.date,
    phaseId: `v8.4-week-${session.week}`,
    dayFocus: session.summary,
    sessionType: session.dayType,
    totalEstimatedMinutes: session.estimatedDurationMin,
    warmupDrillIds: [],
    mainDrillIds: drills.map((drill) => drill.drillId),
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
  return {
    phase: `Phase ${match[2]}`,
    session: match[1],
  };
}

function toDrill(card: V84DrillCard): Drill {
  return {
    id: card.drillId,
    name: card.exercise,
    category: card.category,
    purpose: `${card.phase} · Session ${card.session} · ${card.code}`,
    setup: `${card.sourcePage} · ${card.matchStatus}`,
    setupChecklist: [`Source: ${card.sourcePage}`, `Code: ${card.code}`],
    instructions: card.notes ? [card.notes] : [],
    plannedSets: null,
    plannedReps: null,
    plannedDuration: null,
    equipment: [],
    coachingCues: [],
    commonMistakes: [],
    progression: "",
    regression: "",
    safetyNotes: "",
    videoUrl: getV84VideoForDrillId(card.drillId)?.primaryVideoUrl ?? null,
    qrUrl: null,
    sourceTag: "v8.4-drill-card",
  };
}

function toVideoState(video: V84ExerciseVideoMap): V84DrillVideoState {
  return {
    primaryVideoUrl: video.primaryVideoUrl,
    sourcePlaylistUrl: video.sourcePlaylistUrl,
    sourceVideoTitle: video.sourceVideoTitle,
    matchStatus: video.matchStatus,
  };
}
