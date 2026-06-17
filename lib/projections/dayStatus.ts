export type DayStatusName =
  | "not_started"
  | "planned"
  | "in_progress"
  | "completed"
  | "completed_with_deferred"
  | "partial"
  | "deferred"
  | "sport_load_logged"
  | "recovery_logged"
  | "legacy_needs_review";

export type DayRecordKind = "training_work" | "sport_load" | "kpi" | "drill" | "reflection" | "recovery" | "legacy" | "other";

export type DayRecordSyncState = "cloud-synced" | "local-only" | "sync pending" | "sync failed";

export type UnsupportedRecordFlag = "record-not-supported" | "export-not-supported" | "manual-review-required";

export interface PlannedDayActivity {
  id?: string;
  kind: DayRecordKind;
  required?: boolean;
  status?: "planned" | "deferred" | "completed" | string;
}

export interface DayStatusRecord {
  id?: string;
  kind?: DayRecordKind;
  status?: string;
  completionPercent?: number;
  required?: boolean;
  deferred?: boolean;
  supported?: boolean;
  syncState?: DayRecordSyncState;
  legacyNeedsReview?: boolean;
}

export interface DayStatusInput {
  plannedActivities?: PlannedDayActivity[];
  sportLoadLogs?: DayStatusRecord[];
  sessionAttempts?: DayStatusRecord[];
  drillLogs?: DayStatusRecord[];
  kpiResults?: DayStatusRecord[];
  reflections?: DayStatusRecord[];
  recoveryLogs?: DayStatusRecord[];
  legacyOrphanRecords?: DayStatusRecord[];
  syncState?: DayRecordSyncState | DayRecordSyncState[];
  unsupportedRecordFlags?: UnsupportedRecordFlag[];
  projection?: "execution" | "preview";
}

export interface DayStatusCaveats {
  sync: DayRecordSyncState[];
  unsupported: UnsupportedRecordFlag[];
  hasLocalOnlyEvidence: boolean;
  hasUnsupportedCompletionGap: boolean;
}

export interface DayStatus {
  status: DayStatusName;
  statuses: DayStatusName[];
  caveats: DayStatusCaveats;
  hasPlannedWork: boolean;
  hasAnyRecord: boolean;
  hasTrainingWorkEvidence: boolean;
  hasSportLoadEvidence: boolean;
  hasRecoveryEvidence: boolean;
  hasExplicitDeferral: boolean;
  completionPercent: number;
}

const COMPLETED_STATUSES = new Set(["completed", "done", "saved", "logged"]);
const IN_PROGRESS_STATUSES = new Set(["in-progress", "in_progress", "reopened", "started", "active"]);
const DEFERRED_STATUSES = new Set(["deferred", "postponed", "skipped"]);

