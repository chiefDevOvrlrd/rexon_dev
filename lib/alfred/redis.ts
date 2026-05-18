import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

// ============================================
// SESSION HISTORY (conversation storage)
// ============================================

export async function getSessionHistory<T>(sessionId: string): Promise<T[]> {
  const key = `alfred:session:${sessionId}:history`;
  const value = await redis.get<T[]>(key);
  return Array.isArray(value) ? value : [];
}

export async function setSessionHistory<T>(sessionId: string, history: T[]): Promise<void> {
  const key = `alfred:session:${sessionId}:history`;
  await redis.set(key, history, { ex: 60 * 60 * 24 * 7 }); // 7 days
}

export async function appendSessionHistory<T>(sessionId: string, message: T): Promise<void> {
  const history = await getSessionHistory<T>(sessionId);
  history.push(message);
  await setSessionHistory(sessionId, history);
}

// ============================================
// REDIS LANGCACHE (LLM response caching)
// ============================================

function normalizeCacheKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*[:;,.!?]+\s*/g, " ")
    .trim();
}

function hashCacheKey(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function buildCacheKey(
  modelId: string,
  cacheMode: "exact" | "intent",
  key: string
): string {
  const normalized = normalizeCacheKey(key);
  return `alfred:llm-cache:${cacheMode}:${modelId}:${hashCacheKey(normalized)}`;
}

async function getCachedString(key: string): Promise<string | null> {
  try {
    const cached = await redis.get<string>(key);
    return typeof cached === "string" ? cached : null;
  } catch (err) {
    console.warn("[Redis LLMCache] get failed:", err);
    return null;
  }
}

async function setCachedString(key: string, value: string): Promise<void> {
  try {
    await redis.set(key, value, { ex: CACHE_TTL_SECONDS });
  } catch (err) {
    console.warn("[Redis LLMCache] set failed:", err);
  }
}

export async function getCachedLLMResponse(
  prompt: string,
  modelId: string,
  cacheMode: "exact" | "intent" = "exact"
): Promise<string | null> {
  const cacheKey = buildCacheKey(modelId, cacheMode, prompt);
  return getCachedString(cacheKey);
}

export async function setCachedLLMResponse(
  prompt: string,
  modelId: string,
  response: string,
  cacheMode: "exact" | "intent" = "exact"
): Promise<void> {
  const cacheKey = buildCacheKey(modelId, cacheMode, prompt);
  await setCachedString(cacheKey, response);
}

