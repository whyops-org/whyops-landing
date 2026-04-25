import { whyopsPseoCatalog } from "@/lib/pseo/catalog";
import { slugify } from "@/lib/pseo/normalize";
import type { CategoryInput, ToolInput } from "@/lib/pseo/types";
import type { BlogPost } from "@/lib/types/blog";
import { curatedPriorityPages, type PriorityPage } from "@/lib/seo/priority-pages";

const MAX_SUBMITTED_PAGES = 200;
const MAX_COMPARE_PAGES_PER_CATEGORY = 3;
const MAX_BLOG_PAGES = 24;

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
    if (seen.has(page.href)) return false;
    seen.add(page.href);
    return true;
  });
}

function buildComparePages(category: CategoryInput, tools: ToolInput[]): PriorityPage[] {
  const topTools = tools
    .filter((tool) => slugify(tool.category || "") === slugify(category.slug || category.name))
    .sort((left, right) => toolScore(right) - toolScore(left))
    .slice(0, 3);

  const pages: PriorityPage[] = [];
  for (let index = 0; index < topTools.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < topTools.length; compareIndex += 1) {
      pages.push({
        href: `/compare/${slugify(topTools[index].slug || topTools[index].name)}-vs-${slugify(
          topTools[compareIndex].slug || topTools[compareIndex].name,
        )}`,
        label: `${topTools[index].name} vs ${topTools[compareIndex].name}`,
        priority: 0.74,
        changeFrequency: "weekly",
      });
    }
  }

  return pages.slice(0, MAX_COMPARE_PAGES_PER_CATEGORY);
}

function buildCategoryPages(category: CategoryInput, tools: ToolInput[]): PriorityPage[] {
  const categorySlug = slugify(category.slug || category.name);
  const useCases = category.useCases || [];
  const glossaryTerms = category.glossaryTerms || [];

  return [
    ...useCases.flatMap((useCase) => {
      const serviceSlug = slugify(useCase);
      return [
        {
          href: `/${categorySlug}/${serviceSlug}`,
          label: `${category.name} for ${useCase}`,
          priority: 0.76,
          changeFrequency: "weekly" as const,
        },
        {
          href: `/best/${categorySlug}-tools/for-${serviceSlug}`,
          label: `Best ${category.name} Tools for ${useCase}`,
          priority: 0.72,
          changeFrequency: "weekly" as const,
        },
        {
          href: `/examples/${categorySlug}/${serviceSlug}`,
          label: `${category.name} Examples for ${useCase}`,
          priority: 0.68,
          changeFrequency: "weekly" as const,
        },
      ];
    }),
    ...glossaryTerms.map((term) => ({
      href: `/glossary/${slugify(term)}`,
      label: term,
      priority: 0.64,
      changeFrequency: "weekly" as const,
    })),
    ...buildComparePages(category, tools),
  ];
}

function buildBlogPages(posts: BlogPost[]): PriorityPage[] {
  return posts.slice(0, MAX_BLOG_PAGES).map((post) => ({
    href: `/blog/${post.slug}`,
    label: post.title,
    priority: 0.62,
    changeFrequency: "monthly",
  }));
}

export function buildSubmittedPages(posts: BlogPost[] = []): PriorityPage[] {
  const categories = (whyopsPseoCatalog.categories || []).filter(isCategory);
  const tools = (whyopsPseoCatalog.tools || []).filter(isTool);

  const pages = dedupePages([
    ...curatedPriorityPages,
    ...categories.flatMap((category) => buildCategoryPages(category, tools)),
    ...buildBlogPages(posts),
  ]);

  return pages
    .sort((left, right) => right.priority - left.priority || left.href.localeCompare(right.href))
    .slice(0, MAX_SUBMITTED_PAGES);
}
