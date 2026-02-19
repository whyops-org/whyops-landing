import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-ds-textPrimary dark:text-ds-dark-text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-ds-textSecondary dark:text-ds-dark-text-secondary mb-4">
        Page Not Found
      </h2>
      <p className="text-ds-textTertiary dark:text-ds-dark-text-tertiary mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/"
        className="text-primary dark:text-ds-dark-text-primary font-medium px-6 py-3 rounded-sm border border-ds-border dark:border-ds-dark-border hover:bg-ds-backgroundTertiary dark:hover:bg-ds-dark-backgroundTertiary transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
