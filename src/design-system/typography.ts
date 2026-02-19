export const typography = {
  fontFamily: {
    sans: 'Geist',
    mono: 'Geist Mono',
    display: 'F37Stout',
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    hero: '2.625rem',   // 42px
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
    xs: '1rem',         // 16px
    sm: '1.25rem',      // 20px
    base: '1.5rem',     // 24px
    lg: '1.75rem',      // 28px
    xl: '2.5rem',       // 40px
    '2xl': '3.28125rem', // 52.5px
    '3xl': '4.5rem',    // 72px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    mono: '-1px',
  },
} as const;
