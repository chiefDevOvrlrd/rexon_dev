// Single source of truth for everything the marketing site says about Rexon.
// Every product/project carries `ask` — the message Alfred receives when a
// visitor taps "Ask Alfred", so the DM opens already about that product.

export type Product = {
  id: string;
  name: string;
  kind: "AI Agent" | "Product";
  channels: string[];
  tagline: string;
  description: string;
  outcomes: string[];
  illustration: string;
  ask: string;
};

export type Project = {
  id: string;
  title: string;
  tag: string;
  description: string;
  thumbnail: string;
  teaser?: string;
  ask: string;
};

export type Service = {
  title: string;
  description: string;
  image: string;
  featured?: boolean;
};

export const heroStats = [
  { value: "20+ hrs", label: "saved per week for business owners" },
  { value: "24/7", label: "replies on WhatsApp & Telegram" },
  { value: "100%", label: "custom-coded, no template bots" },
];

export const services: Service[] = [
  {
    title: "AI Agent Automation",
    description:
      "Custom WhatsApp, Telegram and website agents that answer customers, qualify leads, take orders and follow up, so you stop losing sales to slow replies.",
    image: "/ai-automation.svg",
    featured: true,
  },
  {
    title: "Web Development",
    description:
      "Fast, responsive websites and web apps built on modern frameworks, made to convert visitors and scale with you.",
    image: "/website-creator-animate.svg",
  },
  {
    title: "Mobile Development",
    description:
      "Polished iOS and Android apps with intuitive design and dependable performance.",
    image: "/mobile-development-animate.svg",
  },
  {
    title: "UI/UX Design",
    description:
      "Research-led interfaces that look sharp and feel effortless, from first sketch to final handoff.",
    image: "/ui-ux-design-animate.svg",
  },
  {
    title: "Custom Software",
    description:
      "When off-the-shelf tools don't fit, we build the exact system your operations need.",
    image: "/developer-activity-animate.svg",
  },
  {
    title: "API Integration",
    description:
      "Connect your CRM, store, payments and messaging so data flows on its own and manual work disappears.",
    image: "/software-code-testing-animate.svg",
  },
];

export const products: Product[] = [
  {
    id: "alfred",
    name: "Alfred",
    kind: "AI Agent",
    channels: ["Website", "Email", "WhatsApp"],
    tagline: "Your AI sales rep that never sleeps",
    description:
      "Alfred finds leads, scores them, writes personalised outreach and runs the follow-ups. On your website he answers questions and books appointments. You're already talking to him.",
    outcomes: ["Lead discovery & scoring", "Personalised outreach", "Follow-up sequences", "FAQ & booking"],
    illustration: "/setup-analytics-animate.svg",
    ask: "Hi Alfred, I'd like to know more about you as a product. How could an AI sales rep like you work for my business?",
  },
  {
    id: "phone-vendor-agent",
    name: "WhatsApp Sales Agent",
    kind: "AI Agent",
    channels: ["WhatsApp", "Google Sheets"],
    tagline: "For phone & gadget vendors",
    description:
      "Customers ask for a phone and the agent finds the exact model in your inventory, quotes the price, suggests alternatives within budget and answers FAQs. Update stock in a Google Sheet and the agent stays in sync.",
    outcomes: ["Exact-match inventory search", "Budget-based recommendations", "Edit stock in Google Sheets", "Handles FAQs instantly"],
    illustration: "/mobile-development-animate.svg",
    ask: "Hi Alfred, I'd like to know more about the WhatsApp Sales Agent for phone and gadget vendors. How does it handle my inventory and customer enquiries?",
  },
  {
    id: "wifi-agent",
    name: "WiFi Subscription Agent",
    kind: "AI Agent",
    channels: ["Telegram", "WhatsApp"],
    tagline: "For WiFi & Starlink resellers",
    description:
      "Sells plans, answers support questions and handles renewals around the clock, so your subscribers get help instantly and you stop managing it all by hand.",
    outcomes: ["Plan selling & renewals", "Instant support replies", "Built for student lodges & estates", "Runs on Telegram or WhatsApp"],
    illustration: "/software-code-testing-animate.svg",
    ask: "Hi Alfred, I'd like to know more about the WiFi Subscription Agent. Could it work for my WiFi or Starlink resale business?",
  },
  {
    id: "food-agent",
    name: "Food Ordering Agent",
    kind: "AI Agent",
    channels: ["WhatsApp", "Telegram", "Instagram"],
    tagline: "For restaurants, bakers & food brands",
    description:
      "Takes orders, explains the menu, collects delivery details and confirms everything in chat. It can be trained from your Instagram page, even if you don't have a website.",
    outcomes: ["Orders taken in chat", "Menu & price answers", "Trained from your Instagram", "Delivery details collected"],
    illustration: "/innovation-animate.svg",
    ask: "Hi Alfred, I'd like to know more about the Food Ordering Agent. How would it take orders for my food business?",
  },
  {
    id: "scribl",
    name: "Scribl",
    kind: "Product",
    channels: ["Web", "Mobile"],
    tagline: "A Rexon original for students",
    description:
      "A peer-to-peer note-sharing and tutorship platform for Nigerian tertiary institutions. Students capture, organise and share what they learn, and connect with tutors.",
    outcomes: ["Share & discover notes", "Course-linked highlights", "Peer tutorship", "Built by Rexon"],
    illustration: "/online-gallery-animate.svg",
    ask: "Hi Alfred, I'd like to know more about Scribl, the student note-sharing and tutorship platform. What is it and how can I get involved?",
  },
];

