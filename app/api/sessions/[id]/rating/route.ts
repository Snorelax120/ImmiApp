import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import { rateSessionInDemo } from "@/lib/demo-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentDemoUser();
    const { id } = await params;
    const body = (await request.json()) as { score?: number; comment?: string };

    if (!currentUser) {
      return NextResponse.json(
        { error: "Choose a demo user before submitting a rating." },
        { status: 400 },
      );
    }

    if (!body.score || body.score < 1 || body.score > 5) {
      return NextResponse.json(
        { error: "Score must be between 1 and 5." },
        { status: 400 },
      );
    }

    const rating = rateSessionInDemo({
      sessionId: id,
      clientId: currentUser.id,
      score: body.score,
      comment: body.comment,
    });

    revalidatePath(`/sessions/${id}`);

    return NextResponse.json({ rating });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to submit rating.",
      },
      { status: 400 },
    );
  }
}
