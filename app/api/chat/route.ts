import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant";
type ChatStatus = "ongoing" | "qualified" | "borderline" | "declined";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;
const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;
const allowedStatuses = new Set<ChatStatus>([
  "ongoing",
  "qualified",
  "borderline",
  "declined",
]);

const systemPrompt = `You are Alfred, the friendly project assistant for Rexon Dev, a software development and AI automation agency.
Rexon Dev builds websites and applications, custom software, AI automations, and API integrations. Projects are scoped and priced individually after understanding the client's goals.
Be concise, helpful, and natural. Ask one useful follow-up question when project details are unclear. Never invent prices, guarantees, or delivery dates. Do not claim a meeting is booked.
Return only a JSON object with exactly two string properties: "reply" and "status". The status must be one of "ongoing", "qualified", "borderline", or "declined". Use "qualified" when the person has a clear project need and is ready for a follow-up, "borderline" when they show interest but key details are still missing, "declined" only when they clearly reject or end the conversation, and otherwise "ongoing".`;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.length <= MAX_MESSAGE_LENGTH
  );
}

function parseModelReply(content: string): { reply: string; status: ChatStatus } {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;
      if (typeof parsed.reply === "string" && parsed.reply.trim()) {
        return {
          reply: parsed.reply.trim(),
          status: allowedStatuses.has(parsed.status as ChatStatus)
            ? (parsed.status as ChatStatus)
            : "ongoing",
        };
      }
    } catch {
      // Fall back to the model's plain-text response below.
    }
  }

  return { reply: content.trim(), status: "ongoing" };
}

async function checkRateLimit(request: Request) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const key = `alfred:rate:${ip}`;

  try {
    const redis = new Redis({ url, token });
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW_SECONDS);
    return count > RATE_LIMIT;
  } catch (error) {
    console.error("Alfred rate-limit check failed", error);
    return false;
  }
}

async function notifyOwner(sessionId: string, message: string) {
  const apiKey = process.env.INFOBIP_API_KEY;
  const baseUrl = process.env.INFOBIP_BASE_URL;
  const sender = process.env.INFOBIP_WHATSAPP_SENDER;
  const recipient = process.env.INFOBIP_OWNER_WHATSAPP;
  const templateName = process.env.INFOBIP_WHATSAPP_TEMPLATE_NAME;

  if (!apiKey || !baseUrl || !sender || !recipient || !templateName) {
    console.warn("Infobip notification skipped: WhatsApp environment is incomplete");
    return;
  }

  const normalizedBaseUrl = baseUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const endpoint = `https://${normalizedBaseUrl}/whatsapp/1/message/template`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `App ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          from: sender.replace(/\D/g, ""),
          to: recipient.replace(/\D/g, ""),
          content: {
            templateName,
            language: process.env.INFOBIP_WHATSAPP_TEMPLATE_LANGUAGE || "en",
            templateData: {
              body: {
                placeholders: [sessionId.slice(0, 40), message.slice(0, 180)],
              },
            },
          },
        },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Infobip returned ${response.status}: ${details.slice(0, 500)}`);
  }
}

export async function POST(request: Request) {
  if (await checkRateLimit(request)) {
    return NextResponse.json(
      { success: false, message: "Too many messages. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { success: false, message: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const history = Array.isArray(payload.history)
    ? payload.history.filter(isChatMessage).slice(-MAX_HISTORY_LENGTH)
    : [];
  const conversation = history.filter((item) => item.content.trim()).map((item) => ({
    role: item.role,
    content: item.content.trim(),
  }));

  if (conversation.at(-1)?.role !== "user" || conversation.at(-1)?.content !== message) {
    conversation.push({ role: "user", content: message });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json(
      { success: false, message: "The chat assistant is not configured." },
      { status: 503 },
    );
  }

  try {
    const modelResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.FAST_MODEL_ID || "openai/gpt-oss-20b",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          ...conversation,
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!modelResponse.ok) {
      const details = await modelResponse.text();
      console.error(`Groq returned ${modelResponse.status}: ${details.slice(0, 500)}`);
      return NextResponse.json(
        { success: false, message: "The assistant is temporarily unavailable. Please try again." },
        { status: 502 },
      );
    }

    const result = (await modelResponse.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = result.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Groq returned an empty response");

    const assistantReply = parseModelReply(content);
    const sessionId = typeof payload.sessionId === "string"
      ? payload.sessionId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80)
      : "unknown";

    try {
      await notifyOwner(sessionId, message);
    } catch (error) {
      console.error("Infobip notification failed", error);
    }

    return NextResponse.json(assistantReply);
  } catch (error) {
    console.error("Alfred chat request failed", error);
    return NextResponse.json(
      { success: false, message: "The assistant is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}