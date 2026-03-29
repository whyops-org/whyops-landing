import {
  buildAbsoluteUrlForOrigin,
  renderSitemapIndex,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { getSitePseoCategoryLeafSitemapPaths } from "@/lib/pseo/site";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { category } = await params;
  const origin = resolveSitemapOrigin(_request);
  const paths = await getSitePseoCategoryLeafSitemapPaths(category);

  if (!paths.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const entries = paths.map((pathname) => ({
    url: buildAbsoluteUrlForOrigin(pathname, origin),
  }));

  return new NextResponse(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
