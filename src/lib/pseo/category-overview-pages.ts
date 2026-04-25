import { brand, env } from "@/lib/env";
import { dedupe, slugify } from "@/lib/pseo/normalize";
import type { NormalizedCategory, NormalizedDataset, NormalizedTool, PseoPage } from "@/lib/pseo/types";

export type PseoDraftSeed = {
  page: PseoPage;
  topicKey: string;
  entityKeys: string[];
};

function buildUrl(pathname: string, basePath = ""): string {
  const normalizedPath = `${basePath}/${pathname}`.replace(/\/+/g, "/").replace(/\/$/, "");
  return new URL(normalizedPath || "/", env.siteUrl).toString();
}

function oxfordList(values: string[]): string {
  const filtered = dedupe(values).filter(Boolean);
  if (filtered.length <= 1) return filtered[0] || "";
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(", ")}, and ${filtered.at(-1)}`;
}

function bullets(values: string[]): string {
  return dedupe(values)
    .filter(Boolean)
    .map((value) => `- ${value}`)
    .join("\n");
}

function buildFaq(question: string, answer: string) {
  return { question, answer };
}

function buildSchema(category: NormalizedCategory, url: string, tools: NormalizedTool[]) {
  return {
    type: "CollectionPage",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      url,
      description: category.description,
      about: category.name,
      mentions: tools.map((tool) => ({
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: category.name,
      })),
    },
  };
}

function findTopTools(dataset: NormalizedDataset, category: NormalizedCategory) {
  return dataset.tools
    .filter((tool) => slugify(tool.category || "") === category.slug)
    .sort((left, right) => {
      const leftScore = left.bestFor.length + left.useCases.length + left.strengths.length;
      const rightScore = right.bestFor.length + right.useCases.length + right.strengths.length;
      return rightScore - leftScore;
    })
    .slice(0, 4);
}

function describeTool(tool: NormalizedTool) {
  const strongestFit = oxfordList(tool.bestFor.slice(0, 2)) || "teams evaluating the category";
  const strengths = oxfordList(tool.strengths.slice(0, 2)) || tool.description;
  return `${tool.name}: best for ${strongestFit}. It stands out for ${strengths}.`;
}

export function buildCategoryOverviewPageSeeds(
  dataset: NormalizedDataset,
  basePath: string,
): PseoDraftSeed[] {
  return dataset.categories
    .filter((category) => category.description)
    .map((category) => {
      const tools = findTopTools(dataset, category);
      const primaryKeyword = category.name;
      const url = buildUrl(`/${category.slug}`, basePath);
      const entityKeys = [
        category.slug,
        ...category.glossaryTerms.map(slugify),
        ...tools.map((tool) => tool.slug),
      ];

      const sections = [
        {
          heading: `What ${category.name} helps teams solve`,
          body: `${category.description}\n\n${category.summary} Teams usually adopt ${category.name} when they need a repeatable way to improve ${oxfordList(
            category.useCases.slice(0, 4),
          )} without relying on scattered scripts, tribal knowledge, or one-off debugging rituals.`,
        },
        {
          heading: "Use cases that usually justify the category first",
          body: `The strongest starting point is one workflow with clear operational pain. Good first use cases are:\n\n${bullets(
            category.useCases
              .slice(0, 5)
              .map(
                (useCase) =>
                  `${useCase}: make the implementation owner prove how the workflow behaves under real traffic, not only in a polished demo.`,
              ),
          )}`,
        },
        {
          heading: `What to evaluate in ${category.name} tools`,
          body: `A useful evaluation should connect the product to the real operating tradeoff, not just compare feature inventories.\n\n${bullets([
            ...category.painPoints
              .slice(0, 3)
              .map((painPoint) => `Pain point to resolve first: ${painPoint}.`),
            ...category.subcategories
              .slice(0, 3)
              .map((subcategory) => `Capability to validate: ${subcategory.name} because ${subcategory.description}`),
          ])}`,
        },
        {
          heading: "Tools and references worth reviewing next",
          body: tools.length
            ? `Use the category pages, directories, and comparisons in this cluster to narrow the shortlist quickly.\n\n${bullets(
                tools.map(describeTool),
              )}`
            : `The category is still useful even without a tool shortlist. Start by validating the workflow, measurement, and rollout owner before expanding the vendor search.`,
        },
      ];

      return {
        page: {
          url,
          playbook_type: "glossary",
          seo: {
            title: `${category.name}: Use Cases, Tools, and Evaluation Guide`,
            meta_description: `Learn what ${category.name} is, which use cases matter first, and how to evaluate tools without wasting implementation time.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: dedupe([
              `${category.name} tools`,
              `${category.name} use cases`,
              `${category.name} software`,
              `${category.name} evaluation`,
            ]),
            search_intent: "informational and commercial investigation",
          },
          content: {
            h1: category.name,
            introduction: `${category.summary} This page gives you a practical overview of where ${category.name} fits, which workflows usually justify it first, and what to verify before you commit to a vendor or internal rollout.`,
            sections,
            faq: [
              buildFaq(
                `When should a team invest in ${category.name}?`,
                `Invest when the current workflow is failing in a repeatable way and the team can name the first use case, owner, and proof they need to see. Broad category curiosity is not enough.`,
              ),
              buildFaq(
                `How should ${category.name} pages connect to deeper buying research?`,
                `Use the overview page to understand the category, then move into shortlist, comparison, directory, glossary, or persona pages that narrow the decision around one workflow or stakeholder.`,
              ),
              buildFaq(
                `What makes an ${category.name} page genuinely useful for searchers?`,
                `It should explain why the category exists, which use cases matter first, how tools differ in practice, and what the reader should review next instead of stopping at a generic definition.`,
              ),
            ],
            call_to_action: `Use ${brand.name} to turn ${category.name} research into an observable workflow with decision traces, replay, and implementation notes your team can actually reuse.`,
          },
          schema: buildSchema(category, url, tools),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "categories[].description",
            "categories[].summary",
            "categories[].useCases",
            "categories[].painPoints",
            "categories[].subcategories",
            "tools[].strengths",
            "tools[].bestFor",
          ],
        },
        topicKey: category.slug,
        entityKeys,
      };
    });
}
