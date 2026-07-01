import { describe, expect, it } from "vitest";

import kpisJson from "../data/kpis.json";
import planJson from "../data/plan.json";
import { buildKpiHydratedExport } from "./kpiExport";
import type { KPI, TrainingPlan } from "./types";
import type { HydratedKpiResult } from "./kpiExport";

const kpis = kpisJson as KPI[];
const trainingPlan = planJson as TrainingPlan;

const june30Results: HydratedKpiResult[] = [
  result("kpi-5105", 5.86),
  result("kpi-10-yard", 2.13),
  result("kpi-broad-jump", 134),
  result("kpi-broad-jump", 142, "2026-06-16"),
  result("kpi-shot-accuracy", 3),
  result("kpi-puck-weave", 8.66),
  result("kpi-head-up-callout", 100),
  result("kpi-quick-hands", 95),
  result("kpi-plank-quality", 93),
  result("kpi-100m-sprint", 19.33),
  result("kpi-45-second-shuttle", 118.7),
  result("kpi-push-ups", 15),
  result("kpi-flexed-arm-hang", 2.33),
  result("kpi-zwift-bike-3x10s-peak-power", 357),
  result("kpi-vertical-jump", 27.305),
];

describe("KPI hydrated page export", () => {
  it("exports visible scoreboard rows, entries, counts, and metadata from hydrated state", () => {
    const output = buildKpiHydratedExport({
      generatedAt: "2026-07-01T12:00:00.000Z",
      environmentBadge: "v0.1.0 · test · local",
      cloudSyncStatus: "Cloud synced",
      pageUrl: "http://localhost:3000/kpis",
      kpis,
      days: trainingPlan.days,
      results: june30Results,
      today: "2026-07-01",
    });

    expect(output.source).toBe("kpis-page-hydrated-state");
    expect(output.environmentBadge).toBe("v0.1.0 · test · local");
    expect(output.cloudSyncStatus).toBe("Cloud synced");
    expect(output.pageUrl).toBe("http://localhost:3000/kpis");
    expect(output.entries).toHaveLength(15);
    expect(output.missingExpectedKpis).toEqual([]);
    expect(output.countByDate["2026-06-30"]).toBe(14);
    expect(output.countByDate["2026-06-16"]).toBe(1);
    expect(output.countByKpi["kpi-shot-accuracy"]).toBe(1);
    expect(output.countByKpi["kpi-broad-jump"]).toBe(2);
    expect(output.latestByKpi["kpi-zwift-bike-3x10s-peak-power"]?.bestResult).toBe(357);
    expect(output.scoreboardRows.find((row) => row.kpiId === "kpi-5105")).toMatchObject({ currentBest: 5.86 });
    expect(output.scoreboardRows.find((row) => row.kpiId === "kpi-broad-jump")).toMatchObject({ currentBest: 142 });
    expect(output.scoreboardRows.find((row) => row.kpiId === "kpi-vertical-jump")).toMatchObject({ currentBest: 27.305 });
    expect(JSON.stringify(output)).toContain("134");
    expect(JSON.stringify(output)).toContain("142");
    expect(JSON.stringify(output)).toContain("118.7");
    expect(JSON.stringify(output)).toContain("2.33");
  });
});

function result(kpiId: string, bestResult: number, date = "2026-06-30"): HydratedKpiResult {
  return {
    id: `${kpiId}-fixture`,
    kpiId,
    date,
    enteredAt: `${date}T12:${String(Math.round(bestResult)).padStart(2, "0")}:00.000Z`,
    bestResult,
    attempts: [{ result: String(bestResult) }],
    notes: "",
    syncState: "cloud",
  };
}
