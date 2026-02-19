import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { colors, borders, animations } from '@/design-system';
import { FooterCopyright } from "@/sections/Footer/components/FooterCopyright";

export const FooterBottom = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`items-center box-border caret-transparent gap-x-6 flex flex-col justify-between max-w-[1400px] gap-y-6 w-full border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.DEFAULT}] mx-auto pt-4 pb-20 px-4 ${borders.sides.leftRight} ${borders.style.dashed} md:items-start md:gap-x-0 md:flex-row md:gap-y-0`}>
      <FooterCopyright />
      <button
        type="button"
        onClick={toggleTheme}
        className={`text-sm font-medium items-center bg-[${colors.background.DEFAULT}] dark:bg-[${colors.dark.background.elevated}] caret-transparent gap-x-2 flex shrink-0 h-9 justify-center leading-5 gap-y-2 text-center text-nowrap w-9 border border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}] p-0 ${borders.radius.sm} ${borders.style.solid} ${animations.transitions.all} hover:bg-[${colors.background.tertiary}] dark:hover:bg-[${colors.dark.background.hover}]`}
      >
        {theme === 'dark' ? (
          <Sun className={`h-4 w-4 text-[${colors.dark.text.code}] ${animations.transitions.transform} hover:rotate-12`} />
        ) : (
          <Moon className={`h-4 w-4 text-[${colors.text.tertiary}] ${animations.transitions.transform} hover:-rotate-12`} />
        )}
        <span className="absolute box-border caret-transparent block h-px text-nowrap w-px overflow-hidden -m-px">
          Toggle theme
        </span>
      </button>
    </div>
  );
};
