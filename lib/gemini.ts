import type {
  ApplierApplicationId,
  ApplierChatMessage,
  ApplierUploadedFile,
} from "@/lib/types";

type GeminiStructuredReply = {
  reply: string;
  applicationId?: ApplierApplicationId | null;
  nextStep?: string;
};

function stripCodeFences(text: string) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

export async function getGeminiStructuredApplierReply({
  messages,
  uploadedFiles,
  currentApplicationId,
  supportedApplicationsPrompt,
}: {
  messages: ApplierChatMessage[];
  uploadedFiles: ApplierUploadedFile[];
  currentApplicationId?: ApplierApplicationId | null;
  supportedApplicationsPrompt: string;
}): Promise<GeminiStructuredReply | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: [
                "You are an immigration application intake assistant.",
                "Your job is only to help identify the best supported application type, explain what documents are needed, and suggest the immediate next step.",
                "Only choose from the supported application ids listed below.",
                "If the user is ambiguous, pick the best current guess and ask a short follow-up.",
                "Do not claim to have extracted data from files yourself.",
                "Respond with valid JSON only in this exact shape:",
                '{"reply":"string","applicationId":"work-permit|study-permit|spousal-sponsorship|null","nextStep":"string"}',
                "",
                "Supported applications:",
                supportedApplicationsPrompt,
              ].join("\n"),
            },
          ],
        },
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
        contents: [
          ...messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          {
            role: "user",
            parts: [
              {
                text: [
                  `Current matched application id: ${currentApplicationId || "none"}`,
                  uploadedFiles.length
                    ? `Uploaded files so far: ${uploadedFiles.map((file) => file.fileName).join(", ")}`
                    : "Uploaded files so far: none",
                ].join("\n"),
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(stripCodeFences(rawText)) as GeminiStructuredReply;
  } catch {
    return null;
  }
}
