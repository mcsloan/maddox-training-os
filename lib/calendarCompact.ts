import type { V84CalendarWeek } from "./imports/v8_4/calendar";
import type { ExternalLoadLog, PlannedExternalLoad } from "./types";

export function localCalendarDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function orderCalendarWeeks(weeks: V84CalendarWeek[], today: string) {
  const current = weeks.find((week) => today >= week.startDate && today <= week.endDate);
  if (!current) return [...weeks].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const future = weeks.filter((week) => week.startDate > current.endDate).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = weeks.filter((week) => week.endDate < current.startDate).sort((a, b) => b.startDate.localeCompare(a.startDate));
  return [current, ...future, ...past];
}

export function conciseCalendarPhase(phase: string) {
  return phase.split(" / ")[0].replace(" + Repeat Sprint", "");
}

export function findCalendarSportLoadLog(load: PlannedExternalLoad, logs: ExternalLoadLog[]) {
  return logs.find((log) => log.externalLoadId === load.id)
    ?? logs.find((log) => log.date === load.date && log.title === load.title)
    ?? null;
}
