import { env } from "@/lib/env";
import type { LanguageInput, LocationInput, RestCountriesSourceConfig } from "@/lib/pseo/types";
import { fetchJson, populationTier, uniqueByName } from "@/lib/pseo/providers/shared";

interface RestCountry {
  name: {
    common: string;
    official: string;
  };
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  capital?: string[];
  languages?: Record<string, string>;
  cca2?: string;
  cca3?: string;
  currencies?: Record<
    string,
    {
      name?: string;
      symbol?: string;
    }
  >;
}

function buildCountryOverview(country: RestCountry): string {
  const population = country.population || 0;
  const tier = populationTier(population);
  const region = country.region || "its region";
  if (tier === "major") {
    return `${country.name.common} is a major market in ${region}, which makes localization, enterprise readiness, and scalable AI operations more important during platform evaluation.`;
  }
  if (tier === "large") {
    return `${country.name.common} is a large market in ${region} where teams often balance growth, standardization, and practical implementation speed when evaluating AI infrastructure.`;
  }
  if (tier === "mid") {
    return `${country.name.common} is a mid-sized market in ${region} where AI tooling decisions usually center on operational clarity, local relevance, and measurable workflow value.`;
  }
  return `${country.name.common} is a smaller market in ${region} where buyers often prioritize implementation simplicity, localization fit, and efficient tooling coverage.`;
}

function buildCountryLocation(country: RestCountry): LocationInput {
  const population = country.population || 0;
  const tier = populationTier(population);
  const capital = country.capital?.[0];
  const currencyNames = Object.values(country.currencies || {})
    .map((currency) => currency.name)
    .filter(Boolean) as string[];

  return {
    name: country.name.common,
    region: country.subregion || country.region || country.name.common,
    country: country.name.common,
    overview: buildCountryOverview(country),
    regulations: [
      `Buyers in ${country.name.common} usually expect clear security, privacy, and procurement answers before broader AI rollout decisions.`,
      `Teams localizing for ${country.name.common} should review jurisdiction-specific data handling and deployment expectations early.`,
    ],
    pricingNotes: [
      capital
        ? `Commercial evaluation often centers around teams in and around ${capital}, where buyer expectations can shape platform packaging and support needs.`
        : `Packaging and support expectations in ${country.name.common} usually depend on whether the buyer is self-serve, mid-market, or enterprise.`,
      currencyNames.length
        ? `Localized pricing discussions often need context around ${currencyNames.join(", ")} and region-specific budget expectations.`
        : `Localized pricing often needs market-specific packaging rather than a flat global message.`,
    ],
    trends: [
      `AI adoption in ${country.name.common} typically moves from narrow workflow automation into broader operational use cases as local teams gain confidence.`,
      `Search demand in ${country.name.common} is more durable when pages explain both the category and the local implementation angle.`,
    ],
    recommendations: [
      `Use examples and localization choices that feel native to teams in ${country.name.common} rather than copying U.S.-first messaging.`,
      tier === "major"
        ? "Prioritize enterprise readiness, language localization, and cross-team rollout guidance."
        : "Prioritize implementation clarity, local relevance, and obvious workflow value.",
    ],
    industries: ["SaaS", "Enterprise software", "Financial services", "Developer tools"],
  };
}

function toLanguageInputs(country: RestCountry): LanguageInput[] {
  return Object.values(country.languages || {}).map((language) => ({
    name: language,
    nativeName: language,
    locale: country.cca2 ? `${language.toLowerCase().replace(/\s+/g, "-")}-${country.cca2}` : language.toLowerCase(),
    hreflang: country.cca2 ? `${language.toLowerCase().slice(0, 2)}-${country.cca2}` : language.toLowerCase().slice(0, 2),
    seoNotes: [
      `Localize pages for ${language} readers with region-specific wording and examples instead of direct English duplication.`,
      "Use intent-specific metadata and headings so localized pages satisfy the query directly.",
    ],
    culturalNotes: [
      `Explain why the category matters in ${country.name.common} before going deep into tooling or implementation detail.`,
      `Use examples that feel relevant to teams operating in ${country.name.common}.`,
    ],
    localizedKeywords: [
      `${language} ai software`,
      `${language} ai tools`,
      `${language} ai platform`,
    ],
    localizedHeadline: `Build ${language} pSEO pages for teams in ${country.name.common} with clear local intent.`,
    localizedSummary: `These pages should localize the buying context, examples, and terminology for ${language} readers in ${country.name.common}.`,
    ctaLabel: `Publish ${language} pages with localized examples and clear market fit.`,
  }));
}

export async function fetchRestCountriesExpansion(
  config: RestCountriesSourceConfig = {},
): Promise<{ locations: LocationInput[]; languages: LanguageInput[] }> {
  const countries = await fetchJson<RestCountry[]>(
    config.endpoint || env.countriesApi,
  );
  const allowedRegions = new Set((config.regions || []).map((value) => value.toLowerCase()));

  const filtered = countries
    .filter((country) => (config.include_countries === false ? false : Boolean(country.name?.common)))
    .filter((country) =>
      allowedRegions.size
        ? allowedRegions.has((country.region || "").toLowerCase()) ||
          allowedRegions.has((country.subregion || "").toLowerCase())
        : true,
    )
    .sort((left, right) => (right.population || 0) - (left.population || 0))
    .slice(0, config.limit && config.limit > 0 ? config.limit : undefined);

  return {
    locations: filtered.map(buildCountryLocation),
    languages: uniqueByName(filtered.flatMap(toLanguageInputs)),
  };
}
