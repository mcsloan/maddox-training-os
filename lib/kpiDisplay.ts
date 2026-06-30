import type { KPI, PlanDay } from "./types";

export const BASELINE_PENDING_KPI_DATE = "2026-06-30";

export const BASELINE_PENDING_KPI_IDS = [
  "kpi-100m-sprint",
  "kpi-45-second-shuttle",
  "kpi-push-ups",
  "kpi-flexed-arm-hang",
  "kpi-zwift-bike-3x10s-peak-power",
  "kpi-vertical-jump",
];

export function kpiTargetDisplay(kpi: KPI) {
  if (typeof kpi.targetValue === "number") return `${kpi.targetValue} ${kpi.units}`;
  return kpi.targetLabel || "Set after baseline";
}

export function kpiNextTestDate(kpi: KPI, days: PlanDay[], today: string) {
  const scheduled = days.find((day) => day.date >= today && day.kpiTestIds?.includes(kpi.id));
  if (scheduled) return scheduled.date;
  if (BASELINE_PENDING_KPI_IDS.includes(kpi.id)) return BASELINE_PENDING_KPI_DATE;
  return null;
}
