import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SessionSummary } from "./SessionSummary";
import type { SessionLog, Workout } from "@/lib/types";

const workout: Workout = {
  id: "session-2026-06-19",
  date: "2026-06-19",
  phaseId: "v8.4-week-1",
  dayFocus: "Speed Stack C, conditioning, and shooting.",
  sessionType: "Speed Stack C Day",
  totalEstimatedMinutes: 90,
  warmupDrillIds: [],
  mainDrillIds: [],
  kpiTestIds: [],
  recoveryNotes: "",
  parentCueId: "",
  confidenceCue: "",
  campContext: "",
  intensityLevel: 3,
};

const completedSession: SessionLog = {
  id: "completed-session-fixture",
  workoutId: workout.id,
  date: workout.date,
  startedAt: "2026-06-19T12:00:00.000Z",
  completedAt: "2026-06-19T13:00:00.000Z",
  currentStep: 0,
  status: "completed",
  readiness: {
    energy: null,
    soreness: null,
    focus: null,
    restingHeartRate: null,
    sleepHours: null,
    notes: "",
  },
  exercises: {},
  kpiResults: {},
  reflection: {
    energy: null,
    confidence: null,
    difficulty: null,
    improvement: "",
    notes: "",
  },
};

function renderSummary(displayTitle?: string) {
  return renderToStaticMarkup(
    <SessionSummary
      workout={workout}
      session={completedSession}
      drills={[]}
      kpis={[]}
      displayTitle={displayTitle}
      onReopen={vi.fn()}
      onFresh={vi.fn()}
    />
  );
}

describe("SessionSummary completed read-only title", () => {
  it("prefers canonical day/session display title when provided", () => {
    const html = renderSummary("Acceleration and accurate shooting");

    expect(html).toContain("Acceleration and accurate shooting");
    expect(html).not.toContain("Speed Stack C, conditioning, and shooting.");
  });

  it("falls back to workout day focus when display title is missing or empty", () => {
    expect(renderSummary()).toContain("Speed Stack C, conditioning, and shooting.");
    expect(renderSummary("   ")).toContain("Speed Stack C, conditioning, and shooting.");
  });
});
