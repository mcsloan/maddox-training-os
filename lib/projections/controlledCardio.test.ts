import { describe, expect, it } from "vitest";

import { getV84DayExecutionEntries } from "../imports/v8_4/daily";
import { buildDayPresentation } from "./dayPresentation";
import { projectDayPresentationContext, projectPlannedDayActivities } from "./activityPresentation";

const CONTROLLED_CARDIO_COPY = "Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.";

function conditioningActivity(date: string) {
  return projectPlannedDayActivities(date).find((activity) => activity.category === "conditioning");
}

function presentation(date: string) {
  const executionEntries = getV84DayExecutionEntries(date);
  const plannedActivities = projectPlannedDayActivities(date);
  return buildDayPresentation({
    date,
    executionEntries,
    plannedActivities,
    dayContext: projectDayPresentationContext(date),
  });
}

describe("controlled cardio classification", () => {
  it("projects the approved easy / medium / hard duration matrix with the approved safety copy", () => {
    const easy = conditioningActivity("2026-06-18");
    const medium = conditioningActivity("2026-06-23");
    const hard = conditioningActivity("2026-06-29");

    expect(easy?.plannedDurationMinutes).toBe(45);
    expect(medium?.plannedDurationMinutes).toBe(30);
    expect(hard?.plannedDurationMinutes).toBe(20);

    for (const activity of [easy, medium, hard]) {
      expect(activity?.athleteTitle).toBe("Controlled bike or treadmill");
      expect(activity?.instruction).toBe(CONTROLLED_CARDIO_COPY);
      expect(activity?.coachingCue).toBe(CONTROLLED_CARDIO_COPY);
    }
  });

  it("does not call hard-day controlled cardio recovery conditioning", () => {
    const day = presentation("2026-06-29");
    const cardio = day.executionSteps[4];

    expect(cardio.hidden).toBe(false);
    expect(cardio.subtitle).toBe("Conditioning");
    expect(cardio.loadImpact).toBe("Conditioning stimulus");
    expect(cardio.note).toBe(CONTROLLED_CARDIO_COPY);
    expect(cardio.guidance).toContain(CONTROLLED_CARDIO_COPY);
  });

  it("keeps the June 30 optional post-test bike hidden and recovery-labelled", () => {
    const activities = projectPlannedDayActivities("2026-06-30");
    const day = presentation("2026-06-30");
    const optionalBike = day.executionSteps[4];

    expect(activities.some((activity) => activity.category === "conditioning")).toBe(false);
    expect(optionalBike.hidden).toBe(true);
    expect(optionalBike.title).toBe("Optional Easy Bike — only if fresh");
    expect(optionalBike.subtitle).toBe("Recovery conditioning");
    expect(optionalBike.loadImpact).toBe("Recovery conditioning");
    expect(optionalBike.note).toBe(CONTROLLED_CARDIO_COPY);
  });
});
