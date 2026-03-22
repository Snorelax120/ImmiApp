"use client";

import { ApplierUploadList } from "@/components/applier-upload-list";
import type { ApplierSessionState } from "@/lib/types";

export function ApplierSidePanel({
  session,
}: {
  session: ApplierSessionState;
}) {
  const requiredDocuments = session.match?.application.requiredDocuments || [];

  return (
    <aside className="min-w-0 space-y-4">
      <section className="min-w-0 rounded-3xl border border-sky-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Structured view</h2>

        {session.match ? (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
                Application type
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {session.match.application.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-black">
                {session.match.reason}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
                Where to apply
              </p>
              <p className="mt-1 text-sm text-black">
                {session.applyLocation || "Apply location pending"}
              </p>
              <a
                href={session.match.application.irccUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100"
              >
                Open IRCC page
              </a>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
                Next step
              </p>
              <p className="mt-1 text-sm leading-6 text-black">
                {session.nextStep || session.match.suggestedNextStep}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-black">
            The application type will appear here once the chat has enough
            context to identify the best supported IRCC path.
          </p>
        )}
      </section>

      <section className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Required documents</h2>
        {requiredDocuments.length ? (
          <div className="mt-4 space-y-3">
            {requiredDocuments.map((document) => {
              const status = session.requiredDocumentStatuses.find(
                (item) => item.documentId === document.id,
              );

              return (
                <article
                  key={document.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {document.name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-black">
                        {document.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        status?.status === "submitted"
                          ? "bg-emerald-100 text-black"
                          : "bg-amber-100 text-black"
                      }`}
                    >
                      {status?.status === "submitted" ? "Submitted" : "Missing"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-black">
                    {status?.notes || "Waiting for upload."}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-black">
            Once the chat identifies the application, the required document list
            will appear here.
          </p>
        )}
      </section>

      <section className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Submitted documents</h2>
        <div className="mt-4">
          <ApplierUploadList files={session.uploadedFiles} />
        </div>
      </section>

      <section className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">
          Extracted personal details
        </h2>
        {session.extractedDetails.length ? (
          <div className="mt-4 space-y-3">
            {session.extractedDetails.map((detail) => (
              <article
                key={detail.id}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
              >
                <p className="text-sm font-semibold text-black">{detail.label}</p>
                <p className="mt-1 text-sm text-black">{detail.value}</p>
                <p className="mt-1 text-xs text-black">
                  From: {detail.sourceFileName}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-black">
            Uploaded files will populate mocked extracted details here.
          </p>
        )}
      </section>

    </aside>
  );
}
