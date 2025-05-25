
import type { Config } from "tailwindcss";

export default {
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
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // UTI Games Premium Brand Colors
        'uti-red': {
          DEFAULT: '#E63946',
          50: '#FDF2F3',
          100: '#FCE7E8',
          500: '#E63946',
          600: '#D32A38',
          700: '#B91C2A',
          800: '#9A101C',
          900: '#7A0D16',
        },
        'uti-blue': {
          DEFAULT: '#1D3557',
          50: '#F1F3F7',
          100: '#E3E8EF',
          500: '#1D3557',
          600: '#1A2E4A',
          700: '#16263D',
          800: '#131F30',
          900: '#0F1723',
        },
        'uti-black': {
          DEFAULT: '#121212',
          50: '#F5F5F5',
          100: '#E9E9E9',
          500: '#121212',
          600: '#0F0F0F',
          700: '#0C0C0C',
          800: '#080808',
          900: '#050505',
        },
        // Platform Colors
        'playstation': {
          DEFAULT: '#0070CC',
          light: '#E6F3FF',
          dark: '#003791',
        },
        'xbox': {
          DEFAULT: '#107C10',
          light: '#E8F5E8',
          dark: '#0E5E0E',
        },
        'nintendo': {
          DEFAULT: '#E60012',
          light: '#FFEBEB',
          dark: '#AC000E',
        },
        'pc-gaming': {
          DEFAULT: '#00ADEF',
          light: '#E5F8FF',
          dark: '#0088BF',
        },
        'accessories': {
          DEFAULT: '#8338EC',
          light: '#F4EBFF',
          dark: '#6B2FBD',
        },
        // State Colors
        'success': '#28A745',
        'warning': '#FFC107',
        'error': '#DC3545',
        'info': '#17A2B8',
        // Neutral System
        'gray-system': {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#1A1D20',
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'hero': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'hero-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'hero-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'display': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'display-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h1': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h1-md': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h1-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h2': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h2-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h2-lg': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h3': ['1.125rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h3-md': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h3-lg': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h4': ['1rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h4-md': ['1.125rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h4-lg': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'body': ['0.875rem', { lineHeight: '1.5' }],
        'body-md': ['0.9375rem', { lineHeight: '1.5' }],
        'body-lg': ['1rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'premium': '12px',
        'button': '6px',
        'card': '12px',
        'pill': '100px',
      },
      boxShadow: {
        'level-1': '0px 2px 8px rgba(0,0,0,0.08)',
        'level-2': '0px 4px 12px rgba(0,0,0,0.12)',
        'level-3': '0px 8px 24px rgba(0,0,0,0.16)',
        'level-4': '0px 12px 32px rgba(0,0,0,0.2)',
        'inset-soft': 'inset 0px 2px 4px rgba(0,0,0,0.05)',
        'glow-sm': '0px 0px 8px rgba(255,255,255,0.2)',
        'glow-primary': '0px 4px 20px rgba(230, 57, 70, 0.3)',
        'text-shadow': '0px 1px 2px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0px 4px 20px rgba(230, 57, 70, 0.3)' },
          '50%': { boxShadow: '0px 4px 30px rgba(230, 57, 70, 0.5)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
