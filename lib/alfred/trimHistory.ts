import { fastModel } from "./model";

type AlfredMessage = {
  _getType?: () => string;
  content: unknown;
};

/**
 * Keeps last 6 messages verbatim in context.
 * Summarizes older ones into a single prepended string using fastModel.
 * No verbatim old messages beyond the last 6.
 */
export type TrimHistoryResult = {
  summary: string;
  trimmedMessages: AlfredMessage[];
};

function safeContent(m: AlfredMessage): string {
  const c = (m as any)?.content;
  return typeof c === "string" ? c : "";
}

function messagesToText(messages: AlfredMessage[]): string {
  return messages
    .map((m) => {
      const type = typeof (m as any)?._getType === "function" ? (m as any)._getType() : "message";
      return `${type}: ${safeContent(m)}`;
    })
    .join("\n")
    .trim();
}

export async function trimHistoryToLast6(history: AlfredMessage[]): Promise<TrimHistoryResult> {
  const lastN = 6;

  if (history.length <= lastN) {
    return { summary: "", trimmedMessages: history };
  }

  const older = history.slice(0, history.length - lastN);
  const last = history.slice(history.length - lastN);

  const olderText = messagesToText(older);

  const summaryPrompt = [
    "Summarize the following conversation history for lead verification.",
    "Requirements:",
    "- Keep only facts relevant to qualification, needs, timeline, budget, and contact details.",
    "- Remove pleasantries and repetition.",
    "- Output ONLY the summary text (no JSON, no labels).",
    "",
    "Conversation:",
    olderText,
  ].join("\n");

  const modelAny = fastModel as any;
  const modelResponse: any =
    typeof modelAny.invoke === "function"
      ? await modelAny.invoke(summaryPrompt)
      : typeof modelAny.call === "function"
        ? await modelAny.call(summaryPrompt)
        : typeof modelAny.generate === "function"
          ? await modelAny.generate([summaryPrompt])
          : await modelAny;

  const summaryCandidate: unknown = modelResponse?.content ?? modelResponse?.text ?? modelResponse;

  const summary =
    typeof summaryCandidate === "string"
      ? summaryCandidate
      : typeof modelResponse === "string"
        ? modelResponse
        : typeof modelResponse?.text === "string"
          ? modelResponse.text
          : "";

  return { summary: summary.trim(), trimmedMessages: last };
}
