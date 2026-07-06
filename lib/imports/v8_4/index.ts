import dayExecutionPlanJson from "../../../imports/v8.4/data/dayExecutionPlan.json";
import drillCardsJson from "../../../imports/v8.4/data/drillCards.json";
import exerciseVideoMapJson from "../../../imports/v8.4/data/exerciseVideoMap.json";
import ganttModelJson from "../../../imports/v8.4/data/ganttModel.json";
import hockeyIqJson from "../../../imports/v8.4/data/hockeyIq.json";
import importQaReportJson from "../../../imports/v8.4/data/importQaReport.json";
import kpiProtocolsJson from "../../../imports/v8.4/data/kpiProtocols.json";
import kpisJson from "../../../imports/v8.4/data/kpis.json";
import logSchemasJson from "../../../imports/v8.4/data/logSchemas.json";
import needsReviewJson from "../../../imports/v8.4/data/needsReview.json";
import phaseLabelsJson from "../../../imports/v8.4/data/phaseLabels.json";
import phaseMapJson from "../../../imports/v8.4/data/phaseMap.json";
import sessionsJson from "../../../imports/v8.4/data/sessions.json";
import sportLoadsJson from "../../../imports/v8.4/data/sportLoads.json";
import sourceOfTruthLockJson from "../../../imports/v8.4/data/sourceOfTruthLock.json";
import speedStackPrescriptionsJson from "../../../imports/v8.4/data/speedStackPrescriptions.json";
import manifestJson from "../../../imports/v8.4/manifest.json";
import {
  V84DayExecutionPlanEntry,
  V84DrillCard,
  V84ExerciseVideoMap,
  V84GanttModel,
  V84HockeyIqConcept,
  V84ImportQaReport,
  V84Kpi,
  V84KpiProtocol,
  V84LogSchemas,
  V84Manifest,
  V84PhaseLabelEntry,
  V84PhaseMapEntry,
  V84SessionEntry,
  V84SourceOfTruthLock,
  V84SpeedStackPrescription,
  V84SportLoad,
  V84ValidationIssue,
} from "./types";

export const manifest = manifestJson as V84Manifest;
export const importQaReport = importQaReportJson as V84ImportQaReport;
export const sourceOfTruthLock = sourceOfTruthLockJson as V84SourceOfTruthLock;

export const dayExecutionPlan = normalizeDayExecutionPlan(dayExecutionPlanJson as Array<Record<string, unknown>>);
export const sessions = normalizeSessions(sessionsJson as Array<Record<string, unknown>>);
export const drillCards = normalizeDrillCards(drillCardsJson as Array<Record<string, unknown>>);
export const speedStackPrescriptions = normalizeSpeedStackPrescriptions(speedStackPrescriptionsJson as Array<Record<string, unknown>>);
export const exerciseVideoMap = normalizeExerciseVideoMap(exerciseVideoMapJson as Array<Record<string, unknown>>);
export const kpis = normalizeKpis(kpisJson as Array<Record<string, unknown>>);
export const kpiProtocols = normalizeKpiProtocols(kpiProtocolsJson as Array<Record<string, unknown>>);
export const sportLoads = normalizeSportLoads(sportLoadsJson as Array<Record<string, unknown>>);
export const phaseMap = phaseMapJson as V84PhaseMapEntry[];
export const phaseLabels = phaseLabelsJson as V84PhaseLabelEntry[];
export const ganttModel = ganttModelJson as V84GanttModel;
export const hockeyIq = hockeyIqJson as V84HockeyIqConcept[];
export const logSchemas = logSchemasJson as V84LogSchemas;
export const needsReview = normalizeNeedsReview(needsReviewJson as Array<Record<string, unknown>>);

function toNullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["yes", "true", "1"].includes(value.toLowerCase());
  return false;
}

