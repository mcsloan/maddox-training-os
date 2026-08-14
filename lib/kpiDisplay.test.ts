import { describe, expect, it } from "vitest";

import kpisJson from "../data/kpis.json";
import planJson from "../data/plan.json";
import { JUNE_30_NEW_KPI_IDS, kpiNextTestDate, kpiTargetDisplay } from "./kpiDisplay";
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
  it("shows new KPIs with exact targets and the canonical Aug 20 schedule", () => {
    for (const id of JUNE_30_NEW_KPI_IDS) {
      const kpi = byId(id);

      expect(kpiTargetDisplay(kpi), id).toBe(newKpiTargets[id]);
      expect(kpiTargetDisplay(kpi), id).not.toBe("Set after baseline");
      expect(kpiNextTestDate(kpi, trainingPlan.days, "2026-08-13"), id).toBe("2026-08-20");
    }
  });

  it("keeps existing KPI target values and uses the same canonical schedule", () => {
    const sprint = byId("kpi-10-yard");
    expect(typeof sprint.targetValue).toBe("number");
    expect(kpiTargetDisplay(sprint)).toBe(`${sprint.targetValue} ${sprint.units}`);
    expect(kpiNextTestDate(sprint, trainingPlan.days, "2026-08-13")).toBe("2026-08-20");
  });

  it("does not introduce an active Pull-Up KPI", () => {
    expect(kpis.some((kpi) => /pull[- ]?up/i.test(`${kpi.id} ${kpi.name}`))).toBe(false);
  });
});
