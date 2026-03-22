import { NextResponse } from "next/server";

import { getDemoStore, listConsultants } from "@/lib/demo-store";

export async function GET() {
  const store = getDemoStore();
  const consultants = listConsultants().map((consultant) => ({
    ...consultant,
    answeredCount: store.answers.filter(
      (answer) => answer.userId === consultant.id && answer.type === "expert",
    ).length,
  }));

  return NextResponse.json({ consultants });
}
