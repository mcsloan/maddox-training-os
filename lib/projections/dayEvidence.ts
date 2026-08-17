import { getV84SportLoadsForDate } from "@/lib/imports/v8_4/daily";
import { projectCanonicalDay } from "@/lib/projections/canonicalDay";
import { getPlanDay } from "@/lib/trainingData";
import { type ExternalLoadLog, type KPIResult, type SessionLog, type TrainingWorkLog } from "@/lib/types";
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
  trainingWorkLogs?: TrainingWorkLog[];
  legacyOrphanRecords?: LegacyOrphanProjectionSource[];
  projection?: "execution" | "preview";
}

export function buildDayEvidenceProjection({
  date,
  weekNumber,
  sportLoadLogs = [],
  kpiResults = [],
  sessionAttempts = [],
  trainingWorkLogs = [],
  legacyOrphanRecords = [],
  projection = "preview",
}: BuildDayEvidenceProjectionArgs): DayProjection {
  const day = getPlanDay(date);
  const canonicalDay = projectCanonicalDay(date);
  const sportLoads = getV84SportLoadsForDate(date);
  const canonicalTrainingActivities = canonicalDay.activities.filter((activity) =>
    activity.executable && activity.summaryVisible && !["sport_load_log", "kpi_log"].includes(activity.logType),
  );
  const plannedActivities: PlannedDayActivity[] = [
    ...canonicalTrainingActivities.map((activity) => ({ id: activity.id, kind: "training_work" as const, required: activity.required })),
    ...canonicalDay.kpi.kpiIds.map((id) => ({ id, kind: "kpi" as const })),
    ...sportLoads.map((load) => ({ id: load.id, kind: "sport_load" as const })),
  ];

  return buildDayProjection(buildDayProjectionInputFromRecords({
    date,
    weekNumber: weekNumber ?? day?.weekNumber,
    dayTitle: canonicalDay.title,
    plannedActivities,
    sportLoadLogs: sportLoadLogs.filter((log) => sportLoads.some((load) =>
      log.externalLoadId === load.id || (log.date === load.date && log.title === load.title),
    )),
    kpiResults: kpiResults
      .filter((result) => result.date === date)
      .map((result) => ({
        ...result,
        syncState: result.syncState === "local" ? "local-only" : result.syncState === "cloud" ? "cloud-synced" : undefined,
    })),
    sessionAttempts: sessionAttempts.filter((session) => session.date === date),
    trainingWorkLogs: trainingWorkLogs.filter((log) => log.date === date),
    legacyOrphanRecords: legacyOrphanRecords.filter((record) => record.id?.includes(date)),
    projection,
  }));
}
