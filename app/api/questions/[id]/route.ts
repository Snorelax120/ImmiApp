import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import { listAnswersForQuestion } from "@/lib/demo-store";
import { getQuestionById } from "@/lib/questions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentDemoUser();
    const question = await getQuestionById(id);

    if (!question) {
      return NextResponse.json(
        { error: "Question not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      question,
      answers: listAnswersForQuestion(id, currentUser?.id),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load question.",
      },
      { status: 500 },
    );
  }
}
