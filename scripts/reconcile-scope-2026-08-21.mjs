import fs from "node:fs";

const path = "docs/SCOPE.md";
let text = fs.readFileSync(path, "utf8");

function replaceOnce(oldText, newText, label) {
  const first = text.indexOf(oldText);
  if (first === -1) throw new Error(`Missing expected scope text: ${label}`);
  const second = text.indexOf(oldText, first + oldText.length);
  if (second !== -1) throw new Error(`Expected unique scope text but found duplicate: ${label}`);
  text = text.slice(0, first) + newText + text.slice(first + oldText.length);
}

function replaceAllExact(oldText, newText, minCount, label) {
  const parts = text.split(oldText);
  const count = parts.length - 1;
  if (count < minCount) throw new Error(`Expected at least ${minCount} matches for ${label}, found ${count}`);
  text = parts.join(newText);
}

replaceOnce(
  "- Current clean checkpoint: `7a70272` (`fix(kpis): use contextual instruction keys`).",
  "- Current clean checkpoint: `38a2751` (`Merge PR #4: run forward Playwright QA in GitHub Actions`), deployed and Production-smoked on 2026-08-21.",
  "current checkpoint",
);

replaceOnce(
  "- Next environment-safety scope: `DEF-ENV-PREVIEW-SUPABASE-MAPPING-001` and `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` are Production-runtime-verified and awaiting fresh Preview runtime verification before Preview write-capable testing.",
  "- Environment isolation is runtime-verified: Production remains on Supabase ref `mbjcedhysniabbaigsko`; a fresh 2026-08-21 Vercel Preview build on `verify/preview-staging-runtime-2026-08-21` emitted `[ENV_PROOF] vercel_env=preview supabase_ref=npuankmkxbjtlokbpczz` and would fail if Preview were not mapped to staging. No Supabase writes or secrets were used.",
  "environment checkpoint",
);

replaceOnce(
  "- Previously captured next-scope items remain: `DEF-SUPABASE-STAGING-AUTOPAUSE-001`, `QA-AUTOMATION-OWNERSHIP-001`, `QA-PLAYWRIGHT-SMOKE-001`, `DEF-QA-CODEX-RUNNER-001`, and `DEF-QA-USAGE-LEDGER-001`.",
  "- QA ownership is now active in GitHub Actions: Vitest, TypeScript, a clean production build, and the forward Playwright suite run deterministically in CI. `QA-AUTOMATION-OWNERSHIP-001`, `QA-PLAYWRIGHT-SMOKE-001`, and `DEF-QA-CODEX-RUNNER-001` remain In progress only for the remaining broader core-route/release-gate coverage.",
  "qa checkpoint",
);

replaceOnce(
  "- Product QA after `f5c35a8` found remaining production Day rendering defects: `DEF-029` is reopened, and `DEF-030`, `DEF-031`, and `DEF-032` are added as P1 product-trust defects.",
  "- The all-day load-classification audit is completed and Production-verified: controlled cardio is deterministic at 45 minutes on easy days, 30 on medium days, and 20 on hard days; `DEF-029`, `DEF-030`, and `DEF-032` are closed, and the canonical Day presentation work behind `DEF-031` is in Production.",
  "load audit checkpoint",
);

replaceOnce(
  "- Last verified pushed/deployed production baseline before this realignment: `f02bff4` (`docs(scope): correct checkpoint wording before push`).",
  "- Current verified pushed/deployed Production baseline: `38a2751`; Vercel state READY and public `/calendar` returned 200 with badge `v0.1.0 · 38a2751 · production`.",
  "production baseline",
);
replaceOnce(
  "- Production badge confirmed: `v0.1.0 · f02bff4 · production`.",
  "- Production badge confirmed: `v0.1.0 · 38a2751 · production`.",
  "production badge",
);

