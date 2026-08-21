import fs from "node:fs";

function patchFile(path, transforms) {
  let text = fs.readFileSync(path, "utf8");
  const replaceOnce = (oldText, newText, label) => {
    const first = text.indexOf(oldText);
    if (first === -1) throw new Error(`${path}: missing ${label}`);
    const second = text.indexOf(oldText, first + oldText.length);
    if (second !== -1) throw new Error(`${path}: duplicate ${label}`);
    text = text.slice(0, first) + newText + text.slice(first + oldText.length);
  };
  transforms(replaceOnce, () => text, (value) => { text = value; });
  fs.writeFileSync(path, text);
}

patchFile("app/plan/page.tsx", (replaceOnce) => {
  replaceOnce(
    "  getPlanSportLoadOverlayItemsForWeek,\n  getSpanGridColumns,\n  getTimelineDays,",
    "  getPlanSportLoadOverlayItemsForWeek,\n  getDayColumnIndex,\n  getSpanGridColumns,\n  getTimelineDays,",
    "getDayColumnIndex import",
  );

  replaceOnce(
    "  const { overview, weeks, version, sourceTag } = trainingPlan;\n\n  return (",
    "  const { overview, weeks, version, sourceTag } = trainingPlan;\n  const canonicalStartDate = phaseLabels[0]?.start ?? overview.startDate;\n  const canonicalEndDate = phaseLabels[phaseLabels.length - 1]?.end ?? overview.endDate;\n  const canonicalWeekCount = phaseLabels.length;\n  const extensionWeeks = phaseLabels.filter((phaseWeek) => !weeks.some((week) => week.weekNumber === phaseWeek.week));\n\n  return (",
    "canonical Plan metadata",
  );

  replaceOnce(
    "        <p className=\"label\">12-week offseason plan</p>",
    "        <p className=\"label\">{canonicalWeekCount}-week performance plan</p>",
    "Plan label",
  );
  replaceOnce(
    "        <p className=\"mt-2 text-slate-600\">{formatPlanDate(overview.startDate)} to {formatPlanDate(overview.endDate)}</p>",
    "        <p className=\"mt-2 text-slate-600\">{formatPlanDate(canonicalStartDate)} to {formatPlanDate(canonicalEndDate)}</p>",
    "Plan date range",
  );
  replaceOnce(
    "      <MethodologyPanel />",
    "      <MethodologyPanel weekCount={canonicalWeekCount} />",
    "MethodologyPanel call",
  );

  replaceOnce(
    "          );\n        })}\n      </section>",
    `          );\n        })}\n        {extensionWeeks.map((phaseWeek) => {\n          const loads = getPlanSportLoadOverlayItemsForWeek(phaseWeek.week);\n          return (\n            <article className=\"card\" key={phaseWeek.week}>\n              <div className=\"flex items-start justify-between gap-3\">\n                <div>\n                  <p className=\"label\">Week {phaseWeek.week} · {formatPlanDate(phaseWeek.start, { month: \"short\", day: \"numeric\" })}-{formatPlanDate(phaseWeek.end, { month: \"short\", day: \"numeric\" })}</p>\n                  <h2 className=\"text-xl font-black\">{phaseWeek.appLabel}</h2>\n                  <div className=\"mt-2 flex flex-wrap gap-2\"><PhaseChip phase={phaseWeek.appLabel} /></div>\n                </div>\n                <Link className=\"text-sm font-bold text-blue\" href={\\`/calendar#week-\${phaseWeek.week}\\`}>Days</Link>\n              </div>\n              <p className=\"mt-3 font-semibold\">{phaseWeek.notes}</p>\n              {loads.length > 0 && (\n                <div className=\"mt-4\">\n                  <p className=\"label\">Sport load summary</p>\n                  <div className=\"grid gap-2\">\n                    {loads.map((load) => (\n                      <Link className=\"rounded-xl bg-ice p-3 text-sm font-semibold text-slate-700 hover:text-blue\" href={\\`/day/\${load.date}\\`} key={\\`\${load.date}-\${load.title}\\`}>\n                        <span className=\"font-black text-navy\">{formatPlanDate(load.date, { month: \"short\", day: \"numeric\" })} · {load.title}</span>\n                        <span className=\"mt-1 block\">{load.details}</span>\n                      </Link>\n                    ))}\n                  </div>\n                </div>\n              )}\n            </article>\n          );\n        })}\n      </section>`,
    "canonical W13-W14 cards",
  );

  replaceOnce(
    "function MethodologyPanel() {",
    "function MethodologyPanel({ weekCount }: { weekCount: number }) {",
    "MethodologyPanel signature",
  );
  replaceOnce(
    "      <h2 className=\"text-2xl font-black\">12-Week Methodology</h2>",
    "      <h2 className=\"text-2xl font-black\">{weekCount}-Week Methodology</h2>",
    "Methodology heading",
  );

  replaceOnce(
    "const TIMELINE_DAY_COUNT = 84;",
    "const TIMELINE_DAY_COUNT = getTimelineDays().length;",
    "timeline day count",
  );

  replaceOnce(
    `            {ganttModel.weeks.map((week, index) => {\n              const weekNumber = Number(week.slice(1));\n              const weekLabel = weekLabels.get(weekNumber) || week;\n              const phaseName = phaseNames.get(weekNumber);\n              const startColumn = index * 7 + 2;\n              return (\n                <Link\n                  key={week}\n                  className=\"border border-slate-200 bg-ice py-1 text-center text-blue\"\n                  href={\\`/calendar#week-\${weekNumber}\\`}\n                  style={{ gridColumn: \\`\${startColumn} / span 7\\` }}\n                  title={phaseName ? \\`\${phaseName} · \${weekLabel}\\` : weekLabel}\n                >\n                  {week} · {formatShortDate(phaseLabels[index]?.start ?? timelineDays[index * 7]?.date ?? trainingPlan.overview.startDate)}\n                </Link>\n              );\n            })}`,
    `            {ganttModel.weeks.map((week, index) => {\n              const weekNumber = Number(week.slice(1));\n              const weekLabel = weekLabels.get(weekNumber) || week;\n              const phaseName = phaseNames.get(weekNumber);\n              const phaseWeek = phaseLabels[index];\n              if (!phaseWeek) return null;\n              const columns = getSpanGridColumns(phaseWeek.start, phaseWeek.end);\n              const startColumn = columns.startColumn + 1;\n              const dayCount = columns.endColumn - columns.startColumn;\n              return (\n                <Link\n                  key={week}\n                  className=\"border border-slate-200 bg-ice py-1 text-center text-blue\"\n                  href={\\`/calendar#week-\${weekNumber}\\`}\n                  style={{ gridColumn: \\`\${startColumn} / span \${dayCount}\\` }}\n                  title={phaseName ? \\`\${phaseName} · \${weekLabel}\\` : weekLabel}\n                >\n                  {week} · {formatShortDate(phaseWeek.start)}\n                </Link>\n              );\n            })}`,
    "Gantt canonical week spans",
  );

  replaceOnce(
    `            {Array.from({ length: 13 }, (_, index) => (\n              <div\n                aria-hidden=\"true\"\n                className=\"pointer-events-none absolute bottom-0 top-0 z-30 w-px bg-slate-300\"\n                key={index}\n                style={{ left: \\`calc(\${GANTT_LABEL_COLUMN_WIDTH} + (\${index * 7} * \${GANTT_DAY_COLUMN_WIDTH}))\\` }}\n              />\n            ))}`,
    `            {[...phaseLabels.map((week) => getDayColumnIndex(week.start)), TIMELINE_DAY_COUNT].map((dayOffset, index) => (\n              <div\n                aria-hidden=\"true\"\n                className=\"pointer-events-none absolute bottom-0 top-0 z-30 w-px bg-slate-300\"\n                key={\\`\${dayOffset}-\${index}\\`}\n                style={{ left: \\`calc(\${GANTT_LABEL_COLUMN_WIDTH} + (\${dayOffset} * \${GANTT_DAY_COLUMN_WIDTH}))\\` }}\n              />\n            ))}`,
    "Gantt week boundaries",
  );

  replaceOnce(
    `    phaseSpan("Taper + Peak", "Taper", 12, 12, "taper"),`,
    `    phaseSpan("Taper + Peak", "Taper + Peak", 12, 14, "taper"),`,
    "Taper W12-W14 span",
  );

  replaceOnce(
    `      <div className=\"flex h-6 items-center px-2 text-[9px] font-semibold normal-case tracking-normal opacity-80\" style={{ gridColumn: "2 / span 84" }}>{section.detail}</div>`,
    `      <div className=\"flex h-6 items-center px-2 text-[9px] font-semibold normal-case tracking-normal opacity-80\" style={{ gridColumn: \\`2 / span \${TIMELINE_DAY_COUNT}\\` }}>{section.detail}</div>`,
    "Gantt section span",
  );
  replaceOnce(
    `      <div className=\"relative grid h-[22px] grid-cols-subgrid\" style={{ gridColumn: "2 / span 84" }}>\n        {Array.from({ length: 84 }, (_, index) => (`,
    `      <div className=\"relative grid h-[22px] grid-cols-subgrid\" style={{ gridColumn: \\`2 / span \${TIMELINE_DAY_COUNT}\\` }}>\n        {Array.from({ length: TIMELINE_DAY_COUNT }, (_, index) => (`,
    "Gantt row span and cells",
  );
});

