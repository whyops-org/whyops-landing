import Link from 'next/link';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

function pageHref(page: number): string {
  return page <= 1 ? '/blog' : `/blog?page=${page}`;
}

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 pt-6 border-t border-dashed border-ds-border dark:border-ds-dark-border flex items-center justify-between">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="flex items-center gap-2 text-sm font-geist_mono text-foreground dark:text-ds-dark-textPrimary hover:text-brand-primary transition-colors"
        >
          <span aria-hidden>←</span> Newer posts
        </Link>
      ) : (
        <span />
      )}

      <span className="text-xs font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="flex items-center gap-2 text-sm font-geist_mono text-foreground dark:text-ds-dark-textPrimary hover:text-brand-primary transition-colors"
        >
          Older posts <span aria-hidden>→</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
