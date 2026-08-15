import { describe, expect, it } from "vitest";
import { buildForwardPlanIntegrityMatrix, inspectForwardDate } from "./forwardPlanIntegrity";
import { projectCanonicalDay } from "./canonicalDay";
import { sportLoads } from "../imports/v8_4";

describe("parent-approved forward plan integrity", () => {
  it("passes every Aug 14-Sep 6 date or marks the approved unknown tryout window event-dependent", () => {
    const matrix = buildForwardPlanIntegrityMatrix();
    expect(matrix).toHaveLength(24);
    expect(matrix.filter((row) => row.verdict === "FAIL")).toEqual([]);
    expect(matrix.filter((row) => row.verdict === "INTENTIONAL_EVENT_DEPENDENT").map((row) => row.date)).toEqual([
      "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06",
    ]);
  });

  it.each([
    ["2026-08-14", 0], ["2026-08-17", 47], ["2026-08-18", 75], ["2026-08-19", 55],
    ["2026-08-20", 50], ["2026-08-21", 47], ["2026-08-22", 20], ["2026-08-29", 35],
    ["2026-08-30", 30], ["2026-08-31", 26], ["2026-09-02", 20],
  ])("locks displayed training duration for %s", (date, total) => expect(inspectForwardDate(date).trainingTotal).toBe(total));

  it("locks the parent-confirmed Aug 14-16 Marc O’Connor Sport Loads without changing Sunday 4v4", () => {
    const expected = [
      ["2026-08-14", 90, ["MARC-OCONNOR-2026-08-14"]],
      ["2026-08-15", 120, ["MARC-OCONNOR-2026-08-15"]],
      ["2026-08-16", 60, ["MARC-OCONNOR-2026-08-16", "4V4-2026-08-16"]],
    ] as const;
    for (const [date, marcMinutes, ids] of expected) {
      const day = projectCanonicalDay(date);
      expect(day.activities.filter((activity) => activity.summaryVisible).map((activity) => activity.id)).toEqual(ids);
      expect(day.sportLoads.find((load) => load.title === "Marc O’Connor Ice")?.plannedDurationMinutes).toBe(marcMinutes);
      expect(day.duration.projectedExecution.trainingWorkMinutes).toBe(0);
    }
    const sunday4v4 = sportLoads.find((load) => load.date === "2026-08-16" && load.sportLoad === "4v4 Hockey");
    expect(sunday4v4?.details).toBe("Bell Sensplex Myers Automotive Arena: 6:55-7:20 PM and 7:55-8:20 PM. Planned 4v4 hockey stimulus; possible Marc O’Connor same-day on-ice stack.");
  });

  it("references the exact existing Phase 5 Week 2 Speed Stack A prescription", () => {
    const day = projectCanonicalDay("2026-08-18");
    const stack = day.activities.find((activity) => activity.id === "SS-A-P5W2");
    expect(stack?.plannedDurationMinutes).toBe(55);
    expect(stack?.children?.map((child) => [child.title, child.plannedSets, child.plannedReps, child.tempo, child.rest])).toEqual([
      ["Sprint [Lateral Cross Under Start] or Broad Jump", 3, "15yd/side", "N/A", "30s"],
      ["Wall March Hold w/ Quick Switch", 3, "4/side", "0-5-0", "60s"],
      ["Towel ISO Lateral Squat", 3, "6s/side", "N/A", "30s"],
      ["Towel Body Saw to Pike Up", 3, "8", "1-0-0", "60s"],
      ["1.5 Rep Towel Leg Curl", 3, "8", "2-0-0", "30s"],
      ["Split Squat Wall Anti-Rotation Press Hold", 3, "10s/side", "N/A", "60s"],
      ["50-Yard Shuttle Run or Continuous Squat Jump", 2, "(9 x 8s)", "N/A", "52s/2min"],
    ]);
    expect(stack?.supportModules?.map((module) => module.title)).toEqual(["Warm-up", "Cooldown"]);
    expect(stack?.supportModules?.[0].groups.map((group) => group.title)).toEqual(["Get Mobile", "Get Stable", "Get Warm", "Get Activated"]);
    expect(stack?.supportModules?.[0].groups.flatMap((group) => group.exercises)).toHaveLength(18);
    expect(stack?.supportModules?.[0].groups.flatMap((group) => group.exercises).find((exercise) => exercise.title === "Plank")?.dose).toBe("30 sec");
    expect(stack?.supportModules?.[0].groups.flatMap((group) => group.exercises).find((exercise) => exercise.title === "Lateral Wall Push")?.dose).toBe("5 sec/side");
    expect(stack?.supportModules?.[1].groups[0].dose).toBe("2:00 OR 1:00/side");
    expect(stack?.supportModules?.[1].groups[0].exercises.map((exercise) => exercise.title)).toEqual(["Lying Figure 4 Glute Stretch", "Bretzel", "Kneeling Lat Stretch"]);
    expect(stack?.supportModules?.[1].instructions.filter((instruction) => instruction.includes("5-second inhale"))).toHaveLength(1);
    expect(new Set(stack?.supportModules?.map((module) => module.sourceDemo?.href))).toEqual(new Set(["https://www.youtube.com/playlist?list=PLAMIllZnMikBopeN4A4PgKYT8AImGsJEN"]));
  });

  it("keeps the KPI retest isolated and resolves the approved comparable battery", () => {
    const day = projectCanonicalDay("2026-08-20");
    expect(day.activities.filter((activity) => activity.summaryVisible).map((activity) => activity.id)).toEqual(["KPI-RETEST-2026-08-20"]);
    expect(day.kpi.kpiIds).toEqual([
      "kpi-10-yard", "kpi-broad-jump", "kpi-5105", "kpi-shot-accuracy", "kpi-puck-weave", "kpi-head-up-callout", "kpi-quick-hands", "kpi-plank-quality", "kpi-100m-sprint", "kpi-45-second-shuttle", "kpi-push-ups", "kpi-flexed-arm-hang", "kpi-zwift-bike-3x10s-peak-power", "kpi-vertical-jump",
    ]);
  });
});
