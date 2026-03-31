
import {
  buildAbsoluteUrlForOrigin,
  renderUrlSet,
  resolveSitemapOrigin,
} from "@/lib/pseo/sitemap";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const origin = resolveSitemapOrigin(request);
  const xml = renderUrlSet([
    {
      url: buildAbsoluteUrlForOrigin("/", origin),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
