"use client";

import type { GeneratedDocument } from "@/lib/types";

function downloadDocument(document: GeneratedDocument) {
  const blob = new Blob([document.content], { type: document.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = document.fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function GeneratedDocumentCard({
  document,
}: {
  document: GeneratedDocument;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-black">{document.title}</h3>
          <p className="mt-1 text-sm text-black">{document.description}</p>
        </div>
        <button
          type="button"
          onClick={() => downloadDocument(document)}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100"
        >
          Download
        </button>
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
        {document.fileName}
      </p>
      <pre className="mt-3 max-h-72 overflow-auto rounded-2xl bg-zinc-50 p-4 text-xs leading-6 text-black">
        {document.content}
      </pre>
    </article>
  );
}
