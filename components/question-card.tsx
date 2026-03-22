import Link from "next/link";

import type { Question } from "@/lib/types";

function formatBadgeLabel(question: Question) {
  return question.tier === "paid" ? "$5 Paid" : "Free";
}

export function QuestionCard({ question }: { question: Question }) {
  return (
    <Link
      href={`/questions/${question.id}`}
      className="group block rounded-[8px] bg-white p-5 shadow-[0_10px_28px_rgba(16,19,40,0.05)] transition hover:-translate-y-0.5"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`rounded-[4px] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
            question.tier === "paid"
              ? "bg-[#081b4b] text-white"
              : "bg-[#ece9e1] text-[#6d7288]"
          }`}
        >
          {formatBadgeLabel(question)}
        </span>
        {question.complexity ? (
          <span
            className={`rounded-full px-3 py-1 font-medium ${
              question.complexity === "complex"
                ? "bg-[#f3e1d4] text-[#8a5a13]"
                : "bg-[#eceff6] text-[#41527f]"
            }`}
          >
            {question.complexity}
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#101328] transition group-hover:text-[#081b4b]">
        {question.title}
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#6d7288]">
        {question.body}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a90a7]">
          Asked {new Date(question.createdAt).toLocaleDateString()}
        </p>
        <span className="text-sm font-medium text-[#081b4b]">
          Read more
        </span>
      </div>
    </Link>
  );
}
