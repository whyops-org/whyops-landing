export const runtime = 'edge';
import type { MetadataRoute } from "next";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2026-03-25",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
