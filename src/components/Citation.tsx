type CitationProps = {
  href: string;
  label: string;
  className?: string;
};

export const Citation = ({ href, label, className = '' }: CitationProps) => {
  return (
    <cite className={`not-italic text-xs text-ds-textTertiary dark:text-ds-dark-textTertiary ${className}`.trim()}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-ds-borderStrong underline-offset-4 transition-opacity hover:opacity-70"
      >
        {label}
      </a>
    </cite>
  );
};