patchFile("components/WeeklyLoadChart.tsx", (replaceOnce) => {
  replaceOnce(
    "      <h2 className=\"text-2xl font-black\">Weekly Load</h2>\n      <p className=\"mt-2 text-sm text-slate-600\">Planned load reflects the full plan, including dryland, hockey, lacrosse, camps, recovery, and taper.</p>",
    "      <h2 className=\"text-2xl font-black\">Weekly Load · W1-W12</h2>\n      <p className=\"mt-2 text-sm text-slate-600\">This comparison retains the original W1-W12 planned-load model. W13-W14 Pathway and tryout loads are shown in the canonical Gantt and week cards without inventing legacy load scores.</p>",
    "Weekly Load scope copy",
  );
});

patchFile("e2e/forward-product-quality.spec.ts", (replaceOnce) => {
  replaceOnce(
    "function enumerateDates(start: string, end: string) {",
    `test("Today redirects to the canonical dated Day route", async ({ page }) => {\n  await page.goto("/today");\n  await expect(page).toHaveURL(/\\/day\\/\\d{4}-\\d{2}-\\d{2}$/);\n});\n\ntest("Plan renders the canonical 14-week performance period through Sep 18", async ({ page }) => {\n  await page.goto("/plan");\n  await expect(page.getByText("14-week performance plan", { exact: true })).toBeVisible();\n  await expect(page.getByRole("heading", { name: "14-Week Methodology", exact: true })).toBeVisible();\n  await expect(page.getByRole("link", { name: /^W13 ·/ })).toBeVisible();\n  await expect(page.getByRole("link", { name: /^W14 ·/ })).toBeVisible();\n  await expect(page.getByText(/Week 13 · Sep 7-Sep 13/)).toBeVisible();\n  await expect(page.getByText(/Week 14 · Sep 14-Sep 18/)).toBeVisible();\n  await expect(page.getByText("Weekly Load · W1-W12", { exact: true })).toBeVisible();\n  await expect(page.locator("body")).not.toContainText("12-week offseason plan");\n});\n\nfunction enumerateDates(start: string, end: string) {`,
    "Today and Plan browser smoke",
  );
});

