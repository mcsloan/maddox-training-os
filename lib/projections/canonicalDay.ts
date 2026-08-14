import { buildDayPresentation, type DayPresentation } from "./dayPresentation";
import {
  isJune30KpiHotfixDate,
  projectDayPresentationContext,
  projectPlannedDayActivities,
  weekLoadLabel,
  type ActivityPresentation,
} from "./activityPresentation";
import { getV84DayExecutionEntries, getV84SportLoadsForDate } from "../imports/v8_4/daily";
import { getV84SessionByDate, getV84SessionDrills, getV84SessionWorkout } from "../imports/v8_4/session";
import kpisJson from "../../data/kpis.json";
import planJson from "../../data/plan.json";
import type { KPI, PlannedExternalLoad, PlanDayDisplayModel, TrainingPlan } from "../types";

const legacyPlan = planJson as TrainingPlan;
const legacyKpis = kpisJson as KPI[];

export type CanonicalDayDiagnostic =
  | "legacy_title_ignored_in_favour_of_v84"
  | "duration_scopes_require_source_review";

export type CanonicalDurationScope = {
  trainingWorkMinutes: number;
  sportLoadMinutes: number;
  readinessReflectionMinutes: number;
  otherMinutes: number;
};

export interface CanonicalDayViewModel {
  isResolvable: boolean;
  date: string;
  title: string;
  sessionId: string | null;
  dayType: string;
  phase: string;
  intensity: number;
  duration: {
    sessionEstimate: {
      minutes: number | null;
      source: "v8.4_session" | "legacy_gap" | "missing";
      semanticScope: "unverified_session_estimate";
    };
    rawExecution: CanonicalDurationScope;
    projectedExecution: CanonicalDurationScope;
    comparisonStatus: "scope_unresolved";
  };
  kpi: {
    isCheckpoint: boolean;
    kpiIds: string[];
    kpiNames: string[];
    items: Array<{ id: string; name: string; instructions: string[] }>;
    resultHref: string | null;
    exception: "june_30_kpi_presentation" | null;
  };
  activities: ActivityPresentation[];
  sportLoads: PlannedExternalLoad[];
  logging: {
    primaryHref: string;
    trainingWorkHref: string | null;
    trainingWorkLogHref: string;
    sportLoadHrefs: string[];
  };
  readiness: {
    instruction: string | null;
    coachingCue: string | null;
    recoveryActivityIds: string[];
  };
  presentation: DayPresentation;
  diagnostics: CanonicalDayDiagnostic[];
  executionEntries: ReturnType<typeof getV84DayExecutionEntries>;
}

export function projectCanonicalDay(date: string): CanonicalDayViewModel {
  const legacyDay = legacyPlan.days.find((day) => day.date === date);
  const session = getV84SessionByDate(date);
  const executionEntries = getV84DayExecutionEntries(date);
  const sportLoads = getV84SportLoadsForDate(date);
  const activities = projectPlannedDayActivities(date);
  const dayContext = projectDayPresentationContext(date);
  const v84Workout = session ? getV84SessionWorkout(session.sessionId) || undefined : undefined;
  const drills = session ? getV84SessionDrills(session.sessionId) : [];
  const hasExecutableKpi = activities.some((activity) => activity.category === "kpi");
  const canonicalKpiIds = activities.find((activity) => activity.category === "kpi")?.sourceTrace?.detailIds ?? legacyDay?.kpiTestIds ?? [];
  const plannedKpis = hasExecutableKpi
    ? canonicalKpiIds.map((id) => legacyKpis.find((kpi) => kpi.id === id)).filter((kpi): kpi is KPI => Boolean(kpi))
    : [];
  const trainingWorkHref = session?.hasTrainingWork
    ? `/session/${session.sessionId}`
    : legacyDay?.workoutId
      ? `/session/${legacyDay.workoutId}`
      : null;
  const sportLoadHrefs = sportLoads.map((load) => `/external-load/${encodeURIComponent(load.id)}`);
  const primaryHref = `/log/${date}`;
  const sessionEstimatedMinutes = session?.estimatedDurationMin ?? legacyDay?.durationMinutes ?? null;
  const rawExecution = rawDurationScope(executionEntries);
  const projectedExecution = projectedDurationScope(activities);
  const diagnostics: CanonicalDayDiagnostic[] = [];
  if (session?.summary && legacyDay?.primarySession && session.summary !== legacyDay.primarySession) {
    diagnostics.push("legacy_title_ignored_in_favour_of_v84");
  }
  diagnostics.push("duration_scopes_require_source_review");
  const readinessActivity = activities.find((activity) => activity.category === "readiness");
  const intensity = canonicalIntensity(legacyDay?.intensity, session?.hasTrainingWork ?? false, sportLoads);
  const presentation = buildDayPresentation({
    date,
    day: legacyDay,
    display: canonicalDisplayModel(session?.week ?? legacyDay?.weekNumber ?? 1, session?.dayType, sportLoads, hasExecutableKpi),
    sportLoads,
    executionEntries,
    plannedActivities: activities,
    workout: v84Workout,
    workoutBlocks: [],
    drills,
    videos: [],
    plannedKpis,
    logTodayHref: primaryHref,
    trainingWorkHref: trainingWorkHref ?? undefined,
    trainingWorkLogHref: `/training-work/${date}`,
    fallbackTitle: session?.summary,
    dayContext,
    canonicalKpiState: hasExecutableKpi,
    canonicalTitle: dayContext.heroTitle,
    canonicalHasTrainingWork: activities.some((activity) => activity.executable && !["none", "checkoff", "sport_load_log", "reflection_log"].includes(activity.logType)),
  });

  return {
    isResolvable: Boolean(legacyDay || session || executionEntries.length || sportLoads.length),
    date,
    title: presentation.dayTitle,
    sessionId: session?.sessionId ?? null,
    dayType: session?.dayType || legacyDay?.dayRole || "Planned day",
    phase: session?.trainingPhase || legacyDay?.phase || dayContext.phaseLabel || "Offseason Plan",
    intensity,
    duration: {
      sessionEstimate: {
        minutes: sessionEstimatedMinutes,
        source: session ? "v8.4_session" : legacyDay?.durationMinutes ? "legacy_gap" : "missing",
        semanticScope: "unverified_session_estimate",
      },
      rawExecution,
      projectedExecution,
      comparisonStatus: "scope_unresolved",
    },
    kpi: {
      isCheckpoint: hasExecutableKpi,
      kpiIds: plannedKpis.map((kpi) => kpi.id),
      kpiNames: plannedKpis.map((kpi) => kpi.name),
      items: plannedKpis.map((kpi) => ({ id: kpi.id, name: kpi.name, instructions: kpi.instructions })),
      resultHref: hasExecutableKpi ? "/kpis" : null,
      exception: isJune30KpiHotfixDate(date) ? "june_30_kpi_presentation" : null,
    },
    activities,
    sportLoads,
    logging: {
      primaryHref,
      trainingWorkHref,
      trainingWorkLogHref: `/training-work/${date}`,
      sportLoadHrefs,
    },
    readiness: {
      instruction: readinessActivity?.instruction ?? null,
      coachingCue: readinessActivity?.coachingCue ?? null,
      recoveryActivityIds: activities
        .filter((activity) => activity.category === "recovery" || activity.category === "mobility")
        .map((activity) => activity.id),
    },
    presentation,
    diagnostics,
    executionEntries,
  };
}

