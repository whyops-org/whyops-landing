import type { BlogPost } from '@/lib/types/blog';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (!posts.length) {
    return (
      <div className="py-20 text-center border border-dashed border-ds-border dark:border-ds-dark-border rounded-sm">
        <p className="font-f37stout text-xl text-foreground dark:text-ds-dark-textPrimary">
          No posts yet
        </p>
        <p className="mt-2 text-sm text-ds-textSecondary dark:text-ds-dark-textSecondary">
          Check back soon for new writing.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
