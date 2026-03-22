import { NextResponse } from "next/server";

import { getConsultantProfileData } from "@/lib/demo-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = getConsultantProfileData(id);

  if (!data) {
    return NextResponse.json({ error: "Consultant not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}
