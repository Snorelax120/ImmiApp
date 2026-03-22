import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import { getSessionWithMessages } from "@/lib/demo-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const currentUser = await getCurrentDemoUser();
  const data = getSessionWithMessages(id);

  if (!data) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  if (
    currentUser &&
    currentUser.id !== data.session.clientId &&
    currentUser.id !== data.session.consultantId
  ) {
    return NextResponse.json(
      { error: "Switch to a participant in this demo consultation." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ...data,
    currentUser,
  });
}
