export const runtime = 'edge';
import { buildAbsoluteUrlForOrigin, resolveSitemapOrigin } from "@/lib/pseo/sitemap";
import {
  getPrettySitemapPathForShard,
  sitemapSlugToShardId,
} from "@/lib/pseo/site";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    category: string;
    shard: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { category, shard } = await params;
  const origin = resolveSitemapOrigin(_request);
  const shardId = sitemapSlugToShardId(shard);
  const prettyPath = await getPrettySitemapPathForShard(shardId);

  if (!prettyPath || !prettyPath.startsWith(`/sitemaps/pseo/${category}/`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(buildAbsoluteUrlForOrigin(prettyPath, origin), 308);
}
