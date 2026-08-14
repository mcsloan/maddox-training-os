import { projectCanonicalDay } from "./canonicalDay";

export const FORWARD_PLAN_START = "2026-08-14";
export const FORWARD_PLAN_END = "2026-09-06";

export type ForwardPlanIntegrityRow = {
  date: string;
  phase: string;
  dayTitle: string;
  sportLoads: string[];
  speedStack: string | null;
  executableActivities: string[];
  activityDurations: Array<number | null>;
  trainingTotal: number;
  weaknessIntegration: string[];
  kpiState: boolean;
  loggingIds: string[];
  dayRoute: string;
  loggingRoute: string;
  eventDependent: boolean;
  issues: string[];
  verdict: "PASS" | "INTENTIONAL_EVENT_DEPENDENT" | "FAIL";
};

export function buildForwardPlanIntegrityMatrix(): ForwardPlanIntegrityRow[] {
  return enumerateDates(FORWARD_PLAN_START, FORWARD_PLAN_END).map((date) => inspectForwardDate(date));
}

export function inspectForwardDate(date: string): ForwardPlanIntegrityRow {
  const day = projectCanonicalDay(date);
  const executable = day.activities.filter((activity) => activity.executable && activity.summaryVisible);
  const training = executable.filter((activity) => activity.logType !== "sport_load_log");
  const sports = executable.filter((activity) => activity.logType === "sport_load_log");
  const trainingTotal = training.reduce((sum, activity) => sum + (activity.plannedDurationMinutes ?? 0), 0);
  const eventDependent = executable.some((activity) => activity.eventDependent);
  const issues: string[] = [];
  if (!day.isResolvable) issues.push("unresolvable_day");
  if (day.duration.sessionEstimate.minutes !== trainingTotal) issues.push("session_estimate_training_total_mismatch");
  if (training.some((activity) => typeof activity.plannedDurationMinutes !== "number")) issues.push("executable_training_duration_missing");
  if (executable.some((activity) => !activity.id || activity.logType === "none")) issues.push("executable_logging_identity_missing");
  if (new Set(sports.map((activity) => activity.athleteTitle)).size !== sports.length) issues.push("duplicate_sport_load");
  if (sports.length !== day.sportLoads.length) issues.push("sport_load_source_projection_mismatch");
  if (executable.some((activity) => activity.sourceTrace?.sessionId !== day.sessionId)) issues.push("source_session_identity_mismatch");
  if (isSportOnlyDate(date) && training.length) issues.push("sport_only_day_has_training");
  if (date === "2026-08-20" && (training.length !== 1 || training[0].category !== "kpi")) issues.push("kpi_day_has_appended_work");
  if (date === "2026-08-31" && training.some((activity) => activity.category === "conditioning" || activity.category === "speed_stack")) issues.push("taper_has_hard_conditioning_or_full_stack");
  if (["2026-08-17", "2026-08-21"].includes(date) && training.filter((activity) => activity.id === "WEAK-PULL-12").length !== 1) issues.push("pull_weakness_module_missing_or_duplicate");
  if (!["2026-08-17", "2026-08-21"].includes(date) && training.some((activity) => activity.id === "WEAK-PULL-12")) issues.push("pull_weakness_module_wrong_date");
  if (training.filter((activity) => activity.focus === "Shot accuracy").length > 1) issues.push("shooting_weakness_duplicate");
  const speed = training.filter((activity) => activity.category === "speed_stack");
  if (speed.length > 1) issues.push("multiple_speed_stacks");
  if (eventDependent && (date < "2026-09-02" || date > "2026-09-06")) issues.push("event_dependency_wrong_date");

  return {
    date,
    phase: day.phase,
    dayTitle: day.title,
    sportLoads: sports.map((activity) => activity.athleteTitle),
    speedStack: speed[0]?.id ?? null,
    executableActivities: executable.map((activity) => activity.athleteTitle),
    activityDurations: executable.map((activity) => activity.plannedDurationMinutes ?? null),
    trainingTotal,
    weaknessIntegration: training.filter((activity) => activity.focus || activity.id === "WEAK-PULL-12").map((activity) => activity.focus || "Pull strength"),
    kpiState: day.kpi.isCheckpoint,
    loggingIds: executable.map((activity) => activity.id),
    dayRoute: `/day/${date}`,
    loggingRoute: day.logging.primaryHref,
    eventDependent,
    issues,
    verdict: issues.length ? "FAIL" : eventDependent ? "INTENTIONAL_EVENT_DEPENDENT" : "PASS",
  };
}

function isSportOnlyDate(date: string) {
  return ["2026-08-15", "2026-08-16", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28", "2026-09-01"].includes(date);
}

function enumerateDates(start: string, end: string) {
  const dates: string[] = [];
  for (let value = new Date(`${start}T12:00:00Z`); value <= new Date(`${end}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + 1)) dates.push(value.toISOString().slice(0, 10));
  return dates;
}
