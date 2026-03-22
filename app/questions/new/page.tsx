import { QuestionForm } from "@/components/question-form";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden rounded-[8px] bg-[#ece9e1] p-5 text-[#6d7288] lg:block">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8a90a7]">
            Dashboard
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <div className="rounded-md bg-white px-3 py-2 font-medium text-[#081b4b]">
              Home
            </div>
            <div className="rounded-md px-3 py-2">My Questions</div>
            <div className="rounded-md px-3 py-2">Consultants</div>
            <div className="rounded-md px-3 py-2">Chat</div>
            <div className="rounded-md px-3 py-2">Settings</div>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="rounded-[28px] bg-white px-7 py-9 shadow-[0_10px_28px_rgba(16,19,40,0.05)] sm:px-9">
            <p className="text-xs uppercase tracking-[0.28em] text-[#8a90a7]">
              Dashboard / New Question
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#101328]">
              Seek Clarity on Your{" "}
              <span className="text-[#b03b2d]">Journey.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6d7288]">
              Your inquiry will be curated and directed to the right experts.
              Choose a priority level to accelerate your Canadian immigration path.
            </p>
          </div>

          <QuestionForm />

          <section className="rounded-[4px] bg-[#081b4b] px-6 py-8 text-white sm:flex sm:items-center sm:justify-between sm:px-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Need a full strategy?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#c8cee0]">
                If your question is part of a larger plan, consider booking a 1:1
                strategy session with our certified consultants.
              </p>
            </div>
            <div className="mt-5 sm:mt-0">
              <a className="inline-flex rounded-md bg-[#f3e1d4] px-5 py-3 text-sm font-medium text-[#6c5240]">
                Book Consultation
              </a>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
