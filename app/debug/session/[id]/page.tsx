import { SessionDebugClient } from "@/components/SessionDebugClient";

export default async function DebugSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SessionDebugClient routeId={id} />;
}
