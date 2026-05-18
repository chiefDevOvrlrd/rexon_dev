// lib/alfred/knowledge.ts

export const knowledge = [
  {
    keywords: ["what do you do", "what does rexon", "what is rexon", "about rexon", "about the agency", "your services", "what services", "what can you"],
    answer: "Rexon Dev is a software development agency that builds web apps, mobile apps, backends, and MVPs for startups and businesses. We also offer UI/UX design and maintenance retainers. Anything specific you'd like to know more about?"
  },
  {
    keywords: ["do you build websites", "do you make websites", "can you build a website", "web development", "do you do web"],
    answer: "Yes — we build modern web apps using Next.js and React, from landing pages to full-stack platforms. What are you looking to build?"
  },
  {
    keywords: ["do you build mobile", "do you make apps", "can you build an app", "mobile app", "ios", "android", "react native"],
    answer: "Yes, we build cross-platform mobile apps with React Native — one codebase for both iOS and Android. What kind of app do you have in mind?"
  },
  {
    keywords: ["do you do backend", "api development", "do you build apis", "database", "server side"],
    answer: "Yes — we handle backend development with Node.js, REST APIs, GraphQL, and database design. What are you building?"
  },
  {
    keywords: ["do you do design", "ui ux", "do you design", "figma", "wireframe", "prototype"],
    answer: "Yes, we do UI/UX design — wireframes, prototypes, and full design systems. We can design-only or design and build together."
  },
  {
    keywords: ["mvp", "do you build mvps", "minimum viable", "validate my idea", "startup idea"],
    answer: "MVP development is one of our specialties — we help startups go from idea to working product fast without over-engineering. What's the idea?"
  },
  {
    keywords: ["how much does it cost", "what is your pricing", "how much do you charge", "what are your rates", "pricing"],
    answer: "We work on custom quotes — pricing depends on scope, timeline, and complexity. The best way to get a real number is a quick discovery call. Want me to help you book one?"
  },
  {
    keywords: ["how long does it take", "what is your timeline", "how fast can you", "how long will it take", "turnaround"],
    answer: "Timelines vary — a landing page can be 1–2 weeks, a full web app or MVP typically 6–12 weeks. We give a proper estimate on the discovery call."
  },
  {
    keywords: ["how does it work", "what is your process", "how do you work", "what are the steps"],
    answer: "We start with a discovery call, then send a proposal with scope and timeline. Once approved we move into design, then development, then launch."
  },
  {
    keywords: ["retainer", "ongoing support", "maintenance plan", "do you offer support"],
    answer: "Yes — we offer monthly retainers for ongoing support, updates, and new features. Great if you want a reliable dev team on call."
  },
  {
    keywords: ["who are you", "are you a bot", "are you human", "are you ai", "what are you"],
    answer: "I'm Alfred, an assistant for Rexon Dev. I help match you with the right team and get things moving. What brings you here today?"
  },
  {
    keywords: ["can i speak to someone", "talk to a human", "contact the team", "reach someone", "speak to a person"],
    answer: "Absolutely — the fastest way is a discovery call. I can help you book one right now. Want to go ahead?"
  },
]

// ─── matcher — only fires on clear questions, not statements ──────────────────
export function matchKnowledge(message: string): string | null {
  const lower = message.toLowerCase().trim()

  // Only match if message looks like a question or direct inquiry
  // Statements like "I'm building an ecom site" should pass through to the LLM
  const isQuestion =
    lower.includes("?") ||
    lower.startsWith("what") ||
    lower.startsWith("how") ||
    lower.startsWith("do you") ||
    lower.startsWith("can you") ||
    lower.startsWith("are you") ||
    lower.startsWith("who are") ||
    lower.startsWith("tell me about") ||
    lower.startsWith("i want to know") ||
    lower.startsWith("what's") ||
    lower.startsWith("whats")

  if (!isQuestion) return null

  const match = knowledge.find(entry =>
    entry.keywords.some(keyword => lower.includes(keyword))
  )

  return match?.answer ?? null
}