import { describe, expect, it } from "vitest";

import kpisJson from "../data/kpis.json";
import planJson from "../data/plan.json";
import { JUNE_30_NEW_KPI_DATE, JUNE_30_NEW_KPI_IDS, kpiNextTestDate, kpiTargetDisplay } from "./kpiDisplay";
import type { KPI, TrainingPlan } from "./types";

const kpis = kpisJson as KPI[];
const trainingPlan = planJson as TrainingPlan;
const newKpiTargets: Record<string, string> = {
  "kpi-100m-sprint": "16.5 seconds",
  "kpi-45-second-shuttle": "120 metres",
  "kpi-push-ups": "25 reps",
  "kpi-flexed-arm-hang": "20 seconds",
  "kpi-zwift-bike-3x10s-peak-power": "300 watts",
  "kpi-vertical-jump": "35 centimeters",
};

function byId(id: string) {
  const kpi = kpis.find((item) => item.id === id);
  if (!kpi) throw new Error(`Missing KPI fixture: ${id}`);
  return kpi;
}

describe("KPI display helpers", () => {
  it("shows new KPIs with exact targets scheduled for June 30", () => {
    for (const id of JUNE_30_NEW_KPI_IDS) {
      const kpi = byId(id);

      expect(kpiTargetDisplay(kpi), id).toBe(newKpiTargets[id]);
      expect(kpiTargetDisplay(kpi), id).not.toBe("Set after baseline");
      expect(kpiNextTestDate(kpi, trainingPlan.days, "2026-06-30"), id).toBe(JUNE_30_NEW_KPI_DATE);
    }
  });

  it("keeps existing KPI target values and plan-derived next test dates", () => {
    const sprint = byId("kpi-10-yard");
    const expectedNextTest = trainingPlan.days.find((day) => day.date >= "2026-06-30" && day.kpiTestIds?.includes(sprint.id));

    expect(typeof sprint.targetValue).toBe("number");
    expect(kpiTargetDisplay(sprint)).toBe(`${sprint.targetValue} ${sprint.units}`);
    expect(expectedNextTest?.date).toBe("2026-06-30");
    expect(kpiNextTestDate(sprint, trainingPlan.days, "2026-06-30")).toBe(expectedNextTest?.date);
  });

  it("does not introduce an active Pull-Up KPI", () => {
    expect(kpis.some((kpi) => /pull[- ]?up/i.test(`${kpi.id} ${kpi.name}`))).toBe(false);
  });
});
