export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Drill {
  id: string;
  name: string;
  category: string;
  purpose: string;
  setup: string;
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
  status: "active" | "completed";
  readiness: Readiness;
  exercises: Record<string, ExerciseCompletion>;
  reflection: Reflection;
}

export interface KPIAttempt {
  [key: string]: string | number;
}

export interface KPIResult {
  id: string;
  kpiId: string;
  date: string;
  attempts: KPIAttempt[];
  bestResult: number | null;
  notes: string;
}
