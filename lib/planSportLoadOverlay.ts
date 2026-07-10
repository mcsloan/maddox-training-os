import { phaseLabels, sportLoads } from "./imports/v8_4";
import type { V84SportLoad } from "./imports/v8_4/types";

export type PlanSportLoadOverlayKind = "sport" | "camp" | "onIce" | "travel";
export type PlanGanttDisplayKind = "marker" | "bar";

export interface PlanSportLoadOverlayItem {
  date: string;
  week: number;
  title: string;
  details: string;
  kind: PlanSportLoadOverlayKind;
  shortLabel: string;
}

export type PlanSportLoadDurationKind = "single-day" | "multi-day";

export interface PlanSportLoadOverlayMarker {
  week: number;
  label: string;
  shortLabel: string;
  title: string;
  date: string;
  startDate: string;
  endDate: string;
  startOffset: number;
  endOffset: number;
  dateLabel: string;
  durationKind: PlanSportLoadDurationKind;
  displayKind: PlanGanttDisplayKind;
}

export interface PlanSportLoadOverlayRow {
  label: string;
  kind: PlanSportLoadOverlayKind;
  markers: PlanSportLoadOverlayMarker[];
}

export interface PlanTimelineDay {
  date: string;
  week: number;
  dayOfWeek: number;
  dayLabel: string;
  dayOfMonth: number;
  shortDate: string;
}

export function getPlanSportLoadOverlayItems(): PlanSportLoadOverlayItem[] {
  return sportLoads.map((load) => toOverlayItem(load));
}

export function getPlanSportLoadOverlayItemsForWeek(weekNumber: number): PlanSportLoadOverlayItem[] {
  return getPlanSportLoadOverlayItems().filter((item) => item.week === weekNumber);
}

export function buildPlanSportLoadOverlayRows(): PlanSportLoadOverlayRow[] {
  const rows = new Map<string, PlanSportLoadOverlayRow>();

  for (const segment of buildSportLoadSegments(getPlanSportLoadOverlayItems())) {
    const key = rowKey(segment);
    const row = rows.get(key) ?? {
      label: rowLabel(segment),
      kind: segment.kind,
      markers: [],
    };

    row.markers.push({
      week: getWeekForDate(segment.startDate),
      label: `${segment.dateLabel} · ${segment.title}`,
      shortLabel: segment.shortLabel,
      title: `${segment.dateLabel} · ${segment.title} · ${segment.details}`,
      date: segment.startDate,
      startDate: segment.startDate,
      endDate: segment.endDate,
      startOffset: getDayColumnIndex(segment.startDate),
      endOffset: getDayColumnIndex(segment.endDate),
      dateLabel: segment.dateLabel,
      durationKind: segment.durationKind,
      displayKind: isSingleDayEvent(segment.startDate, segment.endDate) ? "marker" : "bar",
    });

    rows.set(key, row);
  }

  return Array.from(rows.values()).map((row) => ({
    ...row,
    markers: row.markers.sort((a, b) => a.startDate.localeCompare(b.startDate) || a.week - b.week),
  }));
}

export function getTimelineDays(): PlanTimelineDay[] {
  const firstWeek = phaseLabels[0];
  if (!firstWeek) return [];

  return Array.from({ length: phaseLabels.length * 7 }, (_, offset) => {
    const date = addDays(firstWeek.start, offset);
    return {
      date,
      week: getWeekForDate(date),
      dayOfWeek: offset % 7,
      dayLabel: ["M", "T", "W", "T", "F", "S", "S"][offset % 7],
      dayOfMonth: Number(date.slice(8, 10)),
      shortDate: formatShortDate(date),
    };
  });
}

export function getWeekForDate(date: string) {
  const matchingWeek = phaseLabels.find((week) => date >= week.start && date <= week.end);
  if (!matchingWeek) {
    throw new Error(`Date ${date} is outside the v8.4 12-week plan.`);
  }
  return matchingWeek.week;
}

export function getDayColumnIndex(date: string) {
  const firstWeek = phaseLabels[0];
  if (!firstWeek) {
    throw new Error("Cannot build Gantt day columns without v8.4 phase labels.");
  }

  const offset = daysBetween(firstWeek.start, date);
  if (offset < 0 || offset >= phaseLabels.length * 7) {
    throw new Error(`Date ${date} is outside the v8.4 12-week plan.`);
  }
  return offset;
}

