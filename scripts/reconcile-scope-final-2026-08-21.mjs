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
  const updated = section.replace(matches[0][0], `- Status: ${status}`);
  text = text.slice(0, start) + updated + text.slice(end);
}

setDetailedStatus("QA-SYSTEM-001", "In progress");

replaceOnce(
  "| 20 | QA-SYSTEM-001 | QA/testing system | P1 | Not started | Safe lane | Route/component ownership is recorded; latest projection proofs cover DEF-028 and Day/active Session parity without manual UAT. |",
  "| 20 | QA-SYSTEM-001 | QA/testing system | P1 | In progress | Safe lane | GitHub Actions now owns deterministic unit/typecheck/build/forward-browser QA; finish fixture/core-route/release-gate coverage before closing. |",
  "qa system queue",
);
replaceOnce(
  "| Not started | TEST-FIXTURE-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, QA-SYSTEM-001, DEF-014, DEF-016, DEF-018 |",
  "| Not started | TEST-FIXTURE-001, RECOVERY-DAY-MODEL-001, DAY-FIRST-ARCH-001, KPI-HISTORY-DASHBOARD-001, DEF-014, DEF-016, DEF-018 |",
  "status index qa system not started",
);
replaceOnce(
  "| In progress | QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001, DEF-DAY-DURATION-CONTRACT-001, DEF-027 |",
  "| In progress | QA-SYSTEM-001, QA-AUTOMATION-OWNERSHIP-001, QA-PLAYWRIGHT-SMOKE-001, DEF-QA-CODEX-RUNNER-001, KPI-ROADMAP-001, DESIGN-GATE-001, TRANSITION-001, DATA-GOV-001, SOURCE-VALIDATION-001, RESEARCH-REPOSITORIES-001, KNOWLEDGE-INGESTION-001, HEURISTIC-SCORING-001, ATHLETE-PERSONALIZATION-001, SENSOR-FEEDBACK-001, MODEL-GOVERNANCE-001, STACK-EVOLUTION-001, DEF-DAY-DURATION-CONTRACT-001, DEF-027 |",
  "status index qa system in progress",
);

replaceOnce(
  "- Acceptance criteria: Preview write testing remains blocked until `DEF-ENV-PREVIEW-STAGING-OVERRIDE-001` configures Preview to staging or Preview is explicitly treated as read-only.",
  "- Acceptance criteria: Met. Fresh Preview is verified against staging; historical pre-split Preview deployments remain unsafe for write testing.",
  "historical env acceptance",
);
replaceOnce(
  "- Next action: Mike reviews these findings, then explicitly approves any future write/deploy/backfill work before it starts.",
  "- Next action: Maintain the established target-confirmation and no-secret/no-production-write guardrails for future environment-sensitive work.",
  "env safety next action",
);
replaceOnce(
  "- Next action: run inspect-only comment audit before the next app-code implementation task if time allows.\n- Links / evidence: targeted comment-risk scan from this docs-only hardening task.",
  "- Next action: Completed; revisit only if new stale TODO/comment risk is discovered.\n- Links / evidence: targeted comment-risk scan from this docs-only hardening task.",
  "comment audit next action",
);
replaceOnce(
  "| 21 | QA-AUTOMATION-002 | Playwright proof-of-life strategy | P1 | Completed | Safe lane | Playwright installed Chrome channel proof-of-life passed locally; use it as a base for targeted DEF-028 regression after display/projection repair. |",
  "| 21 | QA-AUTOMATION-002 | Playwright proof-of-life strategy | P1 | Completed | Safe lane | Local Chrome proof-of-life has evolved into GitHub-owned Chromium browser QA; PR #4 proved the suite green in CI. |",
  "qa automation proof queue",
);

fs.writeFileSync(path, text);
console.log("SCOPE_FINAL_RECONCILE_OK");
