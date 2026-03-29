import type { GeoNamesSourceConfig, LocationInput } from "@/lib/pseo/types";
import { fetchJson, populationTier } from "@/lib/pseo/providers/shared";

interface GeoNamesSearchResponse {
  geonames?: Array<{
    name: string;
    countryName: string;
    adminName1?: string;
    population?: number;
  }>;
}

function buildCityLocation(
  name: string,
  region: string,
  country: string,
  population: number,
): LocationInput {
  const tier = populationTier(population);

  return {
    name,
    region,
    country,
    overview:
      tier === "major"
        ? `${name} is a major city in ${country}, which makes localization, enterprise fit, and scalable AI operations especially important for category pages targeting this market.`
        : `${name} is a city in ${country} where teams typically evaluate AI tooling through workflow fit, implementation clarity, and local relevance.`,
    regulations: [
      `Teams localizing for ${name} should review national and regional data handling expectations in ${country}.`,
      `Enterprise buyers in ${name} often expect clear implementation and security answers before broader rollout.`,
    ],
    pricingNotes: [
      tier === "major"
        ? `Buyers in ${name} may tolerate premium pricing when the category clearly improves operational visibility or control.`
        : `Buyers in ${name} often compare implementation simplicity against total tooling cost.`,
      "Localized packaging and support expectations can materially affect conversion quality.",
    ],
    trends: [
      `AI adoption in ${name} often starts with narrow operational workflows before broader platform standardization follows.`,
      `Search demand is stronger when pages explain why the category matters specifically in ${name} instead of repeating country-level copy.`,
    ],
    recommendations: [
      `Use city-aware examples and local buying context when publishing pages for ${name}.`,
      "Keep the workflow framing practical and implementation-focused.",
    ],
    industries: ["SaaS", "Enterprise software", "Developer tools", "Services"],
  };
}

export async function fetchGeoNamesExpansion(
  config: GeoNamesSourceConfig = {},
): Promise<{ locations: LocationInput[] }> {
  if (!config.username) {
    throw new Error("GeoNames requires a username.");
  }

  const params = new URLSearchParams({
    featureClass: "P",
    orderby: "population",
    maxRows: String(config.max_rows || 200),
    username: config.username,
    style: "SHORT",
    type: "json",
  });

  if (config.min_population) {
    params.set("minPopulation", String(config.min_population));
  }

  if (config.country_codes?.length) {
    params.set("country", config.country_codes.join(","));
  }

  const response = await fetchJson<GeoNamesSearchResponse>(
    `https://secure.geonames.org/searchJSON?${params.toString()}`,
  );

  const locations = (response.geonames || []).map((city) =>
    buildCityLocation(
      city.name,
      city.adminName1 || city.countryName,
      city.countryName,
      city.population || 0,
    ),
  );

  return { locations };
}