function ensureRecord(name: string, value: Record<string, unknown>, keys: string[]) {
  const missing = keys.filter((key) => !(key in value));
  if (missing.length && process.env.NODE_ENV !== "production") {
    throw new Error(`[v8.4 import] ${name} is missing keys: ${missing.join(", ")}`);
  }
}

function normalizeDayExecutionPlan(records: Array<Record<string, unknown>>): V84DayExecutionPlanEntry[] {
  return records.map((record, index) => {
    ensureRecord(`dayExecutionPlan[${index}]`, record, ["date", "week", "day", "sequence", "entryType", "entryTitle", "sourceBlock", "plannedDurationMin", "logType", "requiredOptional", "loadImpact", "notes", "appRenderHint"]);
    return {
      date: String(record.date),
      week: Number(record.week),
      day: String(record.day),
      sequence: Number(record.sequence),
      entryType: String(record.entryType),
      entryTitle: String(record.entryTitle),
      sourceBlock: String(record.sourceBlock),
      plannedDurationMin: toNullableNumber(record.plannedDurationMin),
      logType: String(record.logType),
      requiredOptional: String(record.requiredOptional),
      loadImpact: String(record.loadImpact),
      notes: String(record.notes),
      appRenderHint: String(record.appRenderHint),
    };
  });
}

function normalizeSessions(records: Array<Record<string, unknown>>): V84SessionEntry[] {
  return records.map((record, index) => {
    ensureRecord(`sessions[${index}]`, record, ["sessionId", "date", "week", "day", "dayType", "trainingPhase", "speedStackAlignment", "sportLoad", "hasSportLoad", "hasTrainingWork", "sequenceCount", "estimatedDurationMin", "summary", "sourceTable", "implementationStatus"]);
    return {
      sessionId: String(record.sessionId),
      date: String(record.date),
      week: Number(record.week),
      day: String(record.day),
      dayType: String(record.dayType),
      trainingPhase: String(record.trainingPhase),
      speedStackAlignment: String(record.speedStackAlignment),
      sportLoad: toNullableString(record.sportLoad),
      hasSportLoad: toBoolean(record.hasSportLoad),
      hasTrainingWork: toBoolean(record.hasTrainingWork),
      sequenceCount: Number(record.sequenceCount),
      estimatedDurationMin: Number(record.estimatedDurationMin),
      summary: String(record.summary),
      sourceTable: String(record.sourceTable),
      implementationStatus: String(record.implementationStatus),
    };
  });
}

function normalizeDrillCards(records: Array<Record<string, unknown>>): V84DrillCard[] {
  return records.map((record, index) => {
    ensureRecord(`drillCards[${index}]`, record, ["drillId", "exercise", "category", "phase", "session", "code", "sourcePage", "primaryVideoUrl", "matchStatus", "logFields", "notes", "urlType", "matchConfidence"]);
    return {
      drillId: String(record.drillId),
      exercise: String(record.exercise),
      category: String(record.category),
      phase: String(record.phase),
      session: String(record.session),
      code: String(record.code),
      sourcePage: String(record.sourcePage),
      primaryVideoUrl: toNullableString(record.primaryVideoUrl),
      matchStatus: String(record.matchStatus),
      logFields: String(record.logFields),
      notes: String(record.notes),
      secondaryVideoUrls: toStringArray(record.secondaryVideoUrls),
      videoReviewStatus: toNullableString(record.videoReviewStatus),
      lastReviewedVersion: toNullableString(record.lastReviewedVersion),
      urlType: String(record.urlType),
      matchConfidence: String(record.matchConfidence),
    };
  });
}

