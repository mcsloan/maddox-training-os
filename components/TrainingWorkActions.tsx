"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTrainingWorkLogByDate } from "@/lib/storage/trainingWorkRepository";
import { TrainingWorkLog } from "@/lib/types";

export function TrainingWorkActions({ date, blockSummary }: { date: string; blockSummary: string[] }) {
  const [log, setLog] = useState<TrainingWorkLog | null>(null);

  useEffect(() => {
    setLog(getTrainingWorkLogByDate(date));
  }, [date]);

  return (
    <div className="mt-5 rounded-2xl bg-ice p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-black">{log ? "Training work logged" : "Training work not logged"}</p>
          {log ? (
            <p className="mt-1 text-sm">
              {log.completed ? "Completed yes" : "Completed no"} · Duration {log.actualDuration ?? "—"} min · Effort {log.effort ?? "—"}/5
            </p>
          ) : blockSummary.length > 0 ? (
            <p className="mt-1 text-sm">Blocks: {blockSummary.join(", ")}</p>
          ) : null}
        </div>
        <Link className={log ? "btn-secondary" : "btn-primary"} href={`/training-work/${date}`}>
          {log ? "Update Training Work Log" : "Log Training Work"}
        </Link>
      </div>
    </div>
  );
}
