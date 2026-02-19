import { typography, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const FooterCopyright = () => {
  return (
    <div className="box-border caret-transparent gap-x-4 flex flex-col gap-y-4">
      <p className={`${commonClasses.muted} text-sm box-border caret-transparent leading-5 text-center px-6 md:text-left md:px-0`}>
        {content.site.copyright}
      </p>
      <div className="items-center box-border caret-transparent flex mt-4 px-6 md:mt-0 md:px-0">
        {content.footer.legal.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className={`${commonClasses.muted} text-sm box-border caret-transparent block leading-5 ${index < content.footer.legal.length - 1 ? 'mr-6' : ''} font-${typography.fontFamily.mono} ${animations.transitions.opacity} ${animations.hover.opacity}`}
          >
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
};
