import { fetchBlogPostsForSitemap } from "@/lib/api/hashnode";
import { env } from "@/lib/env";
import {
  buildAbsoluteUrlForOrigin,
  renderUrlSet,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = resolveSitemapOrigin(request);
  const entries: { url: string; lastModified: string; changeFrequency: string; priority: number }[] = [];

  if (env.hashnodeHost) {
    try {
      let hasNextPage = true;
      let endCursor: string | null = null;

      while (hasNextPage) {
        const response = await fetchBlogPostsForSitemap(env.hashnodeHost, {
          first: 50,
          after: endCursor ?? undefined,
        });

        for (const { node } of response.publication.posts.edges) {
          entries.push({
            url: buildAbsoluteUrlForOrigin(`/blog/${node.slug}`, origin),
            lastModified: new Date(node.publishedAt).toISOString().slice(0, 10),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }

        hasNextPage = response.publication.posts.pageInfo.hasNextPage;
        endCursor = response.publication.posts.pageInfo.endCursor;
      }
    } catch (err) {
      console.error("Blog sitemap error:", err);
    }
  }

  // Always include the blog index page
  entries.unshift({
    url: buildAbsoluteUrlForOrigin("/blog", origin),
    lastModified: new Date().toISOString().slice(0, 10),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  return new NextResponse(renderUrlSet(entries), {
    headers: { "Content-Type": "application/xml" },
  });
}
