import { type DayProjection } from "./dayProjection";
import { type DayStatus, type DayStatusName } from "./dayStatus";

export interface ScreenProjectionBase {
  date: string;
  displayTitle: string;
  status: DayStatusName;
  statuses: DayStatusName[];
  summaryLabel: string;
  caveats: DayStatus["caveats"];
  hasSportLoad: boolean;
  hasTrainingWork: boolean;
  hasKpiResults: boolean;
  hasReflection: boolean;
  requiresManualReview: boolean;
  isLocalOnly: boolean;
}

export interface TodayScreenProjection extends ScreenProjectionBase {
  primaryAction: "review" | "resume_training_work" | "log_sport_load" | "start_training_work" | "view_summary";
  doneLabels: string[];
  attentionLabels: string[];
  isIncomplete: boolean;
}

export interface CalendarDayScreenProjection extends ScreenProjectionBase {
  isStarted: boolean;
  isCompleted: boolean;
  hasLoggedSportLoad: boolean;
}

export interface HistoryDayScreenProjection extends ScreenProjectionBase {
  groups: {
    sportLoad: ProjectionGroup;
    trainingWork: ProjectionGroup;
    kpi: ProjectionGroup;
    reflection: ProjectionGroup;
    recovery: ProjectionGroup;
    legacy: ProjectionGroup;
  };
  unsupportedCaveats: string[];
}

export interface DashboardDayScreenProjection extends ScreenProjectionBase {
  isCompleted: boolean;
  isIncomplete: boolean;
  evidenceCounts: {
    sportLoadLogs: number;
    sessionAttempts: number;
    drillLogs: number;
    kpiResults: number;
    reflections: number;
    recoveryLogs: number;
    legacyOrphanRecords: number;
  };
  attentionFlags: string[];
}

export interface KpiDayScreenProjection extends ScreenProjectionBase {
  completedKpiCount: number;
  deferredKpiCount: number;
  missingKpiCount: number;
}

export interface WeekDashboardProjection {
  days: DashboardDayScreenProjection[];
  totals: {
    days: number;
    completedDays: number;
    incompleteDays: number;
    sportLoadDays: number;
    trainingWorkDays: number;
    manualReviewDays: number;
    localOnlyDays: number;
    unsupportedGapDays: number;
  };
}

interface ProjectionGroup {
  count: number;
  hasRecords: boolean;
}

export function buildTodayScreenProjection(day: DayProjection): TodayScreenProjection {
  const attentionLabels = attentionLabelsFor(day);
  return {
    ...baseProjection(day),
    primaryAction: primaryActionFor(day),
    doneLabels: doneLabelsFor(day),
    attentionLabels,
    isIncomplete: isIncomplete(day),
  };
}

export function buildCalendarDayProjection(day: DayProjection): CalendarDayScreenProjection {
  return {
    ...baseProjection(day),
    isStarted: day.status.hasAnyRecord,
    isCompleted: day.status.statuses.includes("completed") || day.status.statuses.includes("completed_with_deferred"),
    hasLoggedSportLoad: day.status.statuses.includes("sport_load_logged"),
  };
}

export function buildHistoryDayProjection(day: DayProjection): HistoryDayScreenProjection {
  return {
    ...baseProjection(day),
    groups: {
      sportLoad: groupFor(day.records.sportLoadLogs.length),
      trainingWork: groupFor(day.records.sessionAttempts.length + day.records.drillLogs.length),
      kpi: groupFor(day.records.kpiResults.length),
      reflection: groupFor(day.records.reflections.length),
      recovery: groupFor(day.records.recoveryLogs.length),
      legacy: groupFor(day.records.legacyOrphanRecords.length),
    },
    unsupportedCaveats: day.caveats.unsupported,
  };
}

export function buildDashboardDayProjection(day: DayProjection): DashboardDayScreenProjection {
  return {
    ...baseProjection(day),
    isCompleted: day.status.statuses.includes("completed") || day.status.statuses.includes("completed_with_deferred"),
    isIncomplete: isIncomplete(day),
    evidenceCounts: {
      sportLoadLogs: day.records.sportLoadLogs.length,
      sessionAttempts: day.records.sessionAttempts.length,
      drillLogs: day.records.drillLogs.length,
      kpiResults: day.records.kpiResults.length,
      reflections: day.records.reflections.length,
      recoveryLogs: day.records.recoveryLogs.length,
      legacyOrphanRecords: day.records.legacyOrphanRecords.length,
    },
    attentionFlags: attentionLabelsFor(day),
  };
}

