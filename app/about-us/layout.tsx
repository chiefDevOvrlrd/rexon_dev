import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Rexon Dev",
  description: "Meet the engineers and designers behind Rexon Dev, an AI automation and software agency based in Abuja, Nigeria.",
  alternates: { canonical: "/about-us" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
