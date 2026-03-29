import { whyopsPseoCatalog } from "@/lib/pseo/catalog";
import { fetchGeoNamesExpansion } from "@/lib/pseo/providers/geonames";
import { fetchGithubExpansion } from "@/lib/pseo/providers/github";
import { fetchOnetExpansion } from "@/lib/pseo/providers/onet";
import { fetchRestCountriesExpansion } from "@/lib/pseo/providers/restCountries";
import { fetchWikidataExpansion } from "@/lib/pseo/providers/wikidata";
import { fetchWorldBankExpansion } from "@/lib/pseo/providers/worldBank";
import type {
  PlaybookType,
  PseoDatasetInput,
  PublicApiSource,
  PublicSourceConfig,
  SourceExpansionSummary,
} from "@/lib/pseo/types";

export interface DatasetCapacityEstimate {
  safe_playbook_capacity: Partial<Record<PlaybookType, number>>;
  multidimensional_capacity: Record<string, number>;
  total_safe_capacity: number;
  meets_100k_target: boolean;
  target_recipes: {
    locations_needed_for_category_x_persona_x_language: number;
    personas_needed_for_category_x_location_x_language: number;
    languages_needed_for_category_x_location_x_persona: number;
    locations_needed_for_current_generator: number;
    additional_locations_needed_for_current_generator: number;
  };
}

export interface ExpandedDatasetResult {
  dataset: PseoDatasetInput;
  source_summary: SourceExpansionSummary;
  dataset_summary: {
    categories: number;
    tools: number;
    locations: number;
    personas: number;
    file_formats: number;
    languages: number;
    integrations: number;
    glossary_terms: number;
    profiles: number;
  };
  capacity_estimate: DatasetCapacityEstimate;
}

const DEFAULT_EXPANSION_SOURCES: PublicApiSource[] = [
  "restcountries",
  "worldbank",
  "github",
];

