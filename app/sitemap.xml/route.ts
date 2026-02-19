import type { MetadataRoute } from "next";
import { NextResponse } from "next/server";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whyops.com";
  const lastModified = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/sitemap-main.xml`,
      lastModified,
    },
    {
      url: "https://whyops.com/docs/sitemap.xml",
      lastModified,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <sitemap>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
