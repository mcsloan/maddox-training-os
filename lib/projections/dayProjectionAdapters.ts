import { type DayProjectionInput } from "./dayProjection";
import {
  type DayRecordSyncState,
  type DayStatusRecord,
  type PlannedDayActivity,
  type UnsupportedRecordFlag,
} from "./dayStatus";
import { type ExternalLoadLog, type KPIResult, type Reflection, type SessionLog, type TrainingWorkLog } from "@/lib/types";

interface ProjectionRecordMetadata {
  syncState?: DayRecordSyncState;
  supported?: boolean;
  legacyNeedsReview?: boolean;
  deferred?: boolean;
}

export type SportLoadProjectionSource = ExternalLoadLog & ProjectionRecordMetadata;
export type KpiProjectionSource = KPIResult &
  ProjectionRecordMetadata & {
    status?: "completed" | "deferred" | string;
  };
export type SessionAttemptProjectionSource = SessionLog & ProjectionRecordMetadata;
export type ReflectionProjectionSource = Reflection &
  ProjectionRecordMetadata & {
    id?: string;
    status?: string;
  };
export type TrainingWorkProjectionSource = TrainingWorkLog & ProjectionRecordMetadata;
export type LegacyOrphanProjectionSource = ProjectionRecordMetadata & {
  id?: string;
  status?: string;
  reason?: string;
};

export interface BuildDayProjectionInputFromRecordsArgs {
  date: string;
  weekId?: string;
  weekNumber?: number;
  dayTitle?: string;
  plannedActivities?: PlannedDayActivity[];
  sportLoadLogs?: SportLoadProjectionSource[];
  kpiResults?: KpiProjectionSource[];
  sessionAttempts?: SessionAttemptProjectionSource[];
  trainingWorkLogs?: TrainingWorkProjectionSource[];
  reflections?: ReflectionProjectionSource[];
  recoveryLogs?: DayStatusRecord[];
  legacyOrphanRecords?: LegacyOrphanProjectionSource[];
  syncState?: DayRecordSyncState | DayRecordSyncState[];
  unsupportedRecordFlags?: UnsupportedRecordFlag[];
  projection?: "execution" | "preview";
}

export function buildDayProjectionInputFromRecords(input: BuildDayProjectionInputFromRecordsArgs): DayProjectionInput {
  return {
    date: input.date,
    weekId: input.weekId,
    weekNumber: input.weekNumber,
    dayTitle: input.dayTitle,
    plannedActivities: input.plannedActivities ?? [],
    sportLoadLogs: (input.sportLoadLogs ?? []).map(mapSportLoadLogToProjectionRecord),
    sessionAttempts: [
      ...(input.sessionAttempts ?? []).map(mapSessionAttemptToProjectionRecord),
      ...(input.trainingWorkLogs ?? []).map(mapTrainingWorkLogToProjectionRecord),
    ],
    drillLogs: (input.sessionAttempts ?? []).flatMap(mapSessionAttemptToDrillProjectionRecords),
    kpiResults: (input.kpiResults ?? []).map(mapKpiResultToProjectionRecord),
    reflections: [
      ...(input.reflections ?? []).map(mapReflectionToProjectionRecord),
      ...(input.sessionAttempts ?? [])
        .map((session) => mapSessionReflectionToProjectionRecord(session))
        .filter((record): record is DayStatusRecord => record !== null),
    ],
    recoveryLogs: input.recoveryLogs ?? [],
    legacyOrphanRecords: (input.legacyOrphanRecords ?? []).map(mapLegacyOrphanToProjectionRecord),
    syncState: input.syncState,
    unsupportedRecordFlags: input.unsupportedRecordFlags,
    projection: input.projection,
  };
}

export function mapSportLoadLogToProjectionRecord(log: SportLoadProjectionSource): DayStatusRecord {
  return {
    id: log.id,
    kind: "sport_load",
    status: log.attended ? "logged" : "partial",
    completionPercent: log.attended ? 100 : 0,
    supported: log.supported,
    syncState: log.syncState,
    legacyNeedsReview: log.legacyNeedsReview,
  };
}

export function mapKpiResultToProjectionRecord(result: KpiProjectionSource): DayStatusRecord {
  const deferred = result.deferred === true || result.status === "deferred";
  return {
    id: result.id,
    kind: "kpi",
    status: deferred ? "deferred" : result.status ?? (result.bestResult !== null ? "completed" : "partial"),
    completionPercent: deferred ? 0 : result.bestResult !== null ? 100 : 0,
    deferred,
    supported: result.supported,
    syncState: result.syncState,
    legacyNeedsReview: result.legacyNeedsReview,
  };
}

export function mapSessionAttemptToProjectionRecord(session: SessionAttemptProjectionSource): DayStatusRecord {
  return {
    id: session.id,
    kind: "training_work",
    status: session.status,
    completionPercent: session.status === "completed" ? 100 : sessionCompletionPercent(session),
    supported: session.supported,
    syncState: session.syncState,
    legacyNeedsReview: session.legacyNeedsReview,
  };
}

export function mapReflectionToProjectionRecord(reflection: ReflectionProjectionSource): DayStatusRecord {
  return {
    id: reflection.id,
    kind: "reflection",
    status: reflection.status ?? (hasReflectionContent(reflection) ? "saved" : "partial"),
    completionPercent: hasReflectionContent(reflection) ? 100 : 0,
    supported: reflection.supported,
    syncState: reflection.syncState,
    legacyNeedsReview: reflection.legacyNeedsReview,
  };
}

export function mapTrainingWorkLogToProjectionRecord(log: TrainingWorkProjectionSource): DayStatusRecord {
  return {
    id: log.id,
    kind: "training_work",
    status: log.completed ? "completed" : "partial",
    completionPercent: log.completed ? 100 : 0,
    supported: log.supported,
    syncState: log.syncState,
    legacyNeedsReview: log.legacyNeedsReview,
  };
}

function mapSessionAttemptToDrillProjectionRecords(session: SessionAttemptProjectionSource): DayStatusRecord[] {
  return Object.values(session.exercises).map((exercise) => ({
    id: `${session.id}:${exercise.drillId}`,
    kind: "drill",
    status: exercise.done ? "completed" : "partial",
    completionPercent: exercise.done ? 100 : 0,
    supported: session.supported,
    syncState: session.syncState,
    legacyNeedsReview: session.legacyNeedsReview,
  }));
}

function mapSessionReflectionToProjectionRecord(session: SessionAttemptProjectionSource): DayStatusRecord | null {
  if (!hasReflectionContent(session.reflection)) return null;
  return {
    id: `${session.id}:reflection`,
    kind: "reflection",
    status: "saved",
    completionPercent: 100,
    supported: session.supported,
    syncState: session.syncState,
    legacyNeedsReview: session.legacyNeedsReview,
  };
}

function mapLegacyOrphanToProjectionRecord(record: LegacyOrphanProjectionSource): DayStatusRecord {
  return {
    id: record.id,
    kind: "legacy",
    status: record.status,
    supported: record.supported,
    syncState: record.syncState,
    legacyNeedsReview: true,
  };
}

function sessionCompletionPercent(session: SessionLog): number {
  const exercises = Object.values(session.exercises);
  if (!exercises.length) return session.status === "completed" ? 100 : 0;
  return Math.round((exercises.filter((exercise) => exercise.done).length / exercises.length) * 100);
}

function hasReflectionContent(reflection: Reflection): boolean {
  return (
    reflection.energy !== null ||
    reflection.confidence !== null ||
    reflection.difficulty !== null ||
    reflection.improvement.trim().length > 0 ||
    reflection.notes.trim().length > 0
  );
}
