import fs from "node:fs";

const path = "docs/SCOPE.md";
let text = fs.readFileSync(path, "utf8");

function replaceOnce(oldText, newText, label) {
  const first = text.indexOf(oldText);
  if (first === -1) throw new Error(`missing ${label}`);
  if (text.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`duplicate ${label}`);
  text = text.slice(0, first) + newText + text.slice(first + oldText.length);
}

replaceOnce(
  "| 4.11 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | In progress | Safe lane / QA automation | Forward Day/Log, Calendar/mobile, video, and KPI contracts run in GitHub Actions; add explicit Today and Plan/Gantt smoke coverage before closing the task. |\n| 4.12 | DEF-QA-CODEX-RUNNER-001",
  "| 4.11 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | Completed | Safe lane / QA automation | Forward Day/Log, Calendar/mobile, video, KPI, Today redirect, and Plan/Gantt contracts now run in GitHub Actions; PR #6 final-head Playwright passed. |\n| 4.11.1 | DEF-PLAN-GANTT-14WEEK-SPAN-001 | Plan/Gantt retained legacy 12-week/84-day assumptions after approved Sep 18 extension | P1 | CI verified / Production pending | Fast lane | Final PR #6 head renders authoritative v8.4 W1-W14 / 96-day coverage through Sep 18; unit/typecheck/build/Playwright are green; merge and Production smoke remain. |\n| 4.12 | DEF-QA-CODEX-RUNNER-001",
  "queue Plan/Gantt + smoke status",
);

replaceOnce(
  "- Finish `QA-PLAYWRIGHT-SMOKE-001` by adding explicit Today and Plan/Gantt read-only browser coverage; the forward Day/Log, Calendar, video, and KPI contracts are already CI-owned.\n- Then prioritize `DEF-DAY-DURATION-CONTRACT-001` as the next athlete-facing P1: define authoritative duration scopes without forcing unlike totals to match or inventing a replacement total.",
  "- `QA-PLAYWRIGHT-SMOKE-001` is complete on PR #6 final head: Today redirect and Plan/Gantt read-only browser coverage are CI-owned and green.\n- Merge and Production-smoke `DEF-PLAN-GANTT-14WEEK-SPAN-001`; then prioritize `DEF-DAY-DURATION-CONTRACT-001` as the next athlete-facing P1: define authoritative duration scopes without forcing unlike totals to match or inventing a replacement total.",
  "current sprint sequencing",
);

replaceOnce(
  "| In progress | QA-SYSTEM-001, QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001, DEF-DAY-DURATION-CONTRACT-001, DEF-027 |",
  "| In progress | QA-SYSTEM-001, QA-AUTOMATION-OWNERSHIP-001, DEF-PLAN-GANTT-14WEEK-SPAN-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001, DEF-DAY-DURATION-CONTRACT-001, DEF-027 |",
  "P1 in-progress index",
);
replaceOnce(
  "| Completed | ENV-PREVIEW-DB-001, ENV-PREVIEW-DB-AUDIT-001, DEF-ENV-PREVIEW-SUPABASE-MAPPING-001, DEF-ENV-PREVIEW-STAGING-OVERRIDE-001, SPORT-LOAD-4V4-SUMMER-2026, PLAN-GANTT-SPORTLOAD-V84-001, CAL-UX-MOBILE-DAY-ROWS-001, PLAN-CONTENT-001, PLAN-TRYOUT-EXTENSION-2026-001, DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001, AUDIT-LOAD-CLASSIFICATION-001, DEF-029, DEF-030, DEF-031, DEF-032, CODE-COMMENT-AUDIT-001, FORENSIC-DAY-SESSION-MISMATCH-001, SURFACE-PRESENTATION-CONSUMER-AUDIT-001, ACTIVITY-PRESENTATION-CONTRACT-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, CONDITIONING-CARDIO-DURATION-001, QA-AUTOMATION-002, DEF-007, DEF-028 |",
  "| Completed | QA-PLAYWRIGHT-SMOKE-001, ENV-PREVIEW-DB-001, ENV-PREVIEW-DB-AUDIT-001, DEF-ENV-PREVIEW-SUPABASE-MAPPING-001, DEF-ENV-PREVIEW-STAGING-OVERRIDE-001, SPORT-LOAD-4V4-SUMMER-2026, PLAN-GANTT-SPORTLOAD-V84-001, CAL-UX-MOBILE-DAY-ROWS-001, PLAN-CONTENT-001, PLAN-TRYOUT-EXTENSION-2026-001, DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001, AUDIT-LOAD-CLASSIFICATION-001, DEF-029, DEF-030, DEF-031, DEF-032, CODE-COMMENT-AUDIT-001, FORENSIC-DAY-SESSION-MISMATCH-001, SURFACE-PRESENTATION-CONSUMER-AUDIT-001, ACTIVITY-PRESENTATION-CONTRACT-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, CONDITIONING-CARDIO-DURATION-001, QA-AUTOMATION-002, DEF-007, DEF-028 |",
  "P1 completed index",
);

replaceOnce(
  "### DEF-DAY-DURATION-CONTRACT-001",
  `### DEF-PLAN-GANTT-14WEEK-SPAN-001\n\n- ID: DEF-PLAN-GANTT-14WEEK-SPAN-001\n- Title: Plan/Gantt retained legacy 12-week/84-day assumptions after approved Sep 18 extension\n- Type: Defect\n- Parent: PLAN-CONTENT-001 / QA-PLAYWRIGHT-SMOKE-001\n- Priority: P1\n- Status: CI verified / Production pending\n- Lane: Fast lane\n- Owner: Mike / Codex\n- Source: Product-truth discovery while adding explicit Plan browser smoke on 2026-08-21.\n- Problem: v8.4 defines W1-W14 and 96 plan dates through 2026-09-18, while the Plan page still labeled itself 12 weeks, used an 84-day Gantt grid, scoped Taper + Peak to W12 only, and sourced overview/week-card coverage from legacy data ending 2026-09-06.\n- Desired outcome: /plan visibly represents the authoritative 14-week / 96-day performance period through Sep 18 without rewriting v8.4 or inventing W13/W14 legacy metrics.\n- In scope: derive Plan heading/date range and Gantt geometry from v8.4 phase dates; span Taper + Peak through W14; surface source-backed W13/W14 phase notes and Sport Loads; explicitly label the legacy Weekly Load chart W1-W12; add Today + Plan Playwright smoke.\n- Out of scope: edits to imports/v8.4/data/*.json, invented W13/W14 planned-load scores or coaching copy, Day/Calendar/KPI behavior, Supabase writes/config.\n- Acceptance evidence: PR #6 final head f86611f; exact net product diff app/plan/page.tsx, components/WeeklyLoadChart.tsx, e2e/forward-product-quality.spec.ts; unit/projection tests passed; TypeScript passed; clean production build passed; full forward Playwright passed; exact-head Vercel Preview READY.\n- Remaining gate: merge PR #6 and verify resulting Production deployment before marking Completed.\n- Dependencies: v8.4 phaseLabels, ganttModel, Sport Loads; existing legacy W1-W12 descriptive plan copy.\n- Risks: duplicating or inventing late-period plan values would violate v8.4 source authority.\n- Next action: merge after this scope update, then Production-smoke /plan and verify release SHA.\n\n### DEF-DAY-DURATION-CONTRACT-001`,
  "detailed Plan/Gantt defect record",
);

fs.writeFileSync(path, text);
console.log("SCOPE_PLAN_GANTT_CI_VERIFIED_OK");
