import {
  buildCategoryCoreSitemapPath,
  buildCategoryLocationsPagePath,
  buildCategoryTranslationCorePagePath,
  buildCategoryTranslationLocationPagePath,
  buildGlobalUtilitySitemapPath,
} from "@/lib/pseo/sitemap";
import { resolvePseoDataset } from "@/lib/pseo/api";
import {
  loadPseoRoutingIndex,
  loadPseoShardPages,
  loadPseoShardUrls,
  loadPseoSnapshotContext,
  type PseoRoutingIndex,
} from "@/lib/pseo/snapshot";
import { getSiteSourceConfig } from "@/lib/pseo/source-config";
import {
  buildPseoManifest,
  generatePseoPagesForShard,
  getShardById,
} from "@/lib/pseo/manifest";
import { slugify } from "@/lib/pseo/normalize";
import { generatePseoUrlsForShard } from "@/lib/pseo/shard-urls";
import type {
  NormalizedDataset,
  PseoManifest,
  PseoManifestShard,
  PseoPage,
} from "@/lib/pseo/types";

type SitePseoContext = {
  normalized_dataset: NormalizedDataset;
  manifest: PseoManifest;
};

type CategoryShardGroups = {
  core: PseoManifestShard | null;
  location: PseoManifestShard[];
  translationCore: PseoManifestShard[];
  translationLocation: PseoManifestShard[];
};

let siteContextPromise: Promise<SitePseoContext> | null = null;
let snapshotContextPromise: Promise<Awaited<ReturnType<typeof loadPseoSnapshotContext>>> | null =
  null;
let routingIndexPromise: Promise<PseoRoutingIndex | null> | null = null;

async function getCachedRoutingIndex(): Promise<PseoRoutingIndex | null> {
  if (!routingIndexPromise) {
    routingIndexPromise = loadPseoRoutingIndex();
  }
  return routingIndexPromise;
}

async function getCachedSnapshotContext() {
  if (!snapshotContextPromise) {
    snapshotContextPromise = loadPseoSnapshotContext();
  }

  return snapshotContextPromise;
}

async function getCachedSitePseoContext(): Promise<SitePseoContext> {
  if (!siteContextPromise) {
    siteContextPromise = (async () => {
      const resolved = await resolvePseoDataset(undefined, getSiteSourceConfig());
      return {
        normalized_dataset: resolved.normalized_dataset,
        manifest: buildPseoManifest(resolved.normalized_dataset),
      };
    })();
  }

  return siteContextPromise;
}

const shardPageCache = new Map<string, Promise<PseoPage[]>>();
const shardUrlCache = new Map<string, Promise<string[]>>();

function isPrebakedShardId(shardId: string): boolean {
  return shardId === "global:utility" || shardId.startsWith("core:");
}

async function getResolvedManifest(): Promise<PseoManifest> {
  // Prefer the lightweight routing index (145KB) over the full context (964KB).
  // The routing index manifest has all shard IDs and options needed for routing/sitemaps.
  const routingIndex = await getCachedRoutingIndex();
  if (routingIndex?.manifest) {
    return routingIndex.manifest as PseoManifest;
  }

  const snapshot = await getCachedSnapshotContext();
  if (snapshot?.manifest) {
    return snapshot.manifest;
  }

  const context = await getCachedSitePseoContext();
  return context.manifest;
}

function buildLeafSitemapPathsFromShards(shards: PseoManifestShard[]): string[] {
  const sorted = [...shards].sort(sortShards);
  const paths: string[] = [];
  const counters = new Map<
    string,
    { location: number; translationCore: number; translationLocation: number }
  >();

  for (const shard of sorted) {
    if (shard.kind === "global-utility") {
      paths.push(buildGlobalUtilitySitemapPath());
      continue;
    }

    if (!shard.category_slug) {
      continue;
    }

    const state = counters.get(shard.category_slug) || {
      location: 0,
      translationCore: 0,
      translationLocation: 0,
    };

    if (shard.kind === "category-core") {
      paths.push(buildCategoryCoreSitemapPath(shard.category_slug));
    } else if (shard.kind === "category-location") {
      paths.push(buildCategoryLocationsPagePath(shard.category_slug, state.location));
      state.location += 1;
    } else if (shard.kind === "category-translation-core") {
      paths.push(
        buildCategoryTranslationCorePagePath(shard.category_slug, state.translationCore),
      );
      state.translationCore += 1;
    } else if (shard.kind === "category-translation-location") {
      paths.push(
        buildCategoryTranslationLocationPagePath(
          shard.category_slug,
          state.translationLocation,
        ),
      );
      state.translationLocation += 1;
    }

    counters.set(shard.category_slug, state);
  }

  return paths;
}

