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
    <article className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8a90a7]">
        Verified specialist
      </p>
      <h2 className="mt-3 text-[1.65rem] font-semibold tracking-[-0.03em] text-[#101328]">
        {consultant.displayName}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#6d7288]">{consultant.bio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {consultant.expertiseTags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#eceff6] px-3 py-1 text-xs font-medium text-[#41527f]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#6d7288]">
        <span className="rounded-full bg-[#f7f4ef] px-3 py-1">
          Rating {consultant.avgRating?.toFixed(1) || "0.0"}
        </span>
        <span className="rounded-full bg-[#f7f4ef] px-3 py-1">
          {consultant.ratingCount || 0} reviews
        </span>
        <span className="rounded-full bg-[#f7f4ef] px-3 py-1">
          {answeredCount} expert answers
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/consultants/${consultant.id}`}
          className="inline-flex rounded-md bg-[#ece9e1] px-4 py-2.5 text-sm font-medium text-[#20243c] transition hover:bg-[#e1ddd3]"
        >
          View profile
        </Link>
        <StartSessionButton
          consultantId={consultant.id}
          questionId={questionId}
          label="Consult now"
        />
      </div>
    </article>
  );
}
