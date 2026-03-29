import { env } from "@/lib/env";
import type { PseoManifestShard, PseoPage } from "@/lib/pseo/types";

type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: number;
};

type SitemapIndexEntry = {
  url: string;
  lastModified?: string;
};

const DEFAULT_LAST_MODIFIED = new Date().toISOString().slice(0, 10);

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildAbsoluteUrl(pathname: string): string {
  return buildAbsoluteUrlForOrigin(pathname, env.siteUrl);
}

export function buildAbsoluteUrlForOrigin(pathname: string, origin: string): string {
  return `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function resolveSitemapOrigin(request: Request): string {
  try {
    return new URL(request.url).origin;
  } catch {
    return env.siteUrl;
  }
}

export function formatSitemapPageNumber(index: number): string {
  return String(index + 1).padStart(3, "0");
}

export function parseSitemapPageNumber(page: string): number | null {
  const normalized = page.replace(/\.xml$/i, "");
  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return parsed - 1;
}

export function buildGlobalUtilitySitemapPath() {
  return "/sitemaps/pseo/global/utility.xml";
}

export function buildCategoryCoreSitemapPath(categorySlug: string) {
  return `/sitemaps/pseo/${categorySlug}/core.xml`;
}

export function buildCategoryLocationsIndexPath(categorySlug: string) {
  return `/sitemaps/pseo/${categorySlug}/locations-sitemap.xml`;
}

export function buildCategoryLocationsPagePath(
  categorySlug: string,
  pageIndex: number,
) {
  return `/sitemaps/pseo/${categorySlug}/locations/${formatSitemapPageNumber(pageIndex)}.xml`;
}

export function buildCategoryTranslationCoreIndexPath(categorySlug: string) {
  return `/sitemaps/pseo/${categorySlug}/languages-sitemap.xml`;
}

export function buildCategoryTranslationCorePagePath(
  categorySlug: string,
  pageIndex: number,
) {
  return `/sitemaps/pseo/${categorySlug}/languages/${formatSitemapPageNumber(pageIndex)}.xml`;
}

export function buildCategoryTranslationLocationIndexPath(categorySlug: string) {
  return `/sitemaps/pseo/${categorySlug}/localized-locations-sitemap.xml`;
}

export function buildCategoryTranslationLocationPagePath(
  categorySlug: string,
  pageIndex: number,
) {
  return `/sitemaps/pseo/${categorySlug}/localized-locations/${formatSitemapPageNumber(pageIndex)}.xml`;
}

export function renderSitemapIndex(entries: SitemapIndexEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <sitemap>
    <loc>${xmlEscape(entry.url)}</loc>
    <lastmod>${entry.lastModified || DEFAULT_LAST_MODIFIED}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;
}

export function renderUrlSet(entries: SitemapEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(entry.url)}</loc>
    <lastmod>${entry.lastModified || DEFAULT_LAST_MODIFIED}</lastmod>
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}
    ${typeof entry.priority === "number" ? `<priority>${entry.priority}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

export function pageToSitemapEntry(page: PseoPage, origin = env.siteUrl): SitemapEntry {
  const pathname = new URL(page.url).pathname;
  return {
    url: buildAbsoluteUrlForOrigin(pathname, origin),
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.7,
  };
}

export function shardSortKey(shard: PseoManifestShard) {
  return [
    shard.kind,
    String(shard.language_offset || 0).padStart(6, "0"),
    String(shard.location_offset || 0).padStart(6, "0"),
    shard.id,
  ].join(":");
}
