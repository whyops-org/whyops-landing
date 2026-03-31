
import {
  pageToSitemapEntry,
  renderUrlSet,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoGlobalShards, getSitePseoShardPages } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const [utilityShard] = await getSitePseoGlobalShards();
  const origin = resolveSitemapOrigin(request);

  if (!utilityShard) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pages = await getSitePseoShardPages(utilityShard.id);
  if (!pages.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(renderUrlSet(pages.map((page) => pageToSitemapEntry(page, origin))), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
