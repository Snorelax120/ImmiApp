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
      className="grid gap-6 rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)] sm:grid-cols-[minmax(0,1fr)_280px] sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a90a7]"
            htmlFor="title"
          >
            Subject of inquiry
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Express Entry work experience verification"
            className="mt-3 w-full rounded-[8px] border border-[rgba(16,19,40,0.08)] bg-[#fbfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#081b4b] focus:shadow-[0_0_0_4px_rgba(8,27,75,0.08)]"
            required
          />
        </div>

        <div>
          <label
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a90a7]"
            htmlFor="body"
          >
            Detailed context
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Please provide specific details about your situation..."
            className="mt-3 min-h-44 w-full rounded-[8px] border border-[rgba(16,19,40,0.08)] bg-[#fbfaf7] px-4 py-4 text-sm leading-7 outline-none transition focus:border-[#081b4b] focus:shadow-[0_0_0_4px_rgba(8,27,75,0.08)]"
            required
          />
        </div>

        <p className="flex items-start gap-2 rounded-[8px] bg-[#f7f4ef] px-4 py-3 text-xs leading-6 text-[#7d5d45]">
          <span className="font-semibold text-[#b03b2d]">!</span>
          Ensure sensitive personal IDs are not visible in your text description.
          Keep it descriptive yet safe.
        </p>

        {error ? (
          <p className="rounded-[8px] bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <fieldset>
          <legend className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a90a7]">
            Service tier
          </legend>
          <div className="mt-3 space-y-3">
            <label
              className={`block rounded-[10px] border p-4 transition ${
                tier === "free"
                  ? "border-[#d5c0b0] bg-white"
                  : "border-transparent bg-[#fbfaf7]"
              }`}
            >
              <input
                type="radio"
                name="tier"
                checked={tier === "free"}
                onChange={() => setTier("free")}
                className="sr-only"
              />
              <p className="text-sm font-semibold text-[#101328]">Free Question</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8a90a7]">
                Community outreach
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#6d7288]">
                <li>Public community feedback</li>
                <li>24-48h average wait</li>
              </ul>
            </label>

            <label
              className={`block rounded-[10px] border p-4 transition ${
                tier === "paid"
                  ? "border-[#081b4b] bg-[#081b4b] text-white"
                  : "border-transparent bg-[#f3e1d4]"
              }`}
            >
              <input
                type="radio"
                name="tier"
                checked={tier === "paid"}
                onChange={() => setTier("paid")}
                className="sr-only"
              />
              <p className="text-sm font-semibold">$5 Priority</p>
              <p
                className={`mt-1 text-xs uppercase tracking-[0.18em] ${
                  tier === "paid" ? "text-[#c8cee0]" : "text-[#6c5240]"
                }`}
              >
                Professional velocity
              </p>
              <ul
                className={`mt-3 space-y-2 text-sm ${
                  tier === "paid" ? "text-white" : "text-[#6c5240]"
                }`}
              >
                <li>Instant AI diagnostic answer</li>
                <li>Expert complexity check</li>
                <li>Pinned to expert feed top</li>
              </ul>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#081b4b] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0d276a] disabled:cursor-not-allowed disabled:bg-[#4a5a85]"
        >
          {isSubmitting ? "Submitting..." : "Submit My Question"}
        </button>

        <p className="text-center text-[11px] uppercase tracking-[0.16em] text-[#8a90a7]">
          Secure submission via Stripe. Privacy policy and terms apply.
        </p>
      </div>
    </form>
  );
}
