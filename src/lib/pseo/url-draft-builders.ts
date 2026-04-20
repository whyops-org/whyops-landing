import { env } from "@/lib/env";
import { dedupe, slugify } from "@/lib/pseo/normalize";
import type {
  NormalizedCategory,
  NormalizedDataset,
  NormalizedPersona,
  NormalizedTool,
  PlaybookType,
  PseoPage,
} from "@/lib/pseo/types";

export type UrlDraft = PseoPage & {
  topic_key: string;
  entity_keys: string[];
  intent_key: string;
  word_count: number;
};

function buildUrl(pathname: string, basePath = ""): string {
  const normalizedPath = `${basePath}/${pathname}`.replace(/\/+/g, "/").replace(/\/$/, "");
  return new URL(normalizedPath || "/", env.siteUrl).toString();
}

function serviceSlug(service: string): string {
  return slugify(service);
}

function categoryServices(category: NormalizedCategory): string[] {
  return dedupe(category.useCases).filter(Boolean);
}

function personaServices(category: NormalizedCategory, persona: NormalizedPersona): string[] {
  return dedupe([...category.useCases, ...persona.recommendedUseCases]).filter(Boolean);
}

function findToolsForCategory(dataset: NormalizedDataset, category: NormalizedCategory): NormalizedTool[] {
  return dataset.tools.filter((tool) => slugify(tool.category || "") === category.slug);
}

function scoreToolForService(tool: NormalizedTool, service: string): number {
  const tokens = slugify(service).split("-").filter(Boolean);
  const haystack = slugify(
    [tool.name, tool.subcategory || "", tool.description || "", ...tool.bestFor, ...tool.useCases, ...tool.strengths, ...tool.directoryTags].join(" "),
  );

  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function shortlistToolsForService(tools: NormalizedTool[], service: string, limit = 4): NormalizedTool[] {
  const ranked = [...tools].sort((left, right) => {
    const scoreDelta = scoreToolForService(right, service) - scoreToolForService(left, service);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return right.bestFor.length + right.useCases.length + right.strengths.length - (left.bestFor.length + left.useCases.length + left.strengths.length);
  });

  const matched = ranked.filter((tool) => scoreToolForService(tool, service) > 0);
  return (matched.length ? matched : ranked).slice(0, limit);
}

function createDraft(playbook: PlaybookType, pathname: string, primaryKeyword: string, h1: string, topicKey: string, entityKeys: string[], basePath = ""): UrlDraft {
  return {
    url: buildUrl(pathname, basePath),
    playbook_type: playbook,
    seo: { title: h1, meta_description: "", primary_keyword: primaryKeyword, secondary_keywords: [], search_intent: "" },
    content: {
      h1,
      introduction: "",
      sections: [],
      faq: [{ question: "q1", answer: "a1" }, { question: "q2", answer: "a2" }, { question: "q3", answer: "a3" }],
      call_to_action: "",
    },
    schema: { type: "", structured_data: {} },
    internal_links: [],
    related_pages: [],
    data_requirements_used: [],
    topic_key: topicKey,
    entity_keys: dedupe(entityKeys),
    intent_key: `${playbook}:${slugify(primaryKeyword)}`,
    word_count: 1000,
  };
}

export function buildLocationUrlDrafts(dataset: NormalizedDataset, basePath = ""): UrlDraft[] {
  const category = dataset.categories[0];
  if (!category?.description) return [];
  const tools = findToolsForCategory(dataset, category).slice(0, 4);

  return dataset.locations.flatMap((location) => {
    if (!location.overview || location.regulations.length < 1 || location.pricingNotes.length < 1 || location.trends.length < 1) return [];
    const drafts = [createDraft("locations", `/locations/${location.slug}/${category.slug}`, `${category.name} in ${location.name}`, `${category.name} in ${location.name}`, category.slug, [category.slug, location.slug, ...tools.map((tool) => tool.slug)], basePath)];
    categoryServices(category).forEach((service) => drafts.push(createDraft("locations", `/locations/${location.slug}/${category.slug}/${serviceSlug(service)}`, `${category.name} in ${location.name} ${service}`, `${category.name} in ${location.name} for ${service}`, category.slug, [category.slug, location.slug, serviceSlug(service), ...shortlistToolsForService(tools, service).map((tool) => tool.slug)], basePath)));
    dataset.personas.filter((persona) => persona.painPoints.length >= 2 && persona.recommendedUseCases.length >= 1).forEach((persona) => {
      drafts.push(createDraft("locations", `/locations/${location.slug}/${category.slug}/for-${persona.slug}`, `${category.name} in ${location.name} for ${persona.name}`, `${category.name} in ${location.name} for ${persona.name}`, category.slug, [category.slug, location.slug, persona.slug, ...tools.map((tool) => tool.slug)], basePath));
      personaServices(category, persona).forEach((service) => drafts.push(createDraft("locations", `/locations/${location.slug}/${category.slug}/for-${persona.slug}/${serviceSlug(service)}`, `${category.name} in ${location.name} for ${persona.name} ${service}`, `${category.name} in ${location.name} for ${persona.name}: ${service}`, category.slug, [category.slug, location.slug, persona.slug, serviceSlug(service), ...shortlistToolsForService(tools, service).map((tool) => tool.slug)], basePath)));
    });
    return drafts;
  });
}

export function buildTranslationCoreUrlDrafts(dataset: NormalizedDataset, basePath = ""): UrlDraft[] {
  const category = dataset.categories[0];
  if (!category?.description) return [];

  return dataset.languages.flatMap((language) => {
    if (!language.localizedHeadline || !language.localizedSummary || language.localizedKeywords.length < 1 || language.seoNotes.length < 1 || language.culturalNotes.length < 1) return [];
    const drafts = [createDraft("translations", `/${language.slug}/${category.slug}`, `${category.name} in ${language.name}`, `${category.name} for ${language.nativeName} Searchers`, category.slug, [category.slug, language.slug], basePath)];
    categoryServices(category).forEach((service) => drafts.push(createDraft("translations", `/${language.slug}/${category.slug}/${serviceSlug(service)}`, `${category.name} ${service} in ${language.name}`, `${category.name} for ${service} in ${language.nativeName}`, category.slug, [category.slug, language.slug, serviceSlug(service)], basePath)));
    dataset.personas.forEach((persona) => {
      personaServices(category, persona).forEach((service) => drafts.push(createDraft("translations", `/${language.slug}/${category.slug}/for-${persona.slug}/${serviceSlug(service)}`, `${category.name} ${service} for ${persona.name} in ${language.name}`, `${category.name} for ${persona.name}: ${service} in ${language.nativeName}`, category.slug, [category.slug, language.slug, persona.slug, serviceSlug(service)], basePath)));
    });
    return drafts;
  });
}

export function buildTranslationLocationUrlDrafts(dataset: NormalizedDataset, basePath = ""): UrlDraft[] {
  const category = dataset.categories[0];
  if (!category?.description) return [];

  return dataset.languages.flatMap((language) => {
    if (!language.localizedHeadline || !language.localizedSummary || language.localizedKeywords.length < 1 || language.seoNotes.length < 1 || language.culturalNotes.length < 1) return [];
    return dataset.locations.flatMap((location) =>
      categoryServices(category).map((service) =>
        createDraft("translations", `/${language.slug}/${location.slug}/${category.slug}/${serviceSlug(service)}`, `${category.name} ${service} in ${location.name} ${language.name}`, `${category.name} in ${location.name} for ${service} in ${language.nativeName}`, category.slug, [category.slug, language.slug, location.slug, serviceSlug(service)], basePath),
      ),
    );
  });
}