function sortShards(left: PseoManifestShard, right: PseoManifestShard) {
  return [
    left.kind,
    String(left.language_offset || 0).padStart(6, "0"),
    String(left.location_offset || 0).padStart(6, "0"),
    left.id,
  ]
    .join(":")
    .localeCompare(
      [
        right.kind,
        String(right.language_offset || 0).padStart(6, "0"),
        String(right.location_offset || 0).padStart(6, "0"),
        right.id,
      ].join(":"),
    );
}

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "");
}

function pathnameFromPage(page: PseoPage): string {
  return normalizePathname(new URL(page.url).pathname);
}

function categoryFromCompositeSlug(
  dataset: NormalizedDataset,
  compositeSlug?: string,
): string | null {
  if (!compositeSlug) {
    return null;
  }

  const match = [...dataset.categories]
    .sort((left, right) => right.slug.length - left.slug.length)
    .find(
      (category) =>
        compositeSlug === category.slug ||
        compositeSlug.startsWith(`${category.slug}-`),
    );

  return match?.slug || null;
}

function categoryFromGlossary(
  dataset: NormalizedDataset,
  glossarySlug?: string,
): string | null {
  if (!glossarySlug) {
    return null;
  }

  const category = dataset.categories.find(
    (item) =>
      item.slug === glossarySlug ||
      item.glossaryTerms.some((term) => slugify(term) === glossarySlug),
  );

  return category?.slug || null;
}

function categoryFromProfile(
  dataset: NormalizedDataset,
  profileSlug?: string,
): string | null {
  if (!profileSlug) {
    return null;
  }

  const profile = dataset.profiles.find((item) => item.slug === profileSlug);
  if (!profile) {
    return null;
  }

  const tool = dataset.tools.find(
    (item) =>
      item.slug === profile.slug ||
      slugify(item.name) === profile.slug ||
      slugify(item.website || "") === profile.slug,
  );

  return tool?.category ? slugify(tool.category) : null;
}

function categoryFromComparison(
  dataset: NormalizedDataset,
  comparisonSlug?: string,
): string | null {
  if (!comparisonSlug || !comparisonSlug.includes("-vs-")) {
    return null;
  }

  const [leftSlug, rightSlug] = comparisonSlug.split("-vs-");
  const leftTool = dataset.tools.find((item) => item.slug === leftSlug);
  const rightTool = dataset.tools.find((item) => item.slug === rightSlug);

  if (!leftTool?.category || !rightTool?.category) {
    return null;
  }

  const leftCategory = slugify(leftTool.category);
  const rightCategory = slugify(rightTool.category);

  return leftCategory === rightCategory ? leftCategory : null;
}

function locationOffsetForSlug(
  manifest: PseoManifest,
  dataset: NormalizedDataset,
  locationSlug?: string,
): number | null {
  if (!locationSlug) {
    return null;
  }

  const index = dataset.locations.findIndex((item) => item.slug === locationSlug);
  if (index < 0) {
    return null;
  }

  return Math.floor(index / manifest.options.locationShardSize) * manifest.options.locationShardSize;
}

function languageOffsetForSlug(
  manifest: PseoManifest,
  dataset: NormalizedDataset,
  languageSlug?: string,
): number | null {
  if (!languageSlug) {
    return null;
  }

  const index = dataset.languages.findIndex((item) => item.slug === languageSlug);
  if (index < 0) {
    return null;
  }

  return Math.floor(index / manifest.options.languageShardSize) * manifest.options.languageShardSize;
}

function getAllCoreShardIds(manifest: PseoManifest): string[] {
  return manifest.shards
    .filter((shard) => shard.kind === "category-core")
    .map((shard) => shard.id);
}

