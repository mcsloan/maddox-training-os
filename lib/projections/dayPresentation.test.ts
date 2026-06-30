import { describe, expect, it } from "vitest";

import { buildDayPresentation } from "./dayPresentation";
import { projectDayPresentationContext, projectPlannedDayActivities } from "./activityPresentation";
import { getV84CalendarDates } from "../imports/v8_4/calendar";
import { getV84DayExecutionEntries, getV84SportLoadsForDate, getV84TrainingWorkEntries } from "../imports/v8_4/daily";
import { getV84SessionByDate, getV84SessionDrills, getV84SessionWorkout } from "../imports/v8_4/session";
import type { V84DayExecutionPlanEntry } from "../imports/v8_4/types";
import type { Drill, KPI, PlannedExternalLoad, PlanDay, PlanDayDisplayModel, WorkoutBlock } from "@/lib/types";

const forbiddenVisibleStrings = [
  "source conflict",
  "source-plan conflict",
  "review source",
  "flagged below",
  "parent review",
  "unresolved plan items",
  "plan conflict",
  "SHOT-50",
  "SHOT-100",
  "100+ shot language",
  "Skill Volume",
  "KPI presentation",
  "Use the equipment needed",
  "controlled shooting",
  "controlled 50-shot",
];

const futureDayForbiddenVisibleStrings = [
  "external-load",
  "external load",
  "external-load-protected",
  "source conflict",
  "source-plan conflict",
  "unresolved plan",
  "review source",
  "SHOT-50",
  "SHOT-100",
  "MOB-15",
  "CON-SHIFT",
  "CON-RSA",
  "Conditioning_Details_v7",
  "Recovery_Rules_v7",
];

