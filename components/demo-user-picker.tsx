"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Profile } from "@/lib/types";

export function DemoUserPicker({
  currentUserId,
  users,
}: {
  currentUserId: string;
  users: Profile[];
}) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState(currentUserId);
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(nextUserId: string) {
    setSelectedUserId(nextUserId);
    setIsSaving(true);

    try {
      await fetch("/api/demo-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: nextUserId }),
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <label className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs text-black">
      <span className="font-medium text-black">Demo user</span>
      <select
        value={selectedUserId}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isSaving}
        className="rounded-full bg-white pr-1 text-xs font-medium text-black outline-none"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.displayName} ({user.role})
          </option>
        ))}
      </select>
    </label>
  );
}
