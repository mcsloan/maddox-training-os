"use client";

import { useEffect, useState } from "react";
import { loadTrainingHistory } from "@/lib/storage/completedSessionRepository";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { getWeekPlanSummary, trainingPlan, workouts } from "@/lib/trainingData";
import { estimateWeeklyActualLoad } from "@/lib/trainingMetrics";

export function WeeklyLoadChart() {
  const [actuals, setActuals] = useState<Record<number, number | null>>({});

  useEffect(() => {
    let active = true;
    Promise.all([loadTrainingHistory(), loadExternalLoadLogs()]).then(([history, sportLoads]) => {
      if (!active) return;
      setActuals(Object.fromEntries(trainingPlan.weeks.map((week) => [
        week.weekNumber,
        estimateWeeklyActualLoad(week, history.sessions, sportLoads.logs, workouts),
      ])));
    });
    return () => { active = false; };
  }, []);

  const hasActuals = Object.values(actuals).some((value) => value !== null);
  return (
    <section className="card mt-6">
      <p className="label">Planned vs actual foundation</p>
      <h2 className="text-2xl font-black">Weekly Load</h2>
      <p className="mt-2 text-sm text-slate-600">Planned load reflects the full plan, including dryland, hockey, lacrosse, camps, recovery, and taper.</p>
      <div className="mt-6 overflow-x-auto"><div className="grid min-w-[720px] grid-cols-12 gap-2">
        {trainingPlan.weeks.map((week) => {
          const planned = getWeekPlanSummary(week).loadLevel;
          const actual = actuals[week.weekNumber];
          return <div className="flex min-w-0 flex-col items-center" key={week.weekNumber}>
            <div className="flex h-36 w-full items-end justify-center gap-1 rounded-t-xl bg-ice px-1">
              <div className="w-2/5 rounded-t bg-blue" style={{ height: `${planned * 20}%` }} title={`Planned ${planned}/5`} />
              <div className="w-2/5 rounded-t border-2 border-cyan-600 bg-cyan-100" style={{ height: actual === null || actual === undefined ? "0%" : `${actual * 20}%` }} title={actual === null || actual === undefined ? "Actual pending" : `Actual ${actual}/5`} />
            </div>
            <p className="mt-2 text-xs font-black">W{week.weekNumber}</p>
            <p className="text-[10px] text-slate-500">{planned}/5</p>
          </div>;
        })}
      </div></div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold"><span><span className="mr-1 inline-block h-3 w-3 bg-blue" />Planned</span><span><span className="mr-1 inline-block h-3 w-3 border border-cyan-600 bg-cyan-100" />Actual perceived load</span></div>
      {!hasActuals && <p className="mt-4 rounded-xl bg-ice p-3 text-sm font-semibold">Actual load will appear after sessions are logged.</p>}
      <p className="mt-3 text-xs text-slate-500">Actual perceived load uses logged effort when available, then session difficulty, with planned session intensity as a fallback. It is a coaching estimate, not a medical measure.</p>
    </section>
  );
}
