import { describe, expect, it } from "vitest";

import kpisJson from "../data/kpis.json";
import type { KPI } from "./types";

const kpis = kpisJson as KPI[];

const expectedNewKpiIds = [
  "kpi-100m-sprint",
  "kpi-45-second-shuttle",
  "kpi-push-ups",
  "kpi-flexed-arm-hang",
  "kpi-zwift-bike-3x10s-peak-power",
  "kpi-vertical-jump",
];

function byId(id: string) {
  return kpis.find((kpi) => kpi.id === id);
}

describe("KPI registry", () => {
  it("imports as a non-empty KPI list with unique ids", () => {
    expect(Array.isArray(kpis)).toBe(true);
    expect(kpis.length).toBeGreaterThan(0);

    const ids = kpis.map((kpi) => kpi.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every KPI compatible with the current numeric result model", () => {
    for (const kpi of kpis) {
      expect(kpi.id).toEqual(expect.any(String));
      expect(kpi.name).toEqual(expect.any(String));
      expect(kpi.category).toEqual(expect.any(String));
      expect(kpi.instructions.length).toBeGreaterThan(0);
      expect(kpi.units).toEqual(expect.any(String));
      expect(kpi.attempts).toBeGreaterThan(0);
      expect(["highest", "lowest"]).toContain(kpi.scoringMethod);
      expect(kpi.fields.length).toBeGreaterThan(0);
      expect(kpi.fields).toContainEqual(expect.objectContaining({
        id: "result",
        type: "number",
      }));
    }
  });

  it("includes today-safe new KPI protocols and excludes active pull-up testing", () => {
    for (const id of expectedNewKpiIds) expect(byId(id), id).toBeDefined();

    expect(kpis.some((kpi) => /pull[- ]?up/i.test(`${kpi.id} ${kpi.name}`))).toBe(false);
  });

  it("locks the 45-second shuttle to total metres scoring", () => {
    const shuttle = byId("kpi-45-second-shuttle");
    expect(shuttle).toMatchObject({
      name: "45-Second Hockey Shift Shuttle",
      units: "metres",
      attempts: 1,
      scoringMethod: "highest",
      fields: [
        expect.objectContaining({
          id: "result",
          label: "Total distance",
          type: "number",
          unit: "m",
        }),
      ],
    });
    const visibleText = [
      ...(shuttle?.instructions ?? []),
      ...(shuttle?.coachingNotes ?? []),
    ].join(" ");
    expect(visibleText).toMatch(/completed 10m length/i);
    expect(visibleText).toMatch(/partial final metres/i);
    expect(visibleText).toMatch(/total distance/i);
    expect(visibleText).toMatch(/0\.73/i);
  });

  it("locks Zwift bike power and flexed-arm hang scoring contracts", () => {
    const zwift = byId("kpi-zwift-bike-3x10s-peak-power");
    expect(zwift).toMatchObject({
      name: "Zwift Bike 3x10s Peak Power",
      units: "watts",
      attempts: 3,
      scoringMethod: "highest",
      fields: [
        expect.objectContaining({
          id: "result",
          type: "number",
          unit: "W",
        }),
      ],
    });
    const zwiftText = [
      ...(zwift?.instructions ?? []),
      ...(zwift?.coachingNotes ?? []),
    ].join(" ");
    expect(zwiftText).toMatch(/Free Ride/i);
    expect(zwiftText).toMatch(/not ERG/i);
    expect(zwiftText).toMatch(/Power Source/i);
    expect(zwiftText).toMatch(/Controllable/i);
    expect(zwiftText).toMatch(/10 seconds/i);
    expect(zwiftText).toMatch(/2 minutes/i);

    expect(byId("kpi-flexed-arm-hang")).toMatchObject({
      name: "Flexed-Arm Hang",
      units: "seconds",
      scoringMethod: "highest",
    });
  });

  it("keeps Puck-Control Weave defer-if-space-unavailable wording", () => {
    const puckWeave = byId("kpi-puck-weave");
    const visibleText = [
      ...(puckWeave?.instructions ?? []),
      ...(puckWeave?.coachingNotes ?? []),
      puckWeave?.safetyNotes ?? "",
    ].join(" ");

    expect(visibleText).toMatch(/space is unavailable/i);
    expect(visibleText).toMatch(/defer/i);
    expect(visibleText).toMatch(/do not force/i);
  });
});
