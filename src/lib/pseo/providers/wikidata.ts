import type { ProfileInput, WikidataSourceConfig } from "@/lib/pseo/types";
import { fetchJson, uniqueProfiles } from "@/lib/pseo/providers/shared";

interface WikidataSearchResult {
  search?: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

interface WikidataEntityResponse {
  entities?: Record<
    string,
    WikidataEntity
  >;
}

interface WikidataEntity {
  labels?: Record<string, { value: string }>;
  descriptions?: Record<string, { value: string }>;
  claims?: Record<
    string,
    Array<{
      mainsnak?: {
        datavalue?: {
          value?: string | { time?: string };
        };
      };
    }>
  >;
}

function parseClaimString(
  entity: WikidataEntity | undefined,
  claim: string,
): string | undefined {
  const rawValue = entity?.claims?.[claim]?.[0]?.mainsnak?.datavalue?.value;

  if (!rawValue) {
    return undefined;
  }

  if (typeof rawValue === "string") {
    return rawValue;
  }

  if (typeof rawValue === "object" && "time" in rawValue && rawValue.time) {
    return rawValue.time.replace(/^\+/, "").slice(0, 10);
  }

  return undefined;
}

function toProfile(
  label: string,
  id: string,
  description: string | undefined,
  entity?: WikidataEntity,
): ProfileInput {
  const inception = parseClaimString(entity, "P571");
  const website = parseClaimString(entity, "P856");

  return {
    name: label,
    role: "Entity",
    company: label,
    summary:
      description ||
      entity?.descriptions?.en?.value ||
      `${label} has a public Wikidata entity that can be used for profile and entity enrichment.`,
    verifiedFacts: [
      `${label} has a public Wikidata entity with id ${id}.`,
      description
        ? `Wikidata describes ${label} as: ${description}.`
        : `Wikidata exposes structured metadata for ${label}.`,
    ],
    milestones: [
      inception
        ? `Wikidata records an inception date of ${inception}.`
        : `Wikidata provides structured entity metadata for ${label}.`,
      website
        ? `Wikidata lists an official website for ${label}.`
        : `Wikidata exposes a knowledge-graph entity for ${label}.`,
    ],
    uniqueInsight:
      "Wikidata is useful for entity disambiguation and structured profile enrichment, but product-fit pages still need workflow-specific evidence.",
    website,
  };
}

export async function fetchWikidataExpansion(
  config: WikidataSourceConfig = {},
): Promise<{ profiles: ProfileInput[] }> {
  const searches = config.searches?.filter(Boolean) || [];
  const limit = config.limit_per_search && config.limit_per_search > 0
    ? config.limit_per_search
    : 3;

  if (!searches.length) {
    return { profiles: [] };
  }

  const results = await Promise.all(
    searches.map(async (search) => {
      const searchResponse = await fetchJson<WikidataSearchResult>(
        `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
          search,
        )}&language=en&format=json&limit=${limit}&origin=*`,
      );

      return Promise.all(
        (searchResponse.search || []).map(async (item) => {
          const entityResponse = await fetchJson<WikidataEntityResponse>(
            `https://www.wikidata.org/wiki/Special:EntityData/${item.id}.json`,
          );
          const entity = entityResponse.entities?.[item.id];
          return toProfile(item.label, item.id, item.description, entity);
        }),
      );
    }),
  );

  return {
    profiles: uniqueProfiles(results.flat()),
  };
}
