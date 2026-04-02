export const dynamic = 'force-dynamic';

import {
  renderUrlSet,
  resolveSitemapOrigin,
  urlToSitemapEntry,
} from "@/lib/pseo/sitemap";
import { getSitePseoGlobalShards, getSitePseoShardUrls } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const [utilityShard] = await getSitePseoGlobalShards();
  const origin = resolveSitemapOrigin(request);

  if (!utilityShard) {
    return new NextResponse("Not found", { status: 404 });
  }

  const urls = await getSitePseoShardUrls(utilityShard.id);
  if (!urls.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(renderUrlSet(urls.map((url) => urlToSitemapEntry(url, origin))), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
