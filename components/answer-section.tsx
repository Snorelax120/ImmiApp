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
    <section className="rounded-[16px] bg-white p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#101328]">
            Add Your Insight
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#6d7288]">
            Post as the current demo user. Consultants automatically appear as
            expert answers.
          </p>
        </div>
        <Link
          href={`/consultants?questionId=${questionId}`}
          className="rounded-md bg-[#ece9e1] px-4 py-2.5 text-sm font-medium text-[#20243c] transition hover:bg-[#e1ddd3]"
        >
          Browse consultants
        </Link>
      </div>

      {currentUser ? (
        <p className="mt-4 rounded-[12px] bg-[#f7f4ef] px-4 py-3 text-sm text-[#6d7288]">
          Posting as <span className="font-medium">{currentUser.displayName}</span>{" "}
          ({currentUser.role})
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Share guidance, context, or an expert recommendation."
          className="min-h-36 w-full rounded-[12px] border border-[rgba(16,19,40,0.12)] px-5 py-4 text-sm leading-7 outline-none transition focus:border-[#081b4b] focus:shadow-[0_0_0_4px_rgba(8,27,75,0.08)]"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex rounded-md bg-[#081b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0d276a] disabled:cursor-not-allowed disabled:bg-[#4a5a85]"
        >
          {isSubmitting ? "Posting..." : "Post answer"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-[22px] bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
          {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-[#8a90a7]">Loading answers...</p>
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
          <p className="rounded-[12px] bg-[#f7f4ef] px-4 py-6 text-sm text-[#6d7288]">
            No answers yet. Post the first one as a client or consultant persona.
          </p>
        )}
      </div>
    </section>
  );
}
