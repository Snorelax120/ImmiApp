"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StartSessionButton({
  consultantId,
  questionId,
  label = "Start Private Session",
  className,
}: {
  consultantId: string;
  questionId?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsStarting(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consultantId, questionId }),
      });

      const payload = (await response.json()) as {
        session?: { id: string };
        error?: string;
      };

      if (!response.ok || !payload.session) {
        throw new Error(payload.error || "Unable to start the consultation.");
      }

      router.push(`/sessions/${payload.session.id}`);
      router.refresh();
    } catch (sessionError) {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "Unable to start the consultation.",
      );
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isStarting}
        className={
          className ||
          "inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-black"
        }
      >
        {isStarting ? "Starting..." : label}
      </button>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
