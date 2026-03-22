import Link from "next/link";

import { StartSessionButton } from "@/components/start-session-button";
import type { Profile } from "@/lib/types";

export function ConsultantCard({
  consultant,
  answeredCount,
  questionId,
}: {
  consultant: Profile;
  answeredCount: number;
  questionId?: string;
}) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
        Licensed consultant
      </p>
      <h2 className="mt-2 text-xl font-semibold text-zinc-950">
        {consultant.displayName}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{consultant.bio}</p>

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
          {answeredCount} expert answers
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/consultants/${consultant.id}`}
          className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
        >
          View profile
        </Link>
        <StartSessionButton consultantId={consultant.id} questionId={questionId} />
      </div>
    </article>
  );
}
