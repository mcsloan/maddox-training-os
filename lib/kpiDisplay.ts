import type { KPI, PlanDay } from "./types";
import { nextCanonicalKpiTestDate } from "./kpiSchedule";

export const JUNE_30_NEW_KPI_DATE = "2026-06-30";

export const JUNE_30_NEW_KPI_IDS = [
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
  void days;
  return nextCanonicalKpiTestDate(kpi.id, today);
}
