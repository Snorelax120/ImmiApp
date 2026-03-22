"use client";

import type { ApplierChatMessage } from "@/lib/types";

export function ApplierMessage({
  message,
}: {
  message: ApplierChatMessage;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <article
        className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${
          isAssistant
            ? "border border-sky-200 bg-white text-black"
            : "border border-sky-300 bg-sky-100 text-black"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
          {isAssistant ? "Applier AI" : "You"}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-black">
          {message.content}
        </p>
      </article>
    </div>
  );
}
