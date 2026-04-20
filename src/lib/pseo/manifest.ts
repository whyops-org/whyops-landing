import { generatePseoValidatedSet } from "@/lib/pseo/generator";
import { dedupe, slugify } from "@/lib/pseo/normalize";
import type {
  NormalizedDataset,
  NormalizedGlossaryTerm,
  NormalizedLocation,
  NormalizedProfile,
  NormalizedTool,
  PlaybookType,
  PseoBatchResponse,
  PseoManifest,
  PseoManifestOptions,
  PseoManifestShard,
  PseoPage,
  PseoShardOwnershipScope,
} from "@/lib/pseo/types";

const DEFAULT_LOCATION_SHARD_SIZE = 50;
const DEFAULT_LANGUAGE_SHARD_SIZE = 12;

const GLOBAL_UTILITY_CONTEXT_PLAYBOOKS: PlaybookType[] = [
  "templates",
  "conversions",
  "comparisons",
  "integrations",
  "directory",
  "profiles",
];

const GLOBAL_UTILITY_OWNED_PLAYBOOKS: PlaybookType[] = ["conversions", "integrations"];

const CATEGORY_CORE_PLAYBOOKS: PlaybookType[] = [
  "templates",
  "curation",
  "comparisons",
  "examples",
  "personas",
  "glossary",
  "directory",
  "profiles",
];

const CATEGORY_LOCATION_PLAYBOOKS: PlaybookType[] = ["locations", "glossary"];

const CATEGORY_TRANSLATION_PLAYBOOKS: PlaybookType[] = ["translations", "glossary"];

function resolveOptions(options?: PseoManifestOptions): Required<PseoManifestOptions> {
  return {
    locationShardSize: options?.locationShardSize || DEFAULT_LOCATION_SHARD_SIZE,
    languageShardSize: options?.languageShardSize || DEFAULT_LANGUAGE_SHARD_SIZE,
  };
}

function findToolsForCategory(
  dataset: NormalizedDataset,
  categorySlug?: string,
): NormalizedTool[] {
  if (!categorySlug) {
    return dataset.tools;
  }

  return dataset.tools.filter((tool) => slugify(tool.category || "") === categorySlug);
}

function findGlossaryForCategory(
  dataset: NormalizedDataset,
  categorySlug?: string,
  glossaryNames: string[] = [],
): NormalizedGlossaryTerm[] {
  if (!categorySlug) {
    return dataset.glossaryTerms;
  }

  const relatedGlossary = new Set(glossaryNames.map((item) => slugify(item)));
  return dataset.glossaryTerms.filter(
    (term) => term.slug === categorySlug || relatedGlossary.has(term.slug),
  );
}

function findProfilesForTools(
  dataset: NormalizedDataset,
  tools: NormalizedTool[],
): NormalizedProfile[] {
  if (!tools.length) {
    return dataset.profiles;
  }

  const toolKeys = new Set(
    tools.flatMap((tool) => [
      tool.slug,
      slugify(tool.name),
      slugify(tool.website || ""),
    ]),
  );

  return dataset.profiles.filter((profile) =>
    [profile.slug, slugify(profile.name), slugify(profile.company)].some((key) =>
      toolKeys.has(key),
    ),
  );
}

function estimateComparisonPairs(tools: NormalizedTool[]): number {
  return tools.length >= 2 ? (tools.length * (tools.length - 1)) / 2 : 0;
}

function estimateCorePages(dataset: NormalizedDataset, categorySlug: string): number {
  const category = dataset.categories.find((item) => item.slug === categorySlug);
  if (!category) {
    return 0;
  }

  const tools = findToolsForCategory(dataset, categorySlug);
  const profiles = findProfilesForTools(dataset, tools);
  const glossary = findGlossaryForCategory(dataset, categorySlug, category.glossaryTerms);
  const services = Math.max(category.useCases.length, 1);
  const personas = dataset.personas.length;
  const templates = dataset.fileFormats.length;
  const curation = tools.length >= 3 ? 1 + services : 0;
  const comparisons = estimateComparisonPairs(tools);
  const examples = category.examples.length >= 3 ? 1 + services : 0;
  const personaPages = personas > 0 ? personas * (1 + services) : 0;
  const directory = tools.length >= 3 ? 1 + services : 0;

  return (
    templates +
    curation +
    comparisons +
    examples +
    personaPages +
    glossary.length +
    directory +
    profiles.length
  );
}

