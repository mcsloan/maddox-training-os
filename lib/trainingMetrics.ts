import { KPI, KPIResult, SessionLog, Workout } from "@/lib/types";

export function sessionCompletionPercent(session: SessionLog) {
  const exercises = Object.values(session.exercises);
  if (!exercises.length) return session.status === "completed" ? 100 : 0;
  return Math.round((exercises.filter((exercise) => exercise.done).length / exercises.length) * 100);
}

export function kpiBest(kpi: KPI, entries: KPIResult[]) {
  const values = entries.map((entry) => entry.bestResult).filter((value): value is number => value !== null);
  if (!values.length) return null;
  return kpi.scoringMethod === "lowest" ? Math.min(...values) : Math.max(...values);
}

export function kpiTrend(kpi: KPI, entries: KPIResult[]) {
  const values = entries.map((entry) => entry.bestResult).filter((value): value is number => value !== null);
  if (values.length < 2) return "Not enough data";
  const recent = values[0];
  const previous = values[1];
  const difference = recent - previous;
  const threshold = Math.max(Math.abs(previous) * 0.02, 0.01);
  if (Math.abs(difference) <= threshold) return "Flat";
  const improved = kpi.scoringMethod === "lowest" ? difference < 0 : difference > 0;
  return improved ? "Improving" : "Declining";
}

export function workoutName(workout?: Workout) {
  return workout?.dayFocus || "Unknown workout";
}
