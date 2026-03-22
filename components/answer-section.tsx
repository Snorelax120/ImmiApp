"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AnswerCard } from "@/components/answer-card";
import type { Answer, Profile } from "@/lib/types";

type AnswersPayload = {
  answers: Answer[];
  currentUser: Profile | null;
  error?: string;
};

export function AnswerSection({ questionId }: { questionId: string }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingAnswerId, setVotingAnswerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAnswers = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as AnswersPayload;

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load answers.");
      }

      setAnswers(payload.answers);
      setCurrentUser(payload.currentUser);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load answers.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    void loadAnswers();
  }, [loadAnswers]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: draft }),
      });

      const payload = (await response.json()) as AnswersPayload;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to post answer.");
      }

      setAnswers(payload.answers);
      setCurrentUser(payload.currentUser);
      setDraft("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to post answer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleVote(answerId: string) {
    setVotingAnswerId(answerId);
    setError(null);

    try {
      const response = await fetch(`/api/answers/${answerId}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId }),
      });

      const payload = (await response.json()) as {
        upvoted?: boolean;
        upvoteCount?: number;
        error?: string;
      };

      if (!response.ok || payload.upvoted === undefined) {
        throw new Error(payload.error || "Unable to update vote.");
      }

      setAnswers((existingAnswers) =>
        existingAnswers.map((answer) =>
          answer.id === answerId
            ? {
                ...answer,
                viewerHasVoted: payload.upvoted,
                upvoteCount: payload.upvoteCount || 0,
              }
            : answer,
        ),
      );
    } catch (voteError) {
      setError(
        voteError instanceof Error ? voteError.message : "Unable to update vote.",
      );
    } finally {
      setVotingAnswerId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Answers</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Post as the current demo user. Consultants automatically appear as
            expert answers.
          </p>
        </div>
        <Link
          href={`/consultants?questionId=${questionId}`}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
        >
          Browse consultants
        </Link>
      </div>

      {currentUser ? (
        <p className="mt-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
          Posting as <span className="font-medium">{currentUser.displayName}</span>{" "}
          ({currentUser.role})
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Share guidance, context, or an expert recommendation."
          className="min-h-32 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 inline-flex rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-black"
        >
          {isSubmitting ? "Posting..." : "Post answer"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading answers...</p>
        ) : answers.length ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              onToggleVote={() => handleToggleVote(answer.id)}
              isVoting={votingAnswerId === answer.id}
            />
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600">
            No answers yet. Post the first one as a client or consultant persona.
          </p>
        )}
      </div>
    </section>
  );
}