replaceOnce(
  "| 4.7 | DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | Preview/Staging/Production Supabase mapping is not sufficiently visible | P1 | Production runtime verified / Preview runtime pending | Docs-only / environment-safety | Production served `87355a4`, referenced production ref, and did not reference staging ref; fresh Preview verification remains pending. |",
  "| 4.7 | DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | Preview/Staging/Production Supabase mapping is not sufficiently visible | P1 | Completed | Docs-only / environment-safety | Production remains on `mbjcedhysniabbaigsko`; fresh Preview build `0794f70` proved `VERCEL_ENV=preview` and staging ref `npuankmkxbjtlokbpczz` with a fail-closed assertion. |",
  "queue env mapping",
);
replaceOnce(
  "| 4.8 | DEF-ENV-PREVIEW-STAGING-OVERRIDE-001 | Configure Vercel Preview and Development Supabase variables to use staging | P1 | Production runtime verified / Preview runtime pending | Environment safety / config change | Production runtime smoke passed after env split; verify a fresh Preview deployment uses staging before write testing. |",
  "| 4.8 | DEF-ENV-PREVIEW-STAGING-OVERRIDE-001 | Configure Vercel Preview and Development Supabase variables to use staging | P1 | Completed | Environment safety / config change | Fresh Preview runtime/build proof on 2026-08-21 confirmed staging ref `npuankmkxbjtlokbpczz`; Production remains isolated on `mbjcedhysniabbaigsko`. |",
  "queue env override",
);
replaceOnce(
  "| 4.9.2 | CAL-UX-MOBILE-DAY-ROWS-001 | Compact mobile Calendar day rows | P1 | Completed locally | Fast lane | Compact mobile rows are validated on the work branch; Mike reviews the Vercel Preview before any release. |",
  "| 4.9.2 | CAL-UX-MOBILE-DAY-ROWS-001 | Compact mobile Calendar day rows | P1 | Completed | Fast lane | Parent mobile QA accepted the compact rows; released to Production and retained under CI/Playwright Calendar coverage. |",
  "queue mobile calendar",
);
replaceOnce(
  "| 4.10 | QA-AUTOMATION-OWNERSHIP-001 | Shift recurring smoke/regression testing from Codex to deterministic scripts and CI | P1 | Not started | Docs-only / QA ownership | Define ownership model: Codex writes tests, scripts/CI run repeatable tests, Codex analyzes failures, Mike does product acceptance. |",
  "| 4.10 | QA-AUTOMATION-OWNERSHIP-001 | Shift recurring smoke/regression testing from Codex to deterministic scripts and CI | P1 | In progress | Docs-only / QA ownership | GitHub Actions now owns Vitest, TypeScript, clean production build, and forward Playwright QA; finish remaining explicit core-route/release-gate coverage. |",
  "queue qa ownership",
);
replaceOnce(
  "| 4.11 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | Not started | Safe lane / QA automation | Add read-only smoke coverage for Today, Day, Calendar, Plan/Gantt, and KPI visibility after ownership scope is captured. |",
  "| 4.11 | QA-PLAYWRIGHT-SMOKE-001 | Create deterministic Playwright smoke suite for core routes | P1 | In progress | Safe lane / QA automation | Forward Day/Log, Calendar/mobile, video, and KPI contracts run in GitHub Actions; add explicit Today and Plan/Gantt smoke coverage before closing the task. |",
  "queue playwright",
);
replaceOnce(
  "| 4.12 | DEF-QA-CODEX-RUNNER-001 | Codex is being used as a recurring manual smoke-test runner | P1 | Not started | Docs-only / QA workflow | Capture the workflow defect and move repeat smoke checks into deterministic scripts/CI. |",
  "| 4.12 | DEF-QA-CODEX-RUNNER-001 | Codex is being used as a recurring manual smoke-test runner | P1 | In progress | Docs-only / QA workflow | Repeated forward browser regression is CI-owned; remove the remaining recurring manual core-route smoke burden. |",
  "queue codex runner",
);
replaceOnce(
  "| 5 | CODE-COMMENT-AUDIT-001 | Stale Inline Comment / TODO Audit | P1 | Not started | Fast lane | Run inspect-only comment audit before the next app-code implementation task if time allows. |",
  "| 5 | CODE-COMMENT-AUDIT-001 | Stale Inline Comment / TODO Audit | P1 | Completed | Fast lane | Inspect-only comment-risk scan is recorded in the detailed scope record; no behavior changes were required. |",
  "queue comment audit",
);
replaceOnce(
  "| 15 | PLAN-CONTENT-001 | Plan content/title correctness | P1 | Completed locally | Source-review | Approved Aug 14-Sep 6 cutover and protected-history verification are complete locally; parent visual acceptance remains. |",
  "| 15 | PLAN-CONTENT-001 | Plan content/title correctness | P1 | Completed | Source-review | Approved forward cutover is released and Production-verified through the tryout-period extension. |",
  "queue plan content",
);
replaceOnce(
  "| 15.1 | PLAN-TRYOUT-EXTENSION-2026-001 | Late-August Ice / Pathway / U12B Tryout Plan Extension | P1 | In progress | Source-review -> Fast lane | Reconcile parent-confirmed Aug 22-Sep 18 Sport Loads and extend canonical Day coverage through Sep 18. |",
  "| 15.1 | PLAN-TRYOUT-EXTENSION-2026-001 | Late-August Ice / Pathway / U12B Tryout Plan Extension | P1 | Completed | Source-review -> Fast lane | Parent-approved Aug 22-Sep 18 schedule, taper, Pathway, and tryout sequence are in Production and verified. |",
  "queue tryout extension",
);
replaceOnce(
  "| 27 | DEF-029 | Controlled bike/treadmill copy clarity | P1 | Reopened / product QA found incomplete rendering-path coverage | Fast lane | Run `AUDIT-LOAD-CLASSIFICATION-001` before another narrow rendering fix. |",
  "| 27 | DEF-029 | Controlled bike/treadmill copy clarity | P1 | Completed | Fast lane | Production now renders the approved controlled-cardio safety instruction through the canonical presentation path. |",
  "queue def029",
);
replaceOnce(
  "| 28 | DEF-030 | Controlled cardio activity displays as KPI | P1 | Not started | Fast lane | Audit Day rendering/classification path for `/day/2026-06-30`; do not change behavior in docs capture. |",
  "| 28 | DEF-030 | Controlled cardio activity displays as KPI | P1 | Completed | Fast lane | Production June 30 KPI Day suppresses controlled cardio from KPI presentation; regression coverage is in place. |",
  "queue def030",
);
replaceOnce(
  "| 29 | DEF-031 | Multiple day presentation formats produce inconsistent day/activity rendering | P1 | Completed locally | Fast lane | Canonical compact Day summary now renders all dates; parent visual acceptance remains. |",
  "| 29 | DEF-031 | Multiple day presentation formats produce inconsistent day/activity rendering | P1 | Completed | Fast lane | Canonical compact Day presentation is released and covered by deterministic projection/browser regression. |",
  "queue def031",
);
replaceOnce(
  "| 30 | DEF-032 | Controlled cardio duration/load-tier classification is not explainable | P1 | Not started | Source-review / Fast lane audit | Run all-day load classification audit; explain controlled-cardio duration sources before changing rules. |",
  "| 30 | DEF-032 | Controlled cardio duration/load-tier classification is not explainable | P1 | Completed | Source-review / Fast lane audit | Production-verified rule is easy 45 / medium 30 / hard 20 with corrected category semantics and safety copy. |",
  "queue def032",
);
replaceOnce(
  "| 31 | AUDIT-LOAD-CLASSIFICATION-001 | All-day load classification audit | P1 | Not started | Docs-only / inspect-only | Discovery only: map day/activity classification, durations, copy leaks, KPI category leaks, and rendering paths. |",
  "| 31 | AUDIT-LOAD-CLASSIFICATION-001 | All-day load classification audit | P1 | Completed | Docs-only / inspect-only | Audit traced 20/30/45 behavior and rendering-path defects; bounded fixes were released and Production-verified. |",
  "queue load audit",
);

