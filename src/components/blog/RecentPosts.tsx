import Link from 'next/link';
import { fetchBlogPosts } from '@/lib/api/hashnode';
import { env } from '@/lib/env';

interface RecentPostsProps {
  currentSlug: string;
}

export async function RecentPosts({ currentSlug }: RecentPostsProps) {
  try {
    const response = await fetchBlogPosts(env.hashnodeHost, { first: 8 });
    const posts = response.publication.posts.edges
      .map((e) => e.node)
      .filter((p) => p.slug !== currentSlug)
      .slice(0, 4);

    if (!posts.length) return null;

    return (
      <section className="mt-16 pt-8 border-t border-dashed border-ds-border dark:border-ds-dark-border">
        <h2 className="font-f37stout text-lg text-foreground dark:text-ds-dark-textPrimary mb-5">
          More posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col gap-1 p-4 border border-dashed border-ds-border dark:border-ds-dark-border rounded-sm hover:bg-ds-backgroundSecondary dark:hover:bg-ds-dark-backgroundTertiary transition-colors group"
            >
              {post.tags?.[0] && (
                <span className="text-[10px] font-geist_mono text-brand-primary uppercase tracking-widest">
                  {post.tags[0].name}
                </span>
              )}
              <span className="text-sm font-f37stout text-foreground dark:text-ds-dark-textPrimary group-hover:opacity-80 transition-opacity leading-snug">
                {post.title}
              </span>
              <span className="text-[11px] font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary mt-1">
                {post.readTimeInMinutes} min read
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="/blog"
            className="text-sm font-geist_mono text-ds-textSecondary dark:text-ds-dark-textSecondary hover:text-brand-primary transition-colors"
          >
            ← All posts
          </Link>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}
