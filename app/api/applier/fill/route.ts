import { NextResponse } from "next/server";

import { generateApplierDraft } from "@/lib/applier";
import type {
  ApplierApplicationId,
  ApplierDocumentInput,
} from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      applicationId?: ApplierApplicationId;
      userGoal?: string;
      applicantInfo?: Record<string, string>;
      documentInputs?: ApplierDocumentInput[];
    };

    if (!body.applicationId) {
      return NextResponse.json(
        { error: "applicationId is required." },
        { status: 400 },
      );
    }

    const result = await generateApplierDraft({
      applicationId: body.applicationId,
      userGoal: body.userGoal,
      applicantInfo: body.applicantInfo || {},
      documentInputs: body.documentInputs || [],
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate applier drafts.",
      },
      { status: 400 },
    );
  }
}
