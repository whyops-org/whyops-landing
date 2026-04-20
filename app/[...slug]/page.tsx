
import { JsonLd } from "@/components/JsonLd";
import { PseoArticle } from "@/components/pseo/PseoArticle";
import { PseoLayout } from "@/components/pseo/PseoLayout";
import { brand, env } from "@/lib/env";
import { resolveSitePseoPageByPath } from "@/lib/pseo/site";
import type { PseoPage } from "@/lib/pseo/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

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

function humanizeSegment(segment: string): string {
  return segment
    .replace(/^for-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildPageBreadcrumbs(page: PseoPage): BreadcrumbItem[] {
  const pathname = new URL(page.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  for (let index = 0; index < segments.length - 1; index += 1) {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    breadcrumbs.push({
      label: humanizeSegment(segments[index]),
      href,
    });
  }

  breadcrumbs.push({
    label: page.content.h1,
  });

  return breadcrumbs;
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

const getResolvedPseoPage = cache((pathname: string) =>
  resolveSitePseoPageByPath(pathname),
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const page = await getResolvedPseoPage(pathname);

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
  const page = await getResolvedPseoPage(pathname);

  if (!page) {
    notFound();
  }

  const breadcrumbs = buildPageBreadcrumbs(page);

  return (
    <PseoLayout>
      <JsonLd data={buildPseoGraph(page, breadcrumbs)} />
      <PseoArticle page={page} breadcrumbs={breadcrumbs} />
    </PseoLayout>
  );
}
