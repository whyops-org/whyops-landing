import type { Metadata } from "next";
import { env, brand } from "@/lib/env";
import "./globals.css";

const siteUrl = env.siteUrl;
const description = "WhyOps makes agent decisions legible, replayable, and fixable. Debug AI agents with decision-aware state tracking, production replay, and visual debugging. Stop guessing, start shipping reliable autonomy.";
const defaultTitle = `${brand.name} - Decision-Aware Observability for AI Agents`;
const ogImage = `${siteUrl}/WhyOpsLogo.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    images: [ogImage],
  },
  icons: {
    icon: "/WhyOpsLogo.svg",
    shortcut: "/WhyOpsLogo.svg",
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
