import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";
import { QuoteDialogProvider } from "../components/context/QuoteDialogContext";

export const metadata: Metadata = {
  title: "Rexon Dev | AI Agent Automation & Software Development",
  description: "Rexon Dev delivers AI agent automation, software development, and digital solutions. Transform your business with intelligent automation and modern technology.",
  keywords: ["AI agent automation", "software development", "intelligent automation", "mobile apps", "digital solutions", "web development", "React", "Next.js", "full-stack development", "custom software", "enterprise automation"],
  authors: [{ name: "Rexon Dev Team", url: "https://rexon.dev" }],
  creator: "Rexon Dev",
  publisher: "Rexon Dev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rexon.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Rexon Dev | Professional Software Development & Digital Solutions",
    description: "Transform your business with modern, scalable software solutions",
    url: 'https://rexon.dev',
    siteName: 'Rexon Dev',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rexon Dev - Software Development Solutions',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rexon Dev | Professional Software Development",
    description: "Transform your business with modern software solutions",
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"/>

      </head>
      <body>
        <QuoteDialogProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </QuoteDialogProvider>
      </body>
    </html>
  );
}