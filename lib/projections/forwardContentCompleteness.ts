import { projectCanonicalDay } from "./canonicalDay";
import { FORWARD_PLAN_END, FORWARD_PLAN_START } from "./forwardPlanIntegrity";

export type ForwardContentCompletenessRow = {
  date: string;
  activityId: string;
  title: string;
  sourceIds: string[];
  exactPrescriptionAvailable: boolean;
  doseAvailable: boolean;
  tempoRestAvailableWhereRelevant: boolean;
  usefulInstructionsAvailable: boolean;
  coachingCueAvailable: boolean;
  approvedVideoCount: number;
  loggingFieldsAvailable: boolean;
  loggingIdentityValid: boolean;
  issues: string[];
  verdict: "PASS" | "CONTENT GAP" | "VIDEO GAP" | "CONTENT + VIDEO GAP";
};

export function buildForwardContentCompletenessMatrix(): ForwardContentCompletenessRow[] {
  return enumerateDates(FORWARD_PLAN_START, FORWARD_PLAN_END).flatMap((date) => {
    const day = projectCanonicalDay(date);
    return day.activities.filter((activity) => activity.executable && activity.summaryVisible).map((activity) => {
      const children = activity.children ?? [];
      const isSport = activity.logType === "sport_load_log";
      const isKpi = activity.logType === "kpi_log";
      const exactPrescriptionAvailable = isSport || (isKpi && day.kpi.kpiIds.length === 14) || children.length > 0;
      const doseAvailable = isSport || isKpi || (typeof activity.plannedDurationMinutes === "number" && children.some((child) => Boolean(child.plannedReps || child.plannedDurationMinutes)));
      const needsTempoRest = activity.category === "speed_stack";
      const tempoRestAvailableWhereRelevant = !needsTempoRest || children.every((child) => Boolean(child.tempo && child.rest));
      const usefulInstructionsAvailable = isSport || isKpi || children.some((child) => Boolean(child.instruction));
      const coachingCueAvailable = isSport || isKpi || children.some((child) => Boolean(child.coachingCue));
      const approvedVideoCount = children.filter((child) => Boolean(child.videoUrl)).length;
      const loggingFieldsAvailable = activity.logType !== "none";
      const loggingIdentityValid = Boolean(activity.id && activity.sourceTrace?.sessionId === day.sessionId);
      const contentGap = !exactPrescriptionAvailable || !doseAvailable || !tempoRestAvailableWhereRelevant || !usefulInstructionsAvailable;
      const videoGap = !isSport && !isKpi && approvedVideoCount < children.length;
      const issues = [
        !exactPrescriptionAvailable && "exact_prescription_missing",
        !doseAvailable && "dose_missing",
        !tempoRestAvailableWhereRelevant && "tempo_or_rest_missing",
        !usefulInstructionsAvailable && "instructions_missing",
        videoGap && "approved_video_mapping_incomplete",
        activity.id === "SS-A-P5W2" && activity.supportModules?.length !== 2 && "warmup_or_cooldown_detail_unresolved",
        !loggingFieldsAvailable && "logging_fields_missing",
        !loggingIdentityValid && "logging_identity_invalid",
      ].filter((issue): issue is string => Boolean(issue));
      const hasContentGap = contentGap || (activity.id === "SS-A-P5W2" && activity.supportModules?.length !== 2) || !loggingFieldsAvailable || !loggingIdentityValid;
      return {
        date,
        activityId: activity.id,
        title: activity.athleteTitle,
        sourceIds: activity.sourceTrace?.detailIds ?? [],
        exactPrescriptionAvailable,
        doseAvailable,
        tempoRestAvailableWhereRelevant,
        usefulInstructionsAvailable,
        coachingCueAvailable,
        approvedVideoCount,
        loggingFieldsAvailable,
        loggingIdentityValid,
        issues,
        verdict: hasContentGap && videoGap ? "CONTENT + VIDEO GAP" : hasContentGap ? "CONTENT GAP" : videoGap ? "VIDEO GAP" : "PASS",
      };
    });
  });
}

function enumerateDates(start: string, end: string) {
  const dates: string[] = [];
  for (let value = new Date(`${start}T12:00:00Z`); value <= new Date(`${end}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + 1)) dates.push(value.toISOString().slice(0, 10));
  return dates;
}
