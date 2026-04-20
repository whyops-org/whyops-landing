import { generatePseoLinkedSet } from "@/lib/pseo/generator";
import { filterDatasetForShard } from "@/lib/pseo/manifest";
import type { NormalizedDataset, PseoManifestShard, PseoPage } from "@/lib/pseo/types";

function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

function pathnameFromPage(page: PseoPage): string {
  return normalizePathname(new URL(page.url).pathname);
}

function narrowLocations(dataset: NormalizedDataset, locationSlug?: string): NormalizedDataset {
  if (!locationSlug) {
    return dataset;
  }

  const location = dataset.locations.find((item) => item.slug === locationSlug);
  if (!location) {
    return { ...dataset, locations: [] };
  }

  return { ...dataset, locations: [location] };
}

function narrowLanguages(dataset: NormalizedDataset, languageSlug?: string): NormalizedDataset {
  if (!languageSlug) {
    return dataset;
  }

  const language = dataset.languages.find((item) => item.slug === languageSlug);
  if (!language) {
    return { ...dataset, languages: [] };
  }

  return { ...dataset, languages: [language] };
}

function narrowPersonas(dataset: NormalizedDataset, pathname: string): NormalizedDataset {
  const personaSegment = pathname
    .split("/")
    .find((segment) => segment.startsWith("for-"));

  if (!personaSegment) {
    return dataset;
  }

  const personaSlug = personaSegment.slice("for-".length);
  const persona = dataset.personas.find((item) => item.slug === personaSlug);
  if (!persona) {
    return { ...dataset, personas: [] };
  }

  return { ...dataset, personas: [persona] };
}

function narrowDatasetForPath(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
  pathname: string,
): NormalizedDataset {
  const segments = normalizePathname(pathname).split("/").filter(Boolean);
  const [first, second, third] = segments;
  const personaScoped = narrowPersonas(dataset, pathname);

  if (shard.kind === "category-location") {
    const locationSlug = first === "locations" ? second : first === "best" ? third : undefined;
    return narrowLocations(personaScoped, locationSlug);
  }

  if (shard.kind === "category-translation-core") {
    return narrowLanguages(personaScoped, first);
  }

  if (shard.kind === "category-translation-location") {
    return narrowLocations(narrowLanguages(personaScoped, first), second);
  }

  return personaScoped;
}

export function resolveDynamicPageFromShard(
  dataset: NormalizedDataset,
  shard: PseoManifestShard,
  pathname: string,
): PseoPage | null {
  const narrowed = narrowDatasetForPath(filterDatasetForShard(dataset, shard), shard, pathname);
  const generated = generatePseoLinkedSet(narrowed, {
    includePlaybooks: shard.playbooks,
    targetPages: 1,
  });

  if (generated.status !== "OK" || !generated.pages) {
    return null;
  }

  const normalizedPath = normalizePathname(pathname);
  return generated.pages.find((page) => pathnameFromPage(page) === normalizedPath) || null;
}
