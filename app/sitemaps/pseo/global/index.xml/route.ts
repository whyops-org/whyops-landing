export const runtime = 'edge';
import {
  buildAbsoluteUrlForOrigin,
  buildGlobalUtilitySitemapPath,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoGlobalShards } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const shards = await getSitePseoGlobalShards();
  const origin = resolveSitemapOrigin(request);
  const entries = shards.length
    ? [
        {
          url: buildAbsoluteUrlForOrigin(buildGlobalUtilitySitemapPath(), origin),
        },
      ]
    : [];

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
