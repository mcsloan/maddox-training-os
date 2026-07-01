import { kpiNextTestDate, kpiTargetDisplay } from "./kpiDisplay";
import { kpiBaseline, kpiBest, kpiTargetProgress, kpiTrend } from "./trainingMetrics";
import type { KPI, KPIResult, PlanDay } from "./types";

export type HydratedKpiResult = KPIResult & { syncState?: string };

export const JUNE_30_EXPECTED_KPI_IDS = [
  "kpi-5105",
  "kpi-10-yard",
  "kpi-broad-jump",
  "kpi-shot-accuracy",
  "kpi-puck-weave",
  "kpi-head-up-callout",
  "kpi-quick-hands",
  "kpi-plank-quality",
  "kpi-100m-sprint",
  "kpi-45-second-shuttle",
  "kpi-push-ups",
  "kpi-flexed-arm-hang",
  "kpi-zwift-bike-3x10s-peak-power",
  "kpi-vertical-jump",
];

export function buildKpiHydratedExport({
  generatedAt,
  environmentBadge,
  cloudSyncStatus,
  pageUrl,
  kpis,
  days,
  results,
  today,
}: {
  generatedAt: string;
  environmentBadge: string | null;
  cloudSyncStatus: string;
  pageUrl: string;
  kpis: KPI[];
  days: PlanDay[];
  results: HydratedKpiResult[];
  today: string;
}) {
  const scoreboardRows = kpis.map((kpi) => {
    const entries = results.filter((result) => result.kpiId === kpi.id);
    const baseline = kpiBaseline(entries);
    const currentBest = kpiBest(kpi, entries);
    const nextTestDate = kpiNextTestDate(kpi, days, today);
    return {
      kpiId: kpi.id,
      name: kpi.name,
      direction: kpi.scoringMethod === "lowest" ? "Lower is better" : "Higher is better",
      baseline,
      currentBest,
      target: kpiTargetDisplay(kpi),
      nextTest: nextTestDate,
      progress: kpiTargetProgress(kpi, baseline, currentBest),
      trend: kpiTrend(kpi, entries),
      units: kpi.units,
      entries: entries.length,
    };
  });
  const visibleEntries = results.map((result) => ({
    id: result.id,
    kpiId: result.kpiId,
    kpiName: kpis.find((kpi) => kpi.id === result.kpiId)?.name ?? result.kpiId,
    date: result.date,
    enteredAt: result.enteredAt ?? null,
    bestResult: result.bestResult,
    attempts: result.attempts,
    notes: result.notes,
    syncState: result.syncState ?? null,
  }));
  const latestByKpi = Object.fromEntries(kpis.map((kpi) => {
    const latest = results.find((result) => result.kpiId === kpi.id) ?? null;
    return [kpi.id, latest ? {
      id: latest.id,
      date: latest.date,
      enteredAt: latest.enteredAt ?? null,
      bestResult: latest.bestResult,
      attempts: latest.attempts,
      notes: latest.notes,
      syncState: latest.syncState ?? null,
    } : null];
  }));
  const countByKpi = countBy(results, (result) => result.kpiId);
  const countByDate = countBy(results, (result) => result.date);
  const missingExpectedKpis = JUNE_30_EXPECTED_KPI_IDS.filter((id) => !results.some((result) => result.kpiId === id));

  return {
    generatedAt,
    source: "kpis-page-hydrated-state",
    environmentBadge,
    cloudSyncStatus,
    pageUrl,
    scoreboardRows,
    entries: visibleEntries,
    latestByKpi,
    countByKpi,
    countByDate,
    missingExpectedKpis,
  };
}

function countBy<T>(items: T[], key: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const value = key(item);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}
