import { describe, expect, it } from "vitest";

import { getV84SportLoadsForDate } from "./imports/v8_4/daily";
import { buildDaySportLoadPlanItems, buildDaySportLoadSummaryLabel } from "./daySportLoadPlan";

describe("Day Sport Load simple plan items", () => {
  it("keeps every stacked planned Sport Load visible and actionable", () => {
    const expected = [
      ["2026-08-03", "Toronto Trip", "4v4 Hockey"],
      ["2026-08-05", "Carleton Ravens Camp", "4v4 Hockey"],
      ["2026-08-16", "Marc O’Connor Ice", "4v4 Hockey"],
    ];

    for (const [date, existingLoad, addedLoad] of expected) {
      const items = buildDaySportLoadPlanItems(getV84SportLoadsForDate(date));
      const visibleText = JSON.stringify(items);

      expect(items, date).toHaveLength(2);
      expect(items.map((item) => item.label), date).toEqual(["A", "B"]);
      expect(visibleText, date).toContain(existingLoad);
      expect(visibleText, date).toContain(addedLoad);
      expect(items.every((item) => item.href.startsWith("/external-load/")), date).toBe(true);
      expect(items.every((item) => item.status === "planned / not logged until saved"), date).toBe(true);
      expect(buildDaySportLoadSummaryLabel(getV84SportLoadsForDate(date)), date).toEqual({
        text: "2 Sport Loads Planned",
        lowerText: "2 sport loads planned",
        verb: "are",
      });
      expect(visibleText, date).not.toMatch(/external load|overload|protected|limit extra work/i);
    }
  });

  it("preserves non-stacked planned Sport Load visibility", () => {
    const items = buildDaySportLoadPlanItems(getV84SportLoadsForDate("2026-07-05"));
    const visibleText = JSON.stringify(items);

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(expect.objectContaining({
      label: "A",
      title: "4v4 Hockey",
      status: "planned / not logged until saved",
    }));
    expect(buildDaySportLoadSummaryLabel(getV84SportLoadsForDate("2026-07-05"))).toEqual({
      text: "4v4 Hockey",
      lowerText: "4v4 hockey",
      verb: "is",
    });
    expect(visibleText).not.toContain("Lacrosse");
    expect(buildDaySportLoadSummaryLabel(getV84SportLoadsForDate("2026-07-05")).text).not.toContain("Lacrosse");
    expect(visibleText).not.toMatch(/external load|overload|protected|limit extra work/i);
  });

  it("uses a Lacrosse label only for actual lacrosse planned Sport Loads", () => {
    const lacrosseItems = buildDaySportLoadPlanItems(getV84SportLoadsForDate("2026-06-17"));
    const lacrosseSummary = buildDaySportLoadSummaryLabel(getV84SportLoadsForDate("2026-06-17"));
    const fourOnFourSummary = buildDaySportLoadSummaryLabel(getV84SportLoadsForDate("2026-07-05"));

    expect(lacrosseItems.some((item) => item.title.includes("Lacrosse"))).toBe(true);
    expect(lacrosseSummary.text).toContain("Lacrosse");
    expect(fourOnFourSummary.text).not.toContain("Lacrosse");
  });
});
