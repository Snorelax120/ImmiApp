import type {
  Answer,
  DemoStore,
  Message,
  Profile,
  Question,
  Rating,
  Session,
  Vote,
} from "@/lib/types";

export const defaultDemoUserId = "demo-client-ava";

export const seedProfiles: Profile[] = [
  {
    id: "demo-client-ava",
    role: "client",
    displayName: "Ava Patel",
    bio: "Prospective applicant comparing Canadian permanent residency options.",
    expertiseTags: [],
    avgRating: 0,
    ratingCount: 0,
    createdAt: "2026-03-22T08:00:00.000Z",
  },
  {
    id: "demo-client-liam",
    role: "client",
    displayName: "Liam Chen",
    bio: "Demo client account for community and consultation flows.",
    expertiseTags: [],
    avgRating: 0,
    ratingCount: 0,
    createdAt: "2026-03-22T08:02:00.000Z",
  },
  {
    id: "consultant-simran",
    role: "consultant",
    displayName: "Simran Kaur, RCIC",
    bio: "Focuses on Express Entry, work permits, and family sponsorship strategy.",
    expertiseTags: ["Express Entry", "Work Permits", "Family Sponsorship"],
    avgRating: 4.9,
    ratingCount: 14,
    createdAt: "2026-03-22T07:00:00.000Z",
  },
  {
    id: "consultant-mateo",
    role: "consultant",
    displayName: "Mateo Alvarez, RCIC",
    bio: "Handles complex refusals, inadmissibility, and restoration pathways.",
    expertiseTags: ["Refusals", "Inadmissibility", "Restoration"],
    avgRating: 4.8,
    ratingCount: 11,
    createdAt: "2026-03-22T07:05:00.000Z",
  },
];

export const seedQuestions: Question[] = [
  {
    id: "demo-free-question",
    userId: "demo-client-liam",
    title: "How long does Express Entry usually take after submitting a profile?",
    body: "I am trying to understand the typical timeline from profile submission to receiving a final PR decision in Canada.",
    tier: "free",
    complexity: "simple",
    aiAnswer: null,
    status: "open",
    paid: false,
    createdAt: "2026-03-22T09:00:00.000Z",
  },
  {
    id: "demo-paid-question",
    userId: "demo-client-ava",
    title: "I have Canadian work experience and a master's degree. Which PR pathways should I compare?",
    body: "I have two years of Canadian work experience, a master's degree, and CLB 9 English scores. I want to understand my strongest permanent residency options.",
    tier: "paid",
    complexity: "simple",
    aiAnswer:
      "Direct answer:\nYou likely have a strong profile for Express Entry, especially through the Canadian Experience Class. Depending on your province, a Provincial Nominee Program stream may also improve your options.\n\nKey points:\n- Compare your CRS score under Express Entry.\n- Review CEC eligibility first because you already have Canadian work experience.\n- Check whether your province has aligned PNP streams for skilled workers.\n\nRelevant pathways:\n- Canadian Experience Class\n- Federal Skilled Worker Program\n- Provincial Nominee Program\n\nDisclaimer:\nThis is an AI-generated summary and not legal advice.",
    status: "open",
    paid: true,
    createdAt: "2026-03-22T08:00:00.000Z",
  },
  {
    id: "demo-complex-question",
    userId: "demo-client-ava",
    title: "I was refused twice, had a DUI in 2019, and want to apply through my spouse. What are my options?",
    body: "I have two visitor visa refusals, a DUI from 2019, and my spouse is a Canadian permanent resident. I want to know if I can still pursue a work permit or permanent residence path.",
    tier: "paid",
    complexity: "complex",
    aiAnswer:
      "Direct answer:\nYour case likely needs a more careful strategy because both inadmissibility concerns and previous refusals can affect how future applications are assessed. You may still have options, but the order and framing of those options matters.\n\nKey points:\n- Review whether criminal rehabilitation or temporary resident permit considerations apply.\n- Previous refusals should be analyzed before filing again to avoid repeating weak facts or missing documents.\n- Spousal sponsorship or work permit options may exist, but depend on admissibility and current status.\n\nRelevant pathways:\n- Spousal sponsorship\n- Rehabilitation-related inadmissibility strategy\n- Temporary resident permit or other discretionary pathways where appropriate\n\nDisclaimer:\nThis is an AI-generated summary and not legal advice.",
    status: "open",
    paid: true,
    createdAt: "2026-03-22T07:30:00.000Z",
  },
];

