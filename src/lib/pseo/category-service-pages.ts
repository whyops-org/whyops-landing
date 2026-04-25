import { brand, env } from "@/lib/env";
import { dedupe, slugify } from "@/lib/pseo/normalize";
import type { NormalizedCategory, NormalizedDataset, NormalizedTool } from "@/lib/pseo/types";
import type { PseoDraftSeed } from "@/lib/pseo/category-overview-pages";

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

function scoreToolForService(tool: NormalizedTool, service: string): number {
  const tokens = slugify(service).split("-").filter(Boolean);
  const haystack = slugify(
    [
      tool.name,
      tool.subcategory || "",
      tool.description || "",
      ...tool.bestFor,
      ...tool.useCases,
      ...tool.strengths,
      ...tool.directoryTags,
    ].join(" "),
  );

  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function shortlistToolsForService(
  dataset: NormalizedDataset,
  category: NormalizedCategory,
  service: string,
) {
  return dataset.tools
    .filter((tool) => slugify(tool.category || "") === category.slug)
    .sort((left, right) => {
      const scoreDelta = scoreToolForService(right, service) - scoreToolForService(left, service);
      if (scoreDelta !== 0) return scoreDelta;
      return (
        right.bestFor.length +
        right.useCases.length +
        right.strengths.length -
        (left.bestFor.length + left.useCases.length + left.strengths.length)
      );
    })
    .slice(0, 4);
}

function buildSchema(
  category: NormalizedCategory,
  service: string,
  url: string,
  tools: NormalizedTool[],
) {
  return {
    type: "CollectionPage",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.name} for ${service}`,
      url,
      description: category.description,
      about: [category.name, service],
      mentions: tools.map((tool) => ({
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: category.name,
      })),
    },
  };
}

export function buildCategoryServicePageSeeds(
  dataset: NormalizedDataset,
  basePath: string,
): PseoDraftSeed[] {
  return dataset.categories.flatMap((category) =>
    category.useCases.map((service) => {
      const serviceSlug = slugify(service);
      const tools = shortlistToolsForService(dataset, category, service);
      const url = buildUrl(`/${category.slug}/${serviceSlug}`, basePath);
      const entityKeys = [category.slug, serviceSlug, ...tools.map((tool) => tool.slug)];

      return {
        page: {
          url,
          playbook_type: "glossary",
          seo: {
            title: `${category.name} for ${service}: Workflow Fit, Tools, and Rollout Guide`,
            meta_description: `Learn how ${category.name} supports ${service}, which tools fit best, and what to validate before rollout.`,
            primary_keyword: `${category.name} for ${service}`,
            secondary_keywords: dedupe([
              `${category.name} ${service}`,
              `${service} ${category.name} tools`,
              `${category.name} workflow for ${service}`,
            ]),
            search_intent: "informational and commercial investigation",
          },
          content: {
            h1: `${category.name} for ${service}`,
            introduction: `${category.summary} When the immediate job is ${service}, teams need a narrower answer than a broad category explainer. This page shows where ${category.name} fits that workflow, what proof to ask for first, and which tools are most worth reviewing next.`,
            sections: [
              {
                heading: `Why teams start with ${service}`,
                body: `${category.description}\n\nTeams usually prioritize ${service} when they need a concrete workflow that exposes whether the category solves a real operational problem. That makes ${service} a better entry point than a generic platform tour because the rollout can be judged on one measurable job first.`,
              },
              {
                heading: `What to validate before rolling out ${service}`,
                body: bullets([
                  `Use ${service} to test the most important tradeoff first, not the broadest feature list.`,
                  ...category.painPoints
                    .slice(0, 3)
                    .map((painPoint) => `Resolve this pain point explicitly: ${painPoint}.`),
                  ...category.subcategories
                    .slice(0, 2)
                    .map((subcategory) => `Check ${subcategory.name} because ${subcategory.description}`),
                ]),
              },
              {
                heading: `Tools to review first for ${service}`,
                body: tools.length
                  ? bullets(
                      tools.map((tool) => {
                        const strengths = oxfordList(tool.strengths.slice(0, 2)) || tool.description;
                        const fit = oxfordList(tool.bestFor.slice(0, 2)) || oxfordList(tool.useCases.slice(0, 2));
                        return `${tool.name}: strongest for ${fit || "teams evaluating this workflow"}. It stands out for ${strengths || "documented workflow fit"}.`;
                      }),
                    )
                  : `No category-specific tools were available for ${service}, so start by defining the workflow proof and evaluation criteria before moving into shortlist pages.`,
              },
              {
                heading: `How to move from ${service} research into a buying decision`,
                body: `After reading this page, the next step should be a shortlist, a comparison, or a live workflow review centered on ${service}. Assign one owner, one pilot workflow, and one review deadline so the team can decide whether ${category.name} actually makes ${service} easier to run, easier to debug, and easier to improve.`,
              },
            ],
            faq: [
              buildFaq(
                `Why publish a ${category.name} page for ${service}?`,
                `Because workflow-specific searchers usually need a narrower answer than a general category page can provide.`,
              ),
              buildFaq(
                `What should a team prove first for ${service}?`,
                `They should prove that the workflow works on a realistic input, exposes the main tradeoff, and has a clear owner for rollout and review.`,
              ),
              buildFaq(
                "What should this page lead to next?",
                `It should route readers into shortlist, comparison, directory, or persona pages that keep the ${service} decision moving forward.`,
              ),
            ],
            call_to_action: `Use ${brand.name} to turn ${service} into an observable workflow with decision traces, replay, and implementation notes your team can actually reuse.`,
          },
          schema: buildSchema(category, service, url, tools),
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
            "tools[].useCases",
          ],
        },
        topicKey: category.slug,
        entityKeys,
      };
    }),
  );
}
