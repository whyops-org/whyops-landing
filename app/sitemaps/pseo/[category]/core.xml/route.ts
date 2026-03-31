export const runtime = 'edge';
import {
  pageToSitemapEntry,
  renderUrlSet,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoCategoryShardGroups, getSitePseoShardPages } from "@/lib/pseo/site";
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

  const pages = await getSitePseoShardPages(groups.core.id);
  if (!pages.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(renderUrlSet(pages.map((page) => pageToSitemapEntry(page, origin))), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
