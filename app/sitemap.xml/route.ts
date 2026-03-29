import {
  buildAbsoluteUrlForOrigin,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoLeafSitemapPaths } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = resolveSitemapOrigin(request);
  const pseoPaths = await getSitePseoLeafSitemapPaths();
  const entries = [
    {
      url: buildAbsoluteUrlForOrigin("/sitemaps/static.xml", origin),
      lastModified: "2026-03-29",
    },
    ...pseoPaths.map((pathname) => ({
      url: buildAbsoluteUrlForOrigin(pathname, origin),
      lastModified: "2026-03-30",
    })),
  ];

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
