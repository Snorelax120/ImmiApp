import { ConsultantCard } from "@/components/consultant-card";
import { getDemoStore, listConsultants } from "@/lib/demo-store";

export default async function ConsultantsPage({
  searchParams,
}: {
  searchParams: Promise<{ questionId?: string }>;
}) {
  const { questionId } = await searchParams;
  const store = getDemoStore();
  const consultants = listConsultants().map((consultant) => ({
    consultant,
    answeredCount: store.answers.filter(
      (answer) => answer.userId === consultant.id && answer.type === "expert",
    ).length,
  }));

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-black shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
          Consultants
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Browse experts for follow-up guidance.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-black">
          This demo page replaces the marketplace backend with seeded
          consultant profiles and a fake private-session flow.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {consultants.map(({ consultant, answeredCount }) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            answeredCount={answeredCount}
            questionId={questionId}
          />
        ))}
      </section>
    </div>
  );
}
