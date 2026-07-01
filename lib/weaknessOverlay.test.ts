import { describe, expect, it } from "vitest";

import { getWeaknessOverlayForDate, getWeaknessOverlaySchedule } from "./weaknessOverlay";

describe("weakness overlay", () => {
  it("covers July 1 through July 14 with camp-adjusted July 6-10 rules", () => {
    const schedule = getWeaknessOverlaySchedule();

    expect(schedule.map((day) => day.date)).toEqual([
      "2026-07-01",
      "2026-07-02",
      "2026-07-03",
      "2026-07-04",
      "2026-07-05",
      "2026-07-06",
      "2026-07-07",
      "2026-07-08",
      "2026-07-09",
      "2026-07-10",
      "2026-07-11",
      "2026-07-12",
      "2026-07-13",
      "2026-07-14",
    ]);

    for (const date of ["2026-07-06", "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10"]) {
      const overlay = getWeaknessOverlayForDate(date);
      const text = JSON.stringify(overlay);
      expect(overlay?.day.campAdjustment, date).toBe(true);
      expect(text, date).toContain("Camp is the primary stimulus.");
      expect(text, date).toContain("No conditioning add-ons.");
      expect(text, date).toContain("No max hang testing.");
    }
  });

  it("projects July 1 and July 14 overlay items without replacing the base plan", () => {
    const july1 = getWeaknessOverlayForDate("2026-07-01");
    const july14 = getWeaknessOverlayForDate("2026-07-14");

    expect(july1?.title).toBe("Weakness Overlay");
    expect(july1?.status).toBe("reviewable_additive_overlay");
    expect(july1?.day.items.map((item) => item.label)).toEqual([
      "Shooting Accuracy Rebuild",
      "Pull Strength / Flexed-Arm Hang",
    ]);
    expect(july14?.day.items.map((item) => item.label)).toEqual([
      "Speed / Agility Maintenance",
      "Elastic Power / Landing Mechanics",
    ]);
    expect(july1?.subtitle).toContain("Add-on work based on June 30 KPI results");
  });
});
