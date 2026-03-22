import Link from "next/link";

import type { QuestionComplexity } from "@/lib/types";

export function ComplexityBanner({
  complexity,
  questionId,
}: {
  complexity: QuestionComplexity;
  questionId: string;
}) {
  if (complexity !== "complex") {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
      <p className="text-sm font-semibold text-amber-950">Complex case</p>
      <p className="mt-2 text-sm leading-6 text-amber-900">
        This looks like a complex case that may benefit from professional
        guidance. Consider a private consultation with a licensed consultant.
      </p>
      <Link
        href={`/consultants?questionId=${questionId}`}
        className="mt-4 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100"
      >
        Start Private Session
      </Link>
    </section>
  );
}
