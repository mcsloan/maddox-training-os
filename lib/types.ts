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
  plannedPrescription?: string;
  plannedRest?: string;
  plannedTempo?: string;
  plannedGroup?: string;
  sourceCode?: string;
  sourcePage?: string;
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
  targetValue?: number;
  targetLabel?: string;
  motivationalCue?: string;
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

export interface WeekPlanSummary {
  trainingDays: number;
  externalLoadDays: number;
  kpiDays: number;
  recoveryProtectedDays: number;
  highLoadDays: number;
  loadLevel: Rating;
  loadEmphasis: string;
}

export interface PlanDayDisplayModel {
  methodologyPhase: "Foundation + Acceleration" | "Speed + Power" | "Deload" | "Game-Speed + Reactive Agility" | "Training Camp / Tryout Simulation" | "Taper + Peak";
  sportLoads: Array<"On-Ice" | "Camp" | "Lacrosse">;
  loadRule: "Recovery" | "Deload" | null;
  testingEvent: "Perf Testing" | null;
  displayTags: string[];
}

export interface PlanDay {
  date: string;
  weekNumber: number;
  phase: string;
  dayRole: string;
  primarySession: string;
  workoutId?: string;
  workoutBlockIds: string[];
  kpiTestIds?: string[];
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

export type ExternalLoadType = "lacrosse_practice" | "lacrosse_game" | "lacrosse_playoff" | "hockey_camp" | "on_ice" | "on_ice_4v4" | "tryout" | "other";

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

export interface ExternalLoadLog {
  id: string;
  athleteId: string;
  externalLoadId: string;
  date: string;
  title: string;
  type: ExternalLoadType;
  provider: string;
  plannedDuration: number | null;
  actualDuration: number | null;
  plannedIntensity: Rating;
  attended: boolean;
  effort: Rating | null;
  energyAfter: Rating | null;
  confidence: Rating | null;
  difficulty: Rating | null;
  soreness: 0 | Rating;
  painFlag: boolean;
  whatWentWell: string;
  whatToAdjust: string;
  parentNotes: string;
  recoveryCompleted: boolean;
  skillRecoveryWork?: {
    headUpPuckTouchesCompleted: boolean;
    headUpPuckTouchesMinutes: number | null;
    accuracyShootingCompleted: boolean;
    shotsTaken: number | null;
    targetHits: number | null;
    cooldownBikeCompleted: boolean;
    cooldownBikeMinutes: number | null;
    bikeIntensity: "easy" | "moderate";
    recoveryMobilityCompleted: boolean;
    recoveryMobilityMinutes: number | null;
  };
  campReflection?: {
    competeLevel: Rating | null;
    skatingPace: Rating | null;
    puckConfidence: Rating | null;
    communication: Rating | null;
    attackedOrPassive: string;
  };
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  appVersion: string;
  planVersion: string;
  source: "external_load";
}

export interface ExternalLoadSnapshot {
  kind: "external_load";
  externalLoadLog: ExternalLoadLog;
  plannedExternalLoad: PlannedExternalLoad;
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

export interface TrainingWorkLog {
  id: string;
  date: string;
  workoutId: string | null;
  title: string;
  plannedBlockIds: string[];
  plannedDurationMinutes: number | null;
  completed: boolean;
  actualDuration: number | null;
  effort: Rating | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  source: "training_work";
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
  restingHeartRate?: number | null;
  sleepHours?: number | null;
  notes?: string;
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

export interface StandaloneKPIResultSnapshot {
  kind: "standalone_kpi_result";
  kpiId: string;
  date: string;
  enteredAt?: string;
  bestResult: number | null;
  attempts: KPIAttempt[];
  notes: string;
  source: "kpi_page";
  kpiResult: KPIResult;
}

export interface StandaloneKPIResultDeletedSnapshot {
  kind: "standalone_kpi_result_deleted";
  deletedResultId: string;
  deletedAt: string;
  reason: "user_deleted";
  source: "kpi_page";
  athleteId: string;
  schemaVersion: number;
  appVersion: string;
  planVersion: string;
  deviceId: string;
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
