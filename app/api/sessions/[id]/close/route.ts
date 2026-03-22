import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import { closeSessionInDemo, getSessionWithMessages } from "@/lib/demo-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentDemoUser();
    const { id } = await params;

    if (!currentUser || currentUser.role !== "consultant") {
      return NextResponse.json(
        { error: "Switch to a consultant persona to close the session." },
        { status: 400 },
      );
    }

    const existingSession = getSessionWithMessages(id)?.session;

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    if (existingSession.consultantId !== currentUser.id) {
      return NextResponse.json(
        { error: "Only the assigned consultant can close this session." },
        { status: 400 },
      );
    }

    const session = closeSessionInDemo(id);

    revalidatePath(`/sessions/${id}`);
    revalidatePath(`/consultants/${session.consultantId}`);

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to close session.",
      },
      { status: 400 },
    );
  }
}