replaceOnce(
  "Current sprint: the accepted daily-scale Gantt is live and documented, and `DEF-REACT-DUPLICATE-KEY-EASY-SPIN-001` is fixed, pushed at `7a70272`, and production-smoked.",
  "Current sprint: Production is `38a2751`; the approved forward/tryout plan, mobile Calendar, environment-fit drill presentation, controlled-cardio fixes, and GitHub-owned forward Playwright regression gate are live and verified. Fresh Preview isolation to staging is also runtime-proven.",
  "current sprint sentence",
);
replaceOnce(
  "- Verify a fresh Preview deployment uses staging before any Preview write testing.\n- Then implement `QA-PLAYWRIGHT-SMOKE-001` under `QA-AUTOMATION-OWNERSHIP-001` so recurring route smoke checks move to deterministic scripts/CI.\n- Then capture/implement `DEF-QA-USAGE-LEDGER-001`.\n- Preserve the broader pre-4v4 queue: `AUDIT-LOAD-CLASSIFICATION-001` remains the next bounded discovery task for `DEF-029`, `DEF-030`, `DEF-031`, and `DEF-032` after the newly captured environment/Gantt/QA sequencing work.",
  "- Environment isolation is complete for current Production and fresh Preview deployments; keep normal no-secret/no-production-write guardrails.\n- Finish `QA-PLAYWRIGHT-SMOKE-001` by adding explicit Today and Plan/Gantt read-only browser coverage; the forward Day/Log, Calendar, video, and KPI contracts are already CI-owned.\n- Then prioritize `DEF-DAY-DURATION-CONTRACT-001` as the next athlete-facing P1: define authoritative duration scopes without forcing unlike totals to match or inventing a replacement total.\n- Keep `DEF-QA-USAGE-LEDGER-001` as P2 workflow cleanup after the remaining P1 QA/duration work.",
  "current sprint bullets",
);