describe("day presentation", () => {
  it("projects every v8.4 date into a usable athlete-facing Day payload", () => {
    const dates = getV84CalendarDates();

    expect(dates).toHaveLength(84);
    expect(dates[0]).toBe("2026-06-15");
    expect(dates[dates.length - 1]).toBe("2026-09-06");

    for (const date of dates) {
      const routeData = buildRouteLikeDayPresentation(date);
      const visibleSteps = Object.values(routeData.presentation.executionSteps).filter((step) => !step.hidden);
      const athleteFacingPayload = JSON.stringify({
        dayTitle: routeData.presentation.dayTitle,
        dayTypeLabel: routeData.dayContext.eyebrow,
        plannedWorkSummary: routeData.presentation.plannedWorkSummary,
        athleteActionSummary: routeData.presentation.athleteActionSummary,
        parentCue: routeData.presentation.parentCue,
        loadRule: routeData.presentation.loadRule,
        recovery: routeData.presentation.recovery,
        chips: routeData.presentation.chips,
        ctas: routeData.presentation.ctas.map((cta) => ({ label: cta.label, tone: cta.tone })),
        visibleSteps: visibleSteps.map((step) => ({
          title: step.title,
          subtitle: step.subtitle,
          note: step.note,
          guidance: step.guidance,
        })),
      });

      expect(routeData.canResolveDayRoute, date).toBe(true);
      expect(routeData.presentation.dayTitle.trim(), date).not.toBe("");
      expect(routeData.dayContext.eyebrow.trim(), date).not.toBe("");
      expect(routeData.plannedActivities.length, date).toBeGreaterThan(0);
      expect(visibleSteps.length, date).toBeGreaterThan(0);
      expect(routeData.presentation.plannedWorkSummary.trim(), date).not.toBe("");
      expect(routeData.presentation.athleteActionSummary.trim(), date).not.toBe("");
      expect(athleteFacingPayload.length, date).toBeGreaterThan(0);

      if (routeData.sportLoads.length > 0 || isRecoveryOrLightDay(routeData)) {
        expect(athleteFacingPayload, `${date} recovery/light guidance`).toMatch(/recovery|mobility|light|easy|skill|fresh|sport load/i);
      }

      for (const value of futureDayForbiddenVisibleStrings) {
        expect(athleteFacingPayload, `${date} leaked ${value}`).not.toContain(value);
      }
    }
  });

  it("merges duplicate KPI shooting blocks and renders clean KPI-day support copy", () => {
    const day: PlanDay = {
      date: "fixture-kpi-day",
      weekNumber: 1,
      phase: "Foundation",
      dayRole: "Fresh baseline KPI + speed mechanics",
      primarySession: "Baseline KPI testing + short speed mechanics + controlled shooting",
      workoutId: "fixture-workout",
      workoutBlockIds: ["TEST", "SHOT-50"],
      kpiTestIds: ["kpi-shot-accuracy"],
      dailyMicroSkill: "Fast, clean first steps",
      shootingPuckDetail: "Controlled 50-shot accuracy baseline",
      recovery: "Full recovery between attempts; finish fresh",
      durationMinutes: 62,
      intensity: 3,
      externalLoad: "",
      parentCue: "Create the scoreboard while fresh.",
      doNotDo: "No ugly PRs.",
      recoveryRule: "Clean technique beats ugly numbers.",
      tags: ["kpi", "baseline"],
    };
    const display: PlanDayDisplayModel = {
      methodologyPhase: "Foundation + Acceleration",
      sportLoads: [],
      loadRule: null,
      testingEvent: "Perf Testing",
      displayTags: ["Perf Testing"],
    };
    const entries: V84DayExecutionPlanEntry[] = [
      {
        date: day.date,
        week: 1,
        day: "Tuesday",
        sequence: 1,
        entryType: "Warmup/Mobility",
        entryTitle: "WU-10",
        sourceBlock: "Warmup",
        plannedDurationMin: 10,
        logType: "trainingWorkLog",
        requiredOptional: "Required",
        loadImpact: "Preparation",
        notes: "Use warmup/mobility details.",
        appRenderHint: "drill-list",
      },
      {
        date: day.date,
        week: 1,
        day: "Tuesday",
        sequence: 2,
        entryType: "KPI",
        entryTitle: "Baseline KPI",
        sourceBlock: "TEST",
        plannedDurationMin: 15,
        logType: "kpiLog",
        requiredOptional: "Required",
        loadImpact: "Testing stimulus",
        notes: "Complete KPI baseline/check-in first while fresh.",
        appRenderHint: "kpi-form",
      },
      {
        date: day.date,
        week: 1,
        day: "Tuesday",
        sequence: 3,
        entryType: "Conditioning",
        entryTitle: "None or BIKE-Z2-25 after testing if fresh",
        sourceBlock: "Conditioning_Details_v7",
        plannedDurationMin: 20,
        logType: "trainingWorkLog",
        requiredOptional: "Optional",
        loadImpact: "Aerobic/repeat-effort",
        notes: "Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.",
        appRenderHint: "timer",
      },
      {
        date: day.date,
        week: 1,
        day: "Tuesday",
        sequence: 4,
        entryType: "Shooting/Puck",
        entryTitle: "SHOT-100 accuracy / mechanics",
        sourceBlock: "SHOT-50",
        plannedDurationMin: 20,
        logType: "trainingWorkLog",
        requiredOptional: "Required",
        loadImpact: "Skill Volume",
        notes: "100+ shots on shooting days; reduce only for pain, soreness, or technique breakdown.",
        appRenderHint: "shot-counter",
      },
    ];
    const plannedKpis: KPI[] = [
      {
        id: "kpi-shot-accuracy",
        name: "50-Shot Target Hits",
        category: "Shooting",
        instructions: ["Take 50 shots at called targets.", "Record successful target hits."],
        units: "hits",
        attempts: 1,
        scoringMethod: "highest",
        fields: [{ id: "result", label: "Accurate shots", type: "number", unit: "/ 50" }],
        coachingNotes: [],
        safetyNotes: "Use a secured net or shooting tarp.",
      },
    ];
    const drills: Drill[] = [
      drill("ten-yard-sprint", "10-Yard Sprint", "Speed", ["timer", "2 cones", "measuring tape"]),
      drill("quick-feet-5105", "5-10-5 Pro Agility", "Agility", ["6 cones", "timer", "measuring tape"]),
      drill("target-shooting", "Target Shooting", "Shooting", ["stick", "50 pucks", "net"]),
    ];
    const workoutBlocks: WorkoutBlock[] = [
      { id: "TEST", name: "KPI testing", category: "Testing", description: "KPI tests", bestUse: "Testing days", relatedDrillIds: [] },
      { id: "SS-A", name: "Strength + Speed A", category: "Performance", description: "Foundation single-leg control paired with short acceleration.", bestUse: "Hard days", relatedDrillIds: [] },
      { id: "SHOT-50", name: "50-shot block", category: "Shooting", description: "Target hits", bestUse: "KPI days", relatedDrillIds: [] },
    ];

    const presentation = buildDayPresentation({
      date: day.date,
      day,
      display,
      tags: day.tags,
      executionEntries: entries,
      plannedKpis,
      drills,
      workoutBlocks,
    });

    expect(presentation.dayTitle).toBe("Baseline KPI testing + short speed mechanics");
    expect(presentation.chips.filter((chip) => chip.kind === "perf-testing")).toHaveLength(1);
    expect(presentation.executionSteps[3]).toMatchObject({
      hidden: false,
      displaySequence: 3,
      title: "Optional Easy Bike — only if fresh",
      subtitle: "Recovery conditioning",
      note: "Controlled cardio only. Bike preferred; treadmill walk/light jog is okay. No treadmill sprinting.",
      blockLabels: [],
    });
    expect(presentation.executionSteps[4]).toMatchObject({
      hidden: true,
      displaySequence: null,
      title: "50-Shot Target-Hit Test",
    });
    expect(presentation.parentCue).toBe("Record baseline results while fresh. Clean technique beats ugly numbers.");
    expect(presentation.loadRule).toBe("No PR chasing. Stop testing if sore, tired, or technique breaks.");
    expect(presentation.recovery).toBe("Hydrate, cool down, and finish feeling fresh.");
    expect(presentation.unresolvedItems).toEqual([]);
    expect(presentation.equipmentSummary).toEqual(expect.arrayContaining([
      "timer or phone",
      "cones or markers",
      "measuring tape",
      "stick",
      "pucks or ball",
      "net or target",
      "shooting pad if available",
      "open floor space",
    ]));

    const visibleOutput = JSON.stringify({
      dayTitle: presentation.dayTitle,
      chips: presentation.chips,
      equipmentSummary: presentation.equipmentSummary,
      unresolvedItems: presentation.unresolvedItems,
      executionSteps: presentation.executionSteps,
      parentCue: presentation.parentCue,
      loadRule: presentation.loadRule,
      recovery: presentation.recovery,
    });
    for (const value of forbiddenVisibleStrings) expect(visibleOutput).not.toContain(value);
  });

  it("does not request a second execution sequence for sport-load simple-plan days", () => {
    const sportLoad: PlannedExternalLoad = {
      id: "fixture-sport-load",
      date: "fixture-sport-day",
      type: "on_ice_4v4",
      title: "4v4 Hockey",
      provider: "On-Ice",
      startTime: "Confirm time",
      endTime: "",
      plannedDurationMinutes: 44,
      plannedIntensity: 4,
      notes: "Sport load is part of the plan.",
      recoveryRule: "Keep recovery first.",
      doNotDoRule: "Keep dryland reduced after this sport load.",
      trackingQuestions: [],
    };

    const presentation = buildDayPresentation({
      date: sportLoad.date,
      sportLoads: [sportLoad],
      executionEntries: [{
        date: sportLoad.date,
        week: 1,
        day: "Monday",
        sequence: 1,
        entryType: "Sport Load",
        entryTitle: "4v4 Hockey",
        sourceBlock: "SPORT",
        plannedDurationMin: 44,
        logType: "sportLoadLog",
        requiredOptional: "Required",
        loadImpact: "High load",
        notes: "Track effort after.",
        appRenderHint: "sport-load",
      }],
    });

    expect(presentation.showSourceExecutionInDetails).toBe(false);
  });

  it("does not show KPI evidence or KPI CTAs for non-KPI training days with KPI-like planned movements", () => {
    const day: PlanDay = {
      date: "2026-06-19",
      weekNumber: 1,
      phase: "Foundation",
      dayRole: "Skill day",
      primarySession: "Acceleration and accurate shooting",
      workoutId: "foundation-speed-b",
      workoutBlockIds: ["WUP-10", "SS-B", "SHOT-75", "CD-8"],
      kpiTestIds: [],
      dailyMicroSkill: "First three steps",
      shootingPuckDetail: "Call the target before release",
      recovery: "Easy movement and hydration",
      durationMinutes: 38,
      intensity: 4,
      externalLoad: "",
      parentCue: "One cue, then let Maddox work.",
      doNotDo: "Do not add extra conditioning.",
      recoveryRule: "Full rest between speed reps.",
    };
    const display: PlanDayDisplayModel = {
      methodologyPhase: "Foundation + Acceleration",
      sportLoads: [],
      loadRule: null,
      testingEvent: null,
      displayTags: ["Foundation + Acceleration"],
    };
    const plannedKpis: KPI[] = [
      {
        id: "kpi-speed-like",
        name: "10-Yard Sprint",
        category: "Speed",
        instructions: ["Sprint fast."],
        units: "sec",
        attempts: 3,
        scoringMethod: "lowest",
        fields: [{ id: "result", label: "Time", type: "number", unit: "sec" }],
        coachingNotes: [],
        safetyNotes: "",
      },
    ];

    const presentation = buildDayPresentation({
      date: day.date,
      day,
      display,
      plannedKpis,
      trainingWorkHref: "/session/session-2026-06-19",
    });

    expect(presentation.isKpiTestingDay).toBe(false);
    expect(presentation.kpiEvidenceSummary.state).toBe("none");
    expect(presentation.plannedWorkSummary).toBe("Acceleration and accurate shooting");
    expect(presentation.ctas).toEqual([{ label: "Start / Log Today's Training", href: "/session/session-2026-06-19", tone: "primary" }]);
  });

  it("keeps June 16 style KPI behavior when the day is performance testing", () => {
    const display: PlanDayDisplayModel = {
      methodologyPhase: "Foundation + Acceleration",
      sportLoads: [],
      loadRule: null,
      testingEvent: "Perf Testing",
      displayTags: ["Foundation + Acceleration", "Perf Testing"],
    };
    const presentation = buildDayPresentation({
      date: "2026-06-16",
      display,
      plannedKpis: [
        {
          id: "kpi-10-yard",
          name: "10-Yard Sprint",
          category: "Speed",
          instructions: ["Sprint fast."],
          units: "sec",
          attempts: 3,
          scoringMethod: "lowest",
          fields: [{ id: "result", label: "Time", type: "number", unit: "sec" }],
          coachingNotes: [],
          safetyNotes: "",
        },
      ],
    });

    expect(presentation.isKpiTestingDay).toBe(true);
    expect(presentation.kpiEvidenceSummary.state).toBe("planned");
  });
});

