import { NextResponse } from "next/server";

import { processApplierConversation } from "@/lib/applier-chat";
import type {
  ApplierChatMessage,
  ApplierSessionState,
} from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: ApplierChatMessage[];
      session?: ApplierSessionState;
    };

    if (!body.messages?.length || !body.session) {
      return NextResponse.json(
        { error: "messages and session are required." },
        { status: 400 },
      );
    }

    const result = await processApplierConversation({
      messages: body.messages,
      session: body.session,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process Applier chat.",
      },
      { status: 400 },
    );
  }
}
