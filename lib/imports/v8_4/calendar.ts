import { dayExecutionPlan, phaseMap } from "./index";

export interface V84CalendarWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  trainingPhase: string;
  speedStackAlignment: string;
  dates: string[];
}

export function getV84CalendarDates() {
  const range = getV84PlanDateRange();
  if (!range) return [];
  return Array.from(new Set(dayExecutionPlan.map((entry) => entry.date)))
    .filter((date) => date >= range.startDate && date <= range.endDate)
    .sort();
}

export function getV84CalendarWeeks(): V84CalendarWeek[] {
  const planDates = getV84CalendarDates();
  return phaseMap.map((week) => ({
    weekNumber: week.week,
    startDate: week.start,
    endDate: week.end,
    trainingPhase: week.trainingPhase,
    speedStackAlignment: week.speedStackAlignment,
    dates: planDates.filter((date) => date >= week.start && date <= week.end),
  }));
}

export function getV84PlanDateRange() {
  const sortedWeeks = [...phaseMap].sort((a, b) => a.start.localeCompare(b.start));
  const first = sortedWeeks[0];
  const last = sortedWeeks[sortedWeeks.length - 1];
  if (!first || !last) return null;
  return { startDate: first.start, endDate: last.end };
}
