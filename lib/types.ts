export type UserRole = "client" | "consultant";
export type QuestionTier = "free" | "paid";
export type QuestionComplexity = "simple" | "complex" | null;
export type QuestionStatus = "open" | "resolved";
export type AnswerType = "community" | "expert";
export type SessionStatus = "active" | "closed";
export type ApplierApplicationId =
  | "work-permit"
  | "study-permit"
  | "spousal-sponsorship";
export type ApplierFieldType = "text" | "textarea" | "date" | "select";
export type ApplierDocumentStatus = "ready" | "needs-help" | "missing";
export type ApplierChatRole = "assistant" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  displayName: string;
  bio?: string | null;
  expertiseTags?: string[] | null;
  avgRating?: number;
  ratingCount?: number;
  createdAt?: string;
};

export type Vote = {
  id: string;
  answerId: string;
  userId: string;
  createdAt: string;
};

export type Answer = {
  id: string;
  questionId: string;
  userId: string;
  body: string;
  type: AnswerType;
  upvoteCount: number;
  createdAt: string;
  author?: Profile;
  viewerHasVoted?: boolean;
};

export type Question = {
  id: string;
  userId: string;
  title: string;
  body: string;
  tier: QuestionTier;
  complexity: QuestionComplexity;
  aiAnswer: string | null;
  status: QuestionStatus;
  paid: boolean;
  createdAt: string;
  answers?: Answer[];
};

export type Session = {
  id: string;
  clientId: string;
  consultantId: string;
  questionId?: string | null;
  status: SessionStatus;
  createdAt: string;
  closedAt?: string | null;
  client?: Profile;
  consultant?: Profile;
};

export type Message = {
  id: string;
  sessionId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender?: Profile;
};

export type Rating = {
  id: string;
  sessionId: string;
  clientId: string;
  consultantId: string;
  score: number;
  comment?: string | null;
  createdAt: string;
};

export type DemoStore = {
  profiles: Profile[];
  questions: Question[];
  answers: Answer[];
  votes: Vote[];
  sessions: Session[];
  messages: Message[];
  ratings: Rating[];
};

export type ApplierFieldDefinition = {
  id: string;
  label: string;
  type: ApplierFieldType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[];
};

export type ApplierRequiredDocument = {
  id: string;
  name: string;
  description: string;
  acceptedExamples: string[];
};

export type IrccApplication = {
  id: ApplierApplicationId;
  label: string;
  shortDescription: string;
  packageName: string;
  primaryFormCode: string;
  templateId: string;
  irccUrl: string;
  applyLocation: string;
  userGoalKeywords: string[];
  fields: ApplierFieldDefinition[];
  requiredDocuments: ApplierRequiredDocument[];
  outputDocumentNames: string[];
};

export type ApplierDocumentInput = {
  documentId: string;
  status: ApplierDocumentStatus;
  notes: string;
};

export type ApplierMatchResult = {
  application: IrccApplication;
  reason: string;
  suggestedNextStep: string;
};

export type GeneratedDocument = {
  id: string;
  title: string;
  fileName: string;
  description: string;
  format: "txt" | "md" | "json";
  mimeType: string;
  content: string;
};

export type ApplierChatMessage = {
  id: string;
  role: ApplierChatRole;
  content: string;
  createdAt: string;
};

export type ApplierUploadedFile = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  matchedDocumentId?: string | null;
  matchedDocumentName?: string | null;
};

export type ApplierExtractedDetail = {
  id: string;
  fieldId: string;
  label: string;
  value: string;
  sourceFileId: string;
  sourceFileName: string;
};

export type ApplierRequiredDocumentStatus = {
  documentId: string;
  status: "submitted" | "pending";
  submittedFileIds: string[];
  notes: string;
};

export type ApplierSessionState = {
  userGoal: string;
  match: ApplierMatchResult | null;
  nextStep: string | null;
  applyLocation: string | null;
  applicantInfo: Record<string, string>;
  uploadedFiles: ApplierUploadedFile[];
  extractedDetails: ApplierExtractedDetail[];
  requiredDocumentStatuses: ApplierRequiredDocumentStatus[];
  generatedDocuments: GeneratedDocument[];
  workerRequest: PdfWorkerFillRequest | null;
  workerResponse: PdfWorkerFillResponse | null;
};

export type ApplierChatRouteResponse = {
  assistantMessage: ApplierChatMessage;
  session: ApplierSessionState;
};

export type PdfWorkerFillRequest = {
  templateId: string;
  applicationId: ApplierApplicationId;
  applicantInfo: Record<string, string>;
  documentInputs: ApplierDocumentInput[];
  generatedAt: string;
};

export type PdfWorkerFillResponse = {
  status: "not_configured" | "connected" | "not_supported" | "error";
  message: string;
  details?: string;
};
