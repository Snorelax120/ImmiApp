import { randomUUID } from "node:crypto";

import { generateApplierDraft, matchIrccApplication } from "@/lib/applier";
import { getGeminiStructuredApplierReply } from "@/lib/gemini";
import { supportedIrccApplications } from "@/lib/ircc-forms";
import { buildRequiredDocumentStatuses } from "@/lib/applier-session";
import type {
  ApplierApplicationId,
  ApplierChatMessage,
  ApplierChatRouteResponse,
  ApplierSessionState,
} from "@/lib/types";

export function createInitialAssistantMessage(): ApplierChatMessage {
  return {
    id: randomUUID(),
    role: "assistant",
    content:
      "What type of immigration application would you like to start? Tell me what you need help with, and I will identify the best supported IRCC path, list the required documents, and help you prepare the next steps.",
    createdAt: new Date().toISOString(),
  };
}

export function createInitialApplierSessionState(): ApplierSessionState {
  return {
    userGoal: "",
    match: null,
    nextStep: null,
    applyLocation: null,
    applicantInfo: {},
    uploadedFiles: [],
    extractedDetails: [],
    requiredDocumentStatuses: [],
    generatedDocuments: [],
    workerRequest: null,
    workerResponse: null,
  };
}

export function buildUserGoalFromMessages(messages: ApplierChatMessage[]) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean)
    .join("\n");
}

export async function refreshApplierGeneratedOutputs(
  session: ApplierSessionState,
): Promise<ApplierSessionState> {
  if (!session.match) {
    return {
      ...session,
      generatedDocuments: [],
      workerRequest: null,
      workerResponse: null,
    };
  }

  if (!session.uploadedFiles.length && !Object.keys(session.applicantInfo).length) {
    return {
      ...session,
      generatedDocuments: [],
      workerRequest: null,
      workerResponse: null,
    };
  }

  const result = await generateApplierDraft({
    applicationId: session.match.application.id,
    userGoal: session.userGoal,
    applicantInfo: session.applicantInfo,
    documentInputs: session.requiredDocumentStatuses.map((status) => ({
      documentId: status.documentId,
      status: status.status === "submitted" ? "ready" : "missing",
      notes: status.notes,
    })),
  });

  return {
    ...session,
    generatedDocuments: result.generatedDocuments,
    workerRequest: result.workerRequest,
    workerResponse: result.workerResponse,
  };
}

function buildFallbackReply(
  session: ApplierSessionState,
  matchedApplicationId?: ApplierApplicationId | null,
) {
  if (!matchedApplicationId) {
    return {
      reply:
        "I need a little more context to identify the best supported application. Tell me whether you are aiming for a work permit, study permit, or spousal sponsorship path.",
      applicationId: null,
      nextStep:
        "Describe the immigration goal in one or two sentences, then upload any passport, offer letter, acceptance letter, or relationship documents you already have.",
    };
  }

  const application =
    supportedIrccApplications.find((item) => item.id === matchedApplicationId) || null;

  if (!application) {
    return {
      reply:
        "I could not match the request to a supported application yet. Please describe the goal more clearly.",
      applicationId: null,
      nextStep:
        "Mention the main goal, such as work permit, study permit, or sponsoring a spouse.",
    };
  }

  return {
    reply: `It looks like the best supported path is ${application.label}. I added the required IRCC documents and apply location to the side panel. Upload any documents you already have and I will update the extracted details and draft outputs.`,
    applicationId: application.id,
    nextStep: `Next, upload the supporting documents you already have for ${application.label}.`,
  };
}

export async function processApplierConversation({
  messages,
  session,
}: {
  messages: ApplierChatMessage[];
  session: ApplierSessionState;
}): Promise<ApplierChatRouteResponse> {
  const userGoal = buildUserGoalFromMessages(messages);
  const supportedApplicationsPrompt = supportedIrccApplications
    .map(
      (application) =>
        `${application.id}: ${application.label} | keywords: ${application.userGoalKeywords.join(", ")}`,
    )
    .join("\n");

  const geminiReply = await getGeminiStructuredApplierReply({
    messages,
    uploadedFiles: session.uploadedFiles,
    currentApplicationId: session.match?.application.id,
    supportedApplicationsPrompt,
  });

  const matchedApplicationId =
    geminiReply?.applicationId ||
    (userGoal ? matchIrccApplication({ userGoal }).application.id : null);

  const fallbackReply = buildFallbackReply(session, matchedApplicationId);
  const assistantReplyText = geminiReply?.reply?.trim() || fallbackReply.reply;
  const nextStep = geminiReply?.nextStep || fallbackReply.nextStep;

  const match = matchedApplicationId
    ? matchIrccApplication({ applicationId: matchedApplicationId, userGoal })
    : null;

  let nextSession: ApplierSessionState = {
    ...session,
    userGoal,
    match,
    nextStep,
    applyLocation: match?.application.applyLocation || null,
    requiredDocumentStatuses: buildRequiredDocumentStatuses(
      match?.application.id,
      session.uploadedFiles,
    ),
  };

  nextSession = await refreshApplierGeneratedOutputs(nextSession);

  return {
    assistantMessage: {
      id: randomUUID(),
      role: "assistant",
      content: assistantReplyText,
      createdAt: new Date().toISOString(),
    },
    session: nextSession,
  };
}
