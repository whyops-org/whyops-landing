export const runtime = 'edge';
import { whyopsPseoCatalog } from "@/lib/pseo/catalog";
import { hydrateSourceConfig } from "@/lib/pseo/api";
import { expandDatasetWithPublicApis } from "@/lib/pseo/expand";
import type { PublicSourceConfig } from "@/lib/pseo/types";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      source_config?: PublicSourceConfig;
    };

    const expanded = await expandDatasetWithPublicApis(
      whyopsPseoCatalog,
      hydrateSourceConfig(body.source_config),
    );

    return NextResponse.json(expanded);
  } catch (error) {
    console.error("pSEO dataset expansion error:", error);
    return NextResponse.json(
      {
        status: "SKIPPED",
        reason: "Failed to expand the pSEO dataset from public APIs.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const expanded = await expandDatasetWithPublicApis(
    whyopsPseoCatalog,
    hydrateSourceConfig({
      enabled_sources: ["restcountries", "worldbank", "github"],
      restcountries: {
        include_countries: true,
        limit: 40,
      },
      github: {
        limit: 5,
      },
    }),
  );

  return NextResponse.json(expanded);
}