export function buildKpiDayProjection(day: DayProjection): KpiDayScreenProjection {
  const plannedKpiCount = day.plannedActivities.filter((activity) => activity.kind === "kpi").length;
  const completedKpiCount = day.records.kpiResults.filter((record) => record.status === "completed").length;
  const deferredKpiCount = day.records.kpiResults.filter((record) => record.deferred === true || record.status === "deferred").length;

  return {
    ...baseProjection(day),
    completedKpiCount,
    deferredKpiCount,
    missingKpiCount: Math.max(0, plannedKpiCount - completedKpiCount - deferredKpiCount),
  };
}

export function buildWeekDashboardProjection(days: DayProjection[]): WeekDashboardProjection {
  const dashboardDays = days.map(buildDashboardDayProjection);
  return {
    days: dashboardDays,
    totals: {
      days: dashboardDays.length,
      completedDays: dashboardDays.filter((day) => day.isCompleted).length,
      incompleteDays: dashboardDays.filter((day) => day.isIncomplete).length,
      sportLoadDays: dashboardDays.filter((day) => day.hasSportLoad).length,
      trainingWorkDays: dashboardDays.filter((day) => day.hasTrainingWork).length,
      manualReviewDays: dashboardDays.filter((day) => day.requiresManualReview).length,
      localOnlyDays: dashboardDays.filter((day) => day.isLocalOnly).length,
      unsupportedGapDays: dashboardDays.filter((day) => day.caveats.hasUnsupportedCompletionGap).length,
    },
  };
}

function baseProjection(day: DayProjection): ScreenProjectionBase {
  return {
    date: day.date,
    displayTitle: day.displayTitle,
    status: day.status.status,
    statuses: day.status.statuses,
    summaryLabel: day.summaryLabel,
    caveats: day.caveats,
    hasSportLoad: day.hasSportLoad,
    hasTrainingWork: day.hasTrainingWork,
    hasKpiResults: day.hasKpiResults,
    hasReflection: day.hasReflection,
    requiresManualReview: day.requiresManualReview,
    isLocalOnly: day.isLocalOnly,
  };
}

function primaryActionFor(day: DayProjection): TodayScreenProjection["primaryAction"] {
  if (day.requiresManualReview) return "review";
  if (day.status.status === "in_progress") return "resume_training_work";
  if (day.hasSportLoad && !day.status.statuses.includes("sport_load_logged")) return "log_sport_load";
  if (day.hasTrainingWork && !day.status.hasTrainingWorkEvidence) return "start_training_work";
  return "view_summary";
}

function doneLabelsFor(day: DayProjection): string[] {
  const labels: string[] = [];
  if (day.status.statuses.includes("sport_load_logged")) labels.push("Sport Load logged");
  if (day.status.statuses.includes("completed") || day.status.statuses.includes("completed_with_deferred")) {
    labels.push("Training Work complete");
  }
  if (day.hasKpiResults) labels.push("KPI recorded");
  if (day.hasReflection) labels.push("Reflection saved");
  if (day.status.statuses.includes("recovery_logged")) labels.push("Recovery logged");
  return labels;
}

function attentionLabelsFor(day: DayProjection): string[] {
  const labels: string[] = [];
  if (day.requiresManualReview) labels.push("Manual review required");
  if (day.isLocalOnly) labels.push("Local-only evidence");
  if (day.caveats.sync.includes("sync pending")) labels.push("Sync pending");
  if (day.caveats.sync.includes("sync failed")) labels.push("Sync failed");
  if (day.caveats.hasUnsupportedCompletionGap) labels.push("Unsupported record gap");
  if (day.caveats.unsupported.includes("export-not-supported")) labels.push("Export gap");
  if (isIncomplete(day)) labels.push("Incomplete");
  return labels;
}

function isIncomplete(day: DayProjection): boolean {
  return day.status.status === "partial" || day.status.status === "in_progress" || day.status.status === "not_started";
}

function groupFor(count: number): ProjectionGroup {
  return { count, hasRecords: count > 0 };
}
