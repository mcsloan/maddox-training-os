import fs from "node:fs";

const path = "docs/SCOPE.md";
let text = fs.readFileSync(path, "utf8");

function replaceOnce(oldText, newText, label) {
  const first = text.indexOf(oldText);
  if (first === -1) throw new Error(`Missing expected text: ${label}`);
  const second = text.indexOf(oldText, first + oldText.length);
  if (second !== -1) throw new Error(`Expected unique text for ${label}, found duplicate`);
  text = text.slice(0, first) + newText + text.slice(first + oldText.length);
}

function setDetailedStatus(id, status) {
  const header = `### ${id}`;
  const start = text.indexOf(header);
  if (start === -1) throw new Error(`Missing detailed record ${id}`);
  const nextH3 = text.indexOf("\n### ", start + header.length);
  const nextH2 = text.indexOf("\n## ", start + header.length);
  let end = text.length;
  if (nextH3 !== -1) end = Math.min(end, nextH3);
  if (nextH2 !== -1) end = Math.min(end, nextH2);
  const section = text.slice(start, end);
  const matches = [...section.matchAll(/^- Status: .*$/gm)];
  if (matches.length !== 1) throw new Error(`Expected one status in ${id}, found ${matches.length}`);
  const oldLine = matches[0][0];
  const updated = section.replace(oldLine, `- Status: ${status}`);
  text = text.slice(0, start) + updated + text.slice(end);
}

for (const [id, status] of [
  ["CAL-UX-MOBILE-DAY-ROWS-001", "Completed"],
  ["PLAN-CONTENT-001", "Completed"],
  ["PLAN-TRYOUT-EXTENSION-2026-001", "Completed"],
  ["DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001", "Completed"],
  ["AUDIT-LOAD-CLASSIFICATION-001", "Completed"],
  ["DEF-ENV-PREVIEW-SUPABASE-MAPPING-001", "Completed"],
  ["DEF-ENV-PREVIEW-STAGING-OVERRIDE-001", "Completed"],
  ["QA-AUTOMATION-OWNERSHIP-001", "In progress"],
  ["QA-PLAYWRIGHT-SMOKE-001", "In progress"],
  ["DEF-QA-CODEX-RUNNER-001", "In progress"],
  ["CODE-COMMENT-AUDIT-001", "Completed"],
  ["DAY-SESSION-PARITY-001", "Completed"],
  ["KPI-ROADMAP-001", "In progress"],
  ["DEF-REACT-DUPLICATE-KEY-EASY-SPIN-001", "Completed"],
  ["SPORT-LOAD-4V4-SUMMER-2026", "Completed"],
]) setDetailedStatus(id, status);

replaceOnce(
  "| DEC-CALENDAR-002 | Calendar is a compact current-week-first index with collapsed rows, inline detail expansion, and one direct `/log/<date>` action; `/day/<date>` remains compatible. Calendar loads Training Work, completed-session, Sport Load, and KPI evidence into `buildDayEvidenceProjection()` and derives status/action only from `buildCalendarDayProjection()` without merging persistence streams. | Completed locally | Parent Calendar V2 decision; `DEF-027` Calendar slice |",
  "| DEC-CALENDAR-002 | Calendar is a compact current-week-first index with collapsed rows, inline detail expansion, and one direct `/log/<date>` action; `/day/<date>` remains compatible. Calendar loads Training Work, completed-session, Sport Load, and KPI evidence into `buildDayEvidenceProjection()` and derives status/action only from `buildCalendarDayProjection()` without merging persistence streams. | Completed | Parent Calendar V2 decision; Production + Playwright-verified mobile/desktop Calendar |",
  "calendar decision",
);
replaceOnce(
  "| DEC-KPI-003 | There is one 14-item KPI Test; Aug 20, 2026 is the canonical next test date for every active KPI until completed. | Completed locally | Parent product decision; `lib/kpiSchedule.ts` |",
  "| DEC-KPI-003 | There is one 14-item KPI Test; Aug 20, 2026 is the canonical scheduled test date for every active KPI in the 2026 plan. | Completed | Parent product decision; `lib/kpiSchedule.ts`; deterministic 14-item route/CI coverage |",
  "kpi decision",
);

