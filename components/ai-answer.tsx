export function AiAnswer({ content }: { content: string | null }) {
  if (!content) {
    return (
      <section className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-900">
          <span>AI answer</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-sky-700">
            pending
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-sky-800">
          The AI answer will appear here after a paid checkout is completed.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-sky-900">
        <span>AI answer</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-sky-700">
          generated
        </span>
      </div>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-sky-950">
        {content}
      </div>
      <p className="mt-4 text-xs text-sky-700">
        This answer is AI-generated and is not legal advice.
      </p>
    </section>
  );
}
