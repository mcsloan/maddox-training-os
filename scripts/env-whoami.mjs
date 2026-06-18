import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const envFile = process.env.AGENT_ENV_FILE || ".env.local";
const env = { ...process.env, ...readEnvFile(envFile) };
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || "";
const host = hostFromUrl(supabaseUrl);
const classification = classifyTarget(host, envFile, env);

console.log("Agent Environment Whoami");
console.log(`git branch: ${git(["branch", "--show-current"]) || "unknown"}`);
console.log(`working tree: ${gitStatus() || "clean"}`);
console.log(`detected env file: ${envFile}${fs.existsSync(path.join(process.cwd(), envFile)) ? "" : " (not found)"}`);
console.log(`supabase host: ${host || "not configured"}`);
console.log(`classification: ${classification}`);

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function gitStatus() {
  const status = git(["status", "--short"]);
  return status ? status.replace(/\n/g, "; ") : "";
}

function readEnvFile(relativePath) {
  const filePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(filePath)) return {};
  const result = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    if (process.env[key]) continue;
    result[key] = unquote(trimmed.slice(index + 1).trim());
  }
  return result;
}

function hostFromUrl(value) {
  if (!value) return "";
  try {
    return new URL(value).host;
  } catch {
    return "invalid-url";
  }
}

function classifyTarget(host, file, env) {
  const joined = `${host} ${file} ${env.VERCEL_ENV || ""}`.toLowerCase();
  if (joined.includes("npuankmkxbjtlokbpczz") || joined.includes("staging") || joined.includes("preview")) return "staging";
  if (joined.includes("production")) return "production";
  return "unknown";
}

function unquote(value) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  return value;
}
