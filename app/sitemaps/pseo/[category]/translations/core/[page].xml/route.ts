import { buildAbsoluteUrlForOrigin, resolveSitemapOrigin } from "@/lib/pseo/sitemap";
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
  return NextResponse.redirect(
    buildAbsoluteUrlForOrigin(`/sitemaps/pseo/${category}/languages/${page}`, origin),
    308,
  );
}
