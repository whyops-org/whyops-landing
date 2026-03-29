import type { MetadataRoute } from "next";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/sitemaps/static.xml`,
      lastModified: "2026-03-29",
    },
    {
      url: `${baseUrl}/sitemaps/pseo/index.xml`,
      lastModified: "2026-03-25",
    },
    {
      url: `${baseUrl}/docs/sitemap.xml`,
      lastModified: "2026-03-29",
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
