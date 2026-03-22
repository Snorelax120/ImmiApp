import { randomUUID } from "node:crypto";

import { getIrccApplicationById } from "@/lib/ircc-forms";
import type {
  ApplierApplicationId,
  ApplierExtractedDetail,
  ApplierUploadedFile,
} from "@/lib/types";

type FileLike = {
  name: string;
  type: string;
  size: number;
};

function inferDocumentId(fileName: string, applicationId?: ApplierApplicationId) {
  const normalized = fileName.toLowerCase();

  if (normalized.includes("passport")) {
    return "passportCopy";
  }

  if (
    normalized.includes("offer") ||
    normalized.includes("contract") ||
    normalized.includes("employment")
  ) {
    return "jobOffer";
  }

  if (normalized.includes("lmia") || normalized.includes("employer-portal")) {
    return "lmiaOrEmployerPortal";
  }

  if (normalized.includes("resume") || normalized.includes("cv")) {
    return "resume";
  }

  if (normalized.includes("photo") || normalized.includes("jpeg")) {
    return "digitalPhoto";
  }

  if (
    normalized.includes("acceptance") ||
    normalized.includes("loa") ||
    normalized.includes("admission")
  ) {
    return "letterOfAcceptance";
  }

  if (
    normalized.includes("fund") ||
    normalized.includes("bank") ||
    normalized.includes("statement")
  ) {
    return "proofOfFunds";
  }

  if (
    normalized.includes("transcript") ||
    normalized.includes("degree") ||
    normalized.includes("marksheet")
  ) {
    return "educationHistory";
  }

  if (normalized.includes("sop") || normalized.includes("study-plan")) {
    return "studyPlan";
  }

  if (
    normalized.includes("marriage") ||
    normalized.includes("relationship") ||
    normalized.includes("wedding")
  ) {
    return "marriageOrRelationshipProof";
  }

  if (
    normalized.includes("pr-card") ||
    normalized.includes("citizenship") ||
    normalized.includes("sponsor-passport")
  ) {
    return "sponsorStatusProof";
  }

  if (normalized.includes("police")) {
    return "policeCertificates";
  }

  if (applicationId === "spousal-sponsorship") {
    return "relationshipNarrative";
  }

  return null;
}

function buildExtractedDetails(
  sourceFileId: string,
  sourceFileName: string,
  documentId: string | null,
) {
  const addDetail = (
    fieldId: string,
    label: string,
    value: string,
  ): ApplierExtractedDetail => ({
    id: randomUUID(),
    fieldId,
    label,
    value,
    sourceFileId,
    sourceFileName,
  });

  switch (documentId) {
    case "passportCopy":
      return [
        addDetail("fullName", "Full legal name", "Ava Patel"),
        addDetail("passportNumber", "Passport number", "P1234567"),
        addDetail("nationality", "Nationality", "Indian"),
        addDetail("currentCountry", "Current country of residence", "United States"),
      ];
    case "jobOffer":
      return [
        addDetail("employerName", "Canadian employer name", "Northern Maple Tech"),
        addDetail("jobTitle", "Job title", "Software Developer"),
        addDetail("intendedProvince", "Intended province or territory", "Ontario"),
      ];
    case "resume":
      return [
        addDetail(
          "workHistory",
          "Relevant work history summary",
          "Three years of software development experience in backend systems and cloud tooling.",
        ),
      ];
    case "letterOfAcceptance":
      return [
        addDetail("schoolName", "School or DLI name", "Humber College"),
        addDetail("programName", "Program name", "Project Management"),
        addDetail("programStartDate", "Program start date", "2026-09-01"),
      ];
    case "proofOfFunds":
      return [
        addDetail(
          "fundingPlan",
          "Funding plan summary",
          "Savings plus family support shown through recent bank statements.",
        ),
      ];
    case "studyPlan":
      return [
        addDetail(
          "studyGoals",
          "Study goals and future plan",
          "The applicant wants a Canadian credential that supports long-term career growth in operations and project delivery.",
        ),
      ];
    case "marriageOrRelationshipProof":
      return [
        addDetail("sponsorName", "Sponsor full name", "Mateo Alvarez"),
        addDetail("applicantName", "Applicant full name", "Ava Patel"),
        addDetail("relationshipType", "Relationship type", "Married"),
        addDetail("relationshipStartDate", "Relationship start date", "2022-06-12"),
      ];
    case "sponsorStatusProof":
      return [
        addDetail("sponsorStatus", "Sponsor status in Canada", "Permanent resident"),
      ];
    case "relationshipNarrative":
      return [
        addDetail(
          "relationshipHistory",
          "Relationship history summary",
          "The couple met in graduate school, married in 2024, and have continued living together and travelling together since then.",
        ),
        addDetail(
          "cohabitationDetails",
          "Cohabitation or contact details",
          "Shared lease, shared utility bills, and regular travel records are available.",
        ),
      ];
    default:
      return [];
  }
}

export function extractMockDataFromFiles(
  files: FileLike[],
  applicationId?: ApplierApplicationId,
) {
  const application = applicationId ? getIrccApplicationById(applicationId) : null;
  const uploadedFiles: ApplierUploadedFile[] = [];
  const extractedDetails: ApplierExtractedDetail[] = [];
  const applicantInfoPatch: Record<string, string> = {};

  for (const file of files) {
    const matchedDocumentId = inferDocumentId(file.name, applicationId);
    const matchedDocumentName =
      application?.requiredDocuments.find((doc) => doc.id === matchedDocumentId)?.name ||
      null;

    const uploadedFile: ApplierUploadedFile = {
      id: randomUUID(),
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
      matchedDocumentId,
      matchedDocumentName,
    };

    uploadedFiles.push(uploadedFile);

    const details = buildExtractedDetails(
      uploadedFile.id,
      uploadedFile.fileName,
      matchedDocumentId,
    );

    for (const detail of details) {
      extractedDetails.push(detail);
      applicantInfoPatch[detail.fieldId] = detail.value;
    }
  }

  const assistantSummary = uploadedFiles.length
    ? `I reviewed ${uploadedFiles.length} uploaded file${
        uploadedFiles.length === 1 ? "" : "s"
      } and updated the structured panel with mocked extracted details.`
    : "No files were uploaded.";

  return {
    uploadedFiles,
    extractedDetails,
    applicantInfoPatch,
    assistantSummary,
  };
}
