import { describe, expect, it } from "vitest";

import { getV84SportLoadsForDate } from "./daily";
import { getV84CalendarDates, getV84CalendarWeeks, getV84PlanDateRange } from "./calendar";
import { getV84SessionByDate } from "./session";
import legacyPlanJson from "../../../data/plan.json";
import legacyExternalLoadsJson from "../../../data/externalLoads.json";

describe("v8.4 calendar coverage", () => {
  it("uses the v8.4 plan range and includes all 84 planned dates", () => {
    expect(getV84PlanDateRange()).toEqual({ startDate: "2026-06-15", endDate: "2026-09-06" });
    expect(getV84CalendarDates()).toHaveLength(84);
  });

  it("includes v8.4-only June 20 and June 21 in Week 1", () => {
    const week1 = getV84CalendarWeeks().find((week) => week.weekNumber === 1);

    expect(week1?.dates).toEqual([
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
      "2026-06-21",
    ]);
    expect(getV84SessionByDate("2026-06-20")?.summary).toBe("Game-speed skill and shooting volume.");
    expect(getV84SessionByDate("2026-06-21")?.summary).toBe("Recovery, mobility, and week reset.");
  });

  it("does not rely on legacy data/plan.json coverage", () => {
    const legacyDates = Array.from(new Set([
      ...legacyPlanJson.days.map((day) => day.date),
      ...legacyExternalLoadsJson.map((load) => load.date),
    ])).sort();
    const v84Dates = getV84CalendarDates();

    expect(legacyDates).not.toContain("2026-06-20");
    expect(legacyDates).not.toContain("2026-06-21");
    expect(v84Dates).toContain("2026-06-20");
    expect(v84Dates).toContain("2026-06-21");
  });

  it("keeps sport-load source availability for June 15 and June 17", () => {
    expect(getV84SportLoadsForDate("2026-06-15")).toHaveLength(1);
    expect(getV84SportLoadsForDate("2026-06-17")).toHaveLength(1);
  });
});
