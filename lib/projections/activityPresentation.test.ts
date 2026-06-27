import { describe, expect, it } from "vitest";

import { buildDayPresentation } from "./dayPresentation";
import { projectDayPresentationContext, projectPlannedDayActivities, activityToDrill, remainingPlannedMinutesFromStep, type ActivityPresentation } from "./activityPresentation";
import { getV84DayExecutionEntries } from "../imports/v8_4/daily";
import { sessions } from "../imports/v8_4";

const forbiddenVisibleStrings = [
  "MOB-15",
  "SHOT-50",
  "SHOT-100",
  "CON-SHIFT",
  "CON-RSA",
  "Conditioning_Details_v7",
  "Recovery_Rules_v7",
  "SKL-HU10",
  "TEST",
  "SS-A",
  "SS-B",
  "SS-C",
  "external-load-protected",
  "external load",
  "source conflict",
  "source-plan conflict",
  "unresolved plan",
  "unresolved plan items",
  "review source",
  "source sheet",
  "workbook",
  "external-load",
  "externalLoad",
  "sourceBlock",
  "plannedBlockIds",
];

const activeSessionDates = sessions
  .filter((session) => session.hasTrainingWork)
  .map((session) => session.date);

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

  it("keeps Day and active Session planned activity displays on the same canonical sequence", () => {
    const date = "2026-06-19";
    const executionEntries = getV84DayExecutionEntries(date);
    const plannedActivities = projectPlannedDayActivities(date);
    const dayContext = projectDayPresentationContext(date);
    const dayPresentation = buildDayPresentation({
      date,
      executionEntries,
      plannedActivities,
      dayContext,
    });
    const activeSessionDisplay = plannedActivities.map((activity, index) => ({
      sequenceOrder: activity.sequenceOrder,
      title: activity.athleteTitle,
      category: activity.category,
      plannedDurationMinutes: activity.plannedDurationMinutes,
      headerLabel: activity.athleteTitle || `Step ${index + 1}`,
      drill: activity.category === "reflection" || activity.athleteTitle.toLowerCase().includes("readiness")
        ? null
        : activityToDrill(activity),
      childTitles: activity.children?.map((child) => child.title) ?? [],
    }));

    expect(activeSessionDisplay.map((item) => item.sequenceOrder)).toEqual(executionEntries.map((entry) => entry.sequence));
    expect(activeSessionDisplay.map((item) => item.title)).toEqual([
      "Readiness check",
      "Warm-up / mobility",
      "Speed Stack C",
      "Controlled bike or treadmill",
      "Shooting - 100 shots",
      "Hockey awareness cue",
      "Cooldown / mobility",
      "End-of-day reflection",
    ]);
    expect(new Set(activeSessionDisplay.map((item) => item.category))).toEqual(new Set([
      "readiness",
      "warmup",
      "speed_stack",
      "shooting",
      "conditioning",
      "mobility",
      "iq",
      "reflection",
    ]));

    for (const activity of plannedActivities) {
      const dayStep = dayPresentation.executionSteps[activity.sequenceOrder];
      expect(dayStep?.hidden).toBe(false);
      expect(dayStep?.title).toBe(activity.athleteTitle);
      const executionEntry = executionEntries.find((entry) => entry.sequence === activity.sequenceOrder);
      if (!isControlledBikeTreadmillFixture(executionEntry)) {
        expect(executionEntry?.plannedDurationMin ?? undefined).toBe(activity.plannedDurationMinutes);
      }
    }

    for (const item of activeSessionDisplay) {
      if (!item.drill) continue;
      expect(item.drill.name).toBe(item.title);
      if (typeof item.plannedDurationMinutes === "number") {
        expect(item.drill.plannedDuration).toBe(item.plannedDurationMinutes * 60);
        expect(item.drill.plannedPrescription).toBe(`${item.plannedDurationMinutes} min`);
      }
    }

    const athleteFacingPayload = JSON.stringify({
      day: Object.fromEntries(plannedActivities.map((activity) => {
        const step = dayPresentation.executionSteps[activity.sequenceOrder];
        return [activity.sequenceOrder, {
          title: step?.title,
          subtitle: step?.subtitle,
          note: step?.note,
          guidance: step?.guidance,
        }];
      })),
      session: activeSessionDisplay.map((item) => ({
        title: item.title,
        category: item.drill?.category ?? item.category,
        plan: item.drill?.plannedPrescription,
        instructions: item.drill?.instructions,
        coachingCues: item.drill?.coachingCues,
        childTitles: item.childTitles,
      })),
    });
    for (const value of forbiddenVisibleStrings) expect(athleteFacingPayload).not.toContain(value);
  });

  it("keeps Day and active Session planned activity displays aligned for every v8.4 active session date", () => {
    expect(activeSessionDates).toHaveLength(84);

    for (const date of activeSessionDates) {
      const executionEntries = getV84DayExecutionEntries(date);
      const plannedActivities = projectPlannedDayActivities(date);
      const dayContext = projectDayPresentationContext(date);
      const dayPresentation = buildDayPresentation({
        date,
        executionEntries,
        plannedActivities,
        dayContext,
      });
      const activeSessionDisplay = plannedActivities.map((activity, index) => ({
        sequenceOrder: activity.sequenceOrder,
        title: activity.athleteTitle,
        category: activity.category,
        plannedDurationMinutes: activity.plannedDurationMinutes,
        headerLabel: activity.athleteTitle || `Step ${index + 1}`,
        drill: activity.category === "reflection" || activity.athleteTitle.toLowerCase().includes("readiness")
          ? null
          : activityToDrill(activity),
        childTitles: activity.children?.map((child) => child.title) ?? [],
      }));

      expect(plannedActivities, date).toHaveLength(executionEntries.length);
      expect(activeSessionDisplay.map((item) => item.sequenceOrder), date).toEqual(executionEntries.map((entry) => entry.sequence));

      for (const activity of plannedActivities) {
        const dayStep = dayPresentation.executionSteps[activity.sequenceOrder];
        expect(dayStep?.hidden, `${date} sequence ${activity.sequenceOrder}`).toBe(false);
        expect(dayStep?.title, `${date} sequence ${activity.sequenceOrder}`).toBe(activity.athleteTitle);
        expect(dayStep?.subtitle, `${date} sequence ${activity.sequenceOrder}`).toBe(categoryLabelForTest(activity.category));
        const executionEntry = executionEntries.find((entry) => entry.sequence === activity.sequenceOrder);
        if (!isControlledBikeTreadmillFixture(executionEntry)) {
          expect(executionEntry?.plannedDurationMin ?? undefined, `${date} sequence ${activity.sequenceOrder}`).toBe(activity.plannedDurationMinutes);
        }
      }

      for (const item of activeSessionDisplay) {
        expect(item.headerLabel, `${date} sequence ${item.sequenceOrder}`).toBe(item.title);
        if (!item.drill) continue;
        expect(item.drill.name, `${date} sequence ${item.sequenceOrder}`).toBe(item.title);
        expect(item.drill.category, `${date} sequence ${item.sequenceOrder}`).toBe(categoryLabelForTest(item.category));
        if (typeof item.plannedDurationMinutes === "number") {
          expect(item.drill.plannedDuration, `${date} sequence ${item.sequenceOrder}`).toBe(item.plannedDurationMinutes * 60);
          expect(item.drill.plannedPrescription, `${date} sequence ${item.sequenceOrder}`).toBe(`${item.plannedDurationMinutes} min`);
        }
      }

      const athleteFacingPayload = JSON.stringify({
        day: Object.fromEntries(plannedActivities.map((activity) => {
          const step = dayPresentation.executionSteps[activity.sequenceOrder];
          return [activity.sequenceOrder, {
            title: step?.title,
            subtitle: step?.subtitle,
            note: step?.note,
            guidance: step?.guidance,
          }];
        })),
        session: activeSessionDisplay.map((item) => ({
          title: item.title,
          category: item.drill?.category ?? categoryLabelForTest(item.category),
          plan: item.drill?.plannedPrescription,
          instructions: item.drill?.instructions,
          coachingCues: item.drill?.coachingCues,
          childTitles: item.childTitles,
        })),
      });
      for (const value of forbiddenVisibleStrings) expect(athleteFacingPayload, `${date} leaked ${value}`).not.toContain(value);
    }
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

  it("applies load-based duration only to controlled bike/treadmill cardio", () => {
    const easyCardio = projectPlannedDayActivities("2026-06-18").find((activity) => activity.athleteTitle === "Controlled bike or treadmill");
    const recoveryCardio = projectPlannedDayActivities("2026-06-21").find((activity) => activity.athleteTitle === "Controlled bike or treadmill");
    const mediumCardio = projectPlannedDayActivities("2026-06-23").find((activity) => activity.athleteTitle === "Controlled bike or treadmill");
    const mediumBikeFlush = projectPlannedDayActivities("2026-07-01").find((activity) => activity.athleteTitle === "Controlled bike or treadmill");
    const hardCardio = projectPlannedDayActivities("2026-06-19").find((activity) => activity.athleteTitle === "Controlled bike or treadmill");
    const hardKpiCardio = projectPlannedDayActivities("2026-06-16").find((activity) => activity.athleteTitle === "Controlled bike or treadmill");

    expect(easyCardio?.plannedDurationMinutes).toBe(45);
    expect(recoveryCardio?.plannedDurationMinutes).toBe(45);
    expect(mediumCardio?.plannedDurationMinutes).toBe(30);
    expect(mediumBikeFlush?.plannedDurationMinutes).toBe(30);
    expect(hardCardio?.plannedDurationMinutes).toBe(20);
    expect(hardKpiCardio?.plannedDurationMinutes).toBe(20);
  });

  it("does not change non-bike/treadmill conditioning durations", () => {
    const shiftConditioning = projectPlannedDayActivities("2026-06-20").find((activity) => activity.athleteTitle === "Shift-based conditioning");
    const campConditioning = projectPlannedDayActivities("2026-07-06").find((activity) => activity.category === "conditioning");
    const travelWalk = projectPlannedDayActivities("2026-07-31").find((activity) => activity.category === "conditioning");

    expect(shiftConditioning?.plannedDurationMinutes).toBe(20);
    expect(campConditioning?.plannedDurationMinutes).toBe(20);
    expect(travelWalk?.plannedDurationMinutes).toBe(20);
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

function categoryLabelForTest(category: ActivityPresentation["category"]) {
  const labels: Record<ActivityPresentation["category"], string> = {
    readiness: "Readiness",
    warmup: "Warm-up",
    speed_stack: "Speed Stack",
    shooting: "Shooting",
    conditioning: "Conditioning",
    mobility: "Mobility",
    recovery: "Recovery",
    iq: "Skill / awareness",
    kpi: "KPI",
    sport_load: "Sport Load",
    reflection: "Reflection",
    other: "Planned work",
  };
  return labels[category];
}

function isControlledBikeTreadmillFixture(entry: ReturnType<typeof getV84DayExecutionEntries>[number] | undefined) {
  if (!entry) return false;
  const title = entry.entryTitle.toLowerCase();
  if (/con-shift|con-rsa|camp provides|short speed primer|walk \+ mob/.test(title)) return false;
  return /\bbike\b|\btreadmill\b|\btread\b|bike-z2|bike-int|speedstack conditioning|bike flush/.test(title);
}