function buildRouteLikeDayPresentation(date: string) {
  const executionEntries = getV84DayExecutionEntries(date);
  const dayContext = projectDayPresentationContext(date);
  const plannedActivities = projectPlannedDayActivities(date);
  const trainingWorkEntries = getV84TrainingWorkEntries(date);
  const sportLoads = getV84SportLoadsForDate(date);
  const v84Session = getV84SessionByDate(date);
  const v84Workout = v84Session ? getV84SessionWorkout(v84Session.sessionId) || undefined : undefined;
  const trainingWorkHref = v84Session ? `/session/${v84Session.sessionId}` : "";
  const drills = v84Session ? getV84SessionDrills(v84Session.sessionId) : [];

  return {
    canResolveDayRoute: Boolean(sportLoads.length || executionEntries.length),
    dayContext,
    plannedActivities,
    sportLoads,
    presentation: buildDayPresentation({
      date,
      sportLoads,
      executionEntries,
      plannedActivities,
      workout: v84Workout,
      drills,
      logTodayHref: sportLoads[0] ? `/external-load/${encodeURIComponent(sportLoads[0].id)}` : trainingWorkHref || `/day/${date}`,
      trainingWorkHref,
      trainingWorkLogHref: `/training-work/${date}`,
      fallbackTitle: v84Session?.summary,
      dayContext,
    }),
    trainingWorkEntries,
  };
}

