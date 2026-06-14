"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { ExternalLoadLog, PlannedExternalLoad } from "@/lib/types";

export function ExternalLoadActions({ loads }: { loads: PlannedExternalLoad[] }) {
  const [logs, setLogs] = useState<ExternalLoadLog[]>([]);
  useEffect(() => { loadExternalLoadLogs().then((result) => setLogs(result.logs)); }, []);

  return <div className="mt-4 space-y-3">{loads.map((load) => {
    const log = logs.find((item) => item.externalLoadId === load.id);
    return <div className="rounded-2xl bg-ice p-4" key={load.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-black">{log ? "Logged" : "Not logged"}</p>{log && <p className="mt-1 text-sm">Effort {log.effort ?? "—"}/5 · Energy {log.energyAfter ?? "—"}/5 · Confidence {log.confidence ?? "—"}/5 · Soreness {log.soreness}/5{log.painFlag ? " · Pain flagged" : ""}</p>}</div><Link className={log ? "btn-secondary" : "btn-primary"} href={`/external-load/${load.id}`}>{log ? "Update External Load Log" : "Log External Load"}</Link></div></div>;
  })}</div>;
}
