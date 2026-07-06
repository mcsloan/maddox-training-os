import { sportLoads } from "./imports/v8_4";
import type { V84SportLoad } from "./imports/v8_4/types";

export type PlanSportLoadOverlayKind = "sport" | "camp" | "onIce" | "travel";

export interface PlanSportLoadOverlayItem {
  date: string;
  week: number;
  title: string;
  details: string;
  kind: PlanSportLoadOverlayKind;
  shortLabel: string;
}

export interface PlanSportLoadOverlayRow {
  label: string;
  kind: PlanSportLoadOverlayKind;
  markers: Array<{
    week: number;
    label: string;
    shortLabel: string;
    title: string;
    date: string;
  }>;
}

export function getPlanSportLoadOverlayItems(): PlanSportLoadOverlayItem[] {
  return sportLoads.map((load) => toOverlayItem(load));
}

export function getPlanSportLoadOverlayItemsForWeek(weekNumber: number): PlanSportLoadOverlayItem[] {
  return getPlanSportLoadOverlayItems().filter((item) => item.week === weekNumber);
}

export function buildPlanSportLoadOverlayRows(): PlanSportLoadOverlayRow[] {
  const rows = new Map<string, PlanSportLoadOverlayRow>();
  for (const item of getPlanSportLoadOverlayItems()) {
    const key = rowKey(item);
    const row = rows.get(key) ?? {
      label: rowLabel(item),
      kind: item.kind,
      markers: [],
    };
    row.markers.push({
      week: item.week,
      label: `${formatShortDate(item.date)} · ${item.title}`,
      shortLabel: item.shortLabel,
      title: `${formatShortDate(item.date)} · ${item.title} · ${item.details}`,
      date: item.date,
    });
    rows.set(key, row);
  }
  return Array.from(rows.values()).map((row) => ({
    ...row,
    markers: row.markers.sort((a, b) => a.date.localeCompare(b.date)),
  }));
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

function formatShortDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
