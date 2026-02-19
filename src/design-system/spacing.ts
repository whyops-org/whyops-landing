export const spacing = {
  section: {
    mobile: {
      py: 'py-20',
      px: 'px-4',
    },
    desktop: {
      py: 'md:py-32',
      px: 'md:px-0',
    },
  },
  
  container: {
    maxWidth: 'max-w-[1400px]',
    screenMaxWidth: 'max-w-screen-2xl',
  },
  
  gap: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
    '2xl': 'gap-16',
  },
} as const;
