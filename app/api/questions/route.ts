import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentDemoUser } from "@/lib/demo-user";
import {
  createCheckoutSession,
  createQuestion,
  listQuestions,
  runClassification,
} from "@/lib/questions";
import type { QuestionTier } from "@/lib/types";

export async function GET() {
  try {
    const questions = await listQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load questions.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentDemoUser();
    const body = (await request.json()) as {
      title?: string;
      body?: string;
      tier?: QuestionTier;
    };

    const question = await createQuestion({
      title: body.title || "",
      body: body.body || "",
      tier: body.tier === "paid" ? "paid" : "free",
      userId: currentUser?.id,
    });

    revalidatePath("/");
    revalidatePath(`/questions/${question.id}`);

    if (question.tier === "free") {
      await runClassification(question.id);
      revalidatePath("/");
      revalidatePath(`/questions/${question.id}`);
      return NextResponse.json({ question });
    }

    const checkoutUrl = await createCheckoutSession(question.id);
    revalidatePath(`/questions/${question.id}`);

    return NextResponse.json({
      question,
      checkoutUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create question.",
      },
      { status: 400 },
    );
  }
}
