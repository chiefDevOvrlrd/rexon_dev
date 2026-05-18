import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

/**
 * ONLY this file should import any LLM provider SDK.
 * Everything else should import { fastModel, smartModel } from here.
 * Model IDs are configurable via env vars with safe defaults:
 * - FAST_MODEL_ID: gemini-2.5-flash
 * - SMART_MODEL_ID: gemini-2.5-flash
 */

export const FAST_MODEL_ID = process.env.FAST_MODEL_ID ?? "gemini-3-flash";
export const SMART_MODEL_ID = process.env.SMART_MODEL_ID ?? "gemini-2.5-flash";

export const fastModel = new ChatGoogleGenerativeAI({
  model: FAST_MODEL_ID,
  maxOutputTokens: 500,
  temperature: 0.4,
});

export const smartModel = new ChatGoogleGenerativeAI({
  model: SMART_MODEL_ID,
  maxOutputTokens: 1000,
  temperature: 0.6,
});

/**
 * --- Swap examples (commented out) ---
 *
 * Claude (example)
 * import { Anthropic } from "@langchain/anthropic";
 * export const fastModel = new Anthropic({ model: "claude-3-5-sonnet-latest", maxTokens: 300, temperature: 0.4 });
 *
 * OpenAI (example)
 * import { ChatOpenAI } from "@langchain/openai";
 * export const fastModel = new ChatOpenAI({ model: "gpt-4o-mini", maxTokens: 300, temperature: 0.4 });
 *
 * Groq (example)
 * import { ChatGroq } from "@langchain/groq";
 * export const fastModel = new ChatGroq({ model: "llama-3.1-70b-versatile", maxTokens: 300, temperature: 0.4 });
 */
