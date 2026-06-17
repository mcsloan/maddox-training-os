import { describe, expect, it } from "vitest";

import { buildDayProjection } from "./dayProjection";
import {
  buildCalendarDayProjection,
  buildDashboardDayProjection,
  buildHistoryDayProjection,
  buildKpiDayProjection,
  buildTodayScreenProjection,
  buildWeekDashboardProjection,
} from "./screenProjections";

describe("screen projections", () => {
  it("D01 Sport Load-only day projects consistently across Calendar, History, and Dashboard", () => {
    const day = buildDayProjection({
      date: "2026-06-15",
      dayTitle: "D01 Sport Load",
      plannedActivities: [{ id: "fixture-d01-sport-load", kind: "sport_load" }],
      sportLoadLogs: [{ id: "fixture-d01-log", kind: "sport_load", status: "logged", completionPercent: 100 }],
    });

    const calendar = buildCalendarDayProjection(day);
    const history = buildHistoryDayProjection(day);
    const dashboard = buildDashboardDayProjection(day);

    expect(calendar.status).toBe("sport_load_logged");
    expect(calendar.status).not.toBe("not_started");
    expect(calendar.hasLoggedSportLoad).toBe(true);
    expect(history.groups.sportLoad.hasRecords).toBe(true);
    expect(history.groups.trainingWork.hasRecords).toBe(false);
    expect(dashboard.hasSportLoad).toBe(true);
    expect(dashboard.hasTrainingWork).toBe(false);
  });

  it("D02 KPI baseline keeps completed_with_deferred and counts completed/deferred KPI records separately", () => {
    const day = buildDayProjection({
      date: "2026-06-16",
      plannedActivities: [{ id: "fixture-d02-kpi", kind: "kpi" }],
      kpiResults: [
        { id: "fixture-d02-baseline", kind: "kpi", status: "completed", completionPercent: 100 },
        { id: "fixture-d02-puck-weave", kind: "kpi", status: "deferred", deferred: true },
      ],
      reflections: [{ id: "fixture-d02-reflection", kind: "reflection", status: "saved", completionPercent: 100 }],
    });

    const kpi = buildKpiDayProjection(day);
    const today = buildTodayScreenProjection(day);
    const calendar = buildCalendarDayProjection(day);

    expect(kpi.completedKpiCount).toBe(1);
    expect(kpi.deferredKpiCount).toBe(1);
    expect(kpi.missingKpiCount).toBe(0);
    expect(today.status).toBe("completed_with_deferred");
    expect(calendar.status).toBe("completed_with_deferred");
  });

  it("D05 partial/interrupted session shows attention and does not report dashboard completion", () => {
    const day = buildDayProjection({
      date: "2026-06-20",
      plannedActivities: [{ id: "fixture-d05-training", kind: "training_work" }],
      sessionAttempts: [{ id: "fixture-d05-session", kind: "training_work", status: "abandoned", completionPercent: 35 }],
      drillLogs: [{ id: "fixture-d05-drill", kind: "drill", status: "completed", completionPercent: 100 }],
    });

    const today = buildTodayScreenProjection(day);
    const dashboard = buildDashboardDayProjection(day);

    expect(today.status).toBe("partial");
    expect(today.isIncomplete).toBe(true);
    expect(today.attentionLabels).toContain("Incomplete");
    expect(dashboard.isCompleted).toBe(false);
    expect(dashboard.attentionFlags).toContain("Incomplete");
  });

  it("D10 legacy/orphan requires manual review across Calendar, History, and Dashboard", () => {
    const day = buildDayProjection({
      date: "2026-06-24",
      plannedActivities: [{ id: "fixture-d10-training", kind: "training_work" }],
      legacyOrphanRecords: [{ id: "fixture-d10-legacy", kind: "legacy", legacyNeedsReview: true }],
    });

    expect(buildCalendarDayProjection(day).requiresManualReview).toBe(true);
    expect(buildHistoryDayProjection(day).requiresManualReview).toBe(true);
    expect(buildHistoryDayProjection(day).groups.legacy.hasRecords).toBe(true);
    expect(buildDashboardDayProjection(day).requiresManualReview).toBe(true);
    expect(buildDashboardDayProjection(day).attentionFlags).toContain("Manual review required");
  });

  it("local-only and sync-pending caveats are exposed in screen projections", () => {
    const day = buildDayProjection({
      date: "2026-06-15",
      plannedActivities: [{ id: "fixture-local-sport-load", kind: "sport_load" }],
      sportLoadLogs: [
        { id: "fixture-local-log", kind: "sport_load", status: "logged", completionPercent: 100, syncState: "local-only" },
      ],
      sessionAttempts: [{ id: "fixture-sync-pending", kind: "training_work", status: "in-progress", syncState: "sync pending" }],
    });

    const today = buildTodayScreenProjection(day);
    const dashboard = buildDashboardDayProjection(day);

    expect(today.isLocalOnly).toBe(true);
    expect(today.caveats.sync).toContain("sync pending");
    expect(today.attentionLabels).toContain("Local-only evidence");
    expect(today.attentionLabels).toContain("Sync pending");
    expect(dashboard.attentionFlags).toContain("Sync pending");
  });

  it("unsupported storage/export gaps are visible in Dashboard and History", () => {
    const day = buildDayProjection({
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

    const dashboard = buildDashboardDayProjection(day);
    const history = buildHistoryDayProjection(day);

    expect(dashboard.attentionFlags).toContain("Unsupported record gap");
    expect(dashboard.attentionFlags).toContain("Export gap");
    expect(history.unsupportedCaveats).toContain("record-not-supported");
    expect(history.unsupportedCaveats).toContain("export-not-supported");
  });

  it("empty planned days preserve planned/not_started status without inventing records", () => {
    const planned = buildDayProjection({
      date: "2026-06-30",
      plannedActivities: [{ id: "fixture-preview-training", kind: "training_work" }],
      projection: "preview",
    });
    const notStarted = buildDayProjection({
      date: "2026-06-30",
      plannedActivities: [{ id: "fixture-execution-training", kind: "training_work" }],
      projection: "execution",
    });

    expect(buildCalendarDayProjection(planned).status).toBe("planned");
    expect(buildHistoryDayProjection(planned).groups.trainingWork.count).toBe(0);
    expect(buildTodayScreenProjection(notStarted).status).toBe("not_started");
    expect(buildHistoryDayProjection(notStarted).groups.trainingWork.count).toBe(0);
  });

  it("builds a week dashboard rollup from day projections", () => {
    const week = buildWeekDashboardProjection([
      buildDayProjection({
        date: "2026-06-15",
        plannedActivities: [{ id: "fixture-sport-load", kind: "sport_load" }],
        sportLoadLogs: [{ id: "fixture-sport-load-log", kind: "sport_load", status: "logged" }],
      }),
      buildDayProjection({
        date: "2026-06-20",
        plannedActivities: [{ id: "fixture-training", kind: "training_work" }],
        sessionAttempts: [{ id: "fixture-session", kind: "training_work", status: "in-progress" }],
      }),
    ]);

    expect(week.totals.days).toBe(2);
    expect(week.totals.sportLoadDays).toBe(1);
    expect(week.totals.trainingWorkDays).toBe(1);
    expect(week.totals.incompleteDays).toBe(1);
  });
});
