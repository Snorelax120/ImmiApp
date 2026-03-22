import Link from "next/link";

import type { Question } from "@/lib/types";

function formatBadgeLabel(question: Question) {
  return question.tier === "paid" ? "$5 Paid" : "Free";
}

export function QuestionCard({ question }: { question: Question }) {
  return (
    <Link
      href={`/questions/${question.id}`}
      className="block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-800">
          {formatBadgeLabel(question)}
        </span>
        {question.complexity ? (
          <span
            className={`rounded-full px-3 py-1 font-medium ${
              question.complexity === "complex"
                ? "bg-amber-100 text-amber-900"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {question.complexity}
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 text-xl font-semibold text-zinc-900">
        {question.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
        {question.body}
      </p>
      <p className="mt-4 text-xs text-zinc-400">
        Asked {new Date(question.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
