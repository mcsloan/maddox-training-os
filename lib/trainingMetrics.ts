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

export function kpiBaseline(entries: KPIResult[]) {
  const chronological = [...entries].sort((a, b) => (a.enteredAt || a.date).localeCompare(b.enteredAt || b.date));
  return chronological.find((entry) => entry.bestResult !== null)?.bestResult ?? null;
}

export function kpiTargetProgress(kpi: KPI, baseline: number | null, current: number | null) {
  if (baseline === null || current === null || kpi.targetValue === undefined) return 0;
  const targetDistance = kpi.scoringMethod === "lowest" ? baseline - kpi.targetValue : kpi.targetValue - baseline;
  const currentDistance = kpi.scoringMethod === "lowest" ? baseline - current : current - baseline;
  if (targetDistance <= 0) return currentDistance >= 0 ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round((currentDistance / targetDistance) * 100)));
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
