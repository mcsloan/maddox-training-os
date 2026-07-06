import type { PlannedExternalLoad } from "./types";

export interface DaySportLoadPlanItem {
  label: string;
  title: string;
  details: string;
  href: string;
  status: string;
}

export interface DaySportLoadSummaryLabel {
  text: string;
  lowerText: string;
  verb: "is" | "are";
}

export function buildDaySportLoadPlanItems(loads: PlannedExternalLoad[]): DaySportLoadPlanItem[] {
  return loads.map((load, index) => ({
    label: sportLoadPlanLabel(index),
    title: load.title,
    details: load.notes,
    href: `/external-load/${encodeURIComponent(load.id)}`,
    status: "planned / not logged until saved",
  }));
}

export function buildDaySportLoadSummaryLabel(loads: PlannedExternalLoad[]): DaySportLoadSummaryLabel {
  if (loads.length === 1) {
    const text = loads[0].title || "Sport Load";
    return { text, lowerText: text.toLowerCase(), verb: "is" };
  }
  if (loads.length > 1) {
    const text = `${loads.length} Sport Loads Planned`;
    return { text, lowerText: text.toLowerCase(), verb: "are" };
  }
  return { text: "Sport Load", lowerText: "sport load", verb: "is" };
}

export function sportLoadPlanLabel(index: number) {
  return String.fromCharCode(65 + index);
}
