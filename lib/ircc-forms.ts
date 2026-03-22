import type {
  ApplierApplicationId,
  IrccApplication,
} from "@/lib/types";

export const supportedIrccApplications: IrccApplication[] = [
  {
    id: "work-permit",
    label: "Work permit application",
    shortDescription:
      "Best for users preparing a work permit package tied to an employer, offer, or temporary work plan.",
    packageName: "Apply for a work permit made outside Canada",
    primaryFormCode: "IMM 1295",
    templateId: "IMM1295E",
    irccUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html",
    applyLocation: "Apply online through your IRCC secure account for work permits.",
    userGoalKeywords: [
      "work permit",
      "job offer",
      "employer",
      "temporary work",
      "lmia",
      "work in canada",
    ],
    fields: [
      {
        id: "fullName",
        label: "Full legal name",
        type: "text",
        required: true,
        placeholder: "Enter your full name as shown on your passport",
      },
      {
        id: "passportNumber",
        label: "Passport number",
        type: "text",
        required: true,
        placeholder: "Example: N12345678",
      },
      {
        id: "nationality",
        label: "Nationality",
        type: "text",
        required: true,
        placeholder: "Example: Indian",
      },
      {
        id: "currentCountry",
        label: "Current country of residence",
        type: "text",
        required: true,
        placeholder: "Where are you currently living?",
      },
      {
        id: "employerName",
        label: "Canadian employer name",
        type: "text",
        required: true,
        placeholder: "Employer or company name",
      },
      {
        id: "jobTitle",
        label: "Job title",
        type: "text",
        required: true,
        placeholder: "Example: Software Developer",
      },
      {
        id: "intendedProvince",
        label: "Intended province or territory",
        type: "select",
        required: true,
        options: [
          "Ontario",
          "British Columbia",
          "Alberta",
          "Quebec",
          "Manitoba",
          "Nova Scotia",
          "Other",
        ],
      },
      {
        id: "workHistory",
        label: "Relevant work history summary",
        type: "textarea",
        required: true,
        placeholder: "Summarize experience relevant to the work permit application.",
      },
    ],
    requiredDocuments: [
      {
        id: "passportCopy",
        name: "Passport copy",
        description: "Identity page and any pages showing status, visas, or travel history.",
        acceptedExamples: [
          "Passport bio page PDF",
          "Passport scan bundle",
          "Travel history pages",
        ],
      },
      {
        id: "jobOffer",
        name: "Job offer or employment contract",
        description:
          "Document showing the employer, position, wages, and terms of work in Canada.",
        acceptedExamples: [
          "Offer letter",
          "Signed employment agreement",
          "Employer contract PDF",
        ],
      },
      {
        id: "lmiaOrEmployerPortal",
        name: "LMIA or employer compliance evidence",
        description:
          "Proof the employer completed the required work permit support step.",
        acceptedExamples: [
          "Positive LMIA letter",
          "Employer portal submission receipt",
          "Exemption code support note",
        ],
      },
      {
        id: "resume",
        name: "Resume or work experience summary",
        description: "Supports your background and helps populate work history fields.",
        acceptedExamples: ["Resume PDF", "CV", "Experience summary"],
      },
      {
        id: "digitalPhoto",
        name: "Digital photo",
        description: "Recent immigration-style photo meeting IRCC specifications.",
        acceptedExamples: ["JPEG passport photo", "Digital photo upload"],
      },
    ],
    outputDocumentNames: [
      "IMM1295E-draft-field-map.json",
      "work-permit-application-summary.md",
      "required-document-checklist.md",
    ],
  },
  {
    id: "study-permit",
    label: "Study permit application",
    shortDescription:
      "Best for users preparing a study permit package to attend a Canadian school or college.",
    packageName: "Apply for a study permit outside Canada",
    primaryFormCode: "IMM 1294",
    templateId: "IMM1294E",
    irccUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
    applyLocation: "Apply online through your IRCC secure account for study permits.",
    userGoalKeywords: [
      "study permit",
      "college",
      "university",
      "school",
      "student visa",
      "study in canada",
    ],
    fields: [
      {
        id: "fullName",
        label: "Full legal name",
        type: "text",
        required: true,
        placeholder: "Enter your full name as shown on your passport",
      },
      {
        id: "passportNumber",
        label: "Passport number",
        type: "text",
        required: true,
        placeholder: "Example: P9876543",
      },
      {
        id: "nationality",
        label: "Nationality",
        type: "text",
        required: true,
        placeholder: "Example: Nigerian",
      },
      {
        id: "schoolName",
        label: "School or DLI name",
        type: "text",
        required: true,
        placeholder: "Example: Humber College",
      },
      {
        id: "programName",
        label: "Program name",
        type: "text",
        required: true,
        placeholder: "Example: Project Management",
      },
      {
        id: "programStartDate",
        label: "Program start date",
        type: "date",
        required: true,
      },
      {
        id: "fundingPlan",
        label: "Funding plan summary",
        type: "textarea",
        required: true,
        placeholder: "How will tuition and living costs be covered?",
      },
      {
        id: "studyGoals",
        label: "Study goals and future plan",
        type: "textarea",
        required: true,
        placeholder: "Why this program and how does it fit your goals?",
      },
    ],
    requiredDocuments: [
      {
        id: "passportCopy",
        name: "Passport copy",
        description: "Identity page and relevant travel or visa pages.",
        acceptedExamples: ["Passport bio page PDF", "Passport scans"],
      },
      {
        id: "letterOfAcceptance",
        name: "Letter of acceptance",
        description: "Proof of admission from a designated learning institution.",
        acceptedExamples: [
          "Acceptance letter PDF",
          "DLI admission letter",
        ],
      },
      {
        id: "proofOfFunds",
        name: "Proof of funds",
        description:
          "Financial documents showing you can cover tuition and living costs.",
        acceptedExamples: [
          "Bank statements",
          "Sponsor letter",
          "Tuition payment receipt",
        ],
      },
      {
        id: "educationHistory",
        name: "Academic transcripts or certificates",
        description: "Documents supporting previous studies and qualifications.",
        acceptedExamples: ["Transcripts", "Degree certificate", "Mark sheets"],
      },
      {
        id: "studyPlan",
        name: "Statement of purpose or study plan",
        description:
          "Explains why you want to study in Canada and how the program fits your goals.",
        acceptedExamples: ["Study plan letter", "SOP document"],
      },
    ],
    outputDocumentNames: [
      "IMM1294E-draft-field-map.json",
      "study-permit-application-summary.md",
      "proof-of-funds-checklist.md",
    ],
  },
  {
    id: "spousal-sponsorship",
    label: "Spousal sponsorship application",
    shortDescription:
      "Best for users preparing a spouse or partner sponsorship package for permanent residence.",
    packageName: "Sponsor your spouse, partner, or dependent child",
    primaryFormCode: "IMM 1344 / IMM 5532",
    templateId: "IMM1344-IMM5532",
    irccUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship/spouse-partner-children.html",
    applyLocation:
      "Apply through the IRCC family sponsorship portal or package instructions for spouses and partners.",
    userGoalKeywords: [
      "spouse sponsorship",
      "partner sponsorship",
      "family sponsorship",
      "sponsor wife",
      "sponsor husband",
      "pr through spouse",
    ],
    fields: [
      {
        id: "sponsorName",
        label: "Sponsor full name",
        type: "text",
        required: true,
        placeholder: "Canadian sponsor's full legal name",
      },
      {
        id: "applicantName",
        label: "Applicant full name",
        type: "text",
        required: true,
        placeholder: "Sponsored person's full legal name",
      },
      {
        id: "relationshipType",
        label: "Relationship type",
        type: "select",
        required: true,
        options: ["Married", "Common-law", "Conjugal partner"],
      },
      {
        id: "relationshipStartDate",
        label: "Relationship start date",
        type: "date",
        required: true,
      },
      {
        id: "currentCountry",
        label: "Applicant current country",
        type: "text",
        required: true,
        placeholder: "Where is the applicant living now?",
      },
      {
        id: "sponsorStatus",
        label: "Sponsor status in Canada",
        type: "select",
        required: true,
        options: ["Canadian citizen", "Permanent resident"],
      },
      {
        id: "relationshipHistory",
        label: "Relationship history summary",
        type: "textarea",
        required: true,
        placeholder: "Summarize how the relationship developed over time.",
      },
      {
        id: "cohabitationDetails",
        label: "Cohabitation or contact details",
        type: "textarea",
        required: true,
        placeholder: "Explain living arrangements, travel, or communication patterns.",
      },
    ],
    requiredDocuments: [
      {
        id: "identityDocs",
        name: "Identity documents for both parties",
        description: "Passports and civil identity documents for sponsor and applicant.",
        acceptedExamples: ["Passport copies", "National ID", "Birth certificate"],
      },
      {
        id: "marriageOrRelationshipProof",
        name: "Marriage certificate or relationship proof",
        description:
          "Evidence of marriage or a genuine relationship depending on the category.",
        acceptedExamples: [
          "Marriage certificate",
          "Shared lease",
          "Joint bills",
          "Travel photos",
        ],
      },
      {
        id: "sponsorStatusProof",
        name: "Proof of sponsor status in Canada",
        description: "Shows the sponsor is a Canadian citizen or permanent resident.",
        acceptedExamples: [
          "PR card copy",
          "Canadian passport copy",
          "Citizenship certificate",
        ],
      },
      {
        id: "policeCertificates",
        name: "Police certificates",
        description: "Background certificates for the applicant where required.",
        acceptedExamples: ["Police clearance", "Character certificate"],
      },
      {
        id: "relationshipNarrative",
        name: "Relationship narrative support",
        description: "Personal explanation that supports the relationship timeline.",
        acceptedExamples: ["Timeline document", "Relationship statement"],
      },
    ],
    outputDocumentNames: [
      "IMM1344-IMM5532-draft-field-map.json",
      "spousal-sponsorship-package-summary.md",
      "relationship-evidence-checklist.md",
    ],
  },
];

export function getIrccApplicationById(applicationId: ApplierApplicationId) {
  return (
    supportedIrccApplications.find((application) => application.id === applicationId) ||
    null
  );
}

export function getApplierCatalog() {
  return supportedIrccApplications.map((application) => ({
    id: application.id,
    label: application.label,
    shortDescription: application.shortDescription,
    primaryFormCode: application.primaryFormCode,
    packageName: application.packageName,
  }));
}
