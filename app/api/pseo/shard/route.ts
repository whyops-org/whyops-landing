export const dynamic = 'force-dynamic';

import {
  buildDatasetSummary,
  resolvePseoDataset,
} from "@/lib/pseo/api";
import {
  buildPseoManifest,
  generatePseoBatchForShard,
  getShardById,
} from "@/lib/pseo/manifest";
import type {
  PseoDatasetInput,
  PseoManifestOptions,
  PublicSourceConfig,
} from "@/lib/pseo/types";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      dataset?: PseoDatasetInput;
      source_config?: PublicSourceConfig;
      manifest_options?: PseoManifestOptions;
      shard_id?: string;
      batchSize?: number;
      cursor?: number;
      basePath?: string;
    };

    if (!body.shard_id) {
      return NextResponse.json(
        {
          status: "SKIPPED",
          reason: "Missing required field: shard_id",
        },
        { status: 400 },
      );
    }

    const resolved = await resolvePseoDataset(body.dataset, body.source_config);
    const manifest = buildPseoManifest(
      resolved.normalized_dataset,
      body.manifest_options,
    );
    const shard = getShardById(manifest, body.shard_id);

    if (!shard) {
      return NextResponse.json(
        {
          status: "SKIPPED",
          reason: `Unknown pSEO shard id: ${body.shard_id}`,
        },
        { status: 404 },
      );
    }

    const response = generatePseoBatchForShard(
      resolved.normalized_dataset,
      shard,
      body.batchSize || 100,
      body.cursor || 0,
      body.basePath || "",
    );

    return NextResponse.json({
      ...response,
      manifest_shard: shard,
      dataset_summary: buildDatasetSummary(resolved.normalized_dataset),
      dataset_source: resolved.dataset_source,
      source_summary: resolved.expanded?.source_summary,
      capacity_estimate: resolved.expanded?.capacity_estimate,
    });
  } catch (error) {
    console.error("pSEO shard error:", error);
    return NextResponse.json(
      {
        status: "SKIPPED",
        reason: "Failed to generate a pSEO shard batch from the provided dataset.",
      },
      { status: 500 },
    );
  }
}
