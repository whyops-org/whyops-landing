import {
  buildAbsoluteUrlForOrigin,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoLeafSitemapPaths } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = resolveSitemapOrigin(request);

  // Fetch the individual pSEO leaf sitemap paths (<urlset> files, never indexes)
  const pseoLeafPaths = await getSitePseoLeafSitemapPaths();

  // Flat list: static + each pSEO leaf + blog — all are <urlset> sitemaps
  const entries = [
    "/sitemaps/static.xml",
    ...pseoLeafPaths,
    "/sitemaps/blog.xml",
  ].map((pathname) => ({ url: buildAbsoluteUrlForOrigin(pathname, origin) }));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: { "Content-Type": "application/xml" },
  });
}
