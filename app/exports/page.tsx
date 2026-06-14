import { ExportButtons } from "@/components/ExportButtons";

export default function ExportsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6"><p className="label">Parent tools</p><h1 className="text-4xl font-black">Export Center</h1><p className="mt-2 text-slate-500">Phase 1 buttons show a clear placeholder. Real file generation is planned next.</p></div>
      <ExportButtons />
    </div>
  );
}
