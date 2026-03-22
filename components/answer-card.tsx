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
    <article className="rounded-[16px] bg-[#fbfaf7] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#101328]">
            {answer.author?.displayName || "Community member"}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8a90a7]">
            {answer.type === "expert" ? "Expert answer" : "Community answer"} ·{" "}
            {new Date(answer.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            answer.type === "expert"
              ? "bg-[#eceff6] text-[#41527f]"
              : "bg-[#ece9e1] text-[#6d7288]"
          }`}
        >
          {answer.type}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#6d7288]">
        {answer.body}
      </p>

      <button
        type="button"
        onClick={onToggleVote}
        disabled={isVoting}
        className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-medium transition ${
          answer.viewerHasVoted
            ? "bg-[#081b4b] text-white hover:bg-[#0d276a]"
            : "bg-white text-[#081b4b] hover:bg-[#f1efe8]"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {answer.viewerHasVoted ? "Upvoted" : "Upvote"} · {answer.upvoteCount}
      </button>
    </article>
  );
}