replaceOnce(
  "| Production runtime verified / Preview runtime pending | DEF-ENV-PREVIEW-SUPABASE-MAPPING-001, DEF-ENV-PREVIEW-STAGING-OVERRIDE-001 |\n| Reopened / product QA found incomplete rendering-path coverage | DEF-029 |",
  "| Production runtime verified / Preview runtime pending | None |\n| Reopened / product QA found incomplete rendering-path coverage | None |",
  "status index pending/reopened",
);
replaceOnce(
  "| Completed locally | CAL-UX-MOBILE-DAY-ROWS-001, DEF-GANTT-SPORTLOAD-DURATION-001, DEF-DAY-KPI-TRUTH-DIVERGENCE-001, DEF-TRAINING-WORK-CANONICAL-DAY-001, DEF-SPORTLOAD-CONDITIONING-CONTRADICTION-001, DEF-SPEEDSTACK-WARMUP-DETAIL-001, PLAN-CONTENT-001, ACTIVITY-LOGGING-001, DEF-031 |",
  "| Completed locally | DEF-DAY-KPI-TRUTH-DIVERGENCE-001, DEF-TRAINING-WORK-CANONICAL-DAY-001, DEF-SPORTLOAD-CONDITIONING-CONTRADICTION-001, DEF-SPEEDSTACK-WARMUP-DETAIL-001, ACTIVITY-LOGGING-001 |",
  "status index completed locally",
);
replaceOnce(
  "| Not started | QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, CODE-COMMENT-AUDIT-001, TEST-FIXTURE-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, QA-SYSTEM-001, AUDIT-LOAD-CLASSIFICATION-001, DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001, DEF-014, DEF-016, DEF-018, DEF-030, DEF-032 |",
  "| Not started | TEST-FIXTURE-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, QA-SYSTEM-001, DEF-014, DEF-016, DEF-018 |",
  "status index not started",
);
replaceOnce(
  "| Completed | ENV-PREVIEW-DB-001, ENV-PREVIEW-DB-AUDIT-001, SPORT-LOAD-4V4-SUMMER-2026, PLAN-GANTT-SPORTLOAD-V84-001, FORENSIC-DAY-SESSION-MISMATCH-001, SURFACE-PRESENTATION-CONSUMER-AUDIT-001, ACTIVITY-PRESENTATION-CONTRACT-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, CONDITIONING-CARDIO-DURATION-001, QA-AUTOMATION-002, DEF-007, DEF-028 |",
  "| Completed | ENV-PREVIEW-DB-001, ENV-PREVIEW-DB-AUDIT-001, DEF-ENV-PREVIEW-SUPABASE-MAPPING-001, DEF-ENV-PREVIEW-STAGING-OVERRIDE-001, SPORT-LOAD-4V4-SUMMER-2026, PLAN-GANTT-SPORTLOAD-V84-001, CAL-UX-MOBILE-DAY-ROWS-001, PLAN-CONTENT-001, PLAN-TRYOUT-EXTENSION-2026-001, DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001, AUDIT-LOAD-CLASSIFICATION-001, DEF-029, DEF-030, DEF-031, DEF-032, CODE-COMMENT-AUDIT-001, FORENSIC-DAY-SESSION-MISMATCH-001, SURFACE-PRESENTATION-CONSUMER-AUDIT-001, ACTIVITY-PRESENTATION-CONTRACT-001, FUTURE-DAY-READINESS-001, DAY-SESSION-PARITY-001, CONDITIONING-CARDIO-DURATION-001, QA-AUTOMATION-002, DEF-007, DEF-028 |",
  "status index completed",
);
replaceOnce(
  "| In progress | PLAN-TRYOUT-EXTENSION-2026-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001, DEF-DAY-DURATION-CONTRACT-001, DEF-027 |",
  "| In progress | QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001, DEF-DAY-DURATION-CONTRACT-001, DEF-027 |",
  "status index in progress",
);