function normalizeSpeedStackPrescriptions(records: Array<Record<string, unknown>>): V84SpeedStackPrescription[] {
  return records.map((record, index) => {
    ensureRecord(`speedStackPrescriptions[${index}]`, record, ["phase", "session", "code", "exercise", "sourceWeek", "tempo", "setsXReps", "rest", "group", "coachingNotes", "sourceDocument", "sourcePage", "sourceSection", "extractionStatus"]);
    return {
      phase: String(record.phase),
      session: String(record.session),
      code: String(record.code),
      exercise: String(record.exercise),
      sourceWeek: Number(record.sourceWeek),
      tempo: String(record.tempo),
      setsXReps: String(record.setsXReps),
      rest: String(record.rest),
      group: String(record.group),
      coachingNotes: String(record.coachingNotes),
      sourceDocument: String(record.sourceDocument),
      sourcePage: String(record.sourcePage),
      sourceSection: String(record.sourceSection),
      extractionStatus: String(record.extractionStatus),
    };
  });
}

function normalizeExerciseVideoMap(records: Array<Record<string, unknown>>): V84ExerciseVideoMap[] {
  return records.map((record, index) => {
    ensureRecord(`exerciseVideoMap[${index}]`, record, ["canonicalExerciseId", "exerciseName", "exerciseCategory", "sourceFamily", "sourceDocument", "sourcePageOrSection", "sourcePlaylistUrl", "sourceVideoTitle", "primaryVideoUrl", "urlType", "matchStatus", "matchConfidence", "reviewRequired", "matchNotes", "humanReviewStatus", "secondaryVideoUrls", "lastReviewedVersion"]);
    return {
      canonicalExerciseId: String(record.canonicalExerciseId),
      exerciseName: String(record.exerciseName),
      exerciseCategory: String(record.exerciseCategory),
      sourceFamily: String(record.sourceFamily),
      sourceDocument: String(record.sourceDocument),
      sourcePageOrSection: String(record.sourcePageOrSection),
      sourcePlaylistUrl: toNullableString(record.sourcePlaylistUrl),
      sourceVideoTitle: toNullableString(record.sourceVideoTitle),
      primaryVideoUrl: toNullableString(record.primaryVideoUrl),
      urlType: String(record.urlType),
      matchStatus: String(record.matchStatus),
      matchConfidence: String(record.matchConfidence),
      reviewRequired: toBoolean(record.reviewRequired),
      matchNotes: String(record.matchNotes),
      humanReviewStatus: toNullableString(record.humanReviewStatus),
      secondaryVideoUrls: toStringArray(record.secondaryVideoUrls),
      humanReviewComment: toNullableString(record.humanReviewComment),
      lastReviewedVersion: toNullableString(record.lastReviewedVersion),
    };
  });
}

function normalizeKpis(records: Array<Record<string, unknown>>): V84Kpi[] {
  return records.map((record, index) => {
    ensureRecord(`kpis[${index}]`, record, ["kPIID", "metric", "category", "purpose", "baselineDate", "retestTiming", "targetImprovement", "motivationalCue", "plannedValue", "actualBaseline", "actualLatest", "trend", "appInputType", "dashboardUse"]);
    return {
      kpiId: String(record.kPIID),
      metric: String(record.metric),
      category: String(record.category),
      purpose: String(record.purpose),
      baselineDate: toNullableString(record.baselineDate),
      retestTiming: String(record.retestTiming),
      targetImprovement: String(record.targetImprovement),
      motivationalCue: String(record.motivationalCue),
      plannedValue: toNullableNumber(record.plannedValue),
      actualBaseline: toNullableNumber(record.actualBaseline),
      actualLatest: toNullableNumber(record.actualLatest),
      trend: toNullableString(record.trend),
      appInputType: String(record.appInputType),
      dashboardUse: String(record.dashboardUse),
    };
  });
}

