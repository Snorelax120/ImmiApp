"use client";

import type { ApplierUploadedFile } from "@/lib/types";

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplierUploadList({
  files,
}: {
  files: ApplierUploadedFile[];
}) {
  if (!files.length) {
    return (
      <p className="text-sm leading-6 text-black">
        No documents uploaded yet. Add any passport, offer letter, acceptance
        letter, bank statement, or relationship proof you already have.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <article
          key={file.id}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-semibold text-black">{file.fileName}</p>
              <p className="mt-1 text-xs text-black">
                {file.mimeType} · {formatFileSize(file.sizeBytes)}
              </p>
            </div>
            {file.matchedDocumentName ? (
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-black">
                {file.matchedDocumentName}
              </span>
            ) : (
              <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-black">
                Unmapped support file
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
