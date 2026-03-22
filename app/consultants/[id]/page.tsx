import Link from "next/link";
import { notFound } from "next/navigation";

import { StartSessionButton } from "@/components/start-session-button";
import { getConsultantProfileData } from "@/lib/demo-store";

export default async function ConsultantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = getConsultantProfileData(id);

  if (!data) {
    notFound();
  }

  const { consultant, answeredQuestions } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Consultant profile
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {consultant.displayName}
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{consultant.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {consultant.expertiseTags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            Rating {consultant.avgRating?.toFixed(1) || "0.0"}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            {consultant.ratingCount || 0} reviews
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            {answeredQuestions.length} answered questions
          </span>
        </div>

        <div className="mt-6">
          <StartSessionButton consultantId={consultant.id} />
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-950">
          Expert answers in the feed
        </h2>
        {answeredQuestions.length ? (
          <div className="mt-4 space-y-4">
            {answeredQuestions.map((question) => (
              <article
                key={question.id}
                className="rounded-2xl border border-zinc-200 p-4"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                  {question.tier === "paid" ? "Paid question" : "Free question"}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                  {question.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {question.body}
                </p>
                <Link
                  href={`/questions/${question.id}`}
                  className="mt-4 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
                >
                  View question
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-600">
            No expert answers yet for this consultant.
          </p>
        )}
      </section>
    </div>
  );
}
