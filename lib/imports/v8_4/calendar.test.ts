import { describe, expect, it } from "vitest";

import { getV84DayExecutionEntries, getV84SportLoadsForDate } from "./daily";
import { getV84CalendarDates, getV84CalendarWeeks, getV84PlanDateRange } from "./calendar";
import { dayExecutionPlan, sportLoads } from "./index";
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

  it("imports Bell Sensplex 4v4 as planned Sport Load for each approved summer date", () => {
    const expected = [
      ["2026-07-05", "Canadian Tire Arena", "3:15-3:40 PM", "4:15-4:40 PM"],
      ["2026-07-12", "Myers Automotive Arena", "4:30-4:55 PM", "4:55-5:20 PM"],
      ["2026-07-19", "BrokerLink Arena", "3:30-3:55 PM", "3:55-4:20 PM"],
      ["2026-07-26", "Canadian Tire Arena", "2:15-2:40 PM", "2:40-3:05 PM"],
      ["2026-08-03", "BrokerLink Arena", "3:25-3:50 PM", "4:00-4:25 PM"],
      ["2026-08-05", "BrokerLink Arena", "7:00-7:25 PM", "7:25-7:50 PM"],
      ["2026-08-09", "Myers Automotive Arena", "4:30-4:55 PM", "4:55-5:20 PM"],
      ["2026-08-16", "Myers Automotive Arena", "6:55-7:20 PM", "7:55-8:20 PM"],
      ["2026-08-23", "Myers Automotive Arena", "3:25-3:50 PM", "4:00-4:25 PM"],
    ];

    for (const [date, arena, firstSlot, secondSlot] of expected) {
      const loads = getV84SportLoadsForDate(date);
      const fourOnFour = loads.find((load) => load.title === "4v4 Hockey");
      const entries = getV84DayExecutionEntries(date);
      const sourceLoad = sportLoads.find((load) => load.date === date && load.sportLoad === "4v4 Hockey");

      expect(fourOnFour, date).toBeTruthy();
      expect(fourOnFour?.type, date).toBe("on_ice_4v4");
      expect(fourOnFour?.notes, date).toContain("Bell Sensplex");
      expect(fourOnFour?.notes, date).toContain(arena);
      expect(fourOnFour?.notes, date).toContain(firstSlot);
      expect(fourOnFour?.notes, date).toContain(secondSlot);
      expect(fourOnFour?.notes, date).toMatch(/planned 4v4 hockey stimulus/i);
      expect(fourOnFour?.notes, date).not.toMatch(/external|protected|risk|limit extra work/i);
      expect(sourceLoad?.planRule, date).toContain("4v4 is planned hockey stimulus");
      expect(sourceLoad?.planRule, date).not.toMatch(/external|protected|risk|limit extra work/i);
      expect(entries.some((entry) => entry.entryType === "Sport Load" && entry.entryTitle === "4v4 Hockey"), date).toBe(true);
    }
  });

  it("preserves same-day existing Sport Loads and creates no completed logs", () => {
    expect(getV84SportLoadsForDate("2026-08-03").map((load) => load.title)).toEqual(["Toronto Trip", "4v4 Hockey"]);
    expect(getV84SportLoadsForDate("2026-08-05").map((load) => load.title)).toEqual(["Carleton Ravens Camp", "4v4 Hockey"]);
    expect(getV84SportLoadsForDate("2026-08-16").map((load) => load.title)).toEqual(["Marc O’Connor Ice", "4v4 Hockey"]);
    expect(getV84SportLoadsForDate("2026-08-23").map((load) => load.title)).toEqual(["4v4 Hockey"]);
    expect(JSON.stringify(sportLoads)).not.toContain("external_load");
  });

  it("keeps updated v8.4 import counts aligned with the 4v4 source import", () => {
    expect(sportLoads).toHaveLength(37);
    expect(dayExecutionPlan).toHaveLength(630);
  });
});