export const projects: Project[] = [
  {
    id: "mzacc",
    title: "Mzacc Global",
    tag: "Web Development",
    description:
      "A clean landing page for a startup and its ten sub-companies, with smooth colour transitions and a scalable layout that unifies many services in one place.",
    thumbnail: "/projects/mzacc.svg",
    teaser: "/videos/mzacc.mp4",
    ask: "Hi Alfred, I saw the Mzacc Global project. I'd like something similar for my own multi-brand business. Can you tell me more about how it was built?",
  },
  {
    id: "legal-crusaders",
    title: "Legal Crusaders",
    tag: "Web Development",
    description:
      "A high-performance immigration law site built with Next.js 14 and Tailwind CSS, with scroll-triggered animation and a fully responsive layout.",
    thumbnail: "/projects/legal-crusaders.svg",
    teaser: "/videos/legal-crusaders.mp4",
    ask: "Hi Alfred, I saw the Legal Crusaders project. I'd like a professional website like that for my firm. Can you tell me more?",
  },
  {
    id: "attend",
    title: "Attend",
    tag: "Web Development",
    description:
      "A platform for creating, discovering and joining events, whether academic, social or professional. Hosting is seamless and showing up is effortless.",
    thumbnail: "/projects/attend.svg",
    teaser: "/videos/attend.mp4",
    ask: "Hi Alfred, I saw the Attend events platform. I'd like to build something similar. Can you tell me more about how it works?",
  },
  {
    id: "the-ark",
    title: "The Ark",
    tag: "Web3, Design",
    description:
      "A sleek, modern site for a cutting-edge tech startup, showcasing its solutions and its team.",
    thumbnail: "/projects/the-ark.svg",
    ask: "Hi Alfred, I saw The Ark project. I'd like a website for my startup in that style. Can you tell me more?",
  },
  {
    id: "gm-coffee",
    title: "GM Coffee",
    tag: "Web3, Design",
    description:
      "A Web3 UI for a 'Buy Me a Coffee' app that makes crypto donations simple and creator-friendly.",
    thumbnail: "/projects/gmcoffee.svg",
    ask: "Hi Alfred, I saw the GM Coffee project. I'm interested in a Web3 product like that. Can you tell me more?",
  },
];

