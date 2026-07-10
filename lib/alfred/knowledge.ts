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

// ───────────────────────────────────────────────────────────────
// Outreach Knowledge
// Used by Alfred when generating personalized outreach
// ───────────────────────────────────────────────────────────────

export const outreachKnowledge = {
  "Real Estate": {
    solution:
      "AI agents that handle repetitive customer questions like property availability and pricing, plus qualify leads before they reach your team",
    repetitiveTask: "answering the same questions all day",
    benefit: "closing deals",
    commonQuestions: [
      "property availability",
      "pricing",
      "payment plans",
      "site inspections",
      "locations",
    ],
  },

  Logistics: {
    solution:
      "automated systems that handle customer enquiries, shipment tracking and order updates without manual intervention",
    repetitiveTask:
      "answering delivery status and order tracking questions",
    benefit: "running logistics operations",
    commonQuestions: [
      "order tracking",
      "delivery status",
      "shipping cost",
      "pickup requests",
      "delivery ETA",
    ],
  },

  Healthcare: {
    solution:
      "AI agents that answer patient enquiries, book appointments and automate follow-ups",
    repetitiveTask: "answering patient questions all day",
    benefit: "looking after patients",
    commonQuestions: [
      "appointment booking",
      "doctor availability",
      "consultation fees",
      "opening hours",
      "test results",
    ],
  },

  Dental: {
    solution:
      "AI agents that manage appointment scheduling, treatment enquiries and patient reminders",
    repetitiveTask: "handling appointment enquiries",
    benefit: "treating patients",
    commonQuestions: [
      "appointment availability",
      "pricing",
      "teeth whitening",
      "braces",
      "follow-up visits",
    ],
  },

  ISP: {
    solution:
      "AI agents that resolve repetitive customer questions like balance checks and connectivity troubleshooting while qualifying new subscribers",
    repetitiveTask:
      "answering the same technical questions every day",
    benefit: "running the business",
    commonQuestions: [
      "internet outage",
      "slow speeds",
      "balance",
      "subscription",
      "installation",
    ],
  },

  Hotel: {
    solution:
      "AI agents that answer booking enquiries, room availability and reservation questions automatically",
    repetitiveTask:
      "responding to booking enquiries throughout the day",
    benefit: "serving guests",
    commonQuestions: [
      "room availability",
      "pricing",
      "check-in",
      "check-out",
      "reservations",
    ],
  },

  Restaurant: {
    solution:
      "AI agents that automate reservations, menu enquiries and delivery questions",
    repetitiveTask:
      "answering customer enquiries all day",
    benefit: "serving customers",
    commonQuestions: [
      "reservations",
      "menu",
      "delivery",
      "opening hours",
      "pricing",
    ],
  },

  Automotive: {
    solution:
      "AI agents that answer service enquiries, book appointments and qualify vehicle sales leads",
    repetitiveTask:
      "handling service booking enquiries",
    benefit: "servicing customers",
    commonQuestions: [
      "service booking",
      "vehicle availability",
      "pricing",
      "parts",
      "repairs",
    ],
  },

  "Law Firm": {
    solution:
      "AI agents that qualify potential clients, answer legal service enquiries and schedule consultations",
    repetitiveTask:
      "handling consultation enquiries",
    benefit: "serving clients",
    commonQuestions: [
      "consultation booking",
      "practice areas",
      "legal fees",
      "office hours",
      "case enquiries",
    ],
  },

  Beauty: {
    solution:
      "AI agents that answer service enquiries, recommend treatments and manage appointment bookings",
    repetitiveTask:
      "responding to appointment enquiries",
    benefit: "working with clients",
    commonQuestions: [
      "appointments",
      "pricing",
      "services",
      "availability",
      "location",
    ],
  },

  Gym: {
    solution:
      "AI agents that answer membership questions, class schedules and personal training enquiries",
    repetitiveTask:
      "handling membership enquiries",
    benefit: "helping members",
    commonQuestions: [
      "membership",
      "pricing",
      "class schedule",
      "personal training",
      "opening hours",
    ],
  },

  Education: {
    solution:
      "AI agents that automate admissions enquiries, application support and student FAQs",
    repetitiveTask:
      "answering admission questions",
    benefit: "supporting students",
    commonQuestions: [
      "admissions",
      "fees",
      "courses",
      "deadlines",
      "requirements",
    ],
  },

  "Travel Agency": {
    solution:
      "AI agents that automate travel enquiries, itinerary questions and booking requests",
    repetitiveTask:
      "handling booking enquiries",
    benefit: "planning trips",
    commonQuestions: [
      "flight booking",
      "visa",
      "holiday packages",
      "pricing",
      "availability",
    ],
  },

  Construction: {
    solution:
      "AI agents that qualify project enquiries and automate quotation requests",
    repetitiveTask:
      "answering quotation enquiries",
    benefit: "delivering projects",
    commonQuestions: [
      "quotes",
      "project timelines",
      "services",
      "pricing",
      "consultations",
    ],
  },

  "E-commerce": {
    solution:
      "AI agents that answer product questions, order enquiries and return requests while qualifying high-intent customers",
    repetitiveTask:
      "answering customer support enquiries",
    benefit: "growing sales",
    commonQuestions: [
      "order status",
      "returns",
      "shipping",
      "product availability",
      "payment",
    ],
  },

  Laundry: {
    solution:
      "AI agents that answer pricing enquiries, collect pickup requests and automate order updates",
    repetitiveTask:
      "answering customer questions all day",
    benefit: "getting orders completed",
    commonQuestions: [
      "pickup requests",
      "pricing",
      "turnaround time",
      "delivery",
      "payment",
    ],
  },

  Retail: {
    solution:
      "AI agents that automate product enquiries, stock availability and customer support",
    repetitiveTask:
      "answering product enquiries",
    benefit: "selling products",
    commonQuestions: [
      "stock availability",
      "pricing",
      "returns",
      "delivery",
      "payment",
    ],
  },

  Finance: {
    solution:
      "AI agents that automate customer enquiries, onboarding and financial support requests",
    repetitiveTask:
      "handling repetitive customer enquiries",
    benefit: "serving customers",
    commonQuestions: [
      "account opening",
      "loan enquiries",
      "payments",
      "balances",
      "support",
    ],
  },

  Insurance: {
    solution:
      "AI agents that qualify policy enquiries, automate claims support and answer common customer questions",
    repetitiveTask:
      "handling policy enquiries",
    benefit: "processing policies and claims",
    commonQuestions: [
      "claims",
      "coverage",
      "quotes",
      "renewals",
      "payments",
    ],
  },

  Other: {
    solution:
        "AI agents and automation systems that reduce repetitive work and improve customer experience",
    repetitiveTask:
        "handling repetitive customer enquiries",
    benefit:
        "growing the business",
    commonQuestions: [],
  },
} as const;