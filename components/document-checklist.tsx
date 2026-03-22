"use client";

import type {
  ApplierDocumentInput,
  ApplierRequiredDocument,
} from "@/lib/types";

export function DocumentChecklist({
  documents,
  values,
  onChange,
}: {
  documents: ApplierRequiredDocument[];
  values: Record<string, ApplierDocumentInput>;
  onChange: (nextValue: ApplierDocumentInput) => void;
}) {
  return (
    <div className="space-y-4">
      {documents.map((document) => {
        const value =
          values[document.id] || {
            documentId: document.id,
            status: "ready" as const,
            notes: "",
          };

        return (
          <article
            key={document.id}
            className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h3 className="text-base font-semibold text-black">
                  {document.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-black">
                  {document.description}
                </p>
                <p className="mt-2 text-xs text-black">
                  Accepted examples: {document.acceptedExamples.join(", ")}
                </p>
              </div>

              <select
                value={value.status}
                onChange={(event) =>
                  onChange({
                    ...value,
                    status: event.target.value as ApplierDocumentInput["status"],
                  })
                }
                className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-black outline-none"
              >
                <option value="ready">Ready to provide</option>
                <option value="needs-help">Needs AI help</option>
                <option value="missing">Still missing</option>
              </select>
            </div>

            <textarea
              value={value.notes}
              onChange={(event) =>
                onChange({
                  ...value,
                  notes: event.target.value,
                })
              }
              placeholder="Add filenames, notes, or context for this document."
              className="mt-4 min-h-24 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-800"
            />
          </article>
        );
      })}
    </div>
  );
}
