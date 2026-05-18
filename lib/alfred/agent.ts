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

// ─── model call helper ────────────────────────────────────────────────────────
export async function callModel(mdl: any, prompt: any): Promise<string> {
  const out: any = typeof mdl.invoke === "function"
    ? await mdl.invoke(prompt)
    : typeof mdl.call === "function"
    ? await mdl.call(prompt)
    : typeof mdl.generate === "function"
    ? await mdl.generate([prompt])
    : await mdl;

  return typeof out?.content === "string" ? out.content
    : typeof out === "string" ? out
    : typeof out?.text === "string" ? out.text
    : "";
}

// ─── extract lead fields from conversation so far ─────────────────────────────
function extractLeadData(history: AlfredMessage[], currentMessage: string): LeadData {
  const allText = [...history.map(m => m.content), currentMessage].join(" ");

  const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  // name is usually given early — look for "I'm X", "my name is X", or just a standalone name
  const nameMatch = allText.match(/(?:i'?m|my name is|i am|call me)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i);

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

  // 2. Extract any lead data from current message + history
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

  // 4. Hard budget — 8 messages and still not qualified
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

  // 5. Not enough data yet — call LLM to continue conversation
  const trimmed = await trimHistoryToLast6(history);
  const messages = [
    { role: "system", content: getSystemPrompt() },
    ...trimmed.trimmedMessages.map(m => ({ role: (m as any).role ?? "user", content: (m as any).content ?? "" })),
    { role: "user", content: userMessage },
  ];

  let raw = "";
  try {
    raw = await callModel(fastModel, messages);
  } catch (err: any) {
    console.error("[Alfred] model call failed:", err?.message ?? err);
  }

  const reply = raw?.trim() ||
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