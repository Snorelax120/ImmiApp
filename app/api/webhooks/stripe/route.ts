import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { runPaidQuestionPipeline } from "@/lib/questions";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { questionId?: string };

    if (!body.questionId) {
      return NextResponse.json(
        { error: "questionId is required in demo mode." },
        { status: 400 },
      );
    }

    await runPaidQuestionPipeline(body.questionId);
    revalidatePath("/");
    revalidatePath(`/questions/${body.questionId}`);

    return NextResponse.json({
      received: true,
      demo: true,
      message: "Demo payment pipeline completed.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to run demo payment pipeline.",
      },
      { status: 400 },
    );
  }
}
