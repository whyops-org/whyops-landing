import type {
  LocationInput,
  PersonaInput,
  ProfileInput,
  ToolInput,
} from "@/lib/pseo/types";

export interface ProviderExpansionResult {
  locations?: LocationInput[];
  personas?: PersonaInput[];
  profiles?: ProfileInput[];
  tools?: ToolInput[];
  languages?: Array<{
    name: string;
    nativeName?: string;
    locale?: string;
    hreflang?: string;
    seoNotes?: string[];
    culturalNotes?: string[];
    localizedKeywords?: string[];
    localizedHeadline?: string;
    localizedSummary?: string;
    ctaLabel?: string;
  }>;
}

export function uniqueByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function uniqueProfiles<T extends { name: string }>(items: T[]): T[] {
  return uniqueByName(items);
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${url}`);
  }
  return response.json() as Promise<T>;
}

export function populationTier(population: number): "small" | "mid" | "large" | "major" {
  if (population >= 3_000_000) {
    return "major";
  }
  if (population >= 1_000_000) {
    return "large";
  }
  if (population >= 250_000) {
    return "mid";
  }
  return "small";
}

