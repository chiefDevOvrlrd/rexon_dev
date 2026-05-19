import { NextResponse } from "next/server";
import { runAlfredAgent } from "@/lib/alfred/agent";
import type { AlfredMessage, LeadData } from "@/lib/alfred/agent";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

type SessionData = {
  history: AlfredMessage[];
  turnCount: number;
  collectedData: LeadData;
};

type ChatRequestBody = {
  message: string;
  sessionId: string;
};

type ChatResponseBody = {
  reply: string;
  status: "ongoing" | "qualified" | "borderline" | "declined";
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { message, sessionId } = body;

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

    // 1. Load full session from Redis
    const existing = await redis.get<SessionData>(`session:${sessionId}`);
    const session: SessionData = existing ?? {
      history: [],
      turnCount: 0,
      collectedData: {},
    };

    // 2. Run Alfred with full session state
    const decision = await runAlfredAgent({
      sessionId,
      userMessage: message,
      history: session.history,
      turnCount: session.turnCount,
      collectedData: session.collectedData,
    });

    // 3. Build updated session
    const updatedSession: SessionData = {
      history: [
        ...session.history,
        { role: "user", content: message },
        { role: "assistant", content: decision.reply },
      ],
      turnCount: session.turnCount + 1,
      collectedData: decision.leadData ?? session.collectedData,
    };

    // 4. Save back to Redis — expire after 1 hour
    await redis.set(`session:${sessionId}`, updatedSession, { ex: 3600 });

    // 5. If qualified or borderline, log the lead
    if (
      (decision.qualification === "qualified" ||
        decision.qualification === "borderline") &&
      decision.leadData?.email
    ) {
      await redis.set(
        `lead:${Date.now()}:${decision.leadData.email}`,
        {
          ...decision.leadData,
          timestamp: new Date().toISOString(),
          status: decision.qualification,
          turnCount: updatedSession.turnCount,
        },
        { ex: 60 * 60 * 24 * 90 } // 90 days
      );
    }

    // 6. Map qualification to response status
    const status: ChatResponseBody["status"] =
      decision.qualification === "qualified" ? "qualified"
      : decision.qualification === "borderline" ? "borderline"
      : decision.qualification === "declined" ? "declined"
      : "ongoing";

    return NextResponse.json({ reply: decision.reply, status });

  } catch (e) {
    console.error("[Alfred] chat route error:", e);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}