export interface V84ManifestFile {
  file: string;
  recordCount: number;
  sha256: string;
}

export interface V84Manifest {
  packageName: string;
  packageVersion: string;
  sourceWorkbook: string;
  sourceWorkbookSha256: string;
  generatedAt: string;
  files: V84ManifestFile[];
  importOrder: string[];
  lockedRules: string[];
}

export interface V84ImportQaReport {
  packageVersion: string;
  sourceWorkbook: string;
  generatedAt: string;
  recordCounts: Record<string, number>;
  videoStatusCounts: Record<string, number>;
  needsReviewRows: number;
  guardrails: string[];
}

export type V84SourceOfTruthLock = Array<Record<string, string>>;

export interface V84DayExecutionPlanEntry {
  date: string;
  week: number;
  day: string;
  sequence: number;
  entryType: string;
  entryTitle: string;
  sourceBlock: string;
  plannedDurationMin: number | null;
  logType: string;
  requiredOptional: string;
  loadImpact: string;
  notes: string;
  appRenderHint: string;
}

export interface V84SessionEntry {
  sessionId: string;
  date: string;
  week: number;
  day: string;
  dayType: string;
  trainingPhase: string;
  speedStackAlignment: string;
  sportLoad: string | null;
  hasSportLoad: boolean;
  hasTrainingWork: boolean;
  sequenceCount: number;
  estimatedDurationMin: number;
  summary: string;
  sourceTable: string;
  implementationStatus: string;
}

export interface V84DrillCard {
  drillId: string;
  exercise: string;
  category: string;
  phase: string;
  session: string;
  code: string;
  sourcePage: string;
  primaryVideoUrl: string | null;
  matchStatus: string;
  logFields: string;
  notes: string;
  secondaryVideoUrls: string[];
  videoReviewStatus: string | null;
  lastReviewedVersion: string | null;
  urlType: string;
  matchConfidence: string;
}

export interface V84SpeedStackPrescription {
  phase: string;
  session: string;
  code: string;
  exercise: string;
  sourceWeek: number;
  tempo: string;
  setsXReps: string;
  rest: string;
  group: string;
  coachingNotes: string;
  sourceDocument: string;
  sourcePage: string;
  sourceSection: string;
  extractionStatus: string;
}

export interface V84ExerciseVideoMap {
  canonicalExerciseId: string;
  exerciseName: string;
  exerciseCategory: string;
  sourceFamily: string;
  sourceDocument: string;
  sourcePageOrSection: string;
  sourcePlaylistUrl: string | null;
  sourceVideoTitle: string | null;
  primaryVideoUrl: string | null;
  urlType: string;
  matchStatus: string;
  matchConfidence: string;
  reviewRequired: boolean;
  matchNotes: string;
  humanReviewStatus: string | null;
  secondaryVideoUrls: string[];
  humanReviewComment: string | null;
  lastReviewedVersion: string | null;
}

export interface V84Kpi {
  kpiId: string;
  metric: string;
  category: string;
  purpose: string;
  baselineDate: string | null;
  retestTiming: string;
  targetImprovement: string;
  motivationalCue: string;
  plannedValue: number | null;
  actualBaseline: number | null;
  actualLatest: number | null;
  trend: string | null;
  appInputType: string;
  dashboardUse: string;
}

export interface V84KpiProtocol {
  testID: string;
  test: string;
  purpose: string;
  equipment: string;
  setup: string;
  executionInstructions: string[];
  scoring: string;
  attemptsRest: string;
  passStandard: string;
  commonMistakes: string[];
  appLoggingFields: string[];
  videoStatus: string;
  notes: string;
}

export interface V84SportLoad {
  date: string;
  week: number;
  day: string;
  sportLoad: string;
  details: string;
  intensity15: number;
  planRule: string;
}

export interface V84PhaseMapEntry {
  week: number;
  start: string;
  end: string;
  trainingPhase: string;
  speedStackAlignment: string;
  intent: string;
}

export interface V84PhaseLabelEntry {
  week: number;
  start: string;
  end: string;
  canonicalPhaseLabel: string;
  shortGanttLabel: string;
  dashboardMonthlyLabel: string;
  appLabel: string;
  notes: string;
}

export interface V84GanttLane {
  lane: string;
  weekCells: Array<{
    week: string;
    label: string;
  }>;
}

export interface V84GanttModel {
  sourceSheet: string;
  lockedVersion: string;
  rule: string;
  weeks: string[];
  lanes: V84GanttLane[];
}

export interface V84HockeyIqConcept {
  conceptID: string;
  concept: string;
  purpose: string;
  frequency: string;
  execution: string;
  appPrompt: string;
  parentCue: string;
  logInputs: string;
  notes: string;
}

export interface V84LogSchemas {
  version: string;
  sessionCompletion: {
    fields: string[];
    completionStatusValues: string[];
  };
  trainingWorkLog: {
    fields: string[];
  };
  sportLoadLog: {
    fields: string[];
  };
  readinessLog: {
    fields: string[];
  };
  shotCounterLog: {
    fields: string[];
  };
  kpiLog: {
    fields: string[];
  };
  reflectionLog: {
    fields: string[];
  };
}

export interface V84ValidationIssue {
  file: string;
  message: string;
}
