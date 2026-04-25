export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/lib/api/hashnode";
import { env } from "@/lib/env";
import { buildSubmittedPages } from "@/lib/seo/submitted-pages";
import type { BlogPost } from "@/lib/types/blog";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  let blogPosts: BlogPost[] = [];

  if (env.hashnodeHost) {
    try {
      blogPosts = (await fetchBlogPosts(env.hashnodeHost, { first: 24 })).publication.posts.edges.map(
        (edge) => edge.node,
      );
    } catch (error) {
      console.error("Top sitemap blog fetch error:", error);
    }
  }

  const entries: MetadataRoute.Sitemap = buildSubmittedPages(blogPosts).map((page) => ({
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
  </url>`,
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
