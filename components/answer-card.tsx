import type { Answer } from "@/lib/types";

export function AnswerCard({
  answer,
  onToggleVote,
  isVoting,
}: {
  answer: Answer;
  onToggleVote: () => void;
  isVoting: boolean;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            {answer.author?.displayName || "Community member"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {answer.type === "expert" ? "Expert answer" : "Community answer"} ·{" "}
            {new Date(answer.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            answer.type === "expert"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-zinc-100 text-zinc-700"
          }`}
        >
          {answer.type}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
        {answer.body}
      </p>

      <button
        type="button"
        onClick={onToggleVote}
        disabled={isVoting}
        className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-medium transition ${
          answer.viewerHasVoted
            ? "border border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200"
            : "border border-zinc-300 bg-white text-black hover:bg-zinc-100"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {answer.viewerHasVoted ? "Upvoted" : "Upvote"} · {answer.upvoteCount}
      </button>
    </article>
  );
}
