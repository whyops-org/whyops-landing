export const dynamic = 'force-dynamic';

import {
  buildAbsoluteUrlForOrigin,
  buildCategoryTranslationLocationPagePath,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoCategoryShardGroups } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const { category } = await params;
  const origin = resolveSitemapOrigin(request);
  const groups = await getSitePseoCategoryShardGroups(category);

  if (!groups.translationLocation.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const entries = groups.translationLocation.map((_shard, index) => ({
    url: buildAbsoluteUrlForOrigin(
      buildCategoryTranslationLocationPagePath(category, index),
      origin,
    ),
  }));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
