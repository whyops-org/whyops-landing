// Node.js only — imported exclusively by scripts/generate-pseo-snapshot.ts
// Never imported by any app route or page (would break edge runtime).
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolvePseoDataset } from "@/lib/pseo/api";
import { buildPseoManifest, generatePseoPagesForShard } from "@/lib/pseo/manifest";
import { getSiteSourceConfig } from "@/lib/pseo/source-config";
import type { PseoPage } from "@/lib/pseo/types";

const SNAPSHOT_ROOT = path.join(process.cwd(), "public", "generated", "pseo");
const SNAPSHOT_CONTEXT_PATH = path.join(SNAPSHOT_ROOT, "context.json");
const SNAPSHOT_SHARDS_DIR = path.join(SNAPSHOT_ROOT, "shards");

function shardIdToFilename(shardId: string): string {
  return shardId.replace(/:/g, "--") + ".json";
}

export async function writePseoSnapshot() {
  const resolved = await resolvePseoDataset(undefined, getSiteSourceConfig());
  const manifest = buildPseoManifest(resolved.normalized_dataset);

  const snapshotContext = {
    version: 1 as const,
    generated_at: new Date().toISOString(),
    normalized_dataset: resolved.normalized_dataset,
    manifest,
  };

  await rm(SNAPSHOT_ROOT, { recursive: true, force: true });
  await mkdir(SNAPSHOT_SHARDS_DIR, { recursive: true });
  await writeFile(SNAPSHOT_CONTEXT_PATH, JSON.stringify(snapshotContext), "utf8");

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