function isRecoveryOrLightDay(routeData: ReturnType<typeof buildRouteLikeDayPresentation>) {
  const text = [
    routeData.presentation.dayTitle,
    routeData.presentation.plannedWorkSummary,
    routeData.presentation.athleteActionSummary,
    routeData.presentation.loadRule,
    routeData.presentation.recovery,
    ...routeData.plannedActivities.map((activity) => `${activity.category} ${activity.athleteTitle} ${activity.instruction} ${activity.coachingCue}`),
    ...routeData.trainingWorkEntries.map((entry) => `${entry.entryType} ${entry.entryTitle} ${entry.notes}`),
  ].join(" ").toLowerCase();
  return /recovery|mobility|cooldown|easy|light|fresh|deload/.test(text);
}

function drill(id: string, name: string, category: string, equipment: string[]): Drill {
  return {
    id,
    name,
    category,
    purpose: `${name} purpose`,
    setup: `${name} setup`,
    setupChecklist: [],
    instructions: [],
    plannedSets: null,
    plannedReps: null,
    plannedDuration: null,
    equipment,
    coachingCues: [],
    commonMistakes: [],
    progression: "",
    regression: "",
    safetyNotes: "",
    videoUrl: null,
    qrUrl: null,
    sourceTag: "test",
  };
}
