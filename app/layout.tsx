import { brand, env } from "@/lib/env";
import { buildHomeStructuredData } from "@/lib/structuredData";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = env.siteUrl;
const description = "WhyOps makes agent decisions legible, replayable, and fixable. Debug AI agents with decision-aware state tracking, production replay, and visual debugging. Stop guessing, start shipping reliable autonomy.";
const defaultTitle = `${brand.name} - Decision-Aware Observability for AI Agents`;
const ogImage = `${siteUrl}/og.webp`;
const twitterImage = `${siteUrl}/twitter-og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: defaultTitle,
    template: `%s · ${brand.name}`,
  },
  description,
  applicationName: brand.name,
  authors: [{ name: brand.companyName }],
  creator: brand.companyName,
  publisher: brand.companyName,
  keywords: [
    "AI agent observability",
    "agent debugging",
    "LLM monitoring",
    "decision reasoning",
    "state tracking",
    "production replay",
    "multi-agent workflows",
  ],
  category: "technology",
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
  openGraph: {
    type: "website",
    url: "/",
    title: defaultTitle,
    description,
    siteName: brand.name,
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${brand.name} - Decision-Aware Observability for AI Agents`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
    images: [
      {
        url: twitterImage,
        alt: `${brand.name} - Decision-Aware Observability for AI Agents`,
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/WhyOpsLogo.svg",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildHomeStructuredData())
              .replace(/</g, '\\u003c')
              .replace(/>/g, '\\u003e')
              .replace(/&/g, '\\u0026'),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
