import { QuestionForm } from "@/components/question-form";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
          New question
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Post a question for the community or purchase an AI answer.
        </h1>
        <p className="mt-3 text-sm leading-6 text-black">
          Free questions are published immediately. Paid questions use a fake
          checkout flow for the hackathon and generate a demo AI answer
          instantly.
        </p>
      </div>

      <QuestionForm />
    </div>
  );
}
