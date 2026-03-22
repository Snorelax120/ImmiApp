import { getIrccApplicationById, supportedIrccApplications } from "@/lib/ircc-forms";
import type {
  ApplierApplicationId,
  ApplierDocumentInput,
  ApplierMatchResult,
  GeneratedDocument,
  IrccApplication,
  PdfWorkerFillRequest,
  PdfWorkerFillResponse,
} from "@/lib/types";

type MatchInput = {
  applicationId?: ApplierApplicationId;
  userGoal?: string;
};

type FillInput = {
  applicationId: ApplierApplicationId;
  userGoal?: string;
  applicantInfo: Record<string, string>;
  documentInputs: ApplierDocumentInput[];
};

function scoreApplication(application: IrccApplication, userGoal: string) {
  const normalizedGoal = userGoal.toLowerCase();

  return application.userGoalKeywords.reduce((score, keyword) => {
    return normalizedGoal.includes(keyword.toLowerCase()) ? score + 1 : score;
  }, 0);
}

function formatFieldLabel(fieldId: string) {
  return fieldId
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase())
    .trim();
}

function formatDocumentStatus(status: ApplierDocumentInput["status"]) {
  switch (status) {
    case "ready":
      return "Ready to provide";
    case "needs-help":
      return "Needs AI help";
    case "missing":
      return "Still missing";
    default:
      return status;
  }
}

function buildApplicantSummary(
  application: IrccApplication,
  applicantInfo: Record<string, string>,
) {
  return application.fields
    .map((field) => {
      const value = applicantInfo[field.id]?.trim() || "Not provided";
      return `- ${field.label}: ${value}`;
    })
    .join("\n");
}

function buildDocumentChecklist(
  application: IrccApplication,
  documentInputs: ApplierDocumentInput[],
) {
  return application.requiredDocuments
    .map((document) => {
      const response = documentInputs.find((input) => input.documentId === document.id);
      const status = response ? formatDocumentStatus(response.status) : "Not reviewed";
      const notes = response?.notes?.trim() || "No notes provided";

      return [
        `- ${document.name}`,
        `  - Status: ${status}`,
        `  - Why IRCC asks for it: ${document.description}`,
        `  - User note: ${notes}`,
        `  - Accepted examples: ${document.acceptedExamples.join(", ")}`,
      ].join("\n");
    })
    .join("\n");
}

function buildFieldMap(
  application: IrccApplication,
  applicantInfo: Record<string, string>,
) {
  const entries = application.fields.map((field) => [
    field.id,
    applicantInfo[field.id]?.trim() || "",
  ]);

  return Object.fromEntries(entries);
}

function buildGeneratedDocuments(
  application: IrccApplication,
  userGoal: string,
  applicantInfo: Record<string, string>,
  documentInputs: ApplierDocumentInput[],
  workerRequest: PdfWorkerFillRequest,
) {
  const applicantSummary = buildApplicantSummary(application, applicantInfo);
  const documentChecklist = buildDocumentChecklist(application, documentInputs);
  const fieldMap = buildFieldMap(application, applicantInfo);

  const draftSummary = [
    `# ${application.label} draft package`,
    "",
    `IRCC package: ${application.packageName}`,
    `Primary form: ${application.primaryFormCode}`,
    `Official page: ${application.irccUrl}`,
    "",
    "## User goal",
    userGoal || "No freeform goal provided.",
    "",
    "## Applicant profile",
    applicantSummary,
    "",
    "## Required documents",
    documentChecklist,
    "",
    "## Next review",
    "Use this draft summary to verify personal details, fill any missing supporting evidence, and confirm the final IRCC checklist before submission.",
  ].join("\n");

  const coverNote = [
    `Application type: ${application.label}`,
    `Package name: ${application.packageName}`,
    `Primary form: ${application.primaryFormCode}`,
    "",
    "AI assistant notes:",
    "- This is a hackathon demo draft, not a legal submission.",
    "- Review every field against the official IRCC instruction guide.",
    "- Replace any placeholder, estimate, or summary with the exact source document before filing.",
    "",
    "Documents the applicant should still review:",
    ...documentInputs.map((input) => {
      const document = application.requiredDocuments.find(
        (item) => item.id === input.documentId,
      );

      return `- ${document?.name || formatFieldLabel(input.documentId)}: ${formatDocumentStatus(
        input.status,
      )}`;
    }),
  ].join("\n");

  const documents: GeneratedDocument[] = [
    {
      id: "draft-summary",
      title: "Application summary",
      fileName: application.outputDocumentNames[1] || "application-summary.md",
      description:
        "A user-facing draft package summary showing the selected IRCC path, applicant details, and checklist.",
      format: "md",
      mimeType: "text/markdown",
      content: draftSummary,
    },
    {
      id: "checklist",
      title: "Required document checklist",
      fileName: application.outputDocumentNames[2] || "required-documents.md",
      description:
        "A clean checklist the applicant can use to track which supporting documents are ready or still missing.",
      format: "md",
      mimeType: "text/markdown",
      content: [
        `# ${application.label} required documents`,
        "",
        documentChecklist,
      ].join("\n"),
    },
    {
      id: "worker-payload",
      title: "PDF/XFA worker payload",
      fileName: application.outputDocumentNames[0] || "worker-payload.json",
      description:
        "The normalized payload that would be sent to the PDFium/XFA worker when real filling is enabled.",
      format: "json",
      mimeType: "application/json",
      content: JSON.stringify(
        {
          ...workerRequest,
          fieldMap,
        },
        null,
        2,
      ),
    },
    {
      id: "cover-note",
      title: "AI assistant cover note",
      fileName: `${application.id}-ai-cover-note.txt`,
      description:
        "A short handoff note describing what the applicant should verify before final submission.",
      format: "txt",
      mimeType: "text/plain",
      content: coverNote,
    },
  ];

  return documents;
}

