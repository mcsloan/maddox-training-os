import { execFileSync } from "node:child_process";
import fs from "node:fs";
import process from "node:process";

console.log("Agentic Workflow Preflight");
console.log("\nGit status:");
console.log(run("git", ["status", "--short"]) || "clean");

console.log("\nEnvironment:");
console.log(run("node", ["scripts/env-whoami.mjs"]) || "env-whoami unavailable");

console.log("\nPackage scripts:");
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  for (const name of Object.keys(packageJson.scripts || {}).sort()) {
    console.log(`- ${name}: ${packageJson.scripts[name]}`);
  }
} catch (error) {
  console.log(`Unable to read package.json: ${error.message}`);
}

console.log("\nPreflight is read-only. Build/test commands were not run.");

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return error.stderr?.toString().trim() || error.message;
  }
}
