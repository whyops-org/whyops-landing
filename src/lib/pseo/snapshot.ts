import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
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

const SNAPSHOT_ROOT = path.join(process.cwd(), "public", "generated", "pseo");
const SNAPSHOT_CONTEXT_PATH = path.join(SNAPSHOT_ROOT, "context.json");
const SNAPSHOT_SHARDS_DIR = path.join(SNAPSHOT_ROOT, "shards");

function shardIdToFilename(shardId: string): string {
  return shardId.replace(/:/g, "--") + ".json";
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function loadPseoSnapshotContext(): Promise<PseoSnapshotContext | null> {
  return readJsonFile<PseoSnapshotContext>(SNAPSHOT_CONTEXT_PATH);
}

export async function loadPseoShardPages(shardId: string): Promise<PseoPage[] | null> {
  const filePath = path.join(SNAPSHOT_SHARDS_DIR, shardIdToFilename(shardId));
  return readJsonFile<PseoPage[]>(filePath);
}

export async function writePseoSnapshot() {
  const resolved = await resolvePseoDataset(undefined, getSiteSourceConfig());
  const manifest = buildPseoManifest(resolved.normalized_dataset);

  const snapshotContext: PseoSnapshotContext = {
    version: 1,
    generated_at: new Date().toISOString(),
    normalized_dataset: resolved.normalized_dataset,
    manifest,
  };

  await rm(SNAPSHOT_ROOT, { recursive: true, force: true });
  await mkdir(SNAPSHOT_SHARDS_DIR, { recursive: true });
  await writeFile(SNAPSHOT_CONTEXT_PATH, JSON.stringify(snapshotContext), "utf8");

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
      const filePath = path.join(SNAPSHOT_SHARDS_DIR, shardIdToFilename(shard.id));
      await writeFile(filePath, JSON.stringify(pages), "utf8");
      done += 1;
      console.log(`  [${done}/${prebakeShards.length}] ${shard.id} (${pages.length} pages)`);
    }),
  );

  return {
    manifest,
    output_path: SNAPSHOT_CONTEXT_PATH,
    shards_dir: SNAPSHOT_SHARDS_DIR,
    prebaked_shards: prebakeShards.length,
  };
}
