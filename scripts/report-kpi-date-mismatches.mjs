#!/usr/bin/env node

const sourceUrl = process.argv[2] || "http://localhost:3000/api/kpi-export";
const timeZone = process.env.KPI_EXPORT_TIME_ZONE || "America/Toronto";

function dateStringForTimeZone(value, zone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const mapped = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${mapped.year}-${mapped.month}-${mapped.day}`;
}

const response = await fetch(sourceUrl);

if (!response.ok) {
  throw new Error(`Failed to read KPI export from ${sourceUrl}: ${response.status} ${response.statusText}`);
}

const exportData = await response.json();
const results = Array.isArray(exportData.results) ? exportData.results : [];
const mismatches = results
  .filter((result) => result?.enteredAt && result?.date)
  .map((result) => ({
    ...result,
    localEnteredAtDate: dateStringForTimeZone(new Date(result.enteredAt), timeZone),
  }))
  .filter((result) => result.date !== result.localEnteredAtDate);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: sourceUrl,
  timeZone,
  count: mismatches.length,
  mismatches: mismatches.map((result) => ({
    id: result.id,
    kpiId: result.kpiId,
    savedDate: result.date,
    localEnteredAtDate: result.localEnteredAtDate,
    enteredAt: result.enteredAt,
    bestResult: result.bestResult,
  })),
}, null, 2));
