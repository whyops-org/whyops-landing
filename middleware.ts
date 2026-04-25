import { NextResponse, type NextRequest } from "next/server";

const HSTS_HEADER = "max-age=63072000; includeSubDomains; preload";

export function middleware(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto || request.nextUrl.protocol.replace(":", "");

  if (process.env.NODE_ENV === "production" && protocol !== "https") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  const response = NextResponse.next();

  if (process.env.NODE_ENV === "production" && protocol === "https") {
    response.headers.set("Strict-Transport-Security", HSTS_HEADER);
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
