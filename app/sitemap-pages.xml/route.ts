export const dynamic = 'force-dynamic';

import type { MetadataRoute } from "next";
import { curatedPriorityPages } from "@/lib/seo/priority-pages";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const entries: MetadataRoute.Sitemap = curatedPriorityPages.map((page) => ({
    url: `${baseUrl}${page.href === "/" ? "" : page.href}`,
    lastModified: new Date().toISOString().slice(0, 10),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

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
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
