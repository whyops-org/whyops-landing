export const runtime = 'edge';
import type { Metadata } from 'next';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { fetchBlogPostsForPage } from '@/lib/api/hashnode';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const POSTS_PER_PAGE = 9;

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, parseInt((params.page as string) || '1', 10));
  const base = `${env.siteUrl}/blog`;
  const canonical = page > 1 ? `${base}?page=${page}` : base;
  const title = page > 1 ? `Blog — Page ${page}` : 'Blog';
  const description = 'Insights on AI agent observability, debugging, and production reliability from the WhyOps team.';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website', url: canonical },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt((params.page as string) || '1', 10));

  const { posts, totalPages } = await fetchBlogPostsForPage(
    env.hashnodeHost,
    page,
    POSTS_PER_PAGE,
  );

  return (
    <main>
      {/* Header section */}
      <div className="box-border caret-transparent w-full border-ds-border dark:border-ds-dark-border border-b border-dashed">
        <div className="max-w-[1400px] mx-auto px-3 md:px-10 border-l border-r border-dashed border-ds-border dark:border-ds-dark-border py-16 md:py-24">
          <span className="text-[11px] font-geist_mono text-brand-primary uppercase tracking-widest">
            WhyOps
          </span>
          <h1 className="mt-3 font-f37stout text-4xl md:text-5xl text-foreground dark:text-ds-dark-textPrimary">
            Blog
          </h1>
          <p className="mt-3 text-base text-ds-textSecondary dark:text-ds-dark-textSecondary max-w-xl">
            Insights on AI agent observability, debugging, and building reliable autonomous systems.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-[1400px] mx-auto px-3 md:px-10 border-l border-r border-dashed border-ds-border dark:border-ds-dark-border py-12">
        <BlogGrid posts={posts} />
        <BlogPagination currentPage={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
