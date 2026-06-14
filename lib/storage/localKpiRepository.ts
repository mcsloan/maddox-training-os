"use client";

import { KPIResult } from "@/lib/types";
import { KPIRepository } from "./kpiRepository";

const KEY = "maddox-training-os:kpis";

function read(): KPIResult[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]") as KPIResult[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => (b.enteredAt || b.date).localeCompare(a.enteredAt || a.date)) : [];
  } catch {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
    return [];
  }
}

export const localKpiRepository: KPIRepository = {
  getAll: read,
  getByKpi(kpiId) {
    return read().filter((result) => result.kpiId === kpiId);
  },
  getById(resultId) {
    return read().find((result) => result.id === resultId) || null;
  },
  save(result) {
    const results = read();
    const index = results.findIndex((item) => item.id === result.id);
    if (index >= 0) results[index] = result;
    else results.unshift(result);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(results));
    } catch {
      // The current UI state remains usable when storage is unavailable.
    }
  },
  delete(resultId) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(read().filter((result) => result.id !== resultId)));
    } catch {
      // The page remains usable if storage is unavailable.
    }
  },
  clearAll() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // Clearing is best-effort when browser storage is unavailable.
    }
  },
};
