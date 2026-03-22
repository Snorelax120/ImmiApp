import { randomUUID } from "node:crypto";

import { createInitialDemoStore } from "@/lib/mock-data";
import type {
  Answer,
  DemoStore,
  Message,
  Question,
  Rating,
  Session,
} from "@/lib/types";

declare global {
  var __immigrationDemoStore: DemoStore | undefined;
}

function sortByNewest<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function sortAnswers(items: Answer[]) {
  return [...items].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "expert" ? -1 : 1;
    }

    if (left.upvoteCount !== right.upvoteCount) {
      return right.upvoteCount - left.upvoteCount;
    }

    return (
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  });
}

export function getDemoStore() {
  if (!globalThis.__immigrationDemoStore) {
    globalThis.__immigrationDemoStore = createInitialDemoStore();
  }

  return globalThis.__immigrationDemoStore;
}

export function listProfiles() {
  return getDemoStore().profiles;
}

export function getProfileById(profileId: string) {
  return getDemoStore().profiles.find((profile) => profile.id === profileId) || null;
}

export function listConsultants() {
  return getDemoStore().profiles.filter((profile) => profile.role === "consultant");
}

export function getConsultantById(consultantId: string) {
  const profile = getProfileById(consultantId);
  return profile?.role === "consultant" ? profile : null;
}

export function listQuestionsInDemo() {
  return sortByNewest(getDemoStore().questions);
}

export function getQuestionInDemo(questionId: string) {
  return getDemoStore().questions.find((question) => question.id === questionId) || null;
}

export function createQuestionInDemo(input: {
  title: string;
  body: string;
  tier: Question["tier"];
  userId: string;
}) {
  const question: Question = {
    id: randomUUID(),
    userId: input.userId,
    title: input.title,
    body: input.body,
    tier: input.tier,
    complexity: null,
    aiAnswer: null,
    status: "open",
    paid: input.tier === "free",
    createdAt: new Date().toISOString(),
  };

  getDemoStore().questions.unshift(question);
  return question;
}

export function updateQuestionInDemo(
  questionId: string,
  updates: Partial<Pick<Question, "complexity" | "aiAnswer" | "paid" | "status">>,
) {
  const store = getDemoStore();
  const index = store.questions.findIndex((question) => question.id === questionId);

  if (index === -1) {
    throw new Error("Question not found.");
  }

  store.questions[index] = {
    ...store.questions[index],
    ...updates,
  };

  return store.questions[index];
}

export function listAnswersForQuestion(questionId: string, viewerId?: string | null) {
  const store = getDemoStore();

  const answers = store.answers
    .filter((answer) => answer.questionId === questionId)
    .map((answer) => ({
      ...answer,
      author: getProfileById(answer.userId) || undefined,
      viewerHasVoted: viewerId
        ? store.votes.some(
            (vote) => vote.answerId === answer.id && vote.userId === viewerId,
          )
        : false,
    }));

  return sortAnswers(answers);
}

export function createAnswerInDemo(input: {
  questionId: string;
  body: string;
  userId: string;
}) {
  const question = getQuestionInDemo(input.questionId);
  const user = getProfileById(input.userId);

  if (!question) {
    throw new Error("Question not found.");
  }

  if (!user) {
    throw new Error("Demo user not found.");
  }

  const answer: Answer = {
    id: randomUUID(),
    questionId: input.questionId,
    userId: input.userId,
    body: input.body.trim(),
    type: user.role === "consultant" ? "expert" : "community",
    upvoteCount: 0,
    createdAt: new Date().toISOString(),
  };

  getDemoStore().answers.push(answer);
  return answer;
}

export function toggleAnswerVoteInDemo(answerId: string, userId: string) {
  const store = getDemoStore();
  const answer = store.answers.find((item) => item.id === answerId);

  if (!answer) {
    throw new Error("Answer not found.");
  }

  const existingVote = store.votes.find(
    (vote) => vote.answerId === answerId && vote.userId === userId,
  );

  if (existingVote) {
    store.votes = store.votes.filter((vote) => vote.id !== existingVote.id);
    answer.upvoteCount = Math.max(0, answer.upvoteCount - 1);
    return { upvoted: false, upvoteCount: answer.upvoteCount };
  }

  store.votes.push({
    id: randomUUID(),
    answerId,
    userId,
    createdAt: new Date().toISOString(),
  });
  answer.upvoteCount += 1;
  return { upvoted: true, upvoteCount: answer.upvoteCount };
}