replaceAllExact("- Status: Production runtime verified / Preview runtime pending", "- Status: Completed", 2, "detailed env statuses");
replaceOnce("- Status: Completed locally\n- Lane: Fast lane\n- Owner: Mike / Codex\n- Source: Mike mobile Calendar review on 2026-08-18.", "- Status: Completed\n- Lane: Fast lane\n- Owner: Mike / Codex\n- Source: Mike mobile Calendar review on 2026-08-18.", "detailed mobile status");
replaceOnce("- Status: In progress\n- Lane: Source-review -> Fast lane\n- Owner: Mike / Codex\n- Source: Parent-confirmed future schedule and explicit v8.4 source-update authorization on 2026-08-19.", "- Status: Completed\n- Lane: Source-review -> Fast lane\n- Owner: Mike / Codex\n- Source: Parent-confirmed future schedule and explicit v8.4 source-update authorization on 2026-08-19.", "detailed tryout extension status");
replaceOnce("### DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001\n\n- ID: DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001\n- Title: Forward training drill may require ice/open-space environment without a usable at-home regression\n- Type: Defect\n- Parent: PLAN-CONTENT-001\n- Priority: P1\n- Status: Not started", "### DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001\n\n- ID: DEF-FORWARD-DRILL-ENVIRONMENT-FIT-001\n- Title: Forward training drill may require ice/open-space environment without a usable at-home regression\n- Type: Defect\n- Parent: PLAN-CONTENT-001\n- Priority: P1\n- Status: Completed", "detailed environment-fit status");
replaceOnce("### QA-AUTOMATION-OWNERSHIP-001\n\n- ID: QA-AUTOMATION-OWNERSHIP-001\n- Title: Shift recurring smoke/regression testing from Codex to deterministic scripts and CI\n- Type: Epic\n- Parent: QA system\n- Priority: P1\n- Status: Not started", "### QA-AUTOMATION-OWNERSHIP-001\n\n- ID: QA-AUTOMATION-OWNERSHIP-001\n- Title: Shift recurring smoke/regression testing from Codex to deterministic scripts and CI\n- Type: Epic\n- Parent: QA system\n- Priority: P1\n- Status: In progress", "detailed qa ownership status");
replaceOnce("### QA-PLAYWRIGHT-SMOKE-001\n\n- ID: QA-PLAYWRIGHT-SMOKE-001\n- Title: Create deterministic Playwright smoke suite for core routes\n- Type: Task\n- Parent: `QA-AUTOMATION-OWNERSHIP-001`\n- Priority: P1\n- Status: Not started", "### QA-PLAYWRIGHT-SMOKE-001\n\n- ID: QA-PLAYWRIGHT-SMOKE-001\n- Title: Create deterministic Playwright smoke suite for core routes\n- Type: Task\n- Parent: `QA-AUTOMATION-OWNERSHIP-001`\n- Priority: P1\n- Status: In progress", "detailed playwright status");
replaceOnce("### DEF-QA-CODEX-RUNNER-001\n\n- ID: DEF-QA-CODEX-RUNNER-001\n- Title: Codex is being used as a recurring manual smoke-test runner\n- Type: Defect\n- Parent: `QA-AUTOMATION-OWNERSHIP-001`\n- Priority: P1\n- Status: Not started", "### DEF-QA-CODEX-RUNNER-001\n\n- ID: DEF-QA-CODEX-RUNNER-001\n- Title: Codex is being used as a recurring manual smoke-test runner\n- Type: Defect\n- Parent: `QA-AUTOMATION-OWNERSHIP-001`\n- Priority: P1\n- Status: In progress", "detailed codex runner status");
replaceOnce("### AUDIT-LOAD-CLASSIFICATION-001\n\n- ID: AUDIT-LOAD-CLASSIFICATION-001\n- Title: All-day load classification audit\n- Type: Task\n- Parent: DEF-029 / DEF-030 / DEF-031 / DEF-032\n- Priority: P1\n- Status: Not started", "### AUDIT-LOAD-CLASSIFICATION-001\n\n- ID: AUDIT-LOAD-CLASSIFICATION-001\n- Title: All-day load classification audit\n- Type: Task\n- Parent: DEF-029 / DEF-030 / DEF-031 / DEF-032\n- Priority: P1\n- Status: Completed", "detailed load audit status");

