import { animations } from '@/design-system';

type DesktopNavLinksProps = {
  links: ReadonlyArray<{
    href: string;
    text: string;
  }>;
};

export const DesktopNavLinks = ({ links }: DesktopNavLinksProps) => {
  return (
    <div className="items-center box-border caret-transparent hidden min-h-0 min-w-0 md:flex md:min-h-[auto] md:min-w-[auto]">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`text-sm font-medium items-center box-border caret-transparent gap-x-1 flex leading-5 min-h-0 min-w-0 gap-y-1 mr-4 md:min-h-[auto] md:min-w-[auto] ${animations.transitions.opacity} ${animations.hover.opacity} text-ds-textPrimary dark:text-ds-dark-textSecondary`}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};
