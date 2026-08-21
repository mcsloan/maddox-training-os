import fs from "node:fs";

const lines = (...items) => items.join("\n");

function replaceOnce(path, oldText, newText, label) {
  let text = fs.readFileSync(path, "utf8");
  const first = text.indexOf(oldText);
  if (first === -1) throw new Error(`${path}: missing ${label}`);
  const second = text.indexOf(oldText, first + oldText.length);
  if (second !== -1) throw new Error(`${path}: duplicate ${label}`);
  text = text.slice(0, first) + newText + text.slice(first + oldText.length);
  fs.writeFileSync(path, text);
}

const plan = "app/plan/page.tsx";

replaceOnce(
  plan,
  lines(
    "  getPlanSportLoadOverlayItemsForWeek,",
    "  getSpanGridColumns,",
    "  getTimelineDays,"
  ),
  lines(
    "  getPlanSportLoadOverlayItemsForWeek,",
    "  getDayColumnIndex,",
    "  getSpanGridColumns,",
    "  getTimelineDays,"
  ),
  "getDayColumnIndex import",
);

replaceOnce(
  plan,
  lines(
    "  const { overview, weeks, version, sourceTag } = trainingPlan;",
    "",
    "  return ("
  ),
  lines(
    "  const { overview, weeks, version, sourceTag } = trainingPlan;",
    "  const canonicalStartDate = phaseLabels[0]?.start ?? overview.startDate;",
    "  const canonicalEndDate = phaseLabels[phaseLabels.length - 1]?.end ?? overview.endDate;",
    "  const canonicalWeekCount = phaseLabels.length;",
    "  const extensionWeeks = phaseLabels.filter((phaseWeek) => !weeks.some((week) => week.weekNumber === phaseWeek.week));",
    "",
    "  return ("
  ),
  "canonical Plan metadata",
);

replaceOnce(plan, '        <p className="label">12-week offseason plan</p>', '        <p className="label">{canonicalWeekCount}-week performance plan</p>', "Plan label");
replaceOnce(plan, '        <p className="mt-2 text-slate-600">{formatPlanDate(overview.startDate)} to {formatPlanDate(overview.endDate)}</p>', '        <p className="mt-2 text-slate-600">{formatPlanDate(canonicalStartDate)} to {formatPlanDate(canonicalEndDate)}</p>', "Plan date range");
replaceOnce(plan, "      <MethodologyPanel />", "      <MethodologyPanel weekCount={canonicalWeekCount} />", "MethodologyPanel call");

replaceOnce(
  plan,
  lines(
    "          );",
    "        })}",
    "      </section>",
    '      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>'
  ),
  lines(
    "          );",
    "        })}",
    "        {extensionWeeks.map((phaseWeek) => {",
    "          const loads = getPlanSportLoadOverlayItemsForWeek(phaseWeek.week);",
    "          return (",
    '            <article className="card" key={phaseWeek.week}>',
    '              <div className="flex items-start justify-between gap-3">',
    "                <div>",
    '                  <p className="label">Week {phaseWeek.week} · {formatPlanDate(phaseWeek.start, { month: "short", day: "numeric" })}-{formatPlanDate(phaseWeek.end, { month: "short", day: "numeric" })}</p>',
    '                  <h2 className="text-xl font-black">{phaseWeek.appLabel}</h2>',
    '                  <div className="mt-2 flex flex-wrap gap-2"><PhaseChip phase={phaseWeek.appLabel} /></div>',
    "                </div>",
    '                <Link className="text-sm font-bold text-blue" href={`/calendar#week-${phaseWeek.week}`}>Days</Link>',
    "              </div>",
    '              <p className="mt-3 font-semibold">{phaseWeek.notes}</p>',
    "              {loads.length > 0 && (",
    '                <div className="mt-4">',
    '                  <p className="label">Sport load summary</p>',
    '                  <div className="grid gap-2">',
    "                    {loads.map((load) => (",
    '                      <Link className="rounded-xl bg-ice p-3 text-sm font-semibold text-slate-700 hover:text-blue" href={`/day/${load.date}`} key={`${load.date}-${load.title}`}>',
    '                        <span className="font-black text-navy">{formatPlanDate(load.date, { month: "short", day: "numeric" })} · {load.title}</span>',
    '                        <span className="mt-1 block">{load.details}</span>',
    "                      </Link>",
    "                    ))}",
    "                  </div>",
    "                </div>",
    "              )}",
    "            </article>",
    "          );",
    "        })}",
    "      </section>",
    '      <p className="mt-6 text-xs text-slate-500">Plan seed {version}. {sourceTag}.</p>'
  ),
  "canonical W13-W14 cards",
);

replaceOnce(plan, "function MethodologyPanel() {", "function MethodologyPanel({ weekCount }: { weekCount: number }) {", "MethodologyPanel signature");
replaceOnce(plan, '      <h2 className="text-2xl font-black">12-Week Methodology</h2>', '      <h2 className="text-2xl font-black">{weekCount}-Week Methodology</h2>', "Methodology heading");
replaceOnce(plan, "const TIMELINE_DAY_COUNT = 84;", "const TIMELINE_DAY_COUNT = getTimelineDays().length;", "timeline day count");

