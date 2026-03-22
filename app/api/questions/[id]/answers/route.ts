import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  createAnswerInDemo,
  listAnswersForQuestion,
} from "@/lib/demo-store";
import { getCurrentDemoUser } from "@/lib/demo-user";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const currentUser = await getCurrentDemoUser();

  return NextResponse.json({
    answers: listAnswersForQuestion(id, currentUser?.id),
    currentUser,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentDemoUser();
    const body = (await request.json()) as { body?: string };

    if (!currentUser) {
      return NextResponse.json(
        { error: "Choose a demo user before posting an answer." },
        { status: 400 },
      );
    }

    if (!body.body?.trim()) {
      return NextResponse.json(
        { error: "Answer text is required." },
        { status: 400 },
      );
    }

    createAnswerInDemo({
      questionId: id,
      body: body.body,
      userId: currentUser.id,
    });

    revalidatePath(`/questions/${id}`);
    revalidatePath(`/consultants/${currentUser.id}`);

    return NextResponse.json({
      answers: listAnswersForQuestion(id, currentUser.id),
      currentUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to post answer.",
      },
      { status: 400 },
    );
  }
}
