import type { GithubSourceConfig, ProfileInput, ToolInput } from "@/lib/pseo/types";
import { fetchJson, uniqueByName, uniqueProfiles } from "@/lib/pseo/providers/shared";

interface GithubRepo {
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  created_at: string;
  updated_at: string;
  html_url: string;
  owner: {
    login: string;
  };
}

const DEFAULT_REPOS = [
  "langfuse/langfuse",
  "Arize-ai/phoenix",
  "helicone/helicone",
  "braintrustdata/braintrust-sdk",
  "mlflow/mlflow",
];

function inferCategory(repo: GithubRepo): string | undefined {
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`
    .toLowerCase();

  if (/(agent|tracing|trace|observability|debug)/.test(text)) {
    return "AI Agent Observability";
  }
  if (/(eval|evaluation|benchmark|judge|experiment)/.test(text)) {
    return "AI Evaluation";
  }
  if (/(gateway|routing|proxy|fallback|cache)/.test(text)) {
    return "AI Gateway";
  }
  if (/(guardrail|safety|policy|compliance|secure)/.test(text)) {
    return "AI Guardrails";
  }

  return undefined;
}

function inferStrengths(repo: GithubRepo): string[] {
  const strengths = new Set<string>();
  const text = `${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();

  if (/(trace|tracing|observability)/.test(text)) {
    strengths.add("trace visibility");
  }
  if (/(eval|evaluation|benchmark)/.test(text)) {
    strengths.add("evaluation workflows");
  }
  if (/(prompt|experiment)/.test(text)) {
    strengths.add("experiment iteration");
  }
  if (/(gateway|routing|fallback)/.test(text)) {
    strengths.add("provider control");
  }
  if (/(policy|guardrail|safety)/.test(text)) {
    strengths.add("governance controls");
  }

  strengths.add(repo.language ? `${repo.language} ecosystem fit` : "developer workflow fit");
  strengths.add(repo.stargazers_count > 5_000 ? "strong open-source traction" : "active open-source footprint");

  return Array.from(strengths).slice(0, 4);
}

function inferWeaknesses(repo: GithubRepo): string[] {
  return [
    "open-source adoption still requires implementation ownership",
    "buyers should validate workflow fit beyond repository popularity",
  ];
}

function inferBestFor(repo: GithubRepo, category?: string): string[] {
  const categoryHint = category || "AI tooling teams";
  return [
    `${categoryHint.toLowerCase()} teams that want a public implementation reference`,
    "engineering-led evaluations with hands-on validation",
  ];
}

function inferUseCases(repo: GithubRepo, category?: string): string[] {
  switch (category) {
    case "AI Agent Observability":
      return ["trace agent runs", "review execution flows", "inspect operational telemetry"];
    case "AI Evaluation":
      return ["run regression suites", "compare experiments", "review benchmark workflows"];
    case "AI Gateway":
      return ["route model requests", "monitor spend", "set fallback policies"];
    case "AI Guardrails":
      return ["enforce policy", "monitor risky outputs", "support audit reviews"];
    default:
      return ["review product fit", "compare workflows", "evaluate platform coverage"];
  }
}

function repoToTool(repo: GithubRepo): ToolInput {
  const category = inferCategory(repo);

  return {
    name: repo.name,
    category,
    description:
      repo.description ||
      `${repo.name} is a public repository that can be used to infer workflow fit, ecosystem maturity, and product direction.`,
    pricingModel: "Open source or repository-visible project",
    strengths: inferStrengths(repo),
    weaknesses: inferWeaknesses(repo),
    bestFor: inferBestFor(repo, category),
    useCases: inferUseCases(repo, category),
    integrations: repo.topics?.slice(0, 4) || [],
    supportedFileFormats: ["JSON", "Markdown", "YAML"],
    directoryTags: uniqueByName(
      (repo.topics || [])
        .slice(0, 5)
        .map((topic) => ({ name: topic.replace(/-/g, " ") })),
    ).map((item) => item.name),
    verifiedFacts: [
      `${repo.full_name} is a public GitHub repository.`,
      `${repo.full_name} reports ${repo.stargazers_count} stars and ${repo.forks_count} forks on GitHub.`,
    ],
    milestones: [
      `Repository created on ${repo.created_at.slice(0, 10)}.`,
      `Repository metadata last updated on ${repo.updated_at.slice(0, 10)}.`,
    ],
    website: repo.homepage || repo.html_url,
  };
}

function repoToProfile(repo: GithubRepo): ProfileInput {
  return {
    name: repo.name,
    role: "Product",
    company: repo.owner.login,
    summary:
      repo.description ||
      `${repo.name} is represented here through its public GitHub repository metadata.`,
    verifiedFacts: [
      `${repo.full_name} is publicly listed on GitHub.`,
      `The repository shows ${repo.stargazers_count} stars, ${repo.forks_count} forks, and ${repo.open_issues_count} open issues.`,
    ],
    milestones: [
      `Public repository created on ${repo.created_at.slice(0, 10)}.`,
      `Repository metadata refreshed on ${repo.updated_at.slice(0, 10)}.`,
    ],
    uniqueInsight:
      repo.stargazers_count > 10_000
        ? "High GitHub attention suggests strong open-source visibility, but buyers should still validate product fit and operational maturity."
        : "Repository metadata is useful for market context, but product evaluation still needs workflow-level validation.",
    website: repo.homepage || repo.html_url,
  };
}

export async function fetchGithubExpansion(
  config: GithubSourceConfig = {},
): Promise<{ tools: ToolInput[]; profiles: ProfileInput[] }> {
  const repos = (config.repos?.length ? config.repos : DEFAULT_REPOS)
    .slice(0, config.limit && config.limit > 0 ? config.limit : undefined);

  const headers: HeadersInit = {
    "User-Agent": "whyops-pseo-dev",
    Accept: "application/vnd.github+json",
  };

  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }

  const repoData = await Promise.all(
    repos.map((repo) =>
      fetchJson<GithubRepo>(`https://api.github.com/repos/${repo}`, {
        headers,
      }),
    ),
  );

  return {
    tools: uniqueByName(repoData.map(repoToTool)),
    profiles: uniqueProfiles(repoData.map(repoToProfile)),
  };
}
