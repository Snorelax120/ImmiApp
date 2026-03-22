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
    <div className="mx-auto max-w-6xl space-y-6">
      {payment === "demo" || payment === "success" ? (
        <div className="rounded-[8px] bg-[#eceff6] px-4 py-3 text-sm text-[#41527f]">
          Demo checkout completed. The AI-style answer and complexity result are
          now available below.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <div className="rounded-[8px] bg-transparent py-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a90a7]">
              Resources &gt; Legal FAQ &gt; Express Entry Requirements
            </div>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[#101328] sm:text-5xl">
              {question.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#6d7288]">
              <span className="font-medium text-[#20243c]">
                {question.author?.displayName || "Alex Thompson"}
              </span>
              <span>
                Asked on {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <AiAnswer content={question.aiAnswer} />

          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              className="rounded-sm bg-[#ece9e1] px-4 py-2 font-medium text-[#20243c]"
            >
              Helpful
            </button>
            <button
              type="button"
              className="rounded-sm bg-[#ece9e1] px-4 py-2 font-medium text-[#20243c]"
            >
              Share Report
            </button>
            <button
              type="button"
              className="rounded-sm bg-[#ece9e1] px-4 py-2 font-medium text-[#20243c]"
            >
              Save to Case
            </button>
          </div>

          <AnswerSection questionId={question.id} />

          <Link
            href="/"
            className="inline-flex rounded-sm bg-white px-4 py-2.5 text-sm font-medium text-[#081b4b] shadow-[0_10px_28px_rgba(16,19,40,0.05)] transition hover:bg-[#f7f4ef]"
          >
            Back to feed
          </Link>
        </div>

        <aside className="space-y-6">
          <ComplexityBanner complexity={question.complexity} questionId={question.id} />
          <section className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a90a7]">
              Add Your Insight
            </p>
            <div className="space-y-3">
              <div className="rounded-[6px] bg-white p-4 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a90a7]">
                  NOC Guide
                </p>
                <p className="mt-2 text-sm font-medium text-[#20243c]">
                  Understanding TEER Categories (0-5)
                </p>
              </div>
              <div className="rounded-[6px] bg-white p-4 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a90a7]">
                  Proof of funds
                </p>
                <p className="mt-2 text-sm font-medium text-[#20243c]">
                  Settlement Funds for Families of 4
                </p>
              </div>
              <div className="rounded-[6px] bg-white p-4 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a90a7]">
                  Language
                </p>
                <p className="mt-2 text-sm font-medium text-[#20243c]">
                  IELTS vs. CELPIP for CRS Points
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
