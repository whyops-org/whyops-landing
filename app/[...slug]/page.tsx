import { JsonLd } from "@/components/JsonLd";
import { PseoArticle } from "@/components/pseo/PseoArticle";
import { PseoLayout } from "@/components/pseo/PseoLayout";
import { brand, env } from "@/lib/env";
import { resolveSitePseoPageByPath } from "@/lib/pseo/site";
import type { PseoPage } from "@/lib/pseo/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 43200;

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

async function filterResolvableLinks<T extends { url: string }>(items: T[]): Promise<T[]> {
  const checks = await Promise.all(
    items.map(async (item) => {
      const pathname = new URL(item.url).pathname;
      const resolved = await resolveSitePseoPageByPath(pathname);
      return resolved ? item : null;
    }),
  );

  return checks.reduce<T[]>((accumulator, item) => {
    if (item) {
      accumulator.push(item);
    }

    return accumulator;
  }, []);
}

async function buildPageBreadcrumbs(page: PseoPage): Promise<BreadcrumbItem[]> {
  const pathname = new URL(page.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  for (let index = 0; index < segments.length - 1; index += 1) {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const resolved = await resolveSitePseoPageByPath(href);

    if (!resolved || resolved.url === page.url) {
      continue;
    }

    breadcrumbs.push({
      label: resolved.content.h1,
      href,
    });
  }

  breadcrumbs.push({
    label: page.content.h1,
  });

  return breadcrumbs;
}

async function buildRenderablePage(page: PseoPage): Promise<PseoPage> {
  const [internalLinks, relatedPages] = await Promise.all([
    filterResolvableLinks(page.internal_links),
    filterResolvableLinks(page.related_pages),
  ]);

  return {
    ...page,
    internal_links: internalLinks,
    related_pages: relatedPages,
  };
}

function buildBreadcrumbList(page: PseoPage, breadcrumbs: BreadcrumbItem[]) {
  return breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.href ? new URL(item.href, env.siteUrl).toString() : page.url,
  }));
}

function buildPseoGraph(page: PseoPage, breadcrumbs: BreadcrumbItem[]) {
  const { "@context": _ignoredContext, ...mainEntity } = page.schema
    .structured_data as Record<string, unknown>;
  void _ignoredContext;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.content.h1,
        description: page.seo.meta_description,
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${env.siteUrl}#website`,
          name: brand.name,
          url: env.siteUrl,
        },
        about: {
          "@id": `${page.url}#main-entity`,
        },
      },
      {
        ...mainEntity,
        "@id": `${page.url}#main-entity`,
        url: page.url,
        name:
          typeof mainEntity.name === "string"
            ? mainEntity.name
            : page.content.h1,
      },
      {
        "@type": "FAQPage",
        "@id": `${page.url}#faq`,
        mainEntity: page.content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page.url}#breadcrumbs`,
        itemListElement: buildBreadcrumbList(page, breadcrumbs),
      },
    ],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const page = await resolveSitePseoPageByPath(pathname);

  if (!page) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: page.seo.title,
    description: page.seo.meta_description,
    keywords: [page.seo.primary_keyword, ...page.seo.secondary_keywords],
    alternates: {
      canonical: page.url,
    },
    openGraph: {
      type: "article",
      url: page.url,
      title: page.seo.title,
      description: page.seo.meta_description,
      siteName: brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.meta_description,
    },
  };
}

export default async function PseoCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const page = await resolveSitePseoPageByPath(pathname);

  if (!page) {
    notFound();
  }

  const [breadcrumbs, renderablePage] = await Promise.all([
    buildPageBreadcrumbs(page),
    buildRenderablePage(page),
  ]);

  return (
    <PseoLayout>
      <JsonLd data={buildPseoGraph(page, breadcrumbs)} />
      <PseoArticle page={renderablePage} breadcrumbs={breadcrumbs} />
    </PseoLayout>
  );
}
