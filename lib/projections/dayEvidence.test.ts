import { describe, expect, it } from "vitest";

import { getV84SportLoadsForDate } from "@/lib/imports/v8_4/daily";
import type { ExternalLoadLog, KPIResult, SessionLog, TrainingWorkLog } from "@/lib/types";
import { buildDayEvidenceProjection } from "./dayEvidence";
import { buildCalendarDayProjection } from "./screenProjections";

describe("canonical Calendar evidence flow", () => {
  it("passes completed sessionAttempts through shared evidence for historical and forward Training Work", () => {
    for (const date of ["2026-06-19", "2026-08-17"]) {
      const session = sessionAttempt(date, "completed");
      const evidence = buildDayEvidenceProjection({ date, sessionAttempts: [session], projection: "preview" });

      expect(evidence.plannedActivities.some((activity) => activity.kind === "training_work")).toBe(true);
      expect(evidence.records.sessionAttempts).toContainEqual(expect.objectContaining({ id: session.id, kind: "training_work", status: "completed" }));
      expect(buildCalendarDayProjection(evidence)).toMatchObject({ evidenceLabel: "Logged", primaryAction: "Update" });
    }
  });

  it("keeps missing and partial forward Training Work distinct through the shared projection", () => {
    const date = "2026-08-17";
    const missing = buildCalendarDayProjection(buildDayEvidenceProjection({ date, projection: "preview" }));
    const partial = buildCalendarDayProjection(buildDayEvidenceProjection({ date, sessionAttempts: [sessionAttempt(date, "in-progress")], projection: "preview" }));
    const localCompleted = buildCalendarDayProjection(buildDayEvidenceProjection({ date, trainingWorkLogs: [trainingWorkLog(date, true)], projection: "preview" }));

    expect(missing).toMatchObject({ evidenceLabel: "Not logged", primaryAction: "Log" });
    expect(partial).toMatchObject({ evidenceLabel: "Partially logged", primaryAction: "Update" });
    expect(localCompleted).toMatchObject({ evidenceLabel: "Logged", primaryAction: "Update" });
  });

  it("passes only planned Sport Load evidence through the shared projection", () => {
    const date = "2026-08-16";
    const [marc, fourOnFour] = getV84SportLoadsForDate(date);
    const evidence = buildDayEvidenceProjection({
      date,
      sportLoadLogs: [sportLoadLog(marc.id, date, marc.title, true), sportLoadLog(fourOnFour.id, date, fourOnFour.title, false), sportLoadLog("unplanned", date, "Unplanned Ice", true)],
      projection: "preview",
    });
    const calendar = buildCalendarDayProjection(evidence);

    expect(evidence.records.sportLoadLogs).toHaveLength(2);
    expect(calendar).toMatchObject({ evidenceLabel: "Partially logged", primaryAction: "Update" });
  });

  it("keeps the canonical 14-item KPI state partial until all results are addressed", () => {
    const date = "2026-08-20";
    const planned = buildDayEvidenceProjection({ date, projection: "preview" });
    const kpiIds = planned.plannedActivities.filter((activity) => activity.kind === "kpi").map((activity) => activity.id).filter((id): id is string => Boolean(id));
    const oneResult = buildCalendarDayProjection(buildDayEvidenceProjection({ date, kpiResults: [kpiResult(date, kpiIds[0])], projection: "preview" }));
    const allResults = buildCalendarDayProjection(buildDayEvidenceProjection({ date, kpiResults: kpiIds.map((id) => kpiResult(date, id)), projection: "preview" }));

    expect(kpiIds).toHaveLength(14);
    expect(oneResult).toMatchObject({ evidenceLabel: "Partially logged", primaryAction: "Update" });
    expect(allResults).toMatchObject({ evidenceLabel: "Logged", primaryAction: "Update" });
  });
});

function sessionAttempt(date: string, status: SessionLog["status"]): SessionLog {
  return {
    id: `session-${date}-${status}`,
    workoutId: `workout-${date}`,
    date,
    startedAt: `${date}T12:00:00.000Z`,
    completedAt: status === "completed" ? `${date}T13:00:00.000Z` : null,
    currentStep: 0,
    status,
    readiness: { energy: null, soreness: null, focus: null, notes: "" },
    exercises: {},
    kpiResults: {},
    reflection: { energy: null, confidence: null, difficulty: null, improvement: "", notes: "" },
  };
}

function trainingWorkLog(date: string, completed: boolean): TrainingWorkLog {
  return {
    id: `training-work-${date}`,
    date,
    workoutId: null,
    title: "Fixture Training Work",
    plannedBlockIds: [],
    plannedDurationMinutes: 47,
    completed,
    actualDuration: 47,
    effort: 3,
    notes: "",
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T13:00:00.000Z`,
    schemaVersion: 1,
    source: "training_work",
  };
}

function sportLoadLog(externalLoadId: string, date: string, title: string, attended: boolean): ExternalLoadLog {
  return {
    id: `log-${externalLoadId}`,
    athleteId: "fixture-athlete",
    externalLoadId,
    date,
    title,
    type: "on_ice",
    provider: "Fixture",
    plannedDuration: 60,
    actualDuration: attended ? 60 : null,
    plannedIntensity: 4,
    attended,
    effort: attended ? 4 : null,
    energyAfter: null,
    confidence: null,
    difficulty: null,
    soreness: 0,
    painFlag: false,
    whatWentWell: "",
    whatToAdjust: "",
    parentNotes: "",
    recoveryCompleted: false,
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T13:00:00.000Z`,
    schemaVersion: 1,
    appVersion: "fixture",
    planVersion: "fixture",
    source: "external_load",
  };
}

function kpiResult(date: string, kpiId: string): KPIResult {
  return { id: `result-${kpiId}`, kpiId, date, attempts: [{ value: 1 }], bestResult: 1, notes: "", testStatus: "completed" };
}
