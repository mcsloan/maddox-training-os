import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const packageDir = path.join(root, "imports/v8.4");
const manifest = readJson(path.join(packageDir, "manifest.json"));
const importQaReport = readJson(path.join(packageDir, "data/importQaReport.json"));

const countStrategies = {
  "data/ganttModel.json": (value) => (Array.isArray(value?.lanes) ? value.lanes.length : null),
  "data/logSchemas.json": (value) => (value && typeof value === "object" ? Object.keys(value).length : null),
  "data/sourceOfTruthLock.json": (value) => (Array.isArray(value) ? value.length : null),
  "data/needsReview.json": (value) => (Array.isArray(value) ? value.filter((row) => String(row?.canonicalExerciseId || "") !== "NO_REMAINING_REVIEW_ROWS").length : null),
};

const issues = [];

for (const file of manifest.files) {
  const filePath = path.join(packageDir, file.file);
  const value = readJson(filePath);
  const count = countFile(file.file, value);
  if (count !== file.recordCount) {
    issues.push(`${file.file}: expected ${file.recordCount}, found ${count ?? "unavailable"}`);
  }
}

const dayExecutionPlan = readJson(path.join(packageDir, "data/dayExecutionPlan.json"));
const sessions = readJson(path.join(packageDir, "data/sessions.json"));
const drillCards = readJson(path.join(packageDir, "data/drillCards.json"));
const exerciseVideoMap = readJson(path.join(packageDir, "data/exerciseVideoMap.json"));
const needsReview = readJson(path.join(packageDir, "data/needsReview.json"));
const ganttModel = readJson(path.join(packageDir, "data/ganttModel.json"));
const normalizedNeedsReviewCount = Array.isArray(needsReview)
  ? needsReview.filter((row) => String(row?.canonicalExerciseId || "") !== "NO_REMAINING_REVIEW_ROWS").length
  : null;

if (!Array.isArray(dayExecutionPlan) || dayExecutionPlan.length !== 630) issues.push("dayExecutionPlan.json should contain 630 records.");
if (!Array.isArray(sessions) || sessions.length !== 84) issues.push("sessions.json should contain 84 records.");
if (!Array.isArray(drillCards) || drillCards.length !== 154) issues.push("drillCards.json should contain 154 records.");
if (!Array.isArray(exerciseVideoMap) || exerciseVideoMap.length !== 154) issues.push("exerciseVideoMap.json should contain 154 records.");
const sportLoads = readJson(path.join(packageDir, "data/sportLoads.json"));
if (!Array.isArray(sportLoads) || sportLoads.length !== 37) issues.push("sportLoads.json should contain 37 records.");
if (normalizedNeedsReviewCount !== 0) issues.push("needsReview.json should normalize to 0 active records.");
if (!ganttModel || !Array.isArray(ganttModel.weeks) || !Array.isArray(ganttModel.lanes)) issues.push("ganttModel.json should include weeks and lanes.");
if (!ganttModel || ganttModel.lanes.length !== 17) issues.push("ganttModel.json should contain 17 lanes.");
if (importQaReport.needsReviewRows !== 0) issues.push(`importQaReport.needsReviewRows expected 0, found ${importQaReport.needsReviewRows}.`);
if (importQaReport.videoStatusCounts?.["Exact Source Video"] !== 149) issues.push("importQaReport video coverage count mismatch.");

if (issues.length) {
  console.error("v8.4 import smoke test failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log("v8.4 import smoke test passed.");
  console.log(JSON.stringify({
    manifestFiles: manifest.files.length,
    dayExecutionPlan: dayExecutionPlan.length,
    sessions: sessions.length,
    drillCards: drillCards.length,
    exerciseVideoMap: exerciseVideoMap.length,
    needsReview: normalizedNeedsReviewCount,
    ganttLanes: ganttModel.lanes.length,
    exactSourceVideoCount: importQaReport.videoStatusCounts?.["Exact Source Video"] ?? null,
  }, null, 2));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function countFile(file, value) {
  const strategy = countStrategies[file];
  if (strategy) return strategy(value);
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") return Object.keys(value).length;
  return null;
}
