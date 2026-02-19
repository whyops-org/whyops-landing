import { typography, animations, commonClasses } from '@/design-system';

export type FooterLinksProps = {
  title: string;
  links: Array<{
    href: string;
    text: string;
    external?: boolean;
  }>;
};

export const FooterLinks = (props: FooterLinksProps) => {
  return (
    <div className="box-border caret-transparent">
      <h3 className={`text-sm font-semibold box-border caret-transparent leading-5 mb-4 font-${typography.fontFamily.mono} ${commonClasses.heading}`}>
        {props.title}
      </h3>
      <ul className="box-border caret-transparent list-none pl-0">
        {props.links.map((link, index) => (
          <li
            key={index}
            className={`box-border caret-transparent ${index < props.links.length - 1 ? "mb-2" : ""}`}
          >
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className={`${commonClasses.muted} text-sm box-border caret-transparent leading-5 ${animations.transitions.opacity} ${animations.hover.opacity}`}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