replaceOnce(
  "| 3 | ENV-PREVIEW-DB-001 | Vercel Preview Supabase environment is unverified / may be sharing production-like KPI data | P1 | Completed | Docs-only / environment-safety | Confirmed by Mike dashboard check: Preview currently points to production Supabase; active follow-up is `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001`. |",
  "| 3 | ENV-PREVIEW-DB-001 | Vercel Preview Supabase environment is unverified / may be sharing production-like KPI data | P1 | Completed | Docs-only / environment-safety | Historical risk resolved: Vercel variables were split by environment and a fresh 2026-08-21 Preview build proved staging runtime mapping. |",
  "queue historical env db",
);
replaceOnce(
  "| 4 | ENV-PREVIEW-DB-AUDIT-001 | Verify Vercel Preview Supabase target | P1 | Completed | Docs-only / environment-safety | Vercel mapping is confirmed; active follow-up is `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001`. |",
  "| 4 | ENV-PREVIEW-DB-AUDIT-001 | Verify Vercel Preview Supabase target | P1 | Completed | Docs-only / environment-safety | Final mapping: Production -> `mbjcedhysniabbaigsko`; Preview/Development -> `npuankmkxbjtlokbpczz`; fresh Preview proof passed. |",
  "queue env db audit",
);

replaceOnce(
  "- Next action: Mike reviews the work-branch Vercel Preview before separately authorizing any merge/release.\n- Links / evidence: Parent-approved overnight work order; `app/calendar/page.tsx`; `e2e/calendar-compact.spec.ts`; 390x844 browser measurement showed seven 73.5–74px current-week rows in a 515px region, six fully visible before the fixed navigation, zero horizontal overflow, and Today height parity; focused Calendar Playwright 4/4 and forward QA 7/7 passed.",
  "- Next action: Maintain as regression coverage; no further mobile Calendar work is required unless new product QA finds a defect.\n- Links / evidence: Parent-approved overnight work order; Production acceptance; `app/calendar/page.tsx`; `e2e/calendar-compact.spec.ts`; GitHub Actions Playwright gate; 390x844 browser measurement showed seven compact current-week rows with zero horizontal overflow and Today height parity.",
  "mobile detailed next action",
);

replaceOnce(
  "- Next action: complete automated integrity checks and parent visual acceptance before commit.\n- Links / evidence: v8.4 dayExecutionPlan/session data.",
  "- Next action: Maintain the released forward-plan integrity tests; future schedule changes require a new parent-approved source update.\n- Links / evidence: v8.4 dayExecutionPlan/session data; Production release chain through `38a2751`.",
  "plan content next action",
);
replaceOnce(
  "- Next action: inspect and implement the bounded source/projection extension, run required checks, then hold for Mike's source-diff and product review.\n- Links / evidence: `imports/v8.4/data/`, `lib/imports/v8_4/`, `lib/projections/forwardPlanIntegrity.ts`.",
  "- Next action: Maintain the Sep 18 forward integrity/browser coverage; any new tryout/schedule changes require a separately approved source update.\n- Links / evidence: `imports/v8.4/data/`, `lib/imports/v8_4/`, `lib/projections/forwardPlanIntegrity.ts`, Production Calendar through Sep 18.",
  "tryout extension next action",
);

replaceOnce(
  "- In scope: capture only in this work order; later source review of environment requirements and approved regressions.\n- Out of scope: changing the Aug 19 plan or fixing the drill presentation during `PLAN-TRYOUT-EXTENSION-2026-001`.\n- Acceptance criteria: defect remains visible as open P1 product-trust source review and no Aug 19 source content changes in the schedule reconciliation.\n- Dependencies: parent/coach-approved drill library guidance.\n- Risks: an invented regression would violate source authority and could misrepresent safe execution.\n- Next action: schedule separate source review after the tryout extension is accepted.\n- Links / evidence: canonical Day for 2026-08-19.",
  "- In scope: source-backed presentation of existing equipment/space and setup requirements; no invented substitute drill.\n- Out of scope: changing the Aug 19 training plan, inventing a basement regression, or editing approved source JSON.\n- Acceptance criteria: athlete-facing drill detail exposes source-backed space/equipment requirements; `Sprint-In Shot` visibly requires a `10–15 yd lane, puck, net`; no fabricated substitute appears.\n- Dependencies: parent/coach-approved drill library guidance.\n- Risks: an invented regression would violate source authority and could misrepresent safe execution.\n- Next action: Maintain the regression; add a substitute only if a parent/coach-approved source explicitly supplies one.\n- Links / evidence: canonical Day for 2026-08-19; Production drill detail; regression test released through PR #2.",
  "environment fit detail",
);

