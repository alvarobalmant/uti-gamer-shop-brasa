import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))", // Use neutral border color
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))", // Often primary color for focus rings
        background: "hsl(var(--background))", // Main background (e.g., white or light gray)
        foreground: "hsl(var(--foreground))", // Main text color (e.g., dark gray or black)
        primary: {
          DEFAULT: "hsl(var(--primary))", // UTI Red
          foreground: "hsl(var(--primary-foreground))", // Text on primary (e.g., white)
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Secondary background/elements (e.g., light gray)
          foreground: "hsl(var(--secondary-foreground))", // Text on secondary
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Destructive actions (e.g., darker red)
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Muted backgrounds/elements (e.g., lighter gray)
          foreground: "hsl(var(--muted-foreground))", // Muted text
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Accent color (can be UTI Red or another)
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Card background (often white or light gray)
          foreground: "hsl(var(--card-foreground))", // Text within cards
        },
        // Specific UTI Palette
        uti: {
          red: "hsl(var(--uti-red))", // e.g., 0 86% 55%
          pro: "hsl(var(--uti-pro))", // e.g., 260 80% 60% (Violet/Purple)
          dark: "hsl(var(--uti-dark))", // e.g., 240 10% 3.9%
          gray: {
            light: "hsl(var(--uti-gray-light))", // e.g., 210 40% 96.1%
            medium: "hsl(var(--uti-gray-medium))", // e.g., 215.4 16.3% 46.9%
            dark: "hsl(var(--uti-gray-dark))", // e.g., 215 20.2% 65.1% (border)
          },
          white: "hsl(var(--uti-white))", // e.g., 0 0% 100%
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["var(--font-inter)", "Inter", "sans-serif"], // Keep consistent
      },
      fontSize: {
        // Refined scale from plan
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      borderRadius: {
        // Refined scale from plan
        none: "0px",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        // Refined scale from plan
        section: "5rem",
        "section-lg": "7.5rem",
      },
      boxShadow: {
        // Refined shadows from plan
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        md: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        lg: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        xl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Added animations from plan
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
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
        // Added keyframes from plan
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

