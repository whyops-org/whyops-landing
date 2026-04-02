export const dynamic = 'force-dynamic';

import {
  parseSitemapPageNumber,
  renderUrlSet,
  resolveSitemapOrigin,
  urlToSitemapEntry,
} from "@/lib/pseo/sitemap";
import { getSitePseoCategoryShardGroups, getSitePseoShardUrls } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    category: string;
    page: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { category, page } = await params;
  const origin = resolveSitemapOrigin(_request);
  const pageIndex = parseSitemapPageNumber(page);

  if (pageIndex === null) {
    return new NextResponse("Not found", { status: 404 });
  }

  const groups = await getSitePseoCategoryShardGroups(category);
  const shard = groups.location[pageIndex];

  if (!shard) {
    return new NextResponse("Not found", { status: 404 });
  }

  const urls = await getSitePseoShardUrls(shard.id);
  if (!urls.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(renderUrlSet(urls.map((url) => urlToSitemapEntry(url, origin))), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
