const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || "unknown";

let supabaseRef = "unconfigured";
if (rawUrl) {
  try {
    const host = new URL(rawUrl).hostname;
    supabaseRef = host.split(".")[0] || "unknown";
  } catch {
    supabaseRef = "invalid-url";
  }
}

console.log(`[ENV_PROOF] vercel_env=${vercelEnv} supabase_ref=${supabaseRef}`);

if (vercelEnv === "preview" && supabaseRef !== "npuankmkxbjtlokbpczz") {
  console.error(`[ENV_PROOF] FAIL expected_preview_ref=npuankmkxbjtlokbpczz actual=${supabaseRef}`);
  process.exit(1);
}
