import { describe, expect, it } from "vitest";

import { buildPlanSportLoadOverlayRows, getPlanSportLoadOverlayItems, getPlanSportLoadOverlayItemsForWeek } from "./planSportLoadOverlay";

const fourVFourDates = [
  "2026-07-05",
  "2026-07-12",
  "2026-07-19",
  "2026-07-26",
  "2026-08-03",
  "2026-08-05",
  "2026-08-09",
  "2026-08-16",
  "2026-08-23",
];

describe("Plan Sport Load overlay", () => {
  it("derives the Bell Sensplex 4v4 overlay from v8.4 Sport Loads", () => {
    const items = getPlanSportLoadOverlayItems();
    const fourVFourItems = items.filter((item) => item.title === "4v4 Hockey" && item.details.includes("Bell Sensplex"));

    expect(fourVFourItems.map((item) => item.date)).toEqual(fourVFourDates);
    expect(fourVFourItems.every((item) => item.shortLabel === "4v4")).toBe(true);
    expect(fourVFourItems.every((item) => item.kind === "sport")).toBe(true);
  });

  it("preserves existing v8.4 Sport Loads in the plan overlay", () => {
    const visibleText = JSON.stringify(getPlanSportLoadOverlayItems());

    expect(visibleText).toContain("Toronto Trip");
    expect(visibleText).toContain("Carleton Ravens Camp");
    expect(visibleText).toContain("Marc O’Connor Ice");
    expect(visibleText).toContain("Sensplex Camp");
  });

  it("builds Gantt marker rows from v8.4 data without forbidden user-facing wording", () => {
    const rows = buildPlanSportLoadOverlayRows();
    const visibleText = JSON.stringify(rows);
    const fourVFourRow = rows.find((row) => row.label === "4v4 Hockey");

    expect(fourVFourRow?.markers.map((marker) => marker.date)).toEqual([
      "2026-06-15",
      "2026-06-22",
      ...fourVFourDates,
    ]);
    expect(visibleText).not.toMatch(/external load|overload|protected|limit extra work/i);
  });

  it("exposes stacked week Sport Loads for Plan week summaries", () => {
    const weekEight = getPlanSportLoadOverlayItemsForWeek(8);
    const visibleText = JSON.stringify(weekEight);

    expect(visibleText).toContain("Toronto Trip");
    expect(visibleText).toContain("Carleton Ravens Camp");
    expect(visibleText).toContain("4v4 Hockey");
  });
});