patchFile("docs/SCOPE.md", (replaceOnce) => {
  replaceOnce(
    "| 4.11 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | In progress | Safe lane / QA automation | Forward Day/Log, Calendar/mobile, video, and KPI contracts run in GitHub Actions; add explicit Today and Plan/Gantt smoke coverage before closing the task. |\n| 4.12 | DEF-QA-CODEX-RUNNER-001",
    "| 4.11 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | In progress | Safe lane / QA automation | Forward Day/Log, Calendar/mobile, video, and KPI contracts run in GitHub Actions; add explicit Today and Plan/Gantt smoke coverage before closing the task. |\n| 4.11.1 | DEF-PLAN-GANTT-14WEEK-SPAN-001 | Plan/Gantt still renders legacy 12-week/84-day assumptions after approved Sep 18 extension | P1 | In progress | Fast lane | Derive authoritative 96-day/W1-W14 coverage from v8.4, preserve legacy W1-W12 descriptive/load data only where it exists, and add Plan browser regression without inventing W13/W14 legacy values. |\n| 4.12 | DEF-QA-CODEX-RUNNER-001",
    "Plan/Gantt defect queue row",
  );

  replaceOnce(
    "- Finish `QA-PLAYWRIGHT-SMOKE-001` by adding explicit Today and Plan/Gantt read-only browser coverage; the forward Day/Log, Calendar, video, and KPI contracts are already CI-owned.\n- Then prioritize `DEF-DAY-DURATION-CONTRACT-001`",
    "- Finish `QA-PLAYWRIGHT-SMOKE-001` by adding explicit Today and Plan/Gantt read-only browser coverage; while doing so, fix `DEF-PLAN-GANTT-14WEEK-SPAN-001`, because the renderer still contains legacy 12-week/84-day assumptions while v8.4 covers 96 days through Sep 18.\n- Then prioritize `DEF-DAY-DURATION-CONTRACT-001`",
    "Current Sprint Plan defect sequencing",
  );

  replaceOnce(
    "| In progress | QA-SYSTEM-001, QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001,",
    "| In progress | QA-SYSTEM-001, QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-PLAN-GANTT-14WEEK-SPAN-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001,",
    "P1 status index",
  );

  replaceOnce(
    "### DEF-DAY-DURATION-CONTRACT-001",
    `### DEF-PLAN-GANTT-14WEEK-SPAN-001\n\n- ID: DEF-PLAN-GANTT-14WEEK-SPAN-001\n- Title: Plan/Gantt still renders legacy 12-week/84-day assumptions after approved Sep 18 extension\n- Type: Defect\n- Parent: PLAN-CONTENT-001 / QA-PLAYWRIGHT-SMOKE-001\n- Priority: P1\n- Status: In progress\n- Lane: Fast lane\n- Owner: Mike / Codex\n- Source: Product-truth discovery while adding explicit Plan browser smoke on 2026-08-21.\n- Problem: v8.4 defines W1-W14 and 96 plan dates through 2026-09-18, but the Plan page still labels itself 12 weeks, uses an 84-day Gantt grid, scopes the taper bar to W12 only, and sources its overview/week-card coverage from legacy data that ends 2026-09-06.\n- Desired outcome: `/plan` visibly represents the authoritative 14-week / 96-day performance period through Sep 18 without rewriting v8.4 or inventing W13/W14 legacy plan metrics.\n- In scope: derive Plan heading/date range and Gantt geometry from v8.4 phase dates; span Taper + Peak through W14; surface source-backed W13/W14 phase notes and Sport Loads; explicitly label the legacy Weekly Load chart W1-W12; add Today + Plan Playwright smoke.\n- Out of scope: editing `imports/v8.4/data/*.json`, inventing W13/W14 planned-load scores or coaching copy, changing Day/Calendar/KPI behavior, or Supabase writes.\n- Acceptance criteria: `/plan` says 14-week performance plan and ends Sep 18; Gantt has 96 daily columns with W13/W14 and a W12-W14 taper; W13/W14 cards use v8.4 labels/notes/Sport Loads; legacy Weekly Load scope is explicit; Today redirects to a dated Day route; CI/Playwright pass.\n- Dependencies: v8.4 `phaseLabels`, `ganttModel`, Sport Loads; existing legacy W1-W12 descriptive plan copy.\n- Risks: duplicating or inventing late-period plan values would violate v8.4 source authority.\n- Next action: implement and validate on this bounded branch, then Production-smoke before closing.\n- Links / evidence: \`app/plan/page.tsx\`; \`data/plan.json\`; \`imports/v8.4/data/phaseLabels.json\`; \`imports/v8.4/data/ganttModel.json\`; \`e2e/forward-product-quality.spec.ts\`.\n\n### DEF-DAY-DURATION-CONTRACT-001`,
    "detailed Plan/Gantt defect record",
  );
});

console.log("PLAN_GANTT_14WEEK_PATCH_OK");
