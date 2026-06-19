import { describe, expect, it } from "vitest";

import { getV84SessionDrills } from "./session";

describe("v8.4 session adapter", () => {
  it("renders Speed Stack C Week 3 prescription detail from v8.4 metadata", () => {
    const drills = getV84SessionDrills("session-2026-06-19");
    const splitSquat = drills.find((drill) => drill.name === "Prisoner Rear Foot Elevated Split Squat Hold");
    const handPlank = drills.find((drill) => drill.name === "Hand Plank");
    const shooting = drills.find((drill) => drill.name === "100-Shot Skill Shooting");

    expect(splitSquat).toMatchObject({
      plannedSets: 4,
      plannedDuration: 45,
      plannedPrescription: "4 x 45s/side",
      plannedRest: "30s",
      plannedGroup: "A superset",
      sourceCode: "A1",
      sourcePage: "PDF p.8",
    });
    expect(splitSquat?.coachingCues).toContain("Keep a slight forward shin angle so front knee is over toe");
    expect(handPlank).toMatchObject({
      plannedSets: 4,
      plannedDuration: 45,
      plannedPrescription: "4 x 45s",
      plannedRest: "60s",
    });
    expect(shooting).toMatchObject({
      plannedReps: 100,
      plannedPrescription: "100 shots",
      plannedRest: "Reset between shots; rest as needed for clean mechanics",
    });
    expect(shooting?.instructions.join(" ")).toContain("Log shots taken in Actual reps");
  });
});
