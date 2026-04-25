import Link from 'next/link';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

function pageHref(page: number): string {
  return page <= 1 ? '/blog' : `/blog?page=${page}`;
}

function buildPageList(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 pt-6 border-t border-dashed border-ds-border dark:border-ds-dark-border flex flex-wrap items-center justify-between gap-4"
    >
      <div className="min-w-[120px]">
        {currentPage > 1 ? (
          <Link
            href={pageHref(currentPage - 1)}
            className="inline-flex items-center gap-2 text-sm font-geist_mono text-foreground dark:text-ds-dark-textPrimary hover:text-brand-primary transition-colors"
          >
            <span aria-hidden>←</span> Previous
          </Link>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-xs font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary"
            >
              ...
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              className="min-w-9 h-9 inline-flex items-center justify-center border border-dashed border-brand-primary text-brand-primary text-sm font-geist_mono"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={pageHref(page)}
              className="min-w-9 h-9 inline-flex items-center justify-center border border-dashed border-ds-border dark:border-ds-dark-border text-sm font-geist_mono text-foreground dark:text-ds-dark-textPrimary hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              {page}
            </Link>
          ),
        )}
      </div>

      <div className="min-w-[120px] text-right">
        {currentPage < totalPages ? (
          <Link
            href={pageHref(currentPage + 1)}
            className="inline-flex items-center gap-2 text-sm font-geist_mono text-foreground dark:text-ds-dark-textPrimary hover:text-brand-primary transition-colors"
          >
            Next <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
