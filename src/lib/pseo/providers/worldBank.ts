import { env } from "@/lib/env";
import type { LocationInput, WorldBankSourceConfig } from "@/lib/pseo/types";
import { fetchJson, populationTier } from "@/lib/pseo/providers/shared";

interface WorldBankCountry {
  id: string;
  iso2Code: string;
  name: string;
  region?: {
    id?: string;
    value?: string;
  };
  adminregion?: {
    id?: string;
    value?: string;
  };
  incomeLevel?: {
    id?: string;
    value?: string;
  };
  lendingType?: {
    id?: string;
    value?: string;
  };
  capitalCity?: string;
  longitude?: string;
  latitude?: string;
}

type WorldBankResponse = [unknown, WorldBankCountry[]];

function buildWorldBankLocation(country: WorldBankCountry): LocationInput {
  const region = country.adminregion?.value || country.region?.value || country.name;
  const income = country.incomeLevel?.value || "mixed-income";
  const lendingType = country.lendingType?.value || "general";
  const capital = country.capitalCity || country.name;
  const pseudoPopulation =
    country.incomeLevel?.id === "HIC"
      ? 3_100_000
      : country.incomeLevel?.id === "MIC"
        ? 1_200_000
        : 300_000;
  const tier = populationTier(pseudoPopulation);

  return {
    name: country.name,
    region,
    country: country.name,
    overview:
      tier === "major"
        ? `${country.name} is a large market where AI tooling pages should reflect enterprise readiness, localization needs, and cross-functional rollout expectations.`
        : `${country.name} is a market where AI tooling content should connect category value to practical local implementation and buying conditions.`,
    regulations: [
      `Pages targeting ${country.name} should review the relevant national data-handling and procurement environment before making hard rollout claims.`,
      `Country-level pages for ${country.name} should explain local buying and governance implications instead of reusing global positioning unchanged.`,
    ],
    pricingNotes: [
      `World Bank classifies ${country.name} as ${income}, which is useful context when localizing packaging and pricing assumptions.`,
      `${lendingType} country context can influence how public-sector or enterprise buyers evaluate platform maturity and support.`,
    ],
    trends: [
      `Country-level content for ${country.name} should connect AI adoption narratives to local operating conditions rather than relying on global averages.`,
      `Localization quality tends to improve when the page acknowledges the local capital, market maturity, and cross-functional rollout needs.`,
    ],
    recommendations: [
      `Use ${capital} and broader ${country.name} market context to localize examples and implementation framing.`,
      "Keep country pages tied to real workflow value so they do not become thin regional variants.",
    ],
    industries: ["Enterprise software", "SaaS", "Public sector", "Services"],
  };
}

export async function fetchWorldBankExpansion(
  config: WorldBankSourceConfig = {},
): Promise<{ locations: LocationInput[] }> {
  const response = await fetchJson<WorldBankResponse>(
    config.endpoint || env.worldBankApi,
  );
  const countries = Array.isArray(response?.[1]) ? response[1] : [];
  const allowedRegions = new Set((config.regions || []).map((value) => value.toLowerCase()));

  const filtered = countries
    .filter((country) => (config.include_countries === false ? false : Boolean(country.name)))
    .filter((country) =>
      allowedRegions.size
        ? allowedRegions.has((country.region?.value || "").toLowerCase()) ||
          allowedRegions.has((country.adminregion?.value || "").toLowerCase())
        : true,
    )
    .slice(0, config.limit && config.limit > 0 ? config.limit : undefined);

  return {
    locations: filtered.map(buildWorldBankLocation),
  };
}
