"use client";

import { useState } from "react";

import { ApplierMessage } from "@/components/applier-message";
import { ApplierSidePanel } from "@/components/applier-side-panel";
import { buildRequiredDocumentStatuses, mergeApplicantInfoFromExtractedDetails } from "@/lib/applier-session";
import type {
  ApplierChatMessage,
  ApplierChatRouteResponse,
  ApplierSessionState,
} from "@/lib/types";

type UploadPayload = {
  uploadedFiles?: ApplierSessionState["uploadedFiles"];
  extractedDetails?: ApplierSessionState["extractedDetails"];
  applicantInfoPatch?: Record<string, string>;
  assistantSummary?: string;
  error?: string;
};

type FillPayload = {
  generatedDocuments?: ApplierSessionState["generatedDocuments"];
  workerRequest?: ApplierSessionState["workerRequest"];
  workerResponse?: ApplierSessionState["workerResponse"];
};

export function ApplierChat({
  currentUserLabel,
  initialMessages,
  initialSession,
}: {
  currentUserLabel: string;
  initialMessages: ApplierChatMessage[];
  initialSession: ApplierSessionState;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [session, setSession] = useState(initialSession);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshGeneratedOutputs(nextSession: ApplierSessionState) {
    if (!nextSession.match) {
      return {
        ...nextSession,
        generatedDocuments: [],
        workerRequest: null,
        workerResponse: null,
      };
    }

    if (!nextSession.uploadedFiles.length && !Object.keys(nextSession.applicantInfo).length) {
      return nextSession;
    }

    const response = await fetch("/api/applier/fill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId: nextSession.match.application.id,
        userGoal: nextSession.userGoal,
        applicantInfo: nextSession.applicantInfo,
        documentInputs: nextSession.requiredDocumentStatuses.map((status) => ({
          documentId: status.documentId,
          status: status.status === "submitted" ? "ready" : "missing",
          notes: status.notes,
        })),
      }),
    });

    if (!response.ok) {
      return nextSession;
    }

    const payload = (await response.json()) as FillPayload;

    return {
      ...nextSession,
      generatedDocuments: payload.generatedDocuments || [],
      workerRequest: payload.workerRequest || null,
      workerResponse: payload.workerResponse || null,
    };
  }

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    setIsSending(true);
    setError(null);

    const userMessage: ApplierChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedDraft,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");

    try {
      const response = await fetch("/api/applier/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          session,
        }),
      });

      const payload = (await response.json()) as
        | ApplierChatRouteResponse
        | { error?: string };

      if (!response.ok || !("assistantMessage" in payload) || !payload.assistantMessage) {
        throw new Error(
          ("error" in payload ? payload.error : undefined) ||
            "Unable to process Applier chat.",
        );
      }

      const refreshedSession = await refreshGeneratedOutputs(payload.session);
      setSession(refreshedSession);
      setMessages([...nextMessages, payload.assistantMessage]);
    } catch (chatError) {
      setError(
        chatError instanceof Error
          ? chatError.message
          : "Unable to process Applier chat.",
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (session.match?.application.id) {
        formData.append("applicationId", session.match.application.id);
      }

      for (const file of files) {
        formData.append("files", file);
      }

      const response = await fetch("/api/applier/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadPayload;

      if (!response.ok || !payload.uploadedFiles || !payload.extractedDetails) {
        throw new Error(payload.error || "Unable to process uploaded files.");
      }

      const mergedExtractedDetails = [
        ...session.extractedDetails,
        ...payload.extractedDetails,
      ];
      const mergedUploadedFiles = [...session.uploadedFiles, ...payload.uploadedFiles];
      const mergedApplicantInfo = {
        ...mergeApplicantInfoFromExtractedDetails(
          session.applicantInfo,
          payload.extractedDetails,
        ),
        ...(payload.applicantInfoPatch || {}),
      };

      let nextSession: ApplierSessionState = {
        ...session,
        applicantInfo: mergedApplicantInfo,
        uploadedFiles: mergedUploadedFiles,
        extractedDetails: mergedExtractedDetails,
        requiredDocumentStatuses: buildRequiredDocumentStatuses(
          session.match?.application.id,
          mergedUploadedFiles,
        ),
      };

      nextSession = await refreshGeneratedOutputs(nextSession);
      setSession(nextSession);

      const assistantMessage: ApplierChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          payload.assistantSummary ||
          "I reviewed the uploaded files and updated the structured panel with mocked extracted details.",
        createdAt: new Date().toISOString(),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      event.target.value = "";
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to process uploaded files.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-100 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">
          Immigration Applier AI
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black">
          Start a chat, upload documents, and watch the application summary build live.
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-black">
          Tell the assistant what kind of application you want to start. The
          chat identifies the best supported IRCC path, the side panel tracks
          required documents and uploaded files, and placeholder filled
          documents appear once enough context has been gathered.
        </p>
        <p className="mt-4 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-black">
          Current demo persona: <span className="font-medium">{currentUserLabel}</span>
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.95fr)]">
        <section className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-black">Chat</h2>
              <p className="mt-1 text-sm text-black">
                Ask what type of application to start and upload files as you go.
              </p>
            </div>

            <label className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100">
              {isUploading ? "Uploading..." : "Upload documents"}
              <input
                type="file"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-5 space-y-3 rounded-3xl bg-sky-50/70 p-4">
            {messages.map((message) => (
              <ApplierMessage key={message.id} message={message} />
            ))}
          </div>

          <form onSubmit={handleSend} className="mt-5">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What application would you like to start, or what can I help you with?"
              className="min-h-28 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-800"
            />
            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSending}
                className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          {error ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </section>

        <ApplierSidePanel session={session} />
      </div>
    </div>
  );
}