export function getSpanGridColumns(startDate: string, endDate: string) {
  return {
    startColumn: getDayColumnIndex(startDate) + 1,
    endColumn: getDayColumnIndex(endDate) + 2,
  };
}

export function isSingleDayEvent(startDate: string, endDate: string) {
  return startDate === endDate;
}

interface PlanSportLoadOverlaySegment extends PlanSportLoadOverlayItem {
  startDate: string;
  endDate: string;
  dateLabel: string;
  durationKind: PlanSportLoadDurationKind;
  weeks: number[];
}

function buildSportLoadSegments(items: PlanSportLoadOverlayItem[]): PlanSportLoadOverlaySegment[] {
  const sortedItems = [...items].sort((a, b) => {
    const titleCompare = rowKey(a).localeCompare(rowKey(b));
    if (titleCompare) return titleCompare;
    return a.date.localeCompare(b.date);
  });
  const segments: PlanSportLoadOverlaySegment[] = [];

  for (const item of sortedItems) {
    const last = segments[segments.length - 1];
    if (last && shouldGroupAsDateRange(last) && rowKey(last) === rowKey(item) && item.date === addDays(last.endDate, 1)) {
      last.endDate = item.date;
      last.dateLabel = formatDateRange(last.startDate, last.endDate);
      last.durationKind = "multi-day";
      last.details = mergeDetails(last.details, item.details);
      if (!last.weeks.includes(item.week)) last.weeks.push(item.week);
      continue;
    }

    segments.push({
      ...item,
      startDate: item.date,
      endDate: item.date,
      dateLabel: formatDateRange(item.date, item.date),
      durationKind: "single-day",
      weeks: [item.week],
    });
  }

  return segments;
}

function toOverlayItem(load: V84SportLoad): PlanSportLoadOverlayItem {
  return {
    date: load.date,
    week: load.week,
    title: load.sportLoad,
    details: load.details,
    kind: overlayKind(load.sportLoad),
    shortLabel: shortLabel(load.sportLoad),
  };
}

function rowKey(item: PlanSportLoadOverlayItem) {
  if (/4v4/i.test(item.title)) return "4v4 Hockey";
  return item.title;
}

function rowLabel(item: PlanSportLoadOverlayItem) {
  if (/4v4/i.test(item.title)) return "4v4 Hockey";
  return item.title;
}

function overlayKind(title: string): PlanSportLoadOverlayKind {
  const normalized = title.toLowerCase();
  if (normalized.includes("camp")) return "camp";
  if (normalized.includes("trip") || normalized.includes("travel")) return "travel";
  if (normalized.includes("lacrosse") || normalized.includes("4v4")) return "sport";
  return "onIce";
}

function shortLabel(title: string) {
  if (/4v4/i.test(title)) return "4v4";
  if (/lacrosse/i.test(title)) return "Lax";
  if (/chase/i.test(title)) return "Chase";
  if (/carleton/i.test(title)) return "Carleton";
  if (/sensplex/i.test(title)) return "Sensplex";
  if (/toronto/i.test(title)) return "Travel";
  if (/marc/i.test(title)) return "Marc Ice";
  return "Sport";
}

export function formatShortDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) return formatShortDate(startDate);
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const startMonthLabel = new Date(startYear, startMonth - 1, startDay).toLocaleDateString("en-US", { month: "short" });
  const endMonthLabel = new Date(endYear, endMonth - 1, endDay).toLocaleDateString("en-US", { month: "short" });
  return startMonth === endMonth ? `${startMonthLabel} ${startDay}-${endDay}` : `${startMonthLabel} ${startDay}-${endMonthLabel} ${endDay}`;
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(year, month - 1, day + days);
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, "0");
  const nextDay = String(nextDate.getDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function daysBetween(startDate: string, endDate: string) {
  return (toUtcDate(endDate).getTime() - toUtcDate(startDate).getTime()) / 86_400_000;
}

function toUtcDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function shouldGroupAsDateRange(item: Pick<PlanSportLoadOverlayItem, "kind">) {
  return item.kind === "camp" || item.kind === "travel";
}

function mergeDetails(existing: string, next: string) {
  if (existing === next || existing.includes(next)) return existing;
  return `${existing}; ${next}`;
}
