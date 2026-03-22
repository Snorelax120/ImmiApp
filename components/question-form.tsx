"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { QuestionTier } from "@/lib/types";

export function QuestionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tier, setTier] = useState<QuestionTier>("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, tier }),
      });

      const payload = (await response.json()) as {
        question?: { id: string };
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.question) {
        throw new Error(payload.error || "Unable to create your question.");
      }

      if (payload.checkoutUrl) {
        window.location.assign(payload.checkoutUrl);
        return;
      }

      router.push(`/questions/${payload.question.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while submitting your question.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="text-sm font-medium text-black" htmlFor="title">
          Question title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you want to ask about immigration?"
          className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none ring-0 transition focus:border-zinc-800"
          required
        />
      </div>

      <div className="mt-5">
        <label className="text-sm font-medium text-black" htmlFor="body">
          Details
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add context, immigration history, and any key constraints."
          className="mt-2 min-h-40 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none ring-0 transition focus:border-zinc-800"
          required
        />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-black">Tier</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="rounded-2xl border border-zinc-300 p-4">
            <input
              type="radio"
              name="tier"
              checked={tier === "free"}
              onChange={() => setTier("free")}
              className="mr-2"
            />
            <span className="font-medium text-zinc-900">Free</span>
            <p className="mt-1 text-sm text-black">
              Public post with complexity classification.
            </p>
          </label>

          <label className="rounded-2xl border border-zinc-300 p-4">
            <input
              type="radio"
              name="tier"
              checked={tier === "paid"}
              onChange={() => setTier("paid")}
              className="mr-2"
            />
            <span className="font-medium text-zinc-900">$5 paid</span>
            <p className="mt-1 text-sm text-black">
              Simulates checkout for the demo and generates an AI-style answer instantly.
            </p>
          </label>
        </div>
      </fieldset>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-black"
      >
        {isSubmitting ? "Submitting..." : "Submit question"}
      </button>
    </form>
  );
}