export function deriveDayStatus(input: DayStatusInput): DayStatus {
  const plannedActivities = input.plannedActivities ?? [];
  const sportLoadLogs = input.sportLoadLogs ?? [];
  const sessionAttempts = input.sessionAttempts ?? [];
  const drillLogs = input.drillLogs ?? [];
  const kpiResults = input.kpiResults ?? [];
  const reflections = input.reflections ?? [];
  const recoveryLogs = input.recoveryLogs ?? [];
  const legacyOrphanRecords = input.legacyOrphanRecords ?? [];
  const unsupportedRecordFlags = unique(input.unsupportedRecordFlags ?? []);

  const trainingRecords = [...sessionAttempts, ...drillLogs, ...kpiResults, ...reflections];
  const currentRecords = [...sportLoadLogs, ...trainingRecords, ...recoveryLogs];
  const allRecords = [...currentRecords, ...legacyOrphanRecords];

  const sync = unique([
    ...syncStatesFromInput(input.syncState),
    ...allRecords.map((record) => record.syncState).filter(isSyncState),
  ]);
  const hasPlannedWork = plannedActivities.length > 0;
  const hasAnyRecord = allRecords.length > 0;
  const hasLegacyReview = legacyOrphanRecords.length > 0 || allRecords.some((record) => record.legacyNeedsReview);
  const hasManualReview = unsupportedRecordFlags.includes("manual-review-required");
  const hasExplicitDeferral =
    plannedActivities.some((activity) => isDeferredStatus(activity.status)) || currentRecords.some(isExplicitDeferral);
  const hasUnsupportedCompletionGap =
    unsupportedRecordFlags.includes("record-not-supported") || currentRecords.some((record) => record.supported === false);

  const hasSportLoadEvidence = sportLoadLogs.length > 0;
  const hasRecoveryEvidence = recoveryLogs.length > 0;
  const hasTrainingWorkEvidence = trainingRecords.length > 0;
  const hasInProgressTraining = sessionAttempts.some((record) => isInProgressStatus(record.status));
  const completionPercent = deriveCompletionPercent(currentRecords);
  const hasCompletedTrainingWork = isPlannedKindComplete("training_work", plannedActivities, trainingRecords);
  const hasCompletedSportLoad = isPlannedKindComplete("sport_load", plannedActivities, sportLoadLogs);
  const hasCompletedRecovery = isPlannedKindComplete("recovery", plannedActivities, recoveryLogs);
  const hasCompletedKpi = isPlannedKindComplete("kpi", plannedActivities, kpiResults);
  const hasCompletedRequiredWork =
    hasPlannedWork &&
    requiredKinds(plannedActivities).every((kind) => {
      if (kind === "training_work") return hasCompletedTrainingWork;
      if (kind === "sport_load") return hasCompletedSportLoad;
      if (kind === "recovery") return hasCompletedRecovery;
      if (kind === "kpi") return hasCompletedKpi;
      return isPlannedKindComplete(kind, plannedActivities, currentRecords);
    });
  const hasSomeCompletedWork = currentRecords.some(isCompletedRecord) || completionPercent > 0;
  const allCurrentRecordsDeferred = currentRecords.length > 0 && currentRecords.every(isExplicitDeferral);
  const allRequiredPlannedWorkDeferred =
    hasPlannedWork &&
    plannedActivities
      .filter((activity) => activity.required !== false)
      .every((activity) => isDeferredStatus(activity.status));

  const statuses: DayStatusName[] = [];
  if (hasLegacyReview || hasManualReview) statuses.push("legacy_needs_review");
  if (hasInProgressTraining) statuses.push("in_progress");
  if (hasAnyRecord && hasSomeCompletedWork && !hasCompletedRequiredWork && !hasInProgressTraining) statuses.push("partial");
  if (hasCompletedRequiredWork && hasExplicitDeferral && !hasUnsupportedCompletionGap) statuses.push("completed_with_deferred");
  if (hasCompletedRequiredWork && !hasUnsupportedCompletionGap) statuses.push("completed");
  if (hasSportLoadEvidence) statuses.push("sport_load_logged");
  if (hasRecoveryEvidence) statuses.push("recovery_logged");
  if (
    hasExplicitDeferral &&
    (allCurrentRecordsDeferred || allRequiredPlannedWorkDeferred) &&
    !hasUnsupportedCompletionGap
  ) {
    statuses.push("deferred");
  }
  if (!hasAnyRecord && hasPlannedWork && input.projection === "preview") statuses.push("planned");
  if (!hasAnyRecord && hasPlannedWork && input.projection !== "preview") statuses.push("not_started");

  const status = statuses[0] ?? (input.projection === "preview" ? "planned" : "not_started");

  return {
    status,
    statuses: unique(statuses),
    caveats: {
      sync,
      unsupported: unsupportedRecordFlags,
      hasLocalOnlyEvidence: sync.includes("local-only"),
      hasUnsupportedCompletionGap,
    },
    hasPlannedWork,
    hasAnyRecord,
    hasTrainingWorkEvidence,
    hasSportLoadEvidence,
    hasRecoveryEvidence,
    hasExplicitDeferral,
    completionPercent,
  };
}

export function hasLocalOnlyEvidence(status: DayStatus): boolean {
  return status.caveats.hasLocalOnlyEvidence;
}

export function hasUnsupportedCompletionGap(status: DayStatus): boolean {
  return status.caveats.hasUnsupportedCompletionGap;
}

function isCompletedRecord(record: DayStatusRecord): boolean {
  if (record.completionPercent !== undefined) return record.completionPercent >= 100;
  return isCompletedStatus(record.status);
}

function isExplicitDeferral(record: DayStatusRecord): boolean {
  return record.deferred === true || isDeferredStatus(record.status);
}

function isCompletedStatus(status: string | undefined): boolean {
  return status !== undefined && COMPLETED_STATUSES.has(status);
}

function isInProgressStatus(status: string | undefined): boolean {
  return status !== undefined && IN_PROGRESS_STATUSES.has(status);
}

function isDeferredStatus(status: string | undefined): boolean {
  return status !== undefined && DEFERRED_STATUSES.has(status);
}

function isSyncState(value: unknown): value is DayRecordSyncState {
  return value === "cloud-synced" || value === "local-only" || value === "sync pending" || value === "sync failed";
}

function syncStatesFromInput(syncState: DayStatusInput["syncState"]): DayRecordSyncState[] {
  if (syncState === undefined) return [];
  return Array.isArray(syncState) ? syncState : [syncState];
}

function requiredKinds(plannedActivities: PlannedDayActivity[]): DayRecordKind[] {
  const required = plannedActivities.filter((activity) => activity.required !== false).map((activity) => activity.kind);
  return unique(required);
}

function isPlannedKindComplete(
  kind: DayRecordKind,
  plannedActivities: PlannedDayActivity[],
  records: DayStatusRecord[],
): boolean {
  const isRequired = plannedActivities.some((activity) => activity.kind === kind && activity.required !== false);
  if (!isRequired) return true;
  return records.some((record) => {
    const recordKindMatches = record.kind === undefined || record.kind === kind;
    return recordKindMatches && record.supported !== false && isCompletedRecord(record);
  });
}

function deriveCompletionPercent(records: DayStatusRecord[]): number {
  const percentages = records
    .map((record) => record.completionPercent)
    .filter((value): value is number => typeof value === "number");
  if (!percentages.length) return records.some(isCompletedRecord) ? 100 : 0;
  const average = percentages.reduce((sum, value) => sum + Math.max(0, Math.min(100, value)), 0) / percentages.length;
  return Math.round(average);
}

function unique<T>(values: T[]): T[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
