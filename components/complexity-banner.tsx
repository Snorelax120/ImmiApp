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
    <section className="rounded-[8px] bg-[#081b4b] p-6 text-white shadow-[0_14px_36px_rgba(8,27,75,0.18)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em]">
        Complex case warning
      </p>
      <p className="mt-3 text-sm leading-7 text-[#d6dbeb]">
        Your situation involving multi-jurisdictional work experience is
        considered high-complexity. Slight errors in documentation can lead to
        serious immigration risk.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-[#eef1f8]">
        <li>Verify NOC translations</li>
        <li>Coordinate reference letters</li>
        <li>Legal review recommended</li>
      </ul>
      <Link
        href={`/consultants?questionId=${questionId}`}
        className="mt-5 inline-flex rounded-sm bg-white px-4 py-2.5 text-sm font-medium text-[#081b4b] transition hover:bg-[#eef1f8]"
      >
        Book Expert Review
      </Link>
    </section>
  );
}
