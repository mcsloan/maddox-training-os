import { describe, expect, it } from "vitest";

import { calculateShuttleTotalMetres } from "./kpiShuttle";

describe("45-second shuttle total distance helper", () => {
  it("computes completed lengths plus partial final metres", () => {
    expect(calculateShuttleTotalMetres("10", "0.73")).toBe(100.73);
    expect(calculateShuttleTotalMetres(9, 4.5)).toBe(94.5);
  });

  it("rejects invalid shuttle inputs", () => {
    expect(calculateShuttleTotalMetres("", "0.73")).toBeNull();
    expect(calculateShuttleTotalMetres("1.5", "0")).toBeNull();
    expect(calculateShuttleTotalMetres("-1", "0")).toBeNull();
    expect(calculateShuttleTotalMetres("10", "-0.1")).toBeNull();
    expect(calculateShuttleTotalMetres("10", "10")).toBeNull();
    expect(calculateShuttleTotalMetres("0", "0")).toBeNull();
  });
});
