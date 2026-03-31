import Link from 'next/link';
import { Navbar } from '@/sections/Navbar';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background dark:bg-ds-dark-background">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
      <footer className="border-t border-dashed border-ds-border dark:border-ds-dark-border mt-16">
        <div className="max-w-[1400px] mx-auto px-3 md:px-10 border-l border-r border-dashed border-ds-border dark:border-ds-dark-border py-6 flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary hover:text-brand-primary transition-colors"
          >
            Home
          </Link>
          <span className="text-ds-textTertiary dark:text-ds-dark-textSecondary" aria-hidden>·</span>
          <Link
            href="/blog"
            className="text-xs font-geist_mono text-ds-textTertiary dark:text-ds-dark-textSecondary hover:text-brand-primary transition-colors"
          >
            Blog
          </Link>
        </div>
      </footer>
    </div>
  );
}
