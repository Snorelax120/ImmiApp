import { NextResponse } from "next/server";

import { getProfileById } from "@/lib/demo-store";
import { demoUserCookieName } from "@/lib/demo-user";

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string };

  if (!body.userId || !getProfileById(body.userId)) {
    return NextResponse.json({ error: "Invalid demo user." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(demoUserCookieName, body.userId, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
