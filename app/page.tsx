import Link from "next/link";

import { QuestionCard } from "@/components/question-card";
import { listQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const questions = await listQuestions();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-6 rounded-[32px] bg-transparent px-1 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8a90a7]">
              Expert immigration insights
            </p>
            <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.06em] text-[#081b4b] sm:text-7xl">
              Your Path to The North.
            </h1>
            <p className="max-w-xl text-sm leading-8 text-[#6d7288] sm:text-base">
              Get real-time answers to your immigration questions. Choose between
              community-driven insights or instant, AI-powered regulatory checks
              tailored to current policy.
            </p>
          </div>
          <div className="flex flex-col gap-3 self-start">
            <div className="overflow-hidden rounded-[6px] border border-[rgba(8,27,75,0.12)] bg-[#d9dde5] shadow-[0_10px_28px_rgba(16,19,40,0.08)]">
            </div>
            <div className="w-fit rounded-[6px] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(16,19,40,0.08)]">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[#081b4b]">
                98%
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#8a90a7]">
                Accuracy in AI triage
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 self-start">
          <div className="rounded-[8px] bg-white p-5 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8a90a7]">
              Need Speed?
            </p>
            <p className="mt-3 text-sm leading-7 text-[#6d7288]">
              Our AI Answer tier analyzes your specific case against the latest
              IRCC policy changes in seconds.
            </p>
            <Link
              href="/questions/new"
              className="mt-4 inline-flex rounded-md bg-[#f3e1d4] px-4 py-2 text-sm font-medium text-[#6c5240] transition hover:bg-[#edd8c9]"
            >
              Upgrade Inquiry
            </Link>
          </div>
        </aside>
      </section>

      <section className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8a90a7]">
            Categories
          </p>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <span className="rounded-full bg-[#081b4b] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
              All Topics
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6d7288]">
              Visa Status
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6d7288]">
              Work Permits
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6d7288]">
              Study
            </span>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#8a90a7]">
                Recent inquiries
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#081b4b]">
                Public question feed
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-[#8a90a7]">
              <span className="rounded-full bg-white px-4 py-2">Latest</span>
              <span className="rounded-full bg-white px-4 py-2">Trending</span>
            </div>
          </div>

          {questions.length ? (
            <div className="grid gap-5">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] bg-white p-8 text-sm text-[#6d7288] shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
              No questions yet. Post the first one to kick off the MVP flow.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 rounded-none bg-[#081b4b] px-6 py-8 sm:grid-cols-3 sm:px-8">
        <div>
          <h2 className="max-w-xs text-3xl font-semibold tracking-[-0.04em] text-white">
            Ready to secure your Canadian future?
          </h2>
          <div className="mt-5 flex gap-3">
            <Link
              href="/questions/new"
              className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-[#081b4b]"
              style={{ color: "#081b4b" }}
            >
              Ask a Question
            </Link>
            <Link
              href="/consultants"
              className="rounded-sm bg-[#13285e] px-4 py-2 text-sm font-medium text-white"
            >
              View Success Stories
            </Link>
          </div>
        </div>
        <div className="rounded-[4px] bg-[#13285e] p-5">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-white">12k+</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#b7bfd6]">
            Active Cases
          </p>
        </div>
        <div className="rounded-[4px] bg-[#13285e] p-5">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-white">24/7</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#b7bfd6]">
            AI Support
          </p>
        </div>
      </section>
    </div>
  );
}
