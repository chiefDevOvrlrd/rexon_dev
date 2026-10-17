import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Rexon Dev",
  description: "Simple pricing for custom WhatsApp, Telegram, Instagram and website AI agents. Pay once to set up, then a small monthly fee. Build your price in seconds.",
  alternates: { canonical: "/pricing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
