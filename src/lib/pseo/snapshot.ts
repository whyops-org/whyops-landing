import { env } from "@/lib/env";
import type { NormalizedDataset, PseoManifest, PseoManifestShard, PseoPage } from "@/lib/pseo/types";

// Lightweight routing index — only the fields needed for URL routing and sitemaps.
// Loaded on every cold Worker start instead of the full context.json (~964KB).
export type PseoRoutingIndex = {
  version: 1;
  generated_at: string;
  manifest: {
    shard_count: number;
    total_estimated_pages: number;
    options: PseoManifest["options"];
    shards: Array<
      Pick<PseoManifestShard, "id" | "kind" | "ownership_scope"> &
        Partial<
          Pick<
            PseoManifestShard,
            | "category_slug"
            | "location_offset"
            | "location_limit"
            | "language_offset"
            | "language_limit"
          >
        >
    >;
  };
  routing_dataset: {
    categories: Array<{ slug: string; glossaryTerms: string[] }>;
    locations: Array<{ slug: string }>;
    languages: Array<{ slug: string }>;
    tools: Array<{ slug: string; name: string; website?: string; category?: string }>;
    profiles: Array<{ slug: string; name: string; company?: string }>;
  };
};

export type PseoSnapshotContext = {
  version: 1;
  generated_at: string;
  normalized_dataset: NormalizedDataset;
  manifest: PseoManifest;
};

function shardIdToFilename(shardId: string): string {
  return shardId.replace(/:/g, "--") + ".json";
}

// ─── Runtime reads via fetch ─────────────────────────────────────────────────
// Pure fetch — no node:fs, no node:path. Safe for Cloudflare Workers edge runtime.
// Files are pre-generated at build time and served as static assets from the CDN.

export async function loadPseoRoutingIndex(): Promise<PseoRoutingIndex | null> {
  try {
    const res = await fetch(`${env.siteUrl}/generated/pseo/routing-index.json`);
    if (!res.ok) return null;
    return res.json() as Promise<PseoRoutingIndex>;
  } catch {
    return null;
  }
}

export async function loadPseoSnapshotContext(): Promise<PseoSnapshotContext | null> {
  try {
    const res = await fetch(`${env.siteUrl}/generated/pseo/context.json`);
    if (!res.ok) return null;
    return res.json() as Promise<PseoSnapshotContext>;
  } catch {
    return null;
  }
}

export async function loadPseoShardUrls(shardId: string): Promise<string[] | null> {
  try {
    const res = await fetch(
      `${env.siteUrl}/generated/pseo/shards/urls--${shardIdToFilename(shardId)}`,
    );
    if (!res.ok) return null;
    return res.json() as Promise<string[]>;
  } catch {
    return null;
  }
}

export async function loadPseoShardPages(shardId: string): Promise<PseoPage[] | null> {
  try {
    const res = await fetch(
      `${env.siteUrl}/generated/pseo/shards/${shardIdToFilename(shardId)}`,
    );
    if (!res.ok) return null;
    return res.json() as Promise<PseoPage[]>;
  } catch {
    return null;
  }
}
