import { describe, expect, it } from "vitest";
import { getDateStringForTimeZone, getLocalDateString } from "./localDate";

describe("local training date helpers", () => {
  it("formats a Date from local calendar parts instead of UTC ISO parts", () => {
    const localEvening = new Date(2026, 5, 30, 20, 7, 57, 858);

    expect(getLocalDateString(localEvening)).toBe("2026-06-30");
  });

  it("keeps the June 30 Eastern training date for a July 1 UTC timestamp", () => {
    const lateEasternEntry = new Date("2026-07-01T00:07:57.858Z");

    expect(getDateStringForTimeZone(lateEasternEntry, "America/Toronto")).toBe("2026-06-30");
    expect(getDateStringForTimeZone(lateEasternEntry, "UTC")).toBe("2026-07-01");
  });
});