export const seedAnswers: Answer[] = [
  {
    id: "answer-community-1",
    questionId: "demo-free-question",
    userId: "demo-client-ava",
    body: "For many straightforward cases, people often talk about several months after invitation, but it depends on biometrics, medicals, and document completeness.",
    type: "community",
    upvoteCount: 2,
    createdAt: "2026-03-22T09:20:00.000Z",
  },
  {
    id: "answer-expert-1",
    questionId: "demo-paid-question",
    userId: "consultant-simran",
    body: "With your profile, I would compare Canadian Experience Class first, then check whether any Ontario or BC-aligned PNP streams can improve certainty if your CRS is borderline.",
    type: "expert",
    upvoteCount: 4,
    createdAt: "2026-03-22T08:15:00.000Z",
  },
  {
    id: "answer-expert-2",
    questionId: "demo-complex-question",
    userId: "consultant-mateo",
    body: "Because refusals and a DUI can change admissibility analysis, I would not rely on a generic filing path without first reviewing the refusal reasons and rehabilitation timeline.",
    type: "expert",
    upvoteCount: 3,
    createdAt: "2026-03-22T07:45:00.000Z",
  },
];

export const seedVotes: Vote[] = [
  {
    id: "vote-1",
    answerId: "answer-community-1",
    userId: "demo-client-liam",
    createdAt: "2026-03-22T09:25:00.000Z",
  },
  {
    id: "vote-2",
    answerId: "answer-community-1",
    userId: "consultant-simran",
    createdAt: "2026-03-22T09:27:00.000Z",
  },
  {
    id: "vote-3",
    answerId: "answer-expert-1",
    userId: "demo-client-ava",
    createdAt: "2026-03-22T08:20:00.000Z",
  },
  {
    id: "vote-4",
    answerId: "answer-expert-1",
    userId: "demo-client-liam",
    createdAt: "2026-03-22T08:21:00.000Z",
  },
  {
    id: "vote-5",
    answerId: "answer-expert-1",
    userId: "consultant-mateo",
    createdAt: "2026-03-22T08:22:00.000Z",
  },
  {
    id: "vote-6",
    answerId: "answer-expert-1",
    userId: "consultant-simran",
    createdAt: "2026-03-22T08:23:00.000Z",
  },
  {
    id: "vote-7",
    answerId: "answer-expert-2",
    userId: "demo-client-ava",
    createdAt: "2026-03-22T07:47:00.000Z",
  },
  {
    id: "vote-8",
    answerId: "answer-expert-2",
    userId: "consultant-simran",
    createdAt: "2026-03-22T07:48:00.000Z",
  },
  {
    id: "vote-9",
    answerId: "answer-expert-2",
    userId: "demo-client-liam",
    createdAt: "2026-03-22T07:49:00.000Z",
  },
];

export const seedSessions: Session[] = [
  {
    id: "session-demo-1",
    clientId: "demo-client-ava",
    consultantId: "consultant-mateo",
    questionId: "demo-complex-question",
    status: "active",
    createdAt: "2026-03-22T07:55:00.000Z",
    closedAt: null,
  },
];

export const seedMessages: Message[] = [
  {
    id: "message-1",
    sessionId: "session-demo-1",
    senderId: "demo-client-ava",
    body: "I want to understand whether the DUI makes me inadmissible right away.",
    createdAt: "2026-03-22T07:56:00.000Z",
  },
  {
    id: "message-2",
    sessionId: "session-demo-1",
    senderId: "consultant-mateo",
    body: "It can affect admissibility analysis, but the exact impact depends on the offence details, sentence, and rehabilitation timeline.",
    createdAt: "2026-03-22T07:58:00.000Z",
  },
];

export const seedRatings: Rating[] = [];

export function createInitialDemoStore(): DemoStore {
  return {
    profiles: structuredClone(seedProfiles),
    questions: structuredClone(seedQuestions),
    answers: structuredClone(seedAnswers),
    votes: structuredClone(seedVotes),
    sessions: structuredClone(seedSessions),
    messages: structuredClone(seedMessages),
    ratings: structuredClone(seedRatings),
  };
}
