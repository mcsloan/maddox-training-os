import { getV84SportLoadsForDate } from "@/lib/imports/v8_4/daily";
import { getPlanDay } from "@/lib/trainingData";
import { type ExternalLoadLog, type KPIResult, type SessionLog } from "@/lib/types";
import { buildDayProjection, type DayProjection } from "./dayProjection";
import { buildDayProjectionInputFromRecords, type LegacyOrphanProjectionSource } from "./dayProjectionAdapters";
import { type PlannedDayActivity } from "./dayStatus";

type KpiEvidenceResult = KPIResult & { syncState?: "cloud" | "local" };

export interface BuildDayEvidenceProjectionArgs {
  date: string;
  weekNumber?: number;
  sportLoadLogs?: ExternalLoadLog[];
  kpiResults?: KpiEvidenceResult[];
  sessionAttempts?: SessionLog[];
  legacyOrphanRecords?: LegacyOrphanProjectionSource[];
  projection?: "execution" | "preview";
}

export function buildDayEvidenceProjection({
  date,
  weekNumber,
  sportLoadLogs = [],
  kpiResults = [],
  sessionAttempts = [],
  legacyOrphanRecords = [],
  projection = "preview",
}: BuildDayEvidenceProjectionArgs): DayProjection {
  const day = getPlanDay(date);
  const sportLoads = getV84SportLoadsForDate(date);
  const sportLoadIds = new Set(sportLoads.map((load) => load.id));
  const plannedActivities: PlannedDayActivity[] = [
    ...(day?.workoutId ? [{ id: day.workoutId, kind: "training_work" as const }] : []),
    ...(day?.kpiTestIds || []).map((id) => ({ id, kind: "kpi" as const })),
    ...sportLoads.map((load) => ({ id: load.id, kind: "sport_load" as const })),
  ];

  return buildDayProjection(buildDayProjectionInputFromRecords({
    date,
    weekNumber: weekNumber ?? day?.weekNumber,
    dayTitle: day?.primarySession || sportLoads[0]?.title || "Recovery / planning day",
    plannedActivities,
    sportLoadLogs: sportLoadLogs.filter((log) => log.date === date || sportLoadIds.has(log.externalLoadId)),
    kpiResults: kpiResults
      .filter((result) => result.date === date)
      .map((result) => ({
        ...result,
        syncState: result.syncState === "local" ? "local-only" : result.syncState === "cloud" ? "cloud-synced" : undefined,
    })),
    sessionAttempts: sessionAttempts.filter((session) => session.date === date),
    legacyOrphanRecords: legacyOrphanRecords.filter((record) => record.id?.includes(date)),
    projection,
  }));
}
