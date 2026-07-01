import overlayJson from "../data/weaknessOverlay_2026_07_01.json";

export type WeaknessOverlayItem = {
  moduleId: string;
  label: string;
  classification: string;
};

export type WeaknessOverlayDay = {
  date: string;
  campAdjustment?: boolean;
  items: WeaknessOverlayItem[];
};

export type WeaknessOverlayModule = {
  id: string;
  title: string;
  cue?: string;
  frequency?: string;
  duration?: string;
  structure?: string[];
  rules?: string[];
  exercises?: string[];
  safety?: string[];
  focus?: string[];
};

export type WeaknessOverlay = {
  id: string;
  title: string;
  status: string;
  subtitle: string;
  focusAreas: string[];
  shortTermTargets: string[];
  modules: WeaknessOverlayModule[];
  schedule: WeaknessOverlayDay[];
};

const overlay = overlayJson as WeaknessOverlay;

export function getWeaknessOverlayForDate(date: string) {
  const day = overlay.schedule.find((item) => item.date === date);
  if (!day) return null;
  return {
    id: overlay.id,
    title: "Weakness Overlay",
    sourceTitle: overlay.title,
    status: overlay.status,
    subtitle: overlay.subtitle,
    focusAreas: overlay.focusAreas,
    shortTermTargets: overlay.shortTermTargets,
    day,
    modules: overlay.modules.filter((module) => day.items.some((item) => item.moduleId === module.id)),
  };
}

export function getWeaknessOverlaySchedule() {
  return overlay.schedule;
}