function inferCandidateShardIds(
  pathname: string,
  dataset: NormalizedDataset,
  manifest: PseoManifest,
): string[] {
  const segments = normalizePathname(pathname).split("/").filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  const [first, second, third] = segments;
  const categorySlugs = new Set(dataset.categories.map((item) => item.slug));
  const languageSlugs = new Set(dataset.languages.map((item) => item.slug));
  const locationSlugs = new Set(dataset.locations.map((item) => item.slug));

  if (first === "conversions" || first === "integrations") {
    return ["global:utility"];
  }

  if (first === "compare") {
    const categorySlug = categoryFromComparison(dataset, second);
    return categorySlug ? [`core:${categorySlug}`] : getAllCoreShardIds(manifest);
  }

  if (first === "templates") {
    const categorySlug = categoryFromCompositeSlug(dataset, second?.replace(/-template$/, ""));
    return categorySlug ? [`core:${categorySlug}`] : getAllCoreShardIds(manifest);
  }

  if (first === "best" && second?.endsWith("-tools")) {
    const inferredCategorySlug = second.slice(0, -"-tools".length);
    if (third) {
      const locationOffset = locationOffsetForSlug(manifest, dataset, third);
      return locationOffset !== null
        ? [`location:${inferredCategorySlug}:${locationOffset}`]
        : [`core:${inferredCategorySlug}`];
    }

    return [`core:${inferredCategorySlug}`];
  }

  if (first === "examples" || first === "directory") {
    return second && categorySlugs.has(second) ? [`core:${second}`] : getAllCoreShardIds(manifest);
  }

  if (first === "glossary") {
    const categorySlug = categoryFromGlossary(dataset, second);
    return categorySlug ? [`core:${categorySlug}`] : getAllCoreShardIds(manifest);
  }

  if (first === "profiles") {
    const categorySlug = categoryFromProfile(dataset, second);
    return categorySlug ? [`core:${categorySlug}`] : getAllCoreShardIds(manifest);
  }

  if (first === "locations" && second && third && categorySlugs.has(third)) {
    const locationOffset = locationOffsetForSlug(manifest, dataset, second);
    return locationOffset !== null ? [`location:${third}:${locationOffset}`] : [];
  }

  if (languageSlugs.has(first)) {
    const languageOffset = languageOffsetForSlug(manifest, dataset, first);
    if (languageOffset === null) {
      return [];
    }

    if (second && categorySlugs.has(second)) {
      return [`translation-core:${second}:${languageOffset}`];
    }

    if (second && locationSlugs.has(second) && third && categorySlugs.has(third)) {
      const locationOffset = locationOffsetForSlug(manifest, dataset, second);
      return locationOffset !== null
        ? [`translation-location:${third}:${languageOffset}:${locationOffset}`]
        : [];
    }
  }

  if (categorySlugs.has(first)) {
    return [`core:${first}`];
  }

  return [];
}

async function getMemoryCachedShardPages(shardId: string): Promise<PseoPage[]> {
  if (isPrebakedShardId(shardId)) {
    const existing = shardPageCache.get(shardId);
    if (existing) {
      return existing;
    }
  }

  const promise = (async () => {
    const prebaked = await loadPseoShardPages(shardId);
    if (prebaked !== null) {
      return prebaked;
    }

    const snapshot = await getCachedSnapshotContext();
    if (snapshot) {
      const shard = getShardById(snapshot.manifest, shardId);
      if (!shard) {
        return [];
      }

      const generated = generatePseoPagesForShard(
        snapshot.normalized_dataset,
        shard,
      );

      return generated.status === "OK" && generated.pages ? generated.pages : [];
    }

    const context = await getCachedSitePseoContext();
    const shard = getShardById(context.manifest, shardId);

    if (!shard) {
      return [];
    }

    const generated = generatePseoPagesForShard(
      context.normalized_dataset,
      shard,
    );

    return generated.status === "OK" && generated.pages ? generated.pages : [];
  })();

  if (isPrebakedShardId(shardId)) {
    shardPageCache.set(shardId, promise);
  }
  return promise;
}

async function resolvePageFromCandidateShard(
  pathname: string,
  shard: PseoManifestShard,
): Promise<PseoPage | null> {
  const pages = await getMemoryCachedShardPages(shard.id);
  return pages.find((page) => pathnameFromPage(page) === normalizePathname(pathname)) || null;
}

export function shardIdToSitemapSlug(shardId: string): string {
  return shardId.replace(/:/g, "--");
}

export function sitemapSlugToShardId(slug: string): string {
  return slug.replace(/--/g, ":");
}

export async function getSitePseoContext() {
  return getCachedSitePseoContext();
}

export async function getSitePseoShardPages(shardId: string) {
  return getMemoryCachedShardPages(shardId);
}

// Returns only the URLs for a shard — much cheaper than getSitePseoShardPages.
// Uses the pre-generated URL-only index file (~50-150KB) instead of triggering
// full page generation (which can be 2500+ pages × 8KB each in Workers).
export async function getSitePseoShardUrls(shardId: string): Promise<string[]> {
  if (isPrebakedShardId(shardId)) {
    const existing = shardUrlCache.get(shardId);
    if (existing) return existing;
  }

  const promise = (async () => {
    const urls = await loadPseoShardUrls(shardId);
    if (urls !== null) return urls;

    const snapshot = await getCachedSnapshotContext();
    if (snapshot) {
      const shard = getShardById(snapshot.manifest, shardId);
      if (!shard) {
        return [];
      }

      return generatePseoUrlsForShard(snapshot.normalized_dataset, shard);
    }

    const context = await getCachedSitePseoContext();
    const shard = getShardById(context.manifest, shardId);
    if (!shard) {
      return [];
    }

    return generatePseoUrlsForShard(context.normalized_dataset, shard);
  })();

  if (isPrebakedShardId(shardId)) {
    shardUrlCache.set(shardId, promise);
  }
  return promise;
}

export async function getSitePseoShard(shardId: string): Promise<PseoManifestShard | null> {
  const manifest = await getResolvedManifest();
  return getShardById(manifest, shardId);
}

