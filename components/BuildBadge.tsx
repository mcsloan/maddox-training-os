import packageJson from "@/package.json";

export function BuildBadge() {
  const commit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local";
  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV || "local";

  return (
    <span
      className="whitespace-nowrap rounded-full border border-rink bg-ice px-2 py-1 text-[10px] font-semibold text-slate-500"
      title={`Maddox Training OS v${packageJson.version} · ${commit} · ${environment}`}
    >
      v{packageJson.version} · {commit} · {environment}
    </span>
  );
}
