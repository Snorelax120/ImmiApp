"use client";

import { useState } from "react";

export function RatingForm({
  sessionId,
  onSubmitted,
}: {
  sessionId: string;
  onSubmitted: () => Promise<void> | void;
}) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, comment }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit rating.");
      }

      await onSubmitted();
      setComment("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit rating.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 p-4">
      <h3 className="text-base font-semibold text-zinc-950">
        Rate this consultation
      </h3>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setScore(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              score === value
                ? "border border-zinc-300 bg-zinc-100 text-black"
                : "border border-zinc-300 bg-white text-black"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Optional feedback for the consultant."
        className="mt-4 min-h-24 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
      />

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-black"
      >
        {isSubmitting ? "Submitting..." : "Submit rating"}
      </button>
    </form>
  );
}