replaceOnce(
  plan,
  "              const startColumn = index * 7 + 2;",
  lines(
    "              const phaseWeek = phaseLabels[index];",
    "              if (!phaseWeek) return null;",
    "              const columns = getSpanGridColumns(phaseWeek.start, phaseWeek.end);",
    "              const startColumn = columns.startColumn + 1;",
    "              const dayCount = columns.endColumn - columns.startColumn;"
  ),
  "canonical week column calculation",
);
replaceOnce(plan, '                  style={{ gridColumn: `${startColumn} / span 7` }}', '                  style={{ gridColumn: `${startColumn} / span ${dayCount}` }}', "canonical week header span");
replaceOnce(plan, "                  {week} · {formatShortDate(phaseLabels[index]?.start ?? timelineDays[index * 7]?.date ?? trainingPlan.overview.startDate)}", "                  {week} · {formatShortDate(phaseWeek.start)}", "canonical week header date");

replaceOnce(
  plan,
  lines(
    "            {Array.from({ length: 13 }, (_, index) => (",
    "              <div",
    '                aria-hidden="true"',
    '                className="pointer-events-none absolute bottom-0 top-0 z-30 w-px bg-slate-300"',
    "                key={index}",
    '                style={{ left: `calc(${GANTT_LABEL_COLUMN_WIDTH} + (${index * 7} * ${GANTT_DAY_COLUMN_WIDTH}))` }}',
    "              />",
    "            ))}"
  ),
  lines(
    "            {[...phaseLabels.map((week) => getDayColumnIndex(week.start)), TIMELINE_DAY_COUNT].map((dayOffset, index) => (",
    "              <div",
    '                aria-hidden="true"',
    '                className="pointer-events-none absolute bottom-0 top-0 z-30 w-px bg-slate-300"',
    '                key={`${dayOffset}-${index}`}',
    '                style={{ left: `calc(${GANTT_LABEL_COLUMN_WIDTH} + (${dayOffset} * ${GANTT_DAY_COLUMN_WIDTH}))` }}',
    "              />",
    "            ))}"
  ),
  "canonical week boundaries",
);

replaceOnce(plan, '    phaseSpan("Taper + Peak", "Taper", 12, 12, "taper"),', '    phaseSpan("Taper + Peak", "Taper + Peak", 12, 14, "taper"),', "Taper W12-W14 span");
replaceOnce(plan, '      <div className="flex h-6 items-center px-2 text-[9px] font-semibold normal-case tracking-normal opacity-80" style={{ gridColumn: "2 / span 84" }}>{section.detail}</div>', '      <div className="flex h-6 items-center px-2 text-[9px] font-semibold normal-case tracking-normal opacity-80" style={{ gridColumn: `2 / span ${TIMELINE_DAY_COUNT}` }}>{section.detail}</div>', "Gantt section span");
replaceOnce(
  plan,
  lines(
    '      <div className="relative grid h-[22px] grid-cols-subgrid" style={{ gridColumn: "2 / span 84" }}>',
    "        {Array.from({ length: 84 }, (_, index) => ("
  ),
  lines(
    '      <div className="relative grid h-[22px] grid-cols-subgrid" style={{ gridColumn: `2 / span ${TIMELINE_DAY_COUNT}` }}>',
    "        {Array.from({ length: TIMELINE_DAY_COUNT }, (_, index) => ("
  ),
  "Gantt row span and cells",
);

const weekly = "components/WeeklyLoadChart.tsx";
replaceOnce(
  weekly,
  lines(
    '      <h2 className="text-2xl font-black">Weekly Load</h2>',
    '      <p className="mt-2 text-sm text-slate-600">Planned load reflects the full plan, including dryland, hockey, lacrosse, camps, recovery, and taper.</p>'
  ),
  lines(
    '      <h2 className="text-2xl font-black">Weekly Load · W1-W12</h2>',
    '      <p className="mt-2 text-sm text-slate-600">This comparison retains the original W1-W12 planned-load model. W13-W14 Pathway and tryout loads are shown in the canonical Gantt and week cards without inventing legacy load scores.</p>'
  ),
  "Weekly Load scope copy",
);

const e2e = "e2e/forward-product-quality.spec.ts";
replaceOnce(
  e2e,
  "function enumerateDates(start: string, end: string) {",
  lines(
    'test("Today redirects to the canonical dated Day route", async ({ page }) => {',
    '  await page.goto("/today");',
    '  await expect(page).toHaveURL(/\\/day\\/\\d{4}-\\d{2}-\\d{2}$/);',
    "});",
    "",
    'test("Plan renders the canonical 14-week performance period through Sep 18", async ({ page }) => {',
    '  await page.goto("/plan");',
    '  await expect(page.getByText("14-week performance plan", { exact: true })).toBeVisible();',
    '  await expect(page.getByRole("heading", { name: "14-Week Methodology", exact: true })).toBeVisible();',
    '  await expect(page.getByRole("link", { name: /^W13 ·/ })).toBeVisible();',
    '  await expect(page.getByRole("link", { name: /^W14 ·/ })).toBeVisible();',
    '  await expect(page.getByText(/Week 13 · Sep 7-Sep 13/)).toBeVisible();',
    '  await expect(page.getByText(/Week 14 · Sep 14-Sep 18/)).toBeVisible();',
    '  await expect(page.getByText("Weekly Load · W1-W12", { exact: true })).toBeVisible();',
    '  await expect(page.locator("body")).not.toContainText("12-week offseason plan");',
    "});",
    "",
    "function enumerateDates(start: string, end: string) {"
  ),
  "Today and Plan browser smoke",
);

console.log("PLAN_GANTT_14WEEK_PATCH_OK");
