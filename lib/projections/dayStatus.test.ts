import { describe, expect, it } from "vitest";

import { deriveDayStatus, type DayStatusInput } from "./dayStatus";

describe("deriveDayStatus", () => {
  it("D01 returns sport_load_logged when only supported Sport Load evidence exists", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-d01-sport-load", kind: "sport_load" }],
      sportLoadLogs: [{ id: "fixture-d01-log", kind: "sport_load", status: "logged", supported: true }],
    });

    expect(status.status).toBe("sport_load_logged");
    expect(status.statuses).toContain("sport_load_logged");
    expect(status.hasSportLoadEvidence).toBe(true);
    expect(status.hasTrainingWorkEvidence).toBe(false);
  });

  it("D02 returns completed_with_deferred for completed KPI records plus explicit deferred KPI record", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-d02-baseline", kind: "kpi" }],
      kpiResults: [
        { id: "fixture-d02-baseline-result", kind: "kpi", status: "completed", completionPercent: 100 },
        { id: "fixture-d02-puck-weave-deferred", kind: "kpi", status: "deferred", deferred: true },
      ],
      reflections: [{ id: "fixture-d02-reflection", kind: "reflection", status: "saved" }],
    });

    expect(status.status).toBe("completed_with_deferred");
    expect(status.statuses).toContain("completed");
    expect(status.hasExplicitDeferral).toBe(true);
  });

  it("D05 0% session attempt cannot return completed", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-d05-training", kind: "training_work" }],
      sessionAttempts: [{ id: "fixture-d05-zero", kind: "training_work", status: "abandoned", completionPercent: 0 }],
    });

    expect(status.status).not.toBe("completed");
    expect(status.statuses).not.toContain("completed");
    expect(status.completionPercent).toBe(0);
  });

  it("D05 in-progress session attempt returns in_progress", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-d05-training", kind: "training_work" }],
      sessionAttempts: [{ id: "fixture-d05-active", kind: "training_work", status: "in-progress", completionPercent: 0 }],
    });

    expect(status.status).toBe("in_progress");
    expect(status.statuses).toContain("in_progress");
  });

  it("D05 interrupted session with some work completed returns partial", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-d05-training", kind: "training_work" }],
      sessionAttempts: [{ id: "fixture-d05-interrupted", kind: "training_work", status: "abandoned", completionPercent: 35 }],
      drillLogs: [{ id: "fixture-d05-drill", kind: "drill", status: "completed", completionPercent: 100 }],
    });

    expect(status.status).toBe("partial");
    expect(status.statuses).toContain("partial");
  });

  it("D10 legacy/orphan record returns legacy_needs_review", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-d10-training", kind: "training_work" }],
      legacyOrphanRecords: [{ id: "fixture-d10-legacy-workout", kind: "legacy", legacyNeedsReview: true }],
    });

    expect(status.status).toBe("legacy_needs_review");
    expect(status.statuses).toContain("legacy_needs_review");
    expect(status.statuses).not.toContain("completed");
  });

  it("local-only evidence exposes a caveat but does not erase status", () => {
    const status = deriveDayStatus({
      plannedActivities: [{ id: "fixture-local-sport-load", kind: "sport_load" }],
      sportLoadLogs: [
        {
          id: "fixture-local-sport-load-log",
          kind: "sport_load",
          status: "logged",
          syncState: "local-only",
          supported: true,
        },
      ],
    });

    expect(status.status).toBe("sport_load_logged");
    expect(status.caveats.hasLocalOnlyEvidence).toBe(true);
    expect(status.caveats.sync).toContain("local-only");
  });

  it("unsupported completion gap exposes a caveat and does not silently become completed", () => {
    const input: DayStatusInput = {
      plannedActivities: [{ id: "fixture-unsupported-training", kind: "training_work" }],
      sessionAttempts: [
        {
          id: "fixture-unsupported-complete",
          kind: "training_work",
          status: "completed",
          completionPercent: 100,
          supported: false,
        },
      ],
      unsupportedRecordFlags: ["record-not-supported"],
    };

    const status = deriveDayStatus(input);

    expect(status.status).not.toBe("completed");
    expect(status.statuses).not.toContain("completed");
    expect(status.caveats.hasUnsupportedCompletionGap).toBe(true);
    expect(status.caveats.unsupported).toContain("record-not-supported");
  });
});
