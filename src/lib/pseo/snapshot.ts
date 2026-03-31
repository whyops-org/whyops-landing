import { env } from "@/lib/env";
import { resolvePseoDataset } from "@/lib/pseo/api";
import { buildPseoManifest, generatePseoPagesForShard } from "@/lib/pseo/manifest";
import { getSiteSourceConfig } from "@/lib/pseo/source-config";
import type { NormalizedDataset, PseoManifest, PseoPage } from "@/lib/pseo/types";

type PseoSnapshotContext = {
  version: 1;
  generated_at: string;
  normalized_dataset: NormalizedDataset;
  manifest: PseoManifest;
};

function shardIdToFilename(shardId: string): string {
  return shardId.replace(/:/g, "--") + ".json";
}

// ─── Runtime reads ──────────────────────────────────────────────────────────
// Strategy: try readFile first (Node.js: next build, next start),
// then fall back to fetch (Cloudflare Workers edge runtime, where fs is unavailable).

export async function loadPseoSnapshotContext(): Promise<PseoSnapshotContext | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const raw = await readFile(
      join(process.cwd(), "public", "generated", "pseo", "context.json"),
      "utf8",
    );
    return JSON.parse(raw) as PseoSnapshotContext;
  } catch {
    // Edge runtime fallback: fetch from static asset CDN
  }

  try {
    const res = await fetch(`${env.siteUrl}/generated/pseo/context.json`);
    if (!res.ok) return null;
    return res.json() as Promise<PseoSnapshotContext>;
  } catch {
    return null;
  }
}

export async function loadPseoShardPages(shardId: string): Promise<PseoPage[] | null> {
  const filename = shardIdToFilename(shardId);

  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const raw = await readFile(
      join(process.cwd(), "public", "generated", "pseo", "shards", filename),
      "utf8",
    );
    return JSON.parse(raw) as PseoPage[];
  } catch {
    // Edge runtime fallback: fetch from static asset CDN
  }

  try {
    const res = await fetch(`${env.siteUrl}/generated/pseo/shards/${filename}`);
    if (!res.ok) return null;
    return res.json() as Promise<PseoPage[]>;
  } catch {
    return null;
  }
}

// ─── Build-time write (Node.js only — called from generate-pseo-snapshot.ts) ─

export async function writePseoSnapshot() {
  const { mkdir, rm, writeFile } = await import("node:fs/promises");
  const { join } = await import("node:path");

  const snapshotRoot = join(process.cwd(), "public", "generated", "pseo");
  const contextPath = join(snapshotRoot, "context.json");
  const shardsDir = join(snapshotRoot, "shards");

  const resolved = await resolvePseoDataset(undefined, getSiteSourceConfig());
  const manifest = buildPseoManifest(resolved.normalized_dataset);

  const snapshotContext: PseoSnapshotContext = {
    version: 1,
    generated_at: new Date().toISOString(),
    normalized_dataset: resolved.normalized_dataset,
    manifest,
  };

  await rm(snapshotRoot, { recursive: true, force: true });
  await mkdir(shardsDir, { recursive: true });
  await writeFile(contextPath, JSON.stringify(snapshotContext), "utf8");

  // Only pre-generate small, high-priority shards at build time.
  // Large location/translation-location shards (750–2400 pages each) are too
  // heavy for build time and fall back to runtime generation + in-memory cache.
  const prebakeShards = manifest.shards.filter(
    (shard) => shard.kind === "global-utility" || shard.kind === "category-core",
  );

  console.log(`Pre-generating pages for ${prebakeShards.length} core shards...`);
  let done = 0;

  await Promise.all(
    prebakeShards.map(async (shard) => {
      const result = generatePseoPagesForShard(resolved.normalized_dataset, shard);
      const pages: PseoPage[] = result.status === "OK" && result.pages ? result.pages : [];
      const filePath = join(shardsDir, shardIdToFilename(shard.id));
      await writeFile(filePath, JSON.stringify(pages), "utf8");
      done += 1;
      console.log(`  [${done}/${prebakeShards.length}] ${shard.id} (${pages.length} pages)`);
    }),
  );

  return {
    manifest,
    output_path: contextPath,
    shards_dir: shardsDir,
    prebaked_shards: prebakeShards.length,
  };
}
