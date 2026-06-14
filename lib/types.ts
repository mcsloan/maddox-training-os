export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Drill {
  id: string;
  name: string;
  category: string;
  purpose: string;
  setupChecklist: string[];
  stepByStepInstructions: string[];
  plannedSets: number | null;
  plannedReps: number | null;
  plannedDuration: number | null;
  plannedRest: number | null;
  equipment: string[];
  coachingCues: string[];
  commonMistakes: string[];
  progression: string;
  regression: string;
  safetyNotes: string;
  videoUrl: string | null;
  videoTitle: string;
  qrUrl: string | null;
  sourceTag: string;
}

export interface Workout {
  id: string;
  date: string;
  weekNumber: number;
  phaseId: string;
  dayFocus: string;
  sessionType: string;
  totalEstimatedMinutes: number;
  warmupDrillIds: string[];
  mainDrillIds: string[];
  kpiTestIds: string[];
  iqHabitIds: string[];
  recoveryNotes: string;
  parentCueId: string;
  confidenceCue: string;
  campContext: string;
  intensityLevel: number;
  sourceTag: string;
}

export interface KPIField {
  id: string;
  label: string;
  type: "number" | "text";
  unit?: string;
}

export interface KPI {
  id: string;
  name: string;
  category: string;
  purpose: string;
  instructions: string[];
  setup: string;
  units: string;
  attempts: number;
  scoringMethod: "lowest" | "highest";
  bestResultLogic: string;
  trendDirectionLogic: string;
  fields: KPIField[];
  coachingNotes: string[];
  safetyNotes: string;
  sourceTag: string;
}

export interface Phase {
  id: string;
  name: string;
  dateRange: string;
  purpose: string;
  primaryGoals: string[];
  trainingEmphasis: string[];
  intensityGuidance: string;
  recoveryGuidance: string;
  parentFocus: string;
  playerIdentityCue: string;
  sourceTag: string;
}

export interface ParentCue {
  id: string;
  situation: string;
  sayThis: string;
  avoidSaying: string;
  purpose: string;
  confidenceGoal: string;
  sourceTag: string;
}

export interface HockeyIqHabit {
  id: string;
  name: string;
  category: string;
  simpleDefinition: string;
  whyItMatters: string;
  whatMaddoxShouldDo: string;
  practiceCue: string;
  gameCue: string;
  parentObservationCue: string;
  reflectionQuestion: string;
  sourceTag: string;
}

export interface CampRule {
  id: string;
  name: string;
  dateRange: string;
  context: string;
  do: string[];
  doNot: string[];
  trainingAdjustment: string;
  recoveryPriority: string;
  hydrationNotes: string;
  nutritionNotes: string;
  sleepNotes: string;
  parentCue: string;
  sourceTag: string;
}

export interface TrainingVideo {
  id: string;
  title: string;
  category: string;
  url: string;
  provider: string;
  relatedDrillIds: string[];
  relatedKpiIds: string[];
  qrUrl: string;
  sourceTag: string;
  notes: string;
}

export interface ExerciseCompletion {
  drillId: string;
  done: boolean;
  actualSets: number | null;
  actualReps: number | null;
  actualDuration: number | null;
  actualDistance: number | null;
  notes: string;
  difficulty: Rating | null;
}

export interface Reflection {
  energy: Rating | null;
  confidence: Rating | null;
  difficulty: Rating | null;
  improvement: string;
  notes: string;
}

export interface Readiness {
  energy: Rating | null;
  soreness: Rating | null;
  focus: Rating | null;
}

export interface SessionLog {
  id: string;
  workoutId: string;
  date: string;
  startedAt: string;
  completedAt: string | null;
  currentStep: number;
  status: "in-progress" | "completed" | "reopened";
  readiness: Readiness;
  exercises: Record<string, ExerciseCompletion>;
  kpiResults: Record<string, KPIResult>;
  reflection: Reflection;
}

export interface KPIAttempt {
  [key: string]: string | number;
}

export interface KPIResult {
  id: string;
  kpiId: string;
  date: string;
  enteredAt?: string;
  attempts: KPIAttempt[];
  bestResult: number | null;
  notes: string;
}
