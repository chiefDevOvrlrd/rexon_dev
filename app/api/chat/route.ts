import { NextResponse } from "next/server";
import { runAlfredAgent, type AlfredAgentContext } from "@/lib/alfred/agent";
import { appendSessionHistory, getSessionHistory } from "@/lib/alfred/redis";

type AlfredChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  message: string;
  sessionId: string;
  history?: AlfredChatMessage[];
};

type ChatResponseBody = {
  reply: string;
  status: "ongoing" | "qualified" | "borderline" | "declined";
};

// Map agent qualification to widget status
function toStatus(
  qualification: AlfredAgentContext extends any ? any : any
): ChatResponseBody["status"] {
  const q = qualification as "qualified" | "borderline" | "decline";
  if (q === "qualified") return "qualified";
  if (q === "borderline") return "borderline";
  return "declined";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const { message, sessionId } = body;
    const incomingHistory = Array.isArray(body.history) ? body.history : [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `message`" },
        { status: 400 }
      );
    }
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `sessionId`" },
        { status: 400 }
      );
    }

    // Load persisted server-side history
    const persistedHistory =
      await getSessionHistory<AlfredChatMessage>(sessionId);

    // Merge (incoming history wins if provided; otherwise use persisted)
    const history =
      incomingHistory.length > 0 ? incomingHistory : persistedHistory;

    const context: AlfredAgentContext = {
      sessionId,
      history,
      userMessage: message,
    };

    const decision = await runAlfredAgent(context);

    // Persist the new turn (user + assistant). Keep history growing; trim can be handled server-side later.
    await appendSessionHistory<AlfredChatMessage>(sessionId, {
      role: "user",
      content: message,
    });

    await appendSessionHistory<AlfredChatMessage>(sessionId, {
      role: "assistant",
      content: decision.reply,
    });

    const status: ChatResponseBody["status"] =
      decision.qualification === "qualified"
        ? "qualified"
        : decision.qualification === "borderline"
          ? "borderline"
          : "declined";

    const response: ChatResponseBody = {
      reply: decision.reply,
      status,
    };

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
