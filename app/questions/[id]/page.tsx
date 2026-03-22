import Link from "next/link";
import { notFound } from "next/navigation";

import { AiAnswer } from "@/components/ai-answer";
import { AnswerSection } from "@/components/answer-section";
import { ComplexityBanner } from "@/components/complexity-banner";
import { getQuestionById } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function QuestionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment } = await searchParams;
  const question = await getQuestionById(id);

  if (!question) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {payment === "demo" || payment === "success" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Demo checkout completed. The AI-style answer and complexity result are
          now available below.
        </div>
      ) : null}

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-800">
            {question.tier === "paid" ? "$5 Paid" : "Free"}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
            {question.paid ? "Published" : "Awaiting payment"}
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

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {question.title}
        </h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
          {question.body}
        </p>

        <div className="mt-6 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
          Asked on {new Date(question.createdAt).toLocaleString()}
        </div>
      </div>

      <AiAnswer content={question.aiAnswer} />
      <ComplexityBanner complexity={question.complexity} questionId={question.id} />
      <AnswerSection questionId={question.id} />

      <Link
        href="/"
        className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
      >
        Back to feed
      </Link>
    </div>
  );
}
