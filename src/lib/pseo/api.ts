import { whyopsPseoCatalog } from "@/lib/pseo/catalog";
import { env } from "@/lib/env";
import {
  expandDatasetWithPublicApis,
  type ExpandedDatasetResult,
} from "@/lib/pseo/expand";
import { normalizeDataset } from "@/lib/pseo/normalize";
import type {
  NormalizedDataset,
  PseoDatasetInput,
  PublicSourceConfig,
} from "@/lib/pseo/types";

export function hasDatasetContent(dataset: PseoDatasetInput | undefined): boolean {
  if (!dataset) {
    return false;
  }

  return Object.values(dataset).some((value) => Array.isArray(value) && value.length > 0);
}

export function buildDatasetSummary(dataset: NormalizedDataset) {
  return {
    categories: dataset.categories.length,
    tools: dataset.tools.length,
    locations: dataset.locations.length,
    personas: dataset.personas.length,
    file_formats: dataset.fileFormats.length,
    languages: dataset.languages.length,
    integrations: dataset.integrations.length,
    glossary_terms: dataset.glossaryTerms.length,
    profiles: dataset.profiles.length,
  };
}

export function hydrateSourceConfig(
  config?: PublicSourceConfig,
): PublicSourceConfig | undefined {
  if (!config) {
    return undefined;
  }

  return {
    ...config,
    github: {
      ...config.github,
      token: config.github?.token || env.githubToken || undefined,
    },
    geonames: {
      ...config.geonames,
      username: config.geonames?.username || env.geonamesUsername || undefined,
    },
    onet: {
      ...config.onet,
      username: config.onet?.username || env.onetUsername || undefined,
      password: config.onet?.password || env.onetPassword || undefined,
    },
  };
}

export async function resolvePseoDataset(
  dataset: PseoDatasetInput | undefined,
  sourceConfig?: PublicSourceConfig,
): Promise<{
  dataset_input: PseoDatasetInput;
  normalized_dataset: NormalizedDataset;
  dataset_source: "request" | "default_whyops_catalog" | "expanded_public_api_dataset";
  expanded: ExpandedDatasetResult | null;
}> {
  const datasetInput = hasDatasetContent(dataset) ? dataset! : whyopsPseoCatalog;
  const expanded = sourceConfig
    ? await expandDatasetWithPublicApis(datasetInput, hydrateSourceConfig(sourceConfig))
    : null;
  const finalDataset = expanded?.dataset || datasetInput;

  return {
    dataset_input: datasetInput,
    normalized_dataset: normalizeDataset(finalDataset),
    dataset_source: sourceConfig
      ? "expanded_public_api_dataset"
      : hasDatasetContent(dataset)
        ? "request"
        : "default_whyops_catalog",
    expanded,
  };
}
