import {
  createQuestionInDemo,
  getQuestionInDemo,
  listQuestionsInDemo,
  updateQuestionInDemo,
} from "@/lib/demo-store";
import { getOpenAIClient } from "@/lib/openai";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  Question,
  QuestionComplexity,
  QuestionStatus,
  QuestionTier,
} from "@/lib/types";

type QuestionRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  tier: QuestionTier;
  complexity: QuestionComplexity;
  ai_answer: string | null;
  status: QuestionStatus;
  paid: boolean;
  created_at: string;
};

type CreateQuestionInput = {
  title: string;
  body: string;
  tier: QuestionTier;
  userId?: string;
};

function sortQuestions(questions: Question[]) {
  return [...questions].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function mapQuestionRow(row: QuestionRow): Question {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    tier: row.tier,
    complexity: row.complexity,
    aiAnswer: row.ai_answer,
    status: row.status,
    paid: row.paid,
    createdAt: row.created_at,
  };
}

function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function isComplexQuestion(text: string) {
  const complexSignals = [
    "refusal",
    "inadmissibility",
    "dui",
    "criminal",
    "appeal",
    "multiple pathways",
    "spouse",
    "medical",
    "misrepresentation",
    "removal",
  ];

  return complexSignals.some((signal) => text.toLowerCase().includes(signal));
}

function buildDemoAiAnswer(question: Question) {
  return [
    "Direct answer:",
    `This appears to be a ${question.tier} immigration question about Canadian pathways and next steps. Your strongest options usually depend on eligibility, timeline, and supporting documents.`,
    "",
    "Key points:",
    "- Confirm which federal or provincial stream best matches your work, education, and language background.",
    "- Review recent IRCC guidance for the program you are targeting.",
    "- Gather documents early so you can move quickly if invited to apply.",
    "",
    "Relevant pathways:",
    "- Express Entry",
    "- Provincial Nominee Program",
    "- Family or employer-supported pathways where relevant",
    "",
    "Disclaimer:",
    "This is an AI-generated summary for MVP demo purposes and not legal advice.",
  ].join("\n");
}

async function classifyQuestion(question: Question): Promise<QuestionComplexity> {
  const openai = getOpenAIClient();

  if (!openai) {
    return isComplexQuestion(`${question.title}\n${question.body}`)
      ? "complex"
      : "simple";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Classify this Canadian immigration question as "simple" or "complex".
Simple: general info, timelines, document lists, eligibility basics.
Complex: multiple pathways, refusals, inadmissibility, specific case details, legal interpretation.
Respond with ONLY a JSON object: { "complexity": "simple" | "complex" }`,
      },
      {
        role: "user",
        content: `${question.title}\n\n${question.body}`,
      },
    ],
    max_tokens: 50,
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    return "simple";
  }

  try {
    const parsed = JSON.parse(content) as { complexity?: QuestionComplexity };
    return parsed.complexity === "complex" ? "complex" : "simple";
  } catch {
    return "simple";
  }
}

async function generateAiAnswer(question: Question) {
  const openai = getOpenAIClient();

  if (!openai) {
    return buildDemoAiAnswer(question);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a Canadian immigration assistant. Provide a structured answer with:
1. A direct answer (2-3 sentences)
2. Key points (bullet list)
3. Relevant immigration programs or pathways
4. A disclaimer that this is AI-generated and not legal advice.
Be specific to Canadian immigration law and IRCC processes.`,
      },
      {
        role: "user",
        content: `${question.title}\n\n${question.body}`,
      },
    ],
    max_tokens: 800,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || buildDemoAiAnswer(question);
}

async function updateQuestion(
  questionId: string,
  updates: Partial<Pick<Question, "complexity" | "aiAnswer" | "paid">>,
) {
  if (hasSupabase()) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      throw new Error("Supabase admin client is not configured.");
    }

    const { error } = await supabase
      .from("questions")
      .update({
        complexity: updates.complexity,
        ai_answer: updates.aiAnswer,
        paid: updates.paid,
      })
      .eq("id", questionId);

    if (error) {
      throw new Error(error.message);
    }
  }

  updateQuestionInDemo(questionId, updates);
}

export async function listQuestions() {
  if (hasSupabase()) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      throw new Error("Supabase admin client is not configured.");
    }

    const { data, error } = await supabase
      .from("questions")
      .select(
        "id, user_id, title, body, tier, complexity, ai_answer, status, paid, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as QuestionRow[] | null)?.map(mapQuestionRow) || [];
  }

  return sortQuestions(listQuestionsInDemo());
}

export async function getQuestionById(questionId: string) {
  if (hasSupabase()) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      throw new Error("Supabase admin client is not configured.");
    }

    const { data, error } = await supabase
      .from("questions")
      .select(
        "id, user_id, title, body, tier, complexity, ai_answer, status, paid, created_at",
      )
      .eq("id", questionId)
      .single();

    if (error) {
      return null;
    }

    return mapQuestionRow(data as QuestionRow);
  }

  return getQuestionInDemo(questionId);
}

export async function createQuestion(input: CreateQuestionInput) {
  const payload = {
    title: input.title.trim(),
    body: input.body.trim(),
    tier: input.tier,
  };

  if (!payload.title || !payload.body) {
    throw new Error("Title and question details are required.");
  }

  if (hasSupabase()) {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      throw new Error("Supabase admin client is not configured.");
    }

    const { data, error } = await supabase
      .from("questions")
      .insert({
        user_id: input.userId || "00000000-0000-0000-0000-000000000000",
        title: payload.title,
        body: payload.body,
        tier: payload.tier,
        paid: payload.tier === "free",
      })
      .select(
        "id, user_id, title, body, tier, complexity, ai_answer, status, paid, created_at",
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapQuestionRow(data as QuestionRow);
  }

  return createQuestionInDemo({
    userId: input.userId || "demo-client-ava",
    title: payload.title,
    body: payload.body,
    tier: payload.tier,
  });
}

export async function runClassification(questionId: string) {
  const question = await getQuestionById(questionId);

  if (!question) {
    throw new Error("Question not found.");
  }

  const complexity = await classifyQuestion(question);
  await updateQuestion(questionId, { complexity });
  return complexity;
}

export async function runAiAnswer(questionId: string) {
  const question = await getQuestionById(questionId);

  if (!question) {
    throw new Error("Question not found.");
  }

  const aiAnswer = await generateAiAnswer(question);
  await updateQuestion(questionId, { aiAnswer });
  return aiAnswer;
}

export async function markQuestionPaid(questionId: string) {
  await updateQuestion(questionId, { paid: true });
}

export async function runPaidQuestionPipeline(questionId: string) {
  await markQuestionPaid(questionId);
  await Promise.all([runClassification(questionId), runAiAnswer(questionId)]);
}

export async function createCheckoutSession(questionId: string) {
  await runPaidQuestionPipeline(questionId);
  return `/questions/${questionId}?payment=demo`;
}
