import type { OnetSourceConfig, PersonaInput } from "@/lib/pseo/types";
import { fetchJson, uniqueByName } from "@/lib/pseo/providers/shared";

interface OnetSearchResponse {
  occupation?: Array<{
    title?: string;
    code?: string;
    summary?: string;
  }>;
}

function occupationToPersona(occupation: {
  title?: string;
  code?: string;
  summary?: string;
}): PersonaInput | null {
  if (!occupation.title) {
    return null;
  }

  const title = occupation.title;

  return {
    name: title,
    role: title,
    description:
      occupation.summary ||
      `${title} is an occupation that can be used as a persona axis for pSEO content targeted at workflow-specific search intent.`,
    painPoints: [
      `Teams in ${title} roles need tooling and content that map cleanly to their daily workflow.`,
      "Generic category pages usually underserve role-specific search intent.",
    ],
    goals: [
      "find workflow-fit tools and guidance",
      "reduce implementation ambiguity",
    ],
    benefits: [
      "More role-specific content relevance",
      "Clearer mapping between category value and daily work",
    ],
    industries: ["Cross-industry"],
    recommendedUseCases: [
      "evaluate tools by workflow fit",
      "compare solutions through role-specific pain points",
    ],
  };
}

export async function fetchOnetExpansion(
  config: OnetSourceConfig = {},
): Promise<{ personas: PersonaInput[] }> {
  if (!config.username || !config.password) {
    throw new Error("O*NET Web Services require username and password credentials.");
  }

  const keyword = config.keyword || "artificial intelligence";
  const limit = config.limit && config.limit > 0 ? config.limit : 25;
  const auth = Buffer.from(`${config.username}:${config.password}`).toString("base64");
  const encodedKeyword = encodeURIComponent(keyword);

  const response = await fetchJson<OnetSearchResponse>(
    `https://services.onetcenter.org/ws/mnm/search/${encodedKeyword}?end=${limit}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    },
  );

  return {
    personas: uniqueByName(
      (response.occupation || [])
        .map(occupationToPersona)
        .filter((persona): persona is PersonaInput => Boolean(persona)),
    ),
  };
}