function mergeNamedItems<T extends { name: string }>(
  left: T[] | undefined,
  right: T[] | undefined,
): T[] {
  const merged = [...(left || []), ...(right || [])];
  const seen = new Set<string>();

  return merged.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function mergeDataset(base: PseoDatasetInput, additions: PseoDatasetInput): PseoDatasetInput {
  return {
    categories: mergeNamedItems(base.categories as Array<{ name: string }> | undefined, additions.categories as Array<{ name: string }> | undefined),
    tools: mergeNamedItems(base.tools as Array<{ name: string }> | undefined, additions.tools as Array<{ name: string }> | undefined),
    locations: mergeNamedItems(base.locations as Array<{ name: string }> | undefined, additions.locations as Array<{ name: string }> | undefined),
    personas: mergeNamedItems(base.personas as Array<{ name: string }> | undefined, additions.personas as Array<{ name: string }> | undefined),
    file_formats: mergeNamedItems(base.file_formats as Array<{ name: string }> | undefined, additions.file_formats as Array<{ name: string }> | undefined),
    languages: mergeNamedItems(base.languages as Array<{ name: string }> | undefined, additions.languages as Array<{ name: string }> | undefined),
    integrations: mergeNamedItems(
      (base.integrations || []).map((item) =>
        typeof item === "string" ? { name: item, toolA: item, toolB: item } : { ...item, name: item.name || `${item.toolA} + ${item.toolB}` },
      ) as Array<{ name: string }>,
      (additions.integrations || []).map((item) =>
        typeof item === "string" ? { name: item, toolA: item, toolB: item } : { ...item, name: item.name || `${item.toolA} + ${item.toolB}` },
      ) as Array<{ name: string }>,
    ) as PseoDatasetInput["integrations"],
    glossary_terms: mergeNamedItems(
      (base.glossary_terms || []).map((item) =>
        typeof item === "string" ? { name: item } : { name: item.term, ...item },
      ) as Array<{ name: string }>,
      (additions.glossary_terms || []).map((item) =>
        typeof item === "string" ? { name: item } : { name: item.term, ...item },
      ) as Array<{ name: string }>,
    ).map((item) => {
      const { name, ...rest } = item as { name: string; term?: string };
      return {
        term: rest.term || name,
        ...(rest as object),
      };
    }) as PseoDatasetInput["glossary_terms"],
    profiles: mergeNamedItems(base.profiles as Array<{ name: string }> | undefined, additions.profiles as Array<{ name: string }> | undefined),
  };
}

function datasetSummary(dataset: PseoDatasetInput) {
  return {
    categories: dataset.categories?.length || 0,
    tools: dataset.tools?.length || 0,
    locations: dataset.locations?.length || 0,
    personas: dataset.personas?.length || 0,
    file_formats: dataset.file_formats?.length || 0,
    languages: dataset.languages?.length || 0,
    integrations: dataset.integrations?.length || 0,
    glossary_terms: dataset.glossary_terms?.length || 0,
    profiles: dataset.profiles?.length || 0,
  };
}

function comparisonCapacity(dataset: PseoDatasetInput): number {
  const toolItems = (dataset.tools || []).filter((item): item is NonNullable<PseoDatasetInput["tools"]>[number] => Boolean(item));
  const byCategory = new Map<string, number>();

  toolItems.forEach((item) => {
    if (typeof item === "string" || !item.category) {
      return;
    }

    const key = item.category.trim().toLowerCase();
    byCategory.set(key, (byCategory.get(key) || 0) + 1);
  });

  return Array.from(byCategory.values()).reduce(
    (sum, count) => sum + (count >= 2 ? (count * (count - 1)) / 2 : 0),
    0,
  );
}

function estimateCapacity(dataset: PseoDatasetInput): DatasetCapacityEstimate {
  const counts = datasetSummary(dataset);
  const categoryItems = (dataset.categories || []).filter(
    (item): item is NonNullable<PseoDatasetInput["categories"]>[number] => Boolean(item),
  );
  const averageServicesPerCategory =
    categoryItems.length === 0
      ? 0
      : Math.max(
          1,
          Math.round(
            categoryItems.reduce((sum, item) => {
              if (typeof item === "string") {
                return sum;
              }

              return sum + Math.max(item.useCases?.length || 0, 0);
            }, 0) / categoryItems.length,
          ),
        );

  const safePlaybookCapacity: Partial<Record<PlaybookType, number>> = {
    templates: counts.categories * counts.file_formats,
    curation: counts.categories + counts.categories * counts.locations,
    conversions: Math.max(counts.file_formats * Math.max(counts.file_formats - 1, 0), 0),
    comparisons: comparisonCapacity(dataset),
    examples: counts.categories,
    locations:
      counts.categories * counts.locations +
      counts.categories * counts.locations * counts.personas,
    personas: counts.categories * counts.personas,
    integrations: counts.integrations,
    glossary: counts.glossary_terms,
    translations: counts.categories * counts.languages,
    directory: counts.categories,
    profiles: counts.profiles,
  };

  const multidimensionalCapacity = {
    category_x_location_x_persona: counts.categories * counts.locations * counts.personas,
    category_x_location_x_language: counts.categories * counts.locations * counts.languages,
    category_x_persona_x_language: counts.categories * counts.personas * counts.languages,
    category_x_location_x_persona_x_language:
      counts.categories * counts.locations * counts.personas * counts.languages,
    category_x_service_x_location: counts.categories * averageServicesPerCategory * counts.locations,
    category_x_service_x_persona_x_language:
      counts.categories *
      averageServicesPerCategory *
      counts.personas *
      counts.languages,
    category_x_service_x_location_x_persona_x_language:
      counts.categories *
      averageServicesPerCategory *
      counts.locations *
      counts.personas *
      counts.languages,
    category_x_tool_x_persona: counts.categories * counts.tools * counts.personas,
  };

  const totalSafeCapacity = Object.values(safePlaybookCapacity).reduce(
    (sum, value) => sum + (value || 0),
    0,
  );
  const locationContribution =
    counts.categories * counts.locations +
    counts.categories * counts.locations +
    counts.categories * counts.locations * counts.personas;
  const nonLocationCapacity = totalSafeCapacity - locationContribution;
  const locationsNeededForCurrentGenerator = Math.ceil(
    Math.max(100_000 - nonLocationCapacity, 0) /
      Math.max(counts.categories * (counts.personas + 2), 1),
  );

  return {
    safe_playbook_capacity: safePlaybookCapacity,
    multidimensional_capacity: multidimensionalCapacity,
    total_safe_capacity: totalSafeCapacity,
    meets_100k_target:
      totalSafeCapacity >= 100_000 ||
      multidimensionalCapacity.category_x_location_x_persona_x_language >= 100_000 ||
      multidimensionalCapacity.category_x_service_x_location_x_persona_x_language >= 100_000,
    target_recipes: {
      locations_needed_for_category_x_persona_x_language: Math.ceil(
        100_000 / Math.max(counts.categories * counts.personas * counts.languages, 1),
      ),
      personas_needed_for_category_x_location_x_language: Math.ceil(
        100_000 / Math.max(counts.categories * counts.locations * counts.languages, 1),
      ),
      languages_needed_for_category_x_location_x_persona: Math.ceil(
        100_000 / Math.max(counts.categories * counts.locations * counts.personas, 1),
      ),
      locations_needed_for_current_generator: locationsNeededForCurrentGenerator,
      additional_locations_needed_for_current_generator: Math.max(
        locationsNeededForCurrentGenerator - counts.locations,
        0,
      ),
    },
  };
}

function enabledSources(config?: PublicSourceConfig): PublicApiSource[] {
  if (config?.enabled_sources?.length) {
    return config.enabled_sources;
  }

  return DEFAULT_EXPANSION_SOURCES;
}

export async function expandDatasetWithPublicApis(
  baseDataset: PseoDatasetInput = whyopsPseoCatalog,
  config?: PublicSourceConfig,
): Promise<ExpandedDatasetResult> {
  const enabled = enabledSources(config);
  const fetchedSources: PublicApiSource[] = [];
  const missingCredentials: PublicApiSource[] = [];
  const sourceErrors: SourceExpansionSummary["source_errors"] = [];
  let mergedDataset = baseDataset;

  for (const source of enabled) {
    try {
      if (source === "restcountries") {
        const countries = await fetchRestCountriesExpansion(config?.restcountries);
        mergedDataset = mergeDataset(mergedDataset, {
          locations: countries.locations,
          languages: countries.languages,
        });
        fetchedSources.push(source);
      }

      if (source === "worldbank") {
        const worldBank = await fetchWorldBankExpansion(config?.worldbank);
        mergedDataset = mergeDataset(mergedDataset, {
          locations: worldBank.locations,
        });
        fetchedSources.push(source);
      }

      if (source === "github") {
        const github = await fetchGithubExpansion(config?.github);
        mergedDataset = mergeDataset(mergedDataset, {
          tools: github.tools,
          profiles: github.profiles,
        });
        fetchedSources.push(source);
      }

      if (source === "wikidata") {
        const searches =
          config?.wikidata?.searches?.length
            ? config.wikidata.searches
            : (mergedDataset.tools || [])
                .slice(0, 10)
                .map((item) => (typeof item === "string" ? item : item.name));
        const wikidata = await fetchWikidataExpansion({
          ...config?.wikidata,
          searches,
        });
        mergedDataset = mergeDataset(mergedDataset, {
          profiles: wikidata.profiles,
        });
        fetchedSources.push(source);
      }

      if (source === "onet") {
        if (!config?.onet?.username || !config?.onet?.password) {
          missingCredentials.push(source);
          continue;
        }

        const onet = await fetchOnetExpansion(config.onet);
        mergedDataset = mergeDataset(mergedDataset, {
          personas: onet.personas,
        });
        fetchedSources.push(source);
      }

      if (source === "geonames") {
        if (!config?.geonames?.username) {
          missingCredentials.push(source);
          continue;
        }

        const geonames = await fetchGeoNamesExpansion(config.geonames);
        mergedDataset = mergeDataset(mergedDataset, {
          locations: geonames.locations,
        });
        fetchedSources.push(source);
      }
    } catch (error) {
      sourceErrors.push({
        source,
        message: error instanceof Error ? error.message : "Unknown source error.",
      });
    }
  }

  return {
    dataset: mergedDataset,
    source_summary: {
      enabled_sources: enabled,
      fetched_sources: fetchedSources,
      missing_credentials: missingCredentials,
      source_errors: sourceErrors,
    },
    dataset_summary: datasetSummary(mergedDataset),
    capacity_estimate: estimateCapacity(mergedDataset),
  };
}
