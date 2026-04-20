import { filterDatasetForShard, generatePseoPagesForShard } from "@/lib/pseo/manifest";
import {
  buildLocationUrlDrafts,
  buildTranslationCoreUrlDrafts,
  buildTranslationLocationUrlDrafts,
} from "@/lib/pseo/url-draft-builders";
import type { NormalizedDataset, PseoManifestShard } from "@/lib/pseo/types";

function buildValidatedNonCoreUrls(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
  basePath: string,
): string[] {
  const filtered = filterDatasetForShard(dataset, shard);

  if (shard.kind === "category-location") {
    return buildLocationUrlDrafts(filtered, basePath).map((page) => page.url);
  }

  if (shard.kind === "category-translation-core") {
    return buildTranslationCoreUrlDrafts(filtered, basePath).map((page) => page.url);
  }

  return buildTranslationLocationUrlDrafts(filtered, basePath).map((page) => page.url);
}

export function generatePseoUrlsForShard(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
  basePath = "",
): string[] {
  if (shard.kind === "global-utility" || shard.kind === "category-core") {
    const generated = generatePseoPagesForShard(dataset, shard, basePath);
    return generated.status === "OK" && generated.pages ? generated.pages.map((page) => page.url) : [];
  }

  return buildValidatedNonCoreUrls(dataset, shard, basePath);
}
