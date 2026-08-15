import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const dataDir = path.join(root, "imports/v8.4/data");
const cutoff = "2026-08-14";
const end = "2026-09-06";

const dates = enumerateDates(cutoff, end);
const correctedMarcLoads = new Map([
  ["2026-08-14", { details: "90 minutes", intensity15: 4 }],
  ["2026-08-15", { details: "120 minutes", intensity15: 4 }],
  ["2026-08-16", { details: "60 minutes", intensity15: 4 }],
]);
const approved = new Map([
  ["2026-08-14", day("Marc O'Connor Hockey", [sport("MARC-OCONNOR-2026-08-14", "Marc O’Connor Ice")])],
  ["2026-08-15", day("Marc O'Connor Hockey", [sport("MARC-OCONNOR-2026-08-15", "Marc O’Connor Ice")])],
  ["2026-08-16", day("Marc + 4v4 Game-Speed Day", [sport("MARC-OCONNOR-2026-08-16", "Marc O’Connor Ice"), sport("4V4-2026-08-16", "4v4 Hockey")])],
  ["2026-08-17", technicalWeaknessDay()],
  ["2026-08-18", day("Speed Stack A + Puck Quality", [work("SS-A-P5W2", "Speed Stack", "Phase 5 Speed Stack A — Week 2", 55, "SS-A-P5W2"), work("SKL-HU-10", "Stickhandling", "Head-up stickhandling", 10, "SKL-HU-001;SKL-HU-002"), work("SHOT-QUALITY-10", "Shooting", "Shooting quality", 10, "SHOT-MECH-001;SHOT-ACC-001", "Shot accuracy")])],
  ["2026-08-19", day("Speed With Puck + Reactive Skill", [work("SKL-GS-PUCK-20", "Puck Skill", "Speed-with-puck work", 20, "SKL-GS-001;SKL-GS-002"), work("SKL-REACTIVE-DEKE-15", "Puck Skill", "Reactive / deking work", 15, "SKL-DEKE-001;SKL-DEKE-002;SKL-DEKE-003"), work("SHOT-MOVEMENT-ACC-20", "Shooting", "Shooting from movement / accuracy", 20, "SHOT-GAME-001;SHOT-GAME-002;SHOT-ACC-001", "Shot accuracy")])],
  ["2026-08-20", day("KPI Retest", [kpi("KPI-RETEST-2026-08-20", 50)])],
  ["2026-08-21", technicalWeaknessDay()],
  ["2026-08-22", day("Puck Feel + Shooting", [work("SKL-PUCK-FEEL-10", "Stickhandling", "Easy stickhandling", 10, "SKL-HU-001;SKL-HU-003"), work("SHOT-EASY-10", "Shooting", "Easy shooting", 10, "SHOT-MECH-001;SHOT-ACC-001", "Shot accuracy")])],
  ["2026-08-23", day("4v4 Game Transfer", [sport("4V4-2026-08-23", "4v4 Hockey")])],
  ...["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28"].map((date) => [date, day("Sensplex Camp", [sport(`SENSPLEX-${date}`, "Sensplex Camp")])]),
  ["2026-08-29", day("Technical Reset", [work("SKL-HU-15", "Stickhandling", "Head-up stickhandling", 15, "SKL-HU-001;SKL-HU-002"), work("SHOT-QUALITY-20", "Shooting", "Shooting quality", 20, "SHOT-MECH-001;SHOT-ACC-001", "Shot accuracy")])],
  ["2026-08-30", day("Speed + Puck Primer", [work("SPEED-REACTIVE-PRIMER-8", "Speed Primer", "Short speed / reactive primer", 8, "SKL-GS-001;SKL-GS-002"), work("PUCK-AT-SPEED-12", "Puck Skill", "Puck-at-speed", 12, "SKL-GS-001;SKL-GS-002"), work("SHOT-RELEASE-10", "Shooting", "Shooting / release quality", 10, "SHOT-QR-001;SHOT-ANGLE-001")])],
  ["2026-08-31", day("Tryout Primer", [work("ACCEL-PRIMER-6", "Speed Primer", "Short acceleration primer", 6, "SKL-GS-001"), work("PUCK-FEEL-10", "Stickhandling", "Puck feel", 10, "SKL-HU-001;SKL-HU-003"), work("SHOT-RELEASE-10", "Shooting", "Shooting / release", 10, "SHOT-QR-001;SHOT-ANGLE-001")])],
  ["2026-09-01", day("Tryout", [sport("TRYOUT-2026-09-01", "Tryout")])],
  ...["2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06"].map((date) => [date, day("Tryout Window", [optional("TRYOUT-PUCK-FEEL-10", "Stickhandling", "Puck feel", 10, "SKL-HU-001;SKL-HU-003"), optional("TRYOUT-SHOT-QUALITY-10", "Shooting", "Shooting quality", 10, "SHOT-MECH-001;SHOT-ACC-001", "Shot accuracy")], true)]),
]);

