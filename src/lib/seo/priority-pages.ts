import { whyopsPseoCatalog } from "@/lib/pseo/catalog";
import { slugify } from "@/lib/pseo/normalize";
import type { CategoryInput, ToolInput } from "@/lib/pseo/types";

export type SiteLink = {
  href: string;
  label: string;
};

export type PriorityPage = SiteLink & {
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

export const servicePages: SiteLink[] = [
  { href: "/ai-agent-observability", label: "AI Agent Observability" },
  { href: "/ai-evaluation", label: "AI Evaluation" },
  { href: "/ai-gateway", label: "AI Gateway" },
  { href: "/ai-guardrails", label: "AI Guardrails" },
];

function isCategory(value: unknown): value is CategoryInput {
  return typeof value === "object" && value !== null && "name" in value;
}

function isTool(value: unknown): value is ToolInput {
  return typeof value === "object" && value !== null && "name" in value;
}

function toolScore(tool: ToolInput) {
  return (
    (tool.bestFor?.length || 0) +
    (tool.useCases?.length || 0) +
    (tool.strengths?.length || 0)
  );
}

function dedupePages(pages: PriorityPage[]) {
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.href)) {
      return false;
    }

    seen.add(page.href);
    return true;
  });
}

const categories = (whyopsPseoCatalog.categories || []).filter(isCategory).map((category) => ({
  name: category.name,
  slug: slugify(category.slug || category.name),
  useCases: (category.useCases || []).slice(0, 2),
  glossaryTerm: category.glossaryTerms?.[0],
}));

const tools = (whyopsPseoCatalog.tools || []).filter(isTool);

const categoryPriorityPages: PriorityPage[] = categories.flatMap((category) => {
  const topTools = tools
    .filter((tool) => slugify(tool.category || "") === category.slug)
    .sort((left, right) => toolScore(right) - toolScore(left))
    .slice(0, 2);

  const comparePage =
    topTools.length >= 2
      ? [
          {
            href: `/compare/${slugify(topTools[0].slug || topTools[0].name)}-vs-${slugify(
              topTools[1].slug || topTools[1].name,
            )}`,
            label: `${topTools[0].name} vs ${topTools[1].name}`,
            priority: 0.75,
            changeFrequency: "weekly" as const,
          },
        ]
      : [];

  return [
    { href: `/${category.slug}`, label: category.name, priority: 0.9, changeFrequency: "weekly" },
    {
      href: `/best/${category.slug}-tools`,
      label: `Best ${category.name} Tools`,
      priority: 0.85,
      changeFrequency: "weekly",
    },
    {
      href: `/examples/${category.slug}`,
      label: `${category.name} Examples`,
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      href: `/directory/${category.slug}`,
      label: `${category.name} Directory`,
      priority: 0.8,
      changeFrequency: "weekly",
    },
    ...category.useCases.flatMap((useCase) => [
      {
        href: `/${category.slug}/${slugify(useCase)}`,
        label: `${category.name} for ${useCase}`,
        priority: 0.75,
        changeFrequency: "weekly" as const,
      },
      {
        href: `/best/${category.slug}-tools/for-${slugify(useCase)}`,
        label: `Best ${category.name} Tools for ${useCase}`,
        priority: 0.7,
        changeFrequency: "weekly" as const,
      },
    ]),
    ...(category.glossaryTerm
      ? [
          {
            href: `/glossary/${slugify(category.glossaryTerm)}`,
            label: category.glossaryTerm,
            priority: 0.65,
            changeFrequency: "weekly" as const,
          },
        ]
      : []),
    ...comparePage,
  ];
});

export const priorityPages: PriorityPage[] = [
  { href: "/", label: "WhyOps", priority: 1, changeFrequency: "weekly" },
  ...servicePages.map((page) => ({
    ...page,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  })),
  { href: "/blog", label: "Blog", priority: 0.7, changeFrequency: "weekly" },
  ...categoryPriorityPages,
];

export const curatedPriorityPages = dedupePages(priorityPages);
