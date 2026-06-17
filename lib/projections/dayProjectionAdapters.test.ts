import { describe, expect, it } from "vitest";

import { buildDayProjection } from "./dayProjection";
import {
  buildDayProjectionInputFromRecords,
  mapKpiResultToProjectionRecord,
  mapReflectionToProjectionRecord,
  mapSessionAttemptToProjectionRecord,
  mapSportLoadLogToProjectionRecord,
} from "./dayProjectionAdapters";
import { type ExternalLoadLog, type KPIResult, type Reflection, type SessionLog } from "@/lib/types";

describe("day projection adapters", () => {
  it("D01 maps a Sport Load-only record into sportLoadLogs and derives sport_load_logged", () => {
    const input = buildDayProjectionInputFromRecords({
      date: "2026-06-15",
      dayTitle: "D01 Sport Load",
      plannedActivities: [{ id: "fixture-d01-sport-load", kind: "sport_load" }],
      sportLoadLogs: [sportLoadLog()],
    });
    const projection = buildDayProjection(input);

    expect(input.sportLoadLogs).toHaveLength(1);
    expect(input.sessionAttempts).toHaveLength(0);
    expect(projection.status.status).toBe("sport_load_logged");
    expect(projection.hasSportLoad).toBe(true);
    expect(projection.hasTrainingWork).toBe(false);
  });

  it("D02 maps completed KPI records and preserves explicit deferred Puck Weave", () => {
    const input = buildDayProjectionInputFromRecords({
      date: "2026-06-16",
      plannedActivities: [{ id: "fixture-d02-kpi", kind: "kpi" }],
      kpiResults: [
        kpiResult({ id: "fixture-d02-baseline", bestResult: 8.4 }),
        kpiResult({ id: "fixture-d02-puck-weave", bestResult: null, status: "deferred", deferred: true }),
      ],
    });
    const projection = buildDayProjection(input);

    expect(input.kpiResults).toEqual([
      expect.objectContaining({ id: "fixture-d02-baseline", status: "completed", completionPercent: 100 }),
      expect.objectContaining({ id: "fixture-d02-puck-weave", status: "deferred", deferred: true }),
    ]);
    expect(projection.status.status).toBe("completed_with_deferred");
    expect(projection.status.hasExplicitDeferral).toBe(true);
  });

  it("maps reflection records into reflections and sets hasReflection", () => {
    const input = buildDayProjectionInputFromRecords({
      date: "2026-06-16",
      plannedActivities: [{ id: "fixture-d02-kpi", kind: "kpi" }],
      reflections: [{ ...reflection(), id: "fixture-reflection" }],
    });
    const projection = buildDayProjection(input);

    expect(input.reflections).toEqual([expect.objectContaining({ id: "fixture-reflection", status: "saved" })]);
    expect(projection.hasReflection).toBe(true);
  });

  it("local-only and sync-pending records produce caveat flags without erasing status", () => {
    const input = buildDayProjectionInputFromRecords({
      date: "2026-06-15",
      plannedActivities: [{ id: "fixture-local-sport-load", kind: "sport_load" }],
      sportLoadLogs: [sportLoadLog({ syncState: "local-only" })],
      sessionAttempts: [sessionAttempt({ syncState: "sync pending" })],
    });
    const projection = buildDayProjection(input);

    expect(projection.caveats.sync).toContain("local-only");
    expect(projection.caveats.sync).toContain("sync pending");
    expect(projection.isLocalOnly).toBe(true);
    expect(projection.status.status).toBe("in_progress");
    expect(projection.status.statuses).toContain("sport_load_logged");
  });

  it("legacy/orphan input maps into legacyOrphanRecords and requires manual review", () => {
    const input = buildDayProjectionInputFromRecords({
      date: "2026-06-24",
      plannedActivities: [{ id: "fixture-d10-training", kind: "training_work" }],
      legacyOrphanRecords: [{ id: "fixture-legacy-workout", reason: "legacy workout id" }],
    });
    const projection = buildDayProjection(input);

    expect(input.legacyOrphanRecords).toEqual([expect.objectContaining({ id: "fixture-legacy-workout", legacyNeedsReview: true })]);
    expect(projection.status.status).toBe("legacy_needs_review");
    expect(projection.requiresManualReview).toBe(true);
  });

  it("unsupported storage gap produces caveat and does not invent completion", () => {
    const input = buildDayProjectionInputFromRecords({
      date: "2026-06-21",
      plannedActivities: [{ id: "fixture-training", kind: "training_work" }],
      sessionAttempts: [sessionAttempt({ status: "completed", supported: false })],
      unsupportedRecordFlags: ["record-not-supported"],
    });
    const projection = buildDayProjection(input);

    expect(projection.hasUnsupportedRecordGap).toBe(true);
    expect(projection.caveats.unsupported).toContain("record-not-supported");
    expect(projection.status.statuses).not.toContain("completed");
  });

  it("exports individual mapper helpers", () => {
    expect(mapSportLoadLogToProjectionRecord(sportLoadLog())).toEqual(expect.objectContaining({ kind: "sport_load" }));
    expect(mapKpiResultToProjectionRecord(kpiResult())).toEqual(expect.objectContaining({ kind: "kpi" }));
    expect(mapSessionAttemptToProjectionRecord(sessionAttempt())).toEqual(expect.objectContaining({ kind: "training_work" }));
    expect(mapReflectionToProjectionRecord(reflection())).toEqual(expect.objectContaining({ kind: "reflection" }));
  });
});

