import { SessionRoom } from "@/components/session-room";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl">
      <SessionRoom sessionId={id} />
    </div>
  );
}
