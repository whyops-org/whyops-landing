export const animations = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 0.8,
  },
  
  easing: {
    smooth: [0.22, 1, 0.36, 1],
    spring: { type: 'spring', damping: 30, stiffness: 300 },
  },
  
  transitions: {
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    transform: 'transition-transform',
    shadow: 'transition-shadow',
  },
  
  hover: {
    opacity: 'hover:opacity-70',
    opacityHigh: 'hover:opacity-90',
    scale: 'hover:scale-110',
    scaleDown: 'hover:scale-95',
    bg: 'hover:bg-ds-background-tertiary',
    bgDark: 'dark:hover:bg-ds-dark-backgroundTertiary',
  },
  
  active: {
    scale: 'active:scale-95',
  },
} as const;
