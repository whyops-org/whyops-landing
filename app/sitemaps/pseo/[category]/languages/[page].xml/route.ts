export const dynamic = 'force-dynamic';

import {
  pageToSitemapEntry,
  parseSitemapPageNumber,
  renderUrlSet,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoCategoryShardGroups, getSitePseoShardPages } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    category: string;
    page: string;
  }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const { category, page } = await params;
  const origin = resolveSitemapOrigin(request);
  const pageIndex = parseSitemapPageNumber(page);

  if (pageIndex === null) {
    return new NextResponse("Not found", { status: 404 });
  }

  const groups = await getSitePseoCategoryShardGroups(category);
  const shard = groups.translationCore[pageIndex];

  if (!shard) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pages = await getSitePseoShardPages(shard.id);
  if (!pages.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(renderUrlSet(pages.map((item) => pageToSitemapEntry(item, origin))), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
