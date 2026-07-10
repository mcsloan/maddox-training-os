import { describe, expect, it } from "vitest";

import {
  buildPlanSportLoadOverlayRows,
  getDayColumnIndex,
  getPlanSportLoadOverlayItems,
  getPlanSportLoadOverlayItemsForWeek,
  getSpanGridColumns,
  getTimelineDays,
  getWeekForDate,
} from "./planSportLoadOverlay";

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

const fourVFourDayMap = new Map([
  ["2026-07-05", "S"],
  ["2026-07-12", "S"],
  ["2026-07-19", "S"],
  ["2026-07-26", "S"],
  ["2026-08-03", "M"],
  ["2026-08-05", "W"],
  ["2026-08-09", "S"],
  ["2026-08-16", "S"],
  ["2026-08-23", "S"],
]);

describe("Plan Sport Load overlay", () => {
  it("builds a daily 12-week Gantt timeline from v8.4 phase dates", () => {
    const timeline = getTimelineDays();
    const weekSeven = timeline.filter((day) => day.week === 7).map((day) => day.date);
    const weekEight = timeline.filter((day) => day.week === 8).map((day) => day.date);
    const augThree = timeline.find((day) => day.date === "2026-08-03");

    expect(timeline).toHaveLength(84);
    expect(weekSeven).toEqual(["2026-07-27", "2026-07-28", "2026-07-29", "2026-07-30", "2026-07-31", "2026-08-01", "2026-08-02"]);
    expect(weekEight).toEqual(["2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08", "2026-08-09"]);
    expect(getWeekForDate("2026-08-03")).toBe(8);
    expect(augThree).toMatchObject({ week: 8, dayOfWeek: 0, dayLabel: "M", dayOfMonth: 3 });
  });

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
      displayKind: "marker",
      startDate: "2026-08-03",
      endDate: "2026-08-03",
      startOffset: getDayColumnIndex("2026-08-03"),
      endOffset: getDayColumnIndex("2026-08-03"),
    });
    expect(getSpanGridColumns("2026-08-03", "2026-08-03")).toEqual({ startColumn: 50, endColumn: 51 });
    expect(marcRow?.markers.map((marker) => marker.dateLabel)).toEqual(["Jul 18", "Jul 25", "Aug 15", "Aug 16"]);
    expect(marcRow?.markers.every((marker) => marker.durationKind === "single-day")).toBe(true);
    expect(marcRow?.markers.every((marker) => marker.displayKind === "marker")).toBe(true);
  });

  it("maps each approved 4v4 date to the expected week and daily Gantt column", () => {
    const timeline = getTimelineDays();

    for (const date of fourVFourDates) {
      const day = timeline.find((entry) => entry.date === date);

      expect(day?.week, date).toBe(fourVFourWeekMap.get(date));
      expect(day?.dayLabel, date).toBe(fourVFourDayMap.get(date));
      expect(getDayColumnIndex(date), date).toBe(timeline.findIndex((entry) => entry.date === date));
    }
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
        startOffset: getDayColumnIndex("2026-07-31"),
        endOffset: getDayColumnIndex("2026-08-03"),
        dateLabel: "Jul 31-Aug 3",
        durationKind: "multi-day",
        displayKind: "bar",
      }),
    ]);
    expect(getSpanGridColumns("2026-07-31", "2026-08-03")).toEqual({ startColumn: 47, endColumn: 51 });
    expect(chaseCamp?.markers).toEqual([
      expect.objectContaining({ week: 4, startDate: "2026-07-06", endDate: "2026-07-10", dateLabel: "Jul 6-10", durationKind: "multi-day", displayKind: "bar" }),
    ]);
    expect(carletonCamp?.markers).toEqual([
      expect.objectContaining({ week: 8, startDate: "2026-08-04", endDate: "2026-08-07", dateLabel: "Aug 4-7", durationKind: "multi-day", displayKind: "bar" }),
    ]);
    expect(sensplexCamp?.markers).toEqual([
      expect.objectContaining({ week: 11, startDate: "2026-08-24", endDate: "2026-08-28", dateLabel: "Aug 24-28", durationKind: "multi-day", displayKind: "bar" }),
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
