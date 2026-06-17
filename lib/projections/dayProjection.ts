import {
  deriveDayStatus,
  type DayStatus,
  type DayStatusInput,
  type DayStatusRecord,
  type PlannedDayActivity,
  type UnsupportedRecordFlag,
} from "./dayStatus";

export interface DayProjectionInput extends DayStatusInput {
  date: string;
  weekId?: string;
  weekNumber?: number;
  dayTitle?: string;
}

export interface DayProjectionRecordGroups {
  sportLoadLogs: DayStatusRecord[];
  sessionAttempts: DayStatusRecord[];
  drillLogs: DayStatusRecord[];
  kpiResults: DayStatusRecord[];
  reflections: DayStatusRecord[];
  recoveryLogs: DayStatusRecord[];
  legacyOrphanRecords: DayStatusRecord[];
}

export interface DayProjection {
  date: string;
  weekId?: string;
  weekNumber?: number;
  dayTitle?: string;
  displayTitle: string;
  summaryLabel: string;
  plannedActivities: PlannedDayActivity[];
  records: DayProjectionRecordGroups;
  status: DayStatus;
  caveats: DayStatus["caveats"];
  hasSportLoad: boolean;
  hasTrainingWork: boolean;
  hasKpiResults: boolean;
  hasReflection: boolean;
  hasLegacyReview: boolean;
  isLocalOnly: boolean;
  requiresManualReview: boolean;
  hasUnsupportedRecordGap: boolean;
  hasExportGap: boolean;
}

export function buildDayProjection(input: DayProjectionInput): DayProjection {
  const plannedActivities = input.plannedActivities ?? [];
  const records: DayProjectionRecordGroups = {
    sportLoadLogs: input.sportLoadLogs ?? [],
    sessionAttempts: input.sessionAttempts ?? [],
    drillLogs: input.drillLogs ?? [],
    kpiResults: input.kpiResults ?? [],
    reflections: input.reflections ?? [],
    recoveryLogs: input.recoveryLogs ?? [],
    legacyOrphanRecords: input.legacyOrphanRecords ?? [],
  };
  const status = deriveDayStatus({
    plannedActivities,
    sportLoadLogs: records.sportLoadLogs,
    sessionAttempts: records.sessionAttempts,
    drillLogs: records.drillLogs,
    kpiResults: records.kpiResults,
    reflections: records.reflections,
    recoveryLogs: records.recoveryLogs,
    legacyOrphanRecords: records.legacyOrphanRecords,
    syncState: input.syncState,
    unsupportedRecordFlags: input.unsupportedRecordFlags,
    projection: input.projection,
  });
  const unsupportedRecordFlags = input.unsupportedRecordFlags ?? [];
  const hasLegacyReview = status.statuses.includes("legacy_needs_review");
  const requiresManualReview = hasLegacyReview || unsupportedRecordFlags.includes("manual-review-required");

  return {
    date: input.date,
    weekId: input.weekId,
    weekNumber: input.weekNumber,
    dayTitle: input.dayTitle,
    displayTitle: input.dayTitle ?? input.date,
    summaryLabel: summaryLabelFor(status, unsupportedRecordFlags),
    plannedActivities,
    records,
    status,
    caveats: status.caveats,
    hasSportLoad: plannedActivities.some((activity) => activity.kind === "sport_load") || records.sportLoadLogs.length > 0,
    hasTrainingWork:
      plannedActivities.some((activity) => activity.kind === "training_work") ||
      records.sessionAttempts.length > 0 ||
      records.drillLogs.length > 0,
    hasKpiResults: records.kpiResults.length > 0,
    hasReflection: records.reflections.length > 0,
    hasLegacyReview,
    isLocalOnly: status.caveats.hasLocalOnlyEvidence,
    requiresManualReview,
    hasUnsupportedRecordGap: status.caveats.hasUnsupportedCompletionGap,
    hasExportGap: unsupportedRecordFlags.includes("export-not-supported"),
  };
}

function summaryLabelFor(status: DayStatus, unsupportedRecordFlags: UnsupportedRecordFlag[]): string {
  if (status.status === "legacy_needs_review") return "Needs review";
  if (unsupportedRecordFlags.includes("record-not-supported")) return "Record support gap";
  if (unsupportedRecordFlags.includes("export-not-supported")) return "Export gap";
  if (status.caveats.hasLocalOnlyEvidence) return "Local-only evidence";
  if (status.status === "completed_with_deferred") return "Completed with deferred work";
  if (status.status === "sport_load_logged") return "Sport Load logged";
  if (status.status === "recovery_logged") return "Recovery logged";
  if (status.status === "in_progress") return "In progress";
  if (status.status === "not_started") return "Not started";
  if (status.status === "planned") return "Planned";
  return status.status.replaceAll("_", " ");
}
