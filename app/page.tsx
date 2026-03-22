import Link from "next/link";

import { QuestionCard } from "@/components/question-card";
import { listQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const questions = await listQuestions();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-100 px-6 py-10 text-black shadow-sm sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">
            Hackathon demo
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Ask a Canadian immigration question and route paid ones through AI.
          </h1>
          <p className="mt-4 text-base leading-7 text-black">
            This hackathon build runs entirely in demo mode: fake persona
            switching, simulated paid flow, AI-style answers, expert replies,
            consultants, private sessions, and a new immigration application
            drafting workflow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/questions/new"
              className="rounded-full border border-zinc-300 !bg-white px-5 py-3 text-sm font-medium !text-black transition hover:!bg-zinc-100"
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            >
              Submit a question
            </Link>
            <Link
              href="/applier"
              className="rounded-full border border-sky-300 bg-sky-100 px-5 py-3 text-sm font-medium text-black transition hover:bg-sky-200"
            >
              Open Immigration Applier AI
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Public question feed
            </h2>
            <p className="mt-1 text-sm text-black">
              Free and paid questions appear here with complexity status when
              available.
            </p>
          </div>
          <Link
            href="/questions/new"
            className="rounded-full border border-zinc-300 !bg-white px-4 py-2 text-sm font-medium !text-black transition hover:border-zinc-400 hover:!bg-zinc-100"
            style={{ color: "#000000", backgroundColor: "#ffffff" }}
          >
            Ask now
          </Link>
        </div>

        {questions.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-black">
            No questions yet. Post the first one to kick off the MVP flow.
          </div>
        )}
      </section>
    </div>
  );
}
