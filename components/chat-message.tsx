import type { Message } from "@/lib/types";

export function ChatMessage({
  message,
  isOwnMessage,
}: {
  message: Message;
  isOwnMessage: boolean;
}) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isOwnMessage
            ? "bg-zinc-950 text-white"
            : "border border-zinc-200 bg-white text-zinc-900"
        }`}
      >
        <p className="text-xs font-medium opacity-70">
          {message.sender?.displayName || "Unknown user"}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
        <p className="mt-2 text-[11px] opacity-60">
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </article>
    </div>
  );
}
