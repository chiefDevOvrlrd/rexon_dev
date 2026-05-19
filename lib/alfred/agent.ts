import { fastModel } from "./model";
import { getSystemPrompt } from "./prompts";
import { matchKnowledge } from "./knowledge";
import { trimHistoryToLast6 } from "./trimHistory";

export type AlfredQualification = "qualified" | "borderline" | "declined" | "ongoing";

export type LeadData = {
  name?: string;
  email?: string;
  project?: string;
  budget?: string;
  timeline?: string;
};

export type AlfredAgentDecision = {
  qualification: AlfredQualification;
  reply: string;
  leadData?: LeadData;
  shouldBook?: boolean;
  shouldEmailOwner?: boolean;
  shouldEmailCustomer?: boolean;
};

export type AlfredMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AlfredAgentContext = {
  sessionId: string;
  history: AlfredMessage[];
  userMessage: string;
  turnCount: number;
  collectedData: LeadData;
};

// ─── model type ───────────────────────────────────────────────────────────────
type LangChainModel = {
  invoke: (input: string | { role: string; content: string }[]) => Promise<{ content: unknown }>;
};

// ─── model call helper ────────────────────────────────────────────────────────
export async function callModel(
  mdl: LangChainModel,
  prompt: string | { role: string; content: string }[]
): Promise<string> {
  const out = await mdl.invoke(prompt);
  return typeof out?.content === "string" ? out.content : "";
}

// ─── extract lead fields from conversation ────────────────────────────────────
function extractLeadData(history: AlfredMessage[], currentMessage: string): LeadData {
  const allText = [...history.map(m => m.content), currentMessage].join(" ");

  const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const nameMatch = allText.match(
    /(?:i'?m|my name is|i am|call me)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i
  );

  return {
    email: emailMatch?.[0],
    name: nameMatch?.[1],
  };
}

// ─── check if we have enough to qualify ───────────────────────────────────────
function isQualified(data: LeadData): boolean {
  return !!(data.name && data.email && data.project);
}

// ─── main agent ───────────────────────────────────────────────────────────────
export async function runAlfredAgent(
  context: AlfredAgentContext
): Promise<AlfredAgentDecision> {
  const { userMessage, history, turnCount, collectedData } = context;

  // 1. Check knowledge base first — no LLM call needed
  const localAnswer = matchKnowledge(userMessage);
  if (localAnswer) {
    return {
      qualification: "ongoing",
      reply: localAnswer,
      shouldBook: false,
      shouldEmailOwner: false,
      shouldEmailCustomer: false,
    };
  }

  // 2. Extract lead data from current message + history
  const extracted = extractLeadData(history, userMessage);
  const updatedData: LeadData = { ...collectedData, ...extracted };

  // Capture project description from current message if not yet collected
  if (!updatedData.project && userMessage.length > 20) {
    updatedData.project = userMessage;
  }

  // 3. Check if qualified
  if (isQualified(updatedData)) {
    return {
      qualification: "qualified",
      reply: `Perfect, thanks ${updatedData.name}! I have everything I need. Someone from the Rexon Dev team will be in touch at ${updatedData.email} shortly. You can also book a discovery call here.`,
      leadData: updatedData,
      shouldBook: true,
      shouldEmailOwner: true,
      shouldEmailCustomer: true,
    };
  }

  // 4. Hard limit — 8 messages and still not qualified
  if (turnCount >= 8) {
    return {
      qualification: "borderline",
      reply: "Thanks for chatting! I'll pass your details to the team and someone will follow up with you soon.",
      leadData: updatedData,
      shouldBook: false,
      shouldEmailOwner: true,
      shouldEmailCustomer: false,
    };
  }

  // 5. Not enough data yet — call LLM
  const trimmed = await trimHistoryToLast6(history);
  const messages: { role: string; content: string }[] = [
    { role: "system", content: getSystemPrompt() },
    ...trimmed.trimmedMessages.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  let raw = "";
  try {
    raw = await callModel(fastModel as unknown as LangChainModel, messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Alfred] model call failed:", message);
  }

  const reply =
    raw?.trim() ||
    "Thanks — could you share your name, email, and a quick description of what you'd like to build?";

  return {
    qualification: "ongoing",
    reply,
    leadData: updatedData,
    shouldBook: false,
    shouldEmailOwner: false,
    shouldEmailCustomer: false,
  };
}