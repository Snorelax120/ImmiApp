export function AiAnswer({ content }: { content: string | null }) {
  if (!content) {
    return (
      <section className="rounded-[8px] bg-white p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#081b4b]">
          <span>AI-generated intelligence</span>
          <span className="rounded-full bg-[#eceff6] px-2 py-0.5 text-xs text-[#4a5a85]">
            pending
          </span>
        </div>
        <p className="mt-3 text-sm leading-7 text-[#6d7288]">
          The AI answer appears here after a priority checkout is completed.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[8px] bg-white p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a90a7]">
          <span>AI-Generated Intelligence</span>
          <span className="rounded-full bg-[#eceff6] px-2 py-0.5 text-xs text-[#4a5a85]">
            verified
          </span>
        </div>
        <button
          type="button"
          className="rounded-sm bg-[#f5f3ee] px-3 py-2 text-xs font-medium text-[#4a5a85]"
        >
          View Sources
        </button>
      </div>
      <div className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[#20243c]">
        {content}
      </div>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[#8a90a7]">
        This answer is AI-generated and is not legal advice.
      </p>
    </section>
  );
}
