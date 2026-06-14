"use client";

import { KPIResult } from "@/lib/types";
import { KPIRepository } from "./kpiRepository";

const KEY = "maddox-training-os:kpis";

function read(): KPIResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as KPIResult[];
  } catch {
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
    window.localStorage.setItem(KEY, JSON.stringify(results));
  },
};
