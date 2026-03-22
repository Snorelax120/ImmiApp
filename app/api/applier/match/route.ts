import { NextResponse } from "next/server";

import { matchIrccApplication } from "@/lib/applier";
import type { ApplierApplicationId } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      applicationId?: ApplierApplicationId;
      userGoal?: string;
    };

    const match = matchIrccApplication({
      applicationId: body.applicationId,
      userGoal: body.userGoal,
    });

    return NextResponse.json({ match });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to match an IRCC package.",
      },
      { status: 400 },
    );
  }
}
