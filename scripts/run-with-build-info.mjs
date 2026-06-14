import { execFileSync, spawn } from "node:child_process";

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Usage: node scripts/run-with-build-info.mjs <command> [...args]");
  process.exit(1);
}

let localCommit = "local";
try {
  localCommit = execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim() || "local";
} catch {
  // Builds without Git metadata retain the explicit local fallback.
}

const child = spawn(command, args, {
  env: { ...process.env, NEXT_PUBLIC_LOCAL_GIT_COMMIT_SHA: localCommit },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
