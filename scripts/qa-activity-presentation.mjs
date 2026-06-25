#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.QA_BASE_URL || "http://localhost:3000";
const OUT_DIR = path.resolve("qa-artifacts/activity-presentation");
const USER_DATA_DIR = path.join(os.tmpdir(), `maddox-qa-chrome-${process.pid}`);
const VIEWPORT = "1440,1800";
const VIRTUAL_TIME_BUDGET = "7000";
const CHROME_TIMEOUT_MS = 30000;
const HTTP_TIMEOUT_MS = 10000;
const HEADLESS_MODES = ["--headless=new", "--headless"];

const pages = [
  {
    key: "day",
    label: "Day 2026-06-19",
    url: `${BASE_URL}/day/2026-06-19`,
    htmlFile: "day-2026-06-19.html",
    screenshotFile: "day-2026-06-19.png",
  },
  {
    key: "session",
    label: "Session 2026-06-19",
    url: `${BASE_URL}/session/session-2026-06-19`,
    htmlFile: "session-2026-06-19.html",
    screenshotFile: "session-2026-06-19.png",
  },
];

const forbiddenVisibleStrings = [
  "MOB-15",
  "SHOT-50",
  "SHOT-100",
  "CON-SHIFT",
  "CON-RSA",
  "SKL-HU10",
  "TEST",
  "SS-A",
  "SS-B",
  "SS-C",
  "source conflict",
  "unresolved plan items",
  "source sheet",
  "workbook",
  "external-load",
  "externalLoad",
  "sourceBlock",
  "plannedBlockIds",
];

if (!existsSync(CHROME)) {
  console.error(`Google Chrome was not found at ${CHROME}`);
  process.exit(1);
}

try {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(USER_DATA_DIR, { recursive: true });

  const captures = {};
  for (const page of pages) {
    console.log(`Fetching HTML: ${page.url}`);
    const { html, status } = await fetchPage(page.url);
    await writeFile(path.join(OUT_DIR, page.htmlFile), html);
    captures[page.key] = {
      ...page,
      html,
      status,
      text: htmlToText(html),
      hero: extractHero(html),
    };
  }

  const results = buildAssertions(captures);
  const screenshotResults = await captureScreenshots();
  await writeReport(captures, results, screenshotResults);

  const failed = results.filter((result) => result.status === "fail");
  if (failed.length) {
    console.error(`Activity presentation QA failed: ${failed.length} assertion(s).`);
    for (const result of failed) console.error(`- ${result.name}: ${result.detail}`);
    process.exit(1);
  }

  console.log(`Activity presentation QA passed. Report: ${path.join(OUT_DIR, "report.md")}`);
} catch (reason) {
  const message = reason instanceof Error ? reason.message : String(reason);
  await writeFailureReport(message).catch(() => {});
  console.error(message);
  process.exit(1);
} finally {
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}

