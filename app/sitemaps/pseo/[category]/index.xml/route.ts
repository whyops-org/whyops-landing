import {
  buildAbsoluteUrlForOrigin,
  buildCategoryCoreSitemapPath,
  buildCategoryLocationsIndexPath,
  buildCategoryTranslationCoreIndexPath,
  buildCategoryTranslationLocationIndexPath,
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

export async function GET(_request: Request, { params }: RouteProps) {
  const { category } = await params;
  const origin = resolveSitemapOrigin(_request);
  const groups = await getSitePseoCategoryShardGroups(category);

  if (
    !groups.core &&
    !groups.location.length &&
    !groups.translationCore.length &&
    !groups.translationLocation.length
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const entries = [
    groups.core
      ? {
          url: buildAbsoluteUrlForOrigin(buildCategoryCoreSitemapPath(category), origin),
        }
      : null,
    groups.location.length
      ? {
          url: buildAbsoluteUrlForOrigin(buildCategoryLocationsIndexPath(category), origin),
        }
      : null,
    groups.translationCore.length
      ? {
          url: buildAbsoluteUrlForOrigin(
            buildCategoryTranslationCoreIndexPath(category),
            origin,
          ),
        }
      : null,
    groups.translationLocation.length
      ? {
          url: buildAbsoluteUrlForOrigin(
            buildCategoryTranslationLocationIndexPath(category),
            origin,
          ),
        }
      : null,
  ].filter((entry): entry is { url: string } => Boolean(entry));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
