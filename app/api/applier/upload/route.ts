import { NextResponse } from "next/server";

import { extractMockDataFromFiles } from "@/lib/mock-document-extractor";
import type { ApplierApplicationId } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const applicationId = formData.get("applicationId") as
      | ApplierApplicationId
      | null;
    const fileEntries = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (!fileEntries.length) {
      return NextResponse.json(
        { error: "At least one file is required." },
        { status: 400 },
      );
    }

    const result = extractMockDataFromFiles(fileEntries, applicationId || undefined);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process uploaded files.",
      },
      { status: 400 },
    );
  }
}
