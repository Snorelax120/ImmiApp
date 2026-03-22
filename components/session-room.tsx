"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ChatMessage } from "@/components/chat-message";
import { RatingForm } from "@/components/rating-form";
import type { Message, Profile, Question, Rating, Session } from "@/lib/types";

type SessionPayload = {
  session: Session;
  messages: Message[];
  rating: Rating | null;
  question: Question | null;
  currentUser: Profile | null;
  error?: string;
};

export function SessionRoom({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<SessionPayload | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as SessionPayload;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load session.");
      }

      setData(payload);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load session.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadSession();

    const interval = window.setInterval(() => {
      void loadSession();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [loadSession]);

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: draft }),
      });

      const payload = (await response.json()) as SessionPayload;

      if (!response.ok || !payload.session) {
        throw new Error(payload.error || "Unable to send message.");
      }

      setData(payload);
      setDraft("");
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send message.",
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleCloseSession() {
    setIsClosing(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/close`, {
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to close session.");
      }

      await loadSession();
    } catch (closeError) {
      setError(
        closeError instanceof Error
          ? closeError.message
          : "Unable to close session.",
      );
    } finally {
      setIsClosing(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading consultation...</p>;
  }

  if (!data) {
    return (
      <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error || "Unable to load consultation."}
      </p>
    );
  }

  const isConsultant = data.currentUser?.id === data.session.consultantId;
  const isClient = data.currentUser?.id === data.session.clientId;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Private consultation
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              {data.session.client?.displayName} and {data.session.consultant?.displayName}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Status: {data.session.status}. Switch demo users in the header to
              reply as the client or consultant.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.question ? (
              <Link
                href={`/questions/${data.question.id}`}
                className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
              >
                View related question
              </Link>
            ) : null}
            {isConsultant && data.session.status === "active" ? (
              <button
                type="button"
                onClick={handleCloseSession}
                disabled={isClosing}
                className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-black"
              >
                {isClosing ? "Closing..." : "Close session"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
        <div className="space-y-3">
          {data.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === data.currentUser?.id}
            />
          ))}
        </div>

        {data.session.status === "active" ? (
          <form onSubmit={handleSendMessage} className="mt-4">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message..."
              className="min-h-28 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500"
              required
            />
            <button
              type="submit"
              disabled={isSending}
              className="mt-3 inline-flex rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-black"
            >
              {isSending ? "Sending..." : "Send message"}
            </button>
          </form>
        ) : (
          <p className="mt-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
            This session is closed.
          </p>
        )}
      </section>

      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {isClient && data.session.status === "closed" && !data.rating ? (
        <RatingForm sessionId={sessionId} onSubmitted={loadSession} />
      ) : null}

      {data.rating ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-950">Submitted rating</h3>
          <p className="mt-2 text-sm text-zinc-700">
            Score: {data.rating.score}/5
          </p>
          {data.rating.comment ? (
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {data.rating.comment}
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
