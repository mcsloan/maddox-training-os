"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadChip } from "@/components/LoadChips";
import { getV84SportLoadsForDate } from "@/lib/imports/v8_4/daily";
import { formatPlanDate, getCalendarDates, getDayTags, getPlanDay, getPlanDayDisplayModel, getWeekLoadLabel, trainingPlan, userFacingLoadRule, userFacingPlanText } from "@/lib/trainingData";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { ExternalLoadLog } from "@/lib/types";
import { buildDayEvidenceProjection } from "@/lib/projections/dayEvidence";
import { buildCalendarDayProjection } from "@/lib/projections/screenProjections";
import { loadStandaloneKpiResults, SyncedKPIResult } from "@/lib/storage/cloudKpiRepository";
import { buildDayPresentation } from "@/lib/projections/dayPresentation";

export default function CalendarPage() {
  const [logs, setLogs] = useState<ExternalLoadLog[]>([]);
  const [kpiResults, setKpiResults] = useState<SyncedKPIResult[]>([]);
  useEffect(() => {
    loadExternalLoadLogs().then((result) => setLogs(result.logs));
    loadStandaloneKpiResults().then((result) => setKpiResults(result.results));
  }, []);
  return (
    <div>
      <div className="mb-6">
        <p className="label">Daily calendar</p>
        <h1 className="text-4xl font-black">Training Days</h1>
        <p className="mt-2 text-slate-600">Open any scheduled day to inspect the complete plan before starting.</p>
      </div>
      <div className="space-y-8">
        {trainingPlan.weeks.map((week) => {
          const dates = getCalendarDates().filter((date) => date >= week.startDate && date <= week.endDate);
          return (
            <section id={`week-${week.weekNumber}`} className="scroll-mt-24" key={week.weekNumber}>
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><p className="label">Week {week.weekNumber} · {getWeekLoadLabel(week.weekNumber)}</p><h2 className="text-2xl font-black">{getWeekLoadLabel(week.weekNumber)}</h2></div><p className="text-sm font-semibold text-slate-500">{formatPlanDate(week.startDate)} to {formatPlanDate(week.endDate)}</p></div>
              <div className="grid gap-4 lg:grid-cols-2">
                {dates.map((date) => {
                  const day = getPlanDay(date);
                  const loads = getV84SportLoadsForDate(date);
                  const tags = getDayTags(date);
                  const display = getPlanDayDisplayModel(date);
                  const intensity = Math.max(day?.intensity || 0, ...loads.map((load) => load.plannedIntensity));
                  const evidenceProjection = buildDayEvidenceProjection({
                    date,
                    weekNumber: week.weekNumber,
                    sportLoadLogs: logs,
                    kpiResults,
                    projection: "preview",
                  });
                  const calendarProjection = buildCalendarDayProjection(evidenceProjection);
                  const presentation = buildDayPresentation({
                    date,
                    day,
                    display,
                    tags,
                    sportLoads: loads,
                    evidence: evidenceProjection,
                  });
                  return <article className="card border-2 border-transparent transition hover:border-blue" key={date}>
                    <Link href={`/day/${date}`} className="block"><div className="flex items-start justify-between gap-3"><div><p className="label">{formatPlanDate(date, { weekday: "long", month: "short", day: "numeric" })} · Week {week.weekNumber}</p><h3 className="text-xl font-black">{day?.primarySession || loads[0]?.title || "Recovery / planning day"}</h3></div><div className="flex flex-wrap justify-end gap-2">{day && <span className="rounded-full bg-ice px-3 py-1 text-xs font-black text-blue">{userFacingPlanText(day.dayRole)}</span>}<span className="rounded-full bg-lime/20 px-3 py-1 text-xs font-black text-navy">{calendarProjection.summaryLabel}</span></div></div>
                    <div className="mt-3 flex flex-wrap gap-2">{presentation.chips.map((chip) => <LoadChip key={chip.key} kind={chip.kind} label={chip.label} />)}</div>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <p><strong>Method phase:</strong> {display.methodologyPhase}</p><p><strong>Load:</strong> {intensity}/5</p>
                      <p><strong>Off-ice:</strong> {day?.primarySession || "None planned"}</p><p><strong>Sport Load:</strong> {calendarProjection.hasLoggedSportLoad ? "Logged" : loads.length ? `${loads.length} planned` : "None planned"}</p>
                      <p><strong>Recovery:</strong> {userFacingPlanText(day?.recovery || loads[0]?.recoveryRule || "Recovery as needed")}</p><p><strong>Parent cue:</strong> {userFacingPlanText(day?.parentCue || "Prioritize recovery and ask about energy.")}</p>
                    </div>
                    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"><strong>Load rule:</strong> {userFacingLoadRule(loads[0]?.doNotDoRule || day?.doNotDo, loads.length > 0)}</p></Link>
                    {loads.length > 0 && <div className="mt-3 space-y-2">{loads.map((load) => { const log = logs.find((item) => item.externalLoadId === load.id); return <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-ice p-3" key={load.id}><p className="text-sm font-semibold">{log ? `Logged: effort ${log.effort ?? "—"}/5 · energy ${log.energyAfter ?? "—"}/5 · confidence ${log.confidence ?? "—"}/5 · soreness ${log.soreness}/5${log.painFlag ? " · pain flagged" : ""}` : "Not logged"}</p><Link className={log ? "btn-secondary" : "btn-primary"} href={`/external-load/${encodeURIComponent(load.id)}`}>{log ? `Update ${load.title}` : `Log ${load.title}`}</Link></div>; })}</div>}
                  </article>;
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