function estimateLocationPages(
  dataset: NormalizedDataset,
  categorySlug: string,
  locationLimit: number,
): number {
  const category = dataset.categories.find((item) => item.slug === categorySlug);
  if (!category) {
    return 0;
  }

  const services = Math.max(category.useCases.length, 1);
  const personas = dataset.personas.length;
  const tools = findToolsForCategory(dataset, categorySlug);
  const locationCurations = tools.length >= 3 ? locationLimit : 0;

  return locationLimit * (1 + services + personas + personas * services) + locationCurations;
}

function estimateTranslationCorePages(
  dataset: NormalizedDataset,
  categorySlug: string,
  languageLimit: number,
): number {
  const category = dataset.categories.find((item) => item.slug === categorySlug);
  if (!category) {
    return 0;
  }

  const services = Math.max(category.useCases.length, 1);
  const personas = dataset.personas.length;

  return languageLimit * (1 + services + personas * services);
}

function estimateTranslationLocationPages(
  dataset: NormalizedDataset,
  categorySlug: string,
  locationLimit: number,
  languageLimit: number,
): number {
  const category = dataset.categories.find((item) => item.slug === categorySlug);
  if (!category) {
    return 0;
  }

  const services = Math.max(category.useCases.length, 1);
  return locationLimit * languageLimit * services;
}

function estimateGlobalUtilityPages(dataset: NormalizedDataset): number {
  const conversions =
    dataset.fileFormats.length >= 2
      ? dataset.fileFormats.length * (dataset.fileFormats.length - 1)
      : 0;

  return conversions + dataset.integrations.length;
}

function getLocationSlice(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
): NormalizedLocation[] {
  if (shard.location_offset === undefined) {
    return [];
  }

  return dataset.locations.slice(
    shard.location_offset,
    shard.location_offset + (shard.location_limit || dataset.locations.length),
  );
}

function getLanguageSlugs(dataset: NormalizedDataset, shard: PseoManifestShard): string[] {
  if (shard.language_offset === undefined) {
    return [];
  }

  return dataset.languages
    .slice(
      shard.language_offset,
      shard.language_offset + (shard.language_limit || dataset.languages.length),
    )
    .map((language) => language.slug);
}

function getLocationSlugs(dataset: NormalizedDataset, shard: PseoManifestShard): string[] {
  return getLocationSlice(dataset, shard).map((location) => location.slug);
}

function pathnameFromUrl(url: string): string {
  return new URL(url).pathname.replace(/\/+$/, "") || "/";
}

function isLocalizedLocationPath(
  page: PseoPage,
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
): boolean {
  const languageSlugs = getLanguageSlugs(dataset, shard);
  const locationSlugs = getLocationSlugs(dataset, shard);

  if (!languageSlugs.length || !locationSlugs.length) {
    return false;
  }

  const pathname = pathnameFromUrl(page.url);
  return languageSlugs.some((languageSlug) =>
    locationSlugs.some((locationSlug) =>
      pathname.startsWith(`/${languageSlug}/${locationSlug}/`),
    ),
  );
}

function ownsPage(
  page: PseoPage,
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
): boolean {
  const scope: PseoShardOwnershipScope = shard.ownership_scope;

  if (scope === "location-scoped") {
    const pathname = pathnameFromUrl(page.url);
    return (
      page.playbook_type === "locations" ||
      pathname.startsWith(`/best/${shard.category_slug}-tools/`)
    );
  }

  if (scope === "translations-core") {
    return (
      page.playbook_type === "translations" &&
      !isLocalizedLocationPath(page, dataset, shard)
    );
  }

  if (scope === "translations-location") {
    return (
      page.playbook_type === "translations" &&
      isLocalizedLocationPath(page, dataset, shard)
    );
  }

  return shard.owned_playbooks.includes(page.playbook_type);
}

function countPlaybooks(
  pages: Array<Pick<PseoPage, "playbook_type">>,
): Partial<Record<PlaybookType, number>> {
  return pages.reduce<Partial<Record<PlaybookType, number>>>((accumulator, page) => {
    accumulator[page.playbook_type] = (accumulator[page.playbook_type] || 0) + 1;
    return accumulator;
  }, {});
}

