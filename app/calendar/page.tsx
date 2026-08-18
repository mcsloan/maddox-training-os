"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { conciseCalendarPhase, findCalendarSportLoadLog, localCalendarDate, orderCalendarWeeks } from "@/lib/calendarCompact";
import { getV84CalendarWeeks } from "@/lib/imports/v8_4/calendar";
import { projectCanonicalDay } from "@/lib/projections/canonicalDay";
import { buildDayEvidenceProjection } from "@/lib/projections/dayEvidence";
import { buildCalendarDayProjection } from "@/lib/projections/screenProjections";
import { loadStandaloneKpiResults, type SyncedKPIResult } from "@/lib/storage/cloudKpiRepository";
import { loadTrainingHistory } from "@/lib/storage/completedSessionRepository";
import { loadExternalLoadLogs } from "@/lib/storage/externalLoadRepository";
import { loadTrainingWorkLogs } from "@/lib/storage/trainingWorkRepository";
import { formatPlanDate } from "@/lib/trainingData";
import type { ExternalLoadLog, SessionLog, TrainingWorkLog } from "@/lib/types";

export default function CalendarPage() {
  const [today] = useState(localCalendarDate);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [sportLogs, setSportLogs] = useState<ExternalLoadLog[]>([]);
  const [trainingLogs, setTrainingLogs] = useState<TrainingWorkLog[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [kpiResults, setKpiResults] = useState<SyncedKPIResult[]>([]);
  const weeks = useMemo(() => orderCalendarWeeks(getV84CalendarWeeks(), today), [today]);

  useEffect(() => {
    let active = true;
    setTrainingLogs(loadTrainingWorkLogs());
    loadExternalLoadLogs().then((result) => { if (active) setSportLogs(result.logs); });
    loadStandaloneKpiResults().then((result) => { if (active) setKpiResults(result.results); });
    loadTrainingHistory().then((result) => { if (active) setSessionLogs(result.sessions); });
    return () => { active = false; };
  }, []);

  return <div>
    <header className="mb-5">
      <p className="label">12-week plan</p>
      <h1 className="text-4xl font-black">Calendar</h1>
      <p className="mt-2 text-slate-600">Find a date, review the essentials, and go straight to today&apos;s logging flow.</p>
    </header>
    <div className="space-y-6">
      {weeks.map((week, weekIndex) => <section data-calendar-week={week.weekNumber} id={`week-${week.weekNumber}`} key={week.weekNumber}>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-1 border-b border-rink pb-2">
          <h2 className="text-lg font-black">Week {week.weekNumber} · {conciseCalendarPhase(week.trainingPhase)}</h2>
          <p className="text-xs font-semibold text-slate-500">{weekRange(week.startDate, week.endDate)}</p>
        </div>
        {weekIndex === 0 && today >= week.startDate && today <= week.endDate && <p className="sr-only">Current week</p>}
        <div className="overflow-hidden rounded-2xl border border-rink bg-white">
          <div aria-hidden="true" className="hidden grid-cols-[8rem_minmax(0,2fr)_minmax(10rem,1.4fr)_5rem_8rem_5rem_4rem] gap-3 bg-ice px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-500 md:grid">
            <span>Day</span><span>Plan</span><span>Week / Phase</span><span>Load</span><span>Status</span><span>Action</span><span>Expand</span>
          </div>
          {week.dates.map((date) => {
            const day = projectCanonicalDay(date);
            const isToday = date === today;
            const training = day.activities.filter((activity) => activity.summaryVisible && !["sport_load_log", "kpi_log"].includes(activity.logType));
            const evidence = buildDayEvidenceProjection({
              date,
              weekNumber: week.weekNumber,
              sportLoadLogs: sportLogs,
              kpiResults,
              sessionAttempts: sessionLogs,
              trainingWorkLogs: trainingLogs,
              projection: "preview",
            });
            const calendarProjection = buildCalendarDayProjection(evidence);
            const sportForDate = day.sportLoads
              .map((load) => findCalendarSportLoadLog(load, sportLogs))
              .filter((log): log is ExternalLoadLog => log !== null);
            const expanded = expandedDate === date;
            return <article className={isToday ? "border-l-4 border-blue bg-cyan-50" : "border-l-4 border-transparent"} data-calendar-date={date} data-today={isToday ? "true" : undefined} key={date}>
              <div className="grid min-h-16 grid-cols-[4.25rem_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border-t border-rink px-2 py-2 first:border-t-0 md:min-h-0 md:grid-cols-[8rem_minmax(0,2fr)_minmax(10rem,1.4fr)_5rem_8rem_5rem_4rem] md:gap-3 md:px-3 md:py-3" data-calendar-row>
                <div className="row-span-2 self-center md:row-span-1">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 md:hidden">{formatPlanDate(date, { weekday: "short" })}</p>
                  <p className="text-sm font-black leading-tight md:text-base"><span className="md:hidden">{formatPlanDate(date, { month: "short", day: "numeric" })}</span><span className="hidden md:inline">{formatPlanDate(date, { weekday: "short", month: "short", day: "numeric" })}</span></p>
                  {isToday && <span className="mt-0.5 inline-flex rounded bg-blue px-1.5 py-px text-[9px] font-black leading-4 text-white">TODAY</span>}
                </div>
                <h3 className="col-span-2 min-w-0 truncate text-sm font-black leading-tight md:col-span-1 md:text-base">{day.title}</h3>
                <p className="hidden text-sm text-slate-600 md:block">{conciseCalendarPhase(day.phase)}</p>
                <p className="hidden text-sm font-bold md:block">{day.intensity}/5</p>
                <p className="min-w-0 truncate text-[11px] font-semibold text-slate-600 md:hidden" data-calendar-mobile-meta>Load {day.intensity}/5 · {calendarProjection.evidenceLabel}</p>
                <p className="hidden md:block"><span className="inline-flex rounded-full bg-ice px-2 py-1 text-xs font-black text-navy">{calendarProjection.evidenceLabel}</span></p>
                <div className="col-start-3 row-start-2 flex items-center justify-end gap-1 md:contents">
                  <Link aria-label={`${calendarProjection.primaryAction} training for ${formatPlanDate(date, { weekday: "long", month: "long", day: "numeric" })}`} className="whitespace-nowrap rounded-md px-1 py-2 text-xs font-black text-blue md:p-0 md:text-base" href={`/log/${date}`}>{calendarProjection.primaryAction} ›</Link>
                  <button aria-expanded={expanded} aria-label={`${expanded ? "Hide" : "Show"} details for ${formatPlanDate(date, { weekday: "long", month: "long", day: "numeric" })}`} className="min-h-9 min-w-9 rounded-lg border border-rink px-2 text-sm font-black hover:bg-ice md:min-h-0 md:min-w-0 md:justify-self-center md:py-1" onClick={() => setExpandedDate(expanded ? null : date)} type="button">{expanded ? "▴" : "▾"}<span className="sr-only">Details</span></button>
                </div>
              </div>
              {expanded && <CalendarDetails date={date} day={day} sportLogs={sportForDate} trainingTitles={training.map((activity) => activity.athleteTitle)} />}
            </article>;
          })}
        </div>
      </section>)}
    </div>
  </div>;
}

function CalendarDetails({ date, day, sportLogs, trainingTitles }: { date: string; day: ReturnType<typeof projectCanonicalDay>; sportLogs: ExternalLoadLog[]; trainingTitles: string[] }) {
  return <div className="border-t border-rink bg-slate-50 px-4 py-4 text-sm" data-calendar-details={date}>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Detail label="Methodology" value={day.phase} />
      {trainingTitles.length > 0 && <Detail label="Training" value={trainingTitles.join(" · ")} />}
      {day.kpi.isCheckpoint && <Detail label="Testing" value={`${day.kpi.kpiIds.length}-item KPI Test`} />}
      {day.sportLoads.map((load) => {
        const log = findCalendarSportLoadLog(load, sportLogs);
        return <div key={load.id}><p className="label">Sport Load</p><p className="font-black">{load.title}</p><p className="mt-1 text-slate-600">{load.notes}</p>{log && <p className={`mt-1 font-semibold ${log.attended ? "text-green-800" : "text-amber-800"}`}>{log.attended ? "Logged" : "Partially logged"} · {log.actualDuration ?? "—"} min · effort {log.effort ?? "—"}/5</p>}</div>;
      })}
      <Detail label="Recovery" value={day.presentation.recovery} />
      <Detail label="Parent cue" value={day.presentation.parentCue} />
      <Detail label="Load rule" value={day.presentation.loadRule} />
    </div>
  </div>;
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return <div><p className="label">{label}</p><p className="font-semibold text-slate-700">{value}</p></div>;
}

function weekRange(startDate: string, endDate: string) {
  const start = formatPlanDate(startDate, { month: "short", day: "numeric" });
  const end = formatPlanDate(endDate, { month: "short", day: "numeric" });
  return `${start}–${end}`;
}
