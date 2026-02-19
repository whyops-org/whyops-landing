/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Design system colors
        brand: {
          primary: '#eab308',
          foreground: '#ffffff',
        },
        // Status colors
        status: {
          success: '#22c55e',
          successDark: '#22c55e',
          error: '#ef4444',
          errorDark: '#f87171',
          warning: '#eab308',
          warningDark: '#fbbf24',
          info: '#3b82f6',
          infoDark: '#60a5fa',
        },
        // Semantic colors
        semantic: {
          positive: '#22c55e',
          negative: '#ef4444',
          orange: '#ea580c',
        },
        // Design system lab colors converted to CSS variables
        ds: {
          primary: 'lab(7.78201 -0.0000149012 0)',
          primaryForeground: 'lab(98.26 0 0)',
          background: 'lab(98.84 0.0000298023 -0.0000119209)',
          backgroundSecondary: 'lab(97.68 -0.0000298023 0.0000119209)',
          backgroundTertiary: 'lab(95.36 0 0)',
          backgroundElevated: 'lab(96.52 -0.0000298023 0.0000119209)',
          textPrimary: 'lab(7.78201 -0.0000149012 0)',
          textSecondary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.7)',
          textTertiary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.6)',
          textQuaternary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.5)',
          textMuted: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.4)',
          textDisabled: 'oklab(0.145 -0.00000143796 0.00000340492 / 0.6)',
          textInverse: 'lab(98.26 0 0)',
          textCode: 'lab(48.496 0 0)',
          textMono: 'oklab(0.145 -0.00000143796 0.00000340492 / 0.6)',
          backgroundOverlay: 'oklab(0.969998 -0.00000959635 0.0000227094 / 0.5)',
          text: 'lab(2.75381 0 0)',
          border: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.1)',
          borderSecondary: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.2)',
          borderTertiary: 'lab(90.952 0 -0.0000119209)',
          borderStrong: 'oklab(0.205 -0.00000207871 0.00000478327 / 0.3)',
          success: 'lab(69.2659 -47.9201 46.2781)',
          error: 'lab(55.4814 75.0732 48.8528)',
          warning: 'lab(76.3898 14.5258 98.4589)',
          info: 'lab(70.5521 -66.5147 45.8073)',
          // Dark mode
          dark: {
            background: 'lab(7 0 0)',
            backgroundSecondary: 'lab(10 0 0)',
            backgroundTertiary: 'lab(12 0 0)',
            backgroundElevated: 'lab(15 0 0)',
            textPrimary: 'lab(95 0 0)',
            textSecondary: 'lab(90 0 0)',
            textTertiary: 'oklab(0.7 0 0 / 0.7)',
            border: 'oklab(0.8 0 0 / 0.1)',
           borderSecondary: 'oklab(0.8 0 0 / 0.2)',
            backgroundOverlay: 'oklab(0.1 0 0 / 0.5)',
          },
        },
       },
       boxShadow: {
         'ds-sm': '0px 0px 0px 1px oklab(0.921998 -0.00000908971 0.0000215769 / 0.3)',
         'ds-button': '0px 0px 0px 2px oklab(0.205 -0.00000207871 0.00000478327 / 0.2)',
         'ds-success-indicator': '0px 0px 0px 2px lab(98.84 0.0000298023 -0.0000119209)',
         'ds-lg': '0px 25px 50px -12px rgba(0,0,0,0.25)',
       },
       borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        "geist": ["Inter", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        "geist_mono": ["JetBrains Mono", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        "f37stout": ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
};