export async function getSitePseoManifest() {
  return getResolvedManifest();
}

export async function getSitePseoCategoryShards(categorySlug: string) {
  const manifest = await getResolvedManifest();
  return manifest.shards
    .filter((shard) => shard.category_slug === categorySlug)
    .sort(sortShards);
}

export async function getSitePseoGlobalShards() {
  const manifest = await getResolvedManifest();
  return manifest.shards
    .filter((shard) => shard.kind === "global-utility")
    .sort(sortShards);
}

export async function getSitePseoLeafSitemapPaths() {
  const manifest = await getResolvedManifest();
  return buildLeafSitemapPathsFromShards(manifest.shards);
}

export async function getSitePseoCategoryShardGroups(
  categorySlug: string,
): Promise<CategoryShardGroups> {
  const shards = await getSitePseoCategoryShards(categorySlug);

  return {
    core: shards.find((shard) => shard.kind === "category-core") || null,
    location: shards.filter((shard) => shard.kind === "category-location"),
    translationCore: shards.filter(
      (shard) => shard.kind === "category-translation-core",
    ),
    translationLocation: shards.filter(
      (shard) => shard.kind === "category-translation-location",
    ),
  };
}

export async function getSitePseoCategoryLeafSitemapPaths(categorySlug: string) {
  const shards = await getSitePseoCategoryShards(categorySlug);
  return buildLeafSitemapPathsFromShards(shards);
}

export async function getPrettySitemapPathForShard(
  shardId: string,
): Promise<string | null> {
  const shard = await getSitePseoShard(shardId);
  if (!shard) {
    return null;
  }

  if (shard.kind === "global-utility") {
    return buildGlobalUtilitySitemapPath();
  }

  if (!shard.category_slug) {
    return null;
  }

  const groups = await getSitePseoCategoryShardGroups(shard.category_slug);

  if (shard.kind === "category-core") {
    return buildCategoryCoreSitemapPath(shard.category_slug);
  }

  if (shard.kind === "category-location") {
    const index = groups.location.findIndex((item) => item.id === shard.id);
    return index >= 0 ? buildCategoryLocationsPagePath(shard.category_slug, index) : null;
  }

  if (shard.kind === "category-translation-core") {
    const index = groups.translationCore.findIndex((item) => item.id === shard.id);
    return index >= 0
      ? buildCategoryTranslationCorePagePath(shard.category_slug, index)
      : null;
  }

  if (shard.kind === "category-translation-location") {
    const index = groups.translationLocation.findIndex((item) => item.id === shard.id);
    return index >= 0
      ? buildCategoryTranslationLocationPagePath(shard.category_slug, index)
      : null;
  }

  return null;
}

export async function resolveSitePseoPageByPath(pathname: string): Promise<PseoPage | null> {
  const normalizedPath = normalizePathname(pathname);
  // Prefer the lightweight routing index (~145KB) over the full snapshot context (~964KB).
  // This avoids loading the full normalized_dataset just to infer a shard ID.
  // If the shard is pre-baked, the full context is never loaded at all.
  const routingIndex = await getCachedRoutingIndex();
  if (routingIndex) {
    const routingDataset = routingIndex.routing_dataset as unknown as NormalizedDataset;
    const candidateShardIds = inferCandidateShardIds(
      normalizedPath,
      routingDataset,
      routingIndex.manifest as PseoManifest,
    );

    for (const shardId of candidateShardIds) {
      const shard = getShardById(routingIndex.manifest as PseoManifest, shardId);
      if (!shard) {
        continue;
      }

      const page = await resolvePageFromCandidateShard(normalizedPath, shard);
      if (page) {
        return page;
      }
    }

    return null;
  }

  // Fallback: full snapshot context (used if routing-index.json hasn't been generated yet).
  const snapshot = await getCachedSnapshotContext();
  if (snapshot) {
    const candidateShardIds = inferCandidateShardIds(
      normalizedPath,
      snapshot.normalized_dataset,
      snapshot.manifest,
    );

    for (const shardId of candidateShardIds) {
      const shard = getShardById(snapshot.manifest, shardId);
      if (!shard) {
        continue;
      }

      const page = await resolvePageFromCandidateShard(normalizedPath, shard);
      if (page) {
        return page;
      }
    }

    return null;
  }

  const context = await getCachedSitePseoContext();
  const candidateShardIds = inferCandidateShardIds(
    normalizedPath,
    context.normalized_dataset,
    context.manifest,
  );

  for (const shardId of candidateShardIds) {
    const shard = getShardById(context.manifest, shardId);
    if (!shard) {
      continue;
    }

    const page = await resolvePageFromCandidateShard(
      normalizedPath,
      shard,
    );

    if (page) {
      return page;
    }
  }

  return null;
}
