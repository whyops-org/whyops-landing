import {
  buildAbsoluteUrlForOrigin,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoManifest } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const manifest = await getSitePseoManifest();
  const origin = resolveSitemapOrigin(request);
  const categorySlugs = Array.from(
    new Set(
      manifest.shards
        .map((shard) => shard.category_slug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ).sort();

  const entries = [
    buildAbsoluteUrlForOrigin("/sitemaps/pseo/global/index.xml", origin),
    ...categorySlugs.map((categorySlug) =>
      buildAbsoluteUrlForOrigin(`/sitemaps/pseo/${categorySlug}/index.xml`, origin),
    ),
  ].map((url) => ({
    url,
  }));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
