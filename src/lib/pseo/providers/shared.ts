import https from "node:https";
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
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} for ${url}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (shouldAllowInsecureTls(error, url, init)) {
      return insecureFetchJson<T>(url, init);
    }

    throw error;
  }
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

function shouldAllowInsecureTls(
  error: unknown,
  url: string,
  init?: RequestInit,
): boolean {
  const insecureExplicitlyEnabled = process.env.PSEO_ALLOW_INSECURE_TLS === "true";
  const insecureAllowedByDefault =
    process.env.NODE_ENV !== "production" &&
    process.env.PSEO_ALLOW_INSECURE_TLS !== "false";

  const causeCode =
    error &&
    typeof error === "object" &&
    "cause" in error &&
    error.cause &&
    typeof error.cause === "object" &&
    "code" in error.cause
      ? String(error.cause.code)
      : "";

  return (
    (insecureExplicitlyEnabled || insecureAllowedByDefault) &&
    causeCode === "SELF_SIGNED_CERT_IN_CHAIN" &&
    (!init?.method || init.method === "GET") &&
    url.startsWith("https://")
  );
}

async function insecureFetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: "GET",
        headers: init?.headers as Record<string, string> | undefined,
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
      (response) => {
        let raw = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            reject(
              new Error(
                `Request failed with status ${response.statusCode || "unknown"} for ${url}`,
              ),
            );
            return;
          }

          try {
            resolve(JSON.parse(raw) as T);
          } catch (parseError) {
            reject(parseError);
          }
        });
      },
    );

    request.on("error", reject);
    request.end();
  });
}
