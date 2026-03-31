
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { RecentPosts } from '@/components/blog/RecentPosts';
import { fetchBlogPostBySlug, fetchBlogPostMetadata } from '@/lib/api/hashnode';
import { env } from '@/lib/env';
import type { BlogPostDetail } from '@/lib/types/blog';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : dateFormatter.format(d);
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetchBlogPostMetadata(env.hashnodeHost, slug);
    const post = response.publication.post;
    if (!post) return { title: 'Post Not Found' };

    const title = post.seo?.title || post.title;
    const description = post.seo?.description || post.brief;
    const image = post.ogMetaData?.image || post.coverImage?.url;
    const canonical = `${env.siteUrl}/blog/${slug}`;
    const keywords = post.tags?.map((t) => t.name);

    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonical,
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        ...(image ? { images: [{ url: image, alt: title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Blog Post' };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post: BlogPostDetail | null = null;
  try {
    const response = await fetchBlogPostBySlug(env.hashnodeHost, slug);
    post = response.publication.post;
    if (!post) notFound();
  } catch {
    notFound();
  }

  if (!post) notFound();

  const date = formatDate(post.publishedAt);

  return (
    <main>
      <div className="max-w-[1400px] mx-auto px-3 md:px-10 border-l border-r border-dashed border-ds-border dark:border-ds-dark-border">

        {/* Back link */}
        <div className="py-6 border-b border-dashed border-ds-border dark:border-ds-dark-border">
          <Link
            href="/blog"
            className="text-xs font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary hover:text-brand-primary transition-colors"
          >
            ← Back to blog
          </Link>
        </div>

        {/* Post content constrained to readable width */}
        <div className="max-w-3xl mx-auto py-12">

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="text-[10px] font-geist_mono font-medium text-brand-primary uppercase tracking-widest border border-dashed border-brand-primary/30 rounded-sm px-2 py-0.5"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-f37stout text-3xl md:text-4xl lg:text-5xl text-foreground dark:text-ds-dark-textPrimary leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-5 text-xs font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary">
            {date && <span>{date}</span>}
            <span aria-hidden>·</span>
            <span>{post.author.name}</span>
            <span aria-hidden>·</span>
            <span>{post.readTimeInMinutes} min read</span>
          </div>

          {/* Cover image */}
          {post.coverImage?.url && (
            <div className="mt-8 relative aspect-video w-full overflow-hidden rounded-sm border border-dashed border-ds-border dark:border-ds-dark-border">
              <Image
                src={post.coverImage.url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-10">
            <BlogPostContent html={post.content.html} />
          </div>

          {/* Recent posts */}
          <RecentPosts currentSlug={slug} />
        </div>
      </div>
    </main>
  );
}
