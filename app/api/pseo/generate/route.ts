import {
  buildDatasetSummary,
  resolvePseoDataset,
} from "@/lib/pseo/api";
import { generatePseoBatch } from "@/lib/pseo/generator";
import {
  buildPseoManifest,
  generatePseoBatchForShard,
  getShardById,
} from "@/lib/pseo/manifest";
import type {
  PseoBatchRequest,
  PseoManifestOptions,
} from "@/lib/pseo/types";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as PseoBatchRequest & {
      shard_id?: string;
      manifest_options?: PseoManifestOptions;
    };
    const resolved = await resolvePseoDataset(body.dataset, body.source_config);
    const manifest = body.shard_id
      ? buildPseoManifest(resolved.normalized_dataset, body.manifest_options)
      : null;
    const shard = body.shard_id && manifest ? getShardById(manifest, body.shard_id) : null;

    if (body.shard_id && !shard) {
      return NextResponse.json(
        {
          status: "SKIPPED",
          reason: `Unknown pSEO shard id: ${body.shard_id}`,
        },
        { status: 404 },
      );
    }

    const response = shard
      ? generatePseoBatchForShard(
          resolved.normalized_dataset,
          shard,
          body.batchSize || 100,
          body.cursor || 0,
          body.basePath || "",
        )
      : generatePseoBatch(resolved.normalized_dataset, {
          ...body,
          targetPages: body.targetPages || 100000,
        });

    return NextResponse.json({
      ...response,
      dataset_summary: buildDatasetSummary(resolved.normalized_dataset),
      dataset_source: resolved.dataset_source,
      source_summary: resolved.expanded?.source_summary,
      capacity_estimate: resolved.expanded?.capacity_estimate,
      manifest_shard: shard || undefined,
    });
  } catch (error) {
    console.error("pSEO generation error:", error);
    return NextResponse.json(
      {
        status: "SKIPPED",
        reason: "Failed to generate pSEO pages from the provided dataset.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const resolved = await resolvePseoDataset(undefined);
  const response = generatePseoBatch(resolved.normalized_dataset, {
    batchSize: 100,
    cursor: 0,
    targetPages: 100000,
  });

  return NextResponse.json({
    ...response,
    dataset_summary: buildDatasetSummary(resolved.normalized_dataset),
    dataset_source: resolved.dataset_source,
  });
}
