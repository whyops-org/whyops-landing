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
    (shard) =>
      shard.kind === "global-utility" ||
      shard.kind === "category-core" ||
      shard.kind === "category-location" ||
      shard.kind === "category-translation-core",
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

  // Write a lightweight routing index (slim manifest + routing slugs only).
  // This is loaded on every cold Worker start instead of the full 964KB context.json.
  const routingIndex = {
    version: 1 as const,
    generated_at: snapshotContext.generated_at,
    manifest: {
      shard_count: manifest.shard_count,
      total_estimated_pages: manifest.total_estimated_pages,
      options: manifest.options,
      shards: manifest.shards.map((shard) => {
        const slim: Record<string, unknown> = {
          id: shard.id,
          kind: shard.kind,
          ownership_scope: shard.ownership_scope,
        };
        if (shard.category_slug !== undefined) slim.category_slug = shard.category_slug;
        if (shard.location_offset !== undefined) slim.location_offset = shard.location_offset;
        if (shard.location_limit !== undefined) slim.location_limit = shard.location_limit;
        if (shard.language_offset !== undefined) slim.language_offset = shard.language_offset;
        if (shard.language_limit !== undefined) slim.language_limit = shard.language_limit;
        return slim;
      }),
    },
    routing_dataset: {
      categories: resolved.normalized_dataset.categories.map((c) => ({
        slug: c.slug,
        glossaryTerms: c.glossaryTerms,
      })),
      locations: resolved.normalized_dataset.locations.map((l) => ({ slug: l.slug })),
      languages: resolved.normalized_dataset.languages.map((l) => ({ slug: l.slug })),
      tools: resolved.normalized_dataset.tools.map((t) => ({
        slug: t.slug,
        name: t.name,
        website: t.website,
        category: t.category,
      })),
      profiles: resolved.normalized_dataset.profiles.map((p) => ({
        slug: p.slug,
        name: p.name,
        company: p.company,
      })),
    },
  };

  const routingIndexPath = path.join(SNAPSHOT_ROOT, "routing-index.json");
  await writeFile(routingIndexPath, JSON.stringify(routingIndex), "utf8");

  return {
    manifest,
    output_path: SNAPSHOT_CONTEXT_PATH,
    shards_dir: SNAPSHOT_SHARDS_DIR,
    prebaked_shards: prebakeShards.length,
  };
}