replaceOnce(
  "- Next action: run the audit as the next bounded current-app discovery task.\n- Links / evidence: production `/day/2026-06-30`, `/day/2026-06-29`, `/day/2026-07-06` QA.",
  "- Next action: Audit is closed; preserve the easy 45 / medium 30 / hard 20 regression matrix and corrected category/copy behavior.\n- Links / evidence: Production `/day/2026-06-18`, `/day/2026-06-23`, `/day/2026-06-29`, `/day/2026-06-30`; PR #3; Production `59558f2` and later.",
  "load audit next action",
);

replaceOnce(
  "- Next action: decide/fix `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` before any Preview save/write testing.\n- Links / evidence: Preview badge `1c336a0 · preview`; Preview `/kpis` production-like KPI results/baselines; Mike manual Vercel Project Settings confirmation.",
  "- Next action: Resolved. Use only fresh/current Preview deployments for staging tests and retain target checks before any write-capable QA.\n- Links / evidence: historical Preview badge `1c336a0 · preview`; Mike Vercel settings correction; fresh Preview proof `0794f70` on 2026-08-21.",
  "env db next action",
);
replaceOnce(
  "- Next action: decide/fix `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001`.\n- Links / evidence: `scripts/env-whoami.mjs`, `scripts/preflight.mjs`, `scripts/confirm-write-target.mjs`, Vercel project env settings.",
  "- Next action: Resolved; retain target verification before write-capable Preview QA and never reuse historical pre-split Preview deployments.\n- Links / evidence: `scripts/env-whoami.mjs`, `scripts/preflight.mjs`, `scripts/confirm-write-target.mjs`, Vercel project env settings, fresh Preview proof `0794f70`.",
  "env audit next action",
);

replaceOnce(
  "- What Supabase URL/project ref is configured for Vercel Preview?\n  - Confirmed: `mbjcedhysniabbaigsko`.\n- What Supabase URL/project ref is configured for Vercel Development?\n  - Confirmed: `mbjcedhysniabbaigsko`.\n- What Supabase URL/project ref is configured locally in `.env.local`?\n  - Confirmed: `npuankmkxbjtlokbpczz`.\n- Are Preview and Production using different Supabase project refs?\n  - Confirmed: no. Preview and Production both use `mbjcedhysniabbaigsko`.\n- If Preview uses staging, does staging contain copied/backfilled KPI rows that explain the visible data?\n  - Not applicable to current Vercel configuration; Preview currently uses production.\n- Does the app expose a safe non-secret environment label or build badge that indicates DB target?\n  - Not resolved by this docs update.\n- Should preview writes be disabled until staging isolation is proven?\n  - Yes. Preview and Development write-capable flows remain blocked unless treated read-only or `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` is fixed.\n\nOperational rule:\n\n- Do not save KPI results or perform any write-capable workflow in Vercel Preview or Vercel Development until `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` maps those environments to staging, or those deployments are explicitly classified as read-only.",
  "- What Supabase URL/project ref is configured for Vercel Preview?\n  - Confirmed current mapping: `npuankmkxbjtlokbpczz` (staging); fresh Preview build proof passed on 2026-08-21.\n- What Supabase URL/project ref is configured for Vercel Development?\n  - Confirmed current mapping: `npuankmkxbjtlokbpczz` (staging).\n- What Supabase URL/project ref is configured locally in `.env.local`?\n  - Confirmed: `npuankmkxbjtlokbpczz`.\n- Are Preview and Production using different Supabase project refs?\n  - Confirmed: yes. Production uses `mbjcedhysniabbaigsko`; fresh Preview uses `npuankmkxbjtlokbpczz`.\n- Does the app expose a safe non-secret environment/build indicator?\n  - Yes for Vercel environment/build SHA; the 2026-08-21 verification additionally proved the non-secret Supabase project ref during build.\n- Should Preview writes require target confirmation?\n  - Yes. Current Preview isolation is proven, but any write-capable QA must still confirm it is a fresh/current Preview targeting staging and must never target Production.\n\nOperational rule:\n\n- Current Preview/Development configuration is staging-isolated. Historical pre-split Preview deployments remain read-only/unsafe for writes and must not be reused.",
  "env audit required questions",
);