async function fetchPage(url) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(HTTP_TIMEOUT_MS) });
  } catch (reason) {
    throw new Error(`HTTP fetch failed for ${url}. Start Terminal 1 with npm run dev, then rerun node scripts/qa-activity-presentation.mjs. ${reason instanceof Error ? reason.message : String(reason)}`);
  }
  const html = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}. Start Terminal 1 with npm run dev, then rerun node scripts/qa-activity-presentation.mjs`);
  return { html, status: response.status };
}

function chromeArgs(extraArgs, url) {
  return [
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-component-update",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    `--user-data-dir=${USER_DATA_DIR}`,
    `--window-size=${VIEWPORT}`,
    `--virtual-time-budget=${VIRTUAL_TIME_BUDGET}`,
    "--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost, EXCLUDE 127.0.0.1",
    ...extraArgs,
    url,
  ];
}

async function screenshot(url, filePath) {
  await runChromeWithHeadlessFallback(chromeArgs([`--screenshot=${filePath}`], url), `screenshot for ${url}`);
}

async function captureScreenshots() {
  const results = [];
  for (const page of pages) {
    try {
      console.log(`Capturing optional screenshot: ${page.url}`);
      await screenshot(page.url, path.join(OUT_DIR, page.screenshotFile));
      results.push({ page: page.label, file: page.screenshotFile, status: "pass", detail: "created" });
    } catch (reason) {
      results.push({
        page: page.label,
        file: page.screenshotFile,
        status: "fail",
        detail: reason instanceof Error ? reason.message : String(reason),
      });
      console.warn(`Optional screenshot failed for ${page.label}. ${results[results.length - 1].detail}`);
    }
  }
  return results;
}

async function runChromeWithHeadlessFallback(args, label) {
  let lastError = null;
  for (const headlessMode of HEADLESS_MODES) {
    try {
      console.log(`Running Chrome (${headlessMode}): ${label}`);
      return await runChrome([headlessMode, ...args], label);
    } catch (reason) {
      lastError = reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      if (headlessMode === "--headless=new") {
        console.warn(`Chrome failed or timed out with --headless=new; retrying with --headless. ${message}`);
        continue;
      }
      throw reason;
    }
  }
  throw lastError || new Error(`Chrome failed: ${label}`);
}

async function runChrome(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(CHROME, args, { detached: true, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      killChrome(child);
      reject(new Error(`Chrome timed out after ${CHROME_TIMEOUT_MS}ms while running ${label}.`));
    }, CHROME_TIMEOUT_MS);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (reason) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(reason);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`Chrome exited with code ${code}.\n${stderr.trim()}`));
    });
  });
}

function killChrome(child) {
  try {
    if (child.pid) process.kill(-child.pid, "SIGKILL");
  } catch {
    try {
      child.kill("SIGKILL");
    } catch {
      // Best-effort cleanup only.
    }
  }
}

function buildAssertions(captures) {
  const day = captures.day;
  const session = captures.session;
  const results = [];

  add(results, "Day page returned HTTP 200", day.status === 200, `HTTP ${day.status}`);
  add(results, "Session page returned HTTP 200", session.status === 200, `HTTP ${session.status}`);
  add(results, "Day page returned HTML", day.html.includes("<html"), excerpt(day.text));
  add(results, "Session page returned HTML", session.html.includes("<html"), excerpt(session.text));
  addOptionalMatch(results, "Day and Session hero titles match when present in static HTML", day.hero.title, session.hero.title);
  addOptionalMatch(results, "Day and Session eyebrow/context match when present in static HTML", day.hero.eyebrow, session.hero.eyebrow);

  for (const page of [day, session]) {
    for (const value of forbiddenVisibleStrings) {
      add(results, `${page.label} omits forbidden string: ${value}`, !page.text.includes(value), value);
    }
    addOptionalPresence(results, `${page.label} includes Speed Stack in static HTML`, page.text, /Speed Stack/i);
    addOptionalPresence(results, `${page.label} includes Shooting in static HTML`, page.text, /Shooting/i);
    addOptionalPresence(results, `${page.label} includes Conditioning in static HTML`, page.text, /Conditioning|bike|treadmill/i);
  }

  addOptionalPresence(results, "Session reports current step in static HTML", session.text, /Speed Stack C|Step 3|3 of 8|3\/8/i);
  addOptionalPresence(results, "Session remaining-time text is present in static HTML", session.text, /About \d+ min remaining|Planned time shown per step/i);
  add(results, "Session remaining-time is not legacy low estimate", !/About (8|9|10|11|12|13|14|15|16|17|18|19) min remaining/i.test(session.text), extractMatchingText(session.text, /(.{0,40}About \d+ min remaining.{0,40})/i));

  const sessionSpeedStackCard = extractCardText(session.html, "Speed Stack C");
  add(results, "Speed Stack card avoids generic readiness/recovery copy", !/Mobility, hydration, nutrition, sleep|dryland bends around sport load/i.test(sessionSpeedStackCard), excerpt(sessionSpeedStackCard));
  add(results, "Speed Stack card avoids duplicate generic subtitle/purpose", countOccurrences(sessionSpeedStackCard, "Speed Stack") <= 2, `Speed Stack count: ${countOccurrences(sessionSpeedStackCard, "Speed Stack")}`);

  return results;
}

function add(results, name, pass, detail) {
  results.push({ name, status: pass ? "pass" : "fail", detail: detail || "" });
}

function addSkip(results, name, detail) {
  results.push({ name, status: "skip", detail: detail || "" });
}

function addOptionalMatch(results, name, first, second) {
  if (!first || !second) {
    addSkip(results, name, `${first || "missing"} / ${second || "missing"}`);
    return;
  }
  add(results, name, first === second, `${first} / ${second}`);
}

function addOptionalPresence(results, name, text, pattern) {
  const match = text.match(pattern);
  if (!match) {
    addSkip(results, name, "not present in static HTML");
    return;
  }
  add(results, name, true, match[0]);
}

function extractHero(html) {
  const match = html.match(/<p[^>]*class="[^"]*\blabel\b[^"]*\btext-lime\b[^"]*"[^>]*>([\s\S]*?)<\/p>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return {
    eyebrow: match ? htmlToText(match[1]) : "",
    title: match ? htmlToText(match[2]) : "",
  };
}

function extractCardText(html, title) {
  const titleIndex = html.indexOf(title);
  if (titleIndex < 0) return "";
  const start = Math.max(0, html.lastIndexOf("<article", titleIndex));
  const end = html.indexOf("</article>", titleIndex);
  return htmlToText(html.slice(start, end > titleIndex ? end + "</article>".length : titleIndex + 2000));
}

function htmlToText(html) {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractMatchingText(text, pattern) {
  return text.match(pattern)?.[1]?.trim() || "not found";
}

function countOccurrences(text, value) {
  return (text.match(new RegExp(escapeRegExp(value), "gi")) || []).length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function excerpt(text) {
  return text.slice(0, 160);
}

async function writeReport(captures, results, screenshotResults) {
  const failed = results.filter((result) => result.status === "fail");
  const skipped = results.filter((result) => result.status === "skip");
  const screenshotFailures = screenshotResults.filter((result) => result.status === "fail");
  const lines = [
    "# Activity Presentation QA",
    "",
    "## Summary",
    "",
    failed.length ? `Failed: ${failed.length} HTTP/text assertion(s).` : "Passed: all required HTTP/text assertions.",
    "",
    "## Tooling Used",
    "",
    "- HTTP/text: Node built-in fetch",
    `- Optional screenshots: ${CHROME}`,
    `- Base URL: ${BASE_URL}`,
    "- Mode: Node HTTP checks plus optional installed Chrome screenshots; no Playwright/Puppeteer/Cypress; no browser downloads",
    "- Safety: Chrome screenshot step uses a temporary profile; external host resolution blocked while localhost remains available",
    "",
    "## Pages Checked",
    "",
    `- Day: ${captures.day.url}`,
    `- Session: ${captures.session.url}`,
    "",
    "## Extracted Hero Context",
    "",
    `- Day eyebrow: ${captures.day.hero.eyebrow || "not found"}`,
    `- Day title: ${captures.day.hero.title || "not found"}`,
    `- Session eyebrow: ${captures.session.hero.eyebrow || "not found"}`,
    `- Session title: ${captures.session.hero.title || "not found"}`,
    "",
    "## Remaining-Time Text",
    "",
    `- ${extractMatchingText(captures.session.text, /(.{0,40}(About \d+ min remaining|Planned time shown per step).{0,40})/i)}`,
    "",
    "## Assertions",
    "",
    ...results.map((result) => `- ${result.status.toUpperCase()} - ${result.name}${result.detail ? ` (${result.detail})` : ""}`),
    "",
    "## Assertions Skipped Because Not Present In Static HTML",
    "",
    ...(skipped.length ? skipped.map((result) => `- ${result.name}${result.detail ? ` (${result.detail})` : ""}`) : ["- None"]),
    "",
    "## Screenshots",
    "",
    ...screenshotResults.map((result) => `- ${result.status === "pass" ? "CREATED" : "FAILED"} - \`${result.file}\` (${result.detail})`),
    "",
    "## Optional Screenshot Failures",
    "",
    ...(screenshotFailures.length ? screenshotFailures.map((result) => `- ${result.page}: ${result.detail}`) : ["- None"]),
    "",
    "## DOM Captures",
    "",
    "- `day-2026-06-19.html`",
    "- `session-2026-06-19.html`",
    "",
    "## Remaining Risks",
    "",
    "- Static HTML can miss client-only text that appears after hydration.",
    "- This harness does not click, save, log, or verify completed session persistence.",
    "- Screenshot capture is optional and non-blocking because Chrome headless is unreliable on this machine.",
    "- Human review should inspect screenshots if they are created.",
    "",
    "## Next Recommendation",
    "",
    "Use the HTTP/text report as the reliable local gate. Treat screenshots as useful evidence only when Chrome creates them.",
    "",
  ];
  await writeFile(path.join(OUT_DIR, "report.md"), `${lines.join("\n")}\n`);
}

async function writeFailureReport(message) {
  await mkdir(OUT_DIR, { recursive: true });
  const lines = [
    "# Activity Presentation QA",
    "",
    "## Summary",
    "",
    "Failed before the full evidence pack could be generated.",
    "",
    "## Failure",
    "",
    message,
    "",
    "## Tooling Used",
    "",
    "- HTTP/text: Node built-in fetch",
    `- Optional screenshots: ${CHROME}`,
    `- Base URL: ${BASE_URL}`,
    `- HTTP timeout: ${HTTP_TIMEOUT_MS}ms per page`,
    `- Chrome timeout: ${CHROME_TIMEOUT_MS}ms per invocation`,
    "- Mode: Node HTTP checks plus optional installed Chrome screenshots; no Playwright/Puppeteer/Cypress; no browser downloads",
    "",
    "## Next Step",
    "",
    message.includes("Start Terminal 1")
      ? "Start Terminal 1 with `npm run dev`, then rerun `node scripts/qa-activity-presentation.mjs`."
      : "Review the Chrome failure above, then rerun `node scripts/qa-activity-presentation.mjs`.",
    "",
  ];
  await writeFile(path.join(OUT_DIR, "report.md"), `${lines.join("\n")}\n`);
}
