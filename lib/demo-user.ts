import { cookies } from "next/headers";

import { defaultDemoUserId } from "@/lib/mock-data";
import { getProfileById, listProfiles } from "@/lib/demo-store";

export const demoUserCookieName = "demo-user-id";

export function listDemoUsers() {
  return listProfiles();
}

export async function getCurrentDemoUser() {
  const cookieStore = await cookies();
  const demoUserId = cookieStore.get(demoUserCookieName)?.value || defaultDemoUserId;

  return (
    getProfileById(demoUserId) ||
    getProfileById(defaultDemoUserId) ||
    listProfiles()[0] ||
    null
  );
}
