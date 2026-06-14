import { DataMode } from "@/lib/storage/completedSessionRepository";

export function DataStatus({ mode, warning }: { mode: DataMode; warning?: string }) {
  return (
    <div className={`mb-5 rounded-2xl border p-4 text-sm font-semibold ${mode === "cloud" ? "border-green-300 bg-green-50 text-green-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
      <p className="font-black">{mode === "cloud" ? "Cloud Synced" : "Local Backup Mode"}</p>
      <p className="mt-1">{mode === "cloud" ? "Completed training history is loaded from Supabase." : warning || "Local data can be lost if browser data is cleared."}</p>
    </div>
  );
}
