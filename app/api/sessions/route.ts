import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import { createSessionInDemo, listSessionsForUser } from "@/lib/demo-store";

export async function GET() {
  const currentUser = await getCurrentDemoUser();

  if (!currentUser) {
    return NextResponse.json({ sessions: [] });
  }

  return NextResponse.json({ sessions: listSessionsForUser(currentUser.id) });
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentDemoUser();
    const body = (await request.json()) as {
      consultantId?: string;
      questionId?: string | null;
    };

    if (!currentUser) {
      return NextResponse.json(
        { error: "Choose a demo user before starting a session." },
        { status: 400 },
      );
    }

    if (currentUser.role !== "client") {
      return NextResponse.json(
        { error: "Switch to a client persona to start a consultation." },
        { status: 400 },
      );
    }

    if (!body.consultantId) {
      return NextResponse.json(
        { error: "consultantId is required." },
        { status: 400 },
      );
    }

    const session = createSessionInDemo({
      clientId: currentUser.id,
      consultantId: body.consultantId,
      questionId: body.questionId || null,
    });

    revalidatePath(`/sessions/${session.id}`);
    revalidatePath("/consultants");

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create session.",
      },
      { status: 400 },
    );
  }
}
