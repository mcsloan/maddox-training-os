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

const fourVFourWeekMap = new Map([
  ["2026-07-05", 3],
  ["2026-07-12", 4],
  ["2026-07-19", 5],
  ["2026-07-26", 6],
  ["2026-08-03", 8],
  ["2026-08-05", 8],
  ["2026-08-09", 8],
  ["2026-08-16", 9],
  ["2026-08-23", 10],
]);

describe("Plan Sport Load overlay", () => {
  it("derives the Bell Sensplex 4v4 overlay from v8.4 Sport Loads", () => {
    const items = getPlanSportLoadOverlayItems();
    const fourVFourItems = items.filter((item) => item.title === "4v4 Hockey" && item.details.includes("Bell Sensplex"));

    expect(fourVFourItems.map((item) => item.date)).toEqual(fourVFourDates);
    expect(fourVFourItems.every((item) => item.shortLabel === "4v4")).toBe(true);
    expect(fourVFourItems.every((item) => item.kind === "sport")).toBe(true);
    for (const item of fourVFourItems) {
      expect(item.week).toBe(fourVFourWeekMap.get(item.date));
    }
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
    expect(fourVFourRow?.markers.map((marker) => marker.dateLabel)).toContain("Aug 3");
    expect(visibleText).not.toMatch(/external load|overload|protected|limit extra work/i);
  });

  it("keeps single-day Sport Loads as date-specific markers", () => {
    const rows = buildPlanSportLoadOverlayRows();
    const fourVFourRow = rows.find((row) => row.label === "4v4 Hockey");
    const augThree = fourVFourRow?.markers.find((marker) => marker.startDate === "2026-08-03");
    const marcRow = rows.find((row) => row.label === "Marc O’Connor Ice");

    expect(augThree).toMatchObject({
      week: 8,
      dateLabel: "Aug 3",
      durationKind: "single-day",
      startDate: "2026-08-03",
      endDate: "2026-08-03",
    });
    expect(marcRow?.markers.map((marker) => marker.dateLabel)).toEqual(["Jul 18", "Jul 25", "Aug 15", "Aug 16"]);
    expect(marcRow?.markers.every((marker) => marker.durationKind === "single-day")).toBe(true);
  });

  it("keeps multi-day Sport Loads as actual date ranges", () => {
    const rows = buildPlanSportLoadOverlayRows();
    const torontoTrip = rows.find((row) => row.label === "Toronto Trip");
    const chaseCamp = rows.find((row) => row.label === "Chase Hull Camp");
    const carletonCamp = rows.find((row) => row.label === "Carleton Ravens Camp");
    const sensplexCamp = rows.find((row) => row.label === "Sensplex Camp");

    expect(torontoTrip?.markers).toEqual([
      expect.objectContaining({
        week: 7,
        startDate: "2026-07-31",
        endDate: "2026-08-03",
        dateLabel: "Jul 31-Aug 3",
        durationKind: "multi-day",
      }),
      expect.objectContaining({
        week: 8,
        startDate: "2026-07-31",
        endDate: "2026-08-03",
        dateLabel: "Jul 31-Aug 3",
        durationKind: "multi-day",
      }),
    ]);
    expect(chaseCamp?.markers).toEqual([
      expect.objectContaining({ week: 4, startDate: "2026-07-06", endDate: "2026-07-10", dateLabel: "Jul 6-10", durationKind: "multi-day" }),
    ]);
    expect(carletonCamp?.markers).toEqual([
      expect.objectContaining({ week: 8, startDate: "2026-08-04", endDate: "2026-08-07", dateLabel: "Aug 4-7", durationKind: "multi-day" }),
    ]);
    expect(sensplexCamp?.markers).toEqual([
      expect.objectContaining({ week: 11, startDate: "2026-08-24", endDate: "2026-08-28", dateLabel: "Aug 24-28", durationKind: "multi-day" }),
    ]);
  });

  it("exposes stacked week Sport Loads for Plan week summaries", () => {
    const weekEight = getPlanSportLoadOverlayItemsForWeek(8);
    const visibleText = JSON.stringify(weekEight);

    expect(visibleText).toContain("Toronto Trip");
    expect(visibleText).toContain("Carleton Ravens Camp");
    expect(visibleText).toContain("4v4 Hockey");
  });
});