function emptyDurationScope(): CanonicalDurationScope {
  return { trainingWorkMinutes: 0, sportLoadMinutes: 0, readinessReflectionMinutes: 0, otherMinutes: 0 };
}

function rawDurationScope(entries: ReturnType<typeof getV84DayExecutionEntries>) {
  const scope = emptyDurationScope();
  for (const entry of entries) {
    const minutes = entry.plannedDurationMin ?? 0;
    if (entry.logType === "trainingWorkLog" || entry.logType === "kpiLog") scope.trainingWorkMinutes += minutes;
    else if (entry.logType === "sportLoadLog") scope.sportLoadMinutes += minutes;
    else if (entry.logType === "readinessLog" || entry.logType === "reflectionLog") scope.readinessReflectionMinutes += minutes;
    else scope.otherMinutes += minutes;
  }
  return scope;
}

function projectedDurationScope(activities: ActivityPresentation[]) {
  const scope = emptyDurationScope();
  for (const activity of activities) {
    if (!activity.executable) continue;
    const minutes = activity.plannedDurationMinutes ?? 0;
    if (["drill_log", "shooting_log", "kpi_log", "recovery_log"].includes(activity.logType)) scope.trainingWorkMinutes += minutes;
    else if (activity.logType === "sport_load_log") scope.sportLoadMinutes += minutes;
    else if (activity.category === "readiness" || activity.category === "reflection") scope.readinessReflectionMinutes += minutes;
    else scope.otherMinutes += minutes;
  }
  return scope;
}

function canonicalIntensity(legacyIntensity: number | undefined, hasTrainingWork: boolean, sportLoads: PlannedExternalLoad[]) {
  const sportLoadIntensity = sportLoads.length ? Math.max(...sportLoads.map((load) => load.plannedIntensity)) : 0;
  if (sportLoadIntensity > 0) return sportLoadIntensity;
  if (legacyIntensity) return legacyIntensity;
  return hasTrainingWork ? 3 : 0;
}

function canonicalDisplayModel(week: number, dayType: string | undefined, sportLoads: PlannedExternalLoad[], isKpi: boolean): PlanDayDisplayModel {
  const methodologyPhase = weekLoadLabel(week) as PlanDayDisplayModel["methodologyPhase"];
  const sportLoadLabels = Array.from(new Set(sportLoads.map((load) =>
    load.type === "hockey_camp" ? "Camp" : load.type.startsWith("lacrosse") ? "Lacrosse" : "On-Ice",
  ))) as PlanDayDisplayModel["sportLoads"];
  const loadRule = week === 7 ? "Deload" : /recovery|lighter|deload/i.test(dayType || "") || sportLoads.length ? "Recovery" : null;
  const testingEvent = isKpi ? "Perf Testing" : null;
  return {
    methodologyPhase,
    sportLoads: sportLoadLabels,
    loadRule,
    testingEvent,
    displayTags: [methodologyPhase, ...sportLoadLabels, ...(loadRule ? [loadRule] : []), ...(testingEvent ? [testingEvent] : [])],
  };
}
