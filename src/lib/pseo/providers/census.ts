import type { CensusSourceConfig, LocationInput } from "@/lib/pseo/types";
import { fetchJson, populationTier } from "@/lib/pseo/providers/shared";

const CENSUS_BASE = "https://api.census.gov/data/2020/dec/pl";

type CensusRow = string[];

interface StateRecord {
  name: string;
  code: string;
  population: number;
}

function stateOverview(name: string, population: number): string {
  const tier = populationTier(population);
  if (tier === "major") {
    return `${name} is a major U.S. market with a large enterprise and technology footprint, which changes how teams evaluate AI infrastructure, observability, and governance tooling.`;
  }
  if (tier === "large") {
    return `${name} is a large U.S. market where teams often balance product velocity with standardization, security review, and cross-functional rollout planning.`;
  }
  if (tier === "mid") {
    return `${name} is a mid-sized U.S. market where buyers often care about operational clarity, implementation speed, and price-to-coverage fit.`;
  }
  return `${name} is a smaller U.S. market where pragmatic implementation, consolidation, and visible workflow value usually matter more than platform sprawl.`;
}

function countyOverview(countyName: string, stateName: string, population: number): string {
  const tier = populationTier(population);
  if (tier === "major") {
    return `${countyName} is one of the larger local markets in ${stateName}, which makes rollout scale, cross-team visibility, and vendor readiness more important during AI tooling decisions.`;
  }
  if (tier === "large") {
    return `${countyName} is a large county in ${stateName} where teams often need AI tooling that supports several functions without losing implementation clarity.`;
  }
  if (tier === "mid") {
    return `${countyName} is a mid-sized county in ${stateName} where teams typically want practical AI tooling that improves workflows without adding unnecessary process overhead.`;
  }
  return `${countyName} is a smaller county in ${stateName} where buyers usually prioritize implementation simplicity, clear ownership, and measurable workflow gains.`;
}

function buildUsLocationInsights(name: string, population: number, level: "state" | "county"): Omit<
  LocationInput,
  "name" | "region" | "country" | "overview"
> {
  const tier = populationTier(population);
  const pricingNotes =
    tier === "major"
      ? [
          "Budgets can support premium AI tooling when operational value is clear",
          "Buyers still expect cross-team ROI and implementation discipline",
        ]
      : tier === "large"
        ? [
            "Teams often compare platform breadth against the cost of managing multiple vendors",
            "Enterprise approval is easier when the workflow value is visible early",
          ]
        : tier === "mid"
          ? [
              "Price-to-coverage fit usually matters alongside feature depth",
              "Platform consolidation can be attractive when teams are lean",
            ]
          : [
              "Teams often prefer tools that reduce custom operational overhead",
              "Fast, measurable workflow improvement usually matters more than broad platform breadth",
            ];

  const trends =
    level === "state"
      ? [
          `${name} teams are moving AI workflows from pilot stages into more operational environments`,
          "Observability, evaluation, and governance layers usually become easier to justify after the first production issues appear",
        ]
      : [
          `Teams in ${name} often adopt AI first through internal copilots or narrow automation workflows`,
          "Operational visibility becomes more important as several teams begin using AI in parallel",
        ];

  const recommendations =
    tier === "major"
      ? [
          "Lead with scale, incident response clarity, and rollout control",
          "Use examples that show multi-team adoption rather than isolated pilots",
        ]
      : [
          "Lead with measurable workflow value and implementation simplicity",
          "Use examples that show how the category reduces operational guesswork",
        ];

  return {
    regulations: [
      "U.S. enterprise buyers often require security review before broad rollout",
      "Teams usually align procurement and implementation with both internal policy and federal or state obligations",
    ],
    pricingNotes,
    trends,
    recommendations,
    industries: ["SaaS", "Enterprise software", "Developer tools", "Services"],
  };
}

function toLocationInputFromState(state: StateRecord): LocationInput {
  return {
    name: state.name,
    region: state.name,
    country: "United States",
    overview: stateOverview(state.name, state.population),
    ...buildUsLocationInsights(state.name, state.population, "state"),
  };
}

function toLocationInputFromCounty(
  countyName: string,
  stateName: string,
  population: number,
): LocationInput {
  return {
    name: countyName,
    region: stateName,
    country: "United States",
    overview: countyOverview(countyName, stateName, population),
    ...buildUsLocationInsights(countyName, population, "county"),
  };
}

export async function fetchCensusExpansion(
  config: CensusSourceConfig = {},
): Promise<{ locations: LocationInput[] }> {
  const includeStates = config.include_states !== false;
  const includeCounties = config.include_counties !== false;
  const stateLimit = config.limit_states && config.limit_states > 0 ? config.limit_states : undefined;
  const countyLimit = config.limit_counties_per_state && config.limit_counties_per_state > 0
    ? config.limit_counties_per_state
    : undefined;

  const stateRows = await fetchJson<CensusRow[]>(
    `${CENSUS_BASE}?get=NAME,P1_001N&for=state:*`,
  );

  const states = stateRows
    .slice(1)
    .map((row) => ({
      name: row[0],
      population: Number(row[1]),
      code: row[2],
    }))
    .filter((state) => !Number.isNaN(state.population))
    .sort((left, right) => right.population - left.population);

  const filteredStates = config.state_fips?.length
    ? states.filter((state) => config.state_fips?.includes(state.code))
    : states;

  const limitedStates = stateLimit ? filteredStates.slice(0, stateLimit) : filteredStates;
  const stateByCode = new Map(limitedStates.map((state) => [state.code, state]));

  const locations: LocationInput[] = [];

  if (includeStates) {
    locations.push(...limitedStates.map(toLocationInputFromState));
  }

  if (includeCounties) {
    const countyResults = await Promise.all(
      limitedStates.map(async (state) => {
        const countyRows = await fetchJson<CensusRow[]>(
          `${CENSUS_BASE}?get=NAME,P1_001N&for=county:*&in=state:${state.code}`,
        );

        return countyRows
          .slice(1)
          .map((row) => {
            const rawName = row[0].replace(/,.*$/, "").trim();
            return {
              name: rawName,
              population: Number(row[1]),
              stateCode: row[2],
            };
          })
          .filter((county) => !Number.isNaN(county.population))
          .sort((left, right) => right.population - left.population)
          .slice(0, countyLimit)
          .map((county) => {
            const parentState = stateByCode.get(county.stateCode) || state;
            return toLocationInputFromCounty(county.name, parentState.name, county.population);
          });
      }),
    );

    locations.push(...countyResults.flat());
  }

  return { locations };
}