export function getConsultantProfileData(consultantId: string) {
  const consultant = getConsultantById(consultantId);

  if (!consultant) {
    return null;
  }

  const answeredQuestions = getDemoStore().answers
    .filter((answer) => answer.userId === consultantId && answer.type === "expert")
    .map((answer) => getQuestionInDemo(answer.questionId))
    .filter((question): question is Question => Boolean(question));

  return {
    consultant,
    answeredQuestions: sortByNewest(
      Array.from(new Map(answeredQuestions.map((question) => [question.id, question])).values()),
    ),
  };
}

export function listSessionsForUser(userId: string) {
  const store = getDemoStore();

  return sortByNewest(
    store.sessions
      .filter(
        (session) => session.clientId === userId || session.consultantId === userId,
      )
      .map((session) => ({
        ...session,
        client: getProfileById(session.clientId) || undefined,
        consultant: getProfileById(session.consultantId) || undefined,
      })),
  );
}

export function createSessionInDemo(input: {
  clientId: string;
  consultantId: string;
  questionId?: string | null;
}) {
  const existing = getDemoStore().sessions.find(
    (session) =>
      session.clientId === input.clientId &&
      session.consultantId === input.consultantId &&
      session.questionId === (input.questionId || null) &&
      session.status === "active",
  );

  if (existing) {
    return existing;
  }

  const session: Session = {
    id: randomUUID(),
    clientId: input.clientId,
    consultantId: input.consultantId,
    questionId: input.questionId || null,
    status: "active",
    createdAt: new Date().toISOString(),
    closedAt: null,
  };

  getDemoStore().sessions.unshift(session);
  return session;
}

export function getSessionWithMessages(sessionId: string) {
  const store = getDemoStore();
  const session = store.sessions.find((item) => item.id === sessionId);

  if (!session) {
    return null;
  }

  const messages = sortByNewest(
    store.messages
      .filter((message) => message.sessionId === sessionId)
      .map((message) => ({
        ...message,
        sender: getProfileById(message.senderId) || undefined,
      })),
  ).reverse();

  const rating =
    store.ratings.find((item) => item.sessionId === sessionId) || null;

  return {
    session: {
      ...session,
      client: getProfileById(session.clientId) || undefined,
      consultant: getProfileById(session.consultantId) || undefined,
    },
    messages,
    rating,
    question: session.questionId ? getQuestionInDemo(session.questionId) : null,
  };
}

export function addSessionMessageInDemo(input: {
  sessionId: string;
  senderId: string;
  body: string;
}) {
  const session = getDemoStore().sessions.find((item) => item.id === input.sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.status !== "active") {
    throw new Error("This session has already been closed.");
  }

  const message: Message = {
    id: randomUUID(),
    sessionId: input.sessionId,
    senderId: input.senderId,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };

  getDemoStore().messages.push(message);
  return message;
}

export function closeSessionInDemo(sessionId: string) {
  const store = getDemoStore();
  const session = store.sessions.find((item) => item.id === sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  session.status = "closed";
  session.closedAt = new Date().toISOString();
  return session;
}

export function rateSessionInDemo(input: {
  sessionId: string;
  clientId: string;
  score: number;
  comment?: string;
}) {
  const store = getDemoStore();
  const session = store.sessions.find((item) => item.id === input.sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.clientId !== input.clientId) {
    throw new Error("Only the client can submit a rating.");
  }

  if (store.ratings.some((rating) => rating.sessionId === input.sessionId)) {
    throw new Error("A rating has already been submitted for this session.");
  }

  const rating: Rating = {
    id: randomUUID(),
    sessionId: input.sessionId,
    clientId: input.clientId,
    consultantId: session.consultantId,
    score: input.score,
    comment: input.comment?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  store.ratings.push(rating);

  const consultant = getConsultantById(session.consultantId);

  if (consultant) {
    const currentCount = consultant.ratingCount || 0;
    const currentAverage = consultant.avgRating || 0;
    consultant.avgRating =
      ((currentAverage * currentCount) + input.score) / (currentCount + 1);
    consultant.ratingCount = currentCount + 1;
  }

  return rating;
}
