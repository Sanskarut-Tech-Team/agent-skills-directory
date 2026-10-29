import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://apex-ai-skills.vercel.app";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-APEXAI01";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apex AI Skills | Production AI Prompts & Engineering Blueprints",
    template: "%s | Apex AI Skills",
  },
  description:
    "Curated, production-grade repository of deterministic AI skills, agent tool calling blueprints, and precision prompts for ChatGPT, Claude 3.5, Google Gemini, DeepSeek R1, Meta Llama, and Midjourney.",
  applicationName: "Apex AI Skills",
  authors: [
    { name: "Sanskar Bandgar", url: "https://mrsanskar.vercel.app" },
    { name: "Sanskarut Tech Team", url: siteUrl },
  ],
  generator: "Next.js 16",
  keywords: [
    "Apex AI Skills",
    "AI Prompts",
    "Claude 3.5 prompts",
    "ChatGPT prompts",
    "DeepSeek R1 prompts",
    "Google Gemini 2.0 prompts",
    "Meta Llama 3.3 prompts",
    "Midjourney v6 prompts",
    "AI Engineering Skills",
    "Next.js 16 Architecture",
    "React 19 Server Components",
    "Agentic Tool Calling",
    "System Prompts",
    "Prompt Engineering Blueprints",
    "Developer Tooling",
    "Enterprise AI Workflows",
    "Zero Hallucination AI",
  ],
  creator: "Sanskar Bandgar",
  publisher: "Sanskarut Tech Team",
  category: "technology",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Apex AI Skills | Production AI Prompts & Engineering Blueprints",
    description:
      "Curated repository of production-grade AI skills and prompt templates for ChatGPT, Claude 3.5, Gemini, DeepSeek, Meta Llama, and Midjourney.",
    url: siteUrl,
    siteName: "Apex AI Skills",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Apex AI Skills Logo - Production AI Prompts & Blueprints",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex AI Skills | Production AI Prompts & Engineering Blueprints",
    description:
      "Curated repository of production-grade AI skills and prompt engineering templates.",
    images: ["/logo.png"],
    creator: "@SanskarBandgar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Apex AI Skills",
        description:
          "Production AI skills and prompt blueprints for frontier LLMs.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/skills?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Apex AI Skills",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        founder: {
          "@type": "Person",
          name: "Sanskar Bandgar",
          url: "https://mrsanskar.vercel.app",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Apex AI Skills Library",
        operatingSystem: "Web",
        applicationCategory: "DeveloperApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Person",
          name: "Sanskar Bandgar",
          url: "https://mrsanskar.vercel.app",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <GoogleTagManager gtmId={gtmId} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
