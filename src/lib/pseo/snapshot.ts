import { env } from "@/lib/env";
import type { NormalizedDataset, PseoManifest, PseoPage } from "@/lib/pseo/types";

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

export async function loadPseoSnapshotContext(): Promise<PseoSnapshotContext | null> {
  try {
    const res = await fetch(`${env.siteUrl}/generated/pseo/context.json`);
    if (!res.ok) return null;
    return res.json() as Promise<PseoSnapshotContext>;
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