if (approved.size !== dates.length) throw new Error(`Expected ${dates.length} approved days, found ${approved.size}.`);

const oldSessions = read("sessions.json");
const oldExecution = read("dayExecutionPlan.json");
const oldSportLoads = read("sportLoads.json");
const sportByDateTitle = new Map(oldSportLoads.map((load) => [`${load.date}|${load.sportLoad}`, load]));

const forwardExecution = [];
const forwardSessions = [];
for (const date of dates) {
  const definition = approved.get(date);
  const existing = oldSessions.find((session) => session.date === date);
  if (!existing) throw new Error(`Missing stable session for ${date}.`);
  const flowEntries = [flow("READINESS", "Readiness", "Readiness Check", "readinessLog")];
  for (const item of definition.items) flowEntries.push(item);
  flowEntries.push(flow("REFLECTION", "Reflection", "End-of-day Reflection", "reflectionLog"));
  forwardExecution.push(...flowEntries.map((entry, index) => ({
    date,
    week: existing.week,
    day: existing.day,
    sequence: index + 1,
    entryType: entry.entryType,
    entryTitle: entry.entryTitle,
    sourceBlock: entry.sourceBlock,
    plannedDurationMin: entry.plannedDurationMin,
    logType: entry.logType,
    requiredOptional: entry.requiredOptional,
    loadImpact: entry.loadImpact,
    notes: entry.notes,
    appRenderHint: entry.appRenderHint,
    activityId: entry.activityId,
    detailIds: entry.detailIds,
    focus: entry.focus ?? null,
    executable: entry.executable,
    eventDependent: definition.eventDependent || false,
  })));
  const trainingMinutes = definition.items.filter((item) => item.logType !== "sportLoadLog").reduce((sum, item) => sum + (item.plannedDurationMin || 0), 0);
  const sports = definition.items.filter((item) => item.logType === "sportLoadLog");
  forwardSessions.push({
    ...existing,
    dayType: definition.title,
    speedStackAlignment: definition.items.some((item) => item.activityId === "SS-A-P5W2") ? "Speed Stack Phase 5 W2" : "None",
    sportLoad: sports.map((item) => item.entryTitle).join(" + ") || null,
    hasSportLoad: sports.length ? "Yes" : "No",
    hasTrainingWork: trainingMinutes > 0 ? "Yes" : "No",
    sequenceCount: flowEntries.length,
    estimatedDurationMin: trainingMinutes,
    summary: definition.title,
    sourceTable: "Parent-approved forward cutover 2026-08-13",
    implementationStatus: definition.eventDependent ? "Approved event-dependent tryout window" : "Approved forward plan",
  });
}

const requiredSports = [];
for (const [date, definition] of approved) {
  const existingSession = oldSessions.find((session) => session.date === date);
  for (const item of definition.items.filter((candidate) => candidate.logType === "sportLoadLog")) {
    const old = sportByDateTitle.get(`${date}|${item.entryTitle}`);
    const base = old || {
      date,
      week: existingSession.week,
      day: existingSession.day,
      sportLoad: item.entryTitle,
      details: item.entryTitle === "Tryout" ? "Tryout begins; exact time to be confirmed." : "Approved planned Sport Load.",
      intensity15: item.entryTitle === "Tryout" ? 5 : 4,
      planRule: "Sport Load is the program for this date; no additional workout.",
    };
    const marcCorrection = item.entryTitle === "Marc O’Connor Ice" ? correctedMarcLoads.get(date) : null;
    requiredSports.push(marcCorrection ? { ...base, ...marcCorrection } : base);
  }
}

write("sessions.json", [...oldSessions.filter((row) => row.date < cutoff), ...forwardSessions]);
write("dayExecutionPlan.json", [...oldExecution.filter((row) => row.date < cutoff), ...forwardExecution]);
write("sportLoads.json", [...oldSportLoads.filter((row) => row.date < cutoff), ...requiredSports]);
updateImportQaReport();
updateManifest(["data/sessions.json", "data/dayExecutionPlan.json", "data/sportLoads.json", "data/importQaReport.json"]);

