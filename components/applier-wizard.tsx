"use client";

import { useMemo, useState } from "react";

import { DocumentChecklist } from "@/components/document-checklist";
import { GeneratedDocumentCard } from "@/components/generated-document-card";
import type {
  ApplierDocumentInput,
  ApplierMatchResult,
  GeneratedDocument,
  PdfWorkerFillRequest,
  PdfWorkerFillResponse,
} from "@/lib/types";

type CatalogItem = {
  id: string;
  label: string;
  shortDescription: string;
  primaryFormCode: string;
  packageName: string;
};

type MatchPayload = {
  match?: ApplierMatchResult;
  error?: string;
};

type FillPayload = {
  match?: ApplierMatchResult;
  generatedDocuments?: GeneratedDocument[];
  workerRequest?: PdfWorkerFillRequest;
  workerResponse?: PdfWorkerFillResponse;
  error?: string;
};

export function ApplierWizard({
  catalog,
  currentUserLabel,
}: {
  catalog: CatalogItem[];
  currentUserLabel: string;
}) {
  const [selectedApplicationId, setSelectedApplicationId] = useState(
    catalog[0]?.id || "",
  );
  const [userGoal, setUserGoal] = useState("");
  const [match, setMatch] = useState<ApplierMatchResult | null>(null);
  const [applicantInfo, setApplicantInfo] = useState<Record<string, string>>({});
  const [documentInputs, setDocumentInputs] = useState<
    Record<string, ApplierDocumentInput>
  >({});
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>(
    [],
  );
  const [workerRequest, setWorkerRequest] = useState<PdfWorkerFillRequest | null>(
    null,
  );
  const [workerResponse, setWorkerResponse] =
    useState<PdfWorkerFillResponse | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCatalogItem = useMemo(
    () => catalog.find((item) => item.id === selectedApplicationId) || null,
    [catalog, selectedApplicationId],
  );

  async function handleMatch() {
    setIsMatching(true);
    setError(null);
    setGeneratedDocuments([]);
    setWorkerRequest(null);
    setWorkerResponse(null);

    try {
      const response = await fetch("/api/applier/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApplicationId || undefined,
          userGoal,
        }),
      });

      const payload = (await response.json()) as MatchPayload;

      if (!response.ok || !payload.match) {
        throw new Error(payload.error || "Unable to match an IRCC package.");
      }

      setMatch(payload.match);
      setApplicantInfo(
        Object.fromEntries(
          payload.match.application.fields.map((field) => [field.id, ""]),
        ),
      );
      setDocumentInputs(
        Object.fromEntries(
          payload.match.application.requiredDocuments.map((document) => [
            document.id,
            {
              documentId: document.id,
              status: "ready",
              notes: "",
            },
          ]),
        ),
      );
    } catch (matchError) {
      setError(
        matchError instanceof Error
          ? matchError.message
          : "Unable to match an IRCC package.",
      );
    } finally {
      setIsMatching(false);
    }
  }

  async function handleGenerate() {
    if (!match) {
      setError("Match an application package before generating drafts.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/applier/fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: match.application.id,
          userGoal,
          applicantInfo,
          documentInputs: Object.values(documentInputs),
        }),
      });

      const payload = (await response.json()) as FillPayload;

      if (!response.ok || !payload.match || !payload.generatedDocuments) {
        throw new Error(payload.error || "Unable to generate draft outputs.");
      }

      setMatch(payload.match);
      setGeneratedDocuments(payload.generatedDocuments);
      setWorkerRequest(payload.workerRequest || null);
      setWorkerResponse(payload.workerResponse || null);
    } catch (fillError) {
      setError(
        fillError instanceof Error
          ? fillError.message
          : "Unable to generate draft outputs.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-100 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">
          Immigration Applier AI
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black">
          Match a user goal to an IRCC package and generate a draft application set.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black">
          This hackathon workflow asks what kind of application the user wants
          to prepare, points them to the official IRCC page, collects the
          required details and document status, and then returns demo draft
          outputs plus a future PDF/XFA worker payload.
        </p>
        <p className="mt-4 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-black">
          Current demo persona: <span className="font-medium">{currentUserLabel}</span>
        </p>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-black">1. Pick the application type</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {catalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedApplicationId(item.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedApplicationId === item.id
                  ? "border-sky-400 bg-sky-50"
                  : "border-zinc-200 bg-white hover:border-sky-300 hover:bg-sky-50"
              }`}
            >
              <p className="text-sm font-semibold text-black">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-black">
                {item.shortDescription}
              </p>
              <p className="mt-3 text-xs text-sky-700">
                {item.primaryFormCode} · {item.packageName}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-black" htmlFor="userGoal">
            2. Describe the user&apos;s immigration goal
          </label>
          <textarea
            id="userGoal"
            value={userGoal}
            onChange={(event) => setUserGoal(event.target.value)}
            placeholder="Example: I have a Canadian job offer and want help preparing a work permit package."
            className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-800"
          />
        </div>

        <button
          type="button"
          onClick={handleMatch}
          disabled={isMatching}
          className="mt-5 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
        >
          {isMatching ? "Matching..." : "Match IRCC package"}
        </button>

        {selectedCatalogItem ? (
          <p className="mt-3 text-sm text-black">
            Selected package: <span className="font-medium">{selectedCatalogItem.label}</span>
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </section>

      {match ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-black">
                3. Review the matched IRCC package
              </h2>
              <p className="mt-3 text-sm leading-6 text-black">{match.reason}</p>
              <p className="mt-3 text-sm leading-6 text-black">
                {match.suggestedNextStep}
              </p>
            </div>
            <a
              href={match.application.irccUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100"
            >
              Open IRCC source
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-sky-50 px-3 py-2 text-black">
              {match.application.label}
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-2 text-black">
              {match.application.primaryFormCode}
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-2 text-black">
              {match.application.templateId}
            </span>
          </div>
        </section>
      ) : null}

      {match ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black">
            4. Fill applicant details
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {match.application.fields.map((field) => (
              <label key={field.id} className="block">
                <span className="text-sm font-medium text-black">
                  {field.label}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    value={applicantInfo[field.id] || ""}
                    onChange={(event) =>
                      setApplicantInfo((current) => ({
                        ...current,
                        [field.id]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-800"
                    required={field.required}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={applicantInfo[field.id] || ""}
                    onChange={(event) =>
                      setApplicantInfo((current) => ({
                        ...current,
                        [field.id]: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-800"
                    required={field.required}
                  >
                    <option value="">Select one</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={applicantInfo[field.id] || ""}
                    onChange={(event) =>
                      setApplicantInfo((current) => ({
                        ...current,
                        [field.id]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-800"
                    required={field.required}
                  />
                )}
                {field.helperText ? (
                  <span className="mt-2 block text-xs text-black">
                    {field.helperText}
                  </span>
                ) : null}
              </label>
            ))}
          </div>
        </section>
      ) : null}

      {match ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black">
            5. Track required documents
          </h2>
          <p className="mt-2 text-sm leading-6 text-black">
            This demo simulates the document intake step. Mark each document as
            ready, missing, or needing AI help, then add any filenames or notes.
          </p>
          <div className="mt-5">
            <DocumentChecklist
              documents={match.application.requiredDocuments}
              values={documentInputs}
              onChange={(nextValue) =>
                setDocumentInputs((current) => ({
                  ...current,
                  [nextValue.documentId]: nextValue,
                }))
              }
            />
          </div>
        </section>
      ) : null}

      {match ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black">
            6. Generate the draft application set
          </h2>
          <p className="mt-2 text-sm leading-6 text-black">
            The app will produce demo output files for the user and show the
            payload that would later be sent to the Python PDF/XFA worker.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-5 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
          >
            {isGenerating ? "Generating..." : "Generate draft outputs"}
          </button>
        </section>
      ) : null}

      {workerResponse ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black">
            PDF/XFA worker status
          </h2>
          <p className="mt-3 text-sm leading-6 text-black">
            {workerResponse.message}
          </p>
          {workerResponse.details ? (
            <p className="mt-2 text-sm leading-6 text-black">
              {workerResponse.details}
            </p>
          ) : null}
          {workerRequest ? (
            <pre className="mt-4 overflow-auto rounded-2xl bg-zinc-50 p-4 text-xs leading-6 text-black">
              {JSON.stringify(workerRequest, null, 2)}
            </pre>
          ) : null}
        </section>
      ) : null}

      {generatedDocuments.length ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-black">
              Generated outputs
            </h2>
            <p className="mt-2 text-sm text-black">
              Download the draft files below or keep them open during the demo.
            </p>
          </div>
          <div className="grid gap-4">
            {generatedDocuments.map((document) => (
              <GeneratedDocumentCard key={document.id} document={document} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
