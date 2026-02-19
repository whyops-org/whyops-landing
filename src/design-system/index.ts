export { animations } from './animations';
export { borders } from './borders';
export { colors } from './colors';
export { shadows } from './shadows';
export { spacing } from './spacing';
export { typography } from './typography';

// Utility function to get color with dark mode support
export const getColor = (lightColor: string, darkColor: string) => {
  return `${lightColor} dark:${darkColor}`;
};

// Common class combinations - updated to use Tailwind design system
export const commonClasses = {
  // Container
  container: 'max-w-[1400px] mx-auto px-3 md:px-10 border-ds-border dark:border-ds-dark-border border-l border-r border-dashed',

  // Section
  section: 'box-border caret-transparent w-full border-ds-border dark:border-ds-dark-border border-t border-dashed',

  // Card
  card: 'bg-ds-background dark:bg-ds-dark-backgroundTertiary border ds-border dark:ds-dark-borderSecondary border-dashed rounded-sm',

  // Button primary
  buttonPrimary: 'text-primary-foreground font-medium items-center bg-primary dark:bg-ds-dark-text-primary dark:text-ds-dark-background box-border caret-transparent gap-x-2 flex shrink-0 h-12 justify-center gap-y-2 text-nowrap w-auto border px-6 py-2 rounded-sm border-solid border-transparent transition-all hover:opacity-90 active:scale-95',

  // Button secondary
  buttonSecondary: 'font-medium items-center box-border caret-transparent gap-x-2 flex shrink-0 h-12 justify-center gap-y-2 text-nowrap border px-4 py-2 rounded-sm border-solid border-transparent transition-opacity hover:opacity-70 dark:text-ds-dark-textSecondary',

  // Input
  input: 'text-sm font-medium items-center bg-ds-background dark:bg-ds-dark-backgroundElevated dark:text-ds-dark-textPrimary box-border caret-transparent h-12 px-4 py-2 rounded-sm border border-ds-border dark:border-ds-dark-borderSecondary focus:outline-none focus:ring-2 focus:ring-primary',

  // Text heading
  heading: 'dark:text-ds-dark-text-primary font-f37stout',

  // Text body
  body: 'text-ds-textSecondary dark:text-ds-dark-textTertiary',

  // Text muted
  muted: 'text-ds-textTertiary dark:text-ds-dark-textTertiary',
} as const;
