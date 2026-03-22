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
      <section className="space-y-5 rounded-[28px] bg-white px-6 py-9 shadow-[0_10px_28px_rgba(16,19,40,0.05)] sm:px-8">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-[#8a90a7]">
          <span className="rounded-full bg-[#ece9e1] px-4 py-2">All consultants</span>
          <span className="rounded-full bg-[#ece9e1] px-4 py-2">Express entry</span>
          <span className="rounded-full bg-[#ece9e1] px-4 py-2">Study permits</span>
          <span className="rounded-full bg-[#ece9e1] px-4 py-2">
            Family sponsorship
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#8a90a7]">
            Consultant Directory
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#101328]">
            Browse licensed experts for follow-up guidance.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d7288]">
            This demo uses seeded consultants, but the UI now follows the Stitch
            marketplace direction with a stronger emphasis on verified expertise
            and immediate consult actions.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {consultants.map(({ consultant, answeredCount }) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            answeredCount={answeredCount}
            questionId={questionId}
          />
        ))}
      </section>

      <p className="text-sm text-[#8a90a7]">
        Showing {consultants.length} seeded consultants for the demo environment.
      </p>
    </div>
  );
}
