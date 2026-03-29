import {
  buildAbsoluteUrlForOrigin,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoLeafSitemapPaths } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = resolveSitemapOrigin(request);
  const paths = await getSitePseoLeafSitemapPaths();
  const entries = paths.map((pathname) => ({
    url: buildAbsoluteUrlForOrigin(pathname, origin),
  }));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
