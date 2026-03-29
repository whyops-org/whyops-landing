import { env } from "@/lib/env";
import type { PublicSourceConfig } from "@/lib/pseo/types";

export function getSiteSourceConfig(): PublicSourceConfig {
  const enabledSources: PublicSourceConfig["enabled_sources"] = [
    "restcountries",
    "worldbank",
  ];

  if (env.geonamesUsername) {
    enabledSources.push("geonames");
  }

  return {
    enabled_sources: enabledSources,
    restcountries: {
      include_countries: true,
    },
    worldbank: {
      include_countries: true,
    },
    geonames: env.geonamesUsername
      ? {
          username: env.geonamesUsername,
          max_rows: 500,
          min_population: 200000,
        }
      : undefined,
  };
}
