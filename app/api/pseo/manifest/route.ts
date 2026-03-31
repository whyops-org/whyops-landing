export const runtime = 'edge';
import {
  buildDatasetSummary,
  resolvePseoDataset,
} from "@/lib/pseo/api";
import { buildPseoManifest } from "@/lib/pseo/manifest";
import type { PseoDatasetInput, PseoManifestOptions, PublicSourceConfig } from "@/lib/pseo/types";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      dataset?: PseoDatasetInput;
      source_config?: PublicSourceConfig;
      manifest_options?: PseoManifestOptions;
    };
    const resolved = await resolvePseoDataset(body.dataset, body.source_config);
    const manifest = buildPseoManifest(
      resolved.normalized_dataset,
      body.manifest_options,
    );

    return NextResponse.json({
      status: "OK",
      manifest,
      dataset_summary: buildDatasetSummary(resolved.normalized_dataset),
      dataset_source: resolved.dataset_source,
      source_summary: resolved.expanded?.source_summary,
      capacity_estimate: resolved.expanded?.capacity_estimate,
    });
  } catch (error) {
    console.error("pSEO manifest error:", error);
    return NextResponse.json(
      {
        status: "SKIPPED",
        reason: "Failed to build a pSEO shard manifest from the provided dataset.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const resolved = await resolvePseoDataset(undefined);
  const manifest = buildPseoManifest(resolved.normalized_dataset);

  return NextResponse.json({
    status: "OK",
    manifest,
    dataset_summary: buildDatasetSummary(resolved.normalized_dataset),
    dataset_source: resolved.dataset_source,
  });
}
