import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import {
  addSessionMessageInDemo,
  getSessionWithMessages,
} from "@/lib/demo-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentDemoUser();
    const { id } = await params;
    const body = (await request.json()) as { body?: string };

    if (!currentUser) {
      return NextResponse.json(
        { error: "Choose a demo user before sending a message." },
        { status: 400 },
      );
    }

    const sessionData = getSessionWithMessages(id);

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    if (
      currentUser.id !== sessionData.session.clientId &&
      currentUser.id !== sessionData.session.consultantId
    ) {
      return NextResponse.json(
        { error: "Switch to a participant in this consultation." },
        { status: 400 },
      );
    }

    if (!body.body?.trim()) {
      return NextResponse.json(
        { error: "Message text is required." },
        { status: 400 },
      );
    }

    addSessionMessageInDemo({
      sessionId: id,
      senderId: currentUser.id,
      body: body.body,
    });

    revalidatePath(`/sessions/${id}`);

    return NextResponse.json({
      ...getSessionWithMessages(id),
      currentUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send message.",
      },
      { status: 400 },
    );
  }
}
