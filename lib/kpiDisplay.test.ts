import { describe, expect, it } from "vitest";

import kpisJson from "../data/kpis.json";
import planJson from "../data/plan.json";
import { BASELINE_PENDING_KPI_DATE, BASELINE_PENDING_KPI_IDS, kpiNextTestDate, kpiTargetDisplay } from "./kpiDisplay";
import type { KPI, TrainingPlan } from "./types";

const kpis = kpisJson as KPI[];
const trainingPlan = planJson as TrainingPlan;

function byId(id: string) {
  const kpi = kpis.find((item) => item.id === id);
  if (!kpi) throw new Error(`Missing KPI fixture: ${id}`);
  return kpi;
}

describe("KPI display helpers", () => {
  it("shows new KPIs as baseline-pending targets scheduled for June 30", () => {
    for (const id of BASELINE_PENDING_KPI_IDS) {
      const kpi = byId(id);

      expect(kpi.targetValue, id).toBeUndefined();
      expect(kpiTargetDisplay(kpi), id).toBe("Set after baseline");
      expect(kpiNextTestDate(kpi, trainingPlan.days, "2026-06-30"), id).toBe(BASELINE_PENDING_KPI_DATE);
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
