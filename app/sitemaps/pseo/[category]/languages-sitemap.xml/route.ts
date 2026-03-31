
import {
  buildAbsoluteUrlForOrigin,
  buildCategoryTranslationCorePagePath,
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

  if (!groups.translationCore.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const entries = groups.translationCore.map((_shard, index) => ({
    url: buildAbsoluteUrlForOrigin(
      buildCategoryTranslationCorePagePath(category, index),
      origin,
    ),
  }));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
