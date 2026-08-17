import { describe, expect, it } from "vitest";
import { getV84CalendarWeeks } from "./imports/v8_4/calendar";
import { localCalendarDate, orderCalendarWeeks } from "./calendarCompact";

describe("compact Calendar contracts", () => {
  it("puts the current week first, then future weeks, then past weeks without duplication", () => {
    const ordered = orderCalendarWeeks(getV84CalendarWeeks(), "2026-08-16");
    expect(ordered.map((week) => week.weekNumber)).toEqual([9, 10, 11, 12, 8, 7, 6, 5, 4, 3, 2, 1]);
    expect(new Set(ordered.map((week) => week.weekNumber))).toHaveLength(12);
  });

  it("falls back to chronological ordering outside the plan range", () => {
    expect(orderCalendarWeeks(getV84CalendarWeeks(), "2027-01-01").map((week) => week.weekNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("uses local calendar parts instead of UTC serialization", () => {
    const localLateEvening = new Date(2026, 7, 16, 23, 45);
    expect(localCalendarDate(localLateEvening)).toBe("2026-08-16");
  });

});
