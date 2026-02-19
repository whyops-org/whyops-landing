export const colors = {
  // Primary colors
  primary: {
    DEFAULT: 'lab(7.78201 -0.0000149012 0)',
    foreground: 'lab(98.26 0 0)',
  },
  
  // Background colors
  background: {
    DEFAULT: 'lab(98.84 0.0000298023 -0.0000119209)',
    secondary: 'lab(97.68 -0.0000298023 0.0000119209)',
    tertiary: 'lab(95.36 0 0)',
    elevated: 'lab(96.52 -0.0000298023 0.0000119209)',
    overlay: 'oklab(0.989998 -0.00000971556 0.0000231266 / 0.5)',
  },
  
  // Text colors
  text: {
    primary: 'lab(7.78201 -0.0000149012 0)',
    secondary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.7)',
    tertiary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.6)',
    quaternary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.5)',
    muted: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.4)',
    disabled: 'oklab(0.145 -0.00000143796 0.00000340492 / 0.6)',
    inverse: 'lab(98.26 0 0)',
    mono: 'oklab(0.145 -0.00000143796 0.00000340492 / 0.6)',
    code: 'lab(48.496 0 0)',
  },
  
  // Border colors
  border: {
    DEFAULT: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.1)',
    secondary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.2)',
    tertiary: 'lab(90.952 0 -0.0000119209)',
    strong: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.3)',
  },
  
  // Status colors
  status: {
    success: 'lab(69.2659 -47.9201 46.2781)',
    error: 'lab(55.4814 75.0732 48.8528)',
    warning: 'lab(76.3898 14.5258 98.4589)',
    info: 'lab(70.5521 -66.5147 45.8073)',
  },
  
  // Semantic colors
  semantic: {
    positive: 'lab(55.0481 -49.9246 15.93)',
    negative: 'lab(55.4814 75.0732 48.8528)',
    orange: 'rgb(234, 88, 12)',
    orangeText: 'lab(55.0481 -49.9246 15.93)',
  },
  
  // Avatar/Badge colors
  avatar: {
    purple: 'oklab(0.608388 0.155916 0.122386 / 0.2)',
    pink: 'oklab(0.951341 -0.0447635 0.143715 / 0.2)',
    yellow: 'oklab(0.81222 0.140873 -0.0622125 / 0.2)',
  },
  
  // Special colors
  special: {
    black: 'lab(2.75381 0 0)',
    white: 'lab(98.84 0.0000298023 -0.0000119209)',
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
  
  // Dark mode colors
  dark: {
    background: {
      DEFAULT: 'lab(7 0 0)',
      secondary: 'lab(10 0 0)',
      tertiary: 'lab(12 0 0)',
      elevated: 'lab(15 0 0)',
      hover: 'lab(20 0 0)',
      overlay: 'oklab(0.1 0 0 / 0.5)',
    },
    text: {
      primary: 'lab(95 0 0)',
      secondary: 'lab(90 0 0)',
      tertiary: 'oklab(0.7 0 0 / 0.7)',
      quaternary: 'oklab(0.6 0 0 / 0.7)',
      muted: 'oklab(0.6 0 0 / 0.6)',
      code: 'oklab(0.8 0 0)',
    },
    border: {
      DEFAULT: 'oklab(0.8 0 0 / 0.1)',
      secondary: 'oklab(0.8 0 0 / 0.2)',
      tertiary: 'oklab(0.8 0 0 / 0.3)',
    },
  },
} as const;
