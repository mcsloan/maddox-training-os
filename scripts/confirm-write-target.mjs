import process from "node:process";

const args = parseArgs(process.argv.slice(2));
const target = args.target || process.env.WRITE_TARGET || "";
const action = args.action || process.env.WRITE_ACTION || "";
const confirmedProduction = Boolean(args["confirm-production"] || process.env.CONFIRM_PRODUCTION === "1");

console.log("Write Target Confirmation");
console.log(`target: ${target || "missing"}`);
console.log(`action: ${action || "missing"}`);

if (!target || !action) {
  console.error("Refusing: provide --target <staging|production> and --action \"...\".");
  process.exit(1);
}

if (!["staging", "production"].includes(target)) {
  console.error("Refusing: target must be staging or production.");
  process.exit(1);
}

if (target === "production" && !confirmedProduction) {
  console.error("Refusing production write without --confirm-production.");
  process.exit(1);
}

console.log(target === "production" ? "Confirmed production target." : "Confirmed staging target.");
console.log("No writes were performed by this script.");

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) parsed[key] = true;
    else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}
