export const dynamic = 'force-dynamic';

import {
  renderUrlSet,
  resolveSitemapOrigin,
  urlToSitemapEntry,
} from "@/lib/pseo/sitemap";
import { getSitePseoCategoryShardGroups, getSitePseoShardUrls } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { category } = await params;
  const origin = resolveSitemapOrigin(_request);
  const groups = await getSitePseoCategoryShardGroups(category);

  if (!groups.core) {
    return new NextResponse("Not found", { status: 404 });
  }

  const urls = await getSitePseoShardUrls(groups.core.id);
  if (!urls.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(renderUrlSet(urls.map((url) => urlToSitemapEntry(url, origin))), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
