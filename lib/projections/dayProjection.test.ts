import { describe, expect, it } from "vitest";

import { buildDayProjection } from "./dayProjection";

describe("buildDayProjection", () => {
  it("D01 builds a Sport Load-only projection with sport_load_logged status", () => {
    const projection = buildDayProjection({
      date: "2026-06-15",
      weekNumber: 1,
      dayTitle: "D01 Sport Load",
      plannedActivities: [{ id: "fixture-d01-sport-load", kind: "sport_load" }],
      sportLoadLogs: [{ id: "fixture-d01-log", kind: "sport_load", status: "logged", supported: true }],
    });

    expect(projection.date).toBe("2026-06-15");
    expect(projection.weekNumber).toBe(1);
    expect(projection.displayTitle).toBe("D01 Sport Load");
    expect(projection.status.status).toBe("sport_load_logged");
    expect(projection.summaryLabel).toBe("Sport Load logged");
    expect(projection.hasSportLoad).toBe(true);
    expect(projection.hasTrainingWork).toBe(false);
    expect(projection.records.sportLoadLogs).toHaveLength(1);
  });

  it("D02 projects KPI baseline completion with explicit deferred Puck Weave", () => {
    const projection = buildDayProjection({
      date: "2026-06-16",
      dayTitle: "D02 KPI baseline",
      plannedActivities: [{ id: "fixture-d02-baseline", kind: "kpi" }],
      kpiResults: [
        { id: "fixture-d02-kpi-result", kind: "kpi", status: "completed", completionPercent: 100 },
        { id: "fixture-d02-puck-weave", kind: "kpi", status: "deferred", deferred: true },
      ],
      reflections: [{ id: "fixture-d02-reflection", kind: "reflection", status: "saved" }],
    });

    expect(projection.status.status).toBe("completed_with_deferred");
    expect(projection.hasKpiResults).toBe(true);
    expect(projection.hasReflection).toBe(true);
    expect(projection.status.hasExplicitDeferral).toBe(true);
  });

  it("D05 projects an in-progress interrupted session according to status input", () => {
    const projection = buildDayProjection({
      date: "2026-06-20",
      plannedActivities: [{ id: "fixture-d05-training", kind: "training_work" }],
      sessionAttempts: [{ id: "fixture-d05-active", kind: "training_work", status: "in-progress", completionPercent: 0 }],
    });

    expect(projection.status.status).toBe("in_progress");
    expect(projection.hasTrainingWork).toBe(true);
    expect(projection.records.sessionAttempts).toHaveLength(1);
  });

  it("D05 projects an abandoned interrupted session with completed subset as partial", () => {
    const projection = buildDayProjection({
      date: "2026-06-20",
      plannedActivities: [{ id: "fixture-d05-training", kind: "training_work" }],
      sessionAttempts: [{ id: "fixture-d05-abandoned", kind: "training_work", status: "abandoned", completionPercent: 25 }],
      drillLogs: [{ id: "fixture-d05-drill", kind: "drill", status: "completed", completionPercent: 100 }],
    });

    expect(projection.status.status).toBe("partial");
    expect(projection.hasTrainingWork).toBe(true);
    expect(projection.records.drillLogs).toHaveLength(1);
  });

  it("D10 projects legacy/orphan records as needs review without real completion", () => {
    const projection = buildDayProjection({
      date: "2026-06-24",
      plannedActivities: [{ id: "fixture-d10-training", kind: "training_work" }],
      legacyOrphanRecords: [{ id: "fixture-d10-orphan", kind: "legacy", legacyNeedsReview: true }],
    });

    expect(projection.status.status).toBe("legacy_needs_review");
    expect(projection.hasLegacyReview).toBe(true);
    expect(projection.requiresManualReview).toBe(true);
    expect(projection.status.statuses).not.toContain("completed");
  });

  it("projects empty planned days as planned for preview and not_started for execution", () => {
    const preview = buildDayProjection({
      date: "2026-06-30",
      plannedActivities: [{ id: "fixture-empty-preview-training", kind: "training_work" }],
      projection: "preview",
    });
    const execution = buildDayProjection({
      date: "2026-06-30",
      plannedActivities: [{ id: "fixture-empty-execution-training", kind: "training_work" }],
      projection: "execution",
    });

    expect(preview.status.status).toBe("planned");
    expect(execution.status.status).toBe("not_started");
  });

  it("keeps local-only evidence status while surfacing caveat flags", () => {
    const projection = buildDayProjection({
      date: "2026-06-15",
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

    expect(projection.status.status).toBe("sport_load_logged");
    expect(projection.isLocalOnly).toBe(true);
    expect(projection.caveats.sync).toContain("local-only");
  });

  it("surfaces unsupported export and storage gaps without inventing completion", () => {
    const projection = buildDayProjection({
      date: "2026-06-21",
      plannedActivities: [{ id: "fixture-unsupported-training", kind: "training_work" }],
      sessionAttempts: [
        {
          id: "fixture-unsupported-session",
          kind: "training_work",
          status: "completed",
          completionPercent: 100,
          supported: false,
        },
      ],
      unsupportedRecordFlags: ["record-not-supported", "export-not-supported"],
    });

    expect(projection.status.statuses).not.toContain("completed");
    expect(projection.hasUnsupportedRecordGap).toBe(true);
    expect(projection.hasExportGap).toBe(true);
    expect(projection.caveats.unsupported).toContain("record-not-supported");
    expect(projection.caveats.unsupported).toContain("export-not-supported");
  });
});
