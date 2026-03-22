import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import { toggleAnswerVoteInDemo } from "@/lib/demo-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentDemoUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Choose a demo user before voting." },
        { status: 400 },
      );
    }

    const { id } = await params;
    const body = (await request.json()) as { questionId?: string };
    const result = toggleAnswerVoteInDemo(id, currentUser.id);

    if (body.questionId) {
      revalidatePath(`/questions/${body.questionId}`);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update vote.",
      },
      { status: 400 },
    );
  }
}
