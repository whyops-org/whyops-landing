export const borders = {
  width: {
    DEFAULT: 'border',
    none: 'border-0',
    thin: 'border',
    thick: 'border-2',
  },
  
  style: {
    solid: 'border-solid',
    dashed: 'border-dashed',
    none: 'border-none',
  },
  
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
    circle: 'rounded-[3.35544e+07px]',
  },
  
  sides: {
    all: 'border',
    top: 'border-t',
    right: 'border-r',
    bottom: 'border-b',
    left: 'border-l',
    x: 'border-x',
    y: 'border-y',
    topBottom: 'border-t border-b',
    leftRight: 'border-l border-r',
  },
} as const;
