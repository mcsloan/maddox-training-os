import { execFileSync } from "node:child_process";

const git = (args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
const branch = git(["branch", "--show-current"]) || "unknown";
const status = git(["status", "--short"]);
const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
const counts = upstream ? git(["rev-list", "--left-right", "--count", `${upstream}...HEAD`]).split(/\s+/) : [];

console.log("Checkpoint Status");
console.log(`branch: ${branch}`);
console.log(`branch class: ${branch === "main" ? "main (Production release branch)" : branch.startsWith("work/") ? "work branch" : "other"}`);
console.log(`commit: ${git(["rev-parse", "--short", "HEAD"]) || "unknown"}`);
console.log(`working tree: ${status ? "dirty" : "clean"}`);
console.log(`upstream: ${upstream || "not configured"}`);
console.log(`behind/ahead: ${counts.length === 2 ? `${counts[0]}/${counts[1]}` : "unknown"}`);
console.log("");
try {
  console.log(execFileSync(process.execPath, ["scripts/env-whoami.mjs"], { encoding: "utf8" }).trim());
} catch {
  console.log("environment classification unavailable");
}
