import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { runClassification } from "@/lib/questions";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { questionId?: string };

    if (!body.questionId) {
      return NextResponse.json(
        { error: "questionId is required." },
        { status: 400 },
      );
    }

    const complexity = await runClassification(body.questionId);

    revalidatePath("/");
    revalidatePath(`/questions/${body.questionId}`);

    return NextResponse.json({ complexity });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to classify question complexity.",
      },
      { status: 500 },
    );
  }
}
