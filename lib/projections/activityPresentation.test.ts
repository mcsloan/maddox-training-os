import { describe, expect, it } from "vitest";

import { projectDayPresentationContext, projectPlannedDayActivities, activityToDrill, remainingPlannedMinutesFromStep, type ActivityPresentation } from "./activityPresentation";
import { getV84DayExecutionEntries } from "../imports/v8_4/daily";

const forbiddenVisibleStrings = [
  "MOB-15",
  "SHOT-50",
  "SHOT-100",
  "CON-SHIFT",
  "CON-RSA",
  "SKL-HU10",
  "TEST",
  "SS-A",
  "SS-B",
  "SS-C",
  "source conflict",
  "unresolved plan items",
  "source sheet",
  "workbook",
  "external-load",
  "externalLoad",
  "sourceBlock",
  "plannedBlockIds",
];

describe("planned activity presentation", () => {
  it("projects shared day-level context for Day and Session consumers", () => {
    const dayContext = projectDayPresentationContext("2026-06-19");
    const sessionContext = projectDayPresentationContext("2026-06-19");

    expect(dayContext).toEqual(sessionContext);
    expect(dayContext).toMatchObject({
      heroTitle: "Acceleration and accurate shooting",
      eyebrow: "Week 1 · Foundation + Acceleration · Skill day",
      phaseLabel: "Foundation + Acceleration",
      dayRoleLabel: "Skill day",
      dayTypeLabel: "Speed Stack C Day",
      summary: "Speed Stack C, conditioning, and shooting.",
    });
  });

  it("projects June 19 top-level activities from dayExecutionPlan order", () => {
    const entries = getV84DayExecutionEntries("2026-06-19");
    const activities = projectPlannedDayActivities("2026-06-19");

    expect(activities.map((activity) => activity.sequenceOrder)).toEqual(entries.map((entry) => entry.sequence));
    expect(activities.map((activity) => activity.athleteTitle)).toEqual([
      "Readiness check",
      "Warm-up / mobility",
      "Speed Stack C",
      "Controlled bike or treadmill",
      "Shooting - 100 shots",
      "Hockey awareness cue",
      "Cooldown / mobility",
      "End-of-day reflection",
    ]);
  });

  it("keeps duration out of time-based titles while preserving prescription count titles", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const readiness = activities.find((activity) => activity.athleteTitle === "Readiness check");
    const shooting = activities.find((activity) => activity.category === "shooting");

    expect(readiness?.plannedDurationMinutes).toBe(2);
    expect(readiness?.athleteTitle).not.toContain("2 minutes");
    expect(shooting?.athleteTitle).toBe("Shooting - 100 shots");
  });

  it("keeps forbidden source labels out of visible planned activity output", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const visibleOutput = JSON.stringify(activities.map((activity) => ({
      athleteTitle: activity.athleteTitle,
      parentTitle: activity.parentTitle,
      category: activity.category,
      plannedDurationMinutes: activity.plannedDurationMinutes,
      instruction: activity.instruction,
      coachingCue: activity.coachingCue,
      logType: activity.logType,
      required: activity.required,
      optional: activity.optional,
      children: activity.children?.map((child) => ({
        title: child.title,
        instruction: child.instruction,
        plannedSets: child.plannedSets,
        plannedReps: child.plannedReps,
        plannedDurationMinutes: child.plannedDurationMinutes,
        coachingCue: child.coachingCue,
        videoUrl: child.videoUrl,
      })),
    })));

    for (const value of forbiddenVisibleStrings) expect(visibleOutput).not.toContain(value);
  });

  it("attaches Speed Stack child drill details under the parent activity", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const speedStack = activities.find((activity) => activity.category === "speed_stack");

    expect(speedStack?.athleteTitle).toBe("Speed Stack C");
    expect(speedStack?.children?.length).toBeGreaterThan(0);
    expect(speedStack?.children?.[0]).toMatchObject({
      title: "Prisoner Rear Foot Elevated Split Squat Hold",
      plannedSets: 4,
      plannedReps: "45s/side",
      plannedDurationMinutes: 1,
    });
  });

  it("uses dayExecutionPlan duration for top-level activities and child duration only for child detail", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const topLevelMobility = activities.find((activity) => activity.athleteTitle === "Cooldown / mobility");
    const speedStack = activities.find((activity) => activity.category === "speed_stack");
    const speedStackDrill = activityToDrill(speedStack!);

    expect(topLevelMobility?.plannedDurationMinutes).toBe(10);
    expect(speedStack?.plannedDurationMinutes).toBe(35);
    expect(speedStack?.children?.[0].plannedDurationMinutes).toBe(1);
    expect(speedStackDrill.plannedPrescription).toBe("35 min");
  });

  it("keeps generic recovery guidance off unrelated planned activities", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const unrelatedActivities = activities.filter((activity) =>
      activity.category === "shooting" || activity.category === "conditioning" || activity.category === "speed_stack"
    );
    const output = JSON.stringify(unrelatedActivities.map((activity) => ({
      title: activity.athleteTitle,
      instruction: activity.instruction,
      coachingCue: activity.coachingCue,
      drill: activityToDrill(activity),
    })));

    expect(output).not.toContain("Mobility, hydration, nutrition, sleep");
    expect(output).not.toContain("dryland bends around sport load");
  });

  it("maps activity presentation to legacy Drill fields without repeating exact instruction copy", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const speedStack = activities.find((activity) => activity.category === "speed_stack");
    const drill = activityToDrill(speedStack!);
    const fields = [
      drill.purpose,
      drill.setup,
      ...drill.setupChecklist,
      ...drill.instructions,
      ...drill.coachingCues,
    ];
    const instructionCount = fields.filter((value) => value === speedStack?.instruction).length;
    const cueCount = fields.filter((value) => value === speedStack?.coachingCue).length;

    expect(instructionCount).toBe(1);
    expect(cueCount).toBe(1);
  });

  it("sums remaining planned minutes from the visible ActivityPresentation sequence", () => {
    const activities = projectPlannedDayActivities("2026-06-19");

    expect(remainingPlannedMinutesFromStep(activities, 0)).toBe(110);
    expect(remainingPlannedMinutesFromStep(activities, 2)).toBe(98);
    expect(remainingPlannedMinutesFromStep(activities, activities.length)).toBe(0);
  });

  it("does not produce precise remaining time when remaining activities are missing duration", () => {
    const activities: ActivityPresentation[] = [
      { ...projectPlannedDayActivities("2026-06-19")[0], plannedDurationMinutes: 2 },
      { ...projectPlannedDayActivities("2026-06-19")[1], plannedDurationMinutes: undefined },
    ];

    expect(remainingPlannedMinutesFromStep(activities, 0)).toBeNull();
    expect(remainingPlannedMinutesFromStep(activities, 1)).toBeNull();
  });

  it("omits generic duplicate card purpose and planned group for activity-derived drills", () => {
    const activities = projectPlannedDayActivities("2026-06-19");
    const speedStack = activities.find((activity) => activity.category === "speed_stack");
    const drill = activityToDrill(speedStack!);

    expect(drill.category).toBe("Speed Stack");
    expect(drill.name).toBe("Speed Stack C");
    expect(drill.purpose).toBe("");
    expect(drill.plannedGroup).toBeUndefined();
  });
});
