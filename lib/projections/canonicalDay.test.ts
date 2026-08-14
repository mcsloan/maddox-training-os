import { describe, expect, it } from "vitest";

import { projectCanonicalDay } from "./canonicalDay";

describe("canonical Day view model", () => {
  it("uses the v8.4 session identity, title, activities, route, and duration diagnostics on Aug 12", () => {
    const day = projectCanonicalDay("2026-08-12");

    expect(day.title).toBe("Speed Stack B movement/upper/lower mix.");
    expect(day.title).not.toBe("Game-speed puck decisions");
    expect(day.sessionId).toBe("session-2026-08-12");
    expect(day.logging.trainingWorkHref).toBe("/session/session-2026-08-12");
    expect(day.activities.map((activity) => activity.athleteTitle)).toContain("Speed Stack B");
    expect(day.duration).toEqual({
      sessionEstimate: { minutes: 70, source: "v8.4_session", semanticScope: "unverified_session_estimate" },
      rawExecution: { trainingWorkMinutes: 105, sportLoadMinutes: 0, readinessReflectionMinutes: 5, otherMinutes: 0 },
      projectedExecution: { trainingWorkMinutes: 115, sportLoadMinutes: 0, readinessReflectionMinutes: 5, otherMinutes: 0 },
      comparisonStatus: "scope_unresolved",
    });
    expect(day.diagnostics).toContain("duration_scopes_require_source_review");
  });

  it.each([
    ["2026-08-11", 30],
    ["2026-07-23", 45],
  ])("owns projected controlled-cardio duration for %s", (date, expectedMinutes) => {
    const day = projectCanonicalDay(date);
    const cardio = day.activities.find((activity) => activity.athleteTitle === "Controlled bike or treadmill");
    const step = cardio ? day.presentation.executionSteps[cardio.sequenceOrder] : undefined;

    expect(cardio?.plannedDurationMinutes).toBe(expectedMinutes);
    expect(step?.plannedDurationMinutes).toBe(expectedMinutes);
  });

  it("keeps Aug 5 Sport Loads and source-derived activities separate without page-authored prescriptions", () => {
    const day = projectCanonicalDay("2026-08-05");

    expect(day.title).toBe("Camp is the main work; complete support mobility and light touches only.");
    expect(day.sportLoads).toHaveLength(2);
    expect(day.logging.sportLoadHrefs).toHaveLength(2);
    expect(day.logging.trainingWorkHref).toBe("/session/session-2026-08-05");
    expect(day.activities.map((activity) => activity.athleteTitle)).toEqual(expect.arrayContaining([
      "Carleton Ravens Camp",
      "4v4 Hockey",
      "Cooldown / mobility",
      "End-of-day reflection",
    ]));
    expect(day.activities.map((activity) => activity.athleteTitle)).not.toContain("Head-up puck touches — 10 minutes");
    expect(day.activities.map((activity) => activity.athleteTitle)).not.toContain("Accuracy shooting — 25 to 50 quality shots");
    const conditioning = day.activities.find((activity) => activity.category === "conditioning");
    expect(conditioning).toMatchObject({
      athleteTitle: "None Camp Provides Sport Conditioning",
      executable: false,
      logType: "none",
      required: false,
      optional: false,
      plannedDurationMinutes: undefined,
    });
    expect(day.activities.map((activity) => activity.athleteTitle)).not.toContain("Controlled bike or treadmill");
  });

  it("does not claim an executable KPI checkpoint on Jul 27", () => {
    const day = projectCanonicalDay("2026-07-27");

    expect(day.kpi.isCheckpoint).toBe(false);
    expect(day.kpi.kpiIds).toEqual([]);
    expect(day.activities.some((activity) => activity.category === "kpi")).toBe(false);
    expect(day.presentation.isKpiTestingDay).toBe(false);
    expect(day.presentation.chips.some((chip) => chip.kind === "perf-testing")).toBe(false);
    expect(day.presentation.ctas.some((cta) => cta.href === "/kpis")).toBe(false);
  });

  it("preserves the bounded June 30 five-step KPI exception", () => {
    const day = projectCanonicalDay("2026-06-30");

    expect(day.title).toBe("KPI Baseline / Technique Check");
    expect(day.kpi).toMatchObject({ isCheckpoint: true, exception: "june_30_kpi_presentation" });
    expect(day.activities.map((activity) => activity.athleteTitle)).toEqual([
      "Readiness check",
      "Warm-up / mobility",
      "KPI testing",
      "Cooldown / mobility",
      "End-of-day reflection",
    ]);
  });
});
