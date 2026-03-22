import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { runAiAnswer } from "@/lib/questions";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { questionId?: string };

    if (!body.questionId) {
      return NextResponse.json(
        { error: "questionId is required." },
        { status: 400 },
      );
    }

    const aiAnswer = await runAiAnswer(body.questionId);

    revalidatePath("/");
    revalidatePath(`/questions/${body.questionId}`);

    return NextResponse.json({ aiAnswer });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate AI answer.",
      },
      { status: 500 },
    );
  }
}
