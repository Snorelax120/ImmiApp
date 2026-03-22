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
    <label className="flex items-center gap-2 rounded-full border border-[rgba(16,19,40,0.1)] bg-white px-3 py-2 text-xs text-[#5f667f] shadow-[0_4px_12px_rgba(16,19,40,0.04)]">
      <span className="font-medium uppercase tracking-[0.14em] text-[#7982a0]">
        Demo user
      </span>
      <select
        value={selectedUserId}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isSaving}
        className="rounded-full bg-transparent pr-1 text-xs font-medium text-[#081b4b] outline-none"
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
