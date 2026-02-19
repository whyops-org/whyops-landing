import { colors, typography, commonClasses } from '@/design-system';

export const NavbarLogo = () => {
  return (
    <div className="box-border caret-transparent w-60">
      <a href="/" className="items-center box-border caret-transparent flex">
        <span className={`text-[${colors.primary.DEFAULT}] dark:text-[${colors.dark.text.primary}] text-2xl items-center box-border caret-transparent gap-x-2 flex gap-y-1 font-${typography.fontFamily.display}`}>
          WhyOps
        </span>
      </a>
    </div>
  );
};