replaceAllExact("| DEF-029 | Controlled bike/treadmill copy clarity | Defect | Activity Presentation / Conditioning | P1 | Reopened / product QA found incomplete rendering-path coverage |", "| DEF-029 | Controlled bike/treadmill copy clarity | Defect | Activity Presentation / Conditioning | P1 | Completed |", 1, "defect table def029");
replaceAllExact("| DEF-030 | Controlled cardio activity displays as KPI | Defect | Activity Presentation / Classification | P1 | Not started |", "| DEF-030 | Controlled cardio activity displays as KPI | Defect | Activity Presentation / Classification | P1 | Completed |", 1, "defect table def030");
replaceAllExact("| DEF-031 | Multiple day presentation formats produce inconsistent day/activity rendering | Defect | Day Presentation / Activity Presentation | P1 | Completed locally |", "| DEF-031 | Multiple day presentation formats produce inconsistent day/activity rendering | Defect | Day Presentation / Activity Presentation | P1 | Completed |", 1, "defect table def031");
replaceAllExact("| DEF-032 | Controlled cardio duration/load-tier classification is not explainable | Defect | Conditioning / Load Classification | P1 | Not started |", "| DEF-032 | Controlled cardio duration/load-tier classification is not explainable | Defect | Conditioning / Load Classification | P1 | Completed |", 1, "defect table def032");
replaceAllExact("| DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | Preview/Staging/Production Supabase mapping is not sufficiently visible | Defect | Environment safety | P1 | Production runtime verified / Preview runtime pending |", "| DEF-ENV-PREVIEW-SUPABASE-MAPPING-001 | Preview/Staging/Production Supabase mapping is not sufficiently visible | Defect | Environment safety | P1 | Completed |", 1, "defect table env mapping");
replaceAllExact("| DEF-ENV-PREVIEW-STAGING-OVERRIDE-001 | Configure Vercel Preview and Development Supabase variables to use staging | Defect / Task | Environment safety | P1 | Production runtime verified / Preview runtime pending |", "| DEF-ENV-PREVIEW-STAGING-OVERRIDE-001 | Configure Vercel Preview and Development Supabase variables to use staging | Defect / Task | Environment safety | P1 | Completed |", 1, "defect table env override");
replaceAllExact("| DEF-QA-CODEX-RUNNER-001 | Codex is being used as a recurring manual smoke-test runner | Defect | QA automation ownership | P1 | Not started |", "| DEF-QA-CODEX-RUNNER-001 | Codex is being used as a recurring manual smoke-test runner | Defect | QA automation ownership | P1 | In progress |", 1, "defect table codex runner");

replaceOnce(
  "- Existing old Preview deployments remain production-risk until replaced or verified because environment-variable changes affect new deployments.",
  "- Historical old Preview deployments created before the environment split must not be reused for write testing; a fresh 2026-08-21 Preview is runtime/build-verified against staging ref `npuankmkxbjtlokbpczz`.",
  "environment scope old preview rule",
);
replaceOnce(
  "- Do not save KPI results or perform write-capable flows in Vercel Preview until a fresh Preview deployment is verified to use staging, or that deployment is explicitly treated read-only.",
  "- Current fresh Preview isolation is verified to staging. Any future write-capable Preview test must still confirm the deployment is a current Preview/staging build and must never target Production.",
  "environment scope preview rule",
);
replaceOnce(
  "- Playwright is planned future scope, not implemented in this consolidation.\n- Production smoke and release gate remain future QA work.",
  "- GitHub Actions runs Vitest, TypeScript, a clean production build, and the forward Playwright browser suite on PR/main workflows; the suite is proven green after catching and correcting a time-dependent KPI assertion.\n- QA automation is active but not fully closed: explicit Today and Plan/Gantt browser smoke coverage and broader release-gate ownership remain under `QA-PLAYWRIGHT-SMOKE-001` / `QA-AUTOMATION-OWNERSHIP-001`.",
  "testing scope",
);

fs.writeFileSync(path, text);
console.log("SCOPE_RECONCILE_OK");
