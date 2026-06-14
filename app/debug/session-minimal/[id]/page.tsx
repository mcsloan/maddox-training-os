import { SessionMinimalDiagnostic } from "@/components/SessionMinimalDiagnostic";

export default async function SessionMinimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-4xl"><SessionMinimalDiagnostic routeId={id} /></div>;
}
