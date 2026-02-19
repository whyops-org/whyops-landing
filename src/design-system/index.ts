export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { borders } from './borders';
export { animations } from './animations';
export { shadows } from './shadows';

// Utility function to get color with dark mode support
export const getColor = (lightColor: string, darkColor: string) => {
  return `${lightColor} dark:${darkColor}`;
};

// Common class combinations
export const commonClasses = {
  // Container
  container: 'max-w-[1400px] mx-auto border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] border-l border-r border-dashed',
  
  // Section
  section: 'box-border caret-transparent w-full border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] border-t border-dashed',
  
  // Card
  card: 'bg-[lab(98.84_0.0000298023_-0.0000119209)] dark:bg-[lab(12_0_0)] border border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.2)] border-dashed rounded-sm',
  
  // Button primary
  buttonPrimary: 'text-[lab(98.26_0_0)] font-medium items-center bg-[lab(7.78201_-0.0000149012_0)] dark:bg-[lab(95_0_0)] dark:text-[lab(7_0_0)] box-border caret-transparent gap-x-2 flex shrink-0 h-12 justify-center gap-y-2 text-nowrap w-auto border px-6 py-2 rounded-sm border-solid border-transparent transition-all hover:opacity-90 active:scale-95',
  
  // Button secondary
  buttonSecondary: 'font-medium items-center box-border caret-transparent gap-x-2 flex shrink-0 h-12 justify-center gap-y-2 text-nowrap border px-4 py-2 rounded-sm border-solid border-transparent transition-opacity hover:opacity-70 dark:text-[lab(90_0_0)]',
  
  // Input
  input: 'text-sm font-medium items-center bg-[lab(98.84_0.0000298023_-0.0000119209)] dark:bg-[lab(15_0_0)] dark:text-[lab(95_0_0)] box-border caret-transparent h-12 px-4 py-2 rounded-sm border border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.2)] focus:outline-none focus:ring-2 focus:ring-[lab(7.78201_-0.0000149012_0)]',
  
  // Text heading
  heading: 'dark:text-[lab(95_0_0)] font-f37stout',
  
  // Text body
  body: 'text-[oklab(0.205_-0.00000207871_0.00000478327_/_0.7)] dark:text-[oklab(0.7_0_0_/_0.7)]',
  
  // Text muted
  muted: 'text-[oklab(0.205_-0.00000207871_0.00000478327_/_0.6)] dark:text-[oklab(0.6_0_0_/_0.7)]',
} as const;
