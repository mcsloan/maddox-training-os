#!/usr/bin/env node

const url = process.argv[2] || "http://localhost:3000/api/kpi-export";
const response = await fetch(url);
const text = await response.text();

try {
  const json = JSON.parse(text);
  console.log(JSON.stringify(json, null, 2));
} catch {
  console.log(text);
}

if (!response.ok) {
  process.exitCode = 1;
}
