import { colors, typography, animations } from '@/design-system';
import { content } from '@/design-system/content';

export const DesktopNavLinks = () => {
  return (
    <div className="items-center box-border caret-transparent hidden min-h-0 min-w-0 md:flex md:min-h-[auto] md:min-w-[auto]">
      {content.navigation.links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`text-sm font-medium items-center box-border caret-transparent gap-x-1 flex leading-5 min-h-0 min-w-0 gap-y-1 mr-4 md:min-h-[auto] md:min-w-[auto] ${animations.transitions.opacity} ${animations.hover.opacity} text-[${colors.text.primary}] dark:text-[${colors.dark.text.secondary}]`}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};
