"use client";

import { KPIResult } from "@/lib/types";
import { KPIRepository } from "./kpiRepository";

const KEY = "maddox-training-os:kpis";

function read(): KPIResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as KPIResult[];
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
  clearAll() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // Clearing is best-effort when browser storage is unavailable.
    }
  },
};