function sportLoadLog(overrides: Partial<ExternalLoadLog> & { syncState?: "local-only" | "sync pending" } = {}): ExternalLoadLog & { syncState?: "local-only" | "sync pending" } {
  return {
    id: "fixture-sport-load-log",
    athleteId: "fixture-athlete",
    externalLoadId: "fixture-sport-load",
    date: "2026-06-15",
    title: "Fixture Sport Load",
    type: "on_ice_4v4",
    provider: "fixture",
    plannedDuration: 60,
    actualDuration: 60,
    plannedIntensity: 4,
    attended: true,
    effort: 4,
    energyAfter: 3,
    confidence: 4,
    difficulty: 3,
    soreness: 0,
    painFlag: false,
    whatWentWell: "",
    whatToAdjust: "",
    parentNotes: "",
    recoveryCompleted: false,
    createdAt: "2026-06-15T12:00:00.000Z",
    updatedAt: "2026-06-15T12:30:00.000Z",
    schemaVersion: 1,
    appVersion: "fixture",
    planVersion: "fixture",
    source: "external_load",
    ...overrides,
  };
}

function kpiResult(overrides: Partial<KPIResult> & { status?: string; deferred?: boolean } = {}): KPIResult & { status?: string; deferred?: boolean } {
  return {
    id: "fixture-kpi-result",
    kpiId: "fixture-kpi",
    date: "2026-06-16",
    enteredAt: "2026-06-16T12:00:00.000Z",
    attempts: [{ value: 8.4 }],
    bestResult: 8.4,
    notes: "",
    ...overrides,
  };
}

function sessionAttempt(overrides: Partial<SessionLog> & { syncState?: "sync pending"; supported?: boolean } = {}): SessionLog & { syncState?: "sync pending"; supported?: boolean } {
  return {
    id: "fixture-session",
    workoutId: "fixture-workout",
    date: "2026-06-20",
    startedAt: "2026-06-20T12:00:00.000Z",
    completedAt: null,
    currentStep: 1,
    status: "in-progress",
    readiness: { energy: null, soreness: null, focus: null, notes: "" },
    exercises: {
      "fixture-drill-1": {
        drillId: "fixture-drill-1",
        done: false,
        actualSets: null,
        actualReps: null,
        actualDuration: null,
        actualDistance: null,
        notes: "",
        difficulty: null,
      },
    },
    kpiResults: {},
    reflection: reflection({ notes: "" }),
    ...overrides,
  };
}

function reflection(overrides: Partial<Reflection> = {}): Reflection {
  return {
    energy: 4,
    confidence: 4,
    difficulty: 3,
    improvement: "Fixture improvement",
    notes: "Fixture note",
    ...overrides,
  };
}
