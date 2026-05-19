import { fastModel } from "./model";

type LangChainModel = {
  invoke: (input: string) => Promise<{ content: string | unknown }>
}

export type AlfredMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TrimHistoryResult = {
  summary: string;
  trimmedMessages: AlfredMessage[];
};

function messagesToText(messages: AlfredMessage[]): string {
  return messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")
    .trim();
}

export async function trimHistoryToLast6(
  history: AlfredMessage[]
): Promise<TrimHistoryResult> {
  const lastN = 6;

  if (history.length <= lastN) {
    return { summary: "", trimmedMessages: history };
  }

  const older = history.slice(0, history.length - lastN);
  const last = history.slice(history.length - lastN);
  const olderText = messagesToText(older);

  const summaryPrompt = [
    "Summarize the following conversation history for lead verification.",
    "- Keep only facts relevant to qualification, needs, timeline, budget, and contact details.",
    "- Remove pleasantries and repetition.",
    "- Output ONLY the summary text (no JSON, no labels).",
    "",
    "Conversation:",
    olderText,
  ].join("\n");

  const out = await (fastModel as unknown as LangChainModel).invoke(summaryPrompt);

  const summary = typeof out.content === "string" ? out.content : "";

  return { summary: summary.trim(), trimmedMessages: last };
}