export function matchIrccApplication(input: MatchInput): ApplierMatchResult {
  if (input.applicationId) {
    const application = getIrccApplicationById(input.applicationId);

    if (!application) {
      throw new Error("Selected application type is not supported yet.");
    }

    return {
      application,
      reason: `Matched directly from the selected application type: ${application.label}.`,
      suggestedNextStep:
        "Review the official IRCC link, gather the listed documents, and complete the applicant details below.",
    };
  }

  const userGoal = input.userGoal?.trim();

  if (!userGoal) {
    throw new Error("Please describe the immigration goal or choose an application type.");
  }

  const scoredApplications = supportedIrccApplications
    .map((application) => ({
      application,
      score: scoreApplication(application, userGoal),
    }))
    .sort((left, right) => right.score - left.score);

  const bestMatch =
    scoredApplications.find((item) => item.score > 0)?.application ||
    supportedIrccApplications[0];

  return {
    application: bestMatch,
    reason: `Matched to ${bestMatch.label} based on the user's goal: "${userGoal}".`,
    suggestedNextStep:
      "Double-check that this is the right IRCC path, then gather the document list and generate the draft package.",
  };
}

export async function sendToPdfWorker(
  workerRequest: PdfWorkerFillRequest,
): Promise<PdfWorkerFillResponse> {
  const workerUrl = process.env.PDF_WORKER_URL;

  if (!workerUrl) {
    return {
      status: "not_configured",
      message:
        "The PDF/XFA worker is scaffolded in-repo but not configured for this environment yet.",
    };
  }

  try {
    const response = await fetch(`${workerUrl.replace(/\/$/, "")}/fill-xfa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.PDF_WORKER_API_KEY
          ? { "x-api-key": process.env.PDF_WORKER_API_KEY }
          : {}),
      },
      body: JSON.stringify(workerRequest),
      signal: AbortSignal.timeout(8000),
    });

    const payload = (await response.json()) as {
      status?: string;
      message?: string;
      details?: string;
    };

    if (!response.ok) {
      return {
        status: "error",
        message: payload.message || "The PDF worker returned an error.",
        details: payload.details,
      };
    }

    return {
      status:
        payload.status === "connected" || payload.status === "not_supported"
          ? payload.status
          : "connected",
      message: payload.message || "Connected to the PDF worker.",
      details: payload.details,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "The PDF worker could not be reached.",
      details: "Keep using the demo-generated outputs while the worker is offline.",
    };
  }
}

export async function generateApplierDraft(input: FillInput) {
  const match = matchIrccApplication({
    applicationId: input.applicationId,
    userGoal: input.userGoal,
  });

  const workerRequest: PdfWorkerFillRequest = {
    templateId: match.application.templateId,
    applicationId: match.application.id,
    applicantInfo: input.applicantInfo,
    documentInputs: input.documentInputs,
    generatedAt: new Date().toISOString(),
  };

  const generatedDocuments = buildGeneratedDocuments(
    match.application,
    input.userGoal?.trim() || "",
    input.applicantInfo,
    input.documentInputs,
    workerRequest,
  );

  const workerResponse = await sendToPdfWorker(workerRequest);

  return {
    match,
    generatedDocuments,
    workerRequest,
    workerResponse,
  };
}