export function buildPseoManifest(
  dataset: NormalizedDataset,
  options?: PseoManifestOptions,
): PseoManifest {
  const resolved = resolveOptions(options);
  const shards: PseoManifestShard[] = [];

  const globalUtilityEstimate = estimateGlobalUtilityPages(dataset);
  if (globalUtilityEstimate > 0) {
    shards.push({
      id: "global:utility",
      kind: "global-utility",
      playbooks: GLOBAL_UTILITY_CONTEXT_PLAYBOOKS,
      owned_playbooks: GLOBAL_UTILITY_OWNED_PLAYBOOKS,
      ownership_scope: "playbooks",
      estimated_pages: globalUtilityEstimate,
      estimated_context_pages:
        globalUtilityEstimate + dataset.categories.length * dataset.fileFormats.length,
    });
  }

  dataset.categories.forEach((category) => {
    const coreEstimate = estimateCorePages(dataset, category.slug);
    if (coreEstimate > 0) {
      shards.push({
        id: `core:${category.slug}`,
        kind: "category-core",
        category_slug: category.slug,
        category_name: category.name,
        playbooks: CATEGORY_CORE_PLAYBOOKS,
        owned_playbooks: CATEGORY_CORE_PLAYBOOKS,
        ownership_scope: "playbooks",
        estimated_pages: coreEstimate,
      });
    }

    for (
      let locationOffset = 0;
      locationOffset < dataset.locations.length;
      locationOffset += resolved.locationShardSize
    ) {
      const locationLimit = Math.min(
        resolved.locationShardSize,
        dataset.locations.length - locationOffset,
      );
      const estimatedPages = estimateLocationPages(dataset, category.slug, locationLimit);

      if (estimatedPages > 0) {
        shards.push({
          id: `location:${category.slug}:${locationOffset}`,
          kind: "category-location",
          category_slug: category.slug,
          category_name: category.name,
          playbooks: CATEGORY_LOCATION_PLAYBOOKS,
          owned_playbooks: ["locations", "curation"],
          ownership_scope: "location-scoped",
          location_offset: locationOffset,
          location_limit: locationLimit,
          estimated_pages: estimatedPages,
          estimated_context_pages: estimatedPages + coreEstimate,
        });
      }
    }

    for (
      let languageOffset = 0;
      languageOffset < dataset.languages.length;
      languageOffset += resolved.languageShardSize
    ) {
      const languageLimit = Math.min(
        resolved.languageShardSize,
        dataset.languages.length - languageOffset,
      );
      const translationCoreEstimate = estimateTranslationCorePages(
        dataset,
        category.slug,
        languageLimit,
      );

      if (translationCoreEstimate > 0) {
        shards.push({
          id: `translation-core:${category.slug}:${languageOffset}`,
          kind: "category-translation-core",
          category_slug: category.slug,
          category_name: category.name,
          playbooks: CATEGORY_TRANSLATION_PLAYBOOKS,
          owned_playbooks: ["translations"],
          ownership_scope: "translations-core",
          language_offset: languageOffset,
          language_limit: languageLimit,
          estimated_pages: translationCoreEstimate,
          estimated_context_pages: translationCoreEstimate + coreEstimate,
        });
      }

      for (
        let locationOffset = 0;
        locationOffset < dataset.locations.length;
        locationOffset += resolved.locationShardSize
      ) {
        const locationLimit = Math.min(
          resolved.locationShardSize,
          dataset.locations.length - locationOffset,
        );
        const translationLocationEstimate = estimateTranslationLocationPages(
          dataset,
          category.slug,
          locationLimit,
          languageLimit,
        );

        if (translationLocationEstimate === 0) {
          continue;
        }

        shards.push({
          id: `translation-location:${category.slug}:${languageOffset}:${locationOffset}`,
          kind: "category-translation-location",
          category_slug: category.slug,
          category_name: category.name,
          playbooks: CATEGORY_TRANSLATION_PLAYBOOKS,
          owned_playbooks: ["translations"],
          ownership_scope: "translations-location",
          location_offset: locationOffset,
          location_limit: locationLimit,
          language_offset: languageOffset,
          language_limit: languageLimit,
          estimated_pages: translationLocationEstimate,
          estimated_context_pages: translationLocationEstimate + coreEstimate,
        });
      }
    }
  });

  return {
    total_estimated_pages: shards.reduce((sum, shard) => sum + shard.estimated_pages, 0),
    shard_count: shards.length,
    options: resolved,
    shards,
  };
}

export function getShardById(
  manifest: PseoManifest,
  shardId: string,
): PseoManifestShard | null {
  return manifest.shards.find((shard) => shard.id === shardId) || null;
}

