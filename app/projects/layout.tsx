import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Rexon Dev",
  description: "AI agents, platforms and websites built by Rexon Dev, including Alfred, WhatsApp sales agents for vendors, food ordering agents, Scribl and more.",
  alternates: { canonical: "/projects" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
