"use client";

import { useState } from "react";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";
import { clearLocalExternalLoadLogs } from "@/lib/storage/externalLoadRepository";

export function ClearLocalDataButton() {
  const [cleared, setCleared] = useState(false);

  function clear() {
    if (!window.confirm("Clear all local session logs, KPI results, and external load logs from this browser? This cannot be undone.")) return;
    localSessionRepository.clearAll();
    localKpiRepository.clearAll();
    clearLocalExternalLoadLogs();
    setCleared(true);
  }

  return <button className="btn-secondary w-full border-red-200 text-red-700 hover:border-red-500" onClick={clear}>{cleared ? "Local Training Data Cleared" : "Clear Local Training Data"}</button>;
}