function day(title, items, eventDependent = false) { return { title, items, eventDependent }; }
function technicalWeaknessDay() { return day("Technical Quality + Weakness", [work("SKL-HU-15", "Stickhandling", "Head-up stickhandling", 15, "SKL-HU-001;SKL-HU-002"), work("SHOT-ACC-20", "Shooting", "Shooting accuracy", 20, "SHOT-ACC-001", "Shot accuracy"), work("WEAK-PULL-12", "Weakness", "Pull-strength / flexed-arm-hang", 12, "pull-strength-flexed-arm-hang", "Pull strength")]); }
function work(id, type, title, minutes, detailIds, focus = null) { return entry(id, type, title, minutes, "trainingWorkLog", "Required", detailIds, focus); }
function optional(id, type, title, minutes, detailIds, focus = null) { return entry(id, type, title, minutes, "trainingWorkLog", "Optional", detailIds, focus); }
function sport(id, title) { return entry(id, "Sport Load", title, null, "sportLoadLog", "Required", id); }
function kpi(id, minutes) { return entry(id, "KPI", "KPI Test", minutes, "kpiLog", "Required", "kpi-10-yard;kpi-broad-jump;kpi-5105;kpi-shot-accuracy;kpi-puck-weave;kpi-head-up-callout;kpi-quick-hands;kpi-plank-quality;kpi-100m-sprint;kpi-45-second-shuttle;kpi-push-ups;kpi-flexed-arm-hang;kpi-zwift-bike-3x10s-peak-power;kpi-vertical-jump"); }
function flow(id, type, title, logType) { return { ...entry(id, type, title, null, logType, "Required", id), executable: false }; }
function entry(id, type, title, minutes, logType, requiredOptional, detailIds, focus = null) { return { activityId: id, entryType: type, entryTitle: title, sourceBlock: detailIds, plannedDurationMin: minutes, logType, requiredOptional, loadImpact: type, notes: approvedNote(id), appRenderHint: type === "Speed Stack" ? "superset-session" : type === "Sport Load" ? "sport-load" : type === "KPI" ? "kpi-battery" : "drill-list", detailIds: detailIds.split(";"), focus, executable: true }; }
function approvedNote(id) {
  if (id === "SS-A-P5W2") return "";
  if (id === "WEAK-PULL-12") return "Approved module: band/towel rows 3x10; supported flexed-arm hold 4x5-8s; scapular hang/shoulder set 2x5; incline push-ups 3x6-10; dead bug 2x6/side. Foot support allowed; no kipping or painful hangs.";
  if (id.startsWith("KPI-RETEST")) return "Complete the approved KPI Test while fresh. Keep Puck-Control Weave visible and defer it with a reason if the approved setup or safe space is unavailable. No appended workout.";
  if (id.startsWith("TRYOUT-")) return "Event-dependent: use only when no tryout/event exists; no required physical training.";
  return "";
}
function enumerateDates(start, finish) { const result=[]; for (let value=new Date(`${start}T12:00:00Z`); value<=new Date(`${finish}T12:00:00Z`); value.setUTCDate(value.getUTCDate()+1)) result.push(value.toISOString().slice(0,10)); return result; }
function read(file) { return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8")); }
function write(file, value) { fs.writeFileSync(path.join(dataDir, file), `${JSON.stringify(value, null, 2)}\n`); }
function updateImportQaReport() {
  const report = read("importQaReport.json");
  report.packageVersion = "v8.4-forward-cutover-2026-08-14";
  report.generatedAt = "2026-08-13T00:00:00-04:00";
  report.recordCounts["dayExecutionPlan.json"] = read("dayExecutionPlan.json").length;
  report.recordCounts["sessions.json"] = read("sessions.json").length;
  report.recordCounts["sportLoads.json"] = read("sportLoads.json").length;
  write("importQaReport.json", report);
}
function updateManifest(files) {
  const manifestPath = path.join(root, "imports/v8.4/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const file of manifest.files.filter((item) => files.includes(item.file))) {
    const bytes = fs.readFileSync(path.join(root, "imports/v8.4", file.file));
    const parsed = JSON.parse(bytes);
    file.recordCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
    file.sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  }
  manifest.packageVersion = "v8.4-forward-cutover-2026-08-14";
  manifest.generatedAt = "2026-08-13T00:00:00-04:00";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
