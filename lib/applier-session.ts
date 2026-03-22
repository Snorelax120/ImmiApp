import { supportedIrccApplications } from "@/lib/ircc-forms";
import type {
  ApplierApplicationId,
  ApplierExtractedDetail,
  ApplierRequiredDocumentStatus,
  ApplierUploadedFile,
} from "@/lib/types";

export function buildRequiredDocumentStatuses(
  applicationId: ApplierApplicationId | null | undefined,
  uploadedFiles: ApplierUploadedFile[],
): ApplierRequiredDocumentStatus[] {
  const application = applicationId
    ? supportedIrccApplications.find((item) => item.id === applicationId) || null
    : null;

  if (!application) {
    return [];
  }

  return application.requiredDocuments.map((document) => {
    const submittedFiles = uploadedFiles.filter(
      (file) => file.matchedDocumentId === document.id,
    );

    return {
      documentId: document.id,
      status: submittedFiles.length ? "submitted" : "pending",
      submittedFileIds: submittedFiles.map((file) => file.id),
      notes: submittedFiles.length
        ? `Submitted: ${submittedFiles.map((file) => file.fileName).join(", ")}`
        : "Waiting for user upload.",
    };
  });
}

export function mergeApplicantInfoFromExtractedDetails(
  currentApplicantInfo: Record<string, string>,
  extractedDetails: ApplierExtractedDetail[],
) {
  const nextApplicantInfo = { ...currentApplicantInfo };

  for (const detail of extractedDetails) {
    nextApplicantInfo[detail.fieldId] = detail.value;
  }

  return nextApplicantInfo;
}