replaceOnce(
  "- Next action: verify a fresh Preview deployment uses staging before any Preview write testing, then resume `DEF-GANTT-SPORTLOAD-DURATION-001`.\n- Links / evidence: prior `ENV-PREVIEW-DB-001`, `ENV-PREVIEW-DB-AUDIT-001`, and Supabase staging warning for project `npuankmkxbjtlokbpczz`.",
  "- Next action: Completed; maintain staging target checks before any write-capable Preview QA.\n- Links / evidence: prior `ENV-PREVIEW-DB-001`, `ENV-PREVIEW-DB-AUDIT-001`; fresh Preview `0794f70` proved staging ref `npuankmkxbjtlokbpczz`.",
  "env mapping detailed next",
);
replaceOnce(
  "- Next action: verify a fresh Preview deployment uses staging before Preview write testing, then resume `DEF-GANTT-SPORTLOAD-DURATION-001`.\n- Links / evidence: Mike manual Vercel Project Settings confirmation on 2026-07-09; `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`.",
  "- Next action: Completed; no further environment override work is required unless Vercel variables change.\n- Links / evidence: Mike manual Vercel Project Settings confirmation on 2026-07-09; fresh Preview runtime/build proof `0794f70` on 2026-08-21; `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001`.",
  "env override detailed next",
);

replaceOnce(
  "- Next action: capture ownership model, then create deterministic smoke suite scope.\n- Links / evidence: post-4v4 smoke workflow and Mike usage concern.",
  "- Next action: Finish explicit Today and Plan/Gantt browser smoke/release-gate coverage; forward Day/Log, Calendar, video, KPI, build, Vitest, and TypeScript checks are already GitHub-owned.\n- Links / evidence: PR #4; `.github/workflows/ci.yml`; green GitHub Actions run on head `3cbc84e`; Production merge `38a2751`.",
  "qa ownership next",
);
replaceOnce(
  "- Next action: implement after environment mapping and Gantt duration semantics are handled.\n- Links / evidence: `QA-AUTOMATION-002`; repeated post-deploy smoke tasks.",
  "- Next action: Add explicit read-only Today and Plan/Gantt browser assertions, then consider this core-route smoke task complete.\n- Links / evidence: `QA-AUTOMATION-002`; `e2e/forward-product-quality.spec.ts`; `e2e/calendar-compact.spec.ts`; GitHub Actions PR #4.",
  "playwright next",
);
replaceOnce(
  "- Next action: include in QA ownership scope.\n- Links / evidence: repeated production smoke requests after 4v4 Day/Plan fixes.",
  "- Next action: Eliminate the remaining recurring manual Today/Plan-Gantt smoke once those routes are CI-covered.\n- Links / evidence: repeated production smoke requests; PR #4 GitHub-owned browser regression.",
  "codex runner next",
);

replaceOnce(
  "- Activity Prescription Display Layer is the next P1 implementation feature; docs/scope-control and environment safety work are complete.",
  "- Current-app P1 focus is the remaining QA smoke/release coverage followed by `DEF-DAY-DURATION-CONTRACT-001`; Closed-Loop methodology remains design-gated.",
  "training source next P1",
);
replaceOnce(
  "- Activity Prescription implementation until docs consolidation and environment safety sequencing are accepted.\n- Activity-specific logging fields.",
  "- Remaining blocked Activity Prescription follow-ups outside the completed canonical presentation slices.\n- Further activity-specific logging expansion beyond the currently implemented date-level flow.",
  "deferred activity items",
);
replaceOnce(
  "- Playwright setup.\n- AI Coach implementation.",
  "- Additional Playwright coverage beyond the active core-route smoke task.\n- AI Coach implementation.",
  "deferred playwright item",
);

fs.writeFileSync(path, text);
console.log("SCOPE_DETAIL_RECONCILE_OK");