export function filterDatasetForShard(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
): NormalizedDataset {
  const category = shard.category_slug
    ? dataset.categories.find((item) => item.slug === shard.category_slug)
    : undefined;
  const categoryTools = findToolsForCategory(dataset, shard.category_slug);
  const categoryGlossary = findGlossaryForCategory(
    dataset,
    shard.category_slug,
    category?.glossaryTerms || [],
  );
  const categoryProfiles = findProfilesForTools(dataset, categoryTools);
  const locationSlice = getLocationSlice(dataset, shard);
  const languageSlice =
    shard.language_offset !== undefined
      ? dataset.languages.slice(
          shard.language_offset,
          shard.language_offset + (shard.language_limit || dataset.languages.length),
        )
      : [];

  if (shard.kind === "global-utility") {
    return {
      categories: dataset.categories,
      tools: dataset.tools,
      locations: [],
      personas: dataset.personas,
      fileFormats: dataset.fileFormats,
      languages: [],
      integrations: dataset.integrations,
      glossaryTerms: [],
      profiles: dataset.profiles,
    };
  }

  if (shard.kind === "category-core") {
    return {
      categories: category ? [category] : [],
      tools: categoryTools,
      locations: [],
      personas: dataset.personas,
      fileFormats: dataset.fileFormats,
      languages: [],
      integrations: [],
      glossaryTerms: categoryGlossary,
      profiles: categoryProfiles,
    };
  }

  if (shard.kind === "category-location") {
    return {
      categories: category ? [category] : [],
      tools: categoryTools,
      locations: locationSlice,
      personas: dataset.personas,
      fileFormats: dataset.fileFormats,
      languages: [],
      integrations: [],
      glossaryTerms: categoryGlossary,
      profiles: categoryProfiles,
    };
  }

  if (shard.kind === "category-translation-core") {
    return {
      categories: category ? [category] : [],
      tools: categoryTools,
      locations: [],
      personas: dataset.personas,
      fileFormats: dataset.fileFormats,
      languages: languageSlice,
      integrations: [],
      glossaryTerms: categoryGlossary,
      profiles: categoryProfiles,
    };
  }

  return {
    categories: category ? [category] : [],
    tools: categoryTools,
    locations: locationSlice,
    personas: dataset.personas,
    fileFormats: dataset.fileFormats,
    languages: languageSlice,
    integrations: [],
    glossaryTerms: categoryGlossary,
    profiles: categoryProfiles,
  };
}

export function generatePseoPagesForShard(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
  basePath = "",
): {
  status: "OK" | "SKIPPED";
  reason?: string;
  pages?: PseoPage[];
  stats?: NonNullable<PseoBatchResponse["stats"]>;
} {
  const filtered = filterDatasetForShard(dataset, shard);
  const validated = generatePseoValidatedSet(filtered, {
    basePath,
    includePlaybooks: shard.playbooks,
    targetPages: shard.estimated_pages,
  });

  if (validated.status === "SKIPPED" || !validated.pages || !validated.stats) {
    return validated;
  }

  const ownedPages = validated.pages.filter((page) => ownsPage(page, filtered, shard));

  if (ownedPages.length === 0) {
    return {
      status: "SKIPPED",
      reason: `Shard "${shard.id}" produced linkable context pages, but no owned URLs survived filtering.`,
    };
  }

  return {
    status: "OK",
    pages: ownedPages,
    stats: {
      requested_batch_size: ownedPages.length,
      returned_pages: ownedPages.length,
      total_candidate_pages: validated.stats.total_candidate_pages,
      total_valid_pages: ownedPages.length,
      unique_playbooks: dedupe(ownedPages.map((page) => page.playbook_type)) as PlaybookType[],
      rejected_pages: validated.stats.total_candidate_pages - ownedPages.length,
      meets_target_pages:
        typeof validated.stats.target_pages === "number"
          ? ownedPages.length >= validated.stats.target_pages
          : undefined,
      target_pages: validated.stats.target_pages,
      playbook_counts: countPlaybooks(ownedPages),
      generation_diagnostics: validated.stats.generation_diagnostics,
    },
  };
}

export function generatePseoBatchForShard(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
  batchSize: number,
  cursor = 0,
  basePath = "",
): PseoBatchResponse {
  const generated = generatePseoPagesForShard(dataset, shard, basePath);

  if (generated.status === "SKIPPED" || !generated.pages || !generated.stats) {
    return generated;
  }

  const normalizedCursor = Math.max(cursor, 0);
  const normalizedBatchSize = Math.min(Math.max(batchSize, 1), 100);
  const pages = generated.pages.slice(normalizedCursor, normalizedCursor + normalizedBatchSize);

  if (pages.length === 0) {
    return {
      status: "SKIPPED",
      reason: "The requested cursor is beyond the available validated page set for this shard.",
    };
  }

  return {
    status: "OK",
    pages,
    next_cursor:
      normalizedCursor + pages.length < generated.pages.length
        ? normalizedCursor + pages.length
        : null,
    stats: {
      ...generated.stats,
      requested_batch_size: normalizedBatchSize,
      returned_pages: pages.length,
    },
  };
}
