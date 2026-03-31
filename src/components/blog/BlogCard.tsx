import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types/blog';

interface BlogCardProps {
  post: BlogPost;
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

export function BlogCard({ post }: BlogCardProps) {
  const date = formatDate(post.publishedAt);
  const primaryTag = post.tags?.[0]?.name;

  return (
    <article className="group border border-dashed border-ds-border dark:border-ds-dark-border rounded-sm bg-ds-background dark:bg-ds-dark-backgroundSecondary hover:bg-ds-backgroundSecondary dark:hover:bg-ds-dark-backgroundTertiary transition-colors">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-dashed border-ds-border dark:border-ds-dark-border">
          {post.coverImage?.url ? (
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-ds-backgroundTertiary dark:bg-ds-dark-backgroundTertiary flex items-center justify-center">
              <span className="font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary text-2xl select-none">
                WO
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tag */}
          {primaryTag && (
            <span className="text-[11px] font-geist_mono font-medium text-brand-primary uppercase tracking-widest">
              {primaryTag}
            </span>
          )}

          {/* Title */}
          <h2 className="font-f37stout text-lg leading-snug text-foreground dark:text-ds-dark-textPrimary group-hover:opacity-80 transition-opacity">
            {post.title}
          </h2>

          {/* Brief */}
          <p className="text-sm leading-relaxed text-ds-textSecondary dark:text-ds-dark-textSecondary line-clamp-3 flex-1">
            {post.brief}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 text-[11px] font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary pt-1 border-t border-dashed border-ds-border dark:border-ds-dark-border mt-auto">
            {date && <span>{date}</span>}
            <span aria-hidden>·</span>
            <span>{post.readTimeInMinutes} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
