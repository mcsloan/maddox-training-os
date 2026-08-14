import { dayExecutionPlan } from "@/lib/imports/v8_4";

export const ACTIVE_KPI_IDS = [
  "kpi-10-yard",
  "kpi-broad-jump",
  "kpi-5105",
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
] as const;

export function canonicalKpiTestDates() {
  return dayExecutionPlan
    .filter((entry) => entry.executable !== false && entry.logType === "kpiLog")
    .map((entry) => ({ date: entry.date, kpiIds: entry.detailIds ?? [] }))
    .filter((entry) => entry.kpiIds.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function nextCanonicalKpiTestDate(kpiId: string, today: string) {
  return canonicalKpiTestDates().find((entry) => entry.date >= today && entry.kpiIds.includes(kpiId))?.date ?? null;
}
