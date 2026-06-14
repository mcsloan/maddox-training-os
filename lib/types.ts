export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Drill {
  id: string;
  name: string;
  category: string;
  purpose: string;
  setup: string;
  setupChecklist: string[];
  instructions: string[];
  plannedSets: number | null;
  plannedReps: number | null;
  plannedDuration: number | null;
  equipment: string[];
  coachingCues: string[];
  commonMistakes: string[];
  progression: string;
  regression: string;
  safetyNotes: string;
  videoUrl: string | null;
  qrUrl: string | null;
  sourceTag: string;
}

export interface Workout {
  id: string;
  date: string;
  phaseId: string;
  dayFocus: string;
  sessionType: string;
  totalEstimatedMinutes: number;
  warmupDrillIds: string[];
  mainDrillIds: string[];
  kpiTestIds: string[];
  recoveryNotes: string;
  parentCueId: string;
  confidenceCue: string;
  campContext: string;
  intensityLevel: number;
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
  instructions: string[];
  units: string;
  attempts: number;
  scoringMethod: "lowest" | "highest";
  fields: KPIField[];
  coachingNotes: string[];
  safetyNotes: string;
}

export interface Phase {
  id: string;
  name: string;
  goal: string;
  weeks: string;
}

export interface ParentCue {
  id: string;
  cue: string;
}

export interface PlanOverview {
  startDate: string;
  endDate: string;
  primaryGoal: string;
  trainingBias: string[];
  externalLoads: string[];
}

export interface PlanWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  phase: string;
  hardDays: string;
  skillDays: string;
  recoveryDays: string;
  objective: string;
  parentWatchOut: string;
  loadLabel?: string;
  loadLevel?: Rating;
  tags?: string[];
}

export interface PlanDay {
  date: string;
  weekNumber: number;
  phase: string;
  dayRole: string;
  primarySession: string;
  workoutId: string;
  workoutBlockIds: string[];
  dailyMicroSkill: string;
  shootingPuckDetail: string;
  recovery: string;
  durationMinutes: number;
  intensity: number;
  externalLoad: string;
  parentCue: string;
  doNotDo: string;
  recoveryRule: string;
  tags?: string[];
  warnings?: string[];
  externalLoadIds?: string[];
}

export interface TrainingPlan {
  version: string;
  sourceTag: string;
  overview: PlanOverview;
  weeks: PlanWeek[];
  days: PlanDay[];
}

export type ExternalLoadType = "lacrosse" | "hockey_camp" | "on_ice" | "tryout" | "other";

export interface PlannedExternalLoad {
  id: string;
  date: string;
  type: ExternalLoadType;
  title: string;
  provider: string;
  startTime: string;
  endTime: string;
  plannedDurationMinutes: number | null;
  plannedIntensity: Rating;
  notes: string;
  recoveryRule: string;
  doNotDoRule: string;
  trackingQuestions: string[];
}

export interface LoadRule {
  id: string;
  title: string;
  appliesTo: string;
  rules: string[];
  warning: string;
}

export interface WorkoutBlock {
  id: string;
  name: string;
  category: string;
  description: string;
  bestUse: string;
  relatedDrillIds: string[];
}

export interface EquipmentSetup {
  id: string;
  name: string;
  items: string[];
  setupNotes: string;
}

export interface VideoReference {
  id: string;
  title: string;
  category: string;
  url: string;
  drillIds?: string[];
  provider?: string;
  bestUse?: string;
  notes?: string;
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

export interface CompletedSessionSnapshot {
  schemaVersion: number;
  appVersion: string;
  planVersion: string;
  athlete: { id: string; name: string };
  workout: Workout;
  plannedDrills: Drill[];
  completedSession: SessionLog;
  drillLogs: Record<string, ExerciseCompletion>;
  kpiResults: Record<string, KPIResult>;
  readiness: Readiness;
  reflection: Reflection;
  timestamps: {
    sessionDate: string;
    startedAt: string;
    completedAt: string | null;
    snapshotCreatedAt: string;
  };
}