function normalizeKpiProtocols(records: Array<Record<string, unknown>>): V84KpiProtocol[] {
  return records.map((record, index) => {
    ensureRecord(`kpiProtocols[${index}]`, record, ["testID", "test", "purpose", "equipment", "setup", "executionInstructions", "scoring", "attemptsRest", "passStandard", "commonMistakes", "appLoggingFields", "videoStatus", "notes"]);
    return {
      testID: String(record.testID),
      test: String(record.test),
      purpose: String(record.purpose),
      equipment: String(record.equipment),
      setup: String(record.setup),
      executionInstructions: toStringArray(record.executionInstructions),
      scoring: String(record.scoring),
      attemptsRest: String(record.attemptsRest),
      passStandard: String(record.passStandard),
      commonMistakes: toStringArray(record.commonMistakes),
      appLoggingFields: toStringArray(record.appLoggingFields),
      videoStatus: String(record.videoStatus),
      notes: String(record.notes),
    };
  });
}

function normalizeSportLoads(records: Array<Record<string, unknown>>): V84SportLoad[] {
  return records.map((record, index) => {
    ensureRecord(`sportLoads[${index}]`, record, ["date", "week", "day", "sportLoad", "details", "intensity15", "planRule"]);
    return {
      date: String(record.date),
      week: Number(record.week),
      day: String(record.day),
      sportLoad: String(record.sportLoad),
      details: String(record.details),
      intensity15: Number(record.intensity15),
      planRule: String(record.planRule),
    };
  });
}

function normalizeNeedsReview(records: Array<Record<string, unknown>>) {
  return records.filter((record) => String(record.canonicalExerciseId || "") !== "NO_REMAINING_REVIEW_ROWS");
}

export function validateV84ImportPackage({ strict = true }: { strict?: boolean } = {}) {
  const issues: V84ValidationIssue[] = [];
  if (!ganttModel || ganttModel.weeks.length !== 12 || ganttModel.lanes.length !== 17) {
    issues.push({ file: "data/ganttModel.json", message: "Locked Gantt model is missing required weeks or lanes." });
  }

  if (exerciseVideoMap.length !== 154) {
    issues.push({ file: "data/exerciseVideoMap.json", message: "Video map should contain 154 records." });
  }

  if (dayExecutionPlan.length !== 630) {
    issues.push({ file: "data/dayExecutionPlan.json", message: "Day execution plan should contain 630 records." });
  }

  if (needsReview.length !== 0) {
    issues.push({ file: "data/needsReview.json", message: "needsReview should contain 0 records." });
  }

  if (sessions.length !== 84) {
    issues.push({ file: "data/sessions.json", message: "Sessions should contain 84 records." });
  }

  if (drillCards.length !== 154) {
    issues.push({ file: "data/drillCards.json", message: "Drill cards should contain 154 records." });
  }

  if (speedStackPrescriptions.length !== 616) {
    issues.push({ file: "data/speedStackPrescriptions.json", message: "Speed Stack prescriptions should contain 616 records." });
  }

  if (kpis.length !== 7) {
    issues.push({ file: "data/kpis.json", message: "KPIs should contain 7 records." });
  }

  if (kpiProtocols.length !== 6) {
    issues.push({ file: "data/kpiProtocols.json", message: "KPI protocols should contain 6 records." });
  }

  if (sportLoads.length !== 37) {
    issues.push({ file: "data/sportLoads.json", message: "Sport loads should contain 37 records." });
  }

  if (phaseMap.length !== 12 || phaseLabels.length !== 12) {
    issues.push({ file: "data/phaseMap.json", message: "Phase map and labels should contain 12 records each." });
  }

  if (hockeyIq.length !== 6) {
    issues.push({ file: "data/hockeyIq.json", message: "Hockey IQ should contain 6 records." });
  }

  if (Object.keys(logSchemas).length !== 8) {
    issues.push({ file: "data/logSchemas.json", message: "Log schemas should contain 8 schema groups." });
  }

  if (sourceOfTruthLock.length !== 39) {
    issues.push({ file: "data/sourceOfTruthLock.json", message: "Source of truth lock should contain 39 records." });
  }

  if (issues.length && strict) {
    throw new Error(`v8.4 import validation failed:\n${issues.map((issue) => `- ${issue.file}: ${issue.message}`).join("\n")}`);
  }

  return issues;
}