export const process = [
  {
    step: "01",
    title: "Talk to Alfred",
    text: "Tell him about your business and what's eating your time. He'll ask the right questions and flag you to the team.",
  },
  {
    step: "02",
    title: "We scope it",
    text: "We map the workflow, agree on what the agent or app should do, and give you a clear, custom quote.",
  },
  {
    step: "03",
    title: "We build & demo",
    text: "You test a live version on your own phone before launch. Custom code, built around how you actually work.",
  },
  {
    step: "04",
    title: "Launch & improve",
    text: "We go live, watch real conversations and keep refining so it gets better every week.",
  },
];

export const faqs = [
  {
    q: "Why not just use Meta AI or a no-code bot?",
    a: "Generic bots don't know your stock, prices or tone, and they forget customers. Ours are custom-coded around your business: they remember conversations, follow up, and show you what's happening.",
  },
  {
    q: "Which platforms do the agents run on?",
    a: "WhatsApp, Telegram, Instagram and your website. One agent can cover several channels.",
  },
  {
    q: "Do I need a website first?",
    a: "No. We've built agents from a brand's Instagram page alone. If you also want a website, we build that too.",
  },
  {
    q: "How is pricing worked out?",
    a: "Each project is scoped individually, based on channels, integrations and complexity. Ask Alfred for a quick estimate or see our pricing page.",
  },
];

// ---------------------------------------------------------------------------
// Pricing — edit numbers here and the pricing page (and its calculator) update.
// ---------------------------------------------------------------------------

/** Used only for the "$" view. Update when the rate moves a lot. */
export const NGN_PER_USD = 1400;

export const PRICE = {
  channel: 50_000, // WhatsApp, Instagram or Telegram — each
  websiteAgent: 50_000, // counts as another channel
  sheetsInventory: 100_000, // Google Sheets inventory the owner can edit
  monthlyBase: 15_000,
  monthlyWithInventory: 20_000,
  customFrom: 350_000,
};

export const channelOptions = [
  { id: "whatsapp", label: "WhatsApp", price: PRICE.channel },
  { id: "instagram", label: "Instagram", price: PRICE.channel },
  { id: "telegram", label: "Telegram", price: PRICE.channel },
  { id: "website", label: "Website agent", price: PRICE.websiteAgent },
] as const;

export type ChannelId = (typeof channelOptions)[number]["id"];

export function quote(selected: ChannelId[], inventory: boolean) {
  const channels = channelOptions.filter((c) => selected.includes(c.id));
  const setup = channels.reduce((sum, c) => sum + c.price, 0) + (inventory ? PRICE.sheetsInventory : 0);
  const monthly = inventory ? PRICE.monthlyWithInventory : PRICE.monthlyBase;
  return { channels, setup, monthly };
}

export const pricingPlans = [
  {
    name: "Starter Agent",
    blurb: "One channel, answering FAQs and capturing leads.",
    channels: ["whatsapp"] as ChannelId[],
    inventory: false,
    includes: ["1 channel of your choice", "Trained on your business info", "Lead capture & handover to you"],
  },
  {
    name: "Inventory Agent",
    blurb: "Sells from your stock list, which you edit in Google Sheets.",
    channels: ["whatsapp"] as ChannelId[],
    inventory: true,
    popular: true,
    includes: ["1 channel of your choice", "Google Sheets inventory sync", "Exact-match product search & prices", "Budget-based recommendations"],
  },
  {
    name: "Everywhere Agent",
    blurb: "One brain, answering on every channel your customers use.",
    channels: ["whatsapp", "instagram", "telegram", "website"] as ChannelId[],
    inventory: true,
    includes: ["WhatsApp, Instagram, Telegram + website", "Google Sheets inventory sync", "Same memory across channels", "Best for busy, multi-channel brands"],
  },
];

export const pricingFaqs = [
  {
    q: "What does the monthly fee cover?",
    a: "It keeps your agent hosted, online and maintained. Setup is paid once; the monthly fee is what keeps it running.",
  },
  {
    q: "Can I start with one channel and add more later?",
    a: "Yes. Each extra channel is priced separately, so you only pay for what you use and can grow at your own pace.",
  },
  {
    q: "What if I need something custom?",
    a: "Custom builds, integrations, websites and mobile apps are scoped individually. Tell Alfred what you need and the team will send a clear quote.",
  },
];